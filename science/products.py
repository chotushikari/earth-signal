"""Product-specific screening for published NISAR raster measurements."""

import os
import re
import time

import h5py
import numpy as np
import requests

from science.gcov import (
    WINDOW, ProcessingError, RangeFile, area_mask, grid_window, image, lookup,
    matched_grid, pixel_values, record_source, requested_area,
)


def threshold(payload):
    try:
        value = float(payload.get("minQuality", 0.3))
    except (TypeError, ValueError):
        raise ProcessingError("Quality threshold must be a number between 0 and 1.", 400) from None
    if not 0 <= value <= 1:
        raise ProcessingError("Quality threshold must be between 0 and 1.", 400)
    return value


def open_window(file, product, lat, lon, minimum, source, record):
    root = file[f"/science/LSAR/{product}/grids"]
    if product == "SME2":
        bounds, geometry = grid_window(root, lat, lon)
        values = root["soilMoisture"][bounds]
        flags = root["retrievalQualityFlag"][bounds]
        valid = (flags >= 0) & ((flags & 1) == 0) & (values >= 0) & (values <= 1)
        return (
            np.where(valid, values, np.nan),
            record_source(record, root["soilMoisture"].name, geometry, source),
            {},
        )

    parent = root["frequencyA/unwrappedInterferogram" if product == "GUNW" else "frequencyA/pixelOffsets"]
    key = next((pol for pol in ("HH", "VV", "HV", "VH") if pol in parent), None)
    if key is None:
        raise ProcessingError("No supported frequency A polarization is available.")
    grid = parent[key]
    if product == "GOFF":
        grid = grid["layer1"]
    bounds, geometry = grid_window(grid, lat, lon)
    source_mask = parent["mask"][bounds]
    # The packed mission mask includes more information than the outside-extent
    # flag. Exclusion below is a coverage check, not a full interpretation of it.
    inside = source_mask != parent["mask"].attrs.get("_FillValue", 255)
    if product == "GUNW":
        phase = grid["unwrappedPhase"][bounds]
        coherence = grid["coherenceMagnitude"][bounds]
        components = grid["connectedComponents"][bounds]
        fill = grid["connectedComponents"].attrs.get("_FillValue", 65535)
        valid = inside & np.isfinite(phase) & (coherence >= minimum) & (coherence <= 1)
        valid &= (components > 0) & (components != fill)
        return (
            np.where(valid, coherence, np.nan),
            {**record_source(record, grid["coherenceMagnitude"].name, geometry, source), "channel": key},
            {},
        )

    along = grid["alongTrackOffset"][bounds]
    slant = grid["slantRangeOffset"][bounds]
    correlation = grid["correlationSurfacePeak"][bounds]
    valid = inside & np.isfinite(along) & np.isfinite(slant) & (correlation >= minimum) & (correlation <= 1)
    return (
        np.where(valid, along, np.nan),
        {**record_source(record, grid["alongTrackOffset"].name, geometry, source), "channel": key},
        {"Slant-range offset (m)": slant, "Correlation peak": correlation},
    )


def process_product(payload, product):
    ids = payload["granules"]
    level = "L3" if product == "SME2" else "L2"
    limit = 2 if product == "SME2" else 1
    if not 1 <= len(ids) <= limit or not all(
        isinstance(value, str) and re.fullmatch(fr"NISAR_{level}_[A-Z]{{2}}_{product}_[A-Z0-9_]{{10,220}}", value)
        for value in ids
    ) or len(set(ids)) != len(ids):
        raise ProcessingError(f"Select {'one or two distinct' if limit == 2 else 'one'} {product} source record(s).", 400)
    token = os.environ.get("EARTHDATA_TOKEN", "").strip()
    if not token:
        raise ProcessingError("Earthdata access is not configured on the server.", 503)
    try:
        lat, lon = float(payload["lat"]), float(payload["lon"])
    except (KeyError, ValueError, TypeError):
        raise ProcessingError("Choose the investigation point in Explore first.", 400) from None
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        raise ProcessingError("Coordinates are outside geographic bounds.", 400)

    bounds = requested_area(payload, lat, lon)
    minimum = threshold(payload) if product != "SME2" else None
    records = sorted([lookup(granule, product) for granule in ids], key=lambda r: r["startTime"])
    if len(records) == 2:
        if records[0]["startTime"][:10] == records[1]["startTime"][:10]:
            raise ProcessingError("A soil moisture comparison requires two acquisition dates.")
        if records[0]["granuleName"].split("_")[5:10] != records[1]["granuleName"].split("_")[5:10]:
            raise ProcessingError("Choose soil moisture dates from the same track, pass, frame and acquisition mode.")
    deadline = time.monotonic() + 80
    samples = []
    for record in records:
        with requests.Session() as session, RangeFile(session, record["downloadUrl"], token, deadline) as source:
            with h5py.File(source, "r") as file:
                samples.append(open_window(file, product, lat, lon, minimum, source, record))
    values, sources, ancillary = zip(*samples)
    if len(sources) == 2 and not matched_grid(*sources):
        raise ProcessingError("The soil moisture records do not share exactly the same sample grid.")
    inside = area_mask(bounds, sources[0])
    valid = inside & np.logical_and.reduce([np.isfinite(array) for array in values])
    if not valid.any():
        raise ProcessingError("No pixels met the coverage and quality rules. Try another location, acquisition or quality threshold.")

    label, unit, display, quality, limitation = {
        "SME2": ("Volumetric soil moisture", "m³/m³", [0, 0.6],
                 "The source retrieval flag recommends these pixels.",
                 "Provisional SME2 retrievals are not fully calibrated. Use field measurements to validate absolute soil moisture."),
        "GUNW": ("Interferometric coherence", "unitless", [0, 1],
                 f"Finite phase, valid connected component, and coherence ≥ {minimum}.",
                 "Coherence describes the agreement between the two source acquisitions. Estimating displacement requires a reference and phase corrections."),
        "GOFF": ("Along-track pixel offset", "m", [-10, 10],
                 f"Finite along-track and slant-range offsets, and correlation peak ≥ {minimum}.",
                 "Source offsets may contain outliers and are not a velocity or validated ice-motion estimate."),
    }[product]

    result = {
        "method": f"earth-signal-{product.lower()}-window-v1", "product": product,
        "latitude": lat, "longitude": lon, "areaBounds": bounds, "windowPixels": WINDOW,
        "sources": sources, "validPixels": int(valid.sum()), "totalPixels": int(inside.sum()),
        "measurementLabel": label, "unit": unit, "displayRange": display, "qualityRule": quality,
        "limitation": limitation, "minimumQuality": minimum,
        "medians": [round(float(np.median(array[valid])), 5) for array in values],
        "additionalMedians": {key: round(float(np.median(array[valid])), 5) for key, array in ancillary[0].items()},
        "previews": [image(np.where(valid, array, np.nan), *display) for array in values],
        "pixelValues": [pixel_values(array, valid) for array in values],
    }
    if len(values) == 2:
        difference = np.where(valid, values[1] - values[0], np.nan)
        result.update(medianChange=round(float(np.median(difference[valid])), 5),
                      changeDisplay=[-0.2, 0.2], changePreview=image(difference, -0.2, 0.2, change=True))
    return result
