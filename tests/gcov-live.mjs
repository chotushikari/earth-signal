import assert from 'node:assert/strict';

const base = process.argv[2] || 'http://127.0.0.1:5173';
const a = 'NISAR_L2_PR_GCOV_033_113_A_006_4005_DHDH_A_20261020T003206_20261020T003233_P05023_N_F_J_001';
const b = 'NISAR_L2_UR_GCOV_035_113_A_006_4005_DHDH_A_20261113T003207_20261113T003234_P05036_F_F_J_001';
const response = await fetch(new URL('/api/gcov', base), {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({granules: [a, b], lat: 9.62, lon: 76.34}),
  signal: AbortSignal.timeout(115_000),
});
const result = await response.json();
assert.equal(response.status, 200, result.error);
assert.deepEqual(result.sources.map(source => source.granule), [a, b]);
assert.equal(result.sources[0].dataset, '/science/LSAR/GCOV/grids/frequencyA/HHHH');
assert.deepEqual(result.sources[0].firstPixelCenter, result.sources[1].firstPixelCenter);
assert.equal(result.validPixels, 16_384);
assert.ok(Math.abs(result.medianChangeDb - (-0.89)) <= 0.01);
for (const preview of [...result.previews, result.changePreview]) {
  assert.ok(preview.startsWith('data:image/png;base64,iVBORw0KGgo'));
}
console.log(`Live ASF GCOV comparison passed: ${result.validPixels} matched pixels, ${result.medianChangeDb} dB median difference.`);
