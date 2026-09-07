import { Link } from 'react-router-dom'
import { BOM, SPECS, bomLineTotal, bomSubtotal, type BomColumn, type BomRow } from '../product'

function money(n: number) {
  return `$${Math.round(n).toLocaleString('en-US')}`
}

function line(row: BomRow, col: BomColumn) {
  return bomLineTotal(row, col)
}

export function BomPage() {
  const categories = [...new Set(BOM.map((r) => r.category))]
  const base = bomSubtotal('base')
  const arm = bomSubtotal('arm')
  const dual = bomSubtotal('dual')
  return (
    <div className="page bom">
      <header className="page-header">
        <h1>BOM / Specs</h1>
        <p className="lede">
          Base kit (wheels + torso/head + Pi) vs + 1× SO-101 vs <strong>+ 2× SO-101 (default product)</strong>.
          Round <strong>draft</strong> street USD — not for sale. Dual-arm twin rises vs prior one-arm ~$376.
        </p>
        <div className="fact-grid" style={{ marginTop: '1.2rem' }}>
          <div className="fact-card">
            <div className="fact-label">Base kit</div>
            <div className="fact-value">{money(base)}</div>
          </div>
          <div className="fact-card">
            <div className="fact-label">+ 1 arm</div>
            <div className="fact-value">{money(arm)}</div>
          </div>
          <div className="fact-card">
            <div className="fact-label">+ 2 arms (default)</div>
            <div className="fact-value">{money(dual)}</div>
          </div>
        </div>
      </header>

      <section className="section">
        <h2>Print list</h2>
        <ul className="doc-list">
          <li><strong>Base + torso + head</strong> (<code>print/base/</code>): octagon plates, 8× standoffs, L/R motor pods, caster, torso column, L/R shoulder pods, neck, bezel, screen backplate, camera mount, 2× hubs — ~550–750 g PLA</li>
          <li><strong>SO-101 follower ×2</strong> (<code>print/SO101/</code>): Individual STLs or Prusa plate pack from TheRobotStudio/SO-ARM100 — ~300–400 g PLA each</li>
          <li><strong>Bought:</strong> rubber tires, gearmotors, caster, camera, face display, Pi, LiPo, ballast, fasteners / arm kit electronics</li>
          <li>Sim maps <code>public/assets/base/*.stl</code> 1:1 with print files; arm GLBs from upstream printable URDF meshes</li>
        </ul>
      </section>

      <section className="section">
        <h2>Key specs</h2>
        <table className="spec-table">
          <tbody>
            {SPECS.map((s) => (
              <tr key={s.key}><th>{s.key}</th><td>{s.value}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>Parts</h2>
        <p className="muted">Draft hobby street prices. No precision claimed — round numbers labeled draft.</p>
        {categories.map((cat) => (
          <div key={cat} className="bom-block">
            <h3>{cat}</h3>
            <table className="bom-table">
              <thead>
                <tr>
                  <th>Part</th>
                  <th>Qty</th>
                  <th>Base USD</th>
                  <th>+1 arm USD</th>
                  <th>+2 arms USD</th>
                  <th>Vendor</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {BOM.filter((r) => r.category === cat).map((r) => (
                  <tr key={r.part + r.category}>
                    <td>{r.part}</td>
                    <td>{r.qty}</td>
                    <td>{line(r, 'base') ? money(line(r, 'base')) : '—'}</td>
                    <td>{line(r, 'arm') ? money(line(r, 'arm')) : '—'}</td>
                    <td>{line(r, 'dual') ? money(line(r, 'dual')) : '—'}</td>
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
              <th>Subtotal base kit</th>
              <td>{money(base)}</td>
            </tr>
            <tr>
              <th>Subtotal + 1 arm</th>
              <td>{money(arm)}</td>
            </tr>
            <tr>
              <th>Subtotal + 2 arms (default twin)</th>
              <td>{money(dual)}</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: '1rem' }}>
          <Link className="btn ghost" to="/docs">Docs</Link>
          {' '}
          <Link className="btn primary" to="/sim">Sim</Link>
        </p>
      </section>
    </div>
  )
}
