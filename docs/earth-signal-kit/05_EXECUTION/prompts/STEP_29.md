# Step 29 — Demo, deployment and final acceptance

**Execute only this step. Do not move on automatically.**

## Objective
Run the complete acceptance plan. Verify build, unit/integration tests, one real SME2 pipeline and one real GCOV pipeline (or mark blocked/Limited with evidence). Verify deployed frontend, worker mode, environment variables and data provenance. Prepare a demo script that separates live search, cached metadata and precomputed real results. Do not buy/upgrade/deploy a new compute provider without explicit approval. Produce release notes and known limitations.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
