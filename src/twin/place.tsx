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
import { TransformControls } from '@react-three/drei'
import { Group } from 'three'

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
  gizmoTick: number
  setUnlocked: (id: PartId | null) => void
  setSelected: (id: PartId | null) => void
  setNudge: (id: PartId, n: Nudge) => void
  setMode: (mode: 'translate' | 'rotate') => void
  setSnap: (snap: boolean) => void
  resetPart: (id: PartId) => void
  resetAll: () => void
}

const PlaceContext = createContext<PlaceApi | null>(null)

export function TwinPlaceProvider({ children }: { children: ReactNode }) {
  const [seated, setSeated] = useState(false)
  const [unlocked, setUnlockedState] = useState<PartId | null>(null)
  const [selected, setSelected] = useState<PartId | null>(null)
  const [nudges, setNudges] = useState<NudgeMap>(loadNudges)
  const [mode, setMode] = useState<'translate' | 'rotate'>('translate')
  const [snap, setSnap] = useState(true)
  const [gizmoTick, setGizmoTick] = useState(0)
  const objects = useRef<Partial<Record<PartId, Group>>>({})

  const setUnlocked = useCallback((id: PartId | null) => {
    setUnlockedState(id)
    if (id) setSelected(id)
  }, [])

  const registerObject = useCallback((id: PartId, obj: Group | null) => {
    const prev = objects.current[id] ?? null
    if (prev === obj) return
    if (obj) objects.current[id] = obj
    else delete objects.current[id]
    setGizmoTick((t) => t + 1)
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
      markSeated: () => setSeated(true),
      registerObject,
      getObject,
      gizmoTick,
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
      gizmoTick,
      registerObject,
      getObject,
      setUnlocked,
      setNudge,
      resetPart,
      resetAll,
    ],
  )

  return <PlaceContext.Provider value={api}>{children}</PlaceContext.Provider>
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
  gizmoTick: 0,
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

/** Wrapper whose local transform is the user nudge. */
export function Placeable({ id, children }: { id: PartId; children: ReactNode }) {
  const { enabled, seated, unlocked, nudges, setUnlocked, setSelected, registerObject } = useTwinPlace()
  const ref = useRef<Group>(null)
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

  if (!enabled) return <>{children}</>

  return (
    <group
      ref={setRef}
      onClick={(e) => {
        e.stopPropagation()
        if (unlocked) setUnlocked(id)
        else setSelected(id)
      }}
    >
      {children}
    </group>
  )
}

/** World-space gizmo — must sit outside the mm print-scale group. */
export function PlaceGizmo() {
  const { enabled, unlocked, mode, snap, gizmoTick, getObject, setNudge } = useTwinPlace()
  void gizmoTick
  if (!enabled || !unlocked) return null
  const obj = getObject(unlocked)
  if (!obj) return null
  const units = PART_META[unlocked].units
  void units
  return (
    <TransformControls
      object={obj}
      mode={mode}
      space="world"
      size={0.85}
      translationSnap={snap ? 0.001 : undefined}
      rotationSnap={snap ? Math.PI / 180 : undefined}
      onObjectChange={() => {
        setNudge(unlocked, {
          x: obj.position.x,
          y: obj.position.y,
          z: obj.position.z,
          rx: obj.rotation.x,
          ry: obj.rotation.y,
          rz: obj.rotation.z,
        })
      }}
    />
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
  } = useTwinPlace()
  const [copied, setCopied] = useState(false)
  if (!enabled) return null

  return (
    <div className="hud-box model-place">
      <div className="hud-label">PLACE</div>
      <div className="place-hint">
        Unlock a part, drag, then Lock. Tell me to bake when it looks right.
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
