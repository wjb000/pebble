/**
 * /model — clean orbit viewer of assembled robot only (no kitchen props).
 * Shared RobotAssembly with Sim. Fixed default AGL. No physics/WASD.
 */
import { useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { BasicShadowMap, PCFShadowMap } from 'three'
import { COLOURWAYS } from '../product'
import { CHORE_ENVELOPE, TELESCOPE } from '../robot/dims'
import { TIP_SUMMARY } from '../robot/stability'
import { RobotAssembly } from '../components/RobotAssembly'
import { kitCaption, kitLookHeightM } from '../kit/catalog'
import { useKit } from '../kit/KitContext'
import { getPerfTier } from '../kit/perf'

export function ModelPage() {
  const [colourId, setColourId] = useState(COLOURWAYS[0].id)
  const { kit } = useKit()
  const colour = useMemo(
    () => COLOURWAYS.find((c) => c.id === colourId) ?? COLOURWAYS[0],
    [colourId],
  )
  const carriageAglMm = TELESCOPE.default_agl_mm
  const perf = useMemo(() => getPerfTier(), [])

  return (
    <div className="model-page">
      <div className="model-stage">
        <Canvas
          shadows={perf.shadows}
          dpr={perf.dpr}
          camera={{ position: [2.1, 1.05, 2.4], fov: 40, near: 0.02, far: 40 }}
          gl={{
            antialias: perf.antialias,
            toneMappingExposure: 1.1,
            powerPreference: perf.mobile ? 'low-power' : 'high-performance',
          }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = perf.shadows
            gl.shadowMap.type = perf.mobile ? BasicShadowMap : PCFShadowMap
          }}
          style={{ width: '100%', height: '100%', background: '#0a0b0e' }}
        >
          <color attach="background" args={['#0a0b0e']} />
          <ambientLight intensity={perf.mobile ? 0.7 : 0.48} />
          <directionalLight
            castShadow={perf.shadows}
            position={[3.2, 4.5, 2.2]}
            intensity={perf.mobile ? 1.05 : 1.4}
            shadow-mapSize={[perf.shadowMapSize, perf.shadowMapSize]}
            shadow-camera-far={14}
            shadow-camera-left={-3}
            shadow-camera-right={3}
            shadow-camera-top={3}
            shadow-camera-bottom={-2}
          />
          {!perf.mobile ? <directionalLight position={[-2.2, 2.8, -1.8]} intensity={0.4} /> : null}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow={perf.shadows}>
            <planeGeometry args={[8, 8]} />
            <meshStandardMaterial color="#1c1f28" roughness={0.95} metalness={0.05} />
          </mesh>
          <RobotAssembly colour={colour} carriageAglMm={carriageAglMm} showWipe />
          {perf.contactShadows ? (
            <ContactShadows position={[0, 0.001, 0]} opacity={0.5} scale={4} blur={2.4} far={2.0} />
          ) : null}
          <OrbitControls
            makeDefault
            target={[0, kitLookHeightM(kit), 0]}
            enablePan
            enableDamping
            minDistance={0.45}
            maxDistance={10}
            maxPolarAngle={Math.PI * 0.49}
            dampingFactor={0.08}
            rotateSpeed={0.85}
            touches={{ ONE: 0, TWO: 2 }}
          />
        </Canvas>

        <div className="model-chrome">
          <div className="hud-box model-swatches">
            <div className="hud-label">COLOR</div>
            <div className="swatch-inline">
              {COLOURWAYS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  title={c.name}
                  className={`swatch-sq ${c.id === colourId ? 'active' : ''}`}
                  style={{ background: c.swatch }}
                  onClick={() => setColourId(c.id)}
                />
              ))}
            </div>
          </div>
          <div className="model-caption">
            <div>{kitCaption(kit)}</div>
            <div className="model-caption-sub">
              Q/E articulates arms · reach ~{CHORE_ENVELOPE.so101_reach_mm} mm · tip ≈{TIP_SUMMARY.margin}×
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
