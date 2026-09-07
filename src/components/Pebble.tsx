/**
 * Pebble visual = ~1200 mm chore twin + screw-drive carriage + MGN12 + 2× SO-101.
 * Pose is world x/y/theta only — tipOver applies a visual lean freeze.
 */
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { Colourway } from '../product'
import { OVERALL_HEIGHT_MM, SCREW_ELEVATOR } from '../robot/dims'
import { MESH_ATTRIBUTION } from './ImportedRobots'
import { RobotAssembly } from './RobotAssembly'

type Props = {
  x: number
  y: number
  theta: number
  colour: Colourway
  carriageAglMm?: number
  tipOver?: boolean
  armShoulderRad?: number
  armElbowRad?: number
}

export function Pebble({
  x,
  y,
  theta,
  colour,
  carriageAglMm = SCREW_ELEVATOR.default_agl_mm,
  tipOver = false,
  armShoulderRad = 0,
  armElbowRad = 0,
}: Props) {
  const root = useRef<Group>(null)
  useFrame(() => {
    if (!root.current) return
    root.current.position.set(x, tipOver ? 0.02 : 0, y)
    root.current.rotation.y = -theta + Math.PI / 2
    root.current.rotation.z = tipOver ? 0.35 : 0
    root.current.rotation.x = tipOver ? 0.08 : 0
  })

  return (
    <group ref={root}>
      <RobotAssembly
        colour={colour}
        carriageAglMm={carriageAglMm}
        armShoulderRad={armShoulderRad}
        armElbowRad={armElbowRad}
        showWipe
      />
    </group>
  )
}

export const PEBBLE_HEIGHT_LABEL = `${OVERALL_HEIGHT_MM} mm`
export { MESH_ATTRIBUTION }
