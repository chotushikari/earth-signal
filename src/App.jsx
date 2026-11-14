import { useEffect, useState } from 'react';
import AppShell from './components/AppShell';
import HomePage from './features/discovery/HomePage';
import TopicPage from './features/topics/TopicPage';
import ExplorePage from './features/explore/ExplorePage';
import InvestigationPage from './features/investigate/InvestigationPage';
import InvestigationsPage from './features/investigate/InvestigationsPage';
import MyEarthPage from './features/account/MyEarthPage';
import ReportPage from './features/reports/ReportPage';
import MethodologyPage from './features/methodology/MethodologyPage';

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => { const update = () => setPath(window.location.pathname); window.addEventListener('popstate', update); return () => window.removeEventListener('popstate', update); }, []);
  const navigate = (to) => { window.history.pushState({}, '', to); setPath(window.location.pathname); window.scrollTo({ top: 0, behavior: 'instant' }); };
  return { path, navigate };
}

function RouteView({ path, navigate }) {
  if (path === '/' || path === '/discover') return <HomePage navigate={navigate} />;
  if (path.startsWith('/topics/')) return <TopicPage topicId={path.split('/')[2]} navigate={navigate} />;
  if (path === '/explore') return <ExplorePage navigate={navigate} />;
  if (path === '/investigations') return <InvestigationsPage navigate={navigate} />;
  if (path.startsWith('/investigate/')) return <InvestigationPage navigate={navigate} />;
  if (path === '/my-earth') return <MyEarthPage navigate={navigate} />;
  if (path === '/reports' || path.startsWith('/reports/')) return <ReportPage navigate={navigate} />;
  if (path === '/methodology') return <MethodologyPage />;
  return <HomePage navigate={navigate} />;
}

export default function App() {
  const { path, navigate } = useRoute();
  return <AppShell path={path} navigate={navigate}><RouteView path={path} navigate={navigate} /></AppShell>;
}
