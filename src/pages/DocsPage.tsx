import { Link } from 'react-router-dom'

export function DocsPage() {
  return (
    <div className="page docs-page">
      <h1>Build & train</h1>
      <p className="muted">
        Assemble printable parts, bolt the real robot, and train a base driver in the browser twin.
      </p>

      <section>
        <h2>1. Print kit</h2>
        <p>
          Master checklist: <code>print/README.md</code>. Stack: LeKiwi base → torso shell →
          arm-base deck → <strong>2× SO-101</strong> → neck → cam.
        </p>
        <ul>
          <li><code>print/lekiwi/</code> — omni base plates & mounts</li>
          <li><code>print/xlerobot/hardware/torso_shell.stl</code></li>
          <li><code>print/xlerobot/hardware/XLeRobot_035_armbase_deck.stl</code></li>
          <li><code>print/SO101/</code> — print follower set <strong>twice</strong></li>
          <li><code>print/xlerobot/hardware/XLeRobot040_neck_refined.stl</code> + gimbal or <code>print/head/</code></li>
        </ul>
        <p className="muted">Skip RÅSKOG cart STL and legacy <code>print/base/</code>.</p>
      </section>

      <section>
        <h2>2. Assembly</h2>
        <p>
          Bolt-up order and torque checklist: <code>docs/ASSEMBLY.md</code>. Buy list:{' '}
          <Link to="/bom">BOM</Link>. Mount pads at (−26, ±138) mm on the deck.
        </p>
      </section>

      <section>
        <h2>3. Sim AI</h2>
        <p>
          On <Link to="/sim">/sim</Link>: teleop to record → <strong>Train BC</strong> →{' '}
          <strong>Test AI</strong>. Details: <code>docs/TRAIN.md</code>.
        </p>
        <ol>
          <li>Drive in TELEOP (demos auto-record)</li>
          <li>Train BC (≥40 moving samples)</li>
          <li>Test AI — learned policy drives the base</li>
        </ol>
      </section>

      <section>
        <h2>4. Twin</h2>
        <p>
          <Link to="/model">Model</Link> shows the assembled CAD. <Link to="/sim">Sim</Link> adds
          physics, chores, and the train panel.
        </p>
      </section>
    </div>
  )
}
