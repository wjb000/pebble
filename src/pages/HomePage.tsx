import { Link } from 'react-router-dom'
import { ONE_LINER, bomSubtotal } from '../product'
import { ARM, SHOULDER_HEIGHT_MM, STANDING_HEIGHT_MM } from '../robot/dims'

export function HomePage() {
  const twin = bomSubtotal('dual')
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
              <div className="fact-label">Head</div>
              <div className="fact-value">Screen+cam</div>
            </div>
            <div className="fact-card">
              <div className="fact-label">Arms</div>
              <div className="fact-value">{`${ARM.default_count}× SO-101`}</div>
            </div>
            <div className="fact-card">
              <div className="fact-label">Draft twin</div>
              <div className="fact-value">{`~$${Math.round(twin).toLocaleString('en-US')}`}</div>
            </div>
          </div>
          <p className="lede" style={{ marginTop: '1rem', maxWidth: '38rem' }}>
            Humanoid upper body on a wheeled base: shoulders ~{SHOULDER_HEIGHT_MM} mm so two hanging
            SO-101s can work <strong>floor → US counter (~900 mm)</strong>. Near-term chores: pick/place,
            wipe within reach, nudge a laundry basket — <strong>not</strong> folding laundry. Sim uses
            real printable STLs + SO-101 meshes.
          </p>
          <p className="draft-banner">
            Draft / not for sale. Overall ~{STANDING_HEIGHT_MM} mm. Dual arms raise tip risk — wide base + ballast.
            Not official Pollen.
          </p>
        </div>
      </section>
    </div>
  )
}
