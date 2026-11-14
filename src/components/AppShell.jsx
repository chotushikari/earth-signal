import { Menu, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Brand, Drawer, SearchBox } from './ui';

const links = [
  ['/', 'Discover'],
  ['/topics/water', 'Topics'],
  ['/explore', 'Explore map'],
  ['/methodology', 'Methodology'],
];

export default function AppShell({ path, navigate, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const submit = (event) => { event.preventDefault(); navigate(`/explore${query.trim() ? `?place=${encodeURIComponent(query.trim())}` : ''}`); };
  const nav = (href) => (event) => { event.preventDefault(); navigate(href); setMenuOpen(false); };
  return <div className="app-shell">
    <header className="app-topbar">
      <a className="brand-link" href="/" onClick={nav('/')}><Brand /></a>
      <nav className="primary-nav" aria-label="Primary navigation">{links.map(([href, label]) => <a key={href} className={path === href || (href === '/topics/water' && path.startsWith('/topics/')) ? 'active' : ''} href={href} onClick={nav(href)}>{label}</a>)}</nav>
      <div className="nav-actions"><SearchBox compact value={query} onChange={setQuery} onSubmit={submit} /><a href="/my-earth" onClick={nav('/my-earth')} className="my-earth"><UserRound size={16} /> <span>My Earth</span></a><button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={20} /></button></div>
    </header>
    <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}><Brand /><nav className="drawer-nav">{[...links, ['/my-earth', 'My Earth']].map(([href, label]) => <a key={href} href={href} onClick={nav(href)}>{label}</a>)}</nav></Drawer>
    <main>{children}</main>
    <footer className="app-footer"><Brand /><p>NASA–ISRO NISAR discovery and investigation.</p><nav><a href="/methodology" onClick={nav('/methodology')}>Methodology</a><a href="https://github.com/chotushikari/earth-signal" target="_blank" rel="noreferrer">GitHub</a></nav></footer>
  </div>;
}
