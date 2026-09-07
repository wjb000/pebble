import { Link } from 'react-router-dom'
import { CADENCE_MAX, OMEGA_MAX, V_MAX } from '../steering'
import { BASE, SO101, STANDING_HEIGHT_MM, STABILITY_NOTE } from '../robot/dims'
import { bomSubtotal } from '../product'

export function DocsPage() {
  return (
    <div className="page docs">
      <header className="page-header">
        <h1>Docs</h1>
        <p className="lede">
          Pebble = cheap home chore bot: low wheeled base (~{BASE.diameter_mm} mm octagon) + mast eye + 1× LeRobot SO-101.
          Not an official Pollen product. Assembly / print list: <code>docs/ASSEMBLY.md</code>.
        </p>
      </header>

      <section className="section">
        <h2>What it is</h2>
        <ul className="doc-list">
          <li><strong>What:</strong> dead-simple home helper — wheels + eye + arm</li>
          <li><strong>Why wheels:</strong> traverse home floors, stable with arm mass, cheap, less tip/stuck than a biped</li>
          <li><strong>Eye:</strong> 1× cheap CSI/USB camera on mast; optional bumper/cliff later (not faked in UI)</li>
          <li><strong>Arm (v1):</strong> 1× SO-101 · {SO101.dof} DOF · reach ~{SO101.reach_mm} mm · ~{SO101.mass_g} g — dual optional</li>
          <li><strong>Mast / envelope height:</strong> ~{STANDING_HEIGHT_MM} mm</li>
          <li>Source of truth: <code>src/robot/dims.ts</code></li>
        </ul>
      </section>

      <section className="section">
        <h2>Print library</h2>
        <ul className="doc-list">
          <li><strong>Base:</strong> <code>print/base/</code> — octagon plates, standoffs, motor pods, mast, shelf, hubs, arm pad (sim loads same STLs from <code>public/assets/base/</code>)</li>
          <li><strong>SO-101 follower:</strong> <code>print/SO101/</code> from <a href="https://github.com/TheRobotStudio/SO-ARM100" target="_blank" rel="noreferrer">TheRobotStudio/SO-ARM100</a> (Apache-2.0)</li>
          <li><strong>Filament:</strong> base ~350–450 g + arm ~300–400 g PLA @ ~20% infill</li>
          <li><strong>Bought (not printed):</strong> rubber tires, gearmotors, caster, CSI/USB cam, Pi, LiPo, fasteners</li>
        </ul>
      </section>

      <section className="section">
        <h2>What it can do (near-term, honest)</h2>
        <ul className="doc-list">
          <li>Pick / place small objects off the floor or table edge</li>
          <li>Wipe surfaces within arm reach</li>
          <li>Nudge / push a laundry basket</li>
          <li><strong>Not</strong> full laundry folding, not MuJoCo autonomy, not a babysitter</li>
        </ul>
      </section>

      <section className="section">
        <h2>Locomotion</h2>
        <pre className="code-block">{`steering = { forward: number, yawRate: number }  // each [-1, 1] — tank drive`}</pre>
        <table className="spec-table">
          <tbody>
            <tr><th>V_MAX</th><td>{V_MAX} m/s</td></tr>
            <tr><th>OMEGA_MAX</th><td>{OMEGA_MAX} rad/s</td></tr>
            <tr><th>CADENCE_MAX</th><td>{CADENCE_MAX} Hz (legacy gait clock; wheels ignore bob)</td></tr>
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>SO-101 arm</h2>
        <ul className="doc-list">
          <li>Docs: <a href="https://huggingface.co/docs/lerobot/en/so101" target="_blank" rel="noreferrer">LeRobot SO-101</a></li>
          <li>Actuators: Feetech STS3215 ×6 per arm</li>
          <li>Browser sim: idle GLB baked from printable URDF STLs; drive via <code>so101_follower</code> on hardware</li>
          <li>Draft twin with 1 arm ≈ ${Math.round(bomSubtotal('arm'))} (see BOM)</li>
        </ul>
        <p className="draft-banner">{STABILITY_NOTE}</p>
      </section>

      <section className="section">
        <h2>Safety</h2>
        <ul className="doc-list">
          <li><strong>Not a babysitter</strong> — unsupervised use with kids/pets is unsafe</li>
          <li><strong>Pinch hazards</strong> — STS3215 joints + gripper; use a kill switch</li>
          <li><strong>Floors</strong> — rugs, cords, stairs, pets; cliff/bumper sensors are future, not in v1 UI</li>
        </ul>
        <p className="muted">Full assembly order: <code>docs/ASSEMBLY.md</code>.</p>
        <Link className="btn primary" to="/sim">Open sim</Link>
        {' '}
        <Link className="btn ghost" to="/bom">BOM</Link>
      </section>
    </div>
  )
}
