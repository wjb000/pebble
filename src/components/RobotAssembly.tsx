/**
 * Shared assembled robot — used by Sim (Pebble) and /model viewer.
 * Keep identical so Model tab and Sim twin never drift.
 */
import { Suspense } from 'react'
import type { Colourway } from '../product'
import { SCREW_ELEVATOR } from '../robot/dims'
import { SO101FollowerArm, WheeledChassis } from './ImportedRobots'

function MeshFallback() {
  return (
    <mesh position={[0, 0.85, 0]}>
      <cylinderGeometry args={[0.14, 0.18, 1.7, 16]} />
      <meshStandardMaterial color="#334155" wireframe />
    </mesh>
  )
}

export function RobotAssembly({
  colour,
  carriageAglMm = SCREW_ELEVATOR.default_agl_mm,
}: {
  colour: Colourway
  carriageAglMm?: number
}) {
  return (
    <Suspense fallback={<MeshFallback />}>
      <WheeledChassis colour={colour} carriageAglMm={carriageAglMm} />
      <SO101FollowerArm side="L" colour={colour} carriageAglMm={carriageAglMm} />
      <SO101FollowerArm side="R" colour={colour} carriageAglMm={carriageAglMm} />
    </Suspense>
  )
}
