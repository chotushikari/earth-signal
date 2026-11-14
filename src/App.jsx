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
import { Collection, InvestigationStudio, InvestigationLibrary, ReportsStudio } from './features/studio/Studio';

function useRoute() {
  const [route, setRoute] = useState(window.location.pathname + window.location.search);
  useEffect(() => { const update = () => setRoute(window.location.pathname + window.location.search); window.addEventListener('popstate', update); return () => window.removeEventListener('popstate', update); }, []);
  const navigate = (to) => { window.history.pushState({}, '', to); setRoute(window.location.pathname + window.location.search); window.scrollTo({ top: 0, behavior: 'instant' }); };
  return { path: route.split('?')[0], route, navigate };
}

function RouteView({ path, navigate }) {
  if (path === '/' || path === '/discover') return <HomePage navigate={navigate} />;
  if (path.startsWith('/topics/')) return <TopicPage topicId={path.split('/')[2]} navigate={navigate} />;
  if (path === '/explore') return <ExplorePage navigate={navigate} />;
  if (path === '/investigations') return <InvestigationLibrary navigate={navigate} />;
  if (path.startsWith('/investigate/')) return <InvestigationStudio navigate={navigate} />;
  if (path === '/my-earth') return <Collection navigate={navigate} />;
  if (path === '/reports' || path.startsWith('/reports/')) return <ReportsStudio navigate={navigate} />;
  if (path === '/methodology') return <MethodologyPage />;
  return <HomePage navigate={navigate} />;
}

export default function App() {
  const { path, route, navigate } = useRoute();
  return <AppShell path={path} navigate={navigate}><RouteView key={route} path={path} navigate={navigate} /></AppShell>;
}
