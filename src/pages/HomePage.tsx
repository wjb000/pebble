import { Link } from 'react-router-dom'
import { ONE_LINER, bomSubtotal } from '../product'
import { ARM, HEIGHT_NOTE, PRINT_UNIQUE_SKUS, SHOULDER_HEIGHT_MM, STANDING_HEIGHT_MM } from '../robot/dims'

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
            <Link className="btn ghost" to="/model">Model</Link>
            <Link className="btn ghost" to="/bom">BOM</Link>
          </div>
          <div className="fact-grid fact-strip">
            <div className="fact-card">
              <div className="fact-label">Base</div>
              <div className="fact-value">perceptron_bot</div>
            </div>
            <div className="fact-card">
              <div className="fact-label">Lift</div>
              <div className="fact-value">Prusa Z / Q·E</div>
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
          <p className="lede" style={{ marginTop: '1rem', maxWidth: '40rem' }}>
            Composed from <strong>real OSS meshes</strong> (no generated bodies): perceptron_bot chassis,
            Prusa lead-screw carriage, SO-ARM overhead cam (1:1), dual SO-101. Shoulders ride ~
            {SHOULDER_HEIGHT_MM} mm AGL idle. {PRINT_UNIQUE_SKUS} upstream print SKUs + bought 2040 extrusion
            to overall ~{STANDING_HEIGHT_MM} mm. Arms DIY dominate cost (~$250 of twin).
          </p>
          <p className="draft-banner">{HEIGHT_NOTE}</p>
          <p className="draft-banner">
            Draft / not for sale. Tip risk real on a narrow base + tall stack. Not official Pollen.
          </p>
        </div>
      </section>
    </div>
  )
}
