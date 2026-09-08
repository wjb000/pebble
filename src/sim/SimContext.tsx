import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from 'react'
import { StubBrain } from '../brain'
import { createInitialState } from './createInitialState'
import { installKeyboard, sampleKeys } from './keyboard'
import { integratePose, nudgeBall } from './physics'
import {
  TrajectoryBuffer, installTrainApi, observe, type TrainAction,
} from './train'
import { SCREW_ELEVATOR } from '../robot/dims'
import {
  restoringMoment_Nm, tipMargin, tipMoment_Nm, wouldTip,
} from '../robot/stability'
import { stepChoreDemo } from './choreDemo'
import {
  BOX_PICK_RANGE, BOX_START_X, BOX_START_Y, DT,
  START_THETA, START_X, START_Y, type SimState,
} from './types'

type SimApi = {
  state: SimState
  setChaseCam: (v: boolean) => void
  notifyOrbitDetach: () => void
}

const SimCtx = createContext<SimApi | null>(null)

export function useSim(): SimApi {
  const ctx = useContext(SimCtx)
  if (!ctx) throw new Error('useSim must be used within SimProvider')
  return ctx
}

/** Effective tip reach (m): idle tuck < held < demo wipe/extended. */
function estimateReachM(s: {
  boxHeld: boolean
  wipeContact: boolean
  armShoulderRad: number
  demoActive: boolean
}): number {
  if (s.wipeContact) return 0.38
  if (s.boxHeld) return 0.28
  if (s.demoActive && Math.abs(s.armShoulderRad) > 0.4) return 0.35
  return 0.12 + Math.min(0.28, Math.abs(s.armShoulderRad) * 0.25)
}

