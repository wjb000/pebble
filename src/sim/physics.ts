import { advancePhase, gaitPose, type GaitPose } from '../gait'
import { steeringToSetpoints, type Steering } from '../steering'
import { ARENA_HALF, type SimState } from './types'

const BALL_R = 0.08
/** Half-diagonal of 400×450 mm deck + bumper */
const ROBOT_R = 0.28

/**
 * Holonomic integrate in the physics XY plane (mapped to Three.js XZ).
 * Forward along heading theta (CCW from +X); strafe is robot-local left (+90°).
 */
export function integratePose(
  state: SimState,
  steering: Steering,
  dt: number,
  sitBlend: number,
): Pick<SimState, 'x' | 'y' | 'theta' | 'v' | 'omega' | 'cadence' | 'phase' | 'pose' | 'steering' | 'odo'> {
  const sitFactor = 1 - sitBlend * 0.95
  const setpoints = steeringToSetpoints(steering)
  const v = setpoints.v * sitFactor
  const vStrafe = setpoints.vStrafe * sitFactor
  const omega = setpoints.omega * sitFactor
  const cadence = setpoints.cadence * sitFactor
  const c = Math.cos(state.theta)
  const s = Math.sin(state.theta)
  let x = state.x + (c * v - s * vStrafe) * dt
  let y = state.y + (s * v + c * vStrafe) * dt
  let theta = state.theta + omega * dt
  theta = Math.atan2(Math.sin(theta), Math.cos(theta))
  const limit = ARENA_HALF - ROBOT_R
  x = Math.max(-limit, Math.min(limit, x))
  y = Math.max(-limit, Math.min(limit, y))
  const phase = cadence > 0.05 ? advancePhase(state.phase, cadence, dt) : state.phase
  const pose: GaitPose = gaitPose(phase, sitBlend)
  const odo = state.odo + Math.hypot(v, vStrafe) * dt
  return { x, y, theta, v, omega, cadence, phase, pose, steering, odo }
}

export function nudgeBall(state: SimState, dt: number): Pick<SimState, 'ballX' | 'ballY' | 'ballVx' | 'ballVy'> {
  let { ballX, ballY, ballVx, ballVy } = state
  const dx = ballX - state.x
  const dy = ballY - state.y
  const dist = Math.hypot(dx, dy)
  const minDist = ROBOT_R + BALL_R
  if (dist < minDist && dist > 1e-4) {
    const nx = dx / dist
    const ny = dy / dist
    const push = (minDist - dist) * 8
    ballVx += nx * push
    ballVy += ny * push
    ballX = state.x + nx * minDist
    ballY = state.y + ny * minDist
  }
  ballX += ballVx * dt
  ballY += ballVy * dt
  ballVx *= 0.92
  ballVy *= 0.92
  if (Math.hypot(ballVx, ballVy) < 0.01) { ballVx = 0; ballVy = 0 }
  const limit = ARENA_HALF - BALL_R - 0.05
  if (ballX > limit) { ballX = limit; ballVx *= -0.5 }
  if (ballX < -limit) { ballX = -limit; ballVx *= -0.5 }
  if (ballY > limit) { ballY = limit; ballVy *= -0.5 }
  if (ballY < -limit) { ballY = -limit; ballVy *= -0.5 }
  return { ballX, ballY, ballVx, ballVy }
}
