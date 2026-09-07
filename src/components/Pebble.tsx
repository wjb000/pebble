/**
 * Pebble visual = 5′8″ printable twin + screw-drive carriage + 2× SO-101.
 * Pose is world x/y/theta only — no biped bob on the wheeled base.
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
  /** Carriage AGL mm from screw elevator (sim state) */
  carriageAglMm?: number
}

export function Pebble({
  x,
  y,
  theta,
  colour,
  carriageAglMm = SCREW_ELEVATOR.default_agl_mm,
}: Props) {
  const root = useRef<Group>(null)
  useFrame(() => {
    if (!root.current) return
    root.current.position.set(x, 0, y)
    root.current.rotation.y = -theta + Math.PI / 2
  })

  return (
    <group ref={root}>
      <RobotAssembly colour={colour} carriageAglMm={carriageAglMm} />
    </group>
  )
}

export const PEBBLE_HEIGHT_LABEL = `${OVERALL_HEIGHT_MM} mm`
export { MESH_ATTRIBUTION }
