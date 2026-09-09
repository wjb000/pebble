import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { BasicShadowMap, PCFShadowMap } from 'three'
import { useSim } from '../sim/SimContext'
import { COLOURWAYS } from '../product'
import { Arena } from './Arena'
import { ChaseCamera } from './ChaseCamera'
import { Pebble } from './Pebble'
import { getPerfTier } from '../kit/perf'

/** Sim arena: floor + lights + intact twin only (no chore props / ball). */
export function Scene({ colourId }: { colourId: string }) {
  const { state } = useSim()
  const colour = COLOURWAYS.find((c) => c.id === colourId) ?? COLOURWAYS[0]
  const perf = useMemo(() => getPerfTier(), [])
  return (
    <Canvas
      shadows={perf.shadows}
      dpr={perf.dpr}
      camera={{ position: [0, 1.15, 2.8], fov: 42, near: 0.02, far: 40 }}
      gl={{
        antialias: perf.antialias,
        toneMappingExposure: 1.1,
        powerPreference: perf.mobile ? 'low-power' : 'high-performance',
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = perf.shadows
        gl.shadowMap.type = perf.mobile ? BasicShadowMap : PCFShadowMap
      }}
      style={{ width: '100%', height: '100%', background: '#12151c' }}
    >
      <color attach="background" args={['#12151c']} />
      <fog attach="fog" args={['#12151c', perf.mobile ? 10 : 7, perf.mobile ? 22 : 20]} />
      <ambientLight intensity={perf.mobile ? 0.78 : 0.62} />
      <directionalLight
        castShadow={perf.shadows}
        position={[3.5, 6, 2.5]}
        intensity={perf.mobile ? 1.15 : 1.35}
        shadow-mapSize={[perf.shadowMapSize, perf.shadowMapSize]}
        shadow-camera-far={16}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <directionalLight position={[-2.5, 3.2, -2]} intensity={perf.mobile ? 0.28 : 0.42} />
      <hemisphereLight args={['#9aa6b8', '#1a1e26', perf.mobile ? 0.28 : 0.35]} />
      <Arena />
      <Pebble
        x={state.x}
        y={state.y}
        theta={state.theta}
        colour={colour}
        carriageAglMm={state.carriageAglMm}
        tipOver={state.tipOver}
        armShoulderRad={state.armShoulderRad}
        armElbowRad={state.armElbowRad}
      />
      {perf.contactShadows ? (
        <ContactShadows position={[0, 0.002, 0]} opacity={0.38} scale={6} blur={2.8} far={2.5} />
      ) : null}
      <ChaseCamera />
    </Canvas>
  )
}
