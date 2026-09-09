import { Link } from 'react-router-dom'
import {
  BOM, BOM_DO_NOT_BUY, BOM_V3_RANGE_HI, BOM_V3_RANGE_LO, SPECS,
  bomLineTotal, bomSubtotal, type BomColumn, type BomRow,
} from '../product'
import { HEIGHT_NOTE, PRINT_UNIQUE_SKUS } from '../robot/dims'
import { TIP_SUMMARY } from '../robot/stability'

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
          HouseHand v3.1 — NYRO-like silhouette · telescoping torso · omni base · dual SO-101.
          Base (deck + nested column + power) vs +1 arm vs <strong>+2× SO-101 (product)</strong>.
          Aim <strong>{money(BOM_V3_RANGE_LO)}–{money(BOM_V3_RANGE_HI)}</strong> DIY if careful;
          itemized mid ~{money(dual)}. Round <strong>draft</strong> street USD — not for sale.
        </p>
        <p className="callout-warn">{BOM_DO_NOT_BUY}</p>
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
            <div className="fact-label">+ 2 arms (product)</div>
            <div className="fact-value">{money(dual)}</div>
          </div>
          <div className="fact-card">
            <div className="fact-label">Tip margin</div>
            <div className="fact-value">{TIP_SUMMARY.margin}×</div>
          </div>
        </div>
      </header>

      <section className="section">
        <h2>Buy / print</h2>
        <ul className="doc-list">
          <li><strong>Base</strong> — 400×450 mm deck + 4× 4″ mecanum (or 3-kiwi LeKiwi). No casters. Envelopes in the twin.</li>
          <li><strong>Torso</strong> — nested tube kit + internal T8 + printed shoulder bar + column base plate. Column <em>grows/shrinks</em>.</li>
          <li><strong>Head STLs</strong> — SO-ARM100 Overhead Cam (Apache-2.0) → <code>print/head/</code></li>
          <li><strong>Arms</strong> — 2× SO-101 + STS3215×12 (Apache-2.0). Optional DIY prints → <code>print/SO101/</code></li>
          <li><strong>{PRINT_UNIQUE_SKUS} structure SKUs</strong> + bought nested column / mecanum / 12V pack / e-stop / tote / gamepad</li>
          <li>{HEIGHT_NOTE}</li>
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
        <p className="muted">Draft hobby street prices from <code>BOM_V3.md</code>. Quote links are search URLs — verify before buy. No precision claimed.</p>
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
                    <td>
                      {r.part}
                      {r.quote && (
                        <>
                          {' '}
                          <a href={r.quote} target="_blank" rel="noreferrer">quote</a>
                        </>
                      )}
                    </td>
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
            <tr><th>Subtotal base kit</th><td>{money(base)}</td></tr>
            <tr><th>Subtotal + 1 arm</th><td>{money(arm)}</td></tr>
            <tr><th>Subtotal + 2 arms (product)</th><td>{money(dual)}</td></tr>
            <tr><th>BOM_V3 aim range</th><td>{money(BOM_V3_RANGE_LO)}–{money(BOM_V3_RANGE_HI)}</td></tr>
          </tbody>
        </table>
        <p style={{ marginTop: '1rem' }}>
          <Link className="btn ghost" to="/model">Model</Link>
          {' '}
          <Link className="btn primary" to="/sim">Sim</Link>
        </p>
      </section>
    </div>
  )
}
