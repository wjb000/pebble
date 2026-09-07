/** Simple desk/counter chore props for scale reference. */

export function ChoreProps() {
  return (
    <group>
      {/* Counter-height table */}
      <group position={[-1.1, 0, 0.6]}>
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.04, 0.45]} />
          <meshStandardMaterial color="#3d342c" roughness={0.7} />
        </mesh>
        {[[-0.28, -0.28], [0.28, -0.28], [-0.28, 0.28], [0.28, 0.28]].map(([lx, lz], i) => (
          <mesh key={i} position={[lx, 0.36, lz]} castShadow>
            <boxGeometry args={[0.04, 0.72, 0.04]} />
            <meshStandardMaterial color="#2a241e" roughness={0.8} />
          </mesh>
        ))}
        {/* Mug */}
        <mesh position={[-0.12, 0.78, 0.05]} castShadow>
          <cylinderGeometry args={[0.035, 0.032, 0.09, 16]} />
          <meshStandardMaterial color="#c45c26" roughness={0.45} />
        </mesh>
        <mesh position={[-0.12, 0.82, 0.05]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
        {/* Wipe pad */}
        <mesh position={[0.18, 0.745, -0.05]} rotation={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.12, 0.015, 0.08]} />
          <meshStandardMaterial color="#7dd3fc" roughness={0.85} />
        </mesh>
      </group>

      {/* Soft trash bin */}
      <group position={[1.0, 0, -0.4]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.12, 0.44, 16]} />
          <meshStandardMaterial color="#374151" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.44, 0]}>
          <torusGeometry args={[0.14, 0.012, 8, 24]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.4} roughness={0.4} />
        </mesh>
        {/* clutter ball near bin */}
        <mesh position={[-0.22, 0.05, 0.1]} castShadow>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}
