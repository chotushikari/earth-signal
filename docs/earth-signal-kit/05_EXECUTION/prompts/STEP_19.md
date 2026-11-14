# Step 19 — Common result and evidence persistence

**Execute only this step. Do not move on automatically.**

## Objective
Implement shared result/evidence structures for every processor. Persist source granules, maturity, URLs/DOIs, variables, units, extraction request metadata, AOI/CRS, parameters, software version, masks, quality, valid coverage, output checksum and limitations. Use migrations; never run destructive DROP statements. Decide on Supabase only after reviewing current plan/keys and RLS. Ask before changing project settings or enabling paid usage.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
