# Step 14 — Raster validation and geospatial utilities

**Execute only this step. Do not move on automatically.**

## Objective
Implement common utilities to inspect GeoTIFF/COG metadata: dimensions, bands, dtype, CRS, transform, bounds, nodata, masks, units/tags and block layout. Implement AOI intersection, windowed reads, common-grid validation, output writing and checksums. Preserve masks. Add unit tests with tiny synthetic rasters whose values are known; label all such fixtures as simulated test data.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
