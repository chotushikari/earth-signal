# Step 23 — Data readiness UI

**Execute only this step. Do not move on automatically.**

## Objective
Build a readiness screen that groups available observations by product and maturity, shows footprints/date range, compatible candidates, QA availability and explicit blockers. Explain why an analysis is Ready, Limited or Not ready in plain language. Do not equate observation count with usable analysis. Link each candidate to source metadata.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
