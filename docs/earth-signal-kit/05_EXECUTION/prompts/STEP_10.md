# Step 10 — Data readiness engine

**Execute only this step. Do not move on automatically.**

## Objective
Implement a pure, testable readiness service. Evaluate product type/version/maturity, AOI overlap, acquisition dates, candidate temporal groups, required channels/variables, geometry compatibility and available QA. Return structured pass/warn/fail checks and reason codes. Separate metadata compatibility from scientific validity. Do not select a pair based only on track/frame. No raster processing yet.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
