import { useSim } from '../sim/SimContext'

function fmt(n: number, d = 2) {
  return n.toFixed(d)
}

export function HUD() {
  const { state } = useSim()
  const tipPct = Math.round(state.tipSlowdown * 100)
  const margin = state.tipMargin
  const marginColor = margin < 1 ? '#ff5d6c' : margin < 1.2 ? '#fbbf24' : '#4ade80'
  return (
    <div className="osd" aria-hidden>
      <div className="hud-box hud-tl">
        <div className="hud-label">NAV</div>
        <div className="hud-row">{state.mode.toUpperCase()}</div>
        <div className="hud-row">CAM {state.chaseCam ? 'CHASE' : 'ORBIT'}</div>
        <div className="hud-row">FPS {Math.round(state.fps)}</div>
        {state.liftAtLimit && <div className="hud-row hud-limit">LIFT LIMIT</div>}
        {tipPct < 100 && <div className="hud-row hud-tip">TIP SLOW {tipPct}% (UX)</div>}
        {state.demoActive && (
          <div className="hud-row hud-demo">DEMO {state.demoPhase.replace(/_/g, ' ').toUpperCase()}</div>
        )}
      </div>
      <div className="hud-box hud-tipphys">
        <div className="hud-label">TIP MARGIN</div>
        <div className="hud-row" style={{ color: marginColor, fontWeight: 700 }}>
          {fmt(margin, 2)}× {state.wouldTip || state.tipOver ? '· TIP' : 'OK'}
        </div>
        <div className="hud-row">tip {fmt(state.tipMomentNm, 2)} N·m</div>
        <div className="hud-row">restore {fmt(state.restoreMomentNm, 2)} N·m</div>
        <div className="hud-row">reach {fmt(state.tipReachM, 2)} m · {state.carriageAglMm.toFixed(0)} AGL</div>
        {state.tipOver && <div className="hud-row hud-limit">TIP-OVER — FREEZE (Space reset)</div>}
      </div>
      <div className="hud-tele">
        <div>{fmt(Math.abs(state.v))} M/S</div>
        <div>FWD {fmt(state.steering.forward)} · STR {fmt(state.steering.strafe ?? 0)} · YAW {fmt(state.steering.yawRate)}</div>
        <div className="hud-estop-hint">SPACE = E-STOP · A/D strafe · Q/E arms</div>
      </div>
    </div>
  )
}
