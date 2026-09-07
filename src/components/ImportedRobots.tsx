/**
 * Pebble visual twin — composed from real OSS meshes (no generated bodies).
 *
 * Base:   public/assets/base/*  ← PedroS235/perceptron_bot (MIT)
 * Lift:   public/assets/lift/*  ← Prusa i3 Z + x-end carriage (GPL-2.0) + SO 4040 mount
 * Head:   public/assets/head/*  ← SO-ARM100 Overhead Cam (Apache-2.0) — 1:1 scale
 * Arms:   public/assets/so101/follower_idle.glb
 *
 * Frame: +Y up, +Z forward, +X left. Perceptron CAD is Z-up → rotX(-π/2).
 * Bought envelopes: 2040 extrusion box + T8 lead-screw cylinder (captioned in Model tab).
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
  CAMERA,
  EXTRUSION,
  HEAD,
  OVERALL_HEIGHT_MM,
  SCREW_AXIS_X_MM,
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

/** PLA print look */
const PLA_ROUGH = 0.62
const PLA_METAL = 0.04

function StlPart({
  url,
  color,
  position,
  rotation,
  scale,
  roughness = PLA_ROUGH,
  metalness = PLA_METAL,
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
          mesh.material.roughness = 0.45
          mesh.material.metalness = 0.12
        }
      }
    })
    return c
  }, [scene, color])
  return <primitive object={cloned} />
}

useGLTF.preload(SO101_GLB)

