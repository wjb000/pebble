/**
 * Pebble mass estimates (grams). Critic P1: include ~1 kg 2040, Pi matches BOM, ballast kg.
 */
import { BATTERY, PI5, SO101, STS3215, STABILITY_NOTE } from './dims'
import { TIP } from './stability'

export const MASS_G = {
  wheeled_base_structure: 280,
  torso_head_structure: 180, // Prusa Z + cam + 4040 prints
  extrusion_2040: 1000, // ~1 kg bought 1010 mm 2040 — Critic P1
  mgn12_rail: 180,
  motors_wheels: 140,
  motor_driver: 35,
  /** Scrap-steel ballast — TIP.ballast_kg */
  ballast: Math.round(TIP.ballast_kg * 1000),
  outriggers: 400, // bought feet / angle stock
  sts3215_each: STS3215.mass_g,
  so101_each: SO101.mass_g,
  so101_pair: SO101.mass_g * 2,
  /** Pi 4-class board ~45 g (BOM compute line, not Pi Zero 9 g) */
  pi_board: 45,
  battery_lipo: 180,
  camera_usb: 40,
  mount_plate: 40,
  soft_pads_wipe: 30,
  estop: 40,
  wiring_misc: 70,
} as const

export function estimateBaseOnly_g(): number {
  return (
    MASS_G.wheeled_base_structure +
    MASS_G.torso_head_structure +
    MASS_G.extrusion_2040 +
    MASS_G.mgn12_rail +
    MASS_G.motors_wheels +
    MASS_G.motor_driver +
    MASS_G.ballast +
    MASS_G.outriggers +
    MASS_G.pi_board +
    MASS_G.battery_lipo +
    MASS_G.camera_usb +
    MASS_G.estop +
    MASS_G.wiring_misc
  )
}

export function estimateWithOneArm_g(): number {
  return estimateBaseOnly_g() + MASS_G.so101_each + MASS_G.mount_plate + MASS_G.soft_pads_wipe
}

export function estimateWithDualArms_g(): number {
  return estimateBaseOnly_g() + MASS_G.so101_pair + MASS_G.mount_plate * 2 + MASS_G.soft_pads_wipe
}

export const TORQUE_NOTE = STABILITY_NOTE

export const MASS_SUMMARY = {
  base_only_g: estimateBaseOnly_g(),
  with_one_arm_g: estimateWithOneArm_g(),
  with_dual_arms_g: estimateWithDualArms_g(),
  so101_each_g: MASS_G.so101_each,
  extrusion_2040_g: MASS_G.extrusion_2040,
  ballast_g: MASS_G.ballast,
  pi_board_g: MASS_G.pi_board,
  pi_board_mm: `${PI5.W}×${PI5.H}`,
  battery_envelope_mm: `${BATTERY.W}×${BATTERY.H}×${BATTERY.D}`,
  stability_note: TORQUE_NOTE,
}
