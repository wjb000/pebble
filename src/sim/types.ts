import type { GaitPose } from '../gait'
import type { Steering } from '../steering'

export type ControlMode = 'auto' | 'teleop'

/** Scripted chore demo phases (G to start/stop). */
export type DemoPhase =
  | 'idle'
  | 'floor_grasp'
  | 'to_basket'
  | 'basket_drop'
  | 'wipe_pass'
  | 'washer_drop'
  | 'done'

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
  /** Small chore box / plate proxy (physics XY) */
  boxX: number
  boxY: number
  /** Kinematic attach when F pressed near box */
  boxHeld: boolean
  /** Lead-screw carriage AGL (mm) */
  carriageAglMm: number
  /** True when carriage is hard-clamped at min or max AGL */
  liftAtLimit: boolean
  /** Tip-risk drive scale 0..1 (UX only — not tip physics) */
  tipSlowdown: number
  /** Live tip margin = restore/tip (physics) */
  tipMargin: number
  tipMomentNm: number
  restoreMomentNm: number
  /** True when tip moment exceeds restoring */
  wouldTip: boolean
  tipOver: boolean
  /** Effective horizontal reach used for tip calc (m) */
  tipReachM: number
  /** Chore demo */
  demoActive: boolean
  demoPhase: DemoPhase
  demoT: number
  /** Arm demo pose (rad) — shoulder_lift / elbow simple */
  armShoulderRad: number
  armElbowRad: number
  /** Wipe contact flag (demo) */
  wipeContact: boolean
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
export const BOX_START_X = 0.95
export const BOX_START_Y = 0.25
/** Pick radius (m) — robot center to box */
export const BOX_PICK_RANGE = 0.42
