import { Link } from 'react-router-dom'
import { CADENCE_MAX, OMEGA_MAX, STRAFE_MAX, V_MAX } from '../steering'
import {
  ARM,
  BASE,
  CHORE_ENVELOPE,
  HEAD,
  HEIGHT_NOTE,
  HEIGHT_STACK_MM,
  PRINT_UNIQUE_SKUS,
  SHOULDER_HEIGHT_MM,
  SO101,
  STANDING_HEIGHT_MM,
  STABILITY_NOTE,
  TELESCOPE,
} from '../robot/dims'
import { TIP_DIAGRAM, TIP_SUMMARY } from '../robot/stability'
import { BOM_DO_NOT_BUY, BOM_V3_RANGE_HI, BOM_V3_RANGE_LO, bomSubtotal } from '../product'

export function DocsPage() {
  return (
    <div className="page docs">
      <header className="page-header">
        <h1>Docs</h1>
        <p className="lede">
          Pebble = HouseHand v3: <strong>{BASE.width_mm}×{BASE.depth_mm} mm mecanum</strong> + nested telescoping
          column + <strong>{ARM.default_count}×</strong> SO-101. Overall extended ~{STANDING_HEIGHT_MM} mm.
          Not official Pollen. See <code>docs/ASSEMBLY.md</code> and <code>BOM_V3.md</code>.
        </p>
      </header>

      <section className="section">
        <h2>Tip / CG</h2>
        <p className="callout-danger">
          Support is the <strong>{BASE.width_mm}×{BASE.depth_mm} mm</strong> omni deck itself (no outriggers).
          Low-bay mass is the <strong>{TIP_SUMMARY.ballast_kg} kg</strong> 12V pack, centered.
        </p>
        <table className="spec-table">
          <tbody>
            <tr><th>Support width</th><td>{TIP_SUMMARY.support_width_mm} mm</td></tr>
            <tr><th>Wheelbase</th><td>{TIP_SUMMARY.wheelbase_mm} mm</td></tr>
            <tr><th>Tip moment</th><td>≈{TIP_SUMMARY.tip_moment_Nm} N·m</td></tr>
            <tr><th>Restoring</th><td>≈{TIP_SUMMARY.restoring_moment_Nm} N·m</td></tr>
            <tr><th>Margin</th><td>≈{TIP_SUMMARY.margin}×</td></tr>
          </tbody>
        </table>
        <pre className="code-block">{TIP_DIAGRAM}</pre>
        <p className="callout-warn">{TIP_SUMMARY.note}</p>
        <p className="draft-banner">{STABILITY_NOTE}</p>
      </section>

      <section className="section">
        <h2>Chores (honest)</h2>
        <ul className="doc-list">
          <li><strong>Does:</strong> floor pick (clothes/clutter) → laundry basket; nudge basket; drop into <em>open</em> washer if rim reachable; wipe tables/counters; dish assist (soft pads)</li>
          <li><strong>Does NOT:</strong> folding, detergent, closed-door washer cycles, waterproofing, hot water, glass-safe grip</li>
          <li><strong>Reach:</strong> shoulders {TELESCOPE.min_agl_mm}→{TELESCOPE.max_agl_mm} mm AGL + SO-101 ~{SO101.reach_mm} mm · counter ~{CHORE_ENVELOPE.counter_mm} · sink ~{CHORE_ENVELOPE.sink_rim_mm} · washer rim ~{CHORE_ENVELOPE.washer_rim_mm}</li>
          <li><strong>Sim demo:</strong> press <kbd>G</kbd> — floor→basket grasp, wipe contact, washer drop @~900, held Y tracks AGL</li>
        </ul>
        <p className="callout-warn">{CHORE_ENVELOPE.note}</p>
      </section>

      <section className="section">
        <h2>Poka-yoke</h2>
        <p className="callout-danger">
          <strong>Power OFF while wiring.</strong> Hardware e-stop cuts drive + arms + lift. Sim: <kbd>Space</kbd> = e-stop / reset.
        </p>
        <ul className="checklist">
          <li><strong>Nested column + 12V pack in bay + e-stop</strong> — required. No exposed MGN, no casters.</li>
          <li><strong>Keyed L/R:</strong> L = +X blue rectangular lug · R = −X orange wedge (physical, not colour alone)</li>
          <li><strong>Soft limits:</strong> Q/E clamped {TELESCOPE.min_agl_mm}–{TELESCOPE.max_agl_mm} mm · HUD LIMIT</li>
          <li><strong>Tip HUD:</strong> live margin; freeze when tip &gt; restore (slowdown is UX only)</li>
        </ul>
      </section>

      <section className="section">
        <h2>8 bolt-up modules</h2>
        <ol className="doc-list">
          <li>Omni deck (400×450 + 4× mecanum + bumper)</li>
          <li>12V pack centered in bay + e-stop + tote</li>
          <li>Column base plate</li>
          <li>Nested tubes + internal T8 + lift motor + limit switches</li>
          <li>Inner stage (grows/shrinks)</li>
          <li>Printed shoulder bar + 4040 L/R keyed</li>
          <li>SO-101 L/R bought kits</li>
          <li>Head cam nest on inner-tube top</li>
        </ol>
        <p className="lede">See <code>docs/ASSEMBLY.md</code> — 8 modules, named mates, torque checklist.</p>
      </section>

      <section className="section">
        <h2>What it is</h2>
        <ul className="doc-list">
          <li><strong>Base:</strong> {BASE.width_mm}×{BASE.depth_mm} mm {BASE.drive} · {BASE.wheel_count}× {BASE.wheel_diameter_mm} mm wheels · {BASE.note}</li>
          <li><strong>Lift:</strong> {TELESCOPE.note}</li>
          <li><strong>Head:</strong> USB cam nest on inner-tube / shoulder (BOM B7)</li>
          <li><strong>Arms:</strong> {ARM.default_count}× SO-101 · reach ~{SO101.reach_mm} mm · idle shoulders ~{SHOULDER_HEIGHT_MM} mm</li>
          <li>{HEIGHT_NOTE}</li>
          <li>Stack assert {HEIGHT_STACK_MM} mm · {PRINT_UNIQUE_SKUS} structure print SKUs · head stack {HEAD.stack_h_mm} mm</li>
        </ul>
      </section>

      <section className="section">
        <h2>Locomotion + lift</h2>
        <pre className="code-block">{`steering = {{ forward, strafe, yawRate }}  // holonomic; tip-slowed when tall (UX)
tip physics: margin = restore/tip  // HUD; freeze if < 1
lift: Q/E nested tubes ${TELESCOPE.min_agl_mm}→${TELESCOPE.max_agl_mm} mm AGL
Space = e-stop / reset · F = pick/drop · G = chore demo
W/S forward · A/D strafe · arrows or Z/X yaw
/model = orbit only · fixed lift @ ${TELESCOPE.default_agl_mm} mm
sim props: counter, sink, dish plate, laundry basket, cloth, washer rim`}</pre>
        <table className="spec-table">
          <tbody>
            <tr><th>V_MAX</th><td>{V_MAX} m/s</td></tr>
            <tr><th>STRAFE_MAX</th><td>{STRAFE_MAX} m/s</td></tr>
            <tr><th>OMEGA_MAX</th><td>{OMEGA_MAX} rad/s</td></tr>
            <tr><th>CADENCE_MAX</th><td>{CADENCE_MAX} Hz (legacy)</td></tr>
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>Cost</h2>
        <ul className="doc-list">
          <li>Dual twin itemized ≈ ${Math.round(bomSubtotal('dual'))}</li>
          <li>BOM_V3 aim ${BOM_V3_RANGE_LO}–${BOM_V3_RANGE_HI} if careful / printed</li>
          <li>{BOM_DO_NOT_BUY}</li>
        </ul>
        <Link className="btn primary" to="/sim">Open sim</Link>
        {' '}
        <Link className="btn ghost" to="/model">Model</Link>
        {' '}
        <Link className="btn ghost" to="/bom">BOM</Link>
      </section>
    </div>
  )
}
