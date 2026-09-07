/**
 * Pebble dimensions — composed from real OSS meshes + bought extrusion.
 * Base: PedroS235/perceptron_bot (MIT)
 * Lift: prusa3d/Original-Prusa-i3 Z + x-end nut carriage (GPL-2.0)
 * Head: TheRobotStudio/SO-ARM100 Optional Overhead Cam (Apache-2.0)
 * Arms: TheRobotStudio/SO-ARM100 / LeRobot SO-101 (Apache-2.0)
 * NOT official Pollen / Microduck. No generated placeholder bodies.
 */

export const MM = 1
export const mmToM = (mm: number) => mm * 0.001
export const mToMm = (m: number) => m * 1000

/**
 * Overall product height with purchased 2040 extrusion column.
 * Assert: BASE.height_mm + EXTRUSION.length_mm + HEAD.stack_h_mm ≈ OVERALL_HEIGHT_MM (1730).
 * Printable OSS meshes alone are shorter; extrusion fills the gap to human scale.
 */
export const OVERALL_HEIGHT_MM = 1730

export const HEIGHT_NOTE =
  'Overall 1730 mm (~5′8″) = perceptron base 108 mm + bought 2040 extrusion 1540 mm + head/cam stack ~82 mm. Printable upstream meshes alone are shorter; extrusion is a bought stock envelope in sim + BOM.'

/** Perceptron Bot chassis — plates stack in CAD-Z ≈ 0…108 mm (170×170 mm footprint). */
export const BASE = {
  footprint_mm: 170,
  /** Top of top_plate in upstream CAD-Z */
  height_mm: 108,
  depth_mm: 170,
  diameter_mm: 170,
  wheel_diameter_mm: 65,
  wheel_width_mm: 25,
  track_mm: 160,
  wheelbase_mm: 140,
  caster_diameter_mm: 16,
  axle_height_mm: 32.5,
  upstream: 'PedroS235/perceptron_bot (MIT)',
  note: 'Diff-drive chassis plates/walls/casters from perceptron_bot; drive tires/gearmotors bought',
} as const

/**
 * Bought 2040 extrusion column — not printed.
 * Length chosen so base.height + extrusion + head ≈ OVERALL_HEIGHT_MM.
 */
export const EXTRUSION = {
  profile: '2040 V-slot aluminium',
  length_mm: 1540,
  width_mm: 20,
  depth_mm: 40,
  note: 'Purchased column; printable Prusa Z mounts bolt to it; leadscrew runs parallel',
} as const

/** Shared lead-screw / column axis offset in +X from robot center (mm). */
export const SCREW_AXIS_X_MM = 22

/**
 * Screw-drive shoulder elevator — Prusa Z motor/top + x-end-motor nut carriage.
 * Carriage AGL measured from floor; travel along extrusion.
 */
export const SCREW_ELEVATOR = {
  min_agl_mm: 160,
  max_agl_mm: 1250,
  travel_mm: 1090,
  default_agl_mm: 900,
  screw_od_mm: 8,
  screw_pitch_mm: 2,
  screw_length_mm: 1500,
  axis_x_mm: SCREW_AXIS_X_MM,
  motor: 'NEMA17 (Prusa z-axis-bottom mount)',
  anti_rotation: '2040 extrusion slot (MGN12 omitted on cheap default)',
  printed_parts: [
    'z-axis-bottom.stl',
    'carriage_x-end-motor.stl',
    'z-axis-top.stl',
    'z-screw-cover.stl',
    '4040_base_mount.stl',
  ] as const,
  upstream: 'prusa3d/Original-Prusa-i3 (GPL-2.0) + SO-ARM100 4040_Base_Mount (Apache-2.0)',
  note: 'Lead screw spins; Prusa x-end-motor rides as nut carriage carrying both SO-101s',
} as const

/** @deprecated alias */
export const LIFT = SCREW_ELEVATOR

/** Modular torso ≈ extrusion visual envelope */
export const TORSO = {
  height_mm: EXTRUSION.length_mm,
  width_mm: EXTRUSION.width_mm,
  depth_mm: EXTRUSION.depth_mm,
  segment_h_mm: EXTRUSION.length_mm,
  segment_qty: 1,
  note: 'Bought 2040 extrusion (stock envelope in sim); not a generated printable torso',
} as const

/** SO-ARM100 overhead UVC cam mount stack at column top (true 1:1 scale) */
export const HEAD = {
  /** Effective stack height contributing to overall (neck + cam body) */
  stack_h_mm: 82,
  neck_h_mm: 12,
  bezel_w_mm: 58,
  bezel_h_mm: 40,
  bezel_t_mm: 37,
  screen_w_mm: 36,
  screen_h_mm: 24,
  screen_t_mm: 4,
  cam_mount_w_mm: 37,
  cam_mount_h_mm: 40,
  cam_mount_d_mm: 50,
  cam_rise_mm: 20,
  boom_length_mm: 231,
  upstream: 'TheRobotStudio/SO-ARM100 Optional/Overhead_Cam_Mount_32x32_UVC_Module (Apache-2.0)',
} as const

