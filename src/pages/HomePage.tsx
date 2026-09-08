import { Link } from 'react-router-dom'
import { ONE_LINER, bomSubtotal } from '../product'
import { ARM, BASE, HEIGHT_NOTE, PRINT_UNIQUE_SKUS, SHOULDER_HEIGHT_MM, STANDING_HEIGHT_MM, TELESCOPE } from '../robot/dims'

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
              <div className="fact-value">{BASE.width_mm}×{BASE.depth_mm} omni</div>
            </div>
            <div className="fact-card">
              <div className="fact-label">Lift</div>
              <div className="fact-value">Nested tubes · Q/E</div>
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
            HouseHand v3 form: <strong>400×450 mm mecanum deck</strong>, nested telescoping column
            (grows/shrinks — not an exposed rail), printed shoulder bar, dual SO-101. Shoulders idle ~
            {SHOULDER_HEIGHT_MM} mm AGL ({TELESCOPE.min_agl_mm}→{TELESCOPE.max_agl_mm}). {PRINT_UNIQUE_SKUS} printed
            structure SKUs. Overall extended ~{STANDING_HEIGHT_MM} mm. Arms DIY dominate cost.
          </p>
          <p className="draft-banner">{HEIGHT_NOTE}</p>
          <p className="draft-banner">
            House chores: floor pick, wipe, dishes assist, laundry basket/washer-assist. Tip margin ≈2.5× on the
            400 mm deck + 12V pack. No casters, no RÅSKOG, no MGN rail. Draft / not for sale. Not official Pollen.
          </p>
        </div>
      </section>
    </div>
  )
}
