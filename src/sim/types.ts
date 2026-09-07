import type { GaitPose } from '../gait'
import type { Steering } from '../steering'

export type ControlMode = 'auto' | 'teleop'

export type SimState = {
  x: number
  y: number
  theta: number
  v: number
  omega: number
  cadence: number
  phase: number
  pose: GaitPose
  steering: Steering
  mode: ControlMode
  chaseCam: boolean
  sitBlend: number
  sitting: boolean
  fps: number
  odo: number
  beaconX: number
  beaconY: number
  ballX: number
  ballY: number
  ballVx: number
  ballVy: number
}

/** ~4 m half-width playground */
export const ARENA_HALF = 2.2
/** Fixed control timestep — 50 Hz (explicit for training loops) */
export const DT = 0.02
export const CONTROL_HZ = 1 / DT
export const START_X = 0
export const START_Y = -1.2
/** Facing +Y physics (= body +Z at spawn) */
export const START_THETA = Math.PI / 2
export const BEACON_X = 1.2
export const BEACON_Y = 1.3
