/**
 * Unlock / move / relock twin STLs on /model.
 * Offsets stay in localStorage until we bake them into the kit.
 *
 * Placement UI state lives in a module store so Unlock/Lock only re-render the
 * HUD. Placeable meshes must not subscribe — reconciling the STL tree hangs
 * SwiftShader Chrome.
 */
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { useThree, type ThreeEvent } from '@react-three/fiber'
import { Group, Plane, Vector3 } from 'three'

export const PART_IDS = [
  'base',
  'stack',
  'torso',
  'deck',
  'neck',
  'head',
  'armL',
  'armR',
] as const

export type PartId = (typeof PART_IDS)[number]

export type Nudge = {
  x: number
  y: number
  z: number
  rx: number
  ry: number
  rz: number
}

export const ZERO_NUDGE: Nudge = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 }

export const PART_META: Record<PartId, { label: string; units: 'mm' | 'm' }> = {
  base: { label: 'Base (LeKiwi)', units: 'm' },
  stack: { label: 'HouseHand stack', units: 'm' },
  torso: { label: 'Torso', units: 'mm' },
  deck: { label: 'Shoulder deck', units: 'mm' },
  neck: { label: 'Neck', units: 'mm' },
  head: { label: 'Head', units: 'mm' },
  armL: { label: 'Arm L', units: 'mm' },
  armR: { label: 'Arm R', units: 'mm' },
}

const STORAGE_KEY = 'pebble.twinNudges.v1'

type NudgeMap = Record<PartId, Nudge>

function emptyNudges(): NudgeMap {
  return {
    base: { ...ZERO_NUDGE },
    stack: { ...ZERO_NUDGE },
    torso: { ...ZERO_NUDGE },
    deck: { ...ZERO_NUDGE },
    neck: { ...ZERO_NUDGE },
    head: { ...ZERO_NUDGE },
    armL: { ...ZERO_NUDGE },
    armR: { ...ZERO_NUDGE },
  }
}

function loadNudges(): NudgeMap {
  const next = emptyNudges()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return next
    const parsed = JSON.parse(raw) as Partial<Record<PartId, Partial<Nudge>>>
    for (const id of PART_IDS) {
      const n = parsed[id]
      if (!n) continue
      next[id] = {
        x: Number(n.x) || 0,
        y: Number(n.y) || 0,
        z: Number(n.z) || 0,
        rx: Number(n.rx) || 0,
        ry: Number(n.ry) || 0,
        rz: Number(n.rz) || 0,
      }
    }
  } catch {
    /* ignore */
  }
  return next
}

function saveNudges(nudges: NudgeMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nudges))
  } catch {
    /* ignore */
  }
}

export function formatNudge(id: PartId, n: Nudge) {
  const { units } = PART_META[id]
  const s = units === 'm' ? 1000 : 1
  const mm = (v: number) => (v * s).toFixed(1)
  const deg = (v: number) => ((v * 180) / Math.PI).toFixed(1)
  const moved = Math.hypot(n.x, n.y, n.z) > 1e-6 || Math.hypot(n.rx, n.ry, n.rz) > 1e-6
  return {
    moved,
    xyz: `${mm(n.x)}  ${mm(n.y)}  ${mm(n.z)} mm`,
    rpy: `${deg(n.rx)}  ${deg(n.ry)}  ${deg(n.rz)} °`,
  }
}

export function nudgesJson(nudges: NudgeMap) {
  const out: Record<string, { mm: [number, number, number]; deg: [number, number, number] }> = {}
  for (const id of PART_IDS) {
    const n = nudges[id]
    const s = PART_META[id].units === 'm' ? 1000 : 1
    out[id] = {
      mm: [n.x * s, n.y * s, n.z * s],
      deg: [(n.rx * 180) / Math.PI, (n.ry * 180) / Math.PI, (n.rz * 180) / Math.PI],
    }
  }
  return JSON.stringify(out, null, 2)
}

type PlaceSnapshot = {
  unlocked: PartId | null
  selected: PartId | null
  nudges: NudgeMap
  mode: 'translate' | 'rotate'
  snap: boolean
}

