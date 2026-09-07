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
    tagline: 'Soft grey shell, studio default',
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
    tagline: 'Dark desk-bot finish',
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
    tagline: 'Warm blush shell',
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
    tagline: 'Quiet lab green',
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
  'Pebble = Microduck-class body (15× XL330, 250 mm) + dual LeRobot SO-101 arms (6 DOF ×2, STS3215). Not an official Pollen product — sim matches CAD.'

export const FAST_FACTS = [
  { label: 'Body height', value: '250 mm' },
  { label: 'Body width', value: '~140 mm' },
  { label: 'Body servos', value: '15× XL330' },
  { label: 'Leg DOF', value: '10 (5×2)' },
  { label: 'Neck / head / beak', value: '4 + mouth' },
  { label: 'Arms', value: '2× SO-101 (6 DOF)' },
  { label: 'Locomotion cmd', value: '{forward, yawRate}' },
  { label: 'Twin BOM (draft)', value: '~$0.9–1.4k' },
  { label: 'Digital twin', value: 'sim = CAD = BOM' },
]

export type PricePack = {
  id: string
  name: string
  price: string
  blurb: string
  items: string[]
}

export const PRICE_PACKS: PricePack[] = [
  {
    id: 'body',
    name: 'Microduck-class body',
    price: '~$0.5–0.8k',
    blurb: '15× Dynamixel XL330 duck biped (public kinematics). Walk with WASD / velocity commands; arms optional later.',
    items: [
      '15× Dynamixel XL330 (14 + beak)',
      'Printed Microduck-scale trunk + legs',
      'Pi Zero 2 W / Radxa Zero 3W + cam',
      'Small LiPo + TTL hub',
    ],
  },
  {
    id: 'twin',
    name: 'Pebble twin (body + arms)',
    price: '~$0.9–1.4k',
    blurb: 'Body + 2× LeRobot SO-101 follower kits. Top-heavy — tabletop / braced mode recommended.',
    items: [
      'Everything in body pack',
      '2× SO-101 follower (12× STS3215)',
      'Shoulder mount plates',
      'Optional counterweight / dock',
    ],
  },
  {
    id: 'arms_only',
    name: 'SO-101 arms only',
    price: '~$200–400',
    blurb: 'DIY ~$100–200 per arm (HF LeRobot SO-101). Mount to existing Microduck-class torso.',
    items: [
      '1–2× SO-101 follower kits',
      'Feetech STS3215 ×6 each',
      'Print SO-101 STLs (TheRobotStudio)',
      'Separate 5–12 V arm PSU',
    ],
  },
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
      // Skip loose STS3215 line when kits already priced (avoid double-count on full)
      if (column === 'full' && row.part.includes('STS3215 (if buying loose)')) return sum
      return sum + unit * row.qty
    }
    return sum + unit
  }, 0)
}

export const SPECS = [
  {
    key: 'Positioning',
    value:
      'Pebble — Microduck-class body + 2× LeRobot SO-101 arms. NOT an official Pollen product. Digital twin: sim = CAD = BOM',
  },
  {
    key: 'Standing height',
    value: '250 mm (dims.ts / cad/pebble.scad) — public Microduck press-kit class',
  },
  {
    key: 'Body width / mass',
    value: '~140 mm envelope; Microduck body <800 g (arms add ~1.6 kg — top-heavy)',
  },
  {
    key: 'Body actuators',
    value: '15× Dynamixel XL330 (20×34×26 mm, ~18 g) — 10 leg + 4 neck/head + mouth/beak',
  },
  {
    key: 'Locomotion DOF',
    value: 'hip_yaw, hip_roll, hip_pitch, knee, ankle ×2 — Microduck joint names/order',
  },
  {
    key: 'Neck / head DOF',
    value: 'neck_pitch, head_pitch, head_yaw, head_roll + beak',
  },
  {
    key: 'Arms',
    value:
      '2× LeRobot SO-101 (6 DOF: shoulder_pan, shoulder_lift, elbow_flex, wrist_flex, wrist_roll, gripper) — STS3215 ×6/arm, reach ~500 mm, ~800 g/arm',
  },
  {
    key: 'Integration',
    value: 'HF LeRobot so101_follower · https://huggingface.co/docs/lerobot/en/so101',
  },
  {
    key: 'Compute / battery',
    value: 'Pi Zero 2 W class; small LiPo envelope 40×18×30',
  },
  {
    key: 'Honesty',
    value:
      'Dual SO-101 on Microduck body is top-heavy — mount plate, counterweight, or tabletop braced / docked manipulation',
  },
  {
    key: 'Locomotion interface',
    value: '{forward, yawRate} in [-1, 1] for legs; arms idle pose in sim',
  },
  {
    key: 'Physics honesty',
    value: 'Geometry exact; kinematics-lite (not MuJoCo-perfect yet)',
  },
  {
    key: 'Status',
    value: 'Draft — not for sale. Not official Microduck. See docs/ASSEMBLY.md',
  },
]
