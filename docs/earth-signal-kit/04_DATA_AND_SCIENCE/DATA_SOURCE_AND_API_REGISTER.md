# Data Source and API Register

**Policy:** NASA core science services are the intended source. Every additional provider must be proposed and approved before integration. Pricing and quotas change; re-open official sources before deployment.

## 1. Primary science/data services

| Source | Purpose | Authentication | Cost position | Status |
|---|---|---|---|---|
| NASA ASF Search API | Discover NISAR granules and metadata | Search may work without user token; protected downloads use Earthdata | No paid subscription identified for search; free Earthdata account for download | Core intended; validate exact query syntax |
| NASA Earthdata Login | Authenticate protected resources | User-managed Earthdata account/token | Free account | Core intended; secret is server-side only |
| NASA Harmony | Extract variables, spatially subset and reproject supported data | Follow current service's Earthdata auth requirements | NASA data service; confirm current operational limits/quotas | Core intended; validate product/variables/service support |
| NASA ASF Cloud / S3 access | Remote access to NISAR HDF5 in AWS region | Temporary Earthdata-authorized credentials | Data access route; compute/storage/network in AWS may cost | Optional advanced path; not required for MVP |

Official references:
- ASF API basics: https://docs.asf.alaska.edu/api/basics/
- ASF Search API keywords: https://docs.asf.alaska.edu/api/search_api/
- ASF Python package: https://github.com/asfadmin/Discovery-asf_search
- NISAR Data User Guide: https://nisar-docs.asf.alaska.edu/
- NISAR Harmony guide: https://nisar-docs.asf.alaska.edu/harmony/
- Harmony API docs: https://harmony.earthdata.nasa.gov/docs
- NISAR Cookbook: https://asfopensarlab.github.io/NISAR_Cookbook/
- Earthdata Login: https://urs.earthdata.nasa.gov/

## 2. What each provider does

### ASF Search
Use it for metadata discovery: platform, product, dates, AOI intersection, granule identity, footprints, processing maturity and asset references. The exact parameter names and returned schema must be verified against current ASF docs and a live sample response.

### Earthdata Login
Use it for protected NASA asset access. Credentials must be supplied by the user through a secure provider/local setup route. Never embed the bearer token in the browser.

### Harmony
Use it to extract only required HDF5 variables and spatial areas as supported by the current NISAR Harmony service. Validate actual service capabilities, variable paths, output CRS and async job lifecycle. Do not assume one service configuration can process every NISAR product.

### Direct cloud/HTTPS access
Consider only after the Harmony path is benchmarked. NASA's NISAR Cookbook documents HTTPS and S3/fsspec/xarray workflows. S3 access may have region constraints and temporary credentials; it is not a reason to provision paid AWS compute by default.

## 3. Optional contextual data — NOT pre-approved

| Candidate | Why it may help | Risks/approval needed |
|---|---|---|
| OpenStreetMap / Overpass | Roads, places, buildings and infrastructure context | ODbL attribution/share-alike considerations; public Overpass rate limits; large extracts need a separate strategy |
| WorldPop | Population exposure context | Dataset-specific licence, year, resolution and uncertainty; do not imply exact people affected |
| NASA FIRMS | Active-fire context | Separate API and key; this is not NISAR evidence; rate limits and attribution |
| Natural Earth | Country/administrative context | Public-domain data; confirm current dataset/version |
| Copernicus DEM | Elevation/slope context | Product-specific terms, attribution and resolution checks |
| Weather/hydrology services | Interpret observed conditions | Separate APIs, temporal coverage, licence and possible usage limits |
| Geocoding provider | Convert text place searches to coordinates | Provider-specific key, rate limits, privacy and billing; coordinate/map drawing must work without it |
| LLM API | Explain structured findings in natural language | Optional; cost, privacy, model output risk; numerical computations must not depend on it |
| Email/push service | Watchlist notifications | Optional; user consent, personal data, paid thresholds and deliverability |

Before any optional provider is integrated, Codex must deliver the Integration Proposal described in `CODEX_MASTER_PROMPT.md` and wait for explicit approval.

## 4. Basemap and terrain options

- CesiumJS is an open-source library; Cesium ion hosting/assets have separate plan terms and quotas.
- MapLibre GL JS is an open-source renderer; basemap tile service and imagery licensing are separate.
- Natural Earth can be bundled for a simple low-detail fallback.
- OpenStreetMap data is open under ODbL; the public tile service is not an unlimited free production tile CDN.
- Zenith currently references Cesium ion, Esri/ArcGIS imagery/labels and Natural Earth fallback. Codex must audit actual URLs, attribution and current usage terms before retaining these in a public deployment.
- CARTO key in the README should not be assumed necessary; inspect actual current usage before carrying the environment variable forward.

## 5. Data maturity and provenance

Every source observation must preserve:
- platform/mission;
- granule/product ID;
- product type and product version;
- maturity status (validated/provisional/beta as supplied);
- acquisition start/end time;
- footprint and CRS;
- orbit/pass direction, track/frame where applicable;
- frequency/polarization/channel where applicable;
- source DOI and original asset URL;
- QA/annotation references;
- fetch time and cache origin.

Do not treat a result as scientifically ready merely because ASF returned a granule.

## 6. Secrets and configuration policy

- `EARTHDATA_TOKEN`: server/local worker only.
- Supabase service-role key: server only.
- Public Supabase anon/publishable key: browser only if RLS is correctly configured.
- Cesium token: public/browser token only if provider documentation explicitly defines it as a public client token and terms are accepted; do not store server secrets under VITE.
- Do not commit any populated `.env` file.
- Do not ask the user to paste secret tokens into Codex chat. Ask them to place values in `.env.local` or secure provider settings and confirm configuration without displaying values.

## 7. API integration approval record

For every provider create a row in `DECISIONS_LOG.md`:
- provider;
- proposed use;
- official documentation and pricing URLs;
- auth/key required;
- data leaving user's environment;
- quota/licence/attribution;
- selected plan;
- explicit user approval date;
- files changed;
- rollback plan.
