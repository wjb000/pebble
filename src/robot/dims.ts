/**
 * Pebble dimensions — documentation / mounts / BOM / print twin (millimeters / grams).
 * Product: low wheeled differential-drive base + mast camera + 1× LeRobot SO-101 (v1).
 * Dual SO-101 is an optional upgrade. NOT official Pollen / Microduck.
 * Visual on /sim: printable base STLs (public/assets/base/) + SO-101 follower GLB
 * baked from upstream printable URDF meshes. Three.js converts mm → m only at render (mmToM).
 */

export const MM = 1
export const mmToM = (mm: number) => mm * 0.001
export const mToMm = (m: number) => m * 1000

/**
 * Printable octagonal differential base — matches print/base/*.stl
 * Flat-to-flat diameter, 3.5 mm plates, standoffs between top/bottom.
 */
export const BASE = {
  diameter_mm: 280,
  plate_thickness_mm: 3.5,
  standoff_height_mm: 55,
  standoff_od_mm: 10,
  standoff_qty: 6,
  /** Overall plate stack (bottom + standoffs + top) */
  height_mm: 62,
  wheel_diameter_mm: 70,
  wheel_width_mm: 22,
  track_mm: 240,
  caster_diameter_mm: 28,
  motor_pod_l_mm: 55,
  motor_pod_w_mm: 32,
  motor_pod_h_mm: 38,
  arm_pad_t_mm: 4,
  note:
    'Printable octagon plates + pods + mast; rubber tires / motors / caster bought (not printed)',
} as const

/** Mast for the single cheap eye — print/base/mast.stl + camera_shelf.stl */
export const MAST = {
  height_mm: 180,
  diameter_mm: 18,
  offset_forward_mm: 0,
  shelf_w_mm: 40,
  shelf_d_mm: 28,
  shelf_t_mm: 3,
} as const

/** Tiny CSI/USB camera on mast shelf (bought module) */
export const CAMERA = {
  W: 18,
  H: 14,
  D: 12,
  rise: 2,
} as const

/**
 * Feetech STS3215 — used on SO-101 arms.
 * Datasheet case mm; ~55 g; ~19 kg·cm @ 6–7.4 V.
 */
export const STS3215 = {
  L: 45.2,
  W: 24.7,
  H: 35.0,
  mass_g: 55,
  torque_kgcm: 19,
  bus: 'TTL' as const,
  qty_per_arm: 6,
  /** Optional dual-arm upgrade */
  qty_arms_pair: 12,
} as const

/**
 * LeRobot SO-101 follower arm — Hugging Face LeRobot / TheRobotStudio SO-ARM100.
 * Docs: https://huggingface.co/docs/lerobot/en/so101 · so101_follower
 * Printables: print/SO101/ (upstream Individual + Follower plate)
 */
export const SO101 = {
  joints: [
    'shoulder_pan',
    'shoulder_lift',
    'elbow_flex',
    'wrist_flex',
    'wrist_roll',
    'gripper',
  ] as const,
  dof: 6,
  base_z: 62.4,
  shoulder_lift_z: 54.2,
  upper_arm: 112.6,
  forearm: 134.9,
  wrist: 61.1,
  gripper: 80,
  reach_mm: 500,
  mass_g: 800,
  diy_usd_lo: 100,
  diy_usd_hi: 200,
  sts3215_qty: 6,
  source:
    'LeRobot SO-101 / so101_follower; URDF so101_new_calib.urdf; HF docs/lerobot/en/so101; print/SO101/',
} as const

/**
 * Default v1: one SO-101 on the right/front of the base (reachable for floor/table-edge).
 * Body frame: +Y up, +Z forward, +X left.
 * Mount pad STL bakes XZ; mount_y = top of top plate + pad thickness.
 */
export const ARM = {
  /** Lateral offset of shoulder mount from base center (mm); +X = left */
  mount_x_mm: -90,
  /** Height of mount top above floor (mm) = base height + pad */
  mount_y_mm: 66,
  /** Forward offset along +Z (mm) */
  mount_z_mm: 40,
  default_count: 1,
  optional_second: true,
} as const

/** Overall visual height: base + mast + cam */
export const STANDING_HEIGHT_MM = BASE.height_mm + MAST.height_mm + CAMERA.H

export const BODY_WIDTH_MM = BASE.diameter_mm

export const PI_ZERO = {
  W: 65,
  H: 30,
  D: 12,
  note: 'Pi Zero 2 W / Radxa Zero 3W class; base bay',
} as const

export const PI5 = PI_ZERO

export const BATTERY = {
  W: 50,
  H: 22,
  D: 35,
  note: '2S/3S LiPo envelope; chemistry TBD at build',
} as const

/**
 * Wheeled base carries arm mass better than a biped — still mind tip on ramps / rugs.
 * Dual arms optional; v1 ships one arm for cost + balance.
 */
export const STABILITY_NOTE =
  'Wheeled low base is the product locomotion (not Microduck biped). One SO-101 (~800 g) is the v1 default; dual arms optional. Mind rugs, thresholds, and arm reach when extended.'

/** @deprecated alias — wheeled product; kept so old imports compile briefly */
export const TOPHEAVY_NOTE = STABILITY_NOTE

/**
 * Legacy XL330 datasheet kept only as reference (NOT part of v1 BOM).
 * Previous Microduck-class biped framing dropped for this home-chore goal.
 */
export const XL330 = {
  L: 20.0,
  W: 34.0,
  H: 26.0,
  mass_g: 18,
  torque_nm: 0.52,
  bus: 'TTL' as const,
  qty_body: 0,
  note: 'Not used on wheeled Pebble v1 — retained for archive only',
} as const

export const PEBBLE_DIMS = {
  product: 'Pebble — wheeled base + eye + 1× SO-101 (not official Pollen)',
  standing_height_mm: STANDING_HEIGHT_MM,
  body_width_mm: BODY_WIDTH_MM,
  base: BASE,
  mast: MAST,
  camera: CAMERA,
  sts3215: STS3215,
  so101: SO101,
  arm: ARM,
  pi_zero: PI_ZERO,
  battery: BATTERY,
  stability_note: STABILITY_NOTE,
  units: 'mm / g',
  digital_twin_rule:
    'visual = printable base STLs (public/assets/base) + SO-101 GLB baked from upstream printable URDF STLs; dims.ts = print = BOM',
  sources: [
    'Pebble print/base octagon diff-drive (authored numpy-stl)',
    'SO-101 URDF so101_new_calib.urdf + TheRobotStudio/SO-ARM100 STL/SO101 + HF docs/lerobot/en/so101',
  ],
} as const

export type PebbleDims = typeof PEBBLE_DIMS
