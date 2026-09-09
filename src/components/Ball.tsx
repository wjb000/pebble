/** Beacon ball the StubBrain / BC demos can seek. */
export function Ball({ x, y }: { x: number; y: number }) {
  return (
    <group position={[x, 0.08, y]}>
      <mesh castShadow>
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshStandardMaterial color="#f2f2f2" roughness={0.45} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.081, 16, 12]} />
        <meshStandardMaterial color="#1a1a1a" wireframe transparent opacity={0.35} />
      </mesh>
      {/* soft glow ring so the beacon reads on the floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]}>
        <ringGeometry args={[0.1, 0.16, 24]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.45} />
      </mesh>
    </group>
  )
}
