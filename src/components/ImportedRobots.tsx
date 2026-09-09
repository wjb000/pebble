/**
 * Twin CAD — LeKiwi kit mobile base (3-wheel omni, no arm)
 * + printable torso · XLe armbase + neck · 2× SO-101 · OG camera head.
 * No IKEA RÅSKOG cart / 4-wheel set (SIGRobotics / Vector-Wangel, Apache-2.0).
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  Group,
  LoadingManager,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from 'three'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import URDFLoader, { type URDFRobot } from 'urdf-loader'
import type { Colourway } from '../product'
import { OVERALL_HEIGHT_MM, TELESCOPE } from '../robot/dims'
import { kitCaption, type KitBuild } from '../kit/catalog'
import { getPerfTier } from '../kit/perf'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const LEKIWI_URDF = asset('assets/lekiwi/LeKiwi.urdf')
const LEKIWI_PATH = asset('assets/lekiwi/')
const SO101_URDF = asset('assets/so101/so101_new_calib.urdf')
const SO101_PATH = asset('assets/so101/')
const XLE_URDF = asset('assets/xlerobot/xlerobot/xlerobot.urdf')
const XLE_PATH = asset('assets/xlerobot/xlerobot/')
const TORSO_STL = asset('assets/xlerobot/hardware/torso_shell.stl')
const ARMBASE_STL = asset('assets/xlerobot/hardware/XLeRobot_035_armbase.stl')
const NECK_STL = asset('assets/xlerobot/hardware/XLeRobot040_neck_refined.stl')

/** LeKiwi: ROS Z-up → Three Y-up. */
const ROS_TO_THREE: [number, number, number] = [-Math.PI / 2, 0, Math.PI]
/** Shoulder pack / arms / head face rover-forward. */
const STACK_TO_THREE: [number, number, number] = [-Math.PI / 2, 0, Math.PI / 2]
const HEAD_TO_THREE: [number, number, number] = [-Math.PI / 2, 0, Math.PI / 2]
const SIT_EPS = 0.0005
/** Drop XLe head column from cart-top height toward the printable neck. */
const HEAD_DECK_DROP_M = 0.4
/** Half-span between SO-101 bases on the XLe 0.35 armbase (meters). */
const MOUNT_HALF_M = 0.11
/** Skip LeKiwi onboard arm + cam tower. Keep real omni wheels. */
const LEKIWI_SKIP_MESH =
  /Base_08|SO_ARM|Rotation_Pitch_08|Moving_Jaw|Passive_Horn|STS3215_03a|WaveShare_Mounting|Camera-Mount|Camera-Model|Top-V2/i
/** Extra skips on mobile / lean tier (not the omni wheels). */
const LEKIWI_LEAN_MESH =
  /ST3215_Servo_Motor|94868A713|Battery---|lipo_battery|servo_controller|Bottom-V2/i
/** XLe: keep OG head + cams only — skip cart, wheels, and both arms. */
const XLE_SKIP_MESH =
  /raskog(body|wheel)|\/Base\.stl|Base_Motor|Rotation_Pitch|Upper_Arm|Lower_Arm|Wrist_Pitch|Wrist_Roll|Fixed_Jaw|Moving_Jaw/i
const XLE_LEAN_MESH = /ply\.convex/i
const KIWI_PLATE_LINKS = ['base_plate_layer1-v5', 'base_plate_layer2-v3']
const HEAD_LINKS = [
  'top_base_link',
  'top_base_link_geom_1',
  'head_pan_link',
  'head_pan_link_geom_1',
  'head_tilt_link',
  'head_tilt_link_geom_1',
]
/** Match torso XY to LeKiwi plate (~216 mm) — shell is 120 mm at unit scale. */
const TORSO_XY_SCALE = 0.001 * (216 / 120)
const TORSO_Z_SCALE = 0.001
const PRINT_SCALE = 0.001

function tintMesh(mesh: Mesh, hex: string, roughness = 0.58, metalness = 0.08) {
  const lean = getPerfTier().leanMeshes
  mesh.material = new MeshStandardMaterial({
    color: hex,
    roughness,
    metalness: lean ? 0 : metalness,
    flatShading: lean,
  })
  mesh.castShadow = !lean
  mesh.receiveShadow = !lean
}

