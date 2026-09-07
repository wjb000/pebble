/** Minimal chore props: flat table surface + small box (kinematic pick when held). */
export function ChoreProps({
  boxX,
  boxY,
  boxHeld,
  robotX,
  robotY,
  robotTheta,
}: {
  boxX: number
  boxY: number
  boxHeld: boolean
  robotX: number
  robotY: number
  robotTheta: number
}) {
  // When held, park box slightly ahead/right of robot (gripper proxy)
  let bx = boxX
  let by = boxY
  let byElev = 0.04
  if (boxHeld) {
    const reach = 0.28
    bx = robotX + Math.cos(robotTheta) * reach
    by = robotY + Math.sin(robotTheta) * reach
    byElev = 0.14
  }

  return (
    <group>
      {/* Flat table / surface within reach */}
      <mesh position={[0.85, 0.22, 0.35]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.04, 0.4]} />
        <meshStandardMaterial color="#3f4654" roughness={0.7} metalness={0.08} />
      </mesh>
      <mesh position={[0.7, 0.1, 0.35]} castShadow>
        <boxGeometry args={[0.05, 0.2, 0.05]} />
        <meshStandardMaterial color="#2a303a" roughness={0.8} />
      </mesh>
      <mesh position={[1.0, 0.1, 0.35]} castShadow>
        <boxGeometry args={[0.05, 0.2, 0.05]} />
        <meshStandardMaterial color="#2a303a" roughness={0.8} />
      </mesh>
      {/* Small box to pick (E when close) */}
      <mesh position={[bx, byElev, by]} castShadow>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial color={boxHeld ? '#f97316' : '#e2e8f0'} roughness={0.45} />
      </mesh>
    </group>
  )
}