const objects: Partial<Record<PartId, Group>> = {}
const listeners = new Set<() => void>()

let snapshot: PlaceSnapshot = {
  unlocked: null,
  selected: null,
  nudges: typeof localStorage === 'undefined' ? emptyNudges() : loadNudges(),
  mode: 'translate',
  snap: true,
}

function emit() {
  for (const fn of listeners) fn()
}

function setSnapshot(partial: Partial<PlaceSnapshot>) {
  snapshot = { ...snapshot, ...partial }
  emit()
}

export function subscribePlace(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function getPlaceSnapshot() {
  return snapshot
}

export function getPlaceObject(id: PartId) {
  return objects[id] ?? null
}

function applyNudgeToObject(id: PartId, n: Nudge) {
  const o = objects[id]
  if (!o) return
  o.position.set(n.x, n.y, n.z)
  o.rotation.set(n.rx, n.ry, n.rz)
}

function commitObject(id: PartId) {
  const o = objects[id]
  if (!o) return
  const n: Nudge = {
    x: o.position.x,
    y: o.position.y,
    z: o.position.z,
    rx: o.rotation.x,
    ry: o.rotation.y,
    rz: o.rotation.z,
  }
  const next = { ...snapshot.nudges, [id]: n }
  saveNudges(next)
  setSnapshot({ nudges: next })
}

export function setUnlocked(id: PartId | null) {
  setSnapshot({ unlocked: id, selected: id ?? snapshot.selected })
}

export function setSelected(id: PartId | null) {
  setSnapshot({ selected: id })
}

export function setMode(mode: 'translate' | 'rotate') {
  setSnapshot({ mode })
}

export function setSnap(snap: boolean) {
  setSnapshot({ snap })
}

export function setNudge(id: PartId, n: Nudge) {
  const p = snapshot.nudges[id]
  if (
    p &&
    Math.abs(p.x - n.x) < 1e-8 &&
    Math.abs(p.y - n.y) < 1e-8 &&
    Math.abs(p.z - n.z) < 1e-8 &&
    Math.abs(p.rx - n.rx) < 1e-8 &&
    Math.abs(p.ry - n.ry) < 1e-8 &&
    Math.abs(p.rz - n.rz) < 1e-8
  ) {
    return
  }
  const next = { ...snapshot.nudges, [id]: n }
  saveNudges(next)
  applyNudgeToObject(id, n)
  setSnapshot({ nudges: next })
}

export function resetPart(id: PartId) {
  const next = { ...snapshot.nudges, [id]: { ...ZERO_NUDGE } }
  saveNudges(next)
  applyNudgeToObject(id, ZERO_NUDGE)
  setSnapshot({
    nudges: next,
    unlocked: snapshot.unlocked === id ? null : snapshot.unlocked,
  })
}

export function resetAll() {
  const next = emptyNudges()
  saveNudges(next)
  for (const id of PART_IDS) applyNudgeToObject(id, ZERO_NUDGE)
  setSnapshot({ nudges: next, unlocked: null })
}

const PlaceStaticContext = createContext<{ enabled: boolean; markSeated: () => void } | null>(null)

export function TwinPlaceProvider({ children }: { children: ReactNode }) {
  const markSeated = useCallback(() => undefined, [])
  const staticApi = useMemo(() => ({ enabled: true as const, markSeated }), [markSeated])

  useLayoutEffect(() => {
    return () => setUnlocked(null)
  }, [])

  return <PlaceStaticContext.Provider value={staticApi}>{children}</PlaceStaticContext.Provider>
}

export function usePlaceStatic() {
  return useContext(PlaceStaticContext) ?? { enabled: false, markSeated: () => undefined }
}

export function useTwinPlace() {
  const { enabled } = usePlaceStatic()
  const snap = useSyncExternalStore(subscribePlace, getPlaceSnapshot, getPlaceSnapshot)
  return {
    enabled,
    unlocked: snap.unlocked,
    selected: snap.selected,
    nudges: snap.nudges,
    mode: snap.mode,
    snap: snap.snap,
    setUnlocked,
    setSelected,
    setMode,
    setSnap,
    setNudge,
    resetPart,
    resetAll,
    getObject: getPlaceObject,
  }
}

function bumpAxis(id: PartId, axis: 'x' | 'y' | 'z', delta: number) {
  const o = objects[id]
  const cur = snapshot.nudges[id]
  const next = { ...cur, [axis]: (o ? o.position[axis] : cur[axis]) + delta }
  if (o) o.position[axis] = next[axis]
  setNudge(id, next)
}

function bumpYaw(id: PartId, deltaRad: number) {
  const o = objects[id]
  if (o) {
    o.rotateOnWorldAxis(_up, deltaRad)
    commitObject(id)
    return
  }
  setNudge(id, { ...snapshot.nudges[id], ry: snapshot.nudges[id].ry + deltaRad })
}

const _plane = new Plane()
const _hit = new Vector3()
const _world = new Vector3()
const _dir = new Vector3()
const _local = new Vector3()
const _grab = new Vector3()
const _up = new Vector3(0, 1, 0)

/** Wrapper whose local transform is the user nudge. Drag when unlocked. */
export function Placeable({ id, children }: { id: PartId; children: ReactNode }) {
  const { enabled } = usePlaceStatic()
  const { camera, controls } = useThree()
  const ref = useRef<Group>(null)
  const dragging = useRef(false)
  const lastX = useRef(0)

  useLayoutEffect(() => {
    if (!enabled) return
    const o = ref.current
    if (!o) return
    objects[id] = o
    const n = getPlaceSnapshot().nudges[id]
    o.position.set(n.x, n.y, n.z)
    o.rotation.set(n.rx, n.ry, n.rz)
    return () => {
      if (objects[id] === o) delete objects[id]
    }
  }, [enabled, id])

  const setOrbit = (on: boolean) => {
    const c = controls as { enabled?: boolean } | null
    if (c && typeof c.enabled === 'boolean') c.enabled = on
  }

  if (!enabled) return <>{children}</>

  return (
    <group
      ref={ref}
      userData={{ placeId: id }}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        const { unlocked } = getPlaceSnapshot()
        if (unlocked !== id) {
          if (unlocked) setUnlocked(id)
          else setSelected(id)
          return
        }
        dragging.current = true
        lastX.current = e.clientX
        setOrbit(false)
        const o = ref.current
        if (!o) return
        o.getWorldPosition(_world)
        camera.getWorldDirection(_dir)
        _plane.setFromNormalAndCoplanarPoint(_dir, _world)
        if (e.ray.intersectPlane(_plane, _hit)) _grab.copy(_world).sub(_hit)
        ;(e.target as unknown as Element).setPointerCapture?.(e.pointerId)
      }}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        if (!dragging.current) return
        const { unlocked, mode, snap } = getPlaceSnapshot()
        if (unlocked !== id) return
        e.stopPropagation()
        const o = ref.current
        if (!o?.parent) return
        if (mode === 'rotate') {
          const dx = e.clientX - lastX.current
          lastX.current = e.clientX
          o.rotateOnWorldAxis(_up, dx * 0.008)
          return
        }
        o.getWorldPosition(_world)
        camera.getWorldDirection(_dir)
        _plane.setFromNormalAndCoplanarPoint(_dir, _world)
        if (!e.ray.intersectPlane(_plane, _hit)) return
        _world.copy(_hit).add(_grab)
        o.parent.worldToLocal(_local.copy(_world))
        if (snap) {
          const step = PART_META[id].units === 'mm' ? 1 : 0.001
          _local.x = Math.round(_local.x / step) * step
          _local.y = Math.round(_local.y / step) * step
          _local.z = Math.round(_local.z / step) * step
        }
        o.position.copy(_local)
      }}
      onPointerUp={(e: ThreeEvent<PointerEvent>) => {
        if (!dragging.current) return
        dragging.current = false
        setOrbit(true)
        commitObject(id)
        e.stopPropagation()
      }}
    >
      {children}
    </group>
  )
}

