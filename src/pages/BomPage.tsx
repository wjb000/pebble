import { Link } from 'react-router-dom'
import { BOM, SPECS, bomSubtotal, type BomRow } from '../product'
import { STANDING_HEIGHT_MM, XL330 } from '../robot/dims'

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
        <h1>BOM / Specs</h1>
        <p className="lede">
          {XL330.qty_body}× XL330 body ({STANDING_HEIGHT_MM} mm) + 2× SO-101. Draft street prices — not for sale.
        </p>
        <div className="fact-grid" style={{ marginTop: '1.2rem' }}>
          <div className="fact-card">
            <div className="fact-label">Body-only</div>
            <div className="fact-value">{money(v1)}</div>
          </div>
          <div className="fact-card">
            <div className="fact-label">Twin + dual SO-101</div>
            <div className="fact-value">{money(full)}</div>
          </div>
        </div>
      </header>

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
        <p className="muted">Body-only vs twin (body + 2× SO-101). Loose STS3215 omitted from twin when kits priced.</p>
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
                  <th>Vendor</th>
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
              <th>Subtotal twin</th>
              <td>{money(full)}</td>
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