function cadHeightMm(geom: BufferGeometry) {
  const b = geom.boundingBox
  if (!b) return 200
  return Math.max(20, b.max.z - b.min.z)
}

/** Collapse empty Z-gaps in multi-island CAD so printed parts sit as one solid. */
function collapseZGaps(geom: BufferGeometry, mergeGapMm = 8) {
  const pos = geom.attributes.position
  if (!pos || pos.count < 9) return geom

  let zMin = Infinity
  let zMax = -Infinity
  for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i)
    if (z < zMin) zMin = z
    if (z > zMax) zMax = z
  }
  const span = zMax - zMin
  if (!(span > 1)) return geom

  const bins = 64
  const counts = new Array<number>(bins).fill(0)
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getZ(i) - zMin) / span
    counts[Math.min(bins - 1, Math.max(0, Math.floor(t * bins)))]++
  }
  const thr = Math.max(6, pos.count * 0.002)
  const runs: Array<[number, number]> = []
  let start: number | null = null
  for (let i = 0; i <= bins; i++) {
    const solid = i < bins && counts[i] > thr
    if (solid) {
      if (start === null) start = i
    } else if (start !== null) {
      runs.push([start, i - 1])
      start = null
    }
  }
  if (runs.length <= 1) return geom

  const merged: Array<[number, number]> = []
  for (const run of runs) {
    const prev = merged[merged.length - 1]
    const gapMm = prev ? ((run[0] - prev[1] - 1) / bins) * span : Infinity
    if (prev && gapMm <= mergeGapMm) prev[1] = run[1]
    else merged.push([...run])
  }
  if (merged.length <= 1) return geom

  const segments = merged.map(([lo, hi]) => {
    const a = zMin + (lo / bins) * span
    const b = zMin + ((hi + 1) / bins) * span
    return { a, b, h: b - a }
  })

  const out = new Float32Array(pos.array.length)
  out.set(pos.array as Float32Array)
  for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i)
    let packed = z
    let cursor = segments[0].a
    let placed = false
    for (const seg of segments) {
      if (z < seg.a - 0.5) {
        packed = cursor
        placed = true
        break
      }
      if (z <= seg.b + 0.5) {
        packed = cursor + (z - seg.a)
        placed = true
        break
      }
      cursor += seg.h
    }
    if (!placed) packed = cursor
    out[i * 3 + 2] = packed
  }

  const clean = new BufferGeometry()
  clean.setAttribute('position', new BufferAttribute(out, 3))
  clean.computeBoundingBox()
  clean.computeVertexNormals()
  return clean
}

function footGeometry(geom: BufferGeometry) {
  const g = geom.clone()
  g.computeBoundingBox()
  const b = g.boundingBox
  if (b) {
    g.translate(-(b.min.x + b.max.x) * 0.5, -(b.min.y + b.max.y) * 0.5, -b.min.z)
  }
  g.computeBoundingBox()
  g.computeVertexNormals()
  return g
}

function usePreparedStl(url: string, opts?: { collapseGaps?: boolean }) {
  const raw = useLoader(STLLoader, url) as BufferGeometry
  return useMemo(() => {
    const solid = opts?.collapseGaps ? collapseZGaps(raw) : raw
    return footGeometry(solid)
  }, [raw, opts?.collapseGaps])
}

function meshLabel(obj: Object3D) {
  const parts: string[] = []
  let p: Object3D | null = obj
  for (let i = 0; i < 8 && p; i++) {
    if (p.name) parts.push(p.name)
    p = p.parent
  }
  return parts.join(' ').toLowerCase()
}

function nearestUrdfLink(obj: Object3D, robot: URDFRobot) {
  let p: Object3D | null = obj
  while (p) {
    if (p.name && robot.links[p.name]) return p.name
    p = p.parent
  }
  return null
}

