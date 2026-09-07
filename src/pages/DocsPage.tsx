import { Link } from 'react-router-dom'
import { CADENCE_MAX, OMEGA_MAX, V_MAX } from '../steering'
import {
  ARM,
  BASE,
  SHOULDER_HEIGHT_MM,
  SO101,
  STANDING_HEIGHT_MM,
  STABILITY_NOTE,
  TORSO,
} from '../robot/dims'
import { bomSubtotal } from '../product'

export function DocsPage() {
  return (
    <div className="page docs">
      <header className="page-header">
        <h1>Docs</h1>
        <p className="lede">
          Pebble = cheap home chore bot: wide wheeled base (~{BASE.diameter_mm} mm) + torso (~{TORSO.height_mm} mm) +
          head (screen+cam) + <strong>{ARM.default_count}×</strong> LeRobot SO-101. Not an official Pollen product.
          Assembly / print list: <code>docs/ASSEMBLY.md</code>.
        </p>
      </header>

      <section className="section">
        <h2>What it is</h2>
        <ul className="doc-list">
          <li><strong>What:</strong> wheeled mobility + humanoid upper body for home chores</li>
          <li><strong>Why wheels:</strong> traverse floors, not stuck; ballast + wide base for tip resistance</li>
          <li><strong>Head:</strong> printed bezel + bought face screen + CSI/USB cam on forehead</li>
          <li><strong>Arms:</strong> {ARM.default_count}× SO-101 · {SO101.dof} DOF · reach ~{SO101.reach_mm} mm · ~{SO101.mass_g} g each — idle hang along flanks</li>
          <li><strong>Shoulders / overall:</strong> ~{SHOULDER_HEIGHT_MM} mm / ~{STANDING_HEIGHT_MM} mm</li>
          <li><strong>Reach band:</strong> floor → ~US counter (900 mm) with ~500 mm arm reach from shoulder height</li>
          <li>Source of truth: <code>src/robot/dims.ts</code></li>
        </ul>
      </section>

      <section className="section">
        <h2>Print library</h2>
        <ul className="doc-list">
          <li><strong>Base + torso + head:</strong> <code>print/base/</code> — octagon plates, standoffs, motor pods, torso column, L/R shoulder pods, neck, bezel, screen backplate, camera mount, hubs (sim loads same STLs from <code>public/assets/base/</code>)</li>
          <li><strong>SO-101 follower ×2:</strong> <code>print/SO101/</code> from <a href="https://github.com/TheRobotStudio/SO-ARM100" target="_blank" rel="noreferrer">TheRobotStudio/SO-ARM100</a> (Apache-2.0)</li>
          <li><strong>Filament:</strong> base/torso/head ~550–750 g + 2× arm ~600–800 g PLA @ ~20% infill</li>
          <li><strong>Bought:</strong> rubber tires, gearmotors, caster, CSI/USB cam, face display, Pi, LiPo, ballast, fasteners</li>
        </ul>
      </section>

      <section className="section">
        <h2>What it can do (near-term, honest)</h2>
        <ul className="doc-list">
          <li>Pick / place small objects from floor up to counter height</li>
          <li>Wipe surfaces within dual-arm reach</li>
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
        <h2>SO-101 arms (×2)</h2>
        <ul className="doc-list">
          <li>Docs: <a href="https://huggingface.co/docs/lerobot/en/so101" target="_blank" rel="noreferrer">LeRobot SO-101</a></li>
          <li>Actuators: Feetech STS3215 ×6 per arm (×12 total)</li>
          <li>Browser sim: idle GLBs remounted to hang −Y; drive via <code>so101_follower</code> on hardware</li>
          <li>Draft twin with 2 arms ≈ ${Math.round(bomSubtotal('dual'))} (see BOM)</li>
        </ul>
        <p className="draft-banner">{STABILITY_NOTE}</p>
      </section>

      <section className="section">
        <h2>Safety</h2>
        <ul className="doc-list">
          <li><strong>Not a babysitter</strong> — unsupervised use with kids/pets is unsafe</li>
          <li><strong>Pinch hazards</strong> — STS3215 joints + grippers; use a kill switch</li>
          <li><strong>Tip risk</strong> — dual arms + height; ballast the bay; mind rugs, cords, stairs</li>
          <li><strong>Floors</strong> — cliff/bumper sensors are future, not in v1 UI</li>
        </ul>
        <p className="muted">Full assembly order: <code>docs/ASSEMBLY.md</code>.</p>
        <Link className="btn primary" to="/sim">Open sim</Link>
        {' '}
        <Link className="btn ghost" to="/bom">BOM</Link>
      </section>
    </div>
  )
}
