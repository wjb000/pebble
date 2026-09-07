import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { useSim } from '../sim/SimContext'
import { COLOURWAYS } from '../product'
import { Arena } from './Arena'
import { Ball } from './Ball'
import { ChaseCamera } from './ChaseCamera'
import { Pebble } from './Pebble'
import { ChoreProps } from './ChoreProps'

export function Scene({ colourId }: { colourId: string }) {
  const { state } = useSim()
  const colour = COLOURWAYS.find((c) => c.id === colourId) ?? COLOURWAYS[0]
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.7, 1.5], fov: 42, near: 0.02, far: 30 }}
      gl={{ antialias: true, toneMappingExposure: 1.1 }}
      style={{ width: '100%', height: '100%', background: '#0a0b0e' }}
    >
      <color attach="background" args={['#0a0b0e']} />
      <fog attach="fog" args={['#0a0b0e', 8, 18]} />
      <ambientLight intensity={0.28} />
      <directionalLight
        castShadow
        position={[3.5, 6, 2.5]}
        intensity={1.45}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={12}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />
      <directionalLight position={[-2.5, 3, -2]} intensity={0.35} />
      <Arena />
      <ChoreProps
        boxX={state.boxX}
        boxY={state.boxY}
        boxHeld={state.boxHeld}
        robotX={state.x}
        robotY={state.y}
        robotTheta={state.theta}
      />
      <Ball x={state.ballX} y={state.ballY} />
      <Pebble x={state.x} y={state.y} theta={state.theta} pose={state.pose} colour={colour} />
      <ContactShadows position={[0, 0.001, 0]} opacity={0.55} scale={6} blur={2.6} far={2.5} />
      <ChaseCamera />
    </Canvas>
  )
}
