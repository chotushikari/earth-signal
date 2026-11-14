# NISAR Data Guide

## Product mapping

| Product | Intended use | V2 status |
|---|---|---|
| SME2 | Soil-moisture field and compatible temporal comparison | First processor candidate; source-variable validation pending |
| GCOV | Calibrated radar response and compatible temporal comparison | First processor candidate; source-variable validation pending |
| GUNW | Line-of-sight displacement with quality/reference controls | Metadata only until validated |
| GOFF | Surface motion offsets with quality controls | Metadata only until validated |
| GSLC/RSLC | Advanced workflows | Not implemented |

## Source rules

ASF discovery metadata can identify candidate observations but does not itself validate a processing input. Earthdata credentials remain server-side. Harmony or direct-cloud extraction must be confirmed against current product/service documentation before implementation. Browse PNG/JPEG is preview material only and cannot provide calibrated values, displacement or moisture.

## Provenance minimum

Every real input needs source granule ID, product/version/maturity, acquisition time, footprint/AOI relation, provider URL, query timestamp and retrieval mode. Every result adds variable paths, units, masks, parameters, processor version, output checksum and limitations.
