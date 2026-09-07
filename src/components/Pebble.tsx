/**
 * Pebble visual = printable wheeled base + torso/head STLs + 2× SO-101 follower GLB (hanging).
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
    <mesh position={[0, 0.25, 0]}>
      <cylinderGeometry args={[0.14, 0.16, 0.5, 16]} />
      <meshStandardMaterial color="#334155" wireframe />
    </mesh>
  )
}

export function Pebble({ x, y, theta, pose, colour }: Props) {
  const root = useRef<Group>(null)
  useFrame(() => {
    if (!root.current) return
    // Physics (x,y) -> Three (x,z); yaw maps body +Z to heading theta
    root.current.position.set(x, pose.bob * 0.15, y)
    root.current.rotation.y = -theta + Math.PI / 2
  })

  return (
    <group ref={root}>
      <Suspense fallback={<MeshFallback />}>
        <WheeledChassis colour={colour} />
        <SO101FollowerArm side="L" colour={colour} />
        <SO101FollowerArm side="R" colour={colour} />
      </Suspense>
    </group>
  )
}

export const PEBBLE_HEIGHT_LABEL = `${STANDING_HEIGHT_MM} mm`
export { MESH_ATTRIBUTION }
