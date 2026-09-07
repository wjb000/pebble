import { Link } from 'react-router-dom'
import { CADENCE_MAX, OMEGA_MAX, V_MAX } from '../steering'
import {
  ARM,
  BASE,
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
          Pebble = OSS-composed wheeled chore bot: <strong>perceptron_bot</strong> base ({BASE.footprint_mm} mm) +
          bought {EXTRUSION.profile} (~{EXTRUSION.length_mm} mm) + Prusa lead-screw carriage +{' '}
          <strong>{ARM.default_count}×</strong> LeRobot SO-101. Not an official Pollen product.
          Assembly: <code>docs/ASSEMBLY.md</code>.
        </p>
      </header>

      <section className="section">
        <h2>What it is</h2>
        <ul className="doc-list">
          <li><strong>What:</strong> wheeled mobility + lead-screw shoulder elevator + dual SO-101</li>
          <li><strong>Base:</strong> <a href="https://github.com/PedroS235/perceptron_bot" target="_blank" rel="noreferrer">PedroS235/perceptron_bot</a> (MIT)</li>
          <li><strong>Lift:</strong> <a href="https://github.com/prusa3d/Original-Prusa-i3" target="_blank" rel="noreferrer">prusa3d/Original-Prusa-i3</a> Z + x-end-motor carriage (GPL-2.0); Q raise / E lower · screw axis X = {SCREW_AXIS_X_MM} mm</li>
          <li><strong>Head:</strong> SO-ARM100 Optional Overhead Cam (Apache-2.0), printed 1:1</li>
          <li><strong>Arms:</strong> {ARM.default_count}× SO-101 · {SO101.dof} DOF · reach ~{SO101.reach_mm} mm · seated on 4040 mounts</li>
          <li><strong>Overall / idle shoulders:</strong> ~{STANDING_HEIGHT_MM} mm (stack assert {HEIGHT_STACK_MM}) / ~{SHOULDER_HEIGHT_MM} mm AGL</li>
          <li>{HEIGHT_NOTE}</li>
          <li>Source of truth: <code>src/robot/dims.ts</code> · shared mesh: <code>RobotAssembly</code></li>
        </ul>
      </section>

      <section className="section">
        <h2>Print library (upstream only)</h2>
        <ul className="doc-list">
          <li><strong>Base</strong> ({PRINT_UNIQUE_SKUS} structure SKUs total): <code>print/base/</code> ← perceptron_bot</li>
          <li><strong>Lift:</strong> <code>print/lift/</code> ← Prusa Z + carriage + SO 4040 mount</li>
          <li><strong>Head:</strong> <code>print/head/</code> ← SO-ARM overhead cam (1:1)</li>
          <li><strong>Arms:</strong> <code>print/SO101/</code> ← <a href="https://github.com/TheRobotStudio/SO-ARM100" target="_blank" rel="noreferrer">TheRobotStudio/SO-ARM100</a> — print <strong>2×</strong> followers</li>
          <li><strong>Bought:</strong> 2040 extrusion, T8 screw, NEMA17, tires, Pi 5 4GB, LiPo + scrap ballast</li>
          <li>No ForgeCAD · no generated/numpy-stl placeholder bodies · Microduck quarantined</li>
        </ul>
      </section>

      <section className="section">
        <h2>Locomotion + lift</h2>
        <pre className="code-block">{`steering = { forward, yawRate }  // WASD / arrows — tank (sim)
lift: Q raise / E lower  // carriage ${SCREW_ELEVATOR.min_agl_mm}→${SCREW_ELEVATOR.max_agl_mm} mm AGL (sim)
F = pick/drop box
/model = OrbitControls only · fixed lift @ ${SCREW_ELEVATOR.default_agl_mm} mm`}</pre>
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
          <li>Draft dual-arm twin ≈ ${Math.round(bomSubtotal('dual'))} (arms DIY ~$250 dominate; see BOM)</li>
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
