/**
 * Real CAD meshes only — Microduck (microduck_rl / assembled MJCF) + SO-101 (SO-ARM100 URDF bake).
 * No handmade capsules/boxes pretending to be the robot.
 */
import { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import type { MeshStandardMaterialParameters } from 'three'
import type { Colourway } from '../product'
import { ARM, mmToM } from '../robot/dims'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`

/** Assembled Microduck STL is millimeters, Z-up; feet at z ≈ -106.53 mm */
export const MICRODUCK_STL = asset('assets/microduck/body_assembled.stl')
/** SO-101 follower baked from Simulation/SO101 URDF visuals (meters, Z-up) */
export const SO101_STL = asset('assets/so101/follower_idle.stl')
export const SO101_GLB = asset('assets/so101/follower_idle.glb')

const MICRODUCK_FOOT_Z_MM = 106.526
const MICRODUCK_SCALE = 0.001

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

/** Official / community Microduck body mesh (assembled from MJCF STLs). */
export function MicroduckBody({ colour }: { colour: Colourway }) {
  return (
    <group
      position={[0, mmToM(MICRODUCK_FOOT_Z_MM), 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={MICRODUCK_SCALE}
    >
      <StlMesh
        url={MICRODUCK_STL}
        color={colour.primary}
        material={{ roughness: 0.42, metalness: 0.08 }}
      />
    </group>
  )
}

/**
 * One SO-101 follower arm from URDF-baked STL.
 * Mounts on Microduck torso sides; visual scale is URDF meters.
 */
export function SO101FollowerArm({
  side,
  colour,
}: {
  side: 'L' | 'R'
  colour: Colourway
}) {
  // Body local: +X left/right after root yaw; mount on torso sides.
  // SO-101 URDF is Z-up with reach along +X (~0.4 m). Convert Z-up→Y-up (Rx -90°),
  // then yaw so +X reach points forward (+Z in body frame before root yaw).
  const left = side === 'L'
  const shoulderX = mmToM(ARM.shoulder_span) * 0.5 * (left ? 1 : -1)
  const shoulderY = mmToM(130) // mid-torso on 250 mm duck
  const shoulderZ = mmToM(ARM.mount_forward)

  // Left: Ry(+90°). Right: Ry(-90°) — no negative scale (keeps winding).
  const yaw = left ? Math.PI / 2 : -Math.PI / 2

  return (
    <group position={[shoulderX, shoulderY, shoulderZ]}>
      <group rotation={[-Math.PI / 2, yaw, 0]}>
        <SO101Glb color={colour.dark} />
      </group>
    </group>
  )
}

export const MESH_ATTRIBUTION =
  'Meshes: Microduck (microduck_rl, CC BY-SA-NC) + SO-101 (TheRobotStudio/SO-ARM100)'
