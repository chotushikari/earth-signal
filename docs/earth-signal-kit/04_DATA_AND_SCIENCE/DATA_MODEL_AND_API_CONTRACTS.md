# Data Model and API Contracts

## 1. Core entities

### AreaOfInterest

```json
{
  "id": "aoi_uuid",
  "name": "User supplied name",
  "geometry": {"type": "Polygon", "coordinates": []},
  "crs": "EPSG:4326",
  "created_at": "ISO-8601"
}
```

Validate polygon closure, coordinate bounds, geometry validity, max vertex count and area limits.

### Observation

```json
{
  "granule_id": "source granule identifier",
  "mission": "NISAR",
  "product_type": "SME2|GCOV|GUNW|GOFF",
  "product_version": null,
  "maturity": "validated|provisional|beta|unknown",
  "start_time": "ISO-8601",
  "stop_time": "ISO-8601",
  "footprint": {"type": "Polygon", "coordinates": []},
  "track": null,
  "frame": null,
  "pass_direction": null,
  "frequency": null,
  "polarization": null,
  "source_url": "https://...",
  "doi": null,
  "assets": [],
  "qa_assets": []
}
```

Use null when source metadata is absent; do not synthesize metadata.

### ReadinessReport

```json
{
  "status": "ready|limited|not_ready",
  "topic": "soil|water|forest|ground|ice",
  "aoi_id": "aoi_uuid",
  "candidate_observations": [],
  "compatible_groups": [],
  "checks": [
    {"code": "SPATIAL_OVERLAP", "status": "pass|warn|fail", "detail": "..."}
  ],
  "blockers": [],
  "warnings": []
}
```

### InvestigationJob

```json
{
  "job_id": "job_uuid",
  "status": "queued|extracting|processing|succeeded|limited|failed|cancelled",
  "processor": "sme2|gcov|gunw|goff",
  "created_at": "ISO-8601",
  "updated_at": "ISO-8601",
  "progress_stage": "human-readable stage",
  "error_code": null,
  "result_id": null
}
```

### InvestigationResult

```json
{
  "result_id": "result_uuid",
  "status": "ready|limited|not_ready|failed",
  "topic": "soil",
  "processor": "sme2",
  "summary": "Plain-language evidence summary",
  "measurements": [],
  "observation_ids": [],
  "aoi": {},
  "valid_coverage_fraction": null,
  "quality_summary": {},
  "uncertainty_summary": {},
  "layers": [],
  "evidence_id": "evidence_uuid",
  "limitations": [],
  "created_at": "ISO-8601"
}
```

### Measurement

```json
{
  "name": "mean_delta_soil_moisture",
  "value": 0.07,
  "unit": "m3/m3",
  "statistic": "mean",
  "valid_pixel_count": 100,
  "method": "documented algorithm identifier"
}
```

### EvidenceRecord

Must include exact source granules, source URLs/DOIs, product maturity, variable paths, units, request/extraction metadata, AOI, time interval, processor version, parameters, CRS, masks/QA references, output checksums, software environment, created time, limitations and warnings.

## 2. Suggested app API contracts

These are Earth Signal APIs to design; they are not NASA endpoints.

| Method/path | Purpose |
|---|---|
| `GET /api/v1/discovery/lenses` | Return supported topic lenses and truthful readiness status |
| `GET /api/v1/discovery/regions` | Return curated regions backed by verified records |
| `POST /api/v1/observations/search` | Search ASF for a validated AOI/topic/date range |
| `POST /api/v1/readiness` | Evaluate product availability and pair compatibility |
| `POST /api/v1/investigations` | Create a job for an approved analysis |
| `GET /api/v1/jobs/{job_id}` | Get extraction/processing status |
| `GET /api/v1/results/{result_id}` | Retrieve result summary/layers/evidence pointer |
| `GET /api/v1/results/{result_id}/evidence` | Retrieve full provenance/methodology record |
| `GET /api/v1/watchlist` | Retrieve user's saved AOIs/topics |
| `POST /api/v1/watchlist` | Save a location/topic |
| `DELETE /api/v1/watchlist/{id}` | Remove user's saved item |

## 3. Job execution

- Long work must be asynchronous from the UI perspective.
- API validates and submits a job; worker tracks each stage.
- Job creation should be idempotent when the same request fingerprint is submitted.
- Frontend polls with bounded interval or uses a later approved push mechanism.
- Worker concurrency and input sizes are bounded.
- The browser never receives Earthdata bearer tokens.

## 4. Database tables (initial proposal)

- `profiles` — optional authenticated user profile.
- `areas_of_interest` — AOI geometry, label, owner, timestamps.
- `observations` — normalized NASA granule metadata and source.
- `readiness_reports` — compatibility checks and reason codes.
- `investigation_jobs` — state and stage.
- `investigation_results` — summaries, measurement JSON and output refs.
- `evidence_records` — complete provenance and parameters.
- `result_layers` — storage key, media type, CRS, bounds and checksum.
- `watchlist_items` — user-owned AOIs/topics.

Use migrations, not destructive schema resets. Apply RLS to user-owned records. Public curated results can be explicitly marked public/read-only.

## 5. Error response

```json
{
  "error": {
    "code": "NO_COMPATIBLE_OBSERVATIONS",
    "message": "There are observations, but no compatible pair for this analysis.",
    "request_id": "req_uuid",
    "details": {"reason_codes": ["PRODUCT_MISMATCH", "NO_COMMON_VALID_COVERAGE"]}
  }
}
```

Do not send stack traces, tokens or raw provider auth responses to the browser.
