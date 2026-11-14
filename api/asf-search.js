import crypto from 'node:crypto';
const PRODUCTS = new Set(['GCOV','GUNW','GOFF','SME2','GSLC','RSLC','RIFG','RUNW','ROFF','L0B']);
export function buildSearchParams(query = {}) {
  const params = new URLSearchParams({dataset:'NISAR', output:'json'});
  const limit = Number(query.maxResults ?? 80);
  if (!Number.isInteger(limit) || limit < 1 || limit > 250) throw new Error('maxResults must be an integer from 1 to 250.');
  params.set('maxResults', String(limit));
  if (query.processingLevel) {
    const product = String(query.processingLevel).toUpperCase();
    if (!PRODUCTS.has(product)) throw new Error('Unsupported NISAR science product.');
    params.set('processingLevel', product);
  }
  for (const name of ['start','end']) if (query[name]) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(query[name]) || Number.isNaN(Date.parse(query[name])) || new Date(query[name]).toISOString().slice(0,10) !== query[name]) throw new Error(`${name} must be a valid YYYY-MM-DD date.`);
    params.set(name, query[name]);
  }
  if (query.start && query.end && query.start > query.end) throw new Error('Start date must precede end date.');
  if (query.lat != null || query.lon != null) {
    if (query.lat == null || query.lon == null || String(query.lat).trim()==='' || String(query.lon).trim()==='') throw new Error('Latitude and longitude are both required.');
    const lat = Number(query.lat), lon = Number(query.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat)>90 || Math.abs(lon)>180) throw new Error('Coordinates are outside valid geographic bounds.');
    params.set('intersectsWith', `POINT(${lon} ${lat})`);
  } else if (query.intersectsWith) {
    const wkt = String(query.intersectsWith);
    if (wkt.length > 6000 || !/^(POINT|POLYGON|MULTIPOLYGON)\s*\([\d\s.,()+-]+\)$/i.test(wkt)) throw new Error('Invalid or oversized WKT geometry.');
    params.set('intersectsWith', wkt);
  }
  return params;
}
export default async function handler(req, res) {
  res.setHeader('X-Request-ID', crypto.randomUUID());
  if (req.method !== 'GET') { res.setHeader('Allow','GET'); return res.status(405).json({error:'Method not allowed',code:'METHOD_NOT_ALLOWED'}); }
  let params;
  try { params = buildSearchParams(req.query); } catch (error) { return res.status(400).json({error:error.message,code:'INVALID_SEARCH'}); }
  try {
    const upstream = await fetch(`https://api.daac.asf.alaska.edu/services/search/param?${params}`, {headers:{Accept:'application/json','User-Agent':'EarthSignal/2.0'},signal:AbortSignal.timeout(20000)});
    if (!upstream.ok) return res.status(502).json({error:`ASF search is unavailable (HTTP ${upstream.status}).`,code:'ASF_UNAVAILABLE'});
    const payload = await upstream.json();
    if (!Array.isArray(payload)) return res.status(502).json({error:'Unexpected ASF response.',code:'INVALID_UPSTREAM'});
    res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({source:'ASF Search',fetchedAt:new Date().toISOString(),query:Object.fromEntries(params),limit:Number(params.get('maxResults')),records:payload.length===1 && Array.isArray(payload[0]) ? payload[0] : payload});
  } catch { return res.status(502).json({error:'ASF search timed out or could not be reached. Please retry.',code:'ASF_UNAVAILABLE'}); }
}
