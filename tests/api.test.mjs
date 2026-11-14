import assert from 'node:assert/strict';
import { buildSearchParams, default as search } from '../api/asf-search.js';
import asset from '../api/earthdata-asset.js';
import watchpoints from '../api/watchpoints.js';
import health from '../api/health.js';
function response(){return {headers:{},statusCode:200,setHeader(k,v){this.headers[k]=v;},status(code){this.statusCode=code;return this;},json(body){this.body=body;return this;},send(body){this.body=body;return this;}};}
assert.equal(buildSearchParams({lat:'21.95',lon:'88.77'}).get('intersectsWith'),'POINT(88.77 21.95)');
for(const query of [{maxResults:-1},{maxResults:251},{lat:''},{lat:91,lon:0},{processingLevel:'FAKE'},{start:'2026-02-30'},{start:'2026-09-01',end:'2026-01-01'}]) assert.throws(()=>buildSearchParams(query));
const originalFetch=globalThis.fetch;
try {
 globalThis.fetch=async()=>({ok:true,json:async()=>[[{granuleName:'test'}]]});
 let res=response();await search({method:'GET',query:{maxResults:1}},res);assert.equal(res.statusCode,200);assert.equal(res.body.records.length,1);assert.equal(res.body.source,'ASF Search');
 globalThis.fetch=async()=>{throw new Error('SECRET must not leak');};
 res=response();await search({method:'GET',query:{}},res);assert.equal(res.statusCode,502);assert(!JSON.stringify(res.body).includes('SECRET'));
 res=response();await search({method:'POST'},res);assert.equal(res.statusCode,405);
 res=response();await asset({method:'GET',query:{url:'https://example.com/private.png'}},res);assert.equal(res.statusCode,403);
 res=response();await asset({method:'GET',query:{url:'https://nisar.asf.earthdatacloud.nasa.gov/full.h5'}},res);assert.equal(res.statusCode,403);
 res=response();await watchpoints({method:'DELETE'},res);assert.equal(res.statusCode,501);
 res=response();await watchpoints({method:'GET'},res);assert.deepEqual(res.body.watchpoints,[]);
 res=response();health({method:'GET'},res);assert.equal(res.body.capabilities.scienceProcessing,'not_connected');
} finally {globalThis.fetch=originalFetch;}
console.log('API validation, error redaction, asset boundaries and watchpoint write protection passed.');
