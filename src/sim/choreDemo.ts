/**
 * Scripted chore demos (Critic P0-3). Key G toggles.
 * 1) Floor→basket grasp  2) Wipe pass contact  3) Open-washer drop ~900
 * 4) Held-item Y tracks shoulder AGL (via carriageAglMm → ChoreProps)
 */
import { SCREW_ELEVATOR } from '../robot/dims'
import type { DemoPhase } from './types'

export type DemoSnapshot = {
  x: number
  y: number
  theta: number
  carriageAglMm: number
  boxX: number
  boxY: number
  boxHeld: boolean
  armShoulderRad: number
  armElbowRad: number
  wipeContact: boolean
  demoPhase: DemoPhase
  demoT: number
  demoActive: boolean
}

const CLOTH = { x: -0.4, y: 0.65 }
const BASKET = { x: -0.85, y: 0.35 }
const COUNTER = { x: 0.85, y: 0.15 }
const WASHER = { x: -1.15, y: -0.2 }

function approach(
  s: DemoSnapshot,
  tx: number,
  ty: number,
  dt: number,
  speed = 0.55,
): { x: number; y: number; theta: number; arrived: boolean } {
  const dx = tx - s.x
  const dy = ty - s.y
  const dist = Math.hypot(dx, dy)
  const theta = Math.atan2(dy, dx)
  if (dist < 0.08) return { x: s.x, y: s.y, theta, arrived: true }
  const step = Math.min(dist, speed * dt)
  return {
    x: s.x + (dx / dist) * step,
    y: s.y + (dy / dist) * step,
    theta,
    arrived: false,
  }
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t))
}

/** Advance demo one DT. Returns patch fields. */
export function stepChoreDemo(s: DemoSnapshot, dt: number): Partial<DemoSnapshot> {
  if (!s.demoActive) {
    return {
      demoPhase: 'idle',
      demoT: 0,
      armShoulderRad: lerp(s.armShoulderRad, 0, dt * 3),
      armElbowRad: lerp(s.armElbowRad, 0, dt * 3),
      wipeContact: false,
    }
  }

  let {
    x, y, theta, carriageAglMm, boxX, boxY, boxHeld,
    armShoulderRad, armElbowRad, wipeContact, demoPhase, demoT,
  } = s
  demoT += dt

  const setPhase = (p: DemoPhase) => {
    demoPhase = p
    demoT = 0
  }

  switch (demoPhase) {
    case 'idle':
      setPhase('floor_grasp')
      break

    case 'floor_grasp': {
      // Lower to floor pick, approach cloth, grasp
      carriageAglMm = lerp(carriageAglMm, SCREW_ELEVATOR.min_agl_mm + 20, dt * 1.2)
      armShoulderRad = lerp(armShoulderRad, 0.9, dt * 2)
      armElbowRad = lerp(armElbowRad, -0.6, dt * 2)
      const mov = approach({ ...s, x, y, theta }, CLOTH.x, CLOTH.y, dt, 0.5)
      x = mov.x; y = mov.y; theta = mov.theta
      if (mov.arrived && demoT > 1.2) {
        boxHeld = true
        boxX = CLOTH.x
        boxY = CLOTH.y
        setPhase('to_basket')
      }
      break
    }

    case 'to_basket': {
      carriageAglMm = lerp(carriageAglMm, SCREW_ELEVATOR.min_agl_mm + 40, dt * 1.0)
      armShoulderRad = lerp(armShoulderRad, 0.35, dt * 2)
      armElbowRad = lerp(armElbowRad, -0.25, dt * 2)
      const mov = approach({ ...s, x, y, theta }, BASKET.x + 0.25, BASKET.y, dt, 0.45)
      x = mov.x; y = mov.y; theta = mov.theta
      if (mov.arrived && demoT > 0.8) setPhase('basket_drop')
      break
    }

    case 'basket_drop': {
      carriageAglMm = lerp(carriageAglMm, SCREW_ELEVATOR.min_agl_mm, dt * 1.5)
      if (demoT > 0.6) {
        boxHeld = false
        boxX = BASKET.x
        boxY = BASKET.y
      }
      if (demoT > 1.4) setPhase('wipe_pass')
      break
    }

    case 'wipe_pass': {
      // Raise toward table wipe height, contact surface
      carriageAglMm = lerp(carriageAglMm, SCREW_ELEVATOR.default_agl_mm - 50, dt * 1.0)
      armShoulderRad = lerp(armShoulderRad, 0.55, dt * 2)
      armElbowRad = lerp(armElbowRad, -0.4, dt * 2)
      const mov = approach({ ...s, x, y, theta }, COUNTER.x, COUNTER.y, dt, 0.5)
      x = mov.x; y = mov.y; theta = mov.theta
      wipeContact = mov.arrived && Math.abs(carriageAglMm - (SCREW_ELEVATOR.default_agl_mm - 50)) < 140
      // Sweep along counter
      if (mov.arrived) {
        y = COUNTER.y + Math.sin(demoT * 2.2) * 0.08
        wipeContact = true
      }
      if (demoT > 3.5) {
        wipeContact = false
        setPhase('washer_drop')
      }
      break
    }

    case 'washer_drop': {
      // Open-washer drop ~900 mm AGL
      carriageAglMm = lerp(carriageAglMm, 900, dt * 0.9)
      armShoulderRad = lerp(armShoulderRad, 0.45, dt * 2)
      armElbowRad = lerp(armElbowRad, -0.3, dt * 2)
      const mov = approach({ ...s, x, y, theta }, WASHER.x, WASHER.y, dt, 0.45)
      x = mov.x; y = mov.y; theta = mov.theta
      if (demoT > 0.3 && !boxHeld) {
        // Re-pick a proxy near washer approach then drop in
        boxHeld = true
      }
      if (mov.arrived && demoT > 2.0 && Math.abs(carriageAglMm - 900) < 40) {
        boxHeld = false
        boxX = WASHER.x
        boxY = WASHER.y
        setPhase('done')
      }
      break
    }

    case 'done': {
      armShoulderRad = lerp(armShoulderRad, 0, dt * 2)
      armElbowRad = lerp(armElbowRad, 0, dt * 2)
      if (demoT > 1.5) {
        // Auto-cycle
        setPhase('floor_grasp')
        boxX = CLOTH.x
        boxY = CLOTH.y
      }
      break
    }
  }

  // Held item tracks robot (Y height applied in ChoreProps from carriageAglMm)
  if (boxHeld) {
    const reach = 0.28
    boxX = x + Math.cos(theta) * reach
    boxY = y + Math.sin(theta) * reach
  }

  return {
    x, y, theta, carriageAglMm, boxX, boxY, boxHeld,
    armShoulderRad, armElbowRad, wipeContact, demoPhase, demoT, demoActive: true,
  }
}
