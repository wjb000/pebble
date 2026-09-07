/**
 * Pebble visual twin — composed from real OSS meshes (no generated bodies).
 *
 * Base:   public/assets/base/*  ← PedroS235/perceptron_bot (MIT)
 * Lift:   public/assets/lift/*  ← Prusa i3 Z + x-end carriage (GPL-2.0) + SO 4040 mount
 * Head:   public/assets/head/*  ← SO-ARM100 Overhead Cam (Apache-2.0) — 1:1, centered on column
 * Arms:   SimpleSO101Arm — box/cylinder kit visual sized from SO101 + STS3215 (no GLB)
 *
 * Frame: +Y up, +Z forward, +X left. Perceptron CAD is Z-up → rotX(-π/2).
 * Bought envelopes: 2040 extrusion box + T8 lead-screw cylinder (captioned in Model tab).
 *
 * 8 bolt-up modules: base → outriggers/ballast → 2040 → T8/MGN → carriage → yoke L/R → SO-101 kits → head.
 */
import { useMemo } from 'react'
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
  MGN12,
  OUTRIGGERS,
  OVERALL_HEIGHT_MM,
  SCREW_AXIS_X_MM,
  SCREW_ELEVATOR,
  mmToM,
} from '../robot/dims'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

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

/**
 * Perceptron wheeled chassis + bought extrusion column + coax lead-screw stack +
 * Prusa Z hardware + 1:1 head cam. Carriage + 4040 mounts animate with elevator AGL.
 */