function isLeKiwiArmMesh(n: string) {
  return (
    n.includes('base_08') ||
    n.includes('so_arm') ||
    n.includes('rotation_pitch_08') ||
    n.includes('wrist') ||
    n.includes('jaw') ||
    n.includes('passive_horn') ||
    n.includes('sts3215_03a') ||
    n.includes('waveshare_mounting_plate_01')
  )
}

function isLeKiwiCamTower(n: string) {
  return n.includes('camera-mount') || n.includes('camera-model') || n.includes('top-v2')
}

function applyLeKiwiVisibility(robot: URDFRobot) {
  robot.traverse((obj) => {
    const mesh = obj as Mesh
    if (!mesh.isMesh) return
    const n = meshLabel(obj)
    if (isLeKiwiCamTower(n) || isLeKiwiArmMesh(n)) {
      mesh.visible = false
      return
    }
    mesh.visible = true
  })
}

/** Paint every mesh the colourway primary (whole twin body). */
function colorizeRoot(root: Object3D, colour: Colourway) {
  const body = colour.primary
  root.traverse((obj) => {
    // Duck-type meshes — `instanceof Mesh` can fail across duplicated three builds.
    const mesh = obj as Mesh
    if (!mesh.isMesh || !mesh.geometry) return
    tintMesh(mesh, body, 0.55, 0.08)
  })
}

function liftT(carriageAglMm: number) {
  const span = TELESCOPE.max_agl_mm - TELESCOPE.min_agl_mm
  return span > 0 ? Math.max(0, Math.min(1, (carriageAglMm - TELESCOPE.min_agl_mm) / span)) : 0
}

function setJoint(robot: URDFRobot, name: string, value: number) {
  if (robot.joints[name]) robot.setJointValue(name, value)
}

function mapSo101Arm(
  robot: URDFRobot,
  carriageAglMm: number,
  armShoulderRad: number,
  armElbowRad: number,
  side: 'L' | 'R',
) {
  const t = liftT(carriageAglMm)
  // Same forward reach; slight outward pan only (no 180° group flip — that pointed one arm backward).
  setJoint(robot, 'shoulder_pan', side === 'L' ? 0.3 : -0.3)
  setJoint(robot, 'shoulder_lift', -0.25 - t * 0.2 + armShoulderRad * 0.35)
  setJoint(robot, 'elbow_flex', 1.0 - t * 0.25 + armElbowRad * 0.4)
  setJoint(robot, 'wrist_flex', -0.15)
  setJoint(robot, 'wrist_roll', 0)
  setJoint(robot, 'gripper', 0.35)
}

/** Keep OG head + RealSense cams; hide cart / arm leftovers / optical frames. */
function showXleHeadOnly(robot: URDFRobot) {
  for (const link of Object.values(robot.links)) link.visible = true
  robot.traverse((obj) => {
    const mesh = obj as Mesh
    const link = nearestUrdfLink(obj, robot)
    const linkN = (link ?? '').toLowerCase()
    if (
      linkN === 'chassis' ||
      linkN === 'world' ||
      linkN.includes('wheel') ||
      linkN.includes('raskog') ||
      linkN.includes('chassis_geom') ||
      linkN.includes('_frame')
    ) {
      if (mesh.isMesh) mesh.visible = false
      else if (linkN.includes('wheel') || linkN.includes('raskog') || linkN.includes('chassis_geom') || linkN.includes('_frame')) {
        obj.visible = false
      }
      return
    }
    if (!mesh.isMesh) return
    const keep =
      HEAD_LINKS.includes(link ?? '') ||
      linkN.includes('head_pan') ||
      linkN.includes('head_tilt') ||
      linkN.includes('top_base') ||
      linkN.includes('xlerobot_camera') ||
      linkN === 'head_camera_link'
    mesh.visible = keep
  })
  if (robot.links.chassis) robot.links.chassis.visible = true
}

function dropHeadToDeck(robot: URDFRobot) {
  const joint = robot.joints.fixed_top_base_link
  if (!joint) return
  if (joint.userData.deckBaseZ == null) joint.userData.deckBaseZ = joint.position.z
  joint.position.z = joint.userData.deckBaseZ - HEAD_DECK_DROP_M
  robot.updateMatrixWorld(true)
}

