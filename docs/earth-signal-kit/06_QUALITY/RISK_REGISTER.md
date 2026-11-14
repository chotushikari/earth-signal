# Risk Register

| Risk | Severity | Mitigation / release gate |
|---|---|---|
| NISAR coverage/pair unavailable for chosen AOI | High | Run real ASF coverage audit before choosing demo regions; offer data-ready curated alternatives |
| Harmony service does not expose needed variable/product | High | Verify current supported product, variable paths and sample request before designing processor |
| Provisional data presented as validated | Critical | Store/display maturity; maturity policy in result and curated item |
| Browse RGB treated as calibrated radar measurement | Critical | Quarantine legacy sarChangeEngine; science processor accepts measured arrays/COGs only |
| Synthetic fallback shown as real observation | Critical | Separate simulation mode and type; default real-data pipeline fails closed |
| Invalid pair geometry/processing | Critical | Product-specific compatibility report and common valid grid |
| Measurement interpreted as cause | High | Separate measured change from possible explanation; explain alternatives and limitations |
| RAM/disk exhaustion | High | AOI/pixel caps, windowed processing, queue concurrency, cleanup and benchmark |
| Vercel used for long raster processing | High | Vercel only serves frontend/light APIs; local/approved worker for science jobs |
| Free-tier quota/plan changes | Medium | Recheck provider pricing; monitor quotas; no paid upgrade without approval |
| Cesium/Esri/CARTO licensing mismatch | High | Verify exact terms and attribution before public deployment; alternate map renderer/source if required |
| Exposed Earthdata/Supabase keys | Critical | Server-only secrets, scan client bundle, secret scanning and rotation procedure |
| Public watchpoint write/delete policies | High | Authenticated ownership, RLS tests and migrations |
| Search cache reports stale result as live | High | Cache metadata, source label and fetched-at timestamp |
| API upstream failure | Medium | Structured errors, retries with backoff, cache fallback explicitly labelled |
| Public contextual API rate limits | Medium | Ask approval, cache, batch, throttle and attribute |
| LLM hallucination | Medium | LLM optional, constrained to structured evidence, no numerical calculation |
| Product scope expands to six unfinished processors | High | Only mark a lens Ready after acceptance tests; prioritize two vertical slices |
