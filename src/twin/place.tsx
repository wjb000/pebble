/**
 * Unlock / move / relock twin STLs on /model.
 * Offsets stay in localStorage until we bake them into the kit.
 */
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
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

type PlaceApi = {
  enabled: boolean
  seated: boolean
  unlocked: PartId | null
  selected: PartId | null
  nudges: NudgeMap
  mode: 'translate' | 'rotate'
  snap: boolean
  markSeated: () => void
  registerObject: (id: PartId, obj: Group | null) => void
  getObject: (id: PartId) => Group | null
  setUnlocked: (id: PartId | null) => void
  setSelected: (id: PartId | null) => void
  setNudge: (id: PartId, n: Nudge) => void
  setMode: (mode: 'translate' | 'rotate') => void
  setSnap: (snap: boolean) => void
  resetPart: (id: PartId) => void
  resetAll: () => void
}

const PlaceContext = createContext<PlaceApi | null>(null)
const PlaceStaticContext = createContext<{ enabled: boolean; markSeated: () => void } | null>(null)

export function TwinPlaceProvider({ children }: { children: ReactNode }) {
  const [seated, setSeated] = useState(false)
  const [unlocked, setUnlockedState] = useState<PartId | null>(null)
  const [selected, setSelected] = useState<PartId | null>(null)
  const [nudges, setNudges] = useState<NudgeMap>(loadNudges)
  const [mode, setMode] = useState<'translate' | 'rotate'>('translate')
  const [snap, setSnap] = useState(true)
  const objects = useRef<Partial<Record<PartId, Group>>>({})

  const markSeated = useCallback(() => setSeated(true), [])

  const setUnlocked = useCallback((id: PartId | null) => {
    setUnlockedState(id)
    if (id) setSelected(id)
  }, [])

  const registerObject = useCallback((id: PartId, obj: Group | null) => {
    if (obj) objects.current[id] = obj
    else delete objects.current[id]
  }, [])

  const getObject = useCallback((id: PartId) => objects.current[id] ?? null, [])

  const setNudge = useCallback((id: PartId, n: Nudge) => {
    setNudges((prev) => {
      const p = prev[id]
      if (
        p &&
        Math.abs(p.x - n.x) < 1e-8 &&
        Math.abs(p.y - n.y) < 1e-8 &&
        Math.abs(p.z - n.z) < 1e-8 &&
        Math.abs(p.rx - n.rx) < 1e-8 &&
        Math.abs(p.ry - n.ry) < 1e-8 &&
        Math.abs(p.rz - n.rz) < 1e-8
      ) {
        return prev
      }
      const next = { ...prev, [id]: n }
      saveNudges(next)
      return next
    })
  }, [])

  const resetPart = useCallback((id: PartId) => {
    setNudges((prev) => {
      const next = { ...prev, [id]: { ...ZERO_NUDGE } }
      saveNudges(next)
      return next
    })
  }, [])

  const resetAll = useCallback(() => {
    const next = emptyNudges()
    saveNudges(next)
    setNudges(next)
    setUnlockedState(null)
  }, [])

  const api = useMemo<PlaceApi>(
    () => ({
      enabled: true,
      seated,
      unlocked,
      selected,
      nudges,
      mode,
      snap,
      markSeated,
      registerObject,
      getObject,
      setUnlocked,
      setSelected,
      setNudge,
      setMode,
      setSnap,
      resetPart,
      resetAll,
    }),
    [
      seated,
      unlocked,
      selected,
      nudges,
      mode,
      snap,
      markSeated,
      registerObject,
      getObject,
      setUnlocked,
      setNudge,
      resetPart,
      resetAll,
    ],
  )

  const staticApi = useMemo(
    () => ({ enabled: true as const, markSeated }),
    [markSeated],
  )

  return (
    <PlaceStaticContext.Provider value={staticApi}>
      <PlaceContext.Provider value={api}>{children}</PlaceContext.Provider>
    </PlaceStaticContext.Provider>
  )
}

const DISABLED: PlaceApi = {
  enabled: false,
  seated: true,
  unlocked: null,
  selected: null,
  nudges: emptyNudges(),
  mode: 'translate',
  snap: true,
  markSeated: () => undefined,
  registerObject: () => undefined,
  getObject: () => null,
  setUnlocked: () => undefined,
  setSelected: () => undefined,
  setNudge: () => undefined,
  setMode: () => undefined,
  setSnap: () => undefined,
  resetPart: () => undefined,
  resetAll: () => undefined,
}

export function useTwinPlace() {
  return useContext(PlaceContext) ?? DISABLED
}

