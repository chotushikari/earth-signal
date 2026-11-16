import { normalizeCatalog } from '../../features/explorer/catalog.js';
import { rectangleArea, resolveLocation } from './location.js';
import {topicProducts} from '../../data/topics.js';

export const DATASET_VERSION = 1;
const key = 'earth-signal-datasets';
export const recordId = record => record.granuleName || record.granuleUr;
export function contextFromSearch(search) {
  const p = new URLSearchParams(search);
  const area = p.has('bounds') ? rectangleArea(p.get('bounds').split(',')) : null;
  const place = area || resolveLocation(p.has('lat') ? `${p.get('lat')}, ${p.get('lon')}` : 'Vembanad Lake, Kerala');
  const product=p.get('product')==='all'?'':p.get('product') ?? topicProducts[p.get('topic')] ?? 'GCOV';
  return {place, area: area?.valid ? area : null, product, start:p.get('start') || '', end:p.get('end') || '', orbit:p.get('orbit')||'', track:p.get('track')||'', limit:p.get('limit')||'80', mode:p.get('mode') === 'snapshot' ? 'snapshot' : 'live'};
}
export function contextParams(context) {
  const p = new URLSearchParams();
  if(context.area?.bounds) p.set('bounds',context.area.bounds.join(','));
  else if(context.place?.valid){p.set('lat',context.place.latitude);p.set('lon',context.place.longitude);}
  p.set('product',context.product||'all');
  if(context.start)p.set('start',context.start);
  if(context.end)p.set('end',context.end);
  if(context.orbit)p.set('orbit',context.orbit);
  if(context.track)p.set('track',context.track);
  if(context.limit&&context.limit!=='80')p.set('limit',context.limit);
  if(context.mode === 'snapshot')p.set('mode','snapshot');
  return p;
}
export function searchParams(context, product = context.product, limit = context.limit || 80) {
  const p = new URLSearchParams({maxResults:String(limit)});
  if(context.area?.wkt)p.set('intersectsWith',context.area.wkt);
  else if(context.place?.valid){p.set('lat',context.place.latitude);p.set('lon',context.place.longitude);}
  else throw new Error('Choose a valid location or area before searching.');
  if(product)p.set('processingLevel',product);
  if(context.start)p.set('start',context.start);
  if(context.end)p.set('end',context.end);
  if(context.orbit)p.set('orbit',context.orbit);
  if(context.track)p.set('track',context.track);
  return p;
}
export function makeDataset(body, context, id = crypto.randomUUID()) {
  if(!Array.isArray(body.records))throw new Error('Unexpected catalog response.');
  const seen = new Set();
  const records = body.records.filter(r=>r && recordId(r) && !seen.has(recordId(r)) && seen.add(recordId(r)));
  return {version:DATASET_VERSION,id,context,source:context.mode==='snapshot'?'Bundled reference snapshot':'ASF Search',fetchedAt:body.fetchedAt||new Date().toISOString(),query:body.query||{},limit:body.limit??80,records};
}
export function storeDataset(dataset) {
  try {const previous=JSON.parse(sessionStorage.getItem(key)||'[]');sessionStorage.setItem(key,JSON.stringify([dataset,...previous.filter(d=>d.id!==dataset.id)].slice(0,6)));}catch{/* Export remains available if browser storage is full. */}
  return dataset;
}
export function loadDataset(id) {
  try {return JSON.parse(sessionStorage.getItem(key)||'[]').find(d=>d.id===id&&d.version===DATASET_VERSION)||null;}catch{return null;}
}
export function datasetRoute(path,dataset,extra={}) {
  const p=contextParams(dataset.context);p.set('dataset',dataset.id);for(const [k,v]of Object.entries(extra))if(v)p.set(k,v);return `${path}?${p}`;
}
export async function fetchDataset(context, signal, product=context.product) {
  if(context.mode==='snapshot')throw new Error('Open the reference snapshot in Explore. Live evidence cannot be reconstructed from a reference mode.');
  const response=await fetch(`/api/asf-search?${searchParams(context,product)}`,{signal});
  const body=await response.json();if(!response.ok)throw new Error(body.error||'Catalog request failed. Please retry.');
  return storeDataset(makeDataset(body,{...context,product}));
}
function metadata(record) {
  const tokens=String(recordId(record)||'').split('_');
  const track=record.track??record.relativeOrbit??record.pathNumber;
  const frame=record.frameNumber;
  const polarization=record.polarization||record.nisar?.mainBandPolarization?.join(',')||record.nisar?.sideBandPolarization?.join(',')||'';
  return {product:record.processingLevel,track:track==null?'':String(track),frame:frame==null?'':String(frame),direction:record.flightDirection||'',sensor:record.sensor||'',polarization,configuration:tokens.length>10?tokens.slice(8,11).join('_'):'',version:record.pgeVersion||''};
}
export function screenPair(a,b) {
  if(!a||!b)return {status:'needs_selection',reasons:['Select two acquisitions.'],candidate:false};
  const reasons=[];const x=metadata(a),y=metadata(b);
  if(recordId(a)===recordId(b))reasons.push('Choose two different source records.');
  if(!a.startTime||!b.startTime||Number.isNaN(Date.parse(a.startTime))||Number.isNaN(Date.parse(b.startTime))||a.startTime.slice(0,10)===b.startTime.slice(0,10))reasons.push('Two distinct, valid acquisition dates are required.');
  for(const field of ['product','track','frame','direction','sensor','polarization','configuration','version']){
    if(!x[field]||!y[field])reasons.push(`${field}: source metadata is incomplete.`);
    else if(x[field]!==y[field])reasons.push(`${field}: source values differ.`);
  }
  if(normalizeCatalog([a,b]).features.length!==2)reasons.push('Both records need valid source geometry.');
  return {status:reasons.length?'limited':'candidate',candidate:!reasons.length,reasons:reasons.length?reasons:['Metadata matches. Common valid pixels, calibration, grid alignment and QA remain unverified.']};
}
export function candidatePairs(records) {
  const groups=new Map();
  const pairs=[];
  for(const record of records){
    const {startTime}=record;
    const fields=Object.values(metadata(record));
    if(!startTime||Number.isNaN(Date.parse(startTime))||fields.some(value=>!value))continue;
    if(normalizeCatalog([record]).features.length!==1)continue;
    const key=JSON.stringify(fields);
    const group=groups.get(key)||[];
    const id=recordId(record);
    for(const previous of group){
      if(recordId(previous)!==id&&previous.startTime.slice(0,10)!==startTime.slice(0,10)){
        pairs.push([recordId(previous),id]);
      }
    }
    group.push(record);
    groups.set(key,group);
  }
  return pairs;
}
export function browseUrl(record) {
  return browseCandidates(record)[0] || null;
}
export function browseCandidates(record) {
  const urls=Array.isArray(record?.browse)?record.browse:[];
  const candidates=[...urls,record?.thumbnailUrl].filter(u=>typeof u==='string'&&/^https:\/\/nisar\.asf\.earthdatacloud\.nasa\.gov\/[^?#]+\.png$/i.test(u));
  const geographic=candidates.filter(u=>/_LATLON\.png$/i.test(u));
  return [...new Set([...geographic,...candidates])];
}
export function evidenceManifest(dataset,selected=[]) {
  const records=selected.length?dataset.records.filter(r=>selected.includes(recordId(r))):dataset.records;
  return {schema:'earth-signal.evidence.v1',exportedAt:new Date().toISOString(),source:dataset.source,fetchedAt:dataset.fetchedAt,query:dataset.query,context:dataset.context,searchLimit:dataset.limit,returnedRecords:dataset.records.length,records,screening:records.length===2?screenPair(...records):null,science:{status:'not_run',measurements:null,reason:'Calibrated arrays, common valid coverage and quality masks have not been processed.'}};
}
export function downloadJson(value,name) {
  const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
