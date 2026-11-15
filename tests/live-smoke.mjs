import assert from 'node:assert/strict';
const base = process.argv[2] || 'http://127.0.0.1:5173';
const health=await fetch(`${base}/api/health`).then(r=>r.json());
assert.equal(health.service,'Earth Signal');
const response=await fetch(`${base}/api/asf-search?maxResults=2&processingLevel=GCOV`);
const data=await response.json();assert.equal(response.status,200,JSON.stringify(data));
assert.equal(data.source,'ASF Search');assert(Array.isArray(data.records));
if(data.records.length){
 const exact=await fetch(`${base}/api/asf-search?${new URLSearchParams({granule:data.records[0].granuleName,maxResults:'1'})}`);const detail=await exact.json();assert.equal(exact.status,200,JSON.stringify(detail));assert.equal(detail.records[0]?.granuleName,data.records[0].granuleName);
 const browse=data.records[0].browse?.find?.(url=>typeof url==='string'&&url.includes('thumbnail'));
 if(browse&&health.capabilities.protectedAssets){const image=await fetch(`${base}/api/earthdata-asset?${new URLSearchParams({url:browse})}`);assert.equal(image.status,200);assert.equal(image.headers.get('content-type'),'image/png');assert((await image.arrayBuffer()).byteLength>100);}
}
const invalid=await fetch(`${base}/api/asf-search?lat=100&lon=0`);assert.equal(invalid.status,400);
const mutation=await fetch(`${base}/api/watchpoints`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(mutation.status,501);
console.log(JSON.stringify({base,health:'passed',liveSearch:'passed',records:data.records.length,validation:'passed',publicWriteBlocked:'passed'}));
