# Step 16 — GCOV end-to-end processor

**Execute only this step. Do not move on automatically.**

## Objective
Implement GCOV analysis from calibrated science variables, not browse images. Verify exact frequency/polarization/covariance variables and QA masks from the product guide and real extraction. Validate acquisition compatibility and common valid pixels. Use 10*log10 only for suitable linear power values, with documented units and masks. Produce delta layer, stats, quality summary and evidence. Add known-array tests. If no compatible real pair is available, return Limited and do not fabricate a live example.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
