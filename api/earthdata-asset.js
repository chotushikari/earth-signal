const HOSTS = new Set(['nisar.asf.earthdatacloud.nasa.gov','datapool.asf.alaska.edu','cumulus.asf.earthdatacloud.nasa.gov']);
const MAX_BYTES = 3 * 1024 * 1024;
export default async function handler(req,res) {
  res.setHeader('Cache-Control','private, no-store');
  if (req.method !== 'GET') return res.status(405).json({error:'Method not allowed'});
  let url;
  try {url=new URL(req.query?.url);} catch {return res.status(400).json({error:'A valid asset URL is required.'});}
  if (url.protocol!=='https:' || !HOSTS.has(url.hostname) || url.username || url.password || url.port || !/\.(png|xml|ya?ml|csv)$/i.test(url.pathname)) return res.status(403).json({error:'Only small NASA browse images and metadata are supported. Science files require the extraction worker.'});
  const token=(process.env.EARTHDATA_TOKEN || '').trim();
  if (!token) return res.status(503).json({code:'EARTHDATA_NOT_CONFIGURED',error:'Protected NASA assets are not configured.'});
  try {
    const upstream=await fetch(url,{redirect:'manual',headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(15000)});
    if (!upstream.ok) return res.status(502).json({error:'NASA asset access failed. Authentication or redirected access may be required.'});
    if (Number(upstream.headers.get('content-length'))>MAX_BYTES) {await upstream.body?.cancel();return res.status(413).json({error:'Asset exceeds the browse limit.'});}
    let size=0; const chunks=[];
    for await (const chunk of upstream.body) {size+=chunk.length;if(size>MAX_BYTES) return res.status(413).json({error:'Asset exceeds the browse limit.'});chunks.push(chunk);}
    const type=upstream.headers.get('content-type') || 'application/octet-stream';
    if (type.includes('text/html')) return res.status(502).json({error:'NASA returned an authentication page.'});
    res.setHeader('Content-Type',type);res.setHeader('X-Content-Type-Options','nosniff');
    return res.status(200).send(Buffer.concat(chunks));
  } catch {return res.status(502).json({error:'NASA asset request could not be completed.'});}
}
