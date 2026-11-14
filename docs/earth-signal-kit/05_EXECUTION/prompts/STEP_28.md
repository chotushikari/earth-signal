# Step 28 — Security, resilience and performance

**Execute only this step. Do not move on automatically.**

## Objective
Run a security and performance pass: secret scan, VITE env audit, SSRF checks, auth/RLS tests, rate limits, request timeouts, upload and raster size caps, concurrency caps, structured errors, retry/backoff, cache labelling, temp cleanup and provider attribution. Benchmark small/medium AOIs and report CPU/RAM/time/bytes. Never claim a cost or limit without a current official source.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
