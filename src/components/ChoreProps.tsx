import { DoubleSide } from 'three'

/**
 * House-chore props: counter + sink + plate, laundry basket + cloth + washer rim.
 * F pick/drop moves the active item (plate proxy) with the robot when held.
 */
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
  let itemX = boxX
  let itemZ = boxY
  let itemY = 0.04
  if (boxHeld) {
    const reach = 0.28
    itemX = robotX + Math.cos(robotTheta) * reach
    itemZ = robotY + Math.sin(robotTheta) * reach
    itemY = 0.55
  }

  return (
    <group>
      {/* Counter island ~900 mm */}
      <mesh position={[1.05, 0.45, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.65, 0.9, 0.42]} />
        <meshStandardMaterial color="#3a414d" roughness={0.75} metalness={0.06} />
      </mesh>
      <mesh position={[1.05, 0.91, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.68, 0.04, 0.45]} />
        <meshStandardMaterial color="#c4b8a8" roughness={0.55} metalness={0.08} />
      </mesh>
      {/* Sink lip + basin */}
      <mesh position={[1.18, 0.88, 0.0]} castShadow>
        <boxGeometry args={[0.26, 0.05, 0.2]} />
        <meshStandardMaterial color="#9aa3ad" roughness={0.35} metalness={0.45} />
      </mesh>
      <mesh position={[1.18, 0.82, 0.0]}>
        <boxGeometry args={[0.2, 0.07, 0.14]} />
        <meshStandardMaterial color="#1e2430" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Pickable item: plate when near counter spawn, shown as plate disc */}
      <mesh position={[itemX, boxHeld ? itemY : Math.max(itemY, 0.95), itemZ]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.014, 24]} />
        <meshStandardMaterial color={boxHeld ? '#f97316' : '#e8eef6'} roughness={0.4} />
      </mesh>

      {/* Floor cloth (static visual — laundry) */}
      {!boxHeld && (
        <mesh position={[-0.4, 0.012, 0.65]} rotation={[-Math.PI / 2, 0, 0.35]} castShadow>
          <planeGeometry args={[0.14, 0.1]} />
          <meshStandardMaterial color="#64748b" roughness={0.92} side={DoubleSide} />
        </mesh>
      )}
      {boxHeld && (
        <mesh
          position={[itemX + 0.02, itemY - 0.02, itemZ]}
          rotation={[-Math.PI / 2, 0, 0.2]}
          castShadow
        >
          <planeGeometry args={[0.12, 0.08]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.9} side={DoubleSide} />
        </mesh>
      )}

      {/* Laundry basket */}
      <group position={[-0.85, 0, 0.35]}>
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.13, 0.36, 16]} />
          <meshStandardMaterial color="#d97706" roughness={0.7} metalness={0.05} transparent opacity={0.82} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <torusGeometry args={[0.148, 0.012, 8, 20]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} />
        </mesh>
      </group>

      {/* Open washer (~900 mm rim) */}
      <mesh position={[-1.3, 0.45, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.9, 0.48]} />
        <meshStandardMaterial color="#4b5563" roughness={0.55} metalness={0.25} />
      </mesh>
      <mesh position={[-1.3, 0.92, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.022, 10, 24]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.35} />
      </mesh>
    </group>
  )
}
