import { useEffect, useState } from 'react'
import { Scene } from '../components/Scene'
import { COLOURWAYS } from '../product'
import { SimProvider } from '../sim/SimContext'
import { ControlsHelp } from '../ui/ControlsHelp'
import { HUD } from '../ui/HUD'
import { SimChrome } from '../ui/SimChrome'
import { TouchControls } from '../ui/TouchControls'

export function SimPage() {
  const [colourId, setColourId] = useState(COLOURWAYS[0].id)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Enter' && showSplash) setShowSplash(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showSplash])

  return (
    <div className="sim-page">
      <SimProvider>
        <div className="sim-stage">
          <Scene colourId={colourId} />
          {!showSplash && (
            <>
              <HUD />
              <SimChrome colourId={colourId} onColour={setColourId} />
              <ControlsHelp />
              <TouchControls />
            </>
          )}
          {showSplash && (
            <button type="button" className="splash" onClick={() => setShowSplash(false)}>
              <div className="splash-inner">
                <div className="splash-brand">PEBBLE</div>
                <p className="splash-sub">
                  W/S drive · A/D strafe · ←/→ turn · Q/E lift · F pick · Space e-stop/reset
                </p>
                <div className="splash-cta">DRIVE</div>
                <div className="splash-keys">
                  HouseHand v3 · omni deck · telescoping torso · dual SO-101
                </div>
              </div>
            </button>
          )}
        </div>
      </SimProvider>
    </div>
  )
}
