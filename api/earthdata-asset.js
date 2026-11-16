const HOSTS = new Set(['nisar.asf.earthdatacloud.nasa.gov','datapool.asf.alaska.edu','cumulus.asf.earthdatacloud.nasa.gov']);
const MAX_BYTES = 3 * 1024 * 1024;
const BROWSE_CDN_HOSTS=new Set(['d1mv8zhcvry6x4.cloudfront.net']);
export default async function handler(req,res) {
  res.setHeader('Cache-Control','private, no-store');
  if (req.method !== 'GET') return res.status(405).json({error:'Method not allowed'});
  let url;
  try {url=new URL(req.query?.url);} catch {return res.status(400).json({error:'A valid asset URL is required.'});}
  if (url.protocol!=='https:' || !HOSTS.has(url.hostname) || url.username || url.password || url.port || !/\.(png|xml|ya?ml|csv)$/i.test(url.pathname)) return res.status(403).json({error:'Only small NASA browse images and metadata are supported. Science files require the extraction worker.'});
  const token=(process.env.EARTHDATA_TOKEN || '').trim();
  if (!token) return res.status(503).json({code:'EARTHDATA_NOT_CONFIGURED',error:'Protected NASA assets are not configured.'});
  try {
    const signal=AbortSignal.timeout(15000);
    let target=url,upstream;
    for(let redirects=0;redirects<4;redirects++){
      upstream=await fetch(target,{redirect:'manual',headers:HOSTS.has(target.hostname)?{Authorization:`Bearer ${token}`}:{},signal});
      if(![301,302,303,307,308].includes(upstream.status))break;
      const next=new URL(upstream.headers.get('location')||'',target);
      await upstream.body?.cancel();
      if(next.protocol!=='https:'||next.username||next.password||next.port||(!HOSTS.has(next.hostname)&&!BROWSE_CDN_HOSTS.has(next.hostname)))return res.status(502).json({error:'NASA browse redirect requires an unsupported authentication route.'});
      target=next;
    }
    if (!upstream.ok) return res.status(502).json({error:'NASA asset access failed. Authentication or redirected access may be required.'});
    if (Number(upstream.headers.get('content-length'))>MAX_BYTES) {await upstream.body?.cancel();return res.status(413).json({error:'Asset exceeds the browse limit.'});}
    let size=0; const chunks=[];
    for await (const chunk of upstream.body) {size+=chunk.length;if(size>MAX_BYTES) return res.status(413).json({error:'Asset exceeds the browse limit.'});chunks.push(chunk);}
    const upstreamType=upstream.headers.get('content-type') || 'application/octet-stream';
    if (upstreamType.includes('text/html')) return res.status(502).json({error:'NASA returned an authentication page.'});
    const bytes=Buffer.concat(chunks);
    const png=url.pathname.toLowerCase().endsWith('.png');
    if(png&&!bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')))return res.status(502).json({error:'NASA did not return a valid PNG preview.'});
    const type=png?'image/png':upstreamType;
    res.setHeader('Content-Type',type);res.setHeader('X-Content-Type-Options','nosniff');
    return res.status(200).send(bytes);
  } catch {return res.status(502).json({error:'NASA asset request could not be completed.'});}
}
