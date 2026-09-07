import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { useSim } from '../sim/SimContext'
import { OVERALL_HEIGHT_MM, mmToM } from '../robot/dims'

/** Frame ~1200 mm chore twin + dual SO-101 on lead-screw carriage. */
export function ChaseCamera() {
  const { state, notifyOrbitDetach } = useSim()
  const controls = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()
  const dragging = useRef(false)
  const desired = useRef(new THREE.Vector3())
  const look = useRef(new THREE.Vector3())
  const midY = mmToM(OVERALL_HEIGHT_MM) * 0.55

  useEffect(() => {
    const el = controls.current
    if (!el) return
    const onStart = () => { dragging.current = true; notifyOrbitDetach() }
    const onEnd = () => { dragging.current = false }
    el.addEventListener('start', onStart)
    el.addEventListener('end', onEnd)
    return () => {
      el.removeEventListener('start', onStart)
      el.removeEventListener('end', onEnd)
    }
  }, [notifyOrbitDetach])

  useFrame((_, dt) => {
    const target = look.current.set(state.x, midY, state.y)
    if (state.chaseCam && !dragging.current) {
      const back = 2.4
      const height = midY + 0.45
      const yaw = -state.theta + Math.PI / 2
      desired.current.set(
        state.x - Math.sin(yaw) * back,
        height,
        state.y - Math.cos(yaw) * back,
      )
      camera.position.lerp(desired.current, 1 - Math.exp(-4 * dt))
      if (controls.current) {
        controls.current.target.lerp(target, 1 - Math.exp(-5 * dt))
        controls.current.update()
      }
    } else if (controls.current) {
      controls.current.target.lerp(target, 1 - Math.exp(-2 * dt))
    }
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      minDistance={0.6}
      maxDistance={5}
      maxPolarAngle={Math.PI * 0.48}
      dampingFactor={0.08}
    />
  )
}
