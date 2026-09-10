/**
 * HouseHand dimensions — twin + print kit (LeKiwi 3-omni + printed torso + 2× SO-101).
 * Arms: TheRobotStudio/SO-ARM100 / LeRobot SO-101 (Apache-2.0)
 * Base: SIGRobotics-UIUC/LeKiwi. Torso: printed HouseHand Ø180 / flange Ø190 on layer2.
 * Tip/envelope numbers remain conservative chore bounds; orbit /model for exact stack height.
 */

export const MM = 1
export const mmToM = (mm: number) => mm * 0.001
export const mToMm = (m: number) => m * 1000

/**
 * Overall height fully extended.
 * Assert: BASE.height + TELESCOPE.outer_h + TELESCOPE.travel + HEAD.stack = OVERALL.
 */
export const OVERALL_HEIGHT_MM = 1100

export const HEIGHT_NOTE =
  'Stack height ≈ LeKiwi plates + HouseHand Ø180×320 mm torso + shoulder deck + neck/head (orbit /model). Torso is a printed tube on layer2 — not a nested telescoping column kit.'

/** Honest chore envelope (mm AGL / world). */
export const CHORE_ENVELOPE = {
  floor_pick_mm: 0,
  counter_mm: 900,
  sink_rim_mm: 860,
  washer_rim_mm: 900,
  table_wipe_mm: 750,
  so101_reach_mm: 500,
  note:
    'SO-101 ~500 mm reach from deck pads covers floor clothes, baskets, counters, sink rim, open washer drum. NOT: folding, detergent, closed-door cycles, hot water, waterproofing.',
} as const

/** LeKiwi-class omni base — 3× 4″ omni. No casters. No outriggers. */
export const BASE = {
  footprint_mm: 220,
  width_mm: 220,
  depth_mm: 220,
  height_mm: 82,
  deck_t_mm: 18,
  diameter_mm: 400,
  wheel_diameter_mm: 102,
  wheel_width_mm: 42,
  wheel_count: 3,
  wheel_inset_mm: 28,
  drive: 'omni' as const,
  track_mm: 344,
  wheelbase_mm: 394,
  caster_diameter_mm: 0,
  axle_height_mm: 51,
  upstream: 'SIGRobotics-UIUC/LeKiwi — 3× 4″ omni + printed HouseHand torso on layer2',
  note: 'Full 3-omni — no casters, no RÅSKOG, no 4-mecanum deck. Battery centered; 6× M3 standoffs between plates.',
} as const

/**
 * Nested telescoping column — grows/shrinks as a tube stack.
 * Internal T8 (or belt) is inside the torso, not an exposed MGN carriage.
 */
export const TELESCOPE = {
  profile: 'nested aluminium tubes + internal T8',
  outer_od_mm: 80,
  mid_od_mm: 66,
  inner_od_mm: 52,
  wall_mm: 3.2,
  outer_h_mm: 380,
  travel_mm: 560,
  min_agl_mm: 462,
  max_agl_mm: 1022,
  default_agl_mm: 860,
  screw_od_mm: 8,
  screw_pitch_mm: 2,
  screw_length_mm: 700,
  motor: 'STS3215 or 12V gearmotor / linear actuator (internal)',
  anti_rotation: 'nested tube spline — not an exposed MGN rail',
  upstream: 'BOM_V3 nested column kit (or DIY nested 2040 + internal lead screw)',
  note: 'Column grows/shrinks — not an exposed rail carriage. Limit switches at min/max.',
} as const

/** @deprecated Use TELESCOPE — kept so lift AGL clamps stay one object. */
export const SCREW_ELEVATOR = TELESCOPE
export const LIFT = TELESCOPE

export const TORSO = {
  height_mm: TELESCOPE.outer_h_mm + TELESCOPE.travel_mm,
  width_mm: TELESCOPE.outer_od_mm,
  depth_mm: TELESCOPE.outer_od_mm,
  segment_h_mm: TELESCOPE.outer_h_mm,
  segment_qty: 3,
  note: 'Three nested tubes; inner stage carries the shoulder bar',
} as const

export const SHOULDER_BAR = {
  width_mm: 280,
  height_mm: 28,
  depth_mm: 50,
  note: 'Printed crossbar — mounts 2× SO-101 bases',
} as const

export const TOTE = {
  width_mm: 190,
  height_mm: 115,
  depth_mm: 145,
  note: 'On-base bin / tote for drops and laundry',
} as const

export const HEAD_STACK_H_MM = OVERALL_HEIGHT_MM - BASE.height_mm - TELESCOPE.outer_h_mm - TELESCOPE.travel_mm // 78

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
  stl_center_x_mm: 18.7,
  boom_length_mm: 231,
  boom_tip_mm: 48,
  upstream: 'TheRobotStudio/SO-ARM100 Optional/Overhead_Cam_Mount_32x32_UVC_Module (Apache-2.0)',
  note: 'USB head / torso camera on inner-tube top (shoulder)',
} as const

