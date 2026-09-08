/** Single twin: humanoid droid — LeKiwi omni + XLe torso/neck + 2× SO-101. */

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
  return 'LeKiwi base · torso · XLe shoulders · 2× SO-101 · neck'
}

export function kitLookHeightM(_kit?: KitBuild) {
  return 0.48
}
