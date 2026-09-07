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
    tagline: 'Soft grey shell',
    primary: '#a8b0bc',
    belly: '#d8dde6',
    face: '#0a1018',
    cheek: '#e8a0a8',
    accent: '#7c8798',
    dark: '#2c3340',
    swatch: '#c5cad3',
  },
  {
    id: 'slate',
    name: 'Slate',
    tagline: 'Dark finish',
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
 * Purchasable BOM — draft street USD (hobby, 2025–2026).
 * Columns: Base (structure+wheels+screw elevator, no arms) | +1 arm | +2 arms (default product).
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
    part: 'T8 / Tr8 lead screw ~1.5 m + coupler + 2× bearings',
    qty: 1,
    usd_base: 45,
    usd_arm: 45,
    usd_dual: 45,
    vendor: 'Amazon / AliExpress',
    notes: 'Parallel to 2040; Prusa x-end-motor rides as nut carriage.',
  },
  {
    category: 'Screw elevator',
    part: 'NEMA17 stepper + driver (Prusa z-axis-bottom mount)',
    qty: 1,
    usd_base: 35,
    usd_arm: 35,
    usd_dual: 35,
    vendor: 'Amazon / Stepperonline',
    notes: 'Mount STL from prusa3d/Original-Prusa-i3 (GPL-2.0).',
  },
  {
    category: 'Screw elevator',
    part: 'MGN12 linear rail ~1.2 m (optional anti-rotation)',
    qty: 1,
    usd_base: 30,
    usd_arm: 30,
    usd_dual: 30,
    vendor: 'Amazon / AliExpress',
    notes: 'Optional; 2040 slot can guide carriage with Prusa x-end.',
  },
  {
    category: 'Driver',
    part: 'Arm TTL hub + BEC (STS3215 rail)',
    qty: 1,
    usd_base: 0,
    usd_arm: 28,
    usd_dual: 48,
    vendor: 'Feetech hub / Amazon BEC',
    notes: 'Separate rail from wheel motors + screw stepper.',
  },
  {
    category: 'Compute',
    part: 'Raspberry Pi 5 (8 GB) + cooler / SSD (or Jetson-class)',
    qty: 1,
    usd_base: 95,
    usd_arm: 95,
    usd_dual: 95,
    vendor: 'Raspberry Pi / Seeed',
    notes: 'Fits perceptron middle_plate_raspberry nest.',
  },
  {
    category: 'Sensors',
    part: 'CSI / USB camera (SO-ARM overhead UVC mount)',
    qty: 1,
    usd_base: 20,
    usd_arm: 20,
    usd_dual: 20,
    vendor: 'Pi Camera / Amazon USB',
    notes: 'Bracket: SO-ARM100 Optional Overhead_Cam_Mount (Apache-2.0).',
  },
  {
    category: 'Power',
    part: '3S/4S LiPo pack + charger + low ballast weight',
    qty: 1,
    usd_base: 75,
    usd_arm: 85,
    usd_dual: 95,
    vendor: 'Hobby LiPo + steel shot',
    notes: 'Low in perceptron bay. Tall dual-arm stack tips easily — ballast hard.',
  },
  {
    category: 'Structure',
    part: 'PLA/PETG — perceptron chassis + Prusa Z/carriage + SO cam/4040',
    qty: 1,
    usd_base: 55,
    usd_arm: 60,
    usd_dual: 65,
    vendor: 'Amazon filament + upstream STLs',
    notes: 'All printable meshes from OSS downloads (see public/assets/*/NOTICE.md).',
  },
  {
    category: 'Actuation (arm)',
    part: 'LeRobot SO-101 follower kit (DIY)',
    qty: '2 (required)',
    usd_base: 0,
    usd_arm: 160,
    usd_dual: 320,
    vendor: 'HF docs/lerobot/en/so101 · TheRobotStudio/SO-ARM100',
    notes: '6× STS3215 each. Bolt to carriage via SO-ARM 4040_Base_Mount L/R.',
  },
  {
    category: 'Fasteners',
    part: 'M3/M4/M5 screws + wiring + XT60 + cable chain for elevator',
    qty: 1,
    usd_base: 35,
    usd_arm: 45,
    usd_dual: 55,
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
  { key: 'Height', value: '1730 mm overall via bought 2040 extrusion (~5′8″); printable mesh stack alone is shorter' },
  { key: 'Base upstream', value: 'PedroS235/perceptron_bot (MIT) — public/assets/base/' },
  { key: 'Lift upstream', value: 'prusa3d/Original-Prusa-i3 Z + x-end-motor carriage (GPL-2.0); SO-ARM 4040 mount (Apache-2.0)' },
  { key: 'Head upstream', value: 'SO-ARM100 Optional Overhead_Cam_Mount_32x32_UVC_Module (Apache-2.0)' },
  { key: 'Locomotion', value: 'Differential-drive; tank {forward, yawRate}; WASD fixed signs' },
  { key: 'Screw elevator', value: 'Lead screw + NEMA17; Prusa nut carriage; Q raise / E lower in sim' },
  { key: 'Elevator travel', value: 'Shoulders ~160 mm AGL → ~1250 mm AGL; travel 1090 mm' },
  { key: 'Arms', value: '2× LeRobot SO-101 required; idle hang on carriage' },
  { key: 'Cost (draft)', value: 'DIY twin with dual arms + screw elevator — see BOM dual column' },
  { key: 'Status', value: 'Draft — not for sale. Tip risk real. Not official Pollen.' },
]