/** Highest mesh-bottom under base_link ≈ circular flange (ignore hangers below). */
function mountFlangeBottomY(robot: URDFRobot) {
  let plateY: number | null = null
  let bestHigh = -Infinity
  let found = false
  robot.traverse((obj) => {
    const mesh = obj as Mesh
    if (!mesh.isMesh || !mesh.visible || !mesh.geometry) return
    const link = nearestUrdfLink(obj, robot)
    if (link !== 'base_link') return
    const label = `${obj.name} ${meshLabel(obj)}`.toLowerCase()
    const b = new Box3().setFromObject(mesh)
    if (!Number.isFinite(b.min.y)) return
    if (label.includes('base_so101')) {
      plateY = b.min.y
      return
    }
    if (b.min.y > bestHigh) {
      bestHigh = b.min.y
      found = true
    }
  })
  if (plateY != null) return plateY
  return found ? bestHigh : null
}

function seatArmFlange(group: Group, robot: URDFRobot, deckTopY: number) {
  group.updateWorldMatrix(true, true)
  robot.updateMatrixWorld(true)
  // Two passes — flange AABB can shift slightly after the first nudge.
  for (let i = 0; i < 2; i++) {
    let bottom = mountFlangeBottomY(robot)
    if (bottom == null) {
      const world = new Vector3()
      group.getWorldPosition(world)
      bottom = world.y
    }
    nudgeWorldY(group, deckTopY - SIT_EPS - bottom)
    group.updateWorldMatrix(true, true)
    robot.updateMatrixWorld(true)
  }
}

function visibleWorldBox(root: Object3D) {
  root.updateWorldMatrix(true, true)
  const box = new Box3()
  let any = false
  root.traverse((obj) => {
    const mesh = obj as Mesh
    if (!mesh.isMesh || !mesh.geometry || !mesh.visible) return
    let p: Object3D | null = obj
    while (p) {
      if (!p.visible) return
      p = p.parent
    }
    const b = new Box3().setFromObject(obj)
    if (Number.isFinite(b.min.y) && Number.isFinite(b.max.y)) {
      box.union(b)
      any = true
    }
  })
  return any ? box : null
}

function meshBoxForLinks(robot: URDFRobot, names: string[]) {
  const want = new Set(names)
  const box = new Box3()
  let any = false
  robot.updateWorldMatrix(true, true)
  robot.traverse((obj) => {
    const mesh = obj as Mesh
    if (!mesh.isMesh || !mesh.visible || !mesh.geometry) return
    const link = nearestUrdfLink(obj, robot)
    if (!link || !want.has(link)) return
    const b = new Box3().setFromObject(obj)
    if (Number.isFinite(b.min.y)) {
      box.union(b)
      any = true
    }
  })
  return any ? box : null
}

/** Move `obj` in parent-local space so its world Y shifts by `dy`. */
function nudgeWorldY(obj: Object3D, dy: number) {
  if (Math.abs(dy) < 1e-6) return
  const parent = obj.parent
  if (!parent) {
    obj.position.y += dy
    return
  }
  const world = new Vector3()
  obj.getWorldPosition(world)
  world.y += dy
  parent.worldToLocal(world)
  obj.position.copy(world)
}

/** Zero parent poses while seating so Sim drive/yaw cannot warp AABBs. */
function withIdentityParents(obj: Object3D, fn: () => void) {
  type Saved = { o: Object3D; x: number; y: number; z: number; rx: number; ry: number; rz: number }
  const saved: Saved[] = []
  let p: Object3D | null = obj.parent
  while (p) {
    saved.push({
      o: p,
      x: p.position.x,
      y: p.position.y,
      z: p.position.z,
      rx: p.rotation.x,
      ry: p.rotation.y,
      rz: p.rotation.z,
    })
    p.position.set(0, 0, 0)
    p.rotation.set(0, 0, 0)
    p = p.parent
  }
  obj.updateWorldMatrix(true, true)
  try {
    fn()
  } finally {
    for (const s of saved) {
      s.o.position.set(s.x, s.y, s.z)
      s.o.rotation.set(s.rx, s.ry, s.rz)
    }
    obj.updateWorldMatrix(true, true)
  }
}

