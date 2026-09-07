/**
 * Pebble visual twin: printable base STLs + SO-101 follower GLB.
 *
 * Base: public/assets/base/*.stl (same files as print/base/) via STLLoader, mm→m ×0.001.
 * Arm: public/assets/so101/follower_idle.glb — baked from TheRobotStudio/SO-ARM100
 *      Simulation/SO101 URDF visual STLs (printable meshes) at idle pose.
 *
 * Frame: +Y up, +Z forward, +X left. Rubber tires / caster ball / CSI cam = bought.
 */
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import type { BufferGeometry } from 'three'
import type { Colourway } from '../product'
import { ARM, BASE, CAMERA, MAST, mmToM } from '../robot/dims'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

/** SO-101 follower baked from Simulation/SO101 URDF visuals (meters, Z-up) */
export const SO101_GLB = asset('assets/so101/follower_idle.glb')

const baseUrl = (file: string) => asset(`assets/base/${file}`)

/** Printable parts loaded for the chassis assembly (must exist under public/assets/base/). */
export const BASE_STL = {
  bottom: baseUrl('chassis_bottom_plate.stl'),
  top: baseUrl('chassis_top_plate.stl'),
  standoffs: baseUrl('standoffs_assembled.stl'),
  motorL: baseUrl('motor_pod_left.stl'),
  motorR: baseUrl('motor_pod_right.stl'),
  caster: baseUrl('caster_mount.stl'),
  mast: baseUrl('mast.stl'),
  shelf: baseUrl('camera_shelf.stl'),
  armPad: baseUrl('so101_mount_pad.stl'),
  hub: baseUrl('wheel_hub.stl'),
} as const

function StlPart({
  url,
  color,
  position,
  rotation,
  roughness = 0.5,
  metalness = 0.08,
}: {
  url: string
  color: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  roughness?: number
  metalness?: number
}) {
  const geom = useLoader(STLLoader, url) as BufferGeometry
  const geo = useMemo(() => {
    const g = geom.clone()
    g.computeVertexNormals()
    return g
  }, [geom])
  return (
    <mesh
      geometry={geo}
      scale={0.001}
      position={position ?? [0, 0, 0]}
      rotation={rotation ?? [0, 0, 0]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  )
}

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

/**
 * Printable wheeled chassis assembled from real STLs (print/base ≡ public/assets/base).
 * Bought rubber tires shown as dark cylinders (not printed).
 */
export function WheeledChassis({ colour }: { colour: Colourway }) {
  const h = mmToM(BASE.height_mm)
  const wheelR = mmToM(BASE.wheel_diameter_mm) * 0.5
  const wheelW = mmToM(BASE.wheel_width_mm)
  const track = mmToM(BASE.track_mm) * 0.5
  const mastH = mmToM(MAST.height_mm)
  const camW = mmToM(CAMERA.W)
  const camH = mmToM(CAMERA.H)
  const camD = mmToM(CAMERA.D)
  const casterR = mmToM(BASE.caster_diameter_mm) * 0.5
  const casterZ = -mmToM(BASE.diameter_mm) * 0.38

  return (
    <group>
      <StlPart url={BASE_STL.bottom} color={colour.primary} />
      <StlPart url={BASE_STL.top} color={colour.belly} />
      <StlPart url={BASE_STL.standoffs} color={colour.dark} roughness={0.45} metalness={0.15} />
      <StlPart url={BASE_STL.motorL} color={colour.primary} />
      <StlPart url={BASE_STL.motorR} color={colour.primary} />
      <StlPart url={BASE_STL.caster} color={colour.dark} />
      {/* Mast sits on top plate; STL local Y origin at mast base */}
      <StlPart url={BASE_STL.mast} color={colour.dark} position={[0, h, 0]} roughness={0.4} metalness={0.2} />
      <StlPart
        url={BASE_STL.shelf}
        color={colour.belly}
        position={[0, h + mastH, mmToM(6)]}
      />
      <StlPart url={BASE_STL.armPad} color={colour.accent} position={[0, h, 0]} />

      {/* Printed hubs + bought rubber tires */}
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * track, wheelR, 0]}>
          <StlPart
            url={BASE_STL.hub}
            color={colour.dark}
            position={[0, -wheelR * 0.15, 0]}
            rotation={[0, 0, Math.PI / 2]}
          />
          {/* Bought tire (not printed) — envelope only */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[wheelR, wheelR, wheelW, 20]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.85} metalness={0.05} />
          </mesh>
        </group>
      ))}

      {/* Bought caster ball */}
      <mesh position={[0, casterR, casterZ]} castShadow>
        <sphereGeometry args={[casterR, 12, 12]} />
        <meshStandardMaterial color={colour.dark} roughness={0.65} />
      </mesh>

      {/* Bought CSI/USB camera on shelf */}
      <group position={[0, h + mastH + mmToM(MAST.shelf_t_mm) + camH * 0.5, mmToM(10)]}>
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
  'Printable base STLs (print/base) + SO-101 GLB baked from TheRobotStudio/SO-ARM100 printable URDF meshes. Tires/caster/cam bought. Not Microduck.'
