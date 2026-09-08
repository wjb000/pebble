/**
 * Holonomic mecanum steering → setpoints.
 *
 *   steering = { forward, strafe, yawRate } each in [-1, 1]
 *
 *   v       = forward * V_MAX      (robot-local +X physics / +Z body)
 *   vStrafe = strafe  * STRAFE_MAX (robot-local +Y physics / +X body)
 *   omega   = yawRate * OMEGA_MAX
 */

export const V_MAX = 0.42
export const STRAFE_MAX = 0.38
export const OMEGA_MAX = 1.6
export const CADENCE_MAX = 2.2

export type Steering = {
  forward: number
  yawRate: number
  strafe: number
}

export type GaitSetpoints = {
  v: number
  vStrafe: number
  omega: number
  cadence: number
}

export function clamp(x: number, lo = -1, hi = 1): number {
  return Math.max(lo, Math.min(hi, x))
}

export function steeringToSetpoints(
  steering: Partial<Steering>,
  opts?: { vMax?: number; strafeMax?: number; omegaMax?: number; cadenceMax?: number },
): GaitSetpoints {
  const forward = clamp(Number(steering.forward ?? 0))
  const yawRate = clamp(Number(steering.yawRate ?? 0))
  const strafe = clamp(Number(steering.strafe ?? 0))
  const vMax = opts?.vMax ?? V_MAX
  const strafeMax = opts?.strafeMax ?? STRAFE_MAX
  const omegaMax = opts?.omegaMax ?? OMEGA_MAX
  const cadenceMax = opts?.cadenceMax ?? CADENCE_MAX
  return {
    v: forward * vMax,
    vStrafe: strafe * strafeMax,
    omega: yawRate * omegaMax,
    cadence: Math.hypot(forward, strafe) * cadenceMax,
  }
}
