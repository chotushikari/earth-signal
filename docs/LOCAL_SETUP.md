# Local Setup

## Runtime baseline

- Node.js: Vite 5 requires Node.js 18+ or 20+. Use a supported Node release for team development.
- npm: use the lockfile with `npm ci`; do not substitute an unrecorded package manager.
- Python: no Python service is installed yet. A local science worker will be introduced in the later worker step.

The current audit was run with Node.js 26.13.0, npm 11.20.0, and Python 3.13.5. The frontend production build passed in that environment.

## Install and verify

```bash
npm ci
npm run check:secrets
npm run build
npm run dev
```

`npm run dev` starts the local Vite server. `npm run build` writes a deployable bundle to `dist/`, which is intentionally ignored by Git.

## Environment files

Copy `.env.example` to `.env.local` only when an approved integration requires configuration. Do not commit `.env.local`.

- `VITE_CESIUM_ION_TOKEN`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY` are browser-visible values. Configure them only after provider approval and a review of their intended public use.
- `EARTHDATA_TOKEN` and `SUPABASE_SERVICE_ROLE_KEY` are server-only values. Never place them in `VITE_` variables, browser code, source maps, logs, or chat.

## Current limits

This project has only `dev`, `build`, `preview`, and `check:secrets` scripts. Unit tests, linting, type checks, Python dependency management, and a CI workflow have not yet been added. The current dependency audit reports a critical transitive `dompurify` advisory; dependency remediation is intentionally deferred until its own reviewed change.
