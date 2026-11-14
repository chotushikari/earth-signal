# Step 06 — Source and API registry

**Execute only this step. Do not move on automatically.**

## Objective
Re-open official NASA ASF, Earthdata Login, Harmony and NISAR product-guide documentation. Make an integration matrix with exact endpoints, supported operations/products, auth, exact variables/service names only where verified, quotas/limits, output formats and failure behaviour. List optional OSM, WorldPop, FIRMS, geocoder and LLM only as proposals. Do not implement or call any new optional provider. Ask user to approve the NASA credential setup and any optional integration separately.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
