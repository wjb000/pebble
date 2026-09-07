/**
 * Pebble visual twin: procedural wheeled chassis (honest placeholder) + SO-101 GLB.
 * Microduck biped mesh is NOT the product visual anymore (asset may remain on disk).
 *
 * Frame convention (Pebble / Three.js body):
 *   +Y up, +Z forward, +X left (robotics FLU after Z-up→Y-up + yaw).
 * SO-101 URDF/GLB is meters, Z-up, reach along +X.
 */
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import type { Colourway } from '../product'
import { ARM, BASE, CAMERA, MAST, mmToM } from '../robot/dims'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

/** SO-101 follower baked from Simulation/SO101 URDF visuals (meters, Z-up) */
export const SO101_GLB = asset('assets/so101/follower_idle.glb')

function SO101Glb({ color }: { color: string }) {
  const { scene } = useGLTF(SO101_GLB)
  const cloned = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((obj) => {
      const mesh = obj as any
      if (mesh.isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.material = mesh.material?.clone?.() ?? mesh.material
        if (mesh.material) {
          mesh.material.color?.set?.(color)
          mesh.material.roughness = 0.4
          mesh.material.metalness = 0.22
        }
      }
    })
    return c
  }, [scene, color])
  return <primitive object={cloned} />
}

useGLTF.preload(SO101_GLB)

/** Low round-ish differential-drive chassis + mast eye (procedural placeholder). */
export function WheeledChassis({ colour }: { colour: Colourway }) {
  const r = mmToM(BASE.diameter_mm) * 0.5
  const h = mmToM(BASE.height_mm)
  const wheelR = mmToM(BASE.wheel_diameter_mm) * 0.5
  const wheelW = mmToM(BASE.wheel_width_mm)
  const track = mmToM(BASE.track_mm) * 0.5
  const mastH = mmToM(MAST.height_mm)
  const mastR = mmToM(MAST.diameter_mm) * 0.5
  const camW = mmToM(CAMERA.W)
  const camH = mmToM(CAMERA.H)
  const camD = mmToM(CAMERA.D)

  return (
    <group>
      {/* Shell — flat cylinder (honest placeholder chassis) */}
      <mesh position={[0, h * 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[r, r * 0.98, h, 32]} />
        <meshStandardMaterial color={colour.primary} roughness={0.5} metalness={0.08} />
      </mesh>
      {/* Top lid slightly inset */}
      <mesh position={[0, h + 0.002, 0]} receiveShadow>
        <cylinderGeometry args={[r * 0.92, r * 0.92, 0.006, 32]} />
        <meshStandardMaterial color={colour.belly} roughness={0.55} metalness={0.05} />
      </mesh>
      {/* Drive wheels */}
      {([-1, 1] as const).map((side) => (
        <mesh
          key={side}
          position={[side * track, wheelR, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[wheelR, wheelR, wheelW, 20]} />
          <meshStandardMaterial color={colour.dark} roughness={0.7} metalness={0.15} />
        </mesh>
      ))}
      {/* Front caster */}
      <mesh position={[0, mmToM(BASE.caster_diameter_mm) * 0.5, r * 0.55]} castShadow>
        <sphereGeometry args={[mmToM(BASE.caster_diameter_mm) * 0.5, 12, 12]} />
        <meshStandardMaterial color={colour.dark} roughness={0.65} />
      </mesh>
      {/* Mast */}
      <mesh position={[0, h + mastH * 0.5, mmToM(MAST.offset_forward_mm)]} castShadow>
        <cylinderGeometry args={[mastR, mastR * 1.1, mastH, 12]} />
        <meshStandardMaterial color={colour.dark} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Camera eye */}
      <group position={[0, h + mastH + camH * 0.5, mastR + camD * 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[camW, camH, camD]} />
          <meshStandardMaterial color={colour.face} roughness={0.35} metalness={0.25} />
        </mesh>
        <mesh position={[0, 0, camD * 0.55]}>
          <circleGeometry args={[camH * 0.28, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.35} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * One SO-101 follower arm from URDF-baked GLB (meters, Z-up, reach +X).
 * Mounted on wheeled base right/front (+X is left → mount_x negative = right).
 */
export function SO101FollowerArm({
  colour,
  side = 'R',
}: {
  colour: Colourway
  side?: 'L' | 'R'
}) {
  const left = side === 'L'
  const shoulderX = mmToM(left ? -ARM.mount_x_mm : ARM.mount_x_mm)
  const shoulderY = mmToM(ARM.mount_y_mm)
  const shoulderZ = mmToM(ARM.mount_z_mm)

  return (
    <group position={[shoulderX, shoulderY, shoulderZ]}>
      {/* Z-up→Y-up, then yaw so URDF +X reach → body +Z forward */}
      <group rotation={[0, -Math.PI / 2, 0]}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <SO101Glb color={colour.dark} />
        </group>
      </group>
    </group>
  )
}

export const MESH_ATTRIBUTION =
  'Placeholder wheeled chassis (procedural) + SO-101 GLB (TheRobotStudio/SO-ARM100). Not Microduck product visual.'
