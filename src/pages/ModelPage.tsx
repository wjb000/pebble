/**
 * /model — clean orbit/pan/zoom viewer of the assembled robot only.
 * Shared RobotAssembly with Sim. Fixed default carriage AGL. No physics/WASD/train/chase.
 */
import { useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { COLOURWAYS } from '../product'
import { HEIGHT_NOTE, OVERALL_HEIGHT_MM, SCREW_ELEVATOR } from '../robot/dims'
import { RobotAssembly } from '../components/RobotAssembly'
import { MESH_ATTRIBUTION } from '../components/ImportedRobots'

export function ModelPage() {
  const [colourId, setColourId] = useState(COLOURWAYS[0].id)
  const colour = useMemo(
    () => COLOURWAYS.find((c) => c.id === colourId) ?? COLOURWAYS[0],
    [colourId],
  )
  const carriageAglMm = SCREW_ELEVATOR.default_agl_mm

  return (
    <div className="model-page">
      <div className="model-stage">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [1.6, 1.35, 2.4], fov: 40, near: 0.02, far: 40 }}
          gl={{ antialias: true, toneMappingExposure: 1.1 }}
          style={{ width: '100%', height: '100%', background: '#0a0b0e' }}
        >
          <color attach="background" args={['#0a0b0e']} />
          <ambientLight intensity={0.35} />
          <directionalLight
            castShadow
            position={[3.2, 5.5, 2.2]}
            intensity={1.4}
            shadow-mapSize={[1024, 1024]}
            shadow-camera-far={14}
            shadow-camera-left={-3}
            shadow-camera-right={3}
            shadow-camera-top={4}
            shadow-camera-bottom={-2}
          />
          <directionalLight position={[-2.2, 2.8, -1.8]} intensity={0.4} />
          <RobotAssembly colour={colour} carriageAglMm={carriageAglMm} />
          <ContactShadows position={[0, 0.001, 0]} opacity={0.5} scale={5} blur={2.4} far={2.2} />
          <OrbitControls
            makeDefault
            target={[0, 0.85, 0]}
            enablePan
            minDistance={0.6}
            maxDistance={6}
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
            <div>{OVERALL_HEIGHT_MM} mm · lift @ {carriageAglMm} mm AGL</div>
            <div className="model-caption-sub">
              Bought envelopes: 2040 extrusion box + T8 screw cylinder. {HEIGHT_NOTE}
            </div>
            <div className="model-caption-attr">{MESH_ATTRIBUTION}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
