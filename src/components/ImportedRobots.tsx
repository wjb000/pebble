/**
 * Pebble visual twin: printable base/torso/head STLs + 2× SO-101 follower GLB.
 *
 * Base/torso/head: public/assets/base/*.stl (same as print/base/) via STLLoader, mm→m ×0.001.
 * Arms: public/assets/so101/follower_idle.glb — baked from TheRobotStudio/SO-ARM100
 *      Simulation/SO101 URDF visual STLs (printable meshes) at idle pose; remounted to hang −Y.
 *
 * Frame: +Y up, +Z forward, +X left. Rubber tires / caster ball / CSI cam / face screen = bought.
 */
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import type { BufferGeometry } from 'three'
import type { Colourway } from '../product'
import { ARM, BASE, CAMERA, HEAD, TORSO, mmToM } from '../robot/dims'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

/** SO-101 follower baked from Simulation/SO101 URDF visuals (meters, Z-up) */
export const SO101_GLB = asset('assets/so101/follower_idle.glb')

const baseUrl = (file: string) => asset(`assets/base/${file}`)

/** Printable parts loaded for the chassis + humanoid upper body. */
export const BASE_STL = {
  bottom: baseUrl('chassis_bottom_plate.stl'),
  top: baseUrl('chassis_top_plate.stl'),
  standoffs: baseUrl('standoffs_assembled.stl'),
  motorL: baseUrl('motor_pod_left.stl'),
  motorR: baseUrl('motor_pod_right.stl'),
  caster: baseUrl('caster_mount.stl'),
  hub: baseUrl('wheel_hub.stl'),
  torso: baseUrl('torso_column.stl'),
  shoulderL: baseUrl('shoulder_pod_left.stl'),
  shoulderR: baseUrl('shoulder_pod_right.stl'),
  neck: baseUrl('head_neck.stl'),
  bezel: baseUrl('head_bezel.stl'),
  screenBack: baseUrl('screen_backplate.stl'),
  camMount: baseUrl('camera_mount.stl'),
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
 * Printable wheeled chassis + torso column + head (bezel / screen / cam).
 * Bought rubber tires + face display panel shown as envelopes (not printed).
 */
export function WheeledChassis({ colour }: { colour: Colourway }) {
  const h = mmToM(BASE.height_mm)
  const wheelR = mmToM(BASE.wheel_diameter_mm) * 0.5
  const wheelW = mmToM(BASE.wheel_width_mm)
  const track = mmToM(BASE.track_mm) * 0.5
  const torsoH = mmToM(TORSO.height_mm)
  const neckH = mmToM(HEAD.neck_h_mm)
  const bezelH = mmToM(HEAD.bezel_h_mm)
  const camW = mmToM(CAMERA.W)
  const camH = mmToM(CAMERA.H)
  const camD = mmToM(CAMERA.D)
  const casterR = mmToM(BASE.caster_diameter_mm) * 0.5
  const casterZ = -mmToM(BASE.diameter_mm) * 0.38
  const shoulderY = h + torsoH
  const shoulderX = mmToM(ARM.mount_x_mm)
  const headCenterY = shoulderY + neckH + bezelH * 0.5
  const foreheadY = shoulderY + neckH + bezelH + mmToM(HEAD.cam_rise_mm) * 0.35

  return (
    <group>
      <StlPart url={BASE_STL.bottom} color={colour.primary} />
      <StlPart url={BASE_STL.top} color={colour.belly} />
      <StlPart url={BASE_STL.standoffs} color={colour.dark} roughness={0.45} metalness={0.15} />
      <StlPart url={BASE_STL.motorL} color={colour.primary} />
      <StlPart url={BASE_STL.motorR} color={colour.primary} />
      <StlPart url={BASE_STL.caster} color={colour.dark} />

      {/* Torso column sits on top plate; STL local Y origin at column base */}
      <StlPart url={BASE_STL.torso} color={colour.primary} position={[0, h, 0]} />

      {/* Shoulder pods at shoulder line */}
      <StlPart
        url={BASE_STL.shoulderL}
        color={colour.accent}
        position={[shoulderX, shoulderY, 0]}
      />
      <StlPart
        url={BASE_STL.shoulderR}
        color={colour.accent}
        position={[-shoulderX, shoulderY, 0]}
      />

      {/* Neck + head bezel + screen backplate */}
      <StlPart url={BASE_STL.neck} color={colour.dark} position={[0, shoulderY, 0]} />
      <StlPart
        url={BASE_STL.screenBack}
        color={colour.dark}
        position={[0, headCenterY, -mmToM(4)]}
      />
      <StlPart
        url={BASE_STL.bezel}
        color={colour.belly}
        position={[0, headCenterY, mmToM(2)]}
      />

      {/* Bought face screen (dark quad — not printed) */}
      <mesh position={[0, headCenterY, mmToM(HEAD.bezel_t_mm) * 0.55 + mmToM(3)]} castShadow>
        <boxGeometry args={[mmToM(HEAD.screen_w_mm), mmToM(HEAD.screen_h_mm), mmToM(2)]} />
        <meshStandardMaterial color={colour.face} roughness={0.25} metalness={0.35} />
      </mesh>

      {/* Forehead camera mount + bought CSI cam */}
      <StlPart
        url={BASE_STL.camMount}
        color={colour.dark}
        position={[0, foreheadY, mmToM(8)]}
      />
      <group position={[0, foreheadY + mmToM(8), mmToM(14)]}>
        <mesh castShadow>
          <boxGeometry args={[camW, camH, camD]} />
          <meshStandardMaterial color={colour.face} roughness={0.35} metalness={0.25} />
        </mesh>
        <mesh position={[0, 0, camD * 0.55]}>
          <circleGeometry args={[camH * 0.28, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.35} />
        </mesh>
      </group>

      {/* Printed hubs + bought rubber tires */}
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * track, wheelR, 0]}>
          <StlPart
            url={BASE_STL.hub}
            color={colour.dark}
            position={[0, -wheelR * 0.15, 0]}
            rotation={[0, 0, Math.PI / 2]}
          />
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
    </group>
  )
}

/**
 * One SO-101 follower arm from URDF-baked GLB (meters, Z-up).
 * Remounted so idle hang is downward along −Y (grippers toward floor), bases at shoulders.
 * L = +X (left flank), R = −X (right flank).
 */
export function SO101FollowerArm({
  colour,
  side = 'R',
}: {
  colour: Colourway
  side?: 'L' | 'R'
}) {
  const left = side === 'L'
  const shoulderX = mmToM(left ? ARM.mount_x_mm : -ARM.mount_x_mm)
  const shoulderY = mmToM(ARM.mount_y_mm)
  const shoulderZ = mmToM(ARM.mount_z_mm)

  return (
    <group position={[shoulderX, shoulderY, shoulderZ]}>
      {/*
        Nested remount:
        1) Z-up → Y-up
        2) Yaw so URDF +X reach was body-forward (+Z) in prior single-arm layout
        3) Pitch +π/2 so that forward reach tips down to −Y (gravity hang)
        4) Left side yaw π so elbow/geometry mirrors on the left flank
      */}
      <group rotation={[Math.PI / 2, left ? Math.PI : 0, 0]}>
        <group rotation={[0, -Math.PI / 2, 0]}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <SO101Glb color={colour.dark} />
          </group>
        </group>
      </group>
    </group>
  )
}

export const MESH_ATTRIBUTION =
  'Printable base/torso/head STLs (print/base) + 2× SO-101 GLB baked from TheRobotStudio/SO-ARM100 printable URDF meshes. Tires/caster/cam/screen bought. Not Microduck.'
