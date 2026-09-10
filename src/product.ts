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
export const BOM_V3_RANGE_LO = 495
export const BOM_V3_RANGE_HI = 695
export const BOM_DO_NOT_BUY =
  'Do not buy: RÅSKOG cart · 4× mecanum deck · nested telescoping column kit · ODrive/SteadyWin · Amazing Hand · leader SO-101 (unless teleop) · exposed-rail-only lift · diff-only.'

/** Itemized dual from BOM_V3.md — LeKiwi 3-omni + printed HouseHand + 2× SO-101. */
export const BOM: BomRow[] = [
  {
    category: 'A · Arms',
    part: 'Feetech STS3215 (C001)',
    qty: '12 / 2 arms',
    usd_base: 0,
    usd_arm: 84,
    usd_dual: 168,
    vendor: 'Feetech / AliExpress',
    notes: '6 per SO-101 follower.',
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
    part: 'PLA+/PETG filament (2× follower)',
    qty: '~0.8 kg',
    usd_base: 0,
    usd_arm: 8,
    usd_dual: 16,
    vendor: 'Amazon filament',
    notes: 'Print print/SO101/ (follower only).',
  },
  {
    category: 'A · Arms',
    part: 'Wrist UVC cams (optional)',
    qty: '0–2',
    usd_base: 0,
    usd_arm: 0,
    usd_dual: 0,
    vendor: 'Amazon UVC',
    notes: 'Optional + Wrist_camera_mount_SO101.stl.',
  },
  {
    category: 'B · HouseHand structure',
    part: 'Printed torso Ø180 / flange Ø190 + deck + neck + head',
    qty: 1,
    usd_base: 30,
    usd_arm: 30,
    usd_dual: 30,
    vendor: 'Print — print/xlerobot/hardware/',
    notes: 'HouseHand_*.stl · seats on LeKiwi layer2.',
  },
  {
    category: 'B · HouseHand structure',
    part: 'M3 hardware (flange, deck, neck, head)',
    qty: 1,
    usd_base: 12,
    usd_arm: 12,
    usd_dual: 12,
    vendor: 'Amazon / McMaster',
    notes: 'Through flange drill guides.',
  },
  {
    category: 'B · HouseHand structure',
    part: 'Head UVC camera',
    qty: 1,
    usd_base: 20,
    usd_arm: 20,
    usd_dual: 20,
    vendor: 'Amazon UVC',
    notes: 'Mounts on HouseHand_head_mount.',
  },
  {
    category: 'C · LeKiwi 3-omni base',
    part: 'Printed plates + mounts + hubs + Pi/battery cases',
    qty: 1,
    usd_base: 25,
    usd_arm: 25,
    usd_dual: 25,
    vendor: 'Print — print/lekiwi/',
    notes: 'layer1/layer2, 3× drive_motor_mount v11, 3× servo_wheel_hub.',
  },
  {
    category: 'C · LeKiwi 3-omni base',
    part: '4″ omni wheels (bought)',
    qty: 3,
    usd_base: 42,
    usd_arm: 42,
    usd_dual: 42,
    vendor: 'AliExpress / Amazon',
    notes: 'Not printed. Hubs are printed.',
    quote: 'https://www.amazon.com/s?k=4+inch+omni+wheel',
  },
  {
    category: 'C · LeKiwi 3-omni base',
    part: 'STS3215 drive servos',
    qty: 3,
    usd_base: 45,
    usd_arm: 45,
    usd_dual: 45,
    vendor: 'Feetech / AliExpress',
    notes: 'Bridge: mount → hub → wheel.',
  },
  {
    category: 'C · LeKiwi 3-omni base',
    part: 'Waveshare bus (drive)',
    qty: 1,
    usd_base: 11,
    usd_arm: 11,
    usd_dual: 11,
    vendor: 'Waveshare',
    notes: 'Drive bus (or share carefully).',
  },
  {
    category: 'C · LeKiwi 3-omni base',
    part: 'Hex standoffs M3 · 94868A713 class',
    qty: 6,
    usd_base: 12,
    usd_arm: 12,
    usd_dual: 12,
    vendor: 'McMaster / Amazon',
    notes: 'REQUIRED between layer1 ↔ layer2. Not printed.',
    quote: 'https://www.mcmaster.com/94868A713/',
  },
  {
    category: 'C · LeKiwi 3-omni base',
    part: 'M3 screws for plates / mounts / standoffs',
    qty: '—',
    usd_base: 10,
    usd_arm: 10,
    usd_dual: 10,
    vendor: 'Amazon',
    notes: 'Include lock nuts where vibration-prone.',
  },
  {
    category: 'D · Power / compute / safety',
    part: '12V battery pack + BMS',
    qty: 1,
    usd_base: 70,
    usd_arm: 70,
    usd_dual: 70,
    vendor: 'Hobby / Amazon',
    notes: 'Centered in base bay — tip ballast.',
  },
  {
    category: 'D · Power / compute / safety',
    part: '5V buck + powered USB hub',
    qty: 1,
    usd_base: 20,
    usd_arm: 20,
    usd_dual: 20,
    vendor: 'Amazon',
    notes: 'Logic / buses / cams.',
  },
  {
    category: 'D · Power / compute / safety',
    part: 'Laptop you own (or optional Pi 5)',
    qty: '0–1',
    usd_base: 0,
    usd_arm: 0,
    usd_dual: 0,
    vendor: '—',
    notes: 'Default: laptop you own.',
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
    notes: 'Cuts drive + arms. Sim Space = e-stop/reset.',
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
    notes: 'Label L/R buses.',
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
  { key: 'What', value: 'HouseHand — LeKiwi 3-omni base + printed torso + 2× SO-101 chore helper' },
  { key: 'Form', value: 'Printed HouseHand column on LeKiwi plates · shoulder deck · dual SO-101 · head cam' },
  { key: 'Height', value: '~LeKiwi stack + Ø180×320 mm torso + deck/neck/head (see /model)' },
  { key: 'Reach', value: 'SO-101 ~500 mm from pads at (−26, ±138) mm; floor / counter / open washer rim' },
  { key: 'Base', value: 'LeKiwi layer1+layer2 · 3× 4″ omni · 3× STS3215 drive · 6× M3 hex standoffs · no casters' },
  { key: 'Torso', value: 'Printed HouseHand Ø180 / flange Ø190 on layer2 (not a nested-tube kit)' },
  { key: 'Does', value: 'Pick clothes off floor → basket; nudge basket; drop into open washer if rim reachable; wipe tables; dish assist' },
  { key: 'Does NOT', value: 'Folding, detergent dosing, closed-door washer cycles, waterproofing, hot water, glass-safe grip' },
  { key: 'Drive', value: 'Holonomic 3-omni — W/S forward, A/D strafe, arrows/Z/X yaw' },
  { key: 'Arms', value: '2× SO-101 followers (STS3215×12); print print/SO101/ ×2' },
  { key: 'Cost (draft)', value: 'Dual DIY ~$495–695 (itemized mid ~ see /bom). Laptop you own = $0 compute.' },
  { key: 'Do not buy', value: 'RÅSKOG cart · 4× mecanum deck · nested column kit · ODrive/SteadyWin · Amazing Hand · leader SO-101 (unless teleop)' },
  { key: 'Status', value: 'Draft — not for sale. E-stop required. Print kit = print/README.md.' },
]
