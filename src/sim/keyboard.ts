/** Tank teleop: W/S forward, A/D yawRate. Q/E lift. F pick/drop. G chore demo. */
export type KeyState = {
  forward: number
  yawRate: number
  /** +1 raise / -1 lower lead-screw carriage */
  lift: number
  toggleMode: boolean
  toggleChase: boolean
  reset: boolean
  toggleSit: boolean
  togglePick: boolean
  toggleDemo: boolean
}

const pressed = new Set<string>()
let edgeMode = false
let edgeChase = false
let edgeReset = false
let edgeSit = false
let edgePick = false
let edgeDemo = false

function onKeyDown(e: KeyboardEvent) {
  if (e.repeat) return
  const tag = (e.target as HTMLElement | null)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
  pressed.add(e.code)
  if (e.code === 'Tab') { e.preventDefault(); edgeMode = true }
  if (e.code === 'KeyC') edgeChase = true
  if (e.code === 'Space') { e.preventDefault(); edgeReset = true }
  if (e.code === 'KeyR') edgeSit = true
  if (e.code === 'KeyF') edgePick = true
  if (e.code === 'KeyG') edgeDemo = true
}

function onKeyUp(e: KeyboardEvent) {
  pressed.delete(e.code)
}

export const touchBias = { forward: 0, yawRate: 0 }

export function installKeyboard(): () => void {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  return () => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    pressed.clear()
  }
}

export function sampleKeys(): KeyState {
  let forward = 0
  let yawRate = 0
  let lift = 0
  if (pressed.has('KeyW') || pressed.has('ArrowUp')) forward += 1
  if (pressed.has('KeyS') || pressed.has('ArrowDown')) forward -= 1
  if (pressed.has('KeyA') || pressed.has('ArrowLeft')) yawRate -= 1
  if (pressed.has('KeyD') || pressed.has('ArrowRight')) yawRate += 1
  if (pressed.has('KeyQ')) lift += 1
  if (pressed.has('KeyE')) lift -= 1
  forward += touchBias.forward
  yawRate += touchBias.yawRate
  forward = Math.max(-1, Math.min(1, forward))
  yawRate = Math.max(-1, Math.min(1, yawRate))
  lift = Math.max(-1, Math.min(1, lift))
  const out: KeyState = {
    forward, yawRate, lift,
    toggleMode: edgeMode, toggleChase: edgeChase,
    reset: edgeReset, toggleSit: edgeSit, togglePick: edgePick,
    toggleDemo: edgeDemo,
  }
  edgeMode = edgeChase = edgeReset = edgeSit = edgePick = edgeDemo = false
  return out
}
