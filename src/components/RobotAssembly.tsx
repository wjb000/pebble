/**
 * Shared assembled robot — used by Sim (Pebble) and /model viewer.
 * Arms = SimpleSO101Arm kits inside WheeledChassis lift group (carriage → yoke → SO-101).
 */
import { Suspense } from 'react'
import type { Colourway } from '../product'
import { OVERALL_HEIGHT_MM, SCREW_ELEVATOR, mmToM } from '../robot/dims'
import { WheeledChassis } from './ImportedRobots'

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
  armShoulderRad = 0,
  armElbowRad = 0,
  showWipe = true,
}: {
  colour: Colourway
  carriageAglMm?: number
  armShoulderRad?: number
  armElbowRad?: number
  showWipe?: boolean
}) {
  return (
    <Suspense fallback={<MeshFallback />}>
      <WheeledChassis
        colour={colour}
        carriageAglMm={carriageAglMm}
        armShoulderRad={armShoulderRad}
        armElbowRad={armElbowRad}
        showWipe={showWipe}
      />
    </Suspense>
  )
}
