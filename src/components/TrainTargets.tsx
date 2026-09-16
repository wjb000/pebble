import { TELESCOPE, mmToM } from '../robot/dims'

/** Pickable box proxy for teleop (F) and BC box features. */
export function TrainTargets({
  boxX,
  boxY,
  boxHeld,
  robotX,
  robotY,
  robotTheta,
  carriageAglMm = TELESCOPE.default_agl_mm,
}: {
  boxX: number
  boxY: number
  boxHeld: boolean
  robotX: number
  robotY: number
  robotTheta: number
  carriageAglMm?: number
}) {
  let itemX = boxX
  let itemZ = boxY
  let itemY = boxHeld ? Math.max(0.08, mmToM(carriageAglMm) - 0.12) : 0.05

  if (boxHeld) {
    const reach = 0.28
    itemX = robotX + Math.cos(robotTheta) * reach
    itemZ = robotY + Math.sin(robotTheta) * reach
  }

  return (
    <group>
      <mesh position={[itemX, itemY, itemZ]} castShadow>
        <boxGeometry args={[0.12, 0.08, 0.12]} />
        <meshStandardMaterial
          color={boxHeld ? '#fb7185' : '#f97316'}
          roughness={0.55}
          metalness={0.08}
        />
      </mesh>
      {!boxHeld && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[boxX, 0.002, boxY]}>
          <ringGeometry args={[0.1, 0.14, 20]} />
          <meshBasicMaterial color="#fb7185" transparent opacity={0.35} />
        </mesh>
      )}
    </group>
  )
}
