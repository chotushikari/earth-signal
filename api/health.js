export default function handler(req,res) {
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  res.setHeader('Cache-Control','no-store');
  const accountConfigured=!!(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY);
  return res.status(200).json({service:'Earth Signal',version:2,capabilities:{catalog:'live-public-asf',protectedAssets:!!process.env.EARTHDATA_TOKEN,savedPlaces:accountConfigured?'browser-local-and-cloud-merge':'browser-local',remoteAccounts:accountConfigured?'supabase-configured':'not_connected',scienceProcessing:'not_connected',reports:'demonstration'},checkedAt:new Date().toISOString()});
}
