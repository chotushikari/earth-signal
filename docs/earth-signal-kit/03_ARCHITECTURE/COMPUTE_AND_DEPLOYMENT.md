# Compute and Deployment Plan

**Target:** zero-cost development and demonstrator first. No GPU or paid VPS until measured benchmarks prove a need.

## 1. Compute sizing estimates

These are initial engineering estimates, not provider specifications. Benchmark with actual NISAR subsets and update them with measured peak RAM, runtime and output size.

| Workload | Practical starting point | Notes |
|---|---|---|
| Frontend / map / metadata | Browser + static hosting | No science raster processing in browser |
| ASF search / small metadata APIs | Serverless/light API | Fast, bounded requests only |
| Small AOI, one or two extracted bands | 2–4 CPU cores, 8 GB RAM | Use windowed raster processing |
| Multiple dates/variables and medium AOI | 4–8 cores, 16 GB RAM | Dask optional; limit concurrency |
| Full scenes or many bands/time steps | 8–16+ cores, 32–64+ GB RAM | Not MVP; benchmark before hosting |
| GPU | None required | Core raster science is CPU-based |

A Float32 raster uses 4 bytes/pixel before masks, arrays and overhead. A 10,000 × 10,000 raster is about 381 MiB for one Float32 band; multiple inputs/outputs multiply memory. Prefer COG windows, Rasterio block windows, xarray chunks and bounded worker concurrency.

## 2. Developer machine

Minimum practical target: 4 CPU cores, 8 GB RAM, 30 GB free SSD. Recommended: 6–8 CPU cores, 16 GB RAM, 50–100 GB free SSD. Windows with WSL2/Ubuntu or native Linux is suitable. No CUDA/GPU requirement.

## 3. Zero-cost prototype topology

- Frontend: Vercel Hobby only if project usage and non-commercial/personal terms fit.
- Metadata database: Supabase Free, subject to current quota and inactivity behaviour.
- Map: existing CesiumJS only if ion plan/license and quotas fit; otherwise MapLibre with a separately approved basemap source.
- Science worker: local laptop CPU during development/demo.
- NASA source data: ASF/Earthdata/Harmony; NASA remains source of original files.
- Result artifacts: local processed directory for development; store only small selected outputs in Supabase if quota allows.
- Precomputed demo artifacts: prepare from real NASA inputs, mark them as precomputed with source date and generation time.

There is no assumed permanently available free public Python worker in this architecture. Public arbitrary-AOI processing is a separate hosting/cost decision.

## 4. Current free-tier facts to re-check on implementation day

As checked for this kit on 14 Nov 2026:

- Vercel Hobby is listed at $0 and has usage allowances including 4 active CPU-hours, 360 GB-hours provisioned memory, 1 million function invocations and a 100 GB-hours function duration allowance. Hobby is intended for personal/non-commercial use. The precise current function duration/CPU rules must be rechecked; do not rely on old 10s/60s assumptions.
- Supabase Free is listed at $0 with 500 MB database per project, 1 GB file storage, 5 GB uncached egress + 5 GB cached egress, shared compute (500 MB RAM), and inactivity pausing after one week. Check the current pricing/billing page before storing outputs.
- Cesium ion Community is free for individual personal/non-commercial use with quotas such as 10 GB storage and 15 GB/month streaming. It is not an unlimited team/commercial production plan. Confirm fit before using the token in a public team demo.
- CARTO advertises a trial; do not assume an ongoing free production plan.
- MapLibre is an open-source renderer; map tiles, imagery and terrain services have their own licences/quotas.

Official pages:
- https://vercel.com/docs/plans/hobby
- https://vercel.com/docs/functions/usage-and-pricing
- https://supabase.com/pricing
- https://supabase.com/docs/guides/platform/billing-on-supabase
- https://cesium.com/platform/cesium-ion/pricing/
- https://www.carto.com/pricing/

## 5. Cost-control rules

- Never download full HDF5 scenes by default.
- Prefer Harmony variable and spatial extraction where suitable.
- Do not cache original NISAR files in Supabase.
- Set AOI/pixel caps, per-user job limits, request timeout and concurrency controls.
- Use a cache key based on granule IDs + variables + AOI + processing parameters + code version.
- Set retention and cleanup for intermediate outputs.
- Estimate output sizes before persistence.
- Surface provider quota exhaustion cleanly.
- Do not trigger repeated Harmony jobs on slider movement; compute once and adjust visualization locally.
- Never start a paid provider upgrade without user approval.

## 6. Benchmark protocol

For each real test granule/AOI record:
- granule ID and product maturity;
- selected variable paths;
- AOI WKT and CRS;
- Harmony request and output metadata (without token);
- output bytes and raster dimensions;
- local CPU model/core count and RAM;
- wall time by stage;
- peak RSS if measurable;
- output valid-pixel fraction;
- processing result checksum;
- total temporary disk used.

Use 3 test sizes: small AOI, medium AOI and larger AOI. Keep the same input and parameters for repeatability.

## 7. Deployment upgrade gate

Only propose a hosted worker after:
1. Local vertical slice works.
2. Actual CPU/RAM/runtime are benchmarked.
3. User confirms whether public online processing is required.
4. At least two hosting options are compared with exact current pricing and sleep/CPU/RAM/network limits.
5. User explicitly approves the provider and possible billing.
