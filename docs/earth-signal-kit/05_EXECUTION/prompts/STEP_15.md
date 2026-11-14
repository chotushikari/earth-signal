# Step 15 — SME2 end-to-end processor

**Execute only this step. Do not move on automatically.**

## Objective
Implement the first real science processor for NISAR SME2 using the exact variable paths and units verified from official docs and the extraction spike. Handle maturity, valid-data flags, fill values, uncertainty and algorithm selection. Produce a spatial layer, summary statistics, temporal delta only for compatible grids/algorithms, and complete evidence record. Reconcile the legacy sme2Data.js stats discrepancy by recomputing from source; do not use README numbers as truth. Never infer irrigation/crop stress causation.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
