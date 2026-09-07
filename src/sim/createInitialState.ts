import { gaitPose } from '../gait'
import {
  BEACON_X, BEACON_Y, START_THETA, START_X, START_Y, type SimState,
} from './types'

export function createInitialState(): SimState {
  return {
    x: START_X, y: START_Y, theta: START_THETA,
    v: 0, omega: 0, cadence: 0, phase: 0,
    pose: gaitPose(0, 0),
    steering: { forward: 0, yawRate: 0 },
    mode: 'auto', chaseCam: true, sitBlend: 0, sitting: false,
    fps: 0, odo: 0,
    beaconX: BEACON_X, beaconY: BEACON_Y,
    ballX: -0.55, ballY: 0.2, ballVx: 0, ballVy: 0,
  }
}
