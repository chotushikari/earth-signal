# Architecture decisions — 15 November 2026

User authorized making the planned architecture operational and deploying it on the existing Vercel project. No paid provider or new storage service was provisioned.

- Retain React/Vite, Cesium and Vercel for frontend and bounded metadata requests.
- Public ASF discovery now returns an envelope (`source`, `fetchedAt`, `query`, `limit`, `records`). Explore consumes this contract. Legacy callers outside the active router need migration before reuse.
- Live mode is the default; snapshot fallback requires explicit user selection and never replaces a failed live query silently.
- Remove inherited unauthenticated service-role database writes and automatic seeding of claimed monitoring results. Authentication/RLS must precede restoring remote writes.
- Restrict protected browse transfer; full NISAR HDF5 files belong in a separately deployed science pipeline, following the existing system/compute plans.
- Keep scientific readiness, job processing and report measurements gated until validated real-data outputs exist. Local collection persistence remains available.

Rollback: revert this sprint's source commit and redeploy the previous Vercel version. Do not restore the old public watchpoint writer in production.
