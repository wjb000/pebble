/**
 * Pebble dimensions — documentation / mounts / BOM (millimeters / grams). Visual truth on /sim = imported CAD meshes.
 * Three.js converts mm → m only at render (mmToM).
 * OpenSCAD cad/pebble.scad hardcodes matching constants — must stay in sync.
 *
 * Product: Pebble = Microduck-class body + 2× LeRobot SO-101 arms.
 * NOT an official Pollen Robotics / Microduck product. Public specs + MJCF
 * kinematics only — no proprietary STLs or Pollen branding as official.
 *
 * Body height target: 250 mm (press-kit / microduck_rl AGENTS.md).
 */

export const MM = 1
export const mmToM = (mm: number) => mm * 0.001
export const mToMm = (m: number) => m * 1000

/**
 * Dynamixel XL330 case — Robotis XL330-M288-T class datasheet (mm / g).
 * Microduck body: 15× XL330 (14 controlled + mouth/beak).
 */
export const XL330 = {
  L: 20.0,
  W: 34.0,
  H: 26.0,
  mass_g: 18,
  /** stall torque class ~0.52 N·m @ 5 V (document only) */
  torque_nm: 0.52,
  bus: 'TTL' as const,
  /** 14 controlled + 1 mouth/beak */
  qty_body: 15,
  qty_controlled: 14,
  qty_beak: 1,
} as const

/**
 * Feetech STS3215 — used on SO-101 arms only (not body legs).
 * Datasheet case mm; ~55 g; ~19 kg·cm @ 6–7.4 V.
 */
export const STS3215 = {
  L: 45.2,
  W: 24.7,
  H: 35.0,
  mass_g: 55,
  torque_kgcm: 19,
  bus: 'TTL' as const,
  /** 6 per SO-101 follower × 2 arms */
  qty_per_arm: 6,
  qty_arms_pair: 12,
} as const

/**
 * Microduck-class body envelope — public press kit + approximate link lengths
 * from pollen-robotics/microduck_rl robot_walk.xml body origins (fetched via
 * raw GitHub; mesh STLs not vendored). Values rounded for printable twin.
 *
 * Sources:
 * - Height 250 mm, mass <800 g, width ~140 mm (Pollen Microduck intro)
 * - Joint layout AGENTS.md: L leg 5, neck/head 4, R leg 5 (+ beak)
 * - MJCF segment magnitudes ~42 mm thigh, ~49 mm shin, hip lateral ~28–35 mm
 */
export const FOOT = {
  L: 55,
  W: 32,
  H: 12,
} as const

/** Shin (knee → ankle) — MJCF shin/ankle chain ≈ 42–49 mm */
export const SHIN_LEN = 48
/** Thigh (hip_pitch → knee) — MJCF upper_leg geom ≈ 42.5 mm */
export const THIGH_LEN = 42

/** Pelvis / hip bar (printed) */
export const PELVIS = {
  W: 72,
  H: 20,
  D: 48,
} as const

/**
 * Duck-like trunk. Width envelope with shoulders ≈ 140 mm press-kit width.
 * Depth gives the biped duck silhouette (not a phone-bezel head).
 */
export const TORSO = {
  W: 100,
  H: 68,
  D: 78,
} as const

export const NECK_LEN = 22

/** Head shell + articulated beak (Microduck-class), not a phone LCD */
export const HEAD = {
  W: 48,
  H: 38,
  D: 52,
} as const

export const BEAK = {
  L: 28,
  W: 16,
  H: 10,
} as const

/** Tiny head camera (CSI/USB class) */
export const CAMERA = {
  W: 12,
  H: 12,
  D: 8,
  rise: 1,
} as const

/**
 * Standing height (mm) — sole → crown.
 * 12 + 48 + 42 + 20 + 68 + 22 + 38 = 250
 */
export const STANDING_HEIGHT_MM =
  FOOT.H + SHIN_LEN + THIGH_LEN + PELVIS.H + TORSO.H + NECK_LEN + HEAD.H

/** Press-kit body width envelope (mm) */
export const BODY_WIDTH_MM = 140

/** Hip joint height above sole */
export const HIP_HEIGHT_MM = FOOT.H + SHIN_LEN + THIGH_LEN

/** Printed Microduck-class frame (small PLA links, not 16 mm chore tube) */
export const FRAME = {
  tube_OD: 8,
  tube_ID: 5,
  horn_thickness: 2.5,
  link_radius: 6,
} as const

