import assert from 'node:assert/strict';

const base = process.argv[2] || 'http://127.0.0.1:5173';
const products = {
  SME2: [
    'NISAR_L3_PR_SME2_032_113_A_006_4005_DHDH_A_20261008T003206_20261008T003233_P05023_N_F_J_001',
    'NISAR_L3_PR_SME2_033_113_A_006_4005_DHDH_A_20261020T003206_20261020T003233_P05023_N_F_J_001',
  ],
  GUNW: ['NISAR_L2_UR_GUNW_033_077_D_084_034_4000_SH_20261017T132026_20261017T132059_20261029T132026_20261029T132100_P05023_F_F_J_001'],
  GOFF: ['NISAR_L2_UR_GOFF_033_077_D_084_034_4000_SH_20261017T132026_20261017T132059_20261029T132026_20261029T132100_P05023_F_F_J_001'],
};
const selected = process.argv[3] ? [process.argv[3].toUpperCase()] : Object.keys(products);

for (const product of selected) {
  const granules = products[product];
  assert(granules, `Unknown test product ${product}.`);
  const response = await fetch(new URL('/api/gcov', base), {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({granules,lat:9.62,lon:76.34,minQuality:0.3}),
    signal:AbortSignal.timeout(115_000),
  });
  const data = await response.json();
  assert.equal(response.status,200,`${product}: ${data.error || 'Request failed'}`);
  assert.equal(data.product,product);
  assert.deepEqual(data.sources.map(source => source.granule),granules);
  assert.ok(data.validPixels > 0 && data.validPixels <= data.totalPixels);
  assert.equal(data.pixelValues[0].filter(value => value !== null).length,data.validPixels);
  assert.ok(data.medians.every(Number.isFinite));
  assert.ok(data.previews.every(preview => preview.startsWith('data:image/png;base64,iVBORw0KGgo')));
  console.log(`${product}: ${data.validPixels} valid pixels; median ${data.medians.join(', ')} ${data.unit}.`);
}
