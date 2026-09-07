/** Pebble — cheap wheeled house-chore bot: dishes, wipe, laundry-assist + 2× SO-101.
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
  'Cheap wheeled chore bot (~1200 mm): perceptron base + short lead-screw + 2× SO-101 for floor pick, wipe, dishes assist, laundry basket/washer-assist. Draft / not for sale. Not official Pollen.'

export const FAST_FACTS = [
  { label: 'Height', value: '~1200 mm / 3′11″ (chore stack)' },
  { label: 'Elevator', value: 'Lead-screw 160→950 mm AGL' },
  { label: 'Arms', value: '2× SO-101' },
  { label: 'Chores', value: 'Floor · wipe · dishes · laundry-assist' },
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
 * Min dual BOM — draft street USD (hobby, 2026). Target ~$650–670.
 * Arms DIY dominate (~$250). Cut list vs prior ~$740: shorter 2040/T8, Pi 4-class,
 * cheap USB cam, min ballast, trim fasteners/filament; + soft pads + wipe.
 */
export const BOM: BomRow[] = [
  {
    category: 'Locomotion',
    part: 'Cheapest gear motors + rubber wheels (~65 mm)',
    qty: 1,
    usd_base: 35,
    usd_arm: 35,
    usd_dual: 35,
    vendor: 'Amazon / AliExpress',
    notes: 'Bought tires; chassis STLs from perceptron_bot (MIT).',
  },
  {
    category: 'Locomotion',
    part: 'Caster / support (perceptron caster STLs + ball)',
    qty: 1,
    usd_base: 8,
    usd_arm: 8,
    usd_dual: 8,
    vendor: 'Print + Amazon ball',
    notes: 'Upstream caster in public/assets/base/.',
  },
  {
    category: 'Driver',
    part: 'Wheel motor driver (TB6612 class)',
    qty: 1,
    usd_base: 10,
    usd_arm: 10,
    usd_dual: 10,
    vendor: 'Amazon / Pololu',
    notes: 'Tank H-bridge for two wheel motors.',
  },
  {
    category: 'Screw elevator',
    part: '2040 aluminium extrusion column ~1010 mm',
    qty: 1,
    usd_base: 22,
    usd_arm: 22,
    usd_dual: 22,
    vendor: 'Misumi / OpenBuilds / Amazon',
    notes: 'CUT vs 1540 mm 5′8″ stock — chore reach only. Overall 1200 mm.',
  },
  {
    category: 'Screw elevator',
    part: 'T8 lead screw kit ~1.1 m + coupler + 2× bearings',
    qty: 1,
    usd_base: 18,
    usd_arm: 18,
    usd_dual: 18,
    vendor: 'AliExpress / Amazon',
    notes: 'Shorter screw matches 160→950 mm travel on SCREW_AXIS_X.',
  },
  {
    category: 'Screw elevator',
    part: 'NEMA17 stepper + A4988 driver (Prusa z-bottom)',
    qty: 1,
    usd_base: 18,
    usd_arm: 18,
    usd_dual: 18,
    vendor: 'Amazon / Stepperonline',
    notes: 'Prusa mount STL (GPL-2.0). No MGN12.',
  },
  {
    category: 'Driver',
    part: 'Shared arm TTL hub + BEC (STS3215 rail)',
    qty: 1,
    usd_base: 0,
    usd_arm: 22,
    usd_dual: 28,
    vendor: 'Feetech hub / Amazon BEC',
    notes: 'One shared hub for both arms. Separate from wheel + screw rails.',
  },
  {
    category: 'Compute',
    part: 'Pi 4 2–4GB or Pi Zero 2W class + cooler',
    qty: 1,
    usd_base: 55,
    usd_arm: 55,
    usd_dual: 55,
    vendor: 'Raspberry Pi / reseller',
    notes: 'CUT from Pi 5 8GB. Enough for LeRobot follower + tank. Fits middle plate.',
  },
  {
    category: 'Sensors',
    part: 'Cheap USB / CSI camera (SO-ARM overhead mount)',
    qty: 1,
    usd_base: 12,
    usd_arm: 12,
    usd_dual: 12,
    vendor: 'Amazon USB UVC',
    notes: 'No LiDAR. Bracket: SO-ARM overhead cam (Apache-2.0).',
  },
  {
    category: 'Power',
    part: '3S LiPo + charger + minimum scrap-steel ballast',
    qty: 1,
    usd_base: 40,
    usd_arm: 40,
    usd_dual: 40,
    vendor: 'Hobby LiPo + scrap steel',
    notes: 'Ballast REQUIRED — do not skip. Shared PSU/BEC where possible.',
  },
  {
    category: 'Structure',
    part: 'PLA/PETG — chassis + Prusa Z/carriage + cam/4040 + 2× SO-101 prints',
    qty: 1,
    usd_base: 50,
    usd_arm: 80,
    usd_dual: 105,
    vendor: 'Amazon filament + upstream STLs',
    notes: 'Shorter column = less structure filament vs 5′8″ stack.',
  },
  {
    category: 'Actuation (arm)',
    part: 'LeRobot SO-101 follower DIY kit (servos + electronics)',
    qty: '2 (required)',
    usd_base: 0,
    usd_arm: 125,
    usd_dual: 250,
    vendor: 'HF docs/lerobot/en/so101 · TheRobotStudio/SO-ARM100',
    notes: 'KEEP dual. 6× STS3215 each ≈ $125/arm. Dominates twin cost.',
  },
  {
    category: 'End-effector',
    part: 'Soft silicone / foam gripper pads (dish-safe contact)',
    qty: 1,
    usd_base: 0,
    usd_arm: 5,
    usd_dual: 8,
    vendor: 'Amazon craft foam / silicone sheet',
    notes: 'Honesty: NOT waterproof; NO hot water / dishwasher; glass = breakage risk.',
  },
  {
    category: 'End-effector',
    part: 'Microfiber wipe tool (clip-on rag / mop pad)',
    qty: 1,
    usd_base: 4,
    usd_arm: 5,
    usd_dual: 6,
    vendor: 'Dollar store microfiber + print clip',
    notes: 'Dry/damp wipe only. Swap rag often. Not a mop bucket bot.',
  },
  {
    category: 'Fasteners',
    part: 'M3/M4/M5 + wiring + XT60 + short cable chain',
    qty: 1,
    usd_base: 28,
    usd_arm: 35,
    usd_dual: 40,
    vendor: 'Amazon fastener kit',
    notes: 'Shorter elevator = less chain. Labels L/R blue/orange.',
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
  { key: 'What', value: '~1200 mm wheeled chore helper — floor pick, wipe, dishes assist, laundry basket/washer-assist + 2× SO-101' },
  { key: 'Height', value: '1200 mm = base 108 + extrusion 1010 + head 82 (chore stack, not 5′8″)' },
  { key: 'Reach', value: 'Shoulders 160→950 mm AGL; SO-101 ~500 mm; counters ~900 / washer rim ~850–950 / floor' },
  { key: 'Does', value: 'Pick clothes off floor → basket; nudge basket; drop into open washer if rim reachable; wipe tables; dish assist' },
  { key: 'Does NOT', value: 'Folding, detergent dosing, closed-door washer cycles, waterproofing, hot water, glass-safe grip' },
  { key: 'Base upstream', value: 'PedroS235/perceptron_bot (MIT)' },
  { key: 'Lift upstream', value: 'Prusa i3 Z + x-end carriage (GPL-2.0); SO-ARM 4040 (Apache-2.0)' },
  { key: 'Head upstream', value: 'SO-ARM100 Overhead Cam 1:1 (Apache-2.0)' },
  { key: 'Screw elevator', value: 'T8 + NEMA17 coax SCREW_AXIS_X; Q/E soft limits; tip slowdown when high' },
  { key: 'Arms', value: '2× SO-101 required; soft pads + microfiber wipe accessory' },
  { key: 'Cost (draft)', value: 'Min dual twin — see BOM (target ~$650–670); arms ~$250 dominate' },
  { key: 'Status', value: 'Draft — not for sale. Ballast required. Not official Pollen.' },
]
