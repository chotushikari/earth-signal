import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Compass,
  Info,
  Layers3,
  MapPinned,
  Menu,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from 'lucide-react';

const lenses = [
  {
    title: 'Farms and soil',
    question: 'How has soil moisture changed across this place?',
    products: 'SME2 + GCOV context',
    state: 'In development',
    accent: 'clay',
  },
  {
    title: 'Water and wetlands',
    question: 'What radar-observed surface changes are present?',
    products: 'GCOV',
    state: 'Planned',
    accent: 'water',
  },
  {
    title: 'Forests and vegetation',
    question: 'Where has calibrated radar response changed over time?',
    products: 'GCOV',
    state: 'Planned',
    accent: 'moss',
  },
  {
    title: 'Ground movement',
    question: 'Is a line-of-sight displacement investigation possible?',
    products: 'GUNW',
    state: 'Limited',
    accent: 'violet',
  },
  {
    title: 'Ice and glaciers',
    question: 'Can surface motion be investigated here?',
    products: 'GOFF + GUNW',
    state: 'Limited',
    accent: 'ice',
  },
  {
    title: 'Explore any area',
    question: 'Which observation and analysis paths are available?',
    products: 'Product-dependent',
    state: 'Available soon',
    accent: 'ink',
  },
];

const steps = [
  ['01', 'Define a place', 'Draw an area or enter coordinates.'],
  ['02', 'Check readiness', 'See what observations and comparisons are actually possible.'],
  ['03', 'Inspect evidence', 'Read results with sources, units, quality, and limits.'],
];

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function StatePill({ children }) {
  return <span className="state-pill">{children}</span>;
}

