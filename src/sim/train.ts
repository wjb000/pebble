/**
 * Digital-twin training hooks — observation / action loop for teleop dumps & BC.
 * Physics: planar holonomic mecanum + ball/box (not MuJoCo).
 *
 * Action contract: { forward, strafe, yawRate } in [-1, 1]
 * Observation: pose, ball, box, lift, arms, mode
 * Fixed timestep: DT = 0.02 s (50 Hz)
 *
 * Dev / external: window.__PEBBLE_TRAIN__ after SimProvider mounts.
 */

import type { Steering } from '../steering'
import type { ControlMode, SimState } from './types'
import { DT } from './types'
import type { PolicyWeights, TrainReport } from './policy'

export type TrainAction = Steering

export type TrainObservation = {
  x: number
  y: number
  theta: number
  v: number
  omega: number
  ball_x: number
  ball_y: number
  ball_dx: number
  ball_dy: number
  ball_bearing: number
  ball_range: number
  box_x: number
  box_y: number
  box_dx: number
  box_dy: number
  box_range: number
  box_held: boolean
  lift_frac: number
  arm_shoulder: number
  arm_elbow: number
  mode: ControlMode
}

export type TrainSample = {
  t: number
  dt: number
  obs: TrainObservation
  action: TrainAction
}

export function observe(state: SimState): TrainObservation {
  const ball_dx = state.ballX - state.x
  const ball_dy = state.ballY - state.y
  const ball_range = Math.hypot(ball_dx, ball_dy)
  const desired = Math.atan2(ball_dy, ball_dx)
  const ball_bearing = Math.atan2(
    Math.sin(desired - state.theta),
    Math.cos(desired - state.theta),
  )
  const box_dx = state.boxX - state.x
  const box_dy = state.boxY - state.y
  const box_range = Math.hypot(box_dx, box_dy)
  const span = 1 // normalized externally via TELESCOPE in callers if needed
  void span
  return {
    x: state.x,
    y: state.y,
    theta: state.theta,
    v: state.v,
    omega: state.omega,
    ball_x: state.ballX,
    ball_y: state.ballY,
    ball_dx,
    ball_dy,
    ball_bearing,
    ball_range,
    box_x: state.boxX,
    box_y: state.boxY,
    box_dx,
    box_dy,
    box_range,
    box_held: state.boxHeld,
    lift_frac: state.carriageAglMm > 0 ? Math.min(1, Math.max(0, (state.carriageAglMm - 400) / 600)) : 0,
    arm_shoulder: state.armShoulderRad,
    arm_elbow: state.armElbowRad,
    mode: state.mode,
  }
}

/** Prefer dims-aware lift fraction when elevator bounds are known. */
export function observeWithLift(
  state: SimState,
  minAgl: number,
  maxAgl: number,
): TrainObservation {
  const base = observe(state)
  const span = maxAgl - minAgl
  return {
    ...base,
    lift_frac: span > 0 ? Math.max(0, Math.min(1, (state.carriageAglMm - minAgl) / span)) : 0,
  }
}

const DEFAULT_CAPACITY = 5000 // 100 s @ 50 Hz

export class TrajectoryBuffer {
  readonly capacity: number
  private buf: TrainSample[] = []
  private t = 0
  recording = true

  constructor(capacity = DEFAULT_CAPACITY) {
    this.capacity = capacity
  }

  get time(): number {
    return this.t
  }

  get length(): number {
    return this.buf.length
  }

  resetClock(): void {
    this.t = 0
    this.buf = []
  }

  push(obs: TrainObservation, action: TrainAction, dt = DT): void {
    if (!this.recording) return
    this.t += dt
    this.buf.push({ t: this.t, dt, obs, action: { ...action } })
    if (this.buf.length > this.capacity) this.buf.shift()
  }

  samples(): readonly TrainSample[] {
    return this.buf
  }

  toJSON(): string {
    return JSON.stringify(
      {
        dt: DT,
        hz: 1 / DT,
        action: '{ forward, strafe, yawRate } in [-1,1]',
        frame: 'physics XY ground plane; theta CCW from +X; holonomic mecanum',
        n: this.buf.length,
        samples: this.buf,
      },
      null,
      2,
    )
  }

  download(filename = `pebble-traj-${Date.now()}.json`): void {
    const blob = new Blob([this.toJSON()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
}

export type PebbleTrainApi = {
  dt: number
  hz: number
  getObs: () => TrainObservation | null
  getAction: () => TrainAction | null
  getState: () => SimState | null
  buffer: TrajectoryBuffer
  downloadTrajectory: (filename?: string) => void
  clearTrajectory: () => void
  setRecording: (on: boolean) => void
  isRecording: () => boolean
  trainFromBuffer: (epochs?: number) => TrainReport
  getPolicy: () => PolicyWeights | null
  runPolicy: () => void
  stopPolicy: () => void
  clearPolicy: () => void
  downloadPolicy: () => void
}

declare global {
  interface Window {
    __PEBBLE_TRAIN__?: PebbleTrainApi
  }
}

export function installTrainApi(api: PebbleTrainApi): () => void {
  window.__PEBBLE_TRAIN__ = api
  return () => {
    if (window.__PEBBLE_TRAIN__ === api) delete window.__PEBBLE_TRAIN__
  }
}
