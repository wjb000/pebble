/**
 * Tip / CG analysis — Critic P0-1.
 * Numbers are planning estimates (not FEA). Worst case: dual SO-101 at max AGL
 * with horizontal reach ≈ 0.40 m (usable fraction of 500 mm SO-101 reach).
 */
import { SCREW_ELEVATOR, SO101 } from './dims'

export const TIP = {
  /** Effective support width after bought outriggers (mm) — was track 160 */
  support_width_mm: 400,
  wheelbase_mm: 140,
  /** Dual arm + carriage mass at height (kg) */
  tip_mass_kg: 2.0,
  /** Horizontal CG offset of tip mass at worst reach (m) */
  worst_reach_m: 0.4,
  /** Height of tip mass CG ≈ max shoulder AGL (m) */
  tip_height_m: SCREW_ELEVATOR.max_agl_mm * 0.001,
  /** Low mass: base structure+wheels+compute+battery (kg), excl. ballast */
  low_mass_excl_ballast_kg: 0.9,
  /** Sized scrap-steel ballast in bay (kg) */
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
    'Margin ≥1.2 target with 400 mm outrigger stance + 4 kg bay ballast at arms max AGL + 0.40 m reach. Tip slowdown is UX only — physics uses wouldTip().',
}

/** ASCII diagram for docs */
export const TIP_DIAGRAM = `
         arms@950 AGL ──●── reach 0.40 m
                        │
                   tip M ≈ 7.85 N·m
                        │
         ┌──────────────┼──────────────┐  support 400 mm
         │   ballast 4 kg (low bay)    │  restore ≈ 9.6 N·m
         └──────────────┴──────────────┘  margin ≈ 1.22×
              track/outriggers
`
