/** Pebble — wheeled humanoid home chore bot + 2× LeRobot SO-101 (draft / not for sale).
 *  NOT an official Pollen Robotics product. Cost is a primary design constraint. */

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
  'Dead-simple home chore bot: wheeled base + torso/head (screen+cam) + two LeRobot SO-101 arms that hang like a person. Floor→counter reach. Draft / not for sale. Not official Pollen.'

export const FAST_FACTS = [
  { label: 'Base', value: 'Diff-drive wheels' },
  { label: 'Head', value: 'Screen + cam' },
  { label: 'Arms', value: '2× SO-101' },
  { label: 'Reach', value: 'Floor→~900 mm' },
  { label: 'Status', value: 'Draft / not for sale' },
]

export type BomColumn = 'base' | 'arm' | 'dual'

export type BomRow = {
  category: string
  part: string
  qty: number | string
  /** Draft street USD for base-kit column (wheels + torso/head + compute) */
  usd_base: number
  /** Draft street USD for base + 1× SO-101 (half kit / debug) */
  usd_arm: number
  /** Draft street USD for base + 2× SO-101 (default product) */
  usd_dual: number
  vendor: string
  notes: string
}

/**
 * Purchasable BOM — round draft USD street prices (hobby, 2025–2026).
 * Columns: Base kit | + 1 arm | + 2 arms (default product).
 * Dual-arm twin rises vs prior one-arm ~$376 — honesty, not sticker shock theater.
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
    notes: 'Rear caster; wide base + ballast for dual-arm tip resistance.',
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
    usd_dual: 45,
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
    part: 'CSI / USB camera (forehead)',
    qty: 1,
    usd_base: 18,
    usd_arm: 18,
    usd_dual: 18,
    vendor: 'Pi Camera / Amazon USB',
    notes: 'One cheap eye on head mast/forehead.',
  },
  {
    category: 'Sensors',
    part: 'Face screen (small HDMI/USB display)',
    qty: 1,
    usd_base: 35,
    usd_arm: 35,
    usd_dual: 35,
    vendor: 'Amazon / Waveshare-class',
    notes: 'Bought panel behind printed bezel — dark quad in sim.',
  },
  {
    category: 'Power',
    part: '2S/3S LiPo + charger + ballast weight',
    qty: 1,
    usd_base: 40,
    usd_arm: 45,
    usd_dual: 55,
    vendor: 'Hobby LiPo + steel shot / lead alternative',
    notes: 'Bigger pack + bay ballast as arms + height raise tip risk.',
  },
  {
    category: 'Structure',
    part: 'PLA chassis + torso + head (printed)',
    qty: 1,
    usd_base: 45,
    usd_arm: 50,
    usd_dual: 55,
    vendor: 'Amazon filament',
    notes: 'Print print/base/*.stl (~550–750 g PLA). Wider base for dual arms.',
  },
  {
    category: 'Actuation (arm)',
    part: 'LeRobot SO-101 follower kit (DIY)',
    qty: '2 (default)',
    usd_base: 0,
    usd_arm: 150,
    usd_dual: 300,
    vendor: 'HF docs/lerobot/en/so101 · TheRobotStudio/SO-ARM100',
    notes: '6× STS3215 each, reach ~500 mm, ~800 g/arm, DIY ~$100–200. Product = two arms.',
  },
  {
    category: 'Structure',
    part: 'SO-101 shoulder pods + fasteners',
    qty: 2,
    usd_base: 0,
    usd_arm: 15,
    usd_dual: 28,
    vendor: 'Print / metal plate',
    notes: 'L/R shoulder pods on torso — hang idle along flanks.',
  },
  {
    category: 'Fasteners',
    part: 'M2/M3 screws + wiring + XT30',
    qty: 1,
    usd_base: 25,
    usd_arm: 35,
    usd_dual: 45,
    vendor: 'Amazon fastener / wiring kit',
    notes: 'Wheel harness + dual arm bus + heat-shrink.',
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
  { key: 'What', value: 'Cheap home helper — wheeled base + torso/head + 2× SO-101 arms' },
  { key: 'Locomotion', value: 'Wide differential-drive base; tank {forward, yawRate}; ballast in bay' },
  { key: 'Why wheels', value: 'Traverse home floors, not stuck; humanoid upper body for chores' },
  { key: 'Head', value: 'Printed bezel + bought face screen + CSI/USB cam on forehead' },
  { key: 'Arms', value: '2× LeRobot SO-101 (6 DOF, STS3215 ×6 each); idle hang along flanks' },
  { key: 'Reach', value: 'Shoulders ~527 mm AGL; ~500 mm reach → floor and ~US counter (900 mm)' },
  { key: 'Height', value: '~717 mm overall with head (draft twin)' },
  { key: 'Near-term chores', value: 'Pick/place floor→counter, wipe within reach, nudge laundry — not folding laundry' },
  { key: 'Cost target', value: 'Draft DIY twin with dual arms ~mid-$500s–$650 street (rises vs one-arm)' },
  { key: 'Status', value: 'Draft — not for sale. Tip risk: wide base + ballast. Not official Pollen.' },
]
