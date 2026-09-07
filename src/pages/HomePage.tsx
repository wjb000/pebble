import { Link } from 'react-router-dom'
import { ONE_LINER, bomSubtotal } from '../product'
import { STANDING_HEIGHT_MM } from '../robot/dims'

export function HomePage() {
  const twin = bomSubtotal('full')
  return (
    <div className="page home">
      <section className="hero hero-lean">
        <div className="hero-copy">
          <h1>Pebble</h1>
          <p className="one-liner">{ONE_LINER}</p>
          <div className="hero-actions">
            <Link className="btn primary" to="/sim">Try the sim</Link>
            <Link className="btn ghost" to="/bom">BOM</Link>
          </div>
          <div className="fact-grid fact-strip">
            <div className="fact-card">
              <div className="fact-label">Height</div>
              <div className="fact-value">{STANDING_HEIGHT_MM} mm</div>
            </div>
            <div className="fact-card">
              <div className="fact-label">Body servos</div>
              <div className="fact-value">15× XL330</div>
            </div>
            <div className="fact-card">
              <div className="fact-label">Arms</div>
              <div className="fact-value">2× SO-101</div>
            </div>
            <div className="fact-card">
              <div className="fact-label">Twin BOM</div>
              <div className="fact-value">{`~$${Math.round(twin).toLocaleString('en-US')}`}</div>
            </div>
          </div>
          <p className="draft-banner">Draft / not for sale. Dual arms are top-heavy.</p>
        </div>
      </section>
    </div>
  )
}