/**
 * LeRobot SO-101 follower arm — Hugging Face LeRobot / TheRobotStudio SO-ARM100.
 * Docs: https://huggingface.co/docs/lerobot/en/so101 · so101_follower
 *
 * Link lengths approximate from public URDF
 * TheRobotStudio/SO-ARM100 Simulation/SO101/so101_new_calib.urdf joint origins.
 * Reach ~500 mm and mass ~800 g are published kit figures (not measured here).
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
  /** URDF shoulder_pan origin z (mm) */
  base_z: 62.4,
  /** URDF |z| shoulder_lift → upper_arm (mm) */
  shoulder_lift_z: 54.2,
  /** URDF |x| elbow_flex — upper arm (mm) */
  upper_arm: 112.6,
  /** URDF |x| wrist_flex — forearm (mm) */
  forearm: 134.9,
  /** URDF |y| wrist_roll (mm) */
  wrist: 61.1,
  /** Approx gripper / jaw length (mm) */
  gripper: 80,
  /** Published approximate reach */
  reach_mm: 500,
  /** Published approximate arm mass */
  mass_g: 800,
  /** DIY kit street price band USD (follower) */
  diy_usd_lo: 100,
  diy_usd_hi: 200,
  sts3215_qty: 6,
  source:
    'LeRobot SO-101 / so101_follower; URDF so101_new_calib.urdf; HF docs/lerobot/en/so101',
} as const

/**
 * Shoulder mount span across Microduck torso (mm) — bimanual SO-101 bases.
 * Body frame after CAD fix: +X left, -X right, +Z forward (beak).
 * Visual mounts use shoulder_span/2 on ±X at hip+pelvis+0.25·torso height.
 */
export const ARM = {
  shoulder_span: 140,
  /** Forward mount offset from torso center along +Z (mm) */
  mount_forward: 8,
  /** Vertical mount on torso (fraction of torso H above pelvis; ImportedRobots) */
  mount_y_frac: 0.25,
} as const

/** Small compute — Pi Zero 2 W class fits Microduck bay better than full Pi 5 */
export const PI_ZERO = {
  W: 65,
  H: 30,
  D: 12,
  note: 'Pi Zero 2 W / Radxa Zero 3W class; Microduck-scale bay',
} as const

/** Keep PI5 export alias for any leftover imports — same bay footprint as Zero */
export const PI5 = PI_ZERO

/** Small LiPo envelope (not NP-F brick) */
export const BATTERY = {
  W: 40,
  H: 18,
  D: 30,
  note: '2S/3S LiPo envelope; chemistry TBD at build',
} as const

/** Hip lateral offset from pelvis center (each leg) — MJCF ~17–35 mm class */
export const HIP_LATERAL = 30

/** Joint stack offsets between stacked hip DOFs (XL330 clearances) */
export const JOINT = {
  yaw_to_roll: 12,
  roll_to_pitch: 16,
} as const

/**
 * Honesty: dual SO-101 (~1.6 kg) on an ~800 g Microduck body is top-heavy.
 * Prefer mount plate + counterweight, docked/tabletop braced manipulation, or
 * arms stowed while walking.
 */
export const TOPHEAVY_NOTE =
  'Dual SO-101 (~800 g each ≈ 1.6 kg) on Microduck-class body (<800 g) is top-heavy. Use shoulder mount plate, counterweight / ballast, or docked tabletop mode with body braced; walk with arms idle/stowed.'

/** Convenience aggregate for JSON export / HUD */
export const PEBBLE_DIMS = {
  product: 'Pebble — Microduck body + 2× SO-101 arms (not official Pollen)',
  standing_height_mm: STANDING_HEIGHT_MM,
  body_width_mm: BODY_WIDTH_MM,
  hip_height_mm: HIP_HEIGHT_MM,
  xl330: XL330,
  sts3215: STS3215,
  foot: FOOT,
  shin_len: SHIN_LEN,
  thigh_len: THIGH_LEN,
  pelvis: PELVIS,
  torso: TORSO,
  neck_len: NECK_LEN,
  head: HEAD,
  beak: BEAK,
  camera: CAMERA,
  frame: FRAME,
  so101: SO101,
  arm: ARM,
  pi_zero: PI_ZERO,
  battery: BATTERY,
  hip_lateral: HIP_LATERAL,
  joint: JOINT,
  topheavy_note: TOPHEAVY_NOTE,
  units: 'mm / g',
  digital_twin_rule: 'visual = imported meshes; dims.ts documents mounts/BOM',
  sources: [
    'Microduck press kit 250×~140 mm, <800 g, 15× XL330',
    'microduck_rl AGENTS.md joint layout + robot_walk.xml body origins',
    'SO-101 URDF so101_new_calib.urdf + HF docs/lerobot/en/so101',
  ],
} as const

export type PebbleDims = typeof PEBBLE_DIMS
