import { Link } from 'react-router-dom'
import { CADENCE_MAX, OMEGA_MAX, V_MAX } from '../steering'
import { HIP_HEIGHT_MM, SO101, STANDING_HEIGHT_MM, TOPHEAVY_NOTE, XL330 } from '../robot/dims'

export function DocsPage() {
  return (
    <div className="page docs">
      <header className="page-header">
        <p className="eyebrow">Digital twin · LeRobot · assembly · safety</p>
        <h1>Docs</h1>
        <p className="lede">
          Pebble = <strong>Microduck-class body</strong> + <strong>2× LeRobot SO-101</strong>.
          Source of truth: <code>src/robot/dims.ts</code> ({STANDING_HEIGHT_MM} mm standing).
          Not an official Pollen product. Full write-up: <code>docs/ASSEMBLY.md</code>.
        </p>
      </header>

      <section className="section">
        <h2>Digital twin rule</h2>
        <p>
          <strong>sim = CAD = BOM.</strong> Link lengths, XL330 / STS3215 bodies, duck head, and
          SO-101 segments are defined once in millimeters in <code>dims.ts</code>. Three.js converts
          mm→m only at render. <code>cad/pebble.scad</code> hardcodes the same numbers.
          JSON: <code>/robot/dims.json</code>.
        </p>
        <ul className="doc-list">
          <li>Standing height: {STANDING_HEIGHT_MM} mm</li>
          <li>Hip height: {HIP_HEIGHT_MM} mm</li>
          <li>Body: {XL330.qty_body}× XL330 ({XL330.L}×{XL330.W}×{XL330.H} mm)</li>
          <li>Arms: 2× SO-101 · {SO101.dof} DOF · reach ~{SO101.reach_mm} mm · ~{SO101.mass_g} g each</li>
        </ul>
      </section>

      <section className="section">
        <h2>Locomotion commands (legs)</h2>
        <pre className="code-block">{`steering = {
  forward: number,  // [-1, 1]
  yawRate: number,  // [-1, 1]
}`}</pre>
        <table className="spec-table">
          <tbody>
            <tr><th>V_MAX</th><td>{V_MAX} m/s</td></tr>
            <tr><th>OMEGA_MAX</th><td>{OMEGA_MAX} rad/s</td></tr>
            <tr><th>CADENCE_MAX</th><td>{CADENCE_MAX} Hz</td></tr>
          </tbody>
        </table>
        <p className="muted">SO-101 arms idle in the browser sim; drive them via LeRobot so101_follower.</p>
      </section>

      <section className="section">
        <h2>Joint layout (Microduck body)</h2>
        <ul className="doc-list">
          <li>Left leg: hip_yaw, hip_roll, hip_pitch, knee, ankle</li>
          <li>Neck/head: neck_pitch, head_pitch, head_yaw, head_roll</li>
          <li>Right leg: same 5 as left</li>
          <li>Mouth/beak: 15th XL330</li>
        </ul>
        <p className="muted">
          Public kinematics / press-kit envelope only — no proprietary Microduck STLs or Pollen branding as official.
        </p>
      </section>

      <section className="section">
        <h2>LeRobot SO-101 integration</h2>
        <ul className="doc-list">
          <li>Docs: <a href="https://huggingface.co/docs/lerobot/en/so101" target="_blank" rel="noreferrer">huggingface.co/docs/lerobot/en/so101</a></li>
          <li>Follower joints: shoulder_pan, shoulder_lift, elbow_flex, wrist_flex, wrist_roll, gripper</li>
          <li>Actuators: Feetech STS3215 ×6 per arm (visible in sim)</li>
          <li>Python: <code>so101_follower</code> in LeRobot</li>
          <li>CAD/kit: TheRobotStudio/SO-ARM100</li>
        </ul>
        <p className="draft-banner">{TOPHEAVY_NOTE}</p>
      </section>

      <section className="section">
        <h2>Assembly order (short)</h2>
        <ol className="doc-list">
          <li>Print Microduck-scale body (original twin — not proprietary STLs)</li>
          <li>Mount XL330 legs (yaw→roll→pitch→knee→ankle)</li>
          <li>Trunk bay (Pi Zero class + LiPo)</li>
          <li>Neck + duck head + beak</li>
          <li>Print / buy 2× SO-101; bolt mount plates to torso shoulders</li>
          <li>Separate TTL buses + BECs; bring-up one joint at a time</li>
          <li>Wire {'{forward, yawRate}'}; calibrate to 250 mm; arms idle while walking</li>
        </ol>
        <p>See <code>docs/ASSEMBLY.md</code> for the full checklist.</p>
      </section>

      <section className="section">
        <h2>Home deploy safety</h2>
        <ul className="doc-list">
          <li><strong>Not a babysitter</strong> — unsupervised use with kids/pets is unsafe</li>
          <li><strong>Pinch hazards</strong> — XL330 + STS3215 joints and grippers; use a kill switch</li>
          <li><strong>Battery</strong> — charge safely; keep servo rails off logic 5V</li>
          <li><strong>Tip-over</strong> — dual arms make it tippy; spotter / dock / counterweight</li>
        </ul>
        <p className="muted">
          Geometry is exact; physics is not MuJoCo-perfect yet. DIY — you own electrical/mechanical risk.
        </p>
        <Link className="btn primary" to="/sim">Open sim</Link>
        {' '}
        <Link className="btn ghost" to="/bom">View BOM</Link>
      </section>
    </div>
  )
}
