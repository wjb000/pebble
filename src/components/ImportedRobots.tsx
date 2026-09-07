/**
 * Pebble visual twin — composed from real OSS meshes (no generated bodies).
 *
 * Base:   public/assets/base/*  ← PedroS235/perceptron_bot (MIT)
 * Lift:   public/assets/lift/*  ← Prusa i3 Z + x-end carriage (GPL-2.0) + SO 4040 mount
 * Head:   public/assets/head/*  ← SO-ARM100 Overhead Cam (Apache-2.0)
 * Arms:   public/assets/so101/follower_idle.glb
 *
 * Frame: +Y up, +Z forward, +X left. Perceptron CAD is Z-up → rotX(-π/2).
 */
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import type { BufferGeometry } from 'three'
import type { Colourway } from '../product'
import {
  ARM,
  BASE,
  EXTRUSION,
  HEAD,
  OVERALL_HEIGHT_MM,
  SCREW_ELEVATOR,
  mmToM,
} from '../robot/dims'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export const SO101_GLB = asset('assets/so101/follower_idle.glb')

const baseUrl = (file: string) => asset(`assets/base/${file}`)
const liftUrl = (file: string) => asset(`assets/lift/${file}`)
const headUrl = (file: string) => asset(`assets/head/${file}`)

export const BASE_STL = {
  lower: baseUrl('lower_plate.stl'),
  middle: baseUrl('middle_plate_raspberry.stl'),
  top: baseUrl('top_plate.stl'),
  frontLower: baseUrl('front_lower_wall.stl'),
  frontUpper: baseUrl('front_upper_wall.stl'),
  backLower: baseUrl('back_lower_wall.stl'),
  backUpper: baseUrl('back_upper_wall.stl'),
  wheelFrame: baseUrl('wheel_frame.stl'),
  wheelLeft: baseUrl('wheel_left.stl'),
  wheelRight: baseUrl('wheel_right.stl'),
} as const

export const LIFT_STL = {
  zBottom: liftUrl('z-axis-bottom.stl'),
  zTop: liftUrl('z-axis-top.stl'),
  zCover: liftUrl('z-screw-cover.stl'),
  carriage: liftUrl('carriage_x-end-motor.stl'),
  mount4040: liftUrl('4040_base_mount.stl'),
} as const

export const HEAD_STL = {
  bottom: headUrl('cam_mount_bottom.stl'),
  middle: headUrl('cam_mount_middle.stl'),
  top: headUrl('cam_mount_top.stl'),
} as const

/** Perceptron CAD Z-up → Three Y-up */
const CAD_Z_UP: [number, number, number] = [-Math.PI / 2, 0, 0]

function StlPart({
  url,
  color,
  position,
  rotation,
  scale,
  roughness = 0.55,
  metalness = 0.06,
  opacity = 1,
}: {
  url: string
  color: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number] | number
  roughness?: number
  metalness?: number
  opacity?: number
}) {
  const geom = useLoader(STLLoader, url) as BufferGeometry
  const geo = useMemo(() => {
    const g = geom.clone()
    g.computeVertexNormals()
    return g
  }, [geom])
  const s =
    typeof scale === 'number'
      ? ([scale, scale, scale] as [number, number, number])
      : scale
  const transparent = opacity < 1
  return (
    <mesh
      geometry={geo}
      scale={s ? ([s[0] * 0.001, s[1] * 0.001, s[2] * 0.001] as [number, number, number]) : 0.001}
      position={position ?? [0, 0, 0]}
      rotation={rotation ?? [0, 0, 0]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        transparent={transparent}
        opacity={opacity}
      />
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
          mesh.material.roughness = 0.42
          mesh.material.metalness = 0.18
        }
      }
    })
    return c
  }, [scene, color])
  return <primitive object={cloned} />
}

useGLTF.preload(SO101_GLB)

const CAMERA_W = 18
const CAMERA_H = 14
const CAMERA_D = 12

/**
 * Perceptron wheeled chassis + bought extrusion column + Prusa Z hardware + head cam.
 * Carriage + arms animate with elevator AGL.
 */
