/**
 * Pebble dimensions — documentation / mounts / BOM / print twin (millimeters / grams).
 * Product: wheeled differential base + vertical torso + head (screen+cam) + 2× LeRobot SO-101.
 * NOT official Pollen / Microduck.
 * Visual on /sim: printable base/torso/head STLs (public/assets/base/) + SO-101 follower GLB
 * baked from upstream printable URDF meshes. Three.js converts mm → m only at render (mmToM).
 */

export const MM = 1
export const mmToM = (mm: number) => mm * 0.001
export const mToMm = (m: number) => m * 1000

/**
 * Printable octagonal differential base — matches print/base/*.stl
 * Wider / taller bay for dual-arm tip resistance + ballast.
 */
export const BASE = {
  diameter_mm: 340,
  plate_thickness_mm: 3.5,
  standoff_height_mm: 70,
  standoff_od_mm: 12,
  standoff_qty: 8,
  /** Overall plate stack (bottom + standoffs + top) */
  height_mm: 77,
  wheel_diameter_mm: 70,
  wheel_width_mm: 22,
  track_mm: 280,
  caster_diameter_mm: 28,
  motor_pod_l_mm: 55,
  motor_pod_w_mm: 34,
  motor_pod_h_mm: 40,
  note:
    'Wider octagon + taller bay for dual SO-101; rubber tires / motors / caster bought; add ballast in bay',
} as const

/**
 * Vertical torso column — print/base/torso_column.stl
 * Sits on top plate; top ≈ shoulder line.
 */
export const TORSO = {
  height_mm: 450,
  width_mm: 95,
  depth_mm: 75,
  note: 'Printable column; shoulders at base.height + torso.height',
} as const

/**
 * Head: neck + face bezel + screen backplate + forehead camera mount.
 * Screen panel is a dark quad in sim (bought display); bezel/backplate printed.
 */
export const HEAD = {
  neck_h_mm: 45,
  bezel_w_mm: 130,
  bezel_h_mm: 120,
  bezel_t_mm: 8,
  screen_w_mm: 110,
  screen_h_mm: 75,
  screen_t_mm: 3,
  cam_mount_w_mm: 28,
  cam_mount_h_mm: 18,
  cam_mount_d_mm: 22,
  cam_rise_mm: 25,
} as const

/** Tiny CSI/USB camera on forehead mount (bought module) */
export const CAMERA = {
  W: 18,
  H: 14,
  D: 12,
  rise: 2,
} as const

/** @deprecated Mast replaced by torso+head; kept for legacy STL filenames */
export const MAST = {
  height_mm: 180,
  diameter_mm: 18,
  offset_forward_mm: 0,
  shelf_w_mm: 40,
  shelf_d_mm: 28,
  shelf_t_mm: 3,
} as const

/**
 * Feetech STS3215 — used on SO-101 arms.
 */
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

/**
 * LeRobot SO-101 follower arm — Hugging Face LeRobot / TheRobotStudio SO-ARM100.
 * Docs: https://huggingface.co/docs/lerobot/en/so101 · so101_follower
 * Printables: print/SO101/
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
 * Default product: two SO-101s at shoulder height, idle hang along flanks (grippers toward floor).
 * Body frame: +Y up, +Z forward, +X left.
 * Shoulder AGL ≈ BASE.height + TORSO.height = 527 mm → downward reach ≈ floor, up/forward ≈ counter (~900 mm).
 */
export const ARM = {
  /** Lateral span of shoulder mount from center (mm); +X = left */
  mount_x_mm: 125,
  /** Height of shoulder mount above floor (mm) */
  mount_y_mm: 527,
  /** Forward offset along +Z (mm) — 0 = hang along flanks */
  mount_z_mm: 0,
  default_count: 2,
  optional_second: false,
} as const

/** Shoulder line above floor */
export const SHOULDER_HEIGHT_MM = BASE.height_mm + TORSO.height_mm

/** Overall visual height: base + torso + neck + bezel + cam rise */
export const STANDING_HEIGHT_MM =
  BASE.height_mm + TORSO.height_mm + HEAD.neck_h_mm + HEAD.bezel_h_mm + HEAD.cam_rise_mm

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
  note: '2S/3S LiPo envelope + ballast space in taller bay; chemistry TBD',
} as const

/**
 * Dual arms + taller COM raise tip risk — wide base + ballast required.
 */
export const STABILITY_NOTE =
  'Wheeled wide base + ballast in bay is required: dual SO-101 (~1.6 kg arms) on a ~527 mm shoulder raises tip risk on rugs, ramps, and thresholds. Draft — not for sale. Not a Microduck biped.'

/** @deprecated alias */
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

export const PEBBLE_DIMS = {
  product: 'Pebble — wheeled base + torso/head + 2× SO-101 (not official Pollen)',
  standing_height_mm: STANDING_HEIGHT_MM,
  shoulder_height_mm: SHOULDER_HEIGHT_MM,
  body_width_mm: BODY_WIDTH_MM,
  base: BASE,
  torso: TORSO,
  head: HEAD,
  camera: CAMERA,
  sts3215: STS3215,
  so101: SO101,
  arm: ARM,
  pi_zero: PI_ZERO,
  battery: BATTERY,
  stability_note: STABILITY_NOTE,
  units: 'mm / g',
  digital_twin_rule:
    'visual = printable base/torso/head STLs (public/assets/base) + SO-101 GLB baked from upstream printable URDF STLs; dims.ts = print = BOM',
  sources: [
    'Pebble print/base humanoid stack (authored numpy-stl)',
    'SO-101 URDF so101_new_calib.urdf + TheRobotStudio/SO-ARM100 STL/SO101 + HF docs/lerobot/en/so101',
  ],
} as const

export type PebbleDims = typeof PEBBLE_DIMS