export default function App() {
  const [view, setView] = useState('discover');
  const [menuOpen, setMenuOpen] = useState(false);
  const [place, setPlace] = useState('');
  const [notice, setNotice] = useState('');

  const beginDiscovery = (event) => {
    event.preventDefault();
    setNotice(
      place.trim()
        ? `“${place.trim()}” is ready to define as an area of interest. Live catalog search will be connected after the approved NASA integration step.`
        : 'Add a place or coordinates to begin. Live catalog search will be connected after the approved NASA integration step.'
    );
  };

  if (view === 'workspace') {
    return (
      <div className="earth-app workspace-shell">
        <header className="topbar">
          <button className="wordmark" onClick={() => setView('discover')}>
            <BrandMark />
            <span>Earth Signal</span>
          </button>
          <button className="quiet-button" onClick={() => setView('discover')}>
            <ArrowLeft size={16} /> Back to discover
          </button>
        </header>

        <main className="workspace-layout">
          <section className="workspace-intro">
            <span className="eyebrow">Investigation workspace</span>
            <h1>Start with evidence, not a map layer.</h1>
            <p>
              Select an area, then Earth Signal will state whether suitable observations and a validated analysis path exist.
            </p>
            <button className="primary-button" onClick={() => setView('discover')}>
              Define an area <ArrowRight size={17} />
            </button>
          </section>

          <section className="readiness-panel" aria-labelledby="readiness-title">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Data readiness</span>
                <h2 id="readiness-title">No area selected</h2>
              </div>
              <StatePill>Action needed</StatePill>
            </div>
            <div className="empty-state">
              <MapPinned size={28} />
              <div>
                <h3>Choose a place to assess</h3>
                <p>We will check product type, coverage, dates, compatibility, quality layers, and known limitations before analysis.</p>
              </div>
            </div>
            <div className="evidence-checks" aria-label="Readiness checks that will be performed">
              <span><CheckCircle2 size={15} /> Spatial overlap</span>
              <span><CheckCircle2 size={15} /> Product maturity</span>
              <span><CheckCircle2 size={15} /> Compatible observations</span>
              <span><CheckCircle2 size={15} /> Quality layers</span>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="earth-app">
      <header className="topbar">
        <button className="wordmark" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <BrandMark />
          <span>Earth Signal</span>
        </button>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#discover">Discover</a>
          <a href="#how-it-works">How it works</a>
          <button onClick={() => setView('workspace')}>Workspace</button>
        </nav>

        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <a href="#discover" onClick={() => setMenuOpen(false)}>Discover</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
            <button onClick={() => { setView('workspace'); setMenuOpen(false); }}>Workspace</button>
          </nav>
        )}
      </header>

      <main>
        <section className="hero" id="discover">
          <div className="hero-copy">
            <span className="eyebrow"><CircleDot size={14} /> Earth observation, made accountable</span>
            <h1>Ask what is changing. <em>Follow the evidence.</em></h1>
            <p>
              Earth Signal helps you move from a place or question to the NISAR observations, quality checks, and limitations that support a defensible answer.
            </p>

            <form className="place-search" onSubmit={beginDiscovery}>
              <label htmlFor="place">Where do you want to investigate?</label>
              <div>
                <Search size={19} aria-hidden="true" />
                <input
                  id="place"
                  value={place}
                  onChange={(event) => setPlace(event.target.value)}
                  placeholder="Place, coordinates, or region"
                />
                <button type="submit" aria-label="Start an investigation"><ArrowRight size={19} /></button>
              </div>
            </form>

            {notice && <p className="form-notice" role="status"><Info size={16} /> {notice}</p>}
          </div>

          <div className="field-panel" aria-label="Earth Signal evidence workflow">
            <div className="field-panel-top">
              <span className="eyebrow">Evidence canvas</span>
              <span className="live-label">NO LIVE DATA</span>
            </div>
            <div className="terrain-art" aria-hidden="true">
              <span className="contour contour-one" />
              <span className="contour contour-two" />
              <span className="contour contour-three" />
              <span className="locator-dot" />
              <span className="locator-ring" />
            </div>
            <div className="field-caption">
              <span>Choose an area</span>
              <strong>Readiness comes before analysis.</strong>
            </div>
          </div>
        </section>

        <section className="lens-section" aria-labelledby="lens-heading">
          <div className="section-header">
            <div>
              <span className="eyebrow">Discovery lenses</span>
              <h2 id="lens-heading">Start with the question you have.</h2>
            </div>
            <p>Every lens shows its real implementation state. No label means a claim has passed neither science nor UX review.</p>
          </div>

          <div className="lens-grid">
            {lenses.map((lens) => (
              <button className={`lens-card lens-${lens.accent}`} key={lens.title} onClick={() => setView('workspace')}>
                <div className="lens-card-top"><StatePill>{lens.state}</StatePill><ChevronRight size={18} /></div>
                <h3>{lens.title}</h3>
                <p>{lens.question}</p>
                <span className="product-tag">{lens.products}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="method-section" id="how-it-works">
          <div className="method-intro">
            <span className="eyebrow">A more honest workflow</span>
            <h2>Useful when the answer is not obvious.</h2>
            <p>Radar observations can reveal real change. They cannot prove every explanation for it. Earth Signal keeps that distinction visible.</p>
          </div>
          <ol className="step-list">
            {steps.map(([number, title, detail]) => (
              <li key={number}>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{detail}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="trust-strip" aria-label="Evidence principles">
          <div><ShieldCheck size={22} /><strong>Evidence first</strong><span>Sources, dates, units, and limits stay attached to every result.</span></div>
          <div><SlidersHorizontal size={22} /><strong>Truthful readiness</strong><span>Incompatible data returns a reason, not a made-up layer.</span></div>
          <div><Layers3 size={22} /><strong>Built for inquiry</strong><span>Plain language first; technical detail when you need it.</span></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wordmark"><BrandMark /><span>Earth Signal</span></div>
        <p>NISAR Earth-change discovery and investigation.</p>
        <button onClick={() => setView('workspace')}>Open workspace <Compass size={15} /></button>
      </footer>
    </div>
  );
}
