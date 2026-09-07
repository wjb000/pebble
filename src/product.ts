/** Pebble — cheap wheeled home chore bot + 1× LeRobot SO-101 (draft / not for sale).
 *  NOT an official Pollen Robotics product. Cost is the primary design constraint. */

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
    tagline: 'Default grey',
    primary: '#9aa3b0',
    belly: '#d0d5de',
    face: '#0a1620',
    cheek: '#e8a0a8',
    accent: '#f97316',
    dark: '#2a303a',
    swatch: '#c8ced8',
  },
  {
    id: 'slate',
    name: 'Slate',
    tagline: 'Dark finish',
    primary: '#4b5563',
    belly: '#6b7280',
    face: '#0a1620',
    cheek: '#c97b84',
    accent: '#fb923c',
    dark: '#111827',
    swatch: '#374151',
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
  'Dead-simple home chore bot: low wheeled base + camera eye + one LeRobot SO-101 arm. Draft / not for sale. Not official Pollen.'

export const FAST_FACTS = [
  { label: 'Base', value: 'Diff-drive wheels' },
  { label: 'Eye', value: '1× CSI/USB cam' },
  { label: 'Arm (v1)', value: '1× SO-101' },
  { label: 'Target', value: 'Sub-$400–600 DIY' },
  { label: 'Status', value: 'Draft / not for sale' },
]

export type BomColumn = 'base' | 'arm' | 'dual'

export type BomRow = {
  category: string
  part: string
  qty: number | string
  /** Draft street USD for base-kit column (wheels + eye + compute) */
  usd_base: number
  /** Draft street USD for base + 1× SO-101 (default product) */
  usd_arm: number
  /** Draft street USD for base + 2× SO-101 (optional upgrade) */
  usd_dual: number
  vendor: string
  notes: string
}

/**
 * Purchasable BOM — round draft USD street prices (hobby, 2025–2026).
 * Columns: Base kit | + 1 arm (v1) | + 2nd arm (optional).
 * Aggressive DIY twin aims sub-$400–600 with one arm — not a $1.4k biped stack.
 */
export const BOM: BomRow[] = [
  {
    category: 'Locomotion',
    part: 'Gear motors + wheels (diff-drive pair)',
    qty: 1,
    usd_base: 30,
    usd_arm: 30,
    usd_dual: 30,
    vendor: 'Amazon / Pololu-class / AliExpress',
    notes: '2× cheap geared DC motors + bought rubber tires on printed hubs.',
  },
  {
    category: 'Locomotion',
    part: 'Caster / support wheel(s)',
    qty: 1,
    usd_base: 8,
    usd_arm: 8,
    usd_dual: 8,
    vendor: 'Amazon',
    notes: 'Front/rear caster so low base stays stable with arm mass.',
  },
  {
    category: 'Driver',
    part: 'Motor driver (TB6612 / L298N class)',
    qty: 1,
    usd_base: 10,
    usd_arm: 10,
    usd_dual: 10,
    vendor: 'Amazon / Pololu',
    notes: 'Tank drive H-bridge for the two wheel motors.',
  },
  {
    category: 'Driver',
    part: 'Arm TTL hub + BEC (STS3215 rail)',
    qty: 1,
    usd_base: 0,
    usd_arm: 25,
    usd_dual: 40,
    vendor: 'Feetech hub / Amazon BEC',
    notes: 'Separate rail from wheel motors. Dual arms need more headroom.',
  },
  {
    category: 'Compute',
    part: 'Pi Zero 2 W / Radxa Zero 3W + cooler',
    qty: 1,
    usd_base: 20,
    usd_arm: 20,
    usd_dual: 20,
    vendor: 'Raspberry Pi / Radxa',
    notes: 'Fits in base bay. Pi 5 optional if bay redesigned.',
  },
  {
    category: 'Sensors',
    part: 'CSI / USB camera (mast or head)',
    qty: 1,
    usd_base: 18,
    usd_arm: 18,
    usd_dual: 18,
    vendor: 'Pi Camera / Amazon USB',
    notes: 'One cheap eye. Optional bumper/cliff later — not faked in UI.',
  },
  {
    category: 'Power',
    part: '2S/3S LiPo + charger',
    qty: 1,
    usd_base: 35,
    usd_arm: 40,
    usd_dual: 45,
    vendor: 'Hobby LiPo',
    notes: 'Bigger pack as arms draw more. Draft — chemistry TBD at build.',
  },
  {
    category: 'Structure',
    part: 'PLA chassis + mast (printed)',
    qty: 1,
    usd_base: 25,
    usd_arm: 30,
    usd_dual: 35,
    vendor: 'Amazon filament',
    notes: 'Print print/base/*.stl (~350-450 g PLA). Tires/motors/caster bought.',
  },
  {
    category: 'Actuation (arm)',
    part: 'LeRobot SO-101 follower kit (DIY)',
    qty: '1 (v1) / 2 opt.',
    usd_base: 0,
    usd_arm: 150,
    usd_dual: 300,
    vendor: 'HF docs/lerobot/en/so101 · TheRobotStudio/SO-ARM100',
    notes: '6× STS3215 each, reach ~500 mm, ~800 g/arm, DIY ~$100–200. v1 = one arm.',
  },
  {
    category: 'Structure',
    part: 'SO-101 mount plate + fasteners',
    qty: 1,
    usd_base: 0,
    usd_arm: 15,
    usd_dual: 25,
    vendor: 'Print / metal plate',
    notes: 'Side/front mount on wheeled base — stable vs biped tip risk.',
  },
  {
    category: 'Fasteners',
    part: 'M2/M3 screws + wiring + XT30',
    qty: 1,
    usd_base: 20,
    usd_arm: 30,
    usd_dual: 40,
    vendor: 'Amazon fastener / wiring kit',
    notes: 'Wheel harness + arm bus + heat-shrink.',
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
  { key: 'What', value: 'Cheap home helper — wheeled base + eye + SO-101 arm' },
  { key: 'Locomotion', value: 'Low differential-drive base (Roomba-class); tank {forward, yawRate}' },
  { key: 'Why wheels', value: 'Traverse home floors, stable with arm mass, cheap, less tip/stuck than biped' },
  { key: 'Eye', value: '1× cheap CSI/USB camera on mast/head; bumper/cliff optional later' },
  { key: 'Arm (v1)', value: '1× LeRobot SO-101 (6 DOF, STS3215 ×6); dual arms optional upgrade' },
  { key: 'Near-term chores', value: 'Pick/place small items, wipe within reach, nudge laundry basket — not folding laundry' },
  { key: 'Cost target', value: 'Aggressive DIY twin sub-$400–600 with one arm (draft street prices)' },
  { key: 'Status', value: 'Draft — not for sale. Not official Pollen / Microduck.' },
]
