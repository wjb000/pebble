import { SCREW_ELEVATOR } from '../robot/dims'
import { TIP_SUMMARY } from '../robot/stability'
import { gaitPose } from '../gait'
import {
  BEACON_X, BEACON_Y, BOX_START_X, BOX_START_Y, START_THETA, START_X, START_Y, type SimState,
} from './types'

export function createInitialState(): SimState {
  return {
    x: START_X, y: START_Y, theta: START_THETA,
    v: 0, omega: 0, cadence: 0, phase: 0,
    pose: gaitPose(0, 0),
    steering: { forward: 0, yawRate: 0, strafe: 0 },
    mode: 'auto', chaseCam: true, sitBlend: 0, sitting: false,
    fps: 0, odo: 0,
    beaconX: BEACON_X, beaconY: BEACON_Y,
    ballX: -0.55, ballY: 0.2, ballVx: 0, ballVy: 0,
    boxX: BOX_START_X, boxY: BOX_START_Y, boxHeld: false,
    carriageAglMm: SCREW_ELEVATOR.default_agl_mm,
    liftAtLimit: false,
    tipSlowdown: 1,
    tipMargin: TIP_SUMMARY.margin,
    tipMomentNm: TIP_SUMMARY.tip_moment_Nm,
    restoreMomentNm: TIP_SUMMARY.restoring_moment_Nm,
    wouldTip: false,
    tipOver: false,
    tipReachM: 0.15,
    demoActive: false,
    demoPhase: 'idle',
    demoT: 0,
    armShoulderRad: 0,
    armElbowRad: 0,
    wipeContact: false,
  }
}