function useUrdf(url: string, workingPath: string, skipMesh?: RegExp, leanMesh?: RegExp) {
  const [robot, setRobot] = useState<URDFRobot | null>(null)
  const [generation, setGeneration] = useState(0)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    let parsed: URDFRobot | null = null
    let meshesDone = false
    let pendingMeshes = 0
    let urdfParsed = false

    const finish = () => {
      if (cancelled || !parsed || !meshesDone || !urdfParsed) return
      // Require at least one real mesh when the URDF requested any.
      let meshCount = 0
      parsed.traverse((obj) => {
        if ((obj as Mesh).isMesh) meshCount++
      })
      if (pendingMeshes > 0 && meshCount === 0) return
      setRobot(parsed)
      setGeneration((g) => g + 1)
    }

    const manager = new LoadingManager()
    manager.onLoad = () => {
      meshesDone = true
      finish()
    }
    manager.onError = (res) => {
      console.error('URDF mesh failed', res)
      if (!cancelled) setFailed(true)
    }
    const loader = new URDFLoader(manager)
    loader.workingPath = workingPath
    loader.parseCollision = false
    loader.parseVisual = true
    const defaultMesh = loader.defaultMeshLoader.bind(loader)
    loader.loadMeshCb = (path, mgr, material, done) => {
      if (skipMesh?.test(path) || leanMesh?.test(path)) {
        done(new Object3D())
        return
      }
      pendingMeshes++
      defaultMesh(path, mgr, material, (scene, err) => {
        pendingMeshes = Math.max(0, pendingMeshes - 1)
        done(scene, err)
        if (urdfParsed && pendingMeshes === 0) {
          meshesDone = true
          finish()
        }
      })
    }
    loader.load(
      url,
      (r) => {
        parsed = r
        urdfParsed = true
        // If every mesh was sync-skipped / already loaded, close out.
        queueMicrotask(() => {
          const mgr = manager as LoadingManager & { itemsTotal?: number; itemsLoaded?: number }
          const total = mgr.itemsTotal ?? 0
          const loaded = mgr.itemsLoaded ?? 0
          if (pendingMeshes === 0 && (total === 0 || loaded >= total)) {
            meshesDone = true
            finish()
          }
        })
      },
      undefined,
      (err) => {
        console.error('URDF failed to load', url, err)
        if (!cancelled) setFailed(true)
      },
    )
    return () => {
      cancelled = true
    }
  }, [url, workingPath, skipMesh, leanMesh])

  return { robot, generation, failed }
}

