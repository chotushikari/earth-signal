# Step 07 — ASF search client

**Execute only this step. Do not move on automatically.**

## Objective
Implement a server-side ASF Search client using current official API docs. Validate AOI/date/product filters, cap result counts, add timeout and structured upstream errors, normalize response envelope, and preserve raw source metadata. Keep Earthdata secrets out of the browser. Add tests using saved fixtures and at least one live smoke test only after user approves credential/account use. Return fetched_at and source=live/cached. Do not silently treat cache fallback as live.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
