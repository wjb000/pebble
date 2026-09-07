/**
 * Pebble dimensions — OSS-composed wheeled chore bot (cheap house chores).
 * Base: PedroS235/perceptron_bot (MIT)
 * Lift: prusa3d/Original-Prusa-i3 Z + x-end nut carriage (GPL-2.0)
 * Head: TheRobotStudio/SO-ARM100 Optional Overhead Cam (Apache-2.0)
 * Arms: TheRobotStudio/SO-ARM100 / LeRobot SO-101 (Apache-2.0)
 * NOT official Pollen / Microduck. No generated placeholder bodies.
 *
 * Height is chore-driven (not human-scale fashion): counters ~900, washer rim ~850–950,
 * floor pick. Full 5′8″ extrusion is overkill cost for this envelope.
 */

export const MM = 1
export const mmToM = (mm: number) => mm * 0.001
export const mToMm = (m: number) => m * 1000

/**
 * Overall height with purchased 2040 extrusion.
 * Assert: BASE + EXTRUSION + HEAD.stack = OVERALL.
 * ~1200 mm (~3′11″) — shortest honest stack for sink/counter/washer rim + dual SO-101.
 */
export const OVERALL_HEIGHT_MM = 1200

export const HEIGHT_NOTE =
  'Overall 1200 mm (~3′11″) = base 108 + bought 2040 extrusion 1010 + head stack 82. Sized for counters ~900 mm, washer rim ~850–950 mm, and floor pick — not full human 5′8″ (that was cost overkill).'

/** Honest chore envelope (mm AGL / world). */
export const CHORE_ENVELOPE = {
  floor_pick_mm: 0,
  counter_mm: 900,
  sink_rim_mm: 860,
  washer_rim_mm: 900,
  table_wipe_mm: 750,
  so101_reach_mm: 500,
  note:
    'Shoulder travel 160→950 AGL + SO-101 ~500 mm reach covers floor clothes, baskets, counters, sink rim, open washer drum. NOT: folding, detergent, closed-door cycles, hot water, waterproofing.',
} as const

/** Perceptron Bot chassis — plates stack in CAD-Z ≈ 0…108 mm (170×170 mm footprint). */
export const BASE = {
  footprint_mm: 170,
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
  note: 'Diff-drive chassis from perceptron_bot; drive tires/gearmotors bought',
} as const

/**
 * Bought 2040 extrusion — shorter stock for chore envelope (not 5′8″).
 * 108 + 1010 + 82 = 1200.
 */
export const EXTRUSION = {
  profile: '2040 V-slot aluminium',
  length_mm: 1010,
  width_mm: 20,
  depth_mm: 40,
  note: 'Purchased column cut for chore reach; Prusa Z mounts bolt to it; leadscrew parallel',
} as const

export const SCREW_AXIS_X_MM = 22

/**
 * Screw-drive shoulder elevator — travel sized for washer/counter, not ceiling.
 */
export const SCREW_ELEVATOR = {
  min_agl_mm: 160,
  max_agl_mm: 950,
  travel_mm: 790,
  default_agl_mm: 850,
  screw_od_mm: 8,
  screw_pitch_mm: 2,
  screw_length_mm: 1100,
  axis_x_mm: SCREW_AXIS_X_MM,
  motor: 'NEMA17 (Prusa z-axis-bottom mount)',
  anti_rotation: '2040 extrusion slot (MGN12 omitted)',
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

export const LIFT = SCREW_ELEVATOR

export const TORSO = {
  height_mm: EXTRUSION.length_mm,
  width_mm: EXTRUSION.width_mm,
  depth_mm: EXTRUSION.depth_mm,
  segment_h_mm: EXTRUSION.length_mm,
  segment_qty: 1,
  note: 'Bought 2040 extrusion envelope; not a generated printable torso',
} as const

export const HEAD_STACK_H_MM = OVERALL_HEIGHT_MM - BASE.height_mm - EXTRUSION.length_mm // 82

export const HEAD = {
  stack_h_mm: HEAD_STACK_H_MM,
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
  note: 'Printed 1:1 — no visual scale hacks',
} as const

export const HEIGHT_STACK_MM =
  BASE.height_mm + EXTRUSION.length_mm + HEAD.stack_h_mm

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
  mount_face_drop_mm: 8,
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
  note: 'Pi 4 2–4GB or Pi Zero 2W class — cheapest that runs LeRobot follower + tank drive',
} as const

export const PI_ZERO = PI5

export const BATTERY = {
  W: 70,
  H: 35,
  D: 50,
  note: '3S LiPo + minimum scrap-steel ballast in bay (required)',
} as const

export const STABILITY_NOTE =
  'Narrow base + dual SO-101 on lead-screw — ballast required. Draft — not for sale. Chore bot, not a Microduck biped.'

export const TOPHEAVY_NOTE = STABILITY_NOTE

export const XL330 = {
  L: 20.0,
  W: 34.0,
  H: 26.0,
  mass_g: 18,
  torque_nm: 0.52,
  bus: 'TTL' as const,
  qty_body: 0,
  note: 'Not used on wheeled Pebble — archive only',
} as const

export const PRINT_UNIQUE_SKUS = 16
export const PLA_GREY = '#9aa3ad'

export const PEBBLE_DIMS = {
  product:
    'Pebble — cheap wheeled chore twin (dishes/wipe/laundry-assist) + 2× SO-101 (not official Pollen)',
  overall_height_mm: OVERALL_HEIGHT_MM,
  height_stack_mm: HEIGHT_STACK_MM,
  height_stack_ok: HEIGHT_STACK_OK,
  standing_height_mm: STANDING_HEIGHT_MM,
  shoulder_height_mm: SHOULDER_HEIGHT_MM,
  body_width_mm: BODY_WIDTH_MM,
  print_unique_skus: PRINT_UNIQUE_SKUS,
  height_note: HEIGHT_NOTE,
  screw_axis_x_mm: SCREW_AXIS_X_MM,
  chore_envelope: CHORE_ENVELOPE,
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
    'visual = upstream OSS STLs + bought extrusion/leadscrew envelopes + SO-101 GLB; dims.ts = BOM',
  sources: [
    'PedroS235/perceptron_bot (MIT) — wheeled base STLs',
    'prusa3d/Original-Prusa-i3 (GPL-2.0) — Z mounts + x-end-motor carriage',
    'TheRobotStudio/SO-ARM100 (Apache-2.0) — SO-101 arms, 4040 mount, overhead cam',
  ],
} as const

export type PebbleDims = typeof PEBBLE_DIMS
