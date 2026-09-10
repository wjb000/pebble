import { useEffect, useState } from 'react'
import { Scene } from '../components/Scene'
import { COLOURWAYS } from '../product'
import { SimProvider } from '../sim/SimContext'
import { ControlsHelp } from '../ui/ControlsHelp'
import { HUD } from '../ui/HUD'
import { SimChrome } from '../ui/SimChrome'
import { TouchControls } from '../ui/TouchControls'
import { TrainPanel } from '../ui/TrainPanel'

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
              <TrainPanel />
              <ControlsHelp />
              <TouchControls />
            </>
          )}
          {showSplash && (
            <button type="button" className="splash" onClick={() => setShowSplash(false)}>
              <div className="splash-inner">
                <div className="splash-brand">PEBBLE</div>
                <p className="splash-sub">
                  Teleop to record · Train BC · Test AI · W/S drive · Space e-stop
                </p>
                <div className="splash-cta">DRIVE</div>
                <div className="splash-keys">
                  LeKiwi omni + 2× SO-101 · print kit in Docs
                </div>
              </div>
            </button>
          )}
        </div>
      </SimProvider>
    </div>
  )
}
