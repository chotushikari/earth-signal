# Step 04 — Architecture decisions

**Execute only this step. Do not move on automatically.**

## Objective
Create architecture decision records for current Vite frontend, lightweight server API, local Python science worker, NASA extraction adapter, output storage and job lifecycle. Confirm what can remain on Vercel and what must move out of serverless functions. Compare alternatives without adding them. Ask before selecting a new hosted queue, object store, VPS, auth provider or paid plan. Produce Mermaid architecture and a migration sequence.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
