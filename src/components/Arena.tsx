import { useMemo } from 'react'
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'
import { ARENA_HALF } from '../sim/types'
import { getPerfTier } from '../kit/perf'

const SIZE = ARENA_HALF * 2 + 4

function makeTileTexture(cells = 24) {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const tile = size / cells

  // Soft cool slate base — brighter than pure black, still easy on eyes.
  ctx.fillStyle = '#2a303a'
  ctx.fillRect(0, 0, size, size)

  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const px = x * tile
      const py = y * tile
      const checker = (x + y) % 2 === 0
      ctx.fillStyle = checker ? '#313844' : '#2c333e'
      ctx.fillRect(px + 1, py + 1, tile - 2, tile - 2)

      // Subtle inner highlight so tiles read without glare.
      const g = ctx.createLinearGradient(px, py, px + tile, py + tile)
      g.addColorStop(0, 'rgba(255,255,255,0.04)')
      g.addColorStop(1, 'rgba(0,0,0,0.06)')
      ctx.fillStyle = g
      ctx.fillRect(px + 2, py + 2, tile - 4, tile - 4)
    }
  }

  // Soft grout grid
  ctx.strokeStyle = 'rgba(18, 22, 28, 0.55)'
  ctx.lineWidth = 1.25
  for (let i = 0; i <= cells; i++) {
    const p = i * tile
    ctx.beginPath()
    ctx.moveTo(p, 0)
    ctx.lineTo(p, size)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, p)
    ctx.lineTo(size, p)
    ctx.stroke()
  }

  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  tex.wrapS = RepeatWrapping
  tex.wrapT = RepeatWrapping
  tex.anisotropy = 4
  tex.needsUpdate = true
  return tex
}

/** Soft tiled floor — cooler look, light on the eyes. */
export function Arena() {
  const perf = useMemo(() => getPerfTier(), [])
  const map = useMemo(() => makeTileTexture(perf.mobile ? 16 : 24), [perf.mobile])
  const repeats = perf.mobile ? 6 : 8
  map.repeat.set(repeats, repeats)

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow={perf.shadows}>
        <planeGeometry args={[SIZE, SIZE]} />
        <meshStandardMaterial
          map={map}
          color="#d8dde6"
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>
      {/* Soft horizon wash so the void isn’t harsh black */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
        <planeGeometry args={[SIZE * 1.6, SIZE * 1.6]} />
        <meshBasicMaterial color="#1a1e26" toneMapped={false} />
      </mesh>
    </group>
  )
}
