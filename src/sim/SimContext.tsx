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

export function SimProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SimState>(() => createInitialState())
  const stateRef = useRef(state)
  stateRef.current = state
  const brainRef = useRef(new StubBrain())
  const fpsAcc = useRef({ frames: 0, t: performance.now() })
  const sitTarget = useRef(0)
  const trajRef = useRef(new TrajectoryBuffer())
  const lastActionRef = useRef<TrainAction>({ forward: 0, yawRate: 0 })

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

        if (keys.toggleMode) mode = mode === 'auto' ? 'teleop' : 'auto'
        if (keys.toggleChase) chaseCam = !chaseCam
        if (keys.toggleSit) sitting = !sitting
        if (keys.reset) {
          x = START_X; y = START_Y; theta = START_THETA; phase = 0
          sitting = false; sitTarget.current = 0; odo = 0
          ballX = -0.55; ballY = 0.2; ballVx = 0; ballVy = 0
          boxX = BOX_START_X; boxY = BOX_START_Y; boxHeld = false
          carriageAglMm = SCREW_ELEVATOR.default_agl_mm
          trajRef.current.resetClock()
        }

        if (keys.togglePick) {
          if (boxHeld) {
            // Drop ahead of robot
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

        // Lead-screw elevator Q/E
        if (keys.lift !== 0) {
          const rate = 280 // mm/s
          carriageAglMm = Math.max(
            SCREW_ELEVATOR.min_agl_mm,
            Math.min(SCREW_ELEVATOR.max_agl_mm, carriageAglMm + keys.lift * rate * DT),
          )
        }
        const sitBlend = prev.sitBlend + (sitTarget.current - prev.sitBlend) * Math.min(1, DT * 4)

        let steering = { forward: 0, yawRate: 0 }
        if (mode === 'teleop' || keys.forward !== 0 || keys.yawRate !== 0) {
          steering = { forward: keys.forward, yawRate: keys.yawRate }
          if (keys.forward !== 0 || keys.yawRate !== 0) mode = 'teleop'
        } else {
          steering = brainRef.current.step({
            robot_x: x, robot_y: y, robot_theta: theta,
            beacon_x: ballX, beacon_y: ballY,
          })
        }

        const integrated = integratePose({ ...prev, x, y, theta, phase, odo }, steering, DT, sitBlend)
        const ball = nudgeBall({ ...prev, ...integrated, ballX, ballY, ballVx, ballVy }, DT)

        // Keep held box tracking robot (ChoreProps also mirrors for render)
        if (boxHeld) {
          const reach = 0.28
          boxX = integrated.x + Math.cos(integrated.theta) * reach
          boxY = integrated.y + Math.sin(integrated.theta) * reach
        }

        const next: SimState = {
          ...prev, ...integrated, ...ball,
          boxX, boxY, boxHeld, carriageAglMm,
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
