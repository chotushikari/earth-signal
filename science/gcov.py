"""Read a bounded window from authoritative ASF NISAR GCOV HDF5 assets."""

import base64
from concurrent.futures import ThreadPoolExecutor
import io
import json
import math
import os
import re
import struct
import sys
import time
from urllib.parse import urljoin, urlparse
import zlib

import h5py
import numpy as np
from pyproj import CRS, Transformer
import requests


ARCHIVE = "nisar.asf.earthdatacloud.nasa.gov"
CDN = "d1mv8zhcvry6x4.cloudfront.net"
CATALOG = "https://api.daac.asf.alaska.edu/services/search/param"
GRID = "/science/LSAR/GCOV/grids/frequencyA"
CHANNELS = ("HHHH", "VVVV", "HVHV", "VHVH", "RHRH", "RVRV")
WINDOW = 128


class ProcessingError(Exception):
    def __init__(self, message, status=422):
        super().__init__(message)
        self.status = status


class RangeFile(io.RawIOBase):
    block_size = 1024 * 1024
    byte_limit = 32 * 1024 * 1024

    def __init__(self, session, url, token, deadline):
        self.session, self.url, self.token = session, url, token
        self.deadline = deadline
        self.position = self.transferred = 0
        self.blocks = {}
        self.size = None
        self._fetch(0, 7)

    def _fetch(self, start, end):
        length = end - start + 1
        if self.transferred + length > self.byte_limit:
            raise ProcessingError("This window exceeded the archive read budget.")
        for _ in range(3):
            remaining = self.deadline - time.monotonic()
            if remaining <= 0:
                raise ProcessingError("Archive reading timed out. Try again.", 504)
            url = urlparse(self.url)
            if url.scheme != "https" or url.netloc not in (ARCHIVE, CDN):
                raise ProcessingError("The archive returned an unsupported asset address.", 502)
            headers = {"Range": f"bytes={start}-{end}", "Accept-Encoding": "identity"}
            if url.netloc == ARCHIVE:
                headers["Authorization"] = f"Bearer {self.token}"
            with self.session.get(self.url, headers=headers, stream=True, allow_redirects=False,
                                  timeout=(min(4, remaining), min(8, remaining))) as response:
                if response.is_redirect:
                    self.url = urljoin(self.url, response.headers["Location"])
                    continue
                if response.status_code in (401, 403):
                    raise ProcessingError("Earthdata denied access to the radar file. Check the server credential and ASF access.", 503)
                content_range = re.fullmatch(r"bytes (\d+)-(\d+)/(\d+)", response.headers.get("Content-Range", ""))
                if response.status_code != 206 or not content_range:
                    raise ProcessingError("The archive did not supply a partial radar file response.", 502)
                first, last, size = map(int, content_range.groups())
                if (first, last) != (start, end) or size <= end or self.size not in (None, size):
                    raise ProcessingError("The archive returned an inconsistent byte range.", 502)
                self.size = size
                data = response.raw.read(length + 1)
                if len(data) != length:
                    raise ProcessingError("The archive returned an incomplete radar file response.", 502)
                self.transferred += length
                return data
        raise ProcessingError("The archive redirected the request too many times.", 502)

    def seekable(self):
        return True

    def readable(self):
        return True

    def tell(self):
        return self.position

    def seek(self, offset, whence=0):
        self.position = offset + (0, self.position, self.size)[whence]
        if self.position < 0:
            raise ValueError("Negative file offset")
        return self.position

    def readinto(self, buffer):
        output = memoryview(buffer).cast("B")
        count = min(len(output), max(0, self.size - self.position))
        written = 0
        while written < count:
            start = self.position // self.block_size * self.block_size
            if start not in self.blocks:
                self.blocks[start] = self._fetch(start, min(self.size, start + self.block_size) - 1)
            block = self.blocks[start]
            offset = self.position - start
            take = min(count - written, len(block) - offset)
            output[written:written + take] = block[offset:offset + take]
            self.position += take
            written += take
        return written


