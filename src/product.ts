/** Pebble — ~5′8″ wheeled home chore bot composed from OSS meshes + screw elevator + 2× SO-101.
 *  Draft / not for sale. NOT an official Pollen Robotics product. */

export type Colourway = {
  id: string
  name: string
  tagline: string
  primary: string
  belly: string
  face: string
  cheek: string
  accent: string
  dark: string
  swatch: string
}

export const COLOURWAYS: Colourway[] = [
  {
    id: 'riverstone',
    name: 'Riverstone',
    tagline: 'PLA grey shell',
    primary: '#9aa3ad',
    belly: '#c5cad3',
    face: '#0a1018',
    cheek: '#e8a0a8',
    accent: '#7c8798',
    dark: '#3a4250',
    swatch: '#c5cad3',
  },
  {
    id: 'slate',
    name: 'Slate',
    tagline: 'Dark PLA',
    primary: '#5a6574',
    belly: '#8b95a3',
    face: '#080e14',
    cheek: '#c97b84',
    accent: '#9aa3b0',
    dark: '#141a22',
    swatch: '#4b5563',
  },
  {
    id: 'coral',
    name: 'Coral',
    tagline: 'Warm blush',
    primary: '#e9897a',
    belly: '#f3c7bc',
    face: '#0a1620',
    cheek: '#ff9aaa',
    accent: '#ea580c',
    dark: '#4a2c28',
    swatch: '#e9897a',
  },
  {
    id: 'moss',
    name: 'Moss',
    tagline: 'Lab green',
    primary: '#6f8f72',
    belly: '#c5d6c4',
    face: '#0a1620',
    cheek: '#d4a574',
    accent: '#f59e0b',
    dark: '#243028',
    swatch: '#6f8f72',
  },
]

export const ONE_LINER =
  'Human-scale (~5′8″ / 1730 mm via bought extrusion) wheeled chore bot: perceptron_bot base + Prusa lead-screw carriage + two LeRobot SO-101 arms that ride floor↔chest. Draft / not for sale. Not official Pollen.'

export const FAST_FACTS = [
  { label: 'Height', value: '~5′8″ / 1730 mm (extrusion)' },
  { label: 'Elevator', value: 'Lead-screw (Q/E)' },
  { label: 'Arms', value: '2× SO-101' },
  { label: 'Base', value: 'perceptron_bot MIT' },
  { label: 'Status', value: 'Draft / not for sale' },
]

export type BomColumn = 'base' | 'arm' | 'dual'

export type BomRow = {
  category: string
  part: string
  qty: number | string
  usd_base: number
  usd_arm: number
  usd_dual: number
  vendor: string
  notes: string
}

/**
 * Cheap-default purchasable BOM — draft street USD (hobby, 2026).
 * Dual twin target ~$740–780. Arms dominate (~$250 DIY). No MGN12.
 * Columns: Base | +1 arm | +2 arms (default product).
 */
