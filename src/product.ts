/** Pebble — Microduck-class body + 2× LeRobot SO-101 arms (draft / not for sale).
 *  NOT an official Pollen Robotics product. Sim matches CAD. */

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
  'Microduck-class body (15× XL330, 250 mm) + dual LeRobot SO-101 arms. Not an official Pollen product.'

export const FAST_FACTS = [
  { label: 'Height', value: '250 mm' },
  { label: 'Body servos', value: '15× XL330' },
  { label: 'Arms', value: '2× SO-101 (STS3215)' },
  { label: 'Locomotion', value: '{forward, yawRate}' },
  { label: 'Status', value: 'Draft / not for sale' },
]

export type BomRow = {
  category: string
  part: string
  qty: number | string
  usd_v1: number
  usd_full: number
  vendor: string
  notes: string
}

/**
 * Purchasable BOM — approx USD street prices (2025–2026 hobby).
 * v1 = body-focused; full = twin with dual SO-101.
 */
export const BOM: BomRow[] = [
  {
    category: 'Actuation (body)',
    part: 'Dynamixel XL330-M288-T (or equiv.)',
    qty: 15,
    usd_v1: 28,
    usd_full: 28,
    vendor: 'Robotis / authorized reseller — XL330',
    notes: '20×34×26 mm, ~18 g. 14 controlled + mouth/beak. Microduck-class layout.',
  },
  {
    category: 'Actuation (arms)',
    part: 'LeRobot SO-101 follower kit (DIY)',
    qty: 2,
    usd_v1: 0,
    usd_full: 150,
    vendor: 'HF docs/lerobot/en/so101 · TheRobotStudio/SO-ARM100',
    notes: '6× STS3215 each, reach ~500 mm, ~800 g/arm, DIY ~$100–200. v1 column omits arms.',
  },
  {
    category: 'Actuation (arms)',
    part: 'Feetech STS3215 (if buying loose)',
    qty: 12,
    usd_v1: 0,
    usd_full: 25,
    vendor: 'Feetech / WaveShare / AliExpress — STS3215',
    notes: 'Included in SO-101 kits usually — line for loose rebuild. 45.2×24.7×35 mm.',
  },
  {
    category: 'Driver',
    part: 'TTL hubs + BEC / PSU (body + arms)',
    qty: 1,
    usd_v1: 45,
    usd_full: 90,
    vendor: 'U2D2-class / Feetech hub / Amazon BEC',
    notes: 'Separate rails: XL330 body bus vs STS3215 arm bus preferred.',
  },
  {
    category: 'Compute',
    part: 'Pi Zero 2 W / Radxa Zero 3W + cooler',
    qty: 1,
    usd_v1: 25,
    usd_full: 25,
    vendor: 'Raspberry Pi / Radxa',
    notes: 'Microduck-scale bay (~65×30). Pi 5 optional if bay redesigned.',
  },
  {
    category: 'Sensors',
    part: 'CSI/USB camera (+ optional depth)',
    qty: 1,
    usd_v1: 20,
    usd_full: 35,
    vendor: 'Pi Camera / Amazon USB',
    notes: 'Head-mounted; Microduck has cam + small depth on real product.',
  },
  {
    category: 'Sensors',
    part: 'IMU (MPU-6050 / BMI088)',
    qty: 1,
    usd_v1: 8,
    usd_full: 12,
    vendor: 'Amazon / Adafruit',
    notes: 'Torso mount.',
  },
  {
    category: 'Power',
    part: '2S/3S LiPo + charger',
    qty: 1,
    usd_v1: 30,
    usd_full: 45,
    vendor: 'Hobby LiPo',
    notes: 'Envelope ~40×18×30 mm; not NP-F.',
  },
  {
    category: 'Structure',
    part: 'PLA filament + printed Microduck-scale links',
    qty: 1,
    usd_v1: 40,
    usd_full: 55,
    vendor: 'Amazon filament',
    notes: 'Original printable twin — do not copy proprietary Pollen STLs.',
  },
  {
    category: 'Structure',
    part: 'SO-101 shoulder mount plates + optional ballast',
    qty: 1,
    usd_v1: 0,
    usd_full: 35,
    vendor: 'Print / metal plate',
    notes: 'REQUIRED honesty: dual arms ~1.6 kg on <800 g body — brace / counterweight / dock.',
  },
  {
    category: 'Fasteners',
    part: 'M2/M3 screws + bearings + horns',
    qty: 1,
    usd_v1: 25,
    usd_full: 40,
    vendor: 'Amazon fastener kit',
    notes: 'XL330 horns + SO-101 M2/M3 kit.',
  },
  {
    category: 'Misc',
    part: 'Wiring, XT30, heat-shrink',
    qty: 1,
    usd_v1: 20,
    usd_full: 30,
    vendor: 'Amazon',
    notes: 'Home deploy harness.',
  },
]

export function bomLineTotal(row: BomRow, column: 'v1' | 'full'): number {
  const unit = column === 'v1' ? row.usd_v1 : row.usd_full
  const q = typeof row.qty === 'number' ? row.qty : 0
  if (q === 0) return unit
  return unit * q
}

export function bomSubtotal(column: 'v1' | 'full'): number {
  return BOM.reduce((sum, row) => {
    const unit = column === 'v1' ? row.usd_v1 : row.usd_full
    if (typeof row.qty === 'number') {
      if (column === 'full' && row.part.includes('STS3215 (if buying loose)')) return sum
      return sum + unit * row.qty
    }
    return sum + unit
  }, 0)
}

export const SPECS = [
  { key: 'Height', value: '250 mm standing (dims.ts)' },
  { key: 'Body actuators', value: '15× Dynamixel XL330 — Microduck joint layout' },
  { key: 'Arms', value: '2× LeRobot SO-101 (6 DOF each, STS3215 ×6/arm)' },
  { key: 'Top-heavy', value: 'Dual arms ~1.6 kg on <800 g body — brace / counterweight / dock' },
  { key: 'Interface', value: '{forward, yawRate} in [-1, 1]; arms idle in walk sim' },
  { key: 'Status', value: 'Draft — not for sale. Not official Microduck/Pollen.' },
]
