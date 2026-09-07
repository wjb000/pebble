import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

export function Beacon({ x, y }: { x: number; y: number }) {
  const glow = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (!glow.current) return
    const s = 1 + Math.sin(clock.elapsedTime * 3) * 0.08
    glow.current.scale.setScalar(s)
  })
  return (
    <group position={[x, 0, y]}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 0.16, 16]} />
        <meshStandardMaterial color="#f5c518" emissive="#f5a623" emissiveIntensity={0.55} />
      </mesh>
      <mesh ref={glow} position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.055, 20, 20]} />
        <meshStandardMaterial color="#ffe566" emissive="#ffcc33" emissiveIntensity={1.2} />
      </mesh>
      <pointLight position={[0, 0.25, 0]} color="#ffd24a" intensity={1.2} distance={2.5} />
    </group>
  )
}
