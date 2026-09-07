/**
 * Pebble visual = procedural wheeled chassis + mast eye + 1× SO-101 follower.
 */
import { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { GaitPose } from '../gait'
import type { Colourway } from '../product'
import { STANDING_HEIGHT_MM } from '../robot/dims'
import {
  MESH_ATTRIBUTION,
  SO101FollowerArm,
  WheeledChassis,
} from './ImportedRobots'

type Props = {
  x: number
  y: number
  theta: number
  pose: GaitPose
  colour: Colourway
}

function MeshFallback() {
  return (
    <mesh position={[0, 0.06, 0]}>
      <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
      <meshStandardMaterial color="#334155" wireframe />
    </mesh>
  )
}

export function Pebble({ x, y, theta, pose, colour }: Props) {
  const root = useRef<Group>(null)
  useFrame(() => {
    if (!root.current) return
    // Physics (x,y) -> Three (x,z); yaw maps body +Z to heading theta
    // Wheeled: ignore biped bob (keep tiny for continuity)
    root.current.position.set(x, pose.bob * 0.15, y)
    root.current.rotation.y = -theta + Math.PI / 2
  })

  return (
    <group ref={root}>
      <Suspense fallback={<MeshFallback />}>
        <WheeledChassis colour={colour} />
        <SO101FollowerArm side="R" colour={colour} />
      </Suspense>
    </group>
  )
}

export const PEBBLE_HEIGHT_LABEL = `${STANDING_HEIGHT_MM} mm`
export { MESH_ATTRIBUTION }
