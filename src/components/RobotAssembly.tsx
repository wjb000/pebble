/**
 * Shared assembled robot — used by Sim (Pebble) and /model viewer.
 */
import { Suspense } from 'react'
import type { Colourway } from '../product'
import { OVERALL_HEIGHT_MM, SCREW_ELEVATOR, mmToM } from '../robot/dims'
import { SO101FollowerArm, WheeledChassis } from './ImportedRobots'

function MeshFallback() {
  const h = mmToM(OVERALL_HEIGHT_MM)
  return (
    <mesh position={[0, h * 0.5, 0]}>
      <cylinderGeometry args={[0.12, 0.16, h, 16]} />
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
