import { Link } from 'react-router-dom'
import { useState } from 'react'
import { COLOURWAYS, FAST_FACTS, ONE_LINER, PRICE_PACKS, bomSubtotal } from '../product'
import { STANDING_HEIGHT_MM } from '../robot/dims'

export function HomePage() {
  const [colourId, setColourId] = useState(COLOURWAYS[0].id)
  const colour = COLOURWAYS.find((c) => c.id === colourId) ?? COLOURWAYS[0]
  const twin = bomSubtotal('full')
  return (
    <div className="page home">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Physical AI · Microduck body + SO-101 arms</p>
          <h1>Pebble</h1>
          <p className="tagline-sub">Microduck-class body · dual LeRobot SO-101 · sim matches CAD</p>
          <p className="one-liner">{ONE_LINER}</p>
          <div className="hero-actions">
            <Link className="btn primary" to="/sim">Try the sim</Link>
            <Link className="btn ghost" to="/bom">View BOM / specs</Link>
          </div>
          <p className="draft-banner">
            Draft — not for sale. Exact {STANDING_HEIGHT_MM} mm Microduck-class body from dims.ts.
            Not an official Pollen / Microduck product. Dual arms are top-heavy — see /docs.
          </p>
        </div>
        <div className="hero-visual">
          <div className="pebble-hero-orb">
            <div className="pebble-screen-head" style={{ borderColor: colour.dark, background: colour.primary }}>
              <div className="pebble-screen-glow" style={{ opacity: 0.15 }} />
              <span className="rec-dot" />
              <span className="cam-lens" />
            </div>
            <div className="pebble-body-block" style={{ background: colour.primary }} />
            <div className="pebble-hand-l" style={{ background: colour.dark }} />
            <div className="pebble-hand-r" style={{ background: colour.dark }} />
          </div>
          <p className="colour-caption">{colour.name} — {colour.tagline}</p>
        </div>
      </section>
      <section className="section">
        <h2>Real Microduck-scale body. Open SO-101 arms.</h2>
        <p className="muted">
          {STANDING_HEIGHT_MM} mm · 15× XL330 · 2× SO-101 (6 DOF each) · twin BOM ~
          ${Math.round(twin).toLocaleString('en-US')}. Arms idle in walk sim; LeRobot so101_follower for manipulation.
        </p>
        <div className="fact-grid">
          {FAST_FACTS.map((f) => (
            <div key={f.label} className="fact-card">
              <div className="fact-label">{f.label}</div>
              <div className="fact-value">{f.value}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <h2>Colourways</h2>
        <p className="muted">Shell finishes for the duck trunk — beak keeps the accent colour.</p>
        <div className="swatch-row">
          {COLOURWAYS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={'swatch' + (c.id === colourId ? ' active' : '')}
              onClick={() => setColourId(c.id)}
              style={{ ['--sw' as string]: c.swatch }}
            >
              <span className="swatch-dot" />
              {c.name}
            </button>
          ))}
        </div>
      </section>
      <section className="section">
        <h2>Launch packs (draft)</h2>
        <p className="draft-banner">Placeholder pricing from purchasable BOM — DRAFT / not for sale.</p>
        <div className="pack-grid">
          {PRICE_PACKS.map((p) => (
            <article key={p.id} className="pack-card">
              <div className="pack-head">
                <h3>{p.name}</h3>
                <div className="pack-price">{p.price}<span className="draft-tag">draft</span></div>
              </div>
              <p>{p.blurb}</p>
              <ul>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
      <section className="section cta-band">
        <h2>Exact CAD twin. Duck body + SO-101.</h2>
        <p>
          WASD / stub seeker drive legs with {'{forward, yawRate}'}. dims.ts drives sim + OpenSCAD + BOM.
        </p>
        <Link className="btn primary" to="/sim">Open the playground</Link>
      </section>
    </div>
  )
}