/** Height assert: base + extrusion + head stack */
export const HEIGHT_STACK_MM =
  BASE.height_mm + EXTRUSION.length_mm + HEAD.stack_h_mm

/** Fail loud if height math drifts from OVERALL_HEIGHT_MM */
export const HEIGHT_STACK_OK = HEIGHT_STACK_MM === OVERALL_HEIGHT_MM
if (!HEIGHT_STACK_OK) {
  throw new Error(
    `Height stack ${HEIGHT_STACK_MM} mm !== overall ${OVERALL_HEIGHT_MM} mm — fix HEAD.stack_h_mm / extrusion`,
  )
}

export const CAMERA = {
  W: 18,
  H: 14,
  D: 12,
  rise: 2,
} as const

export const STS3215 = {
  L: 45.2,
  W: 24.7,
  H: 35.0,
  mass_g: 55,
  torque_kgcm: 19,
  bus: 'TTL' as const,
  qty_per_arm: 6,
  qty_arms_pair: 12,
} as const

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
  diy_usd_hi: 150,
  sts3215_qty: 6,
  source:
    'LeRobot SO-101 / so101_follower; URDF so101_new_calib.urdf; HF docs/lerobot/en/so101; print/SO101/',
} as const

export const ARM = {
  mount_x_mm: 95,
  mount_y_mm: SCREW_ELEVATOR.default_agl_mm,
  mount_z_mm: 28,
  default_count: 2,
  optional_second: false,
  shoulder_span_mm: 190,
} as const

export const SHOULDER_HEIGHT_MM = SCREW_ELEVATOR.default_agl_mm
export const STANDING_HEIGHT_MM = OVERALL_HEIGHT_MM
export const BODY_WIDTH_MM = BASE.footprint_mm

export const PI5 = {
  W: 85,
  H: 56,
  D: 16,
  note: 'Pi 5 4GB (or Pi 4) class in base bay — dual arms + screw stepper',
} as const

export const PI_ZERO = PI5

export const BATTERY = {
  W: 70,
  H: 35,
  D: 50,
  note: '3S LiPo ~$40 + scrap-steel ballast ~$10 in perceptron bay',
} as const

export const STABILITY_NOTE =
  'Perceptron-scale base (~170 mm) + dual SO-101 on a tall extrusion/leadscrew raises serious tip risk — wide stance ballast mandatory. Draft — not for sale. Not a Microduck biped.'

export const TOPHEAVY_NOTE = STABILITY_NOTE

export const XL330 = {
  L: 20.0,
  W: 34.0,
  H: 26.0,
  mass_g: 18,
  torque_nm: 0.52,
  bus: 'TTL' as const,
  qty_body: 0,
  note: 'Not used on wheeled Pebble — retained for archive only',
} as const

/** Unique printable structure SKUs from upstream (excl. SO-101 arm library) */
export const PRINT_UNIQUE_SKUS = 16

/** PLA grey default for printed OSS parts in the twin */
export const PLA_GREY = '#9aa3ad'

export const PEBBLE_DIMS = {
  product:
    'Pebble — ~5′8″ wheeled twin composed from OSS meshes + extrusion + 2× SO-101 (not official Pollen)',
  overall_height_mm: OVERALL_HEIGHT_MM,
  height_stack_mm: HEIGHT_STACK_MM,
  height_stack_ok: HEIGHT_STACK_OK,
  standing_height_mm: STANDING_HEIGHT_MM,
  shoulder_height_mm: SHOULDER_HEIGHT_MM,
  body_width_mm: BODY_WIDTH_MM,
  print_unique_skus: PRINT_UNIQUE_SKUS,
  height_note: HEIGHT_NOTE,
  screw_axis_x_mm: SCREW_AXIS_X_MM,
  base: BASE,
  extrusion: EXTRUSION,
  torso: TORSO,
  screw_elevator: SCREW_ELEVATOR,
  head: HEAD,
  camera: CAMERA,
  sts3215: STS3215,
  so101: SO101,
  arm: ARM,
  pi5: PI5,
  battery: BATTERY,
  stability_note: STABILITY_NOTE,
  units: 'mm / g',
  digital_twin_rule:
    'visual = upstream OSS STLs (base/lift/head) + bought extrusion/leadscrew envelopes + SO-101 GLB; dims.ts = BOM',
  sources: [
    'PedroS235/perceptron_bot (MIT) — wheeled base STLs',
    'prusa3d/Original-Prusa-i3 (GPL-2.0) — Z mounts + x-end-motor carriage',
    'TheRobotStudio/SO-ARM100 (Apache-2.0) — SO-101 arms, 4040 mount, overhead cam',
  ],
} as const

export type PebbleDims = typeof PEBBLE_DIMS