def lookup(granule):
    response = requests.get(CATALOG, params={"dataset": "NISAR", "output": "json", "granule_list": granule},
                            timeout=(4, 8), allow_redirects=False)
    response.raise_for_status()
    records = response.json()
    if len(records) == 1 and isinstance(records[0], list):
        records = records[0]
    record = next((r for r in records if r.get("granuleName") == granule), None)
    if not record or record.get("processingLevel") != "GCOV":
        raise ProcessingError("ASF did not return the requested GCOV source record.", 404)
    url = urlparse(record.get("downloadUrl") or "")
    if url.scheme != "https" or url.netloc != ARCHIVE or url.path.rsplit("/", 1)[-1] != granule + ".h5":
        raise ProcessingError("ASF did not supply a supported HDF5 download for this record.")
    return record


def read_window(record, lat, lon, token, deadline, channel=None):
    with requests.Session() as session, RangeFile(session, record["downloadUrl"], token, deadline) as source:
        with h5py.File(source, "r") as file:
            grid = file.get(GRID)
            if grid is None:
                raise ProcessingError("This record has no supported L-band frequency A grid.")
            channel = channel or next((name for name in CHANNELS if name in grid), None)
            if channel is None or any(key not in grid for key in (channel, "mask", "projection", "xCoordinates", "yCoordinates")):
                raise ProcessingError("The matching radar channel or its coverage mask is missing.")
            epsg = int(grid["projection"][()])
            crs = CRS.from_epsg(epsg)
            if not crs.is_projected or crs.axis_info[0].unit_conversion_factor != 1:
                raise ProcessingError("This radar grid does not use a supported projected metre coordinate system.")
            x, y = Transformer.from_crs(4326, crs, always_xy=True).transform(lon, lat)
            xs, ys = grid["xCoordinates"], grid["yCoordinates"]
            x0, y0 = float(xs[0]), float(ys[0])
            dx, dy = float(grid["xCoordinateSpacing"][()]), float(grid["yCoordinateSpacing"][()])
            if not all(map(math.isfinite, (x, y, x0, y0, dx, dy))) or dx <= 0 or dy >= 0:
                raise ProcessingError("The source radar grid is invalid or unsupported.")
            col, row = round((x - x0) / dx), round((y - y0) / dy)
            left, top = col - WINDOW // 2, row - WINDOW // 2
            if min(left, top) < 0 or left + WINDOW > len(xs) or top + WINDOW > len(ys):
                raise ProcessingError("The selected point is too close to, or outside, the radar grid edge.")
            x_coords, y_coords = xs[left:left + WINDOW], ys[top:top + WINDOW]
            if not (np.allclose(np.diff(x_coords), dx, rtol=0, atol=1e-5)
                    and np.allclose(np.diff(y_coords), dy, rtol=0, atol=1e-5)):
                raise ProcessingError("The radar grid spacing is not regular.")
            bounds = np.s_[top:top + WINDOW, left:left + WINDOW]
            power = grid[channel][bounds].astype(np.float64)
            mask = grid["mask"][bounds]
            valid = np.isfinite(power) & (power > 0) & (mask > 0) & (mask < 255)
            fill = grid[channel].attrs.get("_FillValue", np.nan)
            valid &= power != fill
            values = np.full(power.shape, np.nan)
            values[valid] = 10 * np.log10(power[valid])
            return values, {
                "granule": record["granuleName"], "acquiredAt": record.get("startTime"),
                "asset": record["downloadUrl"], "dataset": f"{GRID}/{channel}", "channel": channel,
                "epsg": epsg, "spacing": [dx, dy],
                "firstPixelCenter": [float(x_coords[0]), float(y_coords[0])],
                "bytesRead": source.transferred,
            }


