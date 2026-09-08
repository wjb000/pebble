/**
 * Tip / CG analysis — HouseHand v3 omni deck.
 * Numbers are planning estimates (not FEA). Worst case: dual SO-101 at max AGL
 * with horizontal reach ≈ 0.40 m (usable fraction of 500 mm SO-101 reach).
 * Support polygon = 400×450 mm mecanum deck (no outriggers).
 */
import { BASE, SO101, TELESCOPE } from './dims'

export const TIP = {
  /** Deck width — mecanum contact patch ≈ track */
  support_width_mm: BASE.width_mm,
  wheelbase_mm: BASE.wheelbase_mm,
  /** Dual arm + shoulder mass at height (kg) */
  tip_mass_kg: 2.0,
  /** Horizontal CG offset of tip mass at worst reach (m) */
  worst_reach_m: 0.4,
  /** Height of tip mass CG ≈ max shoulder AGL (m) */
  tip_height_m: TELESCOPE.max_agl_mm * 0.001,
  /** Low mass: deck + wheels + motors + column + compute (kg), excl. battery */
  low_mass_excl_ballast_kg: 6.0,
  /** 12V pack + BMS centered in base (kg) — the low-bay mass */
  ballast_kg: 4.0,
  g: 9.81,
  so101_reach_mm: SO101.reach_mm,
} as const

export function tipMoment_Nm(reach_m: number = TIP.worst_reach_m): number {
  return TIP.tip_mass_kg * TIP.g * reach_m
}

export function restoringMoment_Nm(): number {
  const half = (TIP.support_width_mm * 0.001) / 2
  const mLow = TIP.low_mass_excl_ballast_kg + TIP.ballast_kg
  return mLow * TIP.g * half
}

export function tipMargin(reach_m: number = TIP.worst_reach_m): number {
  const tip = tipMoment_Nm(reach_m)
  return tip > 0 ? restoringMoment_Nm() / tip : Infinity
}

/** True when static tip moment exceeds restoring (would tip if held). */
export function wouldTip(reach_m: number): boolean {
  return tipMargin(reach_m) < 1.0
}

export const TIP_SUMMARY = {
  support_width_mm: TIP.support_width_mm,
  wheelbase_mm: TIP.wheelbase_mm,
  ballast_kg: TIP.ballast_kg,
  tip_moment_Nm: Math.round(tipMoment_Nm() * 100) / 100,
  restoring_moment_Nm: Math.round(restoringMoment_Nm() * 100) / 100,
  margin: Math.round(tipMargin() * 100) / 100,
  note:
    'Margin ≥1.2 with 400 mm omni-deck stance + 4 kg 12V pack at arms max AGL + 0.40 m reach. No outriggers. Tip slowdown is UX only — physics uses wouldTip().',
}

/** ASCII diagram for docs */
export const TIP_DIAGRAM = `
         arms@1022 AGL ─●── reach 0.40 m
                        │
                   tip M ≈ 7.85 N·m
                        │
         ┌──────────────┼──────────────┐  deck 400×450 mm
         │  12V pack 4 kg (center bay) │  restore ≈ 19.6 N·m
         └──────────────┴──────────────┘  margin ≈ 2.5×
              4× mecanum  (no casters)
`
