# Step 27 — Optional contextual integrations

**Execute only this step. Do not move on automatically.**

## Objective
Prepare separate integration proposals for only the context sources that materially improve a chosen lens (e.g. OSM, WorldPop, FIRMS, DEM, weather or geocoding). For each, inspect official terms, licence, rate limits, pricing, attribution and privacy. Present alternatives and ask the user to Approve/Reject/Defer each. Do not add or call any optional provider until approved.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
