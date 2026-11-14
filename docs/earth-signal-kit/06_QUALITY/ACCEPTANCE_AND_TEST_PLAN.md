# Acceptance Criteria and Test Plan

## 1. Product acceptance

- A new user can select a topic or search a place without knowing product abbreviations.
- Every topic shows Ready/Limited/Not yet supported honestly.
- User can search an AOI and see live/cached data provenance.
- Readiness report explains why a comparison is or is not possible.
- Investigation result has map, dates, measured values, units, evidence and limitations.
- User can view the technical metadata without losing the plain-language explanation.
- Watchlist writes are private to the correct user or explicitly local-only.
- A result can be reopened using its evidence record.

## 2. Scientific acceptance

### SME2
- Correct variable path verified from actual product guide/source HDF5.
- Units, fill values, masks, uncertainty and maturity handled.
- Stats reproduce a small reference calculation within documented tolerance.
- Date comparison uses common valid grid and compatible algorithms/products.
- Results clearly distinguish measured moisture difference from interpretation.

### GCOV
- Correct calibrated measurement variable and units selected.
- Never process browse image RGB as science data.
- Apply valid/QA masks and preserve nodata.
- Only compare compatible channel/frequency/polarization and spatially aligned observations.
- dB conversion used only for suitable calibrated linear-power input.
- Test known arrays produce expected delta/statistics.

### GUNW (before `Ready`)
- Phase, coherence, connected components and product conventions documented.
- Phase-to-LOS conversion tested with correct wavelength/convention.
- Reference/correction policy documented.
- Invalid low-quality regions masked.
- LOS not mislabeled as vertical displacement.

### GOFF (before `Ready`)
- Offset variables and units verified.
- SNR/quality and nodata handling tested.
- Vector direction/geometry transformation validated.
- Velocity has explicit interval and units.

## 3. Data contract tests

- ASF response normalization handles wrapped and flat results.
- Missing optional fields remain null.
- Invalid WKT/GeoJSON does not crash the whole catalog.
- Product type, maturity and date parsing are stable.
- Pairing excludes incompatible records.
- AOI validation rejects invalid coordinate order/geometry.
- Cache records show fetched-at and source.

## 4. API/security tests

- Earthdata token absent -> actionable auth error, no secret leak.
- Browser bundle contains no Earthdata token or Supabase service-role key.
- Asset proxy rejects non-HTTPS and unapproved hosts.
- Requests have size/time/concurrency bounds.
- User A cannot read/update/delete User B watchlist items.
- Invalid requests return structured error codes.
- DB failure is not reported as successful write.
- RLS is tested in integration tests.

## 5. UI tests

- Loading, empty, stale, partial, error, no-data and not-ready states.
- Map layer legend and units always visible.
- Mobile responsive layout.
- Keyboard navigation and focus.
- Screen reader labels for non-map controls.
- User can access tabular summary without map interaction.
- Simulated data is visibly identified and cannot be mistaken for real data.

## 6. Performance tests

Record for each AOI:
- data extracted bytes;
- output dimensions;
- processing wall time;
- peak RAM;
- disk high-water mark;
- valid pixel fraction;
- output bytes;
- API request counts and provider time.

Use a small, medium and upper-bound AOI. Set explicit max pixel count and job concurrency based on benchmark results.

## 7. Release gate

Do not call a release ready until:
- frontend build passes;
- Python tests pass;
- lint/type checks pass where configured;
- one real SME2 vertical slice is reproducible;
- one real GCOV vertical slice is reproducible, or it is clearly marked Limited if data availability blocks it;
- no secrets in repository/build artifacts;
- data maturity and provenance are shown;
- no synthetic fallback leaks into real outputs;
- provider licenses/attributions are documented;
- all incomplete lenses are marked honestly.
