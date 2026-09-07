/**
 * /model — clean orbit viewer of assembled robot only (no kitchen props).
 * Shared RobotAssembly with Sim. Fixed default AGL. No physics/WASD.
 */
import { useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { COLOURWAYS } from '../product'
import { CHORE_ENVELOPE, HEIGHT_NOTE, MGN12, OUTRIGGERS, OVERALL_HEIGHT_MM, SCREW_ELEVATOR, mmToM } from '../robot/dims'
import { TIP_SUMMARY } from '../robot/stability'
import { RobotAssembly } from '../components/RobotAssembly'
import { MESH_ATTRIBUTION } from '../components/ImportedRobots'

export function ModelPage() {
  const [colourId, setColourId] = useState(COLOURWAYS[0].id)
  const colour = useMemo(
    () => COLOURWAYS.find((c) => c.id === colourId) ?? COLOURWAYS[0],
    [colourId],
  )
  const carriageAglMm = SCREW_ELEVATOR.default_agl_mm
  const midY = mmToM(OVERALL_HEIGHT_MM) * 0.55

  return (
    <div className="model-page">
      <div className="model-stage">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [1.4, 1.1, 2.1], fov: 40, near: 0.02, far: 40 }}
          gl={{ antialias: true, toneMappingExposure: 1.1 }}
          style={{ width: '100%', height: '100%', background: '#0a0b0e' }}
        >
          <color attach="background" args={['#0a0b0e']} />
          <ambientLight intensity={0.35} />
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
          <RobotAssembly colour={colour} carriageAglMm={carriageAglMm} showWipe />
          <ContactShadows position={[0, 0.001, 0]} opacity={0.5} scale={4} blur={2.4} far={2.0} />
          <OrbitControls
            makeDefault
            target={[0, midY, 0]}
            enablePan
            minDistance={0.5}
            maxDistance={5}
            maxPolarAngle={Math.PI * 0.49}
            dampingFactor={0.08}
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
              {OVERALL_HEIGHT_MM} mm chore stack · lift @ {carriageAglMm} mm AGL · orbit / pan / zoom
            </div>
            <div className="model-caption-sub">
              <strong>Bought (not printed):</strong> 2040 (~1010 mm) + <strong>T8 REQUIRED</strong> +{' '}
              <strong>{MGN12.profile} REQUIRED</strong> + outriggers ({OUTRIGGERS.support_width_mm} mm, track 160 ≠ support) +{' '}
              {TIP_SUMMARY.ballast_kg} kg ballast <strong>REQUIRED</strong> + <strong>2× SO-101 kits</strong> (STS3215×12).
            </div>
            <div className="model-caption-sub">
              <strong>Printed:</strong> perceptron chassis · Prusa Z/carriage (GPL-2.0) · yoke/4040 L/R keyed ·
              cam 1:1 · soft pads + wipe. Twin arms = <em>link envelopes</em> only — BOM still costs real kits.
            </div>
            <div className="model-caption-sub">
              Reach: floor → counters ~{CHORE_ENVELOPE.counter_mm} · washer rim ~{CHORE_ENVELOPE.washer_rim_mm} ·
              SO-101 ~{CHORE_ENVELOPE.so101_reach_mm} mm. Tip margin ≈{TIP_SUMMARY.margin}×.
            </div>
            <div className="model-caption-sub">{HEIGHT_NOTE}</div>
            <div className="model-caption-attr">{MESH_ATTRIBUTION}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
