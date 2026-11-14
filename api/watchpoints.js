// Remote saves require verified user identity and per-user ownership policies.
export default function handler(req, res) {
  res.setHeader('Cache-Control','no-store');
  if (req.method === 'GET') return res.status(200).json({source:'not_configured',watchpoints:[],status:'Authentication and per-user storage are pending.'});
  return res.status(501).json({code:'AUTH_NOT_CONFIGURED',error:'Remote watchpoint writes are not enabled. Use My Earth local saves.'});
}
