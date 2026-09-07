import { useSim } from '../sim/SimContext'
import { STANDING_HEIGHT_MM, XL330 } from '../robot/dims'

function fmt(n: number, d = 2) {
  return n.toFixed(d)
}

export function HUD() {
  const { state } = useSim()
  return (
    <div className="osd" aria-hidden>
      <div className="hud-box hud-tl">
        <div className="hud-label">NAV</div>
        <div className="hud-row">PEBBLE · {state.mode.toUpperCase()}</div>
        <div className="hud-row">CAM {state.chaseCam ? 'CHASE' : 'ORBIT'}</div>
        <div className="hud-row">H {STANDING_HEIGHT_MM} mm</div>
      </div>
      <div className="hud-box hud-tr">
        <div className="hud-label">STATUS</div>
        <div className="hud-row">CTRL 50HZ</div>
        <div className="hud-row">FPS {Math.round(state.fps)}</div>
        <div className="hud-row">{XL330.qty_body}× XL330 + 2× SO-101</div>
        <div className="hud-row hud-mesh">Meshes: Microduck (microduck_rl, CC BY-SA-NC) + SO-101 (TheRobotStudio/SO-ARM100)</div>
      </div>
      <div className="hud-tele">
        <div>{fmt(Math.abs(state.v))} M/S</div>
        <div>ODO {fmt(state.odo, 1)} M</div>
        <div>ω {fmt(state.omega)}</div>
        <div>CAD {fmt(state.cadence)} HZ</div>
        <div>FWD {fmt(state.steering.forward)} · YAW {fmt(state.steering.yawRate)}</div>
        <div>SCALE {STANDING_HEIGHT_MM} MM</div>
      </div>
    </div>
  )
}
