import { Link } from 'react-router-dom'
import { CADENCE_MAX, OMEGA_MAX, V_MAX } from '../steering'
import {
  ARM,
  BASE,
  CHORE_ENVELOPE,
  EXTRUSION,
  HEAD,
  HEIGHT_NOTE,
  HEIGHT_STACK_MM,
  PRINT_UNIQUE_SKUS,
  SCREW_AXIS_X_MM,
  SCREW_ELEVATOR,
  SHOULDER_HEIGHT_MM,
  SO101,
  STANDING_HEIGHT_MM,
  STABILITY_NOTE,
} from '../robot/dims'
import { bomSubtotal } from '../product'

export function DocsPage() {
  return (
    <div className="page docs">
      <header className="page-header">
        <h1>Docs</h1>
        <p className="lede">
          Pebble = cheap wheeled <strong>house-chore</strong> bot: perceptron_bot base + short {EXTRUSION.profile}{' '}
          (~{EXTRUSION.length_mm} mm) + Prusa lead-screw + <strong>{ARM.default_count}×</strong> SO-101.
          Overall ~{STANDING_HEIGHT_MM} mm. Not official Pollen. See <code>docs/ASSEMBLY.md</code>.
        </p>
      </header>

      <section className="section">
        <h2>Chores (honest)</h2>
        <ul className="doc-list">
          <li><strong>Does:</strong> floor pick (clothes/clutter) → laundry basket; nudge basket; drop into <em>open</em> washer if rim reachable; wipe tables/counters; dish assist (soft pads)</li>
          <li><strong>Does NOT:</strong> folding, detergent, closed-door washer cycles, waterproofing, hot water, glass-safe grip</li>
          <li><strong>Reach:</strong> shoulders {SCREW_ELEVATOR.min_agl_mm}→{SCREW_ELEVATOR.max_agl_mm} mm AGL + SO-101 ~{SO101.reach_mm} mm · counter ~{CHORE_ENVELOPE.counter_mm} · sink ~{CHORE_ENVELOPE.sink_rim_mm} · washer rim ~{CHORE_ENVELOPE.washer_rim_mm}</li>
        </ul>
        <p className="callout-warn">{CHORE_ENVELOPE.note}</p>
      </section>

      <section className="section">
        <h2>Poka-yoke</h2>
        <p className="callout-danger">
          <strong>Power OFF while wiring.</strong> Hardware e-stop on motor rail. Sim: <kbd>Space</kbd> = e-stop / reset.
        </p>
        <p className="callout-warn">
          <strong>Do not skip ballast.</strong> Tip slowdown when carriage high in sim.
        </p>
        <ul className="checklist">
          <li><strong>Keyed L/R:</strong> L = +X blue · R = −X orange on 4040 mounts</li>
          <li><strong>Can&apos;t-wire-wrong:</strong> blue/orange plugs; motor rail ≠ TTL</li>
          <li><strong>Soft limits:</strong> Q/E clamped {SCREW_ELEVATOR.min_agl_mm}–{SCREW_ELEVATOR.max_agl_mm} mm · HUD LIMIT</li>
        </ul>
      </section>

      <section className="section">
        <h2>What it is</h2>
        <ul className="doc-list">
          <li><strong>Base:</strong> PedroS235/perceptron_bot ({BASE.footprint_mm} mm) MIT</li>
          <li><strong>Lift:</strong> Prusa Z + x-end · screw axis X = {SCREW_AXIS_X_MM} mm</li>
          <li><strong>Head:</strong> SO-ARM overhead cam 1:1</li>
          <li><strong>Arms:</strong> {ARM.default_count}× SO-101 · reach ~{SO101.reach_mm} mm · idle shoulders ~{SHOULDER_HEIGHT_MM} mm</li>
          <li>{HEIGHT_NOTE}</li>
          <li>Stack assert {HEIGHT_STACK_MM} mm · {PRINT_UNIQUE_SKUS} structure print SKUs</li>
        </ul>
      </section>

      <section className="section">
        <h2>Locomotion + lift</h2>
        <pre className="code-block">{`steering = {{ forward, yawRate }}  // tip-slowed when carriage high
lift: Q/E soft-limited ${SCREW_ELEVATOR.min_agl_mm}→${SCREW_ELEVATOR.max_agl_mm} mm AGL
Space = e-stop / reset · F = pick/drop (plate/cloth)
/model = orbit only · bought vs printed · fixed lift @ ${SCREW_ELEVATOR.default_agl_mm} mm
sim props: counter, sink, plate, laundry basket, cloth, washer rim`}</pre>
        <table className="spec-table">
          <tbody>
            <tr><th>V_MAX</th><td>{V_MAX} m/s</td></tr>
            <tr><th>OMEGA_MAX</th><td>{OMEGA_MAX} rad/s</td></tr>
            <tr><th>CADENCE_MAX</th><td>{CADENCE_MAX} Hz (legacy)</td></tr>
            <tr><th>Head stack</th><td>{HEAD.stack_h_mm} mm</td></tr>
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>Cost</h2>
        <ul className="doc-list">
          <li>Min dual twin ≈ ${Math.round(bomSubtotal('dual'))} (arms ~$250 dominate; shorter column + Pi 4-class + cheap cam)</li>
        </ul>
        <p className="draft-banner">{STABILITY_NOTE}</p>
        <Link className="btn primary" to="/sim">Open sim</Link>
        {' '}
        <Link className="btn ghost" to="/model">Model</Link>
        {' '}
        <Link className="btn ghost" to="/bom">BOM</Link>
      </section>
    </div>
  )
}
