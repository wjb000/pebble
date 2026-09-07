import { ARENA_HALF } from '../sim/types'

const SIZE = ARENA_HALF * 2

/** Flat sim floor only — no walls / grid / fence. */
export function Arena() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[SIZE + 4, SIZE + 4]} />
      <meshStandardMaterial color="#12141a" roughness={0.95} metalness={0.05} />
    </mesh>
  )
}