export function WheeledChassis({
  colour,
  carriageAglMm,
  armShoulderRad = 0,
  armElbowRad = 0,
  showWipe = true,
}: {
  colour: Colourway
  carriageAglMm: number
  armShoulderRad?: number
  armElbowRad?: number
  showWipe?: boolean
}) {
  void showWipe
  const perf = useMemo(() => getPerfTier(), [])
  const lekiwiLean = perf.leanMeshes ? LEKIWI_LEAN_MESH : undefined
  const xleLean = perf.leanMeshes ? XLE_LEAN_MESH : undefined
  const lekiwi = useUrdf(LEKIWI_URDF, LEKIWI_PATH, LEKIWI_SKIP_MESH, lekiwiLean)
  // Separate URLs so each arm gets its own Object3D tree.
  const so101L = useUrdf(`${SO101_URDF}?side=L`, SO101_PATH)
  const so101R = useUrdf(`${SO101_URDF}?side=R`, SO101_PATH)
  const xleHead = useUrdf(XLE_URDF, XLE_PATH, XLE_SKIP_MESH, xleLean)

  const torsoGeom = usePreparedStl(TORSO_STL)
  const armbaseGeom = usePreparedStl(ARMBASE_STL, { collapseGaps: true })
  const neckGeom = usePreparedStl(NECK_STL, { collapseGaps: true })
  const torsoMm = useMemo(() => cadHeightMm(torsoGeom), [torsoGeom])
  const armMm = useMemo(() => cadHeightMm(armbaseGeom), [armbaseGeom])
  const neckMm = useMemo(() => cadHeightMm(neckGeom), [neckGeom])

  const rootRef = useRef<Group>(null)
  const kiwiRef = useRef<Group>(null)
  const stackRef = useRef<Group>(null)
  const armbaseRef = useRef<Mesh>(null)
  const neckRef = useRef<Group>(null)
  const armLRef = useRef<Group>(null)
  const armRRef = useRef<Group>(null)
  const headRef = useRef<Group>(null)
  const [floorY, setFloorY] = useState(0)
  const [stackPose, setStackPose] = useState({ x: 0, y: 0, z: 0 })
  const [armLPose, setArmLPose] = useState({ x: 0, y: 0, z: 0 })
  const [armRPose, setArmRPose] = useState({ x: 0, y: 0, z: 0 })
  const [headPose, setHeadPose] = useState({ x: 0, y: 0, z: 0 })
  const [revealed, setRevealed] = useState(false)

  const assembled = !!(lekiwi.robot && so101L.robot && so101R.robot && xleHead.robot)
  const loading =
    (!lekiwi.robot && !lekiwi.failed) ||
    (!so101L.robot && !so101L.failed) ||
    (!so101R.robot && !so101R.failed) ||
    (!xleHead.robot && !xleHead.failed)

  useLayoutEffect(() => {
    if (!lekiwi.robot) return
    applyLeKiwiVisibility(lekiwi.robot)
    colorizeRoot(lekiwi.robot, colour)
  }, [lekiwi.robot, lekiwi.generation, colour])

  useLayoutEffect(() => {
    if (!so101L.robot) return
    colorizeRoot(so101L.robot, colour)
    mapSo101Arm(so101L.robot, carriageAglMm, armShoulderRad, armElbowRad, 'L')
  }, [so101L.robot, so101L.generation, colour, carriageAglMm, armShoulderRad, armElbowRad])

  useLayoutEffect(() => {
    if (!so101R.robot) return
    colorizeRoot(so101R.robot, colour)
    mapSo101Arm(so101R.robot, carriageAglMm, armShoulderRad, armElbowRad, 'R')
  }, [so101R.robot, so101R.generation, colour, carriageAglMm, armShoulderRad, armElbowRad])

  useLayoutEffect(() => {
    if (!xleHead.robot) return
    dropHeadToDeck(xleHead.robot)
    showXleHeadOnly(xleHead.robot)
    colorizeRoot(xleHead.robot, colour)
    setJoint(xleHead.robot, 'head_pan_joint', 0)
    setJoint(xleHead.robot, 'head_tilt_joint', 0.12)
  }, [xleHead.robot, xleHead.generation, colour])

  useLayoutEffect(() => {
    const root = rootRef.current
    const kiwiG = kiwiRef.current
    const stack = stackRef.current
    const neckG = neckRef.current
    const armL = armLRef.current
    const armR = armRRef.current
    const headG = headRef.current
    if (!root) return

    withIdentityParents(root, () => {
      root.position.y = 0
      if (stack) stack.position.set(0, 0, 0)
      if (headG) headG.position.set(0, 0, 0)
      root.updateWorldMatrix(true, true)

      // 1) Park LeKiwi wheels on the floor.
      const kiwiBox = kiwiG ? visibleWorldBox(kiwiG) : null
      const nextFloor = kiwiBox ? -kiwiBox.min.y + SIT_EPS : 0
      root.position.y = nextFloor
      root.updateWorldMatrix(true, true)

      // 2) Sit printable stack on the LeKiwi top plate.
      const plateBox = lekiwi.robot ? meshBoxForLinks(lekiwi.robot, KIWI_PLATE_LINKS) : null
      const plateCx = plateBox ? (plateBox.min.x + plateBox.max.x) * 0.5 : 0
      const plateCz = plateBox ? (plateBox.min.z + plateBox.max.z) * 0.5 : 0
      const plateTop = plateBox?.max.y ?? kiwiBox?.max.y ?? nextFloor

      const nextStack = {
        x: plateCx,
        y: plateTop - SIT_EPS - nextFloor,
        z: plateCz,
      }
      if (stack) stack.position.set(nextStack.x, nextStack.y, nextStack.z)

      // 3) Seat both SO-101 circular flanges flush on the armbase top.
      const shoulderTopM = (torsoMm + armMm) * PRINT_SCALE
      if (armL) armL.position.set(0, -MOUNT_HALF_M, shoulderTopM)
      if (armR) armR.position.set(0, MOUNT_HALF_M, shoulderTopM)
      root.updateWorldMatrix(true, true)

      const shoulders = armbaseRef.current ? new Box3().setFromObject(armbaseRef.current) : null
      const mountTop =
        shoulders && Number.isFinite(shoulders.max.y) && shoulders.max.y - shoulders.min.y > 0.01
          ? shoulders.max.y
          : plateTop + shoulderTopM

      if (armL && so101L.robot) seatArmFlange(armL, so101L.robot, mountTop)
      if (armR && so101R.robot) seatArmFlange(armR, so101R.robot, mountTop)
      const nextArmL = armL
        ? { x: armL.position.x, y: armL.position.y, z: armL.position.z }
        : { x: 0, y: -MOUNT_HALF_M, z: shoulderTopM }
      const nextArmR = armR
        ? { x: armR.position.x, y: armR.position.y, z: armR.position.z }
        : { x: 0, y: MOUNT_HALF_M, z: shoulderTopM }

      // 4) Seat OG camera head on the neck top.
      const nextHead = { x: 0, y: 0, z: 0 }
      if (headG && xleHead.robot) {
        dropHeadToDeck(xleHead.robot)
        showXleHeadOnly(xleHead.robot)
        headG.position.set(0, 0, 0)
        root.updateWorldMatrix(true, true)
        const neckBox = neckG ? visibleWorldBox(neckG) : null
        const headBox = meshBoxForLinks(xleHead.robot, HEAD_LINKS) ?? visibleWorldBox(headG)
        if (neckBox && headBox) {
          nextHead.x = (neckBox.min.x + neckBox.max.x) * 0.5 - (headBox.min.x + headBox.max.x) * 0.5
          nextHead.z = (neckBox.min.z + neckBox.max.z) * 0.5 - (headBox.min.z + headBox.max.z) * 0.5
          nextHead.y = neckBox.max.y - SIT_EPS - headBox.min.y
        } else if (neckBox) {
          nextHead.x = (neckBox.min.x + neckBox.max.x) * 0.5
          nextHead.z = (neckBox.min.z + neckBox.max.z) * 0.5
          nextHead.y = neckBox.max.y - SIT_EPS
        }
        headG.position.set(nextHead.x, nextHead.y, nextHead.z)
      }

      if (lekiwi.robot) colorizeRoot(lekiwi.robot, colour)
      if (so101L.robot) colorizeRoot(so101L.robot, colour)
      if (so101R.robot) colorizeRoot(so101R.robot, colour)
      if (xleHead.robot) colorizeRoot(xleHead.robot, colour)

      setFloorY((y) => (Math.abs(y - nextFloor) > 1e-4 ? nextFloor : y))
      setStackPose((prev) =>
        Math.abs(prev.x - nextStack.x) > 1e-4 ||
        Math.abs(prev.y - nextStack.y) > 1e-4 ||
        Math.abs(prev.z - nextStack.z) > 1e-4
          ? nextStack
          : prev,
      )
      setArmLPose((prev) =>
        Math.abs(prev.x - nextArmL.x) > 1e-4 ||
        Math.abs(prev.y - nextArmL.y) > 1e-4 ||
        Math.abs(prev.z - nextArmL.z) > 1e-4
          ? nextArmL
          : prev,
      )
      setArmRPose((prev) =>
        Math.abs(prev.x - nextArmR.x) > 1e-4 ||
        Math.abs(prev.y - nextArmR.y) > 1e-4 ||
        Math.abs(prev.z - nextArmR.z) > 1e-4
          ? nextArmR
          : prev,
      )
      setHeadPose((prev) =>
        Math.abs(prev.x - nextHead.x) > 1e-4 ||
        Math.abs(prev.y - nextHead.y) > 1e-4 ||
        Math.abs(prev.z - nextHead.z) > 1e-4
          ? nextHead
          : prev,
      )
      setRevealed(true)
    })
  }, [
    lekiwi.robot,
    so101L.robot,
    so101R.robot,
    xleHead.robot,
    lekiwi.generation,
    so101L.generation,
    so101R.generation,
    xleHead.generation,
    torsoMm,
    armMm,
    neckMm,
    carriageAglMm,
    armShoulderRad,
    armElbowRad,
    colour,
  ])

  useEffect(() => {
    if (!assembled) setRevealed(false)
  }, [assembled])

  const shadows = !perf.leanMeshes

  return (
    <group>
      <group ref={rootRef} position={[0, floorY, 0]} visible={revealed}>
        {lekiwi.robot ? (
          <group ref={kiwiRef} rotation={ROS_TO_THREE}>
            <primitive object={lekiwi.robot} />
          </group>
        ) : null}

        {assembled ? (
          <>
            <group ref={stackRef} rotation={STACK_TO_THREE} position={[stackPose.x, stackPose.y, stackPose.z]}>
              <group scale={[TORSO_XY_SCALE, TORSO_XY_SCALE, TORSO_Z_SCALE]}>
                <mesh geometry={torsoGeom} castShadow={shadows} receiveShadow={shadows}>
                  <meshStandardMaterial color={colour.primary} roughness={0.55} metalness={0.08} />
                </mesh>
              </group>

              <group scale={PRINT_SCALE}>
                <mesh
                  ref={armbaseRef}
                  geometry={armbaseGeom}
                  position={[0, 0, torsoMm]}
                  castShadow={shadows}
                  receiveShadow={shadows}
                >
                  <meshStandardMaterial color={colour.primary} roughness={0.5} metalness={0.1} />
                </mesh>
                <group ref={neckRef} position={[0, 0, torsoMm + armMm]}>
                  <mesh geometry={neckGeom} castShadow={shadows} receiveShadow={shadows}>
                    <meshStandardMaterial color={colour.primary} roughness={0.52} metalness={0.1} />
                  </mesh>
                </group>
              </group>

              {/* Both arms face forward with mirrored outward pan — no π flip. */}
              <group ref={armLRef} position={[armLPose.x, armLPose.y, armLPose.z]}>
                <primitive object={so101L.robot!} />
              </group>
              <group ref={armRRef} position={[armRPose.x, armRPose.y, armRPose.z]}>
                <primitive object={so101R.robot!} />
              </group>
            </group>

            <group ref={headRef} rotation={HEAD_TO_THREE} position={[headPose.x, headPose.y, headPose.z]}>
              <primitive object={xleHead.robot!} />
            </group>
          </>
        ) : null}
      </group>

      {loading || !revealed ? (
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[0.16, 0.42, 0.16]} />
          <meshStandardMaterial color="#64748b" wireframe transparent opacity={0.5} />
        </mesh>
      ) : null}
    </group>
  )
}

export function meshAttribution(kit: KitBuild) {
  return (
    `${kitCaption(kit)}. ` +
    `LeKiwi kit mobile base (SIGRobotics-UIUC) · printable torso · XLe arm-base + neck · ` +
    `2× SO-101 + OG camera head (TheRobotStudio / Vector-Wangel), Apache-2.0. ` +
    `Stack: LeKiwi plate → torso → arm-base → SO-101s → neck → OG cam head. ` +
    `No IKEA RÅSKOG cart/wheels. Overall BOM stack ~${OVERALL_HEIGHT_MM} mm optional.`
  )
}

export const MESH_ATTRIBUTION = meshAttribution({
  preset: 'xlerobot',
  base: 'lekiwi',
  arms: 'xlerobot',
  head: 'xlerobot',
})
