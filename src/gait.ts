/**
 * Legacy gait clock kept for sim state; wheeled Pebble ignores biped visuals.
 *
 * Joint layout mirrors legacy biped leg stack (unused on wheeled Pebble):
 *   hip_yaw → hip_roll → hip_pitch → knee → ankle
 * Left 0–4 / right 9–13; neck/head 5–8 driven lightly for screen aim.
 * Mouth/beak = 15th XL330 (visual in Pebble head).
 *
 * Procedural sinusoidal walk; {forward, yawRate} drives cadence upstream.
 */

export type LegAngles = {
  hipYaw: number
  hipRoll: number
  hipPitch: number
  knee: number
  ankle: number
}

export type NeckAngles = {
  neckPitch: number
  headPitch: number
  headYaw: number
  headRoll: number
}

export type GaitPose = {
  left: LegAngles
  right: LegAngles
  neck: NeckAngles
  bob: number
  sitBlend: number
  /** 0 = open idle, 1 = closed — SO-101 gripper idle blend */
  handClose: number
}

export const HIP_YAW_AMP = 0.12
export const HIP_ROLL_AMP = 0.08
export const HIP_PITCH_AMP = 0.55
export const KNEE_AMP = 0.85
export const ANKLE_AMP = 0.25
export const BOB_AMP = 0.0025

export function wrapPhase(phi: number): number {
  const twoPi = Math.PI * 2
  return ((phi % twoPi) + twoPi) % twoPi
}

export function legFromPhase(phi: number, side: 'L' | 'R'): LegAngles {
  const s = Math.sin(phi)
  const c = Math.cos(phi)
  const sideSign = side === 'L' ? 1 : -1
  const swing = Math.max(0, s)
  return {
    hipYaw: HIP_YAW_AMP * s * 0.35 * sideSign,
    hipRoll: HIP_ROLL_AMP * c * sideSign,
    hipPitch: HIP_PITCH_AMP * s,
    knee: KNEE_AMP * swing * (0.55 + 0.45 * Math.abs(c)),
    ankle: -ANKLE_AMP * swing + 0.05 * s,
  }
}

function neckFromPhase(phi: number, sitBlend: number): NeckAngles {
  const s = Math.sin(phi * 0.5)
  const c = Math.cos(phi * 0.5)
  return {
    neckPitch: 0.06 * s - 0.08 * sitBlend,
    headPitch: 0.04 * c,
    headYaw: 0.1 * Math.sin(phi * 0.25),
    headRoll: 0.03 * s,
  }
}

export function gaitPose(phi: number, sitBlend = 0): GaitPose {
  const p = wrapPhase(phi)
  const left = legFromPhase(p, 'L')
  const right = legFromPhase(p + Math.PI, 'R')
  const bob = BOB_AMP * Math.abs(Math.sin(2 * p)) * (1 - sitBlend)
  const neck = neckFromPhase(p, sitBlend)

  if (sitBlend > 0) {
    const sit: LegAngles = {
      hipYaw: 0,
      hipRoll: 0.05,
      hipPitch: 0.95,
      knee: 1.4,
      ankle: -0.35,
    }
    const blend = (a: LegAngles, b: LegAngles): LegAngles => ({
      hipYaw: a.hipYaw * (1 - sitBlend) + b.hipYaw * sitBlend,
      hipRoll: a.hipRoll * (1 - sitBlend) + b.hipRoll * sitBlend,
      hipPitch: a.hipPitch * (1 - sitBlend) + b.hipPitch * sitBlend,
      knee: a.knee * (1 - sitBlend) + b.knee * sitBlend,
      ankle: a.ankle * (1 - sitBlend) + b.ankle * sitBlend,
    })
    return {
      left: blend(left, { ...sit, hipRoll: 0.05 }),
      right: blend(right, { ...sit, hipRoll: -0.05 }),
      neck,
      bob: bob - 0.06 * sitBlend,
      sitBlend,
      handClose: 0,
    }
  }

  return { left, right, neck, bob, sitBlend, handClose: 0 }
}

export function advancePhase(phi: number, cadenceHz: number, dt: number): number {
  return wrapPhase(phi + Math.PI * 2 * Math.max(0, cadenceHz) * dt)
}
