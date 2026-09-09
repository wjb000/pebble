/** Pebble / HouseHand v3 — omni deck + telescoping torso + 2× SO-101.
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

/** Itemized dual from BOM_V3.md mid-street prices (hobby, 2026). Range ~$450–730 if careful. */
export const BOM_V3_RANGE_LO = 450
export const BOM_V3_RANGE_HI = 730
export const BOM_DO_NOT_BUY =
  'Do not buy: RÅSKOG cart · ODrive/SteadyWin · Amazing Hand · exposed-rail-only lift · diff-only if you want true omni.'

export const BOM: BomRow[] = [
  {
    category: 'A · Arms',
    part: 'Feetech STS3215 7.4V 1/345 (C001)',
    qty: '12 / 2 arms',
    usd_base: 0,
    usd_arm: 84,
    usd_dual: 168,
    vendor: 'Feetech / AliExpress',
    notes: '6 per SO-101 follower. Dominates DIY cost.',
    quote: 'https://www.amazon.com/s?k=STS3215+servo',
  },
  {
    category: 'A · Arms',
    part: 'Waveshare bus servo adapter',
    qty: 2,
    usd_base: 0,
    usd_arm: 11,
    usd_dual: 22,
    vendor: 'Waveshare',
    notes: 'One bus per arm.',
  },
  {
    category: 'A · Arms',
    part: '5V ≥5A PSU (or 12V if using 12V STS)',
    qty: 2,
    usd_base: 0,
    usd_arm: 12,
    usd_dual: 24,
    vendor: 'Amazon / Mean Well class',
    notes: 'Match motor voltage.',
  },
  {
    category: 'A · Arms',
    part: 'USB-C data cables',
    qty: 2,
    usd_base: 0,
    usd_arm: 4,
    usd_dual: 8,
    vendor: 'Amazon',
    notes: 'Arm bus to host.',
  },
  {
    category: 'A · Arms',
    part: 'PLA+/PETG filament (both followers)',
    qty: '~1 kg',
    usd_base: 0,
    usd_arm: 10,
    usd_dual: 20,
    vendor: 'Amazon filament',
    notes: 'Print from SO-ARM100 STLs. Optional if buying kits.',
  },
  {
    category: 'A · Arms',
    part: 'USB wrist cameras (UVC)',
    qty: 2,
    usd_base: 0,
    usd_arm: 15,
    usd_dual: 30,
    vendor: 'Amazon UVC',
    notes: 'One per wrist.',
  },
  {
    category: 'A · Arms',
    part: 'Grip tape',
    qty: 1,
    usd_base: 0,
    usd_arm: 5,
    usd_dual: 5,
    vendor: 'Hardware store',
    notes: 'Finger pads.',
  },
  {
    category: 'B · Telescoping torso',
    part: 'Nested tube / telescoping column kit',
    qty: 1,
    usd_base: 50,
    usd_arm: 50,
    usd_dual: 50,
    vendor: 'AliExpress column / DIY nested 2040',
    notes: 'Column grows/shrinks — not an exposed rail carriage.',
  },
  {
    category: 'B · Telescoping torso',
    part: 'Lead screw T8 + nut (internal) or internal belt',
    qty: 1,
    usd_base: 12,
    usd_arm: 12,
    usd_dual: 12,
    vendor: 'AliExpress / Amazon',
    notes: 'Inside the torso.',
    quote: 'https://www.amazon.com/s?k=T8+leadscrew',
  },
  {
    category: 'B · Telescoping torso',
    part: 'Lift motor: STS3215 or 12V gearmotor / actuator',
    qty: 1,
    usd_base: 20,
    usd_arm: 20,
    usd_dual: 20,
    vendor: 'Feetech / Amazon',
    notes: 'Internal to column.',
  },
  {
    category: 'B · Telescoping torso',
    part: 'Printed shoulder crossbar (2× SO-101 bases)',
    qty: 1,
    usd_base: 6,
    usd_arm: 6,
    usd_dual: 6,
    vendor: 'Print',
    notes: 'Filament. Keyed L/R seats.',
  },
  {
    category: 'B · Telescoping torso',
    part: 'Column base plate → deck',
    qty: 1,
    usd_base: 6,
    usd_arm: 6,
    usd_dual: 6,
    vendor: 'Print or plate',
    notes: 'Bolts nested column to 400×450 deck.',
  },
  {
    category: 'B · Telescoping torso',
    part: 'Limit switches (min/max height)',
    qty: 2,
    usd_base: 3,
    usd_arm: 3,
    usd_dual: 3,
    vendor: 'Amazon',
    notes: 'Soft limits in sim = Q/E clamp.',
  },
  {
    category: 'B · Telescoping torso',
    part: 'Head / torso USB camera',
    qty: 1,
    usd_base: 18,
    usd_arm: 18,
    usd_dual: 18,
    vendor: 'Amazon UVC',
    notes: 'On shoulder or top tube. SO-ARM overhead mount STLs.',
  },
  {
    category: 'C · Omni base',
    part: 'Chassis deck ~400×450 mm (plywood 18 mm or alu)',
    qty: 1,
    usd_base: 18,
    usd_arm: 18,
    usd_dual: 18,
    vendor: 'Hardware store / Misumi plate',
    notes: 'Low, stiff. Support polygon = deck.',
  },
  {
    category: 'C · Omni base',
    part: 'Omni wheels 4″ mecanum set (or 3-kiwi)',
    qty: 4,
    usd_base: 40,
    usd_arm: 40,
    usd_dual: 40,
    vendor: 'AliExpress / Amazon',
    notes: '4 mecanum on rectangular deck. LeKiwi 3-omni is the other legal option.',
    quote: 'https://www.amazon.com/s?k=100mm+mecanum+wheel',
  },
  {
    category: 'C · Omni base',
    part: 'Drive motors: STS3215 12V ×4 (or DC gearmotors + encoders)',
    qty: 4,
    usd_base: 50,
    usd_arm: 50,
    usd_dual: 50,
    vendor: 'Feetech / Amazon',
    notes: 'Match wheel count. No casters.',
  },
  {
    category: 'C · Omni base',
    part: 'Motor driver(s): Waveshare bus or high-current H-bridges',
    qty: '1–2',
    usd_base: 20,
    usd_arm: 20,
    usd_dual: 20,
    vendor: 'Waveshare / Amazon',
    notes: 'Holonomic mix for mecanum.',
  },
  {
    category: 'C · Omni base',
    part: 'Fasteners, standoffs, bumper foam',
    qty: '—',
    usd_base: 12,
    usd_arm: 12,
    usd_dual: 12,
    vendor: 'Amazon',
    notes: 'Deck bumper. Skip casters.',
  },
  {
    category: 'D · Power / compute / safety',
    part: '12V battery pack + BMS (or compact power station)',
    qty: 1,
    usd_base: 60,
    usd_arm: 60,
    usd_dual: 60,
    vendor: 'Hobby / Jackery-class',
    notes: 'Centered in base — this is the low-bay mass.',
  },
  {
    category: 'D · Power / compute / safety',
    part: '5V buck converter',
    qty: '1–2',
    usd_base: 6,
    usd_arm: 6,
    usd_dual: 6,
    vendor: 'Amazon',
    notes: 'Logic / hub / cams.',
  },
  {
    category: 'D · Power / compute / safety',
    part: 'Powered USB hub',
    qty: 1,
    usd_base: 15,
    usd_arm: 15,
    usd_dual: 15,
    vendor: 'Amazon',
    notes: 'Arm buses + 3 cams.',
  },
  {
    category: 'D · Power / compute / safety',
    part: 'Laptop you own (or optional Raspberry Pi 5)',
    qty: '0–1',
    usd_base: 0,
    usd_arm: 0,
    usd_dual: 0,
    vendor: '—',
    notes: 'Default: laptop you own. Pi 5 is +$0–80 if you need an on-base host.',
  },
  {
    category: 'D · Power / compute / safety',
    part: 'USB gamepad',
    qty: 1,
    usd_base: 20,
    usd_arm: 20,
    usd_dual: 20,
    vendor: 'Amazon',
    notes: 'Teleop host.',
  },
  {
    category: 'D · Power / compute / safety',
    part: 'E-stop (latching) mushroom',
    qty: 1,
    usd_base: 10,
    usd_arm: 10,
    usd_dual: 10,
    vendor: 'Amazon / Digi-Key',
    notes: 'Cuts drive + arms + lift. Sim Space = e-stop/reset.',
    quote: 'https://www.amazon.com/s?k=16mm+mushroom+e-stop+NC',
  },
  {
    category: 'D · Power / compute / safety',
    part: 'Wire, XT60, fuses, switch',
    qty: '—',
    usd_base: 18,
    usd_arm: 18,
    usd_dual: 18,
    vendor: 'Amazon',
    notes: 'Labels L/R.',
  },
  {
    category: 'D · Power / compute / safety',
    part: 'On-base bin / tote',
    qty: 1,
    usd_base: 8,
    usd_arm: 8,
    usd_dual: 8,
    vendor: 'Dollar store',
    notes: 'Drops / laundry.',
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
  { key: 'What', value: 'HouseHand v3 — ~1100 mm extended omni chore helper + 2× SO-101' },
  { key: 'Form', value: 'NYRO-like silhouette · telescoping torso · omni base · dual SO-101' },
  { key: 'Height', value: '1100 mm extended (deck 82 + nested 380 + travel 560 + head 78); collapsed ~540 mm' },
  { key: 'Reach', value: 'Shoulders 462→1022 mm AGL; SO-101 ~500 mm; counters ~900 / washer rim ~850–950 / floor' },
  { key: 'Base', value: '400×450 mm deck · 4× 4″ mecanum · no casters · no outriggers' },
  { key: 'Lift', value: 'Nested tubes + internal T8; Q/E soft limits; not an exposed MGN carriage' },
  { key: 'Tip', value: '400 mm deck + 4 kg 12V pack → tip ≈7.85 N·m / restore ≈19.6 N·m / margin ≈2.5× (stability.ts)' },
  { key: 'Does', value: 'Pick clothes off floor → basket; nudge basket; drop into open washer if rim reachable; wipe tables; dish assist' },
  { key: 'Does NOT', value: 'Folding, detergent dosing, closed-door washer cycles, waterproofing, hot water, glass-safe grip' },
  { key: 'Drive', value: 'Holonomic mecanum — W/S forward, A/D strafe, arrows/Z/X yaw' },
  { key: 'Arms', value: '2× SO-101 (STS3215×12); twin = link envelopes; BOM still kits' },
  { key: 'Cost (draft)', value: 'Dual DIY ~$450–730 (itemized mid ~ see BOM). Laptop you own = $0 compute.' },
  { key: 'Do not buy', value: 'RÅSKOG cart · ODrive/SteadyWin · Amazing Hand · exposed-rail-only lift · diff-only' },
  { key: 'Status', value: 'Draft — not for sale. E-stop required. Nested column required.' },
]
