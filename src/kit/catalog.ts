/** Single twin: XLeRobot — RÅSKOG cart base + dual SO-101 + OG head. */

export type BaseId = 'lekiwi'
export type ArmsId = 'xlerobot'
export type HeadId = 'xlerobot'
export type PresetId = 'xlerobot'

export type KitBuild = {
  preset: PresetId
  base: BaseId
  arms: ArmsId
  head: HeadId
}

export const DEFAULT_KIT: KitBuild = {
  preset: 'xlerobot',
  base: 'lekiwi',
  arms: 'xlerobot',
  head: 'xlerobot',
}

export function kitCaption(_kit?: KitBuild) {
  return 'XLeRobot · wheeled base · dual SO-101 · OG head'
}

export function kitLookHeightM(_kit?: KitBuild) {
  return 0.32
}
