# Step 03 — Dependency and environment audit

**Execute only this step. Do not move on automatically.**

## Objective
Audit Node/Python versions, package managers, scripts, environment variable use and local setup. Identify insecure VITE-prefixed secrets, obsolete dependencies and missing lockfiles. Propose the smallest reproducible environment. Do not upgrade frameworks or add a cloud provider without approval. Update .env.example with names only; never output actual secret values. Add setup documentation and a secret scan test if feasible.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
