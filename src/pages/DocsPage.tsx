import { Link } from 'react-router-dom'
import { CADENCE_MAX, OMEGA_MAX, V_MAX } from '../steering'
import { SO101, STANDING_HEIGHT_MM, TOPHEAVY_NOTE, XL330 } from '../robot/dims'

export function DocsPage() {
  return (
    <div className="page docs">
      <header className="page-header">
        <h1>Docs</h1>
        <p className="lede">
          Pebble = Microduck-class body ({STANDING_HEIGHT_MM} mm, {XL330.qty_body}× XL330) + dual LeRobot SO-101.
          Not an official Pollen product. Assembly checklist: <code>docs/ASSEMBLY.md</code>.
        </p>
      </header>

      <section className="section">
        <h2>What it is</h2>
        <ul className="doc-list">
          <li>Standing height: {STANDING_HEIGHT_MM} mm</li>
          <li>Body: {XL330.qty_body}× XL330 — Microduck joint layout</li>
          <li>Arms: 2× SO-101 · {SO101.dof} DOF · reach ~{SO101.reach_mm} mm · ~{SO101.mass_g} g each</li>
          <li>Source of truth: <code>src/robot/dims.ts</code> (sim = CAD = BOM)</li>
        </ul>
      </section>

      <section className="section">
        <h2>Locomotion</h2>
        <pre className="code-block">{`steering = { forward: number, yawRate: number }  // each [-1, 1]`}</pre>
        <table className="spec-table">
          <tbody>
            <tr><th>V_MAX</th><td>{V_MAX} m/s</td></tr>
            <tr><th>OMEGA_MAX</th><td>{OMEGA_MAX} rad/s</td></tr>
            <tr><th>CADENCE_MAX</th><td>{CADENCE_MAX} Hz</td></tr>
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>SO-101 arms</h2>
        <ul className="doc-list">
          <li>Docs: <a href="https://huggingface.co/docs/lerobot/en/so101" target="_blank" rel="noreferrer">LeRobot SO-101</a></li>
          <li>Actuators: Feetech STS3215 ×6 per arm</li>
          <li>Idle in browser walk sim; drive via <code>so101_follower</code></li>
        </ul>
        <p className="draft-banner">{TOPHEAVY_NOTE}</p>
      </section>

      <section className="section">
        <h2>Safety</h2>
        <ul className="doc-list">
          <li><strong>Not a babysitter</strong> — unsupervised use with kids/pets is unsafe</li>
          <li><strong>Pinch hazards</strong> — XL330 + STS3215 joints; use a kill switch</li>
          <li><strong>Tip-over</strong> — dual arms make it tippy; spotter / dock / counterweight</li>
        </ul>
        <p className="muted">Full assembly order: <code>docs/ASSEMBLY.md</code>.</p>
        <Link className="btn primary" to="/sim">Open sim</Link>
        {' '}
        <Link className="btn ghost" to="/bom">BOM</Link>
      </section>
    </div>
  )
}
