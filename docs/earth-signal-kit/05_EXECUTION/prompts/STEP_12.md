# Step 12 — Extraction adapter and job contract

**Execute only this step. Do not move on automatically.**

## Objective
Build a provider adapter around the verified Harmony request. Model asynchronous submission/poll/download if the service requires it. Enforce timeouts, retries with backoff, idempotency, request IDs, file-size/pixel caps and cancellation where supported. Store request metadata without credentials. Validate output before returning a worker input. Keep NASA-specific code isolated from scientific processors.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
