export function Ball({ x, y }: { x: number; y: number }) {
  return (
    <group position={[x, 0.08, y]}>
      <mesh castShadow>
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshStandardMaterial color="#f2f2f2" roughness={0.45} />
      </mesh>
      {/* crude soccer pentagon look */}
      <mesh>
        <sphereGeometry args={[0.081, 16, 12]} />
        <meshStandardMaterial color="#1a1a1a" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  )
}