export function WheeledChassis({
  colour,
  carriageAglMm,
  armShoulderRad = 0,
  armElbowRad = 0,
  showWipe = true,
}: {
  colour: Colourway
  carriageAglMm: number
  armShoulderRad?: number
  armElbowRad?: number
  showWipe?: boolean
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
  const columnTopY = baseH + extLen
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

      {/* Lift stack: carriage + 4040 + SO-101 — one rigid parent (screwX, carriageY) */}
      <group position={[screwX, carriageY, 0]}>
        <StlPart
          url={LIFT_STL.carriage}
          color={colour.accent}
          position={[mmToM(-8), 0, mmToM(-6)]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          roughness={0.48}
          metalness={0.1}
        />

        {/*
          L/R 4040 mounts — children of carriage (not world orphans).
          Local mm: L [+(mount_x-face_half)-screwX, -drop, mount_z]
                    R [-(mount_x-face_half)-screwX, -drop, mount_z]
        */}
        {([-1, 1] as const).map((sign) => {
          const left = sign === 1
          const half = ARM.mount_face_half_mm
          const [cx, cy, cz] = ARM.mount_stl_center_mm
          const lx = mmToM(sign * (ARM.mount_x_mm - half) - SCREW_AXIS_X_MM)
          const ly = mmToM(-ARM.mount_face_drop_mm)
          const lz = mmToM(ARM.mount_z_mm)
          return (
            <group
              key={left ? 'm4040-L' : 'm4040-R'}
              position={[lx, ly, lz]}
              rotation={[0, left ? Math.PI / 2 : -Math.PI / 2, 0]}
            >
              <StlPart
                url={LIFT_STL.mount4040}
                color={colour.dark}
                position={[mmToM(-cx), mmToM(-cy), mmToM(-cz)]}
                roughness={0.5}
              />
            </group>
          )
        })}

        {/* Seat pads at SO-101 base_link seats (local to lift) */}
        {([-1, 1] as const).map((sign) => (
          <mesh
            key={`arm-pad-${sign}`}
            position={[
              mmToM(sign * ARM.mount_x_mm - SCREW_AXIS_X_MM),
              mmToM(-ARM.mount_face_drop_mm),
              mmToM(ARM.mount_z_mm),
            ]}
            castShadow
          >
            <boxGeometry args={[mmToM(36), mmToM(8), mmToM(36)]} />
            <meshStandardMaterial color="#374151" roughness={0.5} metalness={0.25} />
          </mesh>
        ))}


        {/* Yoke crossbar — carriage→4040 reads as one printed bridge */}
        <mesh
          position={[
            mmToM(-SCREW_AXIS_X_MM),
            mmToM(-ARM.mount_face_drop_mm),
            mmToM(ARM.mount_z_mm),
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[mmToM(ARM.mount_x_mm * 2 + 8), mmToM(12), mmToM(30)]} />
          <meshStandardMaterial color={colour.dark} roughness={0.52} metalness={0.08} />
        </mesh>

        {/* Keyed L/R lugs — ride with carriage */}
        <mesh
          position={[
            mmToM(ARM.mount_x_mm - SCREW_AXIS_X_MM),
            mmToM(14),
            mmToM(ARM.mount_z_mm + 10),
          ]}
          castShadow
        >
          <boxGeometry args={[mmToM(22), mmToM(10), mmToM(8)]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.4} />
        </mesh>
        <mesh
          position={[
            mmToM(ARM.mount_x_mm - SCREW_AXIS_X_MM + 14),
            mmToM(18),
            mmToM(ARM.mount_z_mm + 10),
          ]}
          castShadow
        >
          <boxGeometry args={[mmToM(8), mmToM(16), mmToM(8)]} />
          <meshStandardMaterial color="#0ea5e9" roughness={0.35} />
        </mesh>
        <mesh
          position={[
            mmToM(-ARM.mount_x_mm - SCREW_AXIS_X_MM),
            mmToM(14),
            mmToM(ARM.mount_z_mm + 10),
          ]}
          castShadow
        >
          <boxGeometry args={[mmToM(22), mmToM(10), mmToM(8)]} />
          <meshStandardMaterial color="#f97316" roughness={0.4} />
        </mesh>
        <mesh
          position={[
            mmToM(-ARM.mount_x_mm - SCREW_AXIS_X_MM - 12),
            mmToM(20),
            mmToM(ARM.mount_z_mm + 10),
          ]}
          rotation={[0, 0, Math.PI / 5]}
          castShadow
        >
          <boxGeometry args={[mmToM(10), mmToM(20), mmToM(7)]} />
          <meshStandardMaterial color="#ea580c" roughness={0.35} />
        </mesh>

        {/* SO-101 base_link seats on 4040 faces — same rigid lift parent */}
        <SO101FollowerArm
          side="L"
          colour={colour}
          carriageAglMm={carriageAglMm}
          shoulderRad={armShoulderRad}
          elbowRad={armElbowRad}
          liftLocal
        />
        <SO101FollowerArm
          side="R"
          colour={colour}
          carriageAglMm={carriageAglMm}
          shoulderRad={armShoulderRad}
          elbowRad={armElbowRad}
          showWipe={showWipe}
          liftLocal
        />
        {/* MGN carriage block — under LIFT (local ≈ [-18, 0, 14] mm) */}
        <mesh
          position={[
            mmToM(-(MGN12.rail_w_mm + 6)),
            0,
            mmToM(EXTRUSION.depth_mm * 0.35),
          ]}
          castShadow
        >
          <boxGeometry
            args={[mmToM(MGN12.block_w_mm), mmToM(MGN12.block_l_mm), mmToM(MGN12.block_h_mm)]}
          />
          <meshStandardMaterial color="#9ca3af" roughness={0.32} metalness={0.7} />
        </mesh>
      </group>

      {/* Outrigger feet — widen support to 400 mm (TIP.support_width) */}
      {([-1, 1] as const).map((side) => {
        const half = mmToM(OUTRIGGERS.support_width_mm) * 0.5
        const pad = mmToM(OUTRIGGERS.foot_pad_mm)
        const chassisHalf = mmToM(BASE.footprint_mm) * 0.5
        return (
          <group key={`out-${side}`}>
            {/* Beam from chassis rail to outrigger foot */}
            <mesh
              position={[side * (chassisHalf + (half - chassisHalf) * 0.5), mmToM(12), 0]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[half - chassisHalf + mmToM(10), mmToM(10), mmToM(22)]} />
              <meshStandardMaterial color="#7c8590" roughness={0.42} metalness={0.42} />
            </mesh>
            <mesh position={[side * half, mmToM(8), 0]} castShadow receiveShadow>
              <boxGeometry args={[mmToM(14), mmToM(10), mmToM(80)]} />
              <meshStandardMaterial color="#6b7280" roughness={0.45} metalness={0.4} />
            </mesh>
            <mesh position={[side * half, mmToM(3), 0]} castShadow receiveShadow>
              <boxGeometry args={[pad, mmToM(6), pad]} />
              <meshStandardMaterial color="#1f2937" roughness={0.9} metalness={0.05} />
            </mesh>
          </group>
        )
      })}


      {/* Low-bay ballast block 4.0 kg (visual envelope) */}
      <mesh position={[0, mmToM(28), mmToM(-20)]} castShadow>
        <boxGeometry args={[mmToM(90), mmToM(28), mmToM(50)]} />
        <meshStandardMaterial color="#4b5563" roughness={0.55} metalness={0.35} />
      </mesh>

      {/* MGN12H rail envelope — silver, parallel to T8 (REQUIRED) */}
      <mesh
        position={[
          screwX - mmToM(MGN12.rail_w_mm + 6),
          baseH + extLen * 0.5,
          mmToM(EXTRUSION.depth_mm * 0.35),
        ]}
        castShadow
      >
        <boxGeometry args={[mmToM(MGN12.rail_w_mm), extLen * 0.95, mmToM(MGN12.rail_h_mm)]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.28} metalness={0.75} />
      </mesh>
      {/* SO-ARM overhead cam — on-column (X=0); boom stacks UP; no sideways poke */}
      <group position={[0, columnTopY + mmToM(6), 0]} rotation={[0, 0, 0]}>
        <StlPart url={HEAD_STL.bottom} color={colour.dark} roughness={0.48} metalness={0.1} />
        <StlPart url={HEAD_STL.middle} color={colour.dark} roughness={0.48} />
        <StlPart url={HEAD_STL.top} color={colour.accent} roughness={0.45} />
      </group>
      {/* Face nest on column top */}
      <group position={[0, columnTopY + mmToM(52), mmToM(8)]}>
        <mesh castShadow>
          <boxGeometry args={[mmToM(HEAD.screen_w_mm), mmToM(HEAD.screen_h_mm), mmToM(HEAD.screen_t_mm)]} />
          <meshStandardMaterial color={colour.face} roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0, mmToM(HEAD.screen_t_mm * 0.5 + 2)]}>
          <boxGeometry args={[mmToM(CAMERA.W), mmToM(CAMERA.H), mmToM(CAMERA.D)]} />
          <meshStandardMaterial color="#1e2430" roughness={0.35} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0, mmToM(HEAD.screen_t_mm * 0.5 + CAMERA.D + 1)]}>
          <circleGeometry args={[mmToM(4), 20]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * One SO-101 arm for house chores — bright, chunky, impossible to miss.
 * L = sky blue, R = orange (same poka-yoke as keyed lugs). Hangs from 4040, reaches forward.
 */
export function SO101FollowerArm({
  colour,
  side = 'R',
  carriageAglMm,
  shoulderRad = 0,
  elbowRad = 0,
  showWipe = false,
  liftLocal = false,
}: {
  colour: Colourway
  side?: 'L' | 'R'
  carriageAglMm: number
  shoulderRad?: number
  elbowRad?: number
  showWipe?: boolean
  liftLocal?: boolean
}) {
  const left = side === 'L'
  const shoulderX = liftLocal
    ? mmToM((left ? ARM.mount_x_mm : -ARM.mount_x_mm) - SCREW_AXIS_X_MM)
    : mmToM(left ? ARM.mount_x_mm : -ARM.mount_x_mm)
  const shoulderY = liftLocal
    ? mmToM(-ARM.mount_face_drop_mm)
    : mmToM(carriageAglMm - ARM.mount_face_drop_mm)
  const shoulderZ = mmToM(ARM.mount_z_mm)
  // High-contrast kit colors (not colour.dark — that vanished on the dark stage)
  void colour
  const kitColor = left ? '#38bdf8' : '#f97316'
  const jointColor = left ? '#0ea5e9' : '#ea580c'

  return (
    <group position={[shoulderX, shoulderY, shoulderZ]}>
      <group rotation={[0, left ? 0 : Math.PI, 0]}>
        <SimpleSO101Arm
          color={kitColor}
          jointColor={jointColor}
          shoulderRad={shoulderRad}
          elbowRad={elbowRad}
          showWipe={showWipe && !left}
        />
      </group>
    </group>
  )
}

/**
 * Visible dual-arm chore kit — thick links, hang down then bend forward (+Z) for wipe/dishes reach.
 */
function SimpleSO101Arm({
  color,
  jointColor,
  shoulderRad = 0,
  elbowRad = 0,
  showWipe = false,
}: {
  color: string
  jointColor: string
  shoulderRad?: number
  elbowRad?: number
  showWipe?: boolean
}) {
  const m = mmToM
  // Chunky envelopes — readable at orbit distance (still sized near SO-101)
  const baseH = m(70)
  const upper = m(130)
  const fore = m(140)
  const wrist = m(70)
  const grip = m(90)
  const thick = m(36)
  const wide = m(48)

  // Hang toward floor, slight demo sway; elbow bends so forearm comes FORWARD for chores
  const hang = Math.PI + shoulderRad * 0.15
  const elbow = 1.1 + elbowRad * 0.2 // ~63° toward +Z after hang

  return (
    <group>
      {/* Mounted base on 4040 */}
      <mesh position={[0, baseH * 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[wide, baseH, thick]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} />
      </mesh>
      <mesh position={[0, baseH * 0.7, m(12)]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[m(14), m(14), m(22), 16]} />
        <meshStandardMaterial color={jointColor} roughness={0.3} metalness={0.55} />
      </mesh>

      <group position={[0, baseH, 0]} rotation={[hang, 0, 0]}>
        {/* Upper arm */}
        <mesh position={[0, upper * 0.5, 0]} castShadow>
          <boxGeometry args={[thick, upper, thick]} />
          <meshStandardMaterial color={color} roughness={0.42} metalness={0.12} />
        </mesh>
        <mesh position={[0, upper, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[m(16), m(16), m(40), 16]} />
          <meshStandardMaterial color={jointColor} roughness={0.3} metalness={0.6} />
        </mesh>

        <group position={[0, upper, 0]} rotation={[elbow, 0, 0]}>
          {/* Forearm — reaches into workspace */}
          <mesh position={[0, fore * 0.5, 0]} castShadow>
            <boxGeometry args={[thick * 0.9, fore, thick * 0.9]} />
            <meshStandardMaterial color={color} roughness={0.42} metalness={0.12} />
          </mesh>
          <group position={[0, fore, 0]}>
            <mesh position={[0, wrist * 0.5, 0]} castShadow>
              <boxGeometry args={[m(32), wrist, m(28)]} />
              <meshStandardMaterial color={jointColor} roughness={0.35} metalness={0.4} />
            </mesh>
            <group position={[0, wrist + grip * 0.35, 0]}>
              <mesh position={[m(14), 0, 0]} castShadow>
                <boxGeometry args={[m(10), grip * 0.75, m(22)]} />
                <meshStandardMaterial color="#374151" roughness={0.5} />
              </mesh>
              <mesh position={[m(-14), 0, 0]} castShadow>
                <boxGeometry args={[m(10), grip * 0.75, m(22)]} />
                <meshStandardMaterial color="#374151" roughness={0.5} />
              </mesh>
              <mesh position={[m(14), grip * 0.2, 0]} castShadow>
                <boxGeometry args={[m(12), m(22), m(18)]} />
                <meshStandardMaterial color="#f472b6" roughness={0.85} metalness={0.02} />
              </mesh>
              <mesh position={[m(-14), grip * 0.2, 0]} castShadow>
                <boxGeometry args={[m(12), m(22), m(18)]} />
                <meshStandardMaterial color="#f472b6" roughness={0.85} metalness={0.02} />
              </mesh>
              {showWipe && (
                <mesh position={[0, m(10), m(-22)]} rotation={[0.35, 0, 0]} castShadow>
                  <boxGeometry args={[m(48), m(8), m(32)]} />
                  <meshStandardMaterial color="#e2e8f0" roughness={0.95} />
                </mesh>
              )}
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

export const MESH_ATTRIBUTION =
  `OSS compose: perceptron_bot base (MIT) + Prusa Z/x-end carriage (GPL-2.0 — derivatives stay GPL) + SO-ARM100 cam/4040 (Apache-2.0). ` +
  `SO-101 = dual bought kits (bright twin arms for chores). Overall ${OVERALL_HEIGHT_MM} mm. Bought REQUIRED: 2040 + T8 + MGN12H + outriggers + 4 kg ballast. Soft pads + wipe.`
