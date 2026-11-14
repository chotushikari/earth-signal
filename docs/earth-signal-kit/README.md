# EARTH SIGNAL — Codex Build Kit

**Purpose:** a practical, evidence-first NISAR Earth-change discovery and investigation platform, built by evolving the Team Zenith codebase.

**Product promise:** Discover what is changing on Earth, understand the satellite evidence, and follow places that matter.

## Start here (do this in order)

1. Open the existing Team Zenith repository in Codex, or clone/fork it into a clean working directory:
   - https://github.com/nabil24024004/Team-Zenith-Dancing-With-SARs
2. Add this entire `EARTH_SIGNAL_CODEX_KIT` folder to the workspace (or open the kit as workspace context).
3. Paste [`CODEX_MASTER_PROMPT.md`](CODEX_MASTER_PROMPT.md) into Codex.
4. Tell Codex to execute **Step 01 only** from [`05_EXECUTION/29_STEP_ROADMAP.md`](05_EXECUTION/29_STEP_ROADMAP.md).
5. Review the audit and architecture proposal before allowing code changes.
6. Execute one numbered prompt at a time from `05_EXECUTION/prompts/`. Do not ask Codex to execute all 29 prompts in one run.

## What is in this kit

| File/folder | Purpose |
|---|---|
| `CODEX_MASTER_PROMPT.md` | Persistent role, operating rules, approval gates and definition of a good Codex session |
| `01_PRODUCT/PRODUCT_BRIEF.md` | Goal, problem, target users, scope and non-goals |
| `02_UX/USER_JOURNEYS_AND_UI_SPEC.md` | Information architecture, screens, workflows, states and UX requirements |
| `03_ARCHITECTURE/SYSTEM_ARCHITECTURE.md` | Frontend/backend/science worker architecture and boundaries |
| `04_DATA_AND_SCIENCE/DATA_SOURCE_AND_API_REGISTER.md` | NASA and contextual data sources, costs, credentials and approval policy |
| `04_DATA_AND_SCIENCE/SCIENCE_PROCESSING_SPEC.md` | Product-specific processing rules and scientific guardrails |
| `04_DATA_AND_SCIENCE/DATA_MODEL_AND_API_CONTRACTS.md` | Common result model, jobs, endpoints and evidence record |
| `03_ARCHITECTURE/COMPUTE_AND_DEPLOYMENT.md` | Local CPU requirements, zero-cost prototype and deployment limits |
| `06_QUALITY/ACCEPTANCE_AND_TEST_PLAN.md` | Acceptance gates and test strategy |
| `06_QUALITY/RISK_REGISTER.md` | Main technical, scientific, operational and licensing risks |
| `07_OPERATIONS/DEMO_AND_RELEASE_RUNBOOK.md` | Demo, release and incident runbook |
| `05_EXECUTION/29_STEP_ROADMAP.md` | The sequential implementation plan |
| `05_EXECUTION/prompts/STEP_01...STEP_29.md` | Individual, copy-ready Codex prompts |
| `.env.example` | Environment variable names only; no real secrets |
| `SOURCE_BASELINE.md` | What was verified in Zenith's source and what needs re-validation |
| `DECISIONS_LOG.md` | Record decisions, assumptions and approvals |

## Product strategy in one paragraph

Earth Signal is a single discovery and investigation product with several topic lenses: Water & Wetlands, Forests & Vegetation, Farms & Soil, Ground Movement, Ice & Glaciers, and Explore Any Area. It does not pretend that every topic has a complete algorithm on day one. Each topic displays a truthful readiness state. The initial end-to-end science implementations should be SME2 soil-moisture analysis and GCOV calibrated backscatter change. GUNW and GOFF should be enabled only after compatible real examples, correct variable extraction, quality checks and validation are demonstrated. Every result must be traceable to NISAR source products, processing parameters, quality flags and known limitations.

## First milestone

**One real NISAR SME2 granule → authenticated variable extraction via NASA Harmony → a georeferenced subset → Python processing → a map layer in the existing Zenith globe → evidence record.**

Do not build an elaborate new dashboard before this vertical slice is proven.

## Rules that protect the project

- NASA core services are the intended primary source, but Codex must still confirm exact endpoints, service capabilities, variable names, data maturity and current terms before implementation.
- Do not add a third-party API, paid service, new cloud provider, analytics tracker, external LLM, or credential-dependent integration without presenting a short proposal and receiving explicit user approval.
- Do not ask for passwords or expose credentials in source code, logs, screenshots, chat or Git history.
- Never put `EARTHDATA_TOKEN` or any privileged key in a `VITE_` variable.
- Do not label browse-image brightness as calibrated backscatter.
- Do not route missing data into a synthetic image and label it a real satellite result.
- Never fabricate data coverage, a measurement, a confidence score, an event cause or a population estimate.
- Every module that is not implemented and tested must be labelled `Limited`, `Not yet supported` or `Demo only`.
- Prefer the smallest working vertical slice over a broad set of placeholder modules.

## Current plan assumptions

- Date of this kit: 14 November 2026.
- Existing Zenith code is a React 18 + Vite 5 JavaScript app with CesiumJS and Vercel-style API functions. It is not currently a Python science backend.
- Existing project deployment, credentials, service plan eligibility and quotas are not independently verified by this kit.
- The product can be demonstrated at zero infrastructure spend using local CPU processing and precomputed verified examples, subject to NASA/service quotas and licences.
- A continuously available public processing worker is **not** assumed to be free. It requires a separate cost/hosting decision.

## Citation and source policy

The source register contains official documentation URLs. Codex must re-open the current official docs before relying on API parameters or pricing. If a current detail cannot be verified, record it as unknown and ask the user or choose a documented fallback.
