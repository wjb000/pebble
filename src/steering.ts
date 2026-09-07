/**
 * Locomotion steering → biped gait setpoints.
 *
 * Normalized velocity command (WASD / gamepad / stub seeker):
 *
 *   steering = { forward: number in [-1, 1], yawRate: number in [-1, 1] }
 *
 * Gains map normalized commands to physical setpoints:
 *
 *   V_MAX       = 0.18 m/s   — full-throttle walk speed along ground
 *   OMEGA_MAX   = 1.8 rad/s  — full-throttle yaw (facing) rate
 *   CADENCE_MAX = 2.2 Hz     — peak gait frequency at |forward| = 1
 *
 *   v       = clamp(forward,  -1, 1) * V_MAX
 *   omega   = clamp(yawRate,  -1, 1) * OMEGA_MAX
 *   cadence = abs(clamp(forward, -1, 1)) * CADENCE_MAX
 */

export const V_MAX = 0.18
export const OMEGA_MAX = 1.8
export const CADENCE_MAX = 2.2

export type Steering = {
  forward: number
  yawRate: number
}

export type GaitSetpoints = {
  v: number
  omega: number
  cadence: number
}

export function clamp(x: number, lo = -1, hi = 1): number {
  return Math.max(lo, Math.min(hi, x))
}

export function steeringToSetpoints(
  steering: Partial<Steering>,
  opts?: { vMax?: number; omegaMax?: number; cadenceMax?: number },
): GaitSetpoints {
  const forward = clamp(Number(steering.forward ?? 0))
  const yawRate = clamp(Number(steering.yawRate ?? 0))
  const vMax = opts?.vMax ?? V_MAX
  const omegaMax = opts?.omegaMax ?? OMEGA_MAX
  const cadenceMax = opts?.cadenceMax ?? CADENCE_MAX
  return {
    v: forward * vMax,
    omega: yawRate * omegaMax,
    cadence: Math.abs(forward) * cadenceMax,
  }
}