export function WheeledChassis({
  colour,
  carriageAglMm,
}: {
  colour: Colourway
  carriageAglMm: number
}) {
  const baseH = mmToM(BASE.height_mm)
  const extLen = mmToM(EXTRUSION.length_mm)
  const extW = mmToM(EXTRUSION.width_mm)
  const extD = mmToM(EXTRUSION.depth_mm)
  const wheelR = mmToM(BASE.wheel_diameter_mm) * 0.5
  const wheelW = mmToM(BASE.wheel_width_mm)
  const track = mmToM(BASE.track_mm) * 0.5
  const screwR = mmToM(SCREW_ELEVATOR.screw_od_mm) * 0.5
  const carriageY = mmToM(carriageAglMm)
  const shoulderX = mmToM(ARM.mount_x_mm)
  const columnTopY = baseH + extLen
  const headY = columnTopY + mmToM(HEAD.neck_h_mm)

  return (
    <group>
      {/* —— Perceptron chassis (CAD Z-up) —— */}
      <group rotation={CAD_Z_UP}>
        <StlPart url={BASE_STL.lower} color={colour.dark} roughness={0.65} />
        <StlPart url={BASE_STL.middle} color={colour.belly} roughness={0.55} />
        <StlPart url={BASE_STL.top} color={colour.primary} roughness={0.58} />
        <StlPart url={BASE_STL.frontLower} color={colour.primary} roughness={0.6} />
        <StlPart url={BASE_STL.frontUpper} color={colour.primary} roughness={0.6} />
        <StlPart url={BASE_STL.backLower} color={colour.accent} roughness={0.6} />
        <StlPart url={BASE_STL.backUpper} color={colour.accent} roughness={0.6} />
        {/* Upstream caster assembly at rear */}
        <group position={[0, -70, 5]}>
          <StlPart url={BASE_STL.wheelFrame} color={colour.dark} roughness={0.5} />
          <StlPart url={BASE_STL.wheelLeft} color="#1a1a1a" roughness={0.85} />
          <StlPart url={BASE_STL.wheelRight} color="#1a1a1a" roughness={0.85} />
        </group>
      </group>

      {/* Bought drive tires (envelope) — hubs not in perceptron mesh set */}
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * track, wheelR, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[wheelR, wheelR, wheelW, 20]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.88} metalness={0.04} />
          </mesh>
        </group>
      ))}

      {/* Bought 2040 extrusion column (envelope) — extends to ~5′8″ */}
      <mesh
        position={[0, baseH + extLen * 0.5, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[extW, extLen, extD]} />
        <meshStandardMaterial color="#8b939e" roughness={0.4} metalness={0.45} />
      </mesh>

      {/* Bought lead screw parallel to extrusion */}
      <mesh position={[mmToM(22), baseH + extLen * 0.5, 0]} castShadow>
        <cylinderGeometry args={[screwR, screwR, extLen * 0.98, 14]} />
        <meshStandardMaterial color="#c0c6ce" roughness={0.25} metalness={0.75} />
      </mesh>

      {/* Prusa z-axis-bottom — motor mount at column base */}
      <StlPart
        url={LIFT_STL.zBottom}
        color={colour.dark}
        position={[mmToM(-10), baseH + mmToM(5), mmToM(-20)]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        roughness={0.45}
        metalness={0.12}
      />

      {/* Prusa z-axis-top at column top */}
      <StlPart
        url={LIFT_STL.zTop}
        color={colour.accent}
        position={[mmToM(-5), columnTopY - mmToM(10), mmToM(-15)]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        roughness={0.48}
      />

      <StlPart
        url={LIFT_STL.zCover}
        color={colour.dark}
        position={[mmToM(22), columnTopY + mmToM(5), 0]}
        roughness={0.5}
      />

      {/* Lead-screw nut carriage (Prusa x-end-motor) at current AGL */}
      <group position={[0, carriageY, 0]}>
        <StlPart
          url={LIFT_STL.carriage}
          color={colour.accent}
          position={[mmToM(-5), 0, mmToM(-10)]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          roughness={0.42}
          metalness={0.12}
        />
        {/* L/R SO-ARM 4040 mounts on carriage */}
        <StlPart
          url={LIFT_STL.mount4040}
          color={colour.dark}
          position={[shoulderX, mmToM(-20), mmToM(ARM.mount_z_mm)]}
          rotation={[0, Math.PI / 2, 0]}
          roughness={0.45}
        />
        <StlPart
          url={LIFT_STL.mount4040}
          color={colour.dark}
          position={[-shoulderX, mmToM(-20), mmToM(ARM.mount_z_mm)]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[-1, 1, 1]}
          roughness={0.45}
        />
      </group>

      {/* SO-ARM overhead cam mount at column top */}
      <group position={[0, headY, mmToM(10)]} rotation={[0, 0, 0]}>
        <StlPart
          url={HEAD_STL.bottom}
          color={colour.dark}
          position={[mmToM(-18), 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          scale={0.35}
          roughness={0.4}
          metalness={0.15}
        />
        <StlPart
          url={HEAD_STL.middle}
          color={colour.dark}
          position={[0, mmToM(40), mmToM(30)]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.35}
          roughness={0.4}
        />
        <StlPart
          url={HEAD_STL.top}
          color={colour.accent}
          position={[0, mmToM(55), mmToM(55)]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.3}
          roughness={0.38}
        />
        <mesh position={[0, mmToM(50), mmToM(70)]} castShadow>
          <boxGeometry args={[mmToM(CAMERA_W), mmToM(CAMERA_H), mmToM(CAMERA_D)]} />
          <meshStandardMaterial color={colour.face} roughness={0.35} metalness={0.25} />
        </mesh>
        <mesh position={[0, mmToM(50), mmToM(78)]}>
          <circleGeometry args={[mmToM(4), 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.35} />
        </mesh>
      </group>
    </group>
  )
}


/**
 * One SO-101 follower on the screw carriage at current AGL.
 * L = +X, R = −X.
 */
export function SO101FollowerArm({
  colour,
  side = 'R',
  carriageAglMm,
}: {
  colour: Colourway
  side?: 'L' | 'R'
  carriageAglMm: number
}) {
  const left = side === 'L'
  const shoulderX = mmToM(left ? ARM.mount_x_mm : -ARM.mount_x_mm)
  const shoulderY = mmToM(carriageAglMm)
  const shoulderZ = mmToM(ARM.mount_z_mm)

  return (
    <group position={[shoulderX, shoulderY, shoulderZ]}>
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
  `OSS compose: perceptron_bot base (MIT) + Prusa Z/x-end carriage (GPL-2.0) + SO-ARM100 cam/4040/SO-101 (Apache-2.0). ` +
  `Overall ${OVERALL_HEIGHT_MM} mm via bought 2040 extrusion. Q/E lead-screw elevator. Not Microduck.`
