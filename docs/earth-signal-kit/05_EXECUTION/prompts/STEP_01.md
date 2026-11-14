# Step 01 — Repository and runtime audit

**Execute only this step. Do not move on automatically.**

## Objective
Inspect the repository and current runtime without modifying application code. Read the kit first. Verify branch, working tree, project structure, dependencies, scripts, build, API routes, deployment config, env usage, database schema and tests. Reopen every relevant Zenith source file; compare against SOURCE_BASELINE.md. Identify which pieces can be retained, which must be quarantined and which require replacement. Run safe diagnostics/build only; do not make external API calls with secrets. Deliver a factual report, dependency graph, risk list and minimal migration plan. Ask for approval before any code edits or integration.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
