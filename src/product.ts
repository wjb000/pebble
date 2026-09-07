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
  'Cheap wheeled chore bot (~1200 mm): perceptron base + lead-screw + MGN12 + outriggers + 4 kg ballast + 2× SO-101. Floor pick, wipe, dishes assist, laundry basket/washer-assist. Draft / not for sale.'

export const FAST_FACTS = [
  { label: 'Height', value: '~1200 mm / 3′11″ (chore stack)' },
  { label: 'Elevator', value: 'T8 + MGN12 160→950 mm AGL' },
  { label: 'Arms', value: '2× SO-101' },
  { label: 'Tip margin', value: '~1.22× @ 400 mm stance + 4 kg ballast' },
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
  quote?: string
}

/**
 * Dual BOM — draft street USD (hobby, 2026). Prior min dual ~$655 rose for Critic P0 safety:
 * outriggers + MGN12 + sized 4 kg ballast + hardware e-stop (see BOM_SAFETY_DELTA).
 */
export const BOM_PRIOR_DUAL_USD = 655
export const BOM_SAFETY_DELTA_NOTE =
  'Safety delta vs prior ~$655: +outriggers, +MGN12H REQUIRED, +4.0 kg ballast line (was 0.5 kg bundled), +hardware e-stop. Tip margin target ≥1.2×.'

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
    category: 'Locomotion',
    part: 'Outrigger feet / angle stock (support width 400 mm)',
    qty: 1,
    usd_base: 16,
    usd_arm: 16,
    usd_dual: 16,
    vendor: 'Hardware store angle + print pads',
    notes: 'REQUIRED — track 160 mm alone fails tip math for dual SO-101 @ 950 AGL.',
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
    notes: 'Chore length (~1 kg). Overall 1200 mm stack.',
    quote: 'https://www.amazon.com/s?k=2040+v-slot+extrusion+1000mm',
  },
  {
    category: 'Screw elevator',
    part: 'T8 lead screw kit ~1.1 m + coupler + 2× bearings',
    qty: 1,
    usd_base: 18,
    usd_arm: 18,
    usd_dual: 18,
    vendor: 'AliExpress / Amazon',
    notes: 'Matches 160→950 mm travel on SCREW_AXIS_X.',
    quote: 'https://www.amazon.com/s?k=T8+leadscrew+1100mm',
  },
  {
    category: 'Screw elevator',
    part: 'MGN12H linear rail ~1000 mm + carriage block',
    qty: 1,
    usd_base: 22,
    usd_arm: 22,
    usd_dual: 22,
    vendor: 'AliExpress / Amazon',
    notes: 'REQUIRED anti-rotation parallel to T8. Cheapest rail that carries dual-arm torque (~$18–25).',
    quote: 'https://www.amazon.com/s?k=MGN12H+1000mm',
  },
  {
    category: 'Screw elevator',
    part: 'NEMA17 stepper + A4988 driver (Prusa z-bottom)',
    qty: 1,
    usd_base: 18,
    usd_arm: 18,
    usd_dual: 18,
    vendor: 'Amazon / Stepperonline',
    notes: 'Prusa mount STL (GPL-2.0). MGN12 carries torque — not optional.',
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
    part: 'Pi 4 2–4GB class + cooler (~45 g board)',
    qty: 1,
    usd_base: 55,
    usd_arm: 55,
    usd_dual: 55,
    vendor: 'Raspberry Pi / reseller',
    notes: 'Pi 4-class mass ~45 g (not Pi Zero). Enough for LeRobot follower + tank.',
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
    part: '3S LiPo + charger',
    qty: 1,
    usd_base: 32,
    usd_arm: 32,
    usd_dual: 32,
    vendor: 'Hobby LiPo',
    notes: 'Battery only — ballast is a separate line.',
  },
  {
    category: 'Power',
    part: 'Scrap-steel ballast 4.0 kg (low bay)',
    qty: 1,
    usd_base: 18,
    usd_arm: 18,
    usd_dual: 18,
    vendor: 'Scrap steel / Amazon steel plate',
    notes: 'REQUIRED — sized from tip math (stability.ts). Prior 0.5 kg was inadequate.',
  },
  {
    category: 'Safety',
    part: 'Hardware e-stop mushroom (NC) + panel mount',
    qty: 1,
    usd_base: 12,
    usd_arm: 12,
    usd_dual: 12,
    vendor: 'Amazon / Digi-Key',
    notes: 'SKU-class: 16–22 mm NC mushroom on motor rail. Sim Space = e-stop/reset.',
    quote: 'https://www.amazon.com/s?k=16mm+mushroom+e-stop+NC',
  },
  {
    category: 'Structure',
    part: 'PLA/PETG — chassis + Prusa Z/carriage + cam/4040/yoke (SO-101 = bought kits; prints optional DIY)',
    qty: 1,
    usd_base: 50,
    usd_arm: 80,
    usd_dual: 105,
    vendor: 'Amazon filament + upstream STLs',
    notes: 'Keyed L/R lug asymmetry on 4040 mounts. Prusa parts GPL-2.0.',
  },
  {
    category: 'Actuation (arm)',
    part: 'Feetech STS3215 servos ×12 (6 per SO-101) + DIY electronics',
    qty: '12 / 2 arms',
    usd_base: 0,
    usd_arm: 125,
    usd_dual: 250,
    vendor: 'Feetech / Amazon · HF docs/lerobot/en/so101',
    notes: 'KEEP dual bought kits. STS3215×12 ~$20–22/servo. Dominates ~$715 dual. Twin envelopes ≠ cost-down.',
    quote: 'https://www.amazon.com/s?k=STS3215+servo',
  },
  {
    category: 'End-effector',
    part: 'Soft silicone / foam gripper pads (dish-safe contact)',
    qty: 1,
    usd_base: 0,
    usd_arm: 5,
    usd_dual: 8,
    vendor: 'Amazon craft foam / silicone sheet',
    notes: 'Visible on twin gripper meshes. NOT waterproof; NO hot water; glass = breakage risk.',
  },
  {
    category: 'End-effector',
    part: 'Microfiber wipe tool (clip-on rag / mop pad)',
    qty: 1,
    usd_base: 4,
    usd_arm: 5,
    usd_dual: 6,
    vendor: 'Dollar store microfiber + print clip',
    notes: 'Visible wipe pad on R gripper in twin. Dry/damp only.',
  },
  {
    category: 'Fasteners',
    part: 'M3/M4/M5 + wiring + XT60 + short cable chain',
    qty: 1,
    usd_base: 28,
    usd_arm: 35,
    usd_dual: 40,
    vendor: 'Amazon fastener kit',
    notes: 'Labels L/R blue/orange + physical keyed lugs.',
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
  { key: 'Height', value: '1200 mm = base 108 + extrusion 1010 + head 82 (chore stack)' },
  { key: 'Reach', value: 'Shoulders 160→950 mm AGL; SO-101 ~500 mm; counters ~900 / washer rim ~850–950 / floor' },
  { key: 'Tip', value: 'Outriggers 400 mm + 4.0 kg ballast → tip ≈7.85 N·m / restore ≈9.6 N·m / margin ≈1.22× (stability.ts)' },
  { key: 'Anti-rotation', value: 'MGN12H REQUIRED parallel to T8 (not optional)' },
  { key: 'Does', value: 'Pick clothes off floor → basket; nudge basket; drop into open washer if rim reachable; wipe tables; dish assist' },
  { key: 'Does NOT', value: 'Folding, detergent dosing, closed-door washer cycles, waterproofing, hot water, glass-safe grip' },
  { key: 'Base upstream', value: 'PedroS235/perceptron_bot (MIT)' },
  { key: 'Lift upstream', value: 'Prusa i3 Z + x-end carriage (GPL-2.0) — derivatives must stay GPL; SO-ARM 4040 (Apache-2.0)' },
  { key: 'Head upstream', value: 'SO-ARM100 Overhead Cam 1:1 (Apache-2.0)' },
  { key: 'Screw elevator', value: 'T8 + MGN12 + NEMA17 coax SCREW_AXIS_X; Q/E soft limits; tip slowdown UX ≠ tip physics' },
  { key: 'Arms', value: '2× bought SO-101 kits required (STS3215×12); twin = link envelopes only — BOM unchanged; soft pads + wipe' },
  { key: 'Cost (draft)', value: 'Dual twin — see BOM (prior ~$655 + safety delta for outriggers/MGN/ballast/e-stop)' },
  { key: 'Status', value: 'Draft — not for sale. Ballast + outriggers + MGN + e-stop required.' },
]
