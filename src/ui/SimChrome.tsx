import { Link } from 'react-router-dom'
import { COLOURWAYS } from '../product'
import { SCREW_ELEVATOR } from '../robot/dims'
import { useSim } from '../sim/SimContext'

type Props = {
  colourId: string
  onColour: (id: string) => void
}

export function SimChrome({ colourId, onColour }: Props) {
  const { state } = useSim()
  const mode = state.mode.toUpperCase()
  return (
    <>
      <div className="hud-box hud-nav-back">
        <div className="hud-label">NAV</div>
        <Link className="hud-back" to="/model">← MODEL</Link>
      </div>
      <div className="hud-box hud-shop">
        <div className="hud-label">SITE</div>
        <Link className="hud-preorder" to="/bom">BOM</Link>
      </div>
      <div className="hud-box hud-color">
        <div className="hud-label">COLOR</div>
        <div className="swatch-inline">
          {COLOURWAYS.map((c) => (
            <button
              key={c.id}
              type="button"
              title={c.name}
              className={`swatch-sq ${c.id === colourId ? 'active' : ''}`}
              style={{ background: c.swatch }}
              onClick={() => onColour(c.id)}
            />
          ))}
        </div>
      </div>
      <div className="hud-box hud-mode">
        <div className="hud-label">MODE</div>
        <div className="mode-toggle">
          <span className={mode === 'AUTO' ? 'mode-on' : 'mode-off'}>AUTO</span>
          <span className={mode === 'TELEOP' ? 'mode-on' : 'mode-off'}>TELEOP</span>
          <span className={mode === 'POLICY' ? 'mode-on' : 'mode-off'}>AI</span>
        </div>
        <div className="hud-label" style={{ marginTop: '0.4rem' }}>LIFT</div>
        <div>
          {Math.round(state.carriageAglMm)} mm
          {state.liftAtLimit ? (
            <span className="hud-limit"> · LIMIT</span>
          ) : null}
        </div>
        <div className="hud-label" style={{ marginTop: '0.25rem' }}>
          {SCREW_ELEVATOR.min_agl_mm}–{SCREW_ELEVATOR.max_agl_mm} soft limits
        </div>
        {state.tipSlowdown < 0.999 && (
          <div className="hud-tip">TIP SLOW {Math.round(state.tipSlowdown * 100)}%</div>
        )}
      </div>
        <div className="sim-mesh-foot">Q/E arm · Space e-stop</div>
    </>
  )
}
