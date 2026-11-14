# Step 11 — Harmony feasibility spike

**Execute only this step. Do not move on automatically.**

## Objective
Prove one real, small NISAR extraction through the current NASA Harmony service. First verify current official NISAR Harmony documentation and actual product capabilities. Use a user-configured local Earthdata token without printing it. Identify a verified SME2 granule, exact variable path, AOI request, output format and resulting raster metadata. Measure request duration, bytes, output CRS/dimensions and failure states. Do not guess variable paths or service names. If user approval or token is missing, stop and provide exact setup instructions.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
