# Earth Signal

Earth Signal is an evidence-first NISAR Earth-change discovery and investigation workspace. It helps people find suitable satellite observations, understand whether an analysis is scientifically ready, and inspect traceable results.

## Current status

This repository is an initial Earth Signal foundation. It retains a React, Vite and Cesium exploration application while the verified science pipeline is built in stages. No browser preview, synthetic layer, or browse image is scientific evidence.

The initial validated processors will be SME2 soil moisture and GCOV calibrated radar response. GUNW and GOFF remain limited until a real-data workflow and validation are complete.

## Local setup

```bash
npm ci
npm run check:secrets
npm run dev
```

Create `.env.local` from `.env.example` only when a later approved integration requires it. Never place `EARTHDATA_TOKEN` or `SUPABASE_SERVICE_ROLE_KEY` in a `VITE_` variable.

## Documentation

The product brief, architecture, scientific rules, risk register, and phased execution plan are in [`docs/earth-signal-kit`](docs/earth-signal-kit/README.md). Work proceeds one reviewed step at a time.

Local runtime and environment guidance is in [`docs/LOCAL_SETUP.md`](docs/LOCAL_SETUP.md).

## Provenance

Earth Signal begins from an independently developed source foundation. Its source provenance and the migration audit are retained in the project documentation. See [NOTICE.md](NOTICE.md); do not remove required upstream attributions or licences.
