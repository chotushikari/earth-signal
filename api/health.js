export default function handler(req,res) {
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  res.setHeader('Cache-Control','no-store');
  const accountConfigured=!!(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY);
  const earthdataConfigured=Boolean(process.env.EARTHDATA_TOKEN?.trim());
  return res.status(200).json({service:'Earth Signal',version:2,capabilities:{catalog:'live-public-asf',protectedAssets:earthdataConfigured,savedPlaces:accountConfigured?'browser-local-and-cloud-merge':'browser-local',remoteAccounts:accountConfigured?'supabase-configured':'not_connected',scienceProcessing:earthdataConfigured?'gcov-window-configured':'not_connected',reports:'source-evidence-and-gcov-window'},checkedAt:new Date().toISOString()});
}
