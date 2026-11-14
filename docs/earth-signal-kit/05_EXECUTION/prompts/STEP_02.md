# Step 02 — Product and assumptions lock

**Execute only this step. Do not move on automatically.**

## Objective
Review PRODUCT_BRIEF.md and UX specification against the user’s goals. Propose a concise decision sheet for product name, primary user, initial verified regions, first two analysis workflows, lens readiness semantics and the definition of MVP. Do not broaden scope. Ask the user to confirm only material choices. Update DECISIONS_LOG.md after approval; no external provider integration.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
