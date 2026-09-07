import { useSim } from '../sim/SimContext'

function fmt(n: number, d = 2) {
  return n.toFixed(d)
}

export function HUD() {
  const { state } = useSim()
  const tipPct = Math.round(state.tipSlowdown * 100)
  return (
    <div className="osd" aria-hidden>
      <div className="hud-box hud-tl">
        <div className="hud-label">NAV</div>
        <div className="hud-row">{state.mode.toUpperCase()}</div>
        <div className="hud-row">CAM {state.chaseCam ? 'CHASE' : 'ORBIT'}</div>
        <div className="hud-row">FPS {Math.round(state.fps)}</div>
        {state.liftAtLimit && <div className="hud-row hud-limit">LIFT LIMIT</div>}
        {tipPct < 100 && <div className="hud-row hud-tip">TIP SLOW {tipPct}%</div>}
      </div>
      <div className="hud-tele">
        <div>{fmt(Math.abs(state.v))} M/S</div>
        <div>FWD {fmt(state.steering.forward)} · YAW {fmt(state.steering.yawRate)}</div>
        <div className="hud-estop-hint">SPACE = E-STOP / RESET</div>
      </div>
    </div>
  )
}