export function SimProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SimState>(() => createInitialState())
  const stateRef = useRef(state)
  stateRef.current = state
  const brainRef = useRef(new StubBrain())
  const fpsAcc = useRef({ frames: 0, t: performance.now() })
  const sitTarget = useRef(0)
  const trajRef = useRef(new TrajectoryBuffer())
  const lastActionRef = useRef<TrainAction>({ forward: 0, yawRate: 0, strafe: 0 })

  const setChaseCam = useCallback((v: boolean) => {
    setState((s) => ({ ...s, chaseCam: v }))
  }, [])

  const notifyOrbitDetach = useCallback(() => {
    setState((s) => (s.chaseCam ? { ...s, chaseCam: false } : s))
  }, [])

  useEffect(() => installKeyboard(), [])

  useEffect(() => {
    const buf = trajRef.current
    return installTrainApi({
      dt: DT,
      hz: 1 / DT,
      getObs: () => observe(stateRef.current),
      getAction: () => lastActionRef.current,
      getState: () => stateRef.current,
      buffer: buf,
      downloadTrajectory: (filename?: string) => buf.download(filename),
      clearTrajectory: () => buf.resetClock(),
    })
  }, [])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let accum = 0

    const tick = (now: number) => {
      const frameDt = Math.min(0.05, (now - last) / 1000)
      last = now
      accum += frameDt

      fpsAcc.current.frames += 1
      if (now - fpsAcc.current.t >= 500) {
        const fps = (fpsAcc.current.frames * 1000) / (now - fpsAcc.current.t)
        fpsAcc.current = { frames: 0, t: now }
        setState((s) => ({ ...s, fps }))
      }

      while (accum >= DT) {
        accum -= DT
        const prev = stateRef.current
        const keys = sampleKeys()

        let mode = prev.mode
        let chaseCam = prev.chaseCam
        let sitting = prev.sitting
        let x = prev.x
        let y = prev.y
        let theta = prev.theta
        let phase = prev.phase
        let odo = prev.odo
        let ballX = prev.ballX
        let ballY = prev.ballY
        let ballVx = prev.ballVx
        let ballVy = prev.ballVy
        let boxX = prev.boxX
        let boxY = prev.boxY
        let boxHeld = prev.boxHeld
        let carriageAglMm = prev.carriageAglMm
        let demoActive = prev.demoActive
        let demoPhase = prev.demoPhase
        let demoT = prev.demoT
        let armShoulderRad = prev.armShoulderRad
        let armElbowRad = prev.armElbowRad
        let wipeContact = prev.wipeContact
        let tipOver = prev.tipOver

        if (keys.toggleMode) mode = mode === 'auto' ? 'teleop' : 'auto'
        if (keys.toggleChase) chaseCam = !chaseCam
        if (keys.toggleSit) sitting = !sitting
        if (keys.toggleDemo) {
          demoActive = !demoActive
          if (demoActive) {
            demoPhase = 'idle'
            demoT = 0
            mode = 'auto'
          } else {
            demoPhase = 'idle'
            wipeContact = false
          }
        }
        if (keys.reset) {
          x = START_X; y = START_Y; theta = START_THETA; phase = 0
          sitting = false; sitTarget.current = 0; odo = 0
          ballX = -0.55; ballY = 0.2; ballVx = 0; ballVy = 0
          boxX = BOX_START_X; boxY = BOX_START_Y; boxHeld = false
          carriageAglMm = SCREW_ELEVATOR.default_agl_mm
          demoActive = false; demoPhase = 'idle'; demoT = 0
          armShoulderRad = 0; armElbowRad = 0; wipeContact = false
          tipOver = false
          trajRef.current.resetClock()
        }

        if (keys.togglePick && !demoActive) {
          if (boxHeld) {
            const reach = 0.28
            boxX = x + Math.cos(theta) * reach
            boxY = y + Math.sin(theta) * reach
            boxHeld = false
          } else {
            const dx = boxX - x
            const dy = boxY - y
            if (Math.hypot(dx, dy) <= BOX_PICK_RANGE) boxHeld = true
          }
        }

        sitTarget.current = sitting ? 1 : 0

        // Chore demo overrides teleop drive / lift
        if (demoActive && !tipOver) {
          const patch = stepChoreDemo({
            x, y, theta, carriageAglMm, boxX, boxY, boxHeld,
            armShoulderRad, armElbowRad, wipeContact, demoPhase, demoT, demoActive,
          }, DT)
          x = patch.x ?? x
          y = patch.y ?? y
          theta = patch.theta ?? theta
          carriageAglMm = patch.carriageAglMm ?? carriageAglMm
          boxX = patch.boxX ?? boxX
          boxY = patch.boxY ?? boxY
          boxHeld = patch.boxHeld ?? boxHeld
          armShoulderRad = patch.armShoulderRad ?? armShoulderRad
          armElbowRad = patch.armElbowRad ?? armElbowRad
          wipeContact = patch.wipeContact ?? wipeContact
          demoPhase = patch.demoPhase ?? demoPhase
          demoT = patch.demoT ?? demoT
        }

        // Lead-screw elevator Q/E — hard clamp soft limits (manual when not demo)
        let liftAtLimit = false
        if (!demoActive && keys.lift !== 0) {
          const rate = 280 // mm/s
          const next = carriageAglMm + keys.lift * rate * DT
          if (next <= SCREW_ELEVATOR.min_agl_mm || next >= SCREW_ELEVATOR.max_agl_mm) {
            liftAtLimit = true
          }
          carriageAglMm = Math.max(
            SCREW_ELEVATOR.min_agl_mm,
            Math.min(SCREW_ELEVATOR.max_agl_mm, next),
          )
        } else {
          liftAtLimit =
            carriageAglMm <= SCREW_ELEVATOR.min_agl_mm + 0.5 ||
            carriageAglMm >= SCREW_ELEVATOR.max_agl_mm - 0.5
        }

        // Tip-risk slowdown: high carriage → cut drive/yaw (UX poka-yoke ONLY)
        const span = SCREW_ELEVATOR.max_agl_mm - SCREW_ELEVATOR.min_agl_mm
        const liftFrac = span > 0
          ? (carriageAglMm - SCREW_ELEVATOR.min_agl_mm) / span
          : 0
        const tipSlowdown = liftFrac <= 0.55 ? 1 : 1 - (liftFrac - 0.55) / 0.45 * 0.55

        // Tip PHYSICS (separate from slowdown)
        const tipReachM = estimateReachM({ boxHeld, wipeContact, armShoulderRad, demoActive })
        const tipMomentNm = Math.round(tipMoment_Nm(tipReachM) * 100) / 100
        const restoreMomentNm = Math.round(restoringMoment_Nm() * 100) / 100
        const tipMarginLive = Math.round(tipMargin(tipReachM) * 100) / 100
        const wouldTipNow = wouldTip(tipReachM)
        if (wouldTipNow) tipOver = true
        // Clear tipOver only on reset (handled above)

        const sitBlend = prev.sitBlend + (sitTarget.current - prev.sitBlend) * Math.min(1, DT * 4)

        let steering = { forward: 0, yawRate: 0, strafe: 0 }
        if (!demoActive) {
          if (mode === 'teleop' || keys.forward !== 0 || keys.yawRate !== 0 || keys.strafe !== 0) {
            steering = { forward: keys.forward, yawRate: keys.yawRate, strafe: keys.strafe }
            if (keys.forward !== 0 || keys.yawRate !== 0 || keys.strafe !== 0) mode = 'teleop'
          } else {
            steering = brainRef.current.step({
              robot_x: x, robot_y: y, robot_theta: theta,
              beacon_x: ballX, beacon_y: ballY,
            })
          }
          steering = {
            forward: steering.forward * tipSlowdown,
            yawRate: steering.yawRate * tipSlowdown,
            strafe: (steering.strafe ?? 0) * tipSlowdown,
          }
        }

        // Freeze drive when tipped
        if (tipOver) {
          steering = { forward: 0, yawRate: 0, strafe: 0 }
        }

        const integrated = demoActive || tipOver
          ? { x, y, theta, phase, odo, v: 0, omega: 0, steering, pose: prev.pose, cadence: 0 }
          : integratePose({ ...prev, x, y, theta, phase, odo }, steering, DT, sitBlend)

        const ball = nudgeBall({
          ...prev,
          ...integrated,
          ballX, ballY, ballVx, ballVy,
        }, DT)

        if (boxHeld && !demoActive) {
          const reach = 0.28
          boxX = integrated.x + Math.cos(integrated.theta) * reach
          boxY = integrated.y + Math.sin(integrated.theta) * reach
        }

        const next: SimState = {
          ...prev, ...integrated, ...ball,
          boxX, boxY, boxHeld, carriageAglMm, liftAtLimit, tipSlowdown,
          tipMargin: tipMarginLive, tipMomentNm, restoreMomentNm,
          wouldTip: wouldTipNow, tipOver, tipReachM,
          demoActive, demoPhase, demoT, armShoulderRad, armElbowRad, wipeContact,
          mode, chaseCam, sitting, sitBlend, fps: stateRef.current.fps,
        }
        lastActionRef.current = steering
        trajRef.current.push(observe(next), steering, DT)
        stateRef.current = next
        setState(next)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const api = useMemo(() => ({ state, setChaseCam, notifyOrbitDetach }), [state, setChaseCam, notifyOrbitDetach])
  return <SimCtx.Provider value={api}>{children}</SimCtx.Provider>
}
