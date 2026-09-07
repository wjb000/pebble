import { Link } from 'react-router-dom'
import { BOM, SPECS, bomSubtotal, type BomRow } from '../product'
import { SO101, STANDING_HEIGHT_MM, XL330 } from '../robot/dims'

function money(n: number) {
  return `$${Math.round(n).toLocaleString('en-US')}`
}

function line(row: BomRow, col: 'v1' | 'full') {
  const unit = col === 'v1' ? row.usd_v1 : row.usd_full
  if (typeof row.qty === 'number') {
    if (col === 'full' && row.part.includes('STS3215 (if buying loose)')) return 0
    return unit * row.qty
  }
  return unit
}

export function BomPage() {
  const categories = [...new Set(BOM.map((r) => r.category))]
  const v1 = bomSubtotal('v1')
  const full = bomSubtotal('full')
  return (
    <div className="page bom">
      <header className="page-header">
        <p className="eyebrow">Purchasable BOM · Microduck body + SO-101 · draft prices</p>
        <h1>Pebble — Bill of materials</h1>
        <p className="lede">
          Body: <strong>{XL330.qty_body}× Dynamixel XL330</strong> (Microduck-class, {STANDING_HEIGHT_MM} mm).
          Arms: <strong>2× LeRobot SO-101</strong> ({SO101.dof} DOF each, STS3215 ×{SO101.sts3215_qty}/arm).
          Geometry in <code>src/robot/dims.ts</code>. Not an official Pollen product.
        </p>
        <p className="draft-banner">
          Approx USD street prices — DRAFT / not for sale. Dual SO-101 (~1.6 kg) on &lt;800 g body is
          top-heavy — budget mount plate / counterweight / tabletop braced mode.
        </p>
        <div className="fact-grid" style={{ marginTop: '1.2rem' }}>
          <div className="fact-card">
            <div className="fact-label">Body-only (v1)</div>
            <div className="fact-value">{money(v1)}</div>
          </div>
          <div className="fact-card">
            <div className="fact-label">Twin + dual SO-101</div>
            <div className="fact-value">{money(full)}</div>
          </div>
          <div className="fact-card">
            <div className="fact-label">Height</div>
            <div className="fact-value">{STANDING_HEIGHT_MM} mm</div>
          </div>
          <div className="fact-card">
            <div className="fact-label">Body servos</div>
            <div className="fact-value">{XL330.qty_body}× XL330</div>
          </div>
        </div>
      </header>

      <section className="section">
        <h2>Key specifications</h2>
        <table className="spec-table">
          <tbody>
            {SPECS.map((s) => (
              <tr key={s.key}><th>{s.key}</th><td>{s.value}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>Purchasable parts</h2>
        <p className="muted">
          Columns: <strong>body-only</strong> vs <strong>twin</strong> (body + 2× SO-101 kits).
          Loose STS3215 line is omitted from twin subtotal when kits are priced.
        </p>
        {categories.map((cat) => (
          <div key={cat} className="bom-block">
            <h3>{cat}</h3>
            <table className="bom-table">
              <thead>
                <tr>
                  <th>Part</th>
                  <th>Qty</th>
                  <th>Body USD</th>
                  <th>Twin USD</th>
                  <th>Vendor / link hint</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {BOM.filter((r) => r.category === cat).map((r) => (
                  <tr key={r.part + r.category}>
                    <td>{r.part}</td>
                    <td>{r.qty}</td>
                    <td>{line(r, 'v1') ? money(line(r, 'v1')) : '—'}</td>
                    <td>{line(r, 'full') ? money(line(r, 'full')) : '—'}</td>
                    <td>{r.vendor}</td>
                    <td>{r.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <table className="bom-table" style={{ marginTop: '1rem' }}>
          <tbody>
            <tr>
              <th>Subtotal body-only</th>
              <td>{money(v1)}</td>
            </tr>
            <tr>
              <th>Subtotal twin (body + dual SO-101)</th>
              <td>{money(full)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="section cta-band">
        <h2>Digital twin</h2>
        <p>
          Same millimeters drive the browser sim, <code>cad/pebble.scad</code>, and this BOM.
          LeRobot integration: <Link to="/docs">/docs</Link>.
        </p>
        <Link className="btn primary" to="/sim">Open Pebble Sandbox</Link>
      </section>
    </div>
  )
}
