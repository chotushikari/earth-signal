import { Bookmark, FileText, House, Layers3, Map, Menu, RadioTower } from 'lucide-react';
import { useState } from 'react';
import { Brand, Drawer } from './ui';
import SourcePartners from './SourcePartners';
const links=[['/','Discover',House],['/explore','Explore Map',Map],['/investigations','Investigations',Layers3],['/my-earth','My Earth',Bookmark],['/reports','Reports',FileText]];
export default function AppShell({path,navigate,children}){
 const [menuOpen,setMenuOpen]=useState(false);
 const nav=href=>event=>{event.preventDefault();navigate(href);setMenuOpen(false);};
 const active=href=>href==='/'?(path==='/'||path==='/discover'):path===href||(href==='/investigations'&&path.startsWith('/investigate/'));
 return <div className={`app-shell unified-shell ${path==='/'||path==='/discover'?'discover-shell':''}`}><header className="app-topbar unified-topbar"><a className="brand-link" href="/" onClick={nav('/')}><Brand tagline/></a><nav className="primary-nav" aria-label="Primary navigation">{links.map(([href,label,Icon])=><a key={href} href={href} className={active(href)?'active':''} aria-current={active(href)?'page':undefined} onClick={nav(href)}><Icon size={16}/><span>{label}</span></a>)}</nav><div className="nav-actions"><SourcePartners navigate={navigate}/><button className="mobile-menu" onClick={()=>setMenuOpen(true)} aria-label="Open navigation"><Menu size={21}/></button></div></header><Drawer open={menuOpen} onClose={()=>setMenuOpen(false)}><Brand tagline/><nav className="drawer-nav">{[...links,['/readiness','Data Readiness',Layers3],['/sources','Data Sources',RadioTower]].map(([href,label,Icon])=><a key={href} href={href} onClick={nav(href)}><Icon size={17}/>{label}</a>)}</nav></Drawer><main>{children}</main><footer className="app-footer"><Brand tagline/><p>Discover. Understand. Monitor.</p><nav><a href="/sources" onClick={nav('/sources')}>Data sources</a><a href="/methodology" onClick={nav('/methodology')}>Methodology</a><a href="/readiness" onClick={nav('/readiness')}>Data readiness</a><a href="https://github.com/chotushikari/earth-signal" target="_blank" rel="noreferrer">GitHub</a></nav></footer></div>;
}
