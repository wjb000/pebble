/** Runtime quality tier for mobile vs desktop twin rendering. */

export type PerfTier = {
  mobile: boolean
  dpr: [number, number]
  antialias: boolean
  shadows: boolean
  shadowMapSize: number
  contactShadows: boolean
  /** Skip heavy decorative / duplicate STLs in URDFs. */
  leanMeshes: boolean
}

let cached: PerfTier | null = null

export function getPerfTier(): PerfTier {
  if (cached) return cached
  const mobile =
    typeof navigator !== 'undefined' &&
    (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches) ||
      (typeof navigator !== 'undefined' && (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency !== undefined &&
        (navigator.hardwareConcurrency ?? 8) <= 4))

  cached = mobile
    ? {
        mobile: true,
        dpr: [1, 1],
        antialias: false,
        shadows: false,
        shadowMapSize: 512,
        contactShadows: false,
        leanMeshes: true,
      }
    : {
        mobile: false,
        dpr: [1, 1.5],
        antialias: true,
        shadows: true,
        shadowMapSize: 1024,
        contactShadows: true,
        leanMeshes: false,
      }
  return cached
}