/**
 * Perceptron wheeled chassis + bought extrusion column + coax lead-screw stack +
 * Prusa Z hardware + 1:1 head cam. Carriage + 4040 mounts animate with elevator AGL.
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
  const screwX = mmToM(SCREW_AXIS_X_MM)
  const carriageY = mmToM(carriageAglMm)
  const shoulderX = mmToM(ARM.mount_x_mm)
  const columnTopY = baseH + extLen
  const headY = columnTopY + mmToM(HEAD.neck_h_mm)
  // Seat chassis so axle ≈ wheel radius (lower plate near axle height)
  const chassisLift = wheelR - mmToM(4)

  return (
    <group>
      {/* —— Perceptron chassis (CAD Z-up), seated on axle height —— */}
      <group position={[0, chassisLift, 0]}>
        <group rotation={CAD_Z_UP}>
          <StlPart url={BASE_STL.lower} color={colour.dark} roughness={0.68} />
          <StlPart url={BASE_STL.middle} color={colour.belly} roughness={0.58} />
          <StlPart url={BASE_STL.top} color={colour.primary} roughness={0.6} />
          <StlPart url={BASE_STL.frontLower} color={colour.primary} roughness={0.62} />
          <StlPart url={BASE_STL.frontUpper} color={colour.primary} roughness={0.62} />
          <StlPart url={BASE_STL.backLower} color={colour.accent} roughness={0.62} />
          <StlPart url={BASE_STL.backUpper} color={colour.accent} roughness={0.62} />
          {/* Caster at rear — positions in metres (mmToM), local CAD frame */}
          <group position={[0, mmToM(-70), mmToM(5)]}>
            <StlPart url={BASE_STL.wheelFrame} color={colour.dark} roughness={0.55} />
            <StlPart url={BASE_STL.wheelLeft} color="#1a1a1a" roughness={0.9} metalness={0.02} />
            <StlPart url={BASE_STL.wheelRight} color="#1a1a1a" roughness={0.9} metalness={0.02} />
          </group>
        </group>
      </group>

      {/* Bought drive tires (envelope) — dark rubber */}
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * track, wheelR, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[wheelR, wheelR, wheelW, 20]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.92} metalness={0.03} />
          </mesh>
        </group>
      ))}

      {/* Bought 2040 extrusion column (stock envelope) — metal-ish */}
      <mesh position={[0, baseH + extLen * 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[extW, extLen, extD]} />
        <meshStandardMaterial color="#8b939e" roughness={0.38} metalness={0.55} />
      </mesh>

      {/* Bought T8 lead screw — coax with SCREW_AXIS_X_MM */}
      <mesh position={[screwX, baseH + extLen * 0.5, 0]} castShadow>
        <cylinderGeometry args={[screwR, screwR, extLen * 0.98, 16]} />
        <meshStandardMaterial color="#c8ced6" roughness={0.22} metalness={0.82} />
      </mesh>

      {/* Prusa z-axis-bottom — motor mount at column base, coax on screw axis */}
      <StlPart
        url={LIFT_STL.zBottom}
        color={colour.dark}
        position={[screwX - mmToM(25), baseH + mmToM(8), mmToM(-8)]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        roughness={0.5}
        metalness={0.08}
      />

      {/* Prusa z-axis-top at column top, coax */}
      <StlPart
        url={LIFT_STL.zTop}
        color={colour.accent}
        position={[screwX - mmToM(19), columnTopY - mmToM(12), mmToM(-6)]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        roughness={0.52}
      />

      <StlPart
        url={LIFT_STL.zCover}
        color={colour.dark}
        position={[screwX, columnTopY + mmToM(4), 0]}
        roughness={0.55}
      />

      {/* Lead-screw nut carriage (Prusa x-end-motor) at current AGL — coax */}
      <group position={[screwX, carriageY, 0]}>
        <StlPart
          url={LIFT_STL.carriage}
          color={colour.accent}
          position={[mmToM(-8), 0, mmToM(-6)]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          roughness={0.48}
          metalness={0.1}
        />
        {/* L/R SO-ARM 4040 mounts on carriage — native mesh offset ~112 mm on X */}
        <StlPart
          url={LIFT_STL.mount4040}
          color={colour.dark}
          position={[shoulderX - screwX - mmToM(112), mmToM(-8), mmToM(ARM.mount_z_mm)]}
          rotation={[0, Math.PI / 2, 0]}
          roughness={0.5}
        />
        <StlPart
          url={LIFT_STL.mount4040}
          color={colour.dark}
          position={[-(shoulderX - screwX) + mmToM(112), mmToM(-8), mmToM(ARM.mount_z_mm)]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[-1, 1, 1]}
          roughness={0.5}
        />
        {/* Poka-yoke L/R colour ticks — keyed visual so arms can't swap silently */}
        <mesh position={[shoulderX - screwX, mmToM(12), mmToM(ARM.mount_z_mm + 8)]}>
          <boxGeometry args={[mmToM(18), mmToM(6), mmToM(6)]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.4} />
        </mesh>
        <mesh position={[-(shoulderX - screwX), mmToM(12), mmToM(ARM.mount_z_mm + 8)]}>
          <boxGeometry args={[mmToM(18), mmToM(6), mmToM(6)]} />
          <meshStandardMaterial color="#f97316" roughness={0.4} />
        </mesh>
      </group>

      {/* SO-ARM overhead cam — TRUE 1:1 scale; boom forward (+Z) */}
      <group position={[0, headY, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <StlPart url={HEAD_STL.bottom} color={colour.dark} roughness={0.48} metalness={0.1} />
        <StlPart url={HEAD_STL.middle} color={colour.dark} roughness={0.48} />
        <StlPart url={HEAD_STL.top} color={colour.accent} roughness={0.45} />
      </group>
      {/* Readable screen + cam lens at boom tip (bought UVC module envelope) */}
      <group position={[0, headY + mmToM(18), mmToM(HEAD.boom_length_mm * 0.85)]}>
        <mesh castShadow>
          <boxGeometry args={[mmToM(HEAD.screen_w_mm), mmToM(HEAD.screen_h_mm), mmToM(HEAD.screen_t_mm)]} />
          <meshStandardMaterial color={colour.face} roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0, mmToM(HEAD.screen_t_mm * 0.5 + 2)]}>
          <boxGeometry args={[mmToM(CAMERA.W), mmToM(CAMERA.H), mmToM(CAMERA.D)]} />
          <meshStandardMaterial color="#1e2430" roughness={0.35} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0, mmToM(HEAD.screen_t_mm * 0.5 + CAMERA.D + 1)]} rotation={[0, 0, 0]}>
          <circleGeometry args={[mmToM(4), 20]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * One SO-101 follower seated on the 4040 mount at current carriage AGL.
 * L = +X, R = −X. Simplified orientation: hang idle down from mount face.
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
  const shoulderY = mmToM(carriageAglMm - 8)
  const shoulderZ = mmToM(ARM.mount_z_mm)

  return (
    <group position={[shoulderX, shoulderY, shoulderZ]}>
      {/* Seat on 4040: yaw to face out, tip so arm hangs down */}
      <group rotation={[Math.PI / 2, left ? 0 : Math.PI, left ? -Math.PI / 2 : Math.PI / 2]}>
        <SO101Glb color={colour.dark} />
      </group>
    </group>
  )
}

export const MESH_ATTRIBUTION =
  `OSS compose: perceptron_bot base (MIT) + Prusa Z/x-end carriage (GPL-2.0) + SO-ARM100 cam/4040/SO-101 (Apache-2.0). ` +
  `Overall ${OVERALL_HEIGHT_MM} mm chore stack (not 5′8″). Bought: extrusion + T8. Q/E 160→950. Soft pads + wipe.`
