import type { PointerEvent } from 'react'
import { touchBias } from '../sim/keyboard'

function hold(axis: 'forward' | 'yawRate' | 'strafe', value: number) {
  return {
    onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      touchBias[axis] = value
    },
    onPointerUp: () => { touchBias[axis] = 0 },
    onPointerCancel: () => { touchBias[axis] = 0 },
  }
}

export function TouchControls() {
  return (
    <div className="touch-pad" aria-label="Touch teleop">
      <button type="button" className="touch-btn" {...hold('forward', 1)}>↑</button>
      <div className="touch-row">
        <button type="button" className="touch-btn" {...hold('yawRate', -1)}>←</button>
        <button type="button" className="touch-btn" {...hold('forward', -1)}>↓</button>
        <button type="button" className="touch-btn" {...hold('yawRate', 1)}>→</button>
      </div>
    </div>
  )
}
