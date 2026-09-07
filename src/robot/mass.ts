/**
 * Pebble mass estimates (grams). Optional companion to dims.ts.
 * Not MuJoCo-perfect — geometry is draft; mass is planning budget.
 */
import { BATTERY, PI_ZERO, SO101, STS3215, STABILITY_NOTE } from './dims'

export const MASS_G = {
  wheeled_base_structure: 280,  // perceptron PLA
  torso_head_structure: 180,  // Prusa Z + cam + 4040 (extrusion bought separately)
  motors_wheels: 140,
  motor_driver: 35,
  ballast: 500,
  sts3215_each: STS3215.mass_g,
  so101_each: SO101.mass_g,
  so101_pair: SO101.mass_g * 2,
  pi_zero: 20,
  battery_lipo: 140,
  camera_screen: 100,
  mount_plate: 40,
  wiring_misc: 55,
} as const

export function estimateBaseOnly_g(): number {
  return (
    MASS_G.wheeled_base_structure +
    MASS_G.torso_head_structure +
    MASS_G.motors_wheels +
    MASS_G.motor_driver +
    MASS_G.ballast +
    MASS_G.pi_zero +
    MASS_G.battery_lipo +
    MASS_G.camera_screen +
    MASS_G.wiring_misc
  )
}

export function estimateWithOneArm_g(): number {
  return estimateBaseOnly_g() + MASS_G.so101_each + MASS_G.mount_plate
}

export function estimateWithDualArms_g(): number {
  return estimateBaseOnly_g() + MASS_G.so101_pair + MASS_G.mount_plate * 2
}

export const TORQUE_NOTE = STABILITY_NOTE

export const MASS_SUMMARY = {
  base_only_g: estimateBaseOnly_g(),
  with_one_arm_g: estimateWithOneArm_g(),
  with_dual_arms_g: estimateWithDualArms_g(),
  so101_each_g: MASS_G.so101_each,
  pi_board_mm: `${PI_ZERO.W}×${PI_ZERO.H}`,
  battery_envelope_mm: `${BATTERY.W}×${BATTERY.H}×${BATTERY.D}`,
  stability_note: TORQUE_NOTE,
}
