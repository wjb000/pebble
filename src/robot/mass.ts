/**
 * Pebble mass estimates (grams). Optional companion to dims.ts.
 * Not MuJoCo-perfect — geometry is exact; mass is planning budget.
 */
import { BATTERY, PI_ZERO, SO101, STS3215, TOPHEAVY_NOTE, XL330 } from './dims'

export const MASS_G = {
  xl330_each: XL330.mass_g,
  /** Microduck-class body actuators 15× XL330 */
  xl330_body_15: XL330.mass_g * XL330.qty_body, // 270
  /** Published Microduck body target */
  microduck_body_budget: 800,
  sts3215_each: STS3215.mass_g,
  /** 12× STS3215 in dual SO-101 */
  sts3215_arms_12: STS3215.mass_g * STS3215.qty_arms_pair, // 660
  so101_each: SO101.mass_g,
  so101_pair: SO101.mass_g * 2, // ~1600 — dominates
  pi_zero: 20,
  battery_lipo: 80,
  frame_pla_body: 180,
  mount_plates: 120,
  counterweight_optional: 400,
  camera_misc: 40,
  wiring_misc: 60,
} as const

/** Body-only rough (no arms) — should stay near Microduck <800 g */
export function estimateBodyOnly_g(): number {
  return (
    MASS_G.xl330_body_15 +
    MASS_G.pi_zero +
    MASS_G.battery_lipo +
    MASS_G.frame_pla_body +
    MASS_G.camera_misc +
    MASS_G.wiring_misc
  )
}

/** Twin with dual SO-101 — top-heavy; include mount plate */
export function estimateWithArms_g(): number {
  return estimateBodyOnly_g() + MASS_G.so101_pair + MASS_G.mount_plates
}

/** Tabletop / braced mode with optional counterweight */
export function estimateDocked_g(): number {
  return estimateWithArms_g() + MASS_G.counterweight_optional
}

export const TORQUE_NOTE = TOPHEAVY_NOTE

export const MASS_SUMMARY = {
  body_only_g: estimateBodyOnly_g(),
  with_arms_g: estimateWithArms_g(),
  docked_with_ballast_g: estimateDocked_g(),
  microduck_body_budget_g: MASS_G.microduck_body_budget,
  so101_pair_g: MASS_G.so101_pair,
  pi_board_mm: `${PI_ZERO.W}×${PI_ZERO.H}`,
  battery_envelope_mm: `${BATTERY.W}×${BATTERY.H}×${BATTERY.D}`,
  torque_note: TORQUE_NOTE,
}
