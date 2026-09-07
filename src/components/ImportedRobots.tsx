/**
 * Real CAD meshes only — Microduck (microduck_rl / assembled MJCF) + SO-101 (SO-ARM100 URDF bake).
 * No handmade capsules/boxes pretending to be the robot.
 *
 * Frame convention (Pebble / Three.js body):
 *   +Y up, +Z forward (beak), +X left (robotics FLU after Z-up→Y-up + yaw).
 * Microduck STL is mm, Z-up, +X forward, ±Y lateral.
 * SO-101 URDF/GLB is meters, Z-up, reach along +X.
 */
import { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import type { MeshStandardMaterialParameters } from 'three'
import type { Colourway } from '../product'
import { ARM, HIP_HEIGHT_MM, PELVIS, TORSO, mmToM } from '../robot/dims'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`

/** Assembled Microduck STL is millimeters, Z-up; feet at z ≈ -106.53 mm */
export const MICRODUCK_STL = asset('assets/microduck/body_assembled.stl')
/** SO-101 follower baked from Simulation/SO101 URDF visuals (meters, Z-up) */
export const SO101_STL = asset('assets/so101/follower_idle.stl')
export const SO101_GLB = asset('assets/so101/follower_idle.glb')

const MICRODUCK_FOOT_Z_MM = 106.526
const MICRODUCK_SCALE = 0.001

/** Shoulder height above sole: hip bar + ~25% up the torso (MJCF trunk / neck class). */
const SHOULDER_HEIGHT_MM =
  HIP_HEIGHT_MM + PELVIS.H + TORSO.H * 0.25

type StlProps = {
  url: string
  color: string
  material?: MeshStandardMaterialParameters
}

function StlMesh({ url, color, material }: StlProps) {
  const geom = useLoader(STLLoader, url)
  const geometry = useMemo(() => {
    const g = geom.clone()
    g.computeVertexNormals()
    return g
  }, [geom])

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color={color}
        roughness={0.45}
        metalness={0.12}
        flatShading={false}
        {...material}
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
 * Official / community Microduck body mesh (assembled from MJCF STLs).
 * STL: Z-up, +X forward → body: Y-up, +Z forward via Rx(-90°) then Ry(-90°).
 */
export function MicroduckBody({ colour }: { colour: Colourway }) {
  return (
    <group position={[0, mmToM(MICRODUCK_FOOT_Z_MM), 0]}>
      {/* Outer yaw maps STL +X (beak) → body +Z (forward) */}
      <group rotation={[0, -Math.PI / 2, 0]}>
        {/* Inner: Z-up → Y-up */}
        <group rotation={[-Math.PI / 2, 0, 0]} scale={MICRODUCK_SCALE}>
          <StlMesh
            url={MICRODUCK_STL}
            color={colour.primary}
            material={{ roughness: 0.42, metalness: 0.08 }}
          />
        </group>
      </group>
    </group>
  )
}

/**
 * One SO-101 follower arm from URDF-baked GLB (meters, Z-up, reach +X).
 * Mounted on Microduck flanks: left +X, right -X; both reach body +Z when idle.
 * Same orientation both sides (no mirrored negative scale).
 */
export function SO101FollowerArm({
  side,
  colour,
}: {
  side: 'L' | 'R'
  colour: Colourway
}) {
  const left = side === 'L'
  // Body +X = left after Microduck facing fix
  const shoulderX = mmToM(ARM.shoulder_span) * 0.5 * (left ? 1 : -1)
  const shoulderY = mmToM(SHOULDER_HEIGHT_MM)
  const shoulderZ = mmToM(ARM.mount_forward)

  return (
    <group position={[shoulderX, shoulderY, shoulderZ]}>
      {/* Z-up→Y-up, then yaw so URDF +X reach → body +Z forward; base stays Y-up */}
      <group rotation={[0, -Math.PI / 2, 0]}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <SO101Glb color={colour.dark} />
        </group>
      </group>
    </group>
  )
}

export const MESH_ATTRIBUTION =
  'Meshes: Microduck (microduck_rl, CC BY-SA-NC) + SO-101 (TheRobotStudio/SO-ARM100)'
