# Step 13 — Python worker skeleton

**Execute only this step. Do not move on automatically.**

## Objective
Create the Python FastAPI science worker with configuration, health endpoint, job submission/status, structured logs and a processor registry. It must run locally on CPU. Do not add Redis, Celery, hosted queues or new cloud services unless the user approves a proposal. Provide Dockerfile only if it helps local reproducibility. Add tests for status transitions, invalid jobs and bounded concurrency.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
