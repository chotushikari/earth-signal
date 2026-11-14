# Step 25 — Watchlists and My Places

**Execute only this step. Do not move on automatically.**

## Objective
Implement saved AOIs/topics. First ask whether user wants local-only storage or authenticated cloud sync. If Supabase Auth/database is chosen, present an integration/security proposal and wait for approval, then use owner IDs and RLS. Replace public insert/delete policies. Verify user A cannot access user B's items. Never claim continuous monitoring unless a scheduled check is implemented and approved.

## Required output
- A concise plan before edits.
- Exact files inspected/changed.
- Tests and commands run, with actual outcomes.
- Updated docs/decision log where relevant.
- Remaining risks and next recommended step.

## Stop conditions
Stop and ask the user before introducing an external API/provider, requesting/using credentials, accepting terms, changing account configuration, triggering a paid plan, modifying production data, destructive schema operations, or making a material product/architecture trade-off. If blocked by missing API approval or token, do not simulate success; provide exact user setup steps and wait.