export const HEIGHT_STACK_MM =
  BASE.height_mm + TELESCOPE.outer_h_mm + TELESCOPE.travel_mm + HEAD.stack_h_mm

export const HEIGHT_STACK_OK = HEIGHT_STACK_MM === OVERALL_HEIGHT_MM
if (!HEIGHT_STACK_OK) {
  throw new Error(
    `Height stack ${HEIGHT_STACK_MM} mm !== overall ${OVERALL_HEIGHT_MM} mm — fix HEAD.stack_h_mm / telescope`,
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

/**
 * Shoulder mounts — SO-101 base_link seats on printed bar (+ optional 4040 adapters).
 * 4040_base_mount.stl native bbox center ≈ (112.43, -0.17, -53); Z span 42 mm.
 */
export const ARM = {
  mount_x_mm: 118,
  mount_y_mm: TELESCOPE.default_agl_mm,
  mount_z_mm: 8,
  mount_face_drop_mm: 6,
  mount_stl_center_mm: [112.43, -0.17, -53.0] as const,
  mount_face_half_mm: 21,
  default_count: 2,
  optional_second: false,
  shoulder_span_mm: 236,
} as const

export const SHOULDER_HEIGHT_MM = TELESCOPE.default_agl_mm
export const STANDING_HEIGHT_MM = OVERALL_HEIGHT_MM
export const BODY_WIDTH_MM = BASE.width_mm

export const PI5 = {
  W: 85,
  H: 56,
  D: 16,
  note: 'Laptop you own, or optional Pi 5 — gamepad teleop host',
} as const

export const PI_ZERO = PI5

export const BATTERY = {
  W: 180,
  H: 70,
  D: 120,
  note: '12V pack + BMS centered in base (low mass / ballast)',
} as const

export const STABILITY_NOTE =
  'Tip math (stability.ts): 400×450 mm omni deck + 4 kg 12V pack in bay → restore ≈19.6 N·m vs tip ≈7.85 N·m at 0.40 m reach / 2 kg @ max AGL (margin ≈2.5×). No outriggers. Tip slowdown is UX only. Draft — not for sale.'

export const TOPHEAVY_NOTE = STABILITY_NOTE

export const XL330 = {
  L: 20.0,
  W: 34.0,
  H: 26.0,
  mass_g: 18,
  torque_nm: 0.52,
  bus: 'TTL' as const,
  qty_body: 0,
  note: 'Not used on HouseHand v3',
} as const

/** Printed structure SKUs: shoulder bar, column base plate, 4040 adapters, cam nest. */
export const PRINT_UNIQUE_SKUS = 28
export const PLA_GREY = '#9aa3ad'

/** Legacy aliases — v3 has no exposed extrusion / MGN / outriggers. */
export const EXTRUSION = {
  profile: 'nested tubes (internal T8)',
  length_mm: TELESCOPE.outer_h_mm + TELESCOPE.travel_mm,
  width_mm: TELESCOPE.outer_od_mm,
  depth_mm: TELESCOPE.outer_od_mm,
  mass_kg_approx: 1.6,
  note: TELESCOPE.note,
} as const

export const MGN12 = {
  profile: 'none — nested-tube anti-rotation',
  length_mm: 0,
  rail_w_mm: 0,
  rail_h_mm: 0,
  block_w_mm: 0,
  block_h_mm: 0,
  block_l_mm: 0,
  usd_lo: 0,
  usd_hi: 0,
  note: 'Do not buy exposed-rail-only lift. Nested tubes carry dual-arm torque.',
} as const

export const OUTRIGGERS = {
  support_width_mm: BASE.width_mm,
  foot_pad_mm: 0,
  arm_reach_mm: 0,
  mass_g: 0,
  note: 'Not used — 400 mm deck is the support polygon.',
} as const

export const SCREW_AXIS_X_MM = 0

export const PEBBLE_DIMS = {
  product:
    'Pebble / HouseHand v3 — omni deck + telescoping torso + 2× SO-101 (not official Pollen)',
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
  telescope: TELESCOPE,
  torso: TORSO,
  shoulder_bar: SHOULDER_BAR,
  tote: TOTE,
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
    'visual = BOM envelopes (deck/mecanum/tubes) + SO-ARM cam/4040 STLs + SimpleSO101Arm boxes; dims.ts = BOM_V3',
  sources: [
    'BOM_V3.md — HouseHand v3.1 (omni + telescope + dual SO-101)',
    'TheRobotStudio/SO-ARM100 (Apache-2.0) — SO-101 arms, 4040 mount, overhead cam',
    'SIGRobotics-UIUC/LeKiwi — omni reference (mecanum deck here)',
  ],
} as const

export type PebbleDims = typeof PEBBLE_DIMS
