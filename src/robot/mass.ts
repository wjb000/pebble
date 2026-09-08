/**
 * HouseHand v3 mass estimates (grams).
 */
import { BATTERY, PI5, SO101, STS3215, STABILITY_NOTE } from './dims'
import { TIP } from './stability'

export const MASS_G = {
  wheeled_base_structure: 3200, // 400×450×18 plywood-class deck + bumper
  torso_head_structure: 420, // nested tubes prints + cam + shoulder bar
  nested_column: 1600,
  motors_wheels: 900, // 4× mecanum + drive motors
  motor_driver: 80,
  battery_pack: Math.round(TIP.ballast_kg * 1000),
  tote: 180,
  sts3215_each: STS3215.mass_g,
  so101_each: SO101.mass_g,
  so101_pair: SO101.mass_g * 2,
  pi_board: 45,
  camera_usb: 80, // head + 2× wrist
  mount_plate: 50,
  soft_pads_wipe: 30,
  estop: 40,
  wiring_misc: 120,
} as const

export function estimateBaseOnly_g(): number {
  return (
    MASS_G.wheeled_base_structure +
    MASS_G.torso_head_structure +
    MASS_G.nested_column +
    MASS_G.motors_wheels +
    MASS_G.motor_driver +
    MASS_G.battery_pack +
    MASS_G.tote +
    MASS_G.pi_board +
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
  nested_column_g: MASS_G.nested_column,
  ballast_g: MASS_G.battery_pack,
  pi_board_g: MASS_G.pi_board,
  pi_board_mm: `${PI5.W}×${PI5.H}`,
  battery_envelope_mm: `${BATTERY.W}×${BATTERY.H}×${BATTERY.D}`,
  stability_note: TORQUE_NOTE,
}