export function usePlaceStatic() {
  return useContext(PlaceStaticContext) ?? { enabled: false, markSeated: () => undefined }
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
  const { enabled, seated, unlocked, nudges, mode, snap, setUnlocked, setSelected, registerObject, setNudge } =
    useTwinPlace()
  const { camera, controls } = useThree()
  const ref = useRef<Group>(null)
  const dragging = useRef(false)
  const lastX = useRef(0)
  const n = nudges[id]
  const apply = !enabled || seated
  const px = apply ? n.x : 0
  const py = apply ? n.y : 0
  const pz = apply ? n.z : 0
  const rx = apply ? n.rx : 0
  const ry = apply ? n.ry : 0
  const rz = apply ? n.rz : 0

  useLayoutEffect(() => {
    const o = ref.current
    if (!o || unlocked === id) return
    o.position.set(px, py, pz)
    o.rotation.set(rx, ry, rz)
  }, [px, py, pz, rx, ry, rz, unlocked, id])

  const setRef = useCallback(
    (node: Group | null) => {
      ref.current = node
      registerObject(id, node)
    },
    [id, registerObject],
  )

  const commit = useCallback(() => {
    const o = ref.current
    if (!o) return
    setNudge(id, {
      x: o.position.x,
      y: o.position.y,
      z: o.position.z,
      rx: o.rotation.x,
      ry: o.rotation.y,
      rz: o.rotation.z,
    })
  }, [id, setNudge])

  const setOrbit = (on: boolean) => {
    const c = controls as { enabled?: boolean } | null
    if (c && typeof c.enabled === 'boolean') c.enabled = on
  }

  if (!enabled) return <>{children}</>

  const active = unlocked === id

  return (
    <group
      ref={setRef}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        if (!active) {
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
        if (!dragging.current || !active) return
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
        commit()
        e.stopPropagation()
      }}
      onPointerMissed={() => undefined}
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
    setUnlocked,
    setSelected,
    setMode,
    setSnap,
    resetPart,
    resetAll,
    getObject,
    setNudge,
  } = useTwinPlace()
  const [copied, setCopied] = useState(false)
  if (!enabled) return null

  const bump = (axis: 'x' | 'y' | 'z', sign: number) => {
    if (!unlocked) return
    const step = (PART_META[unlocked].units === 'mm' ? 1 : 0.001) * sign * (snap ? 1 : 0.25)
    const o = getObject(unlocked)
    if (o) o.position[axis] += step
    const n = nudges[unlocked]
    setNudge(unlocked, { ...n, [axis]: (o ? o.position[axis] : n[axis] + step) })
  }
  const bumpYaw = (sign: number) => {
    if (!unlocked) return
    const step = ((snap ? 1 : 0.25) * Math.PI) / 180 * sign
    const o = getObject(unlocked)
    if (o) o.rotateOnWorldAxis(_up, step)
    const n = nudges[unlocked]
    setNudge(unlocked, {
      ...n,
      rx: o ? o.rotation.x : n.rx,
      ry: o ? o.rotation.y : n.ry,
      rz: o ? o.rotation.z : n.rz,
    })
  }

  return (
    <div className="hud-box model-place">
      <div className="hud-label">PLACE</div>
      <div className="place-hint">
        Unlock a part, drag it in the view (or use the mm buttons), then Lock.
        Tell me to bake when it looks right.
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
          onClick={() => setSnap(!snap)}
        >
          Snap
        </button>
      </div>
      {unlocked ? (
        <div className="place-toolbar">
          {(['x', 'y', 'z'] as const).map((axis) => (
            <span key={axis} className="place-axis">
              <button type="button" onClick={() => bump(axis, -1)}>
                −{axis.toUpperCase()}
              </button>
              <button type="button" onClick={() => bump(axis, 1)}>
                +{axis.toUpperCase()}
              </button>
            </span>
          ))}
          <button type="button" onClick={() => bumpYaw(-1)}>
            −YAW
          </button>
          <button type="button" onClick={() => bumpYaw(1)}>
            +YAW
          </button>
        </div>
      ) : null}
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
                <button type="button" className="place-on" onClick={() => setUnlocked(null)}>
                  Lock
                </button>
              ) : (
                <button type="button" onClick={() => setUnlocked(id)}>
                  Unlock
                </button>
              )}
              {fmt.moved ? (
                <button type="button" className="place-reset" onClick={() => {
                  if (unlocked === id) setUnlocked(null)
                  resetPart(id)
                }}>
                  Reset
                </button>
              ) : null}
              {fmt.moved || isUnlocked ? (
                <div className="place-readout">
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