def image(values, low, high, change=False):
    valid = np.isfinite(values)
    scale = np.clip((np.where(valid, values, 0) - low) / (high - low), 0, 1)
    if change:
        rgb = [np.minimum(2 * scale, 1), 1 - 2 * abs(scale - 0.5), np.minimum(2 * (1 - scale), 1)]
    else:
        rgb = [scale] * 3
    pixels = (np.stack([*rgb, valid], axis=-1) * 255).astype(np.uint8)

    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data))

    raw = b"".join(b"\0" + row.tobytes() for row in pixels)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", WINDOW, WINDOW, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(raw)) + chunk(b"IEND", b"")
    return "data:image/png;base64," + base64.b64encode(png).decode("ascii")


def process(payload):
    ids = payload.get("granules") if isinstance(payload, dict) else None
    if not isinstance(ids, list) or not 1 <= len(ids) <= 2 or not all(
        isinstance(value, str) and re.fullmatch(r"NISAR_L2_[A-Z]{2}_GCOV_[A-Z0-9_]{10,220}", value)
        for value in ids
    ) or len(set(ids)) != len(ids):
        raise ProcessingError("Choose one or two distinct L-band NISAR GCOV records.", 400)
    token = os.environ.get("EARTHDATA_TOKEN", "").strip()
    if not token:
        raise ProcessingError("Earthdata access is not configured on the server.", 503)
    deadline = time.monotonic() + 90
    with ThreadPoolExecutor(max_workers=2) as pool:
        records = list(pool.map(lookup, ids))
    records.sort(key=lambda record: record.get("startTime") or "")
    try:
        lat = float(payload.get("lat", records[0].get("centerLat")))
        lon = float(payload.get("lon", records[0].get("centerLon")))
    except (ValueError, TypeError):
        raise ProcessingError("Enter valid decimal latitude and longitude.", 400) from None
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        raise ProcessingError("Coordinates are outside geographic bounds.", 400)
    if len(records) == 2:
        tracks = [record["granuleName"].split("_")[5:10] for record in records]
        if tracks[0] != tracks[1] or not records[0].get("startTime") or records[0].get("startTime") == records[1].get("startTime"):
            raise ProcessingError("Select different acquisition dates on the same track, pass, frame and acquisition mode.")
    # h5py serializes HDF5 calls, including reads against file-like objects.
    samples = [read_window(record, lat, lon, token, deadline) for record in records]
    values, sources = zip(*samples)
    valid = np.logical_and.reduce([np.isfinite(array) for array in values])
    if not valid.any():
        raise ProcessingError("No radar samples passed the source mask at this location. Try another point.")
    result = {
        "method": "earth-signal-gcov-window-v1", "latitude": lat, "longitude": lon, "windowPixels": WINDOW,
        "sources": sources, "validPixels": int(valid.sum()), "totalPixels": WINDOW ** 2,
        "backscatterDisplayDb": [-30, 5],
        "previews": [image(np.where(valid, array, np.nan), -30, 5) for array in values],
        "medianBackscatterDb": [round(float(np.median(array[valid])), 2) for array in values],
    }
    if len(values) == 2:
        a, b = sources
        if (a["epsg"], a["dataset"], a["spacing"]) != (b["epsg"], b["dataset"], b["spacing"]) or not np.allclose(
            a["firstPixelCenter"], b["firstPixelCenter"], rtol=0, atol=1e-5
        ):
            raise ProcessingError("The observations do not share the same channel and pixel grid.")
        difference = np.where(valid, values[1] - values[0], np.nan)
        result.update(medianChangeDb=round(float(np.median(difference[valid])), 2),
                      changeDisplayDb=[-6, 6], changePreview=image(difference, -6, 6, change=True))
    return result


def run(payload):
    try:
        return 200, process(payload)
    except ProcessingError as error:
        return error.status, {"error": str(error)}
    except requests.RequestException:
        return 502, {"error": "ASF or Earthdata could not complete the request. Try again."}
    except (OSError, ValueError, KeyError, TypeError):
        return 422, {"error": "The radar file could not be decoded as a supported GCOV grid."}


if __name__ == "__main__":
    status, body = run(json.load(sys.stdin))
    print(json.dumps({"status": status, "body": body}, allow_nan=False))
