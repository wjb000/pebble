import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from 'react'
import { StubBrain } from '../brain'
import { createInitialState } from './createInitialState'
import { installKeyboard, sampleKeys } from './keyboard'
import { integratePose, nudgeBall } from './physics'
import { DT, START_THETA, START_X, START_Y, type SimState } from './types'

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

  const setChaseCam = useCallback((v: boolean) => {
    setState((s) => ({ ...s, chaseCam: v }))
  }, [])

  const notifyOrbitDetach = useCallback(() => {
    setState((s) => (s.chaseCam ? { ...s, chaseCam: false } : s))
  }, [])

  useEffect(() => installKeyboard(), [])

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

        if (keys.toggleMode) mode = mode === 'auto' ? 'teleop' : 'auto'
        if (keys.toggleChase) chaseCam = !chaseCam
        if (keys.toggleSit) sitting = !sitting
        if (keys.reset) {
          x = START_X; y = START_Y; theta = START_THETA; phase = 0
          sitting = false; sitTarget.current = 0; odo = 0
          ballX = -0.55; ballY = 0.2; ballVx = 0; ballVy = 0
        }

        sitTarget.current = sitting ? 1 : 0
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
        const next: SimState = {
          ...prev, ...integrated, ...ball,
          mode, chaseCam, sitting, sitBlend, fps: stateRef.current.fps,
        }
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
