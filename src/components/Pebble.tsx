/**
 * Pebble visual = imported Microduck body + 2× SO-101 follower meshes.
 */
import { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { GaitPose } from '../gait'
import type { Colourway } from '../product'
import { STANDING_HEIGHT_MM } from '../robot/dims'
import {
  MESH_ATTRIBUTION,
  MicroduckBody,
  SO101FollowerArm,
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
    <mesh position={[0, 0.12, 0]}>
      <boxGeometry args={[0.05, 0.05, 0.05]} />
      <meshStandardMaterial color="#334155" wireframe />
    </mesh>
  )
}

export function Pebble({ x, y, theta, pose, colour }: Props) {
  const root = useRef<Group>(null)
  useFrame(() => {
    if (!root.current) return
    root.current.position.set(x, pose.bob, y)
    root.current.rotation.y = -theta + Math.PI / 2
  })

  return (
    <group ref={root}>
      <Suspense fallback={<MeshFallback />}>
        <MicroduckBody colour={colour} />
        <SO101FollowerArm side="L" colour={colour} />
        <SO101FollowerArm side="R" colour={colour} />
      </Suspense>
    </group>
  )
}

export const PEBBLE_HEIGHT_LABEL = `${STANDING_HEIGHT_MM} mm`
export { MESH_ATTRIBUTION }
