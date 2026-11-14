# Step 09 — Topic-to-product routing

**Execute only this step. Do not move on automatically.**

## Objective
Create the lens configuration for Water & Wetlands, Forests & Vegetation, Farms & Soil, Ground Movement, Ice & Glaciers and Explore Any Area. Map each lens to candidate NISAR product families and required processing capabilities only when supported by official docs. Each lens must return Ready, Limited or Not yet supported based on implemented processors and verified data. Add tests preventing a lens from appearing Ready before acceptance checks pass.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