export function PlaceHud() {
  const {
    enabled,
    unlocked,
    selected,
    nudges,
    mode,
    snap,
  } = useTwinPlace()
  const [copied, setCopied] = useState(false)
  if (!enabled) return null

  const bump = (axis: 'x' | 'y' | 'z', sign: number) => {
    if (!unlocked) return
    const step = (PART_META[unlocked].units === 'mm' ? 1 : 0.001) * sign * (snap ? 1 : 0.25)
    bumpAxis(unlocked, axis, step)
  }
  const yaw = (sign: number) => {
    if (!unlocked) return
    bumpYaw(unlocked, ((snap ? 1 : 0.25) * Math.PI) / 180 * sign)
  }

  return (
    <div className="hud-box model-place" data-place-hud="v2">
      <div className="hud-label">PLACE</div>
      <div className="place-hint">
        Unlock a part. Drag it, or tap ±X/Y/Z / ±YAW. Lock keeps the offset here
        (not in the STL). Tell me to bake when the stack looks right.
      </div>
      <div className="place-toolbar">
        <button
          type="button"
          className={mode === 'translate' ? 'place-on' : undefined}
          onClick={() => setMode('translate')}
        >
          Move
        </button>
        <button
          type="button"
          className={mode === 'rotate' ? 'place-on' : undefined}
          onClick={() => setMode('rotate')}
        >
          Rotate
        </button>
        <button
          type="button"
          className={snap ? 'place-on' : undefined}
          data-place-snap=""
          onClick={() => setSnap(!snap)}
        >
          Snap
        </button>
      </div>
      <div className="place-toolbar place-nudge">
        {(['x', 'y', 'z'] as const).map((axis) => (
          <span key={axis} className="place-axis">
            <button type="button" data-place-bump={`-${axis}`} disabled={!unlocked} onClick={() => bump(axis, -1)}>
              −{axis.toUpperCase()}
            </button>
            <button type="button" data-place-bump={`+${axis}`} disabled={!unlocked} onClick={() => bump(axis, 1)}>
              +{axis.toUpperCase()}
            </button>
          </span>
        ))}
        <button type="button" data-place-bump="-yaw" disabled={!unlocked} onClick={() => yaw(-1)}>
          −YAW
        </button>
        <button type="button" data-place-bump="+yaw" disabled={!unlocked} onClick={() => yaw(1)}>
          +YAW
        </button>
      </div>
      <ul className="place-list">
        {PART_IDS.map((id) => {
          const fmt = formatNudge(id, nudges[id])
          const isUnlocked = unlocked === id
          const isSel = selected === id
          return (
            <li key={id} className={isUnlocked ? 'unlocked' : isSel ? 'selected' : undefined}>
              <button type="button" className="place-name" onClick={() => setSelected(id)}>
                {PART_META[id].label}
                {fmt.moved ? <span className="place-dot" /> : null}
              </button>
              {isUnlocked ? (
                <button type="button" className="place-on" data-place-lock={id} onClick={() => setUnlocked(null)}>
                  Lock
                </button>
              ) : (
                <button type="button" data-place-unlock={id} onClick={() => setUnlocked(id)}>
                  Unlock
                </button>
              )}
              {fmt.moved ? (
                <button
                  type="button"
                  className="place-reset"
                  data-place-reset={id}
                  onClick={() => resetPart(id)}
                >
                  Reset
                </button>
              ) : null}
              {fmt.moved || isUnlocked ? (
                <div className="place-readout" data-place-readout={id}>
                  {fmt.xyz}
                  <br />
                  {fmt.rpy}
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
      <div className="place-toolbar">
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(nudgesJson(nudges)).then(() => {
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1500)
            })
          }}
        >
          {copied ? 'Copied' : 'Copy offsets'}
        </button>
        <button type="button" onClick={resetAll}>
          Reset all
        </button>
      </div>
    </div>
  )
}
