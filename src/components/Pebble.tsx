/**
 * Pebble visual = 5′8″ printable twin + screw-drive carriage + 2× SO-101.
 */
import { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { GaitPose } from '../gait'
import type { Colourway } from '../product'
import { OVERALL_HEIGHT_MM, SCREW_ELEVATOR } from '../robot/dims'
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
  /** Carriage AGL mm from screw elevator (sim state) */
  carriageAglMm?: number
}

function MeshFallback() {
  return (
    <mesh position={[0, 0.85, 0]}>
      <cylinderGeometry args={[0.14, 0.18, 1.7, 16]} />
      <meshStandardMaterial color="#334155" wireframe />
    </mesh>
  )
}

export function Pebble({
  x,
  y,
  theta,
  pose,
  colour,
  carriageAglMm = SCREW_ELEVATOR.default_agl_mm,
}: Props) {
  const root = useRef<Group>(null)
  useFrame(() => {
    if (!root.current) return
    root.current.position.set(x, pose.bob * 0.15, y)
    root.current.rotation.y = -theta + Math.PI / 2
  })

  return (
    <group ref={root}>
      <Suspense fallback={<MeshFallback />}>
        <WheeledChassis colour={colour} carriageAglMm={carriageAglMm} />
        <SO101FollowerArm side="L" colour={colour} carriageAglMm={carriageAglMm} />
        <SO101FollowerArm side="R" colour={colour} carriageAglMm={carriageAglMm} />
      </Suspense>
    </group>
  )
}

export const PEBBLE_HEIGHT_LABEL = `${OVERALL_HEIGHT_MM} mm`
export { MESH_ATTRIBUTION }
