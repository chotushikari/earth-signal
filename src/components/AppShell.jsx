import { Bell, Bookmark, CircleUserRound, FileText, House, Layers3, Map, Menu, RadioTower, Snowflake, Sprout, Trees, Waves } from 'lucide-react';
import { useState } from 'react';
import { Brand, Drawer, SearchBox } from './ui';
import { parseCoordinatePair } from '../services/discovery/coordinates';
import SourcePartners from './SourcePartners';

const links = [
  ['/', 'Discover', House],
  ['/explore', 'Explore map', Map],
  ['/investigations', 'Investigate', Layers3],
  ['/my-earth', 'My Earth', Bookmark],
  ['/reports', 'Reports', FileText],
];
const discoverLinks = [...links.slice(0,2), ['/explore?readiness=1','Data Readiness',Layers3], ...links.slice(2)];

export default function AppShell({ path, navigate, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const submit = (event) => { event.preventDefault(); const [latitude, longitude] = query.split(','); const parsed = parseCoordinatePair(latitude, longitude); if (!parsed.valid) { setSearchError(parsed.error); return; } setSearchError(''); navigate(`/explore?lat=${parsed.latitude}&lon=${parsed.longitude}`); };
  const nav = (href) => (event) => { event.preventDefault(); navigate(href); setMenuOpen(false); };
  const isDiscover = path === '/' || path === '/discover';
  return <div className={`app-shell ${isDiscover ? 'discover-shell' : ''}`}>
    <header className={`app-topbar ${isDiscover ? 'discover-topbar' : ''}`}>
      <a className="brand-link" href="/" onClick={nav('/')}><Brand tagline={isDiscover} /></a>
      {!isDiscover && <nav className="primary-nav" aria-label="Primary navigation">{links.map(([href, label, Icon]) => <a key={href} className={path === href || (href === '/investigations' && path.startsWith('/investigate/')) ? 'active' : ''} href={href} onClick={nav(href)}><Icon size={17} aria-hidden="true" />{label}</a>)}</nav>}
      <div className="nav-actions">{isDiscover ? <SourcePartners navigate={navigate}/> : <><SearchBox compact value={query} onChange={(value) => { setQuery(value); setSearchError(''); }} onSubmit={submit} error={searchError} /><a href="/methodology" onClick={nav('/methodology')} className="my-earth"><RadioTower size={16} /> <span>Methodology</span></a></>}<button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={20} /></button></div>
    </header>
    <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}><Brand /><nav className="drawer-nav">{[...links, ['/methodology', 'Methodology', RadioTower]].map(([href, label, Icon]) => <a key={href} href={href} onClick={nav(href)}>{Icon && <Icon size={16} aria-hidden="true" />}{label}</a>)}</nav></Drawer>
    {isDiscover && <aside className="discover-sidebar"><nav aria-label="Discover navigation">{discoverLinks.map(([href, label, Icon]) => <a key={href} className={href === '/' ? 'active' : ''} href={href} onClick={nav(href)}><Icon size={19} />{label}</a>)}</nav><div className="sidebar-topics"><span>Topics</span><a href="/topics/water" onClick={nav('/topics/water')}><Waves size={17} /> Water &amp; Wetlands</a><a href="/topics/ground-movement" onClick={nav('/topics/ground-movement')}><Layers3 size={17} /> Ground Movement</a><a href="/topics/forests" onClick={nav('/topics/forests')}><Trees size={17} /> Forests &amp; Vegetation</a><a href="/topics/farms" onClick={nav('/topics/farms')}><Sprout size={17} /> Farms &amp; Soil</a><a href="/topics/ice" onClick={nav('/topics/ice')}><Snowflake size={17} /> Ice &amp; Glaciers</a></div><div className="sidebar-utility"><a href="/methodology" onClick={nav('/methodology')}>About &amp; methodology</a><a href="/sources" onClick={nav('/sources')}>Data Sources</a></div></aside>}
    <main className={isDiscover ? 'discover-main' : ''}>{children}</main>
    <footer className="app-footer"><Brand /><p>NASA–ISRO NISAR discovery and investigation.</p><nav><a href="/methodology" onClick={nav('/methodology')}>Methodology</a><a href="https://github.com/chotushikari/earth-signal" target="_blank" rel="noreferrer">GitHub</a></nav></footer>
  </div>;
}