export const BOM: BomRow[] = [
  {
    category: 'Locomotion',
    part: 'Gear motors + rubber wheels (diff-drive pair, ~65 mm)',
    qty: 1,
    usd_base: 40,
    usd_arm: 40,
    usd_dual: 40,
    vendor: 'Amazon / Pololu-class',
    notes: 'Bought tires; chassis from PedroS235/perceptron_bot STLs (MIT).',
  },
  {
    category: 'Locomotion',
    part: 'Caster / support (perceptron caster STLs + ball)',
    qty: 1,
    usd_base: 8,
    usd_arm: 8,
    usd_dual: 8,
    vendor: 'Print (perceptron) + Amazon ball',
    notes: 'Upstream caster frame/wheels in public/assets/base/.',
  },
  {
    category: 'Driver',
    part: 'Wheel motor driver (TB6612 / L298N class)',
    qty: 1,
    usd_base: 12,
    usd_arm: 12,
    usd_dual: 12,
    vendor: 'Amazon / Pololu',
    notes: 'Tank drive H-bridge for the two wheel motors.',
  },
  {
    category: 'Screw elevator',
    part: '2040 aluminium extrusion column ~1540 mm',
    qty: 1,
    usd_base: 35,
    usd_arm: 35,
    usd_dual: 35,
    vendor: 'Misumi / OpenBuilds / Amazon',
    notes: 'Extends overall height to 1730 mm (~5′8″). Printable meshes alone are shorter.',
  },
  {
    category: 'Screw elevator',
    part: 'T8 / Tr8 lead screw kit ~1.5 m + coupler + 2× bearings',
    qty: 1,
    usd_base: 28,
    usd_arm: 28,
    usd_dual: 28,
    vendor: 'Amazon / AliExpress',
    notes: 'Parallel to 2040 on shared SCREW_AXIS_X; Prusa x-end-motor rides as nut carriage.',
  },
  {
    category: 'Screw elevator',
    part: 'NEMA17 stepper + A4988/DRV8825 driver (Prusa z-axis-bottom)',
    qty: 1,
    usd_base: 20,
    usd_arm: 20,
    usd_dual: 20,
    vendor: 'Amazon / Stepperonline',
    notes: 'Mount STL from prusa3d/Original-Prusa-i3 (GPL-2.0). MGN12 omitted (−$30).',
  },
  {
    category: 'Driver',
    part: 'Shared arm TTL hub + BEC (STS3215 rail)',
    qty: 1,
    usd_base: 0,
    usd_arm: 22,
    usd_dual: 32,
    vendor: 'Feetech hub / Amazon BEC',
    notes: 'One shared hub for both arms on dual SKU. Separate rail from wheel motors + screw stepper.',
  },
  {
    category: 'Compute',
    part: 'Raspberry Pi 5 (4 GB) or Pi 4 class + cooler',
    qty: 1,
    usd_base: 75,
    usd_arm: 75,
    usd_dual: 75,
    vendor: 'Raspberry Pi / reseller',
    notes: '4 GB tier (not 8 GB). Fits perceptron middle_plate_raspberry nest.',
  },
  {
    category: 'Sensors',
    part: 'CSI / USB camera (SO-ARM overhead UVC mount)',
    qty: 1,
    usd_base: 20,
    usd_arm: 20,
    usd_dual: 20,
    vendor: 'Pi Camera / Amazon USB',
    notes: 'Bracket: SO-ARM100 Optional Overhead_Cam_Mount (Apache-2.0). No LiDAR on default.',
  },
  {
    category: 'Power',
    part: '3S LiPo pack (~$40) + scrap-steel ballast (~$10) + charger',
    qty: 1,
    usd_base: 50,
    usd_arm: 50,
    usd_dual: 50,
    vendor: 'Hobby LiPo + scrap steel',
    notes: 'Ballast required — do not omit. Low in perceptron bay. Tall dual-arm stack tips easily.',
  },
  {
    category: 'Structure',
    part: 'PLA/PETG — chassis + Prusa Z/carriage + cam/4040 + SO-101 follower prints',
    qty: 1,
    usd_base: 55,
    usd_arm: 85,
    usd_dual: 120,
    vendor: 'Amazon filament + upstream STLs',
    notes: 'Dual column includes 2× SO-101 follower print sets. OSS meshes only (see NOTICE.md).',
  },
  {
    category: 'Actuation (arm)',
    part: 'LeRobot SO-101 follower DIY kit (servos + electronics)',
    qty: '2 (required)',
    usd_base: 0,
    usd_arm: 125,
    usd_dual: 250,
    vendor: 'HF docs/lerobot/en/so101 · TheRobotStudio/SO-ARM100',
    notes: '6× STS3215 each ≈ $125/arm DIY. Arms dominate twin cost. Bolt to carriage via 4040_Base_Mount L/R.',
  },
  {
    category: 'Fasteners',
    part: 'M3/M4/M5 screws + wiring + XT60 + cable chain for elevator',
    qty: 1,
    usd_base: 35,
    usd_arm: 42,
    usd_dual: 50,
    vendor: 'Amazon fastener / wiring kit',
    notes: 'Wheel harness + dual arm bus + screw motor + moving carriage cables.',
  },
]

export function bomLineTotal(row: BomRow, column: BomColumn): number {
  const unit =
    column === 'base' ? row.usd_base : column === 'arm' ? row.usd_arm : row.usd_dual
  return unit
}

export function bomSubtotal(column: BomColumn): number {
  return BOM.reduce((sum, row) => sum + bomLineTotal(row, column), 0)
}

export const SPECS = [
  { key: 'What', value: '~5′8″ wheeled helper — OSS-composed base/lift/cam + 2× SO-101 on lead-screw carriage' },
  { key: 'Height', value: '1730 mm = base 108 + 2040 extrusion 1540 + head stack 82 (~5′8″)' },
  { key: 'Base upstream', value: 'PedroS235/perceptron_bot (MIT) — public/assets/base/' },
  { key: 'Lift upstream', value: 'prusa3d/Original-Prusa-i3 Z + x-end-motor carriage (GPL-2.0); SO-ARM 4040 mount (Apache-2.0)' },
  { key: 'Head upstream', value: 'SO-ARM100 Optional Overhead_Cam_Mount_32x32_UVC_Module (Apache-2.0), 1:1 scale' },
  { key: 'Locomotion', value: 'Differential-drive; tank {forward, yawRate}; WASD fixed signs' },
  { key: 'Screw elevator', value: 'Lead screw + NEMA17 coax on SCREW_AXIS_X; Prusa nut carriage; Q raise / E lower in sim' },
  { key: 'Elevator travel', value: 'Shoulders ~160 mm AGL → ~1250 mm AGL; travel 1090 mm' },
  { key: 'Arms', value: '2× LeRobot SO-101 required; seated on 4040 mounts; idle hang on carriage' },
  { key: 'Cost (draft)', value: 'Cheap dual twin ~$740 — arms DIY ~$250; see BOM dual column' },
  { key: 'Status', value: 'Draft — not for sale. Tip risk real. Not official Pollen.' },
]
