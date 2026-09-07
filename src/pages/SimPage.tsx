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
                <div className="splash-title">SANDBOX</div>
                <p className="splash-sub">
                  Imported Microduck + SO-101 CAD meshes. Auto seeker heads for the ball.
                  Meshes: microduck_rl (CC BY-SA-NC) + TheRobotStudio/SO-ARM100.
                </p>
                <div className="splash-cta">WALK IN</div>
                <div className="splash-enter">PRESS ENTER</div>
                <div className="splash-keys">
                  WASD / ARROWS MOVE · C CAMERA · R SIT · SPACE RESET · DRAG ORBIT · SCROLL ZOOM
                </div>
              </div>
            </button>
          )}
        </div>
      </SimProvider>
    </div>
  )
}
