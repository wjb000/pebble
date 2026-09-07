/**
 * Digital-twin training hooks — observation / action loop for teleop dumps & future RL.
 * Physics are simple planar unicycle + ball (not MuJoCo); geometry = CAD meshes.
 *
 * Action contract (stable): { forward, yawRate } in [-1, 1]
 * Observation: robot pose, ball relative, v/omega, mode
 * Fixed timestep: DT = 0.02 s (50 Hz) from types.ts
 * Reset: Space → START_* pose + ball spawn (see createInitialState / SimContext)
 *
 * Dev / external scripts: window.__PEBBLE_TRAIN__ after SimProvider mounts.
 */

import type { Steering } from '../steering'
import type { ControlMode, SimState } from './types'
import { DT } from './types'

export type TrainAction = Steering

export type TrainObservation = {
  x: number
  y: number
  theta: number
  v: number
  omega: number
  ball_x: number
  ball_y: number
  /** Ball position relative to robot in world XY (physics plane) */
  ball_dx: number
  ball_dy: number
  /** Bearing error to ball relative to heading (rad, atan2 wrapped) */
  ball_bearing: number
  ball_range: number
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
    mode: state.mode,
  }
}

const DEFAULT_CAPACITY = 2500 // 50 s @ 50 Hz

export class TrajectoryBuffer {
  readonly capacity: number
  private buf: TrainSample[] = []
  private t = 0

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
        action: '{ forward, yawRate } in [-1,1]',
        frame: 'physics XY ground plane; theta CCW from +X; robot-local forward',
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
