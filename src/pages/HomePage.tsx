import { Link } from 'react-router-dom'
import { ONE_LINER, bomSubtotal } from '../product'
import { STANDING_HEIGHT_MM } from '../robot/dims'

export function HomePage() {
  const withArm = bomSubtotal('arm')
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
              <div className="fact-label">Base</div>
              <div className="fact-value">Wheels</div>
            </div>
            <div className="fact-card">
              <div className="fact-label">Eye</div>
              <div className="fact-value">1× cam</div>
            </div>
            <div className="fact-card">
              <div className="fact-label">Arm (v1)</div>
              <div className="fact-value">1× SO-101</div>
            </div>
            <div className="fact-card">
              <div className="fact-label">Draft twin</div>
              <div className="fact-value">{`~$${Math.round(withArm).toLocaleString('en-US')}`}</div>
            </div>
          </div>
          <p className="lede" style={{ marginTop: '1rem', maxWidth: '38rem' }}>
            Near-term chores: pick small objects off the floor / table edge, wipe surfaces within reach,
            nudge a laundry basket — <strong>not</strong> folding laundry. Wheels so it can traverse
            home floors without tipping like a biped.
          </p>
          <p className="draft-banner">
            Draft / not for sale. Mast height ~{STANDING_HEIGHT_MM} mm. Not official Pollen.
          </p>
        </div>
      </section>
    </div>
  )
}
