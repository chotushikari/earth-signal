# Step 08 — Catalog normalization

**Execute only this step. Do not move on automatically.**

## Objective
Harden the existing catalog normalization: granule identity, time parsing, product maturity, WKT/GeoJSON validation, missing fields, footprint bounds and duplicate records. Add fixtures for malformed geometry and varying ASF response envelopes. Keep raw source metadata. Pair grouping must be labelled candidate grouping only until the dedicated readiness engine validates product-specific compatibility. Do not rewrite the globe.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
