/**
 * /model — clean orbit viewer of assembled robot only (no kitchen props).
 * Shared RobotAssembly with Sim. Fixed default AGL. No physics/WASD.
 */
import { useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { PCFShadowMap } from 'three'
import { COLOURWAYS } from '../product'
import { CHORE_ENVELOPE, TELESCOPE } from '../robot/dims'
import { TIP_SUMMARY } from '../robot/stability'
import { RobotAssembly } from '../components/RobotAssembly'
import { meshAttribution } from '../components/ImportedRobots'
import { kitCaption, kitLookHeightM } from '../kit/catalog'
import { useKit } from '../kit/KitContext'

export function ModelPage() {
  const [colourId, setColourId] = useState(COLOURWAYS[0].id)
  const { kit } = useKit()
  const colour = useMemo(
    () => COLOURWAYS.find((c) => c.id === colourId) ?? COLOURWAYS[0],
    [colourId],
  )
  const carriageAglMm = TELESCOPE.default_agl_mm

  return (
    <div className="model-page">
      <div className="model-stage">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [2.1, 1.05, 2.4], fov: 40, near: 0.02, far: 40 }}
          gl={{ antialias: true, toneMappingExposure: 1.15, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.shadowMap.type = PCFShadowMap
          }}
          style={{ width: '100%', height: '100%', background: '#0a0b0e' }}
        >
          <color attach="background" args={['#0a0b0e']} />
          <ambientLight intensity={0.48} />
          <directionalLight
            castShadow
            position={[3.2, 4.5, 2.2]}
            intensity={1.4}
            shadow-mapSize={[1024, 1024]}
            shadow-camera-far={14}
            shadow-camera-left={-3}
            shadow-camera-right={3}
            shadow-camera-top={3}
            shadow-camera-bottom={-2}
          />
          <directionalLight position={[-2.2, 2.8, -1.8]} intensity={0.4} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[8, 8]} />
            <meshStandardMaterial color="#1c1f28" roughness={0.95} metalness={0.05} />
          </mesh>
          <RobotAssembly colour={colour} carriageAglMm={carriageAglMm} showWipe />
          <ContactShadows position={[0, 0.001, 0]} opacity={0.5} scale={4} blur={2.4} far={2.0} />
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
            <div>
              {kitCaption(kit)}
            </div>
            <div className="model-caption-sub">
              Print: <code>print/lekiwi/</code>, XLeRobot <code>hardware/</code>, <code>print/SO101/Individual/</code>.
              Twin: LeKiwi kit 3-wheel mobile base → torso shell → dual XLe arms + OG head.
            </div>
            <div className="model-caption-sub">
              Q/E articulates SO-101 joints. Reach ~{CHORE_ENVELOPE.so101_reach_mm} mm. Tip margin ≈{TIP_SUMMARY.margin}×.
            </div>
            <div className="model-caption-attr">{meshAttribution(kit)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
