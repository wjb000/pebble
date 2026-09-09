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
  DoubleSide,
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
const TORSO_STL = asset('assets/xlerobot/hardware/torso_shell.stl')
const ARMBASE_STL = asset('assets/xlerobot/hardware/XLeRobot_035_armbase_symmetric.stl')
const NECK_STL = asset('assets/xlerobot/hardware/XLeRobot040_neck_refined.stl')
const HEAD_MOUNT_STL = asset('assets/xlerobot/xlerobot/meshes/xlerobot/assets/tophead1.stl')
const HEAD_CAM_STL = asset('assets/xlerobot/xlerobot/meshes/xlerobot/assets/XLeRobot_camera1.stl')

/** LeKiwi: ROS Z-up → Three Y-up. */
const ROS_TO_THREE: [number, number, number] = [-Math.PI / 2, 0, Math.PI]
/** Shoulder pack / arms / head face rover-forward. */
const STACK_TO_THREE: [number, number, number] = [-Math.PI / 2, 0, Math.PI / 2]
const SIT_EPS = 0.0005
/** Half-span between SO-101 bases — on the armbase top deck (~±60 mm), not past it. */
const MOUNT_HALF_M = 0.05
/** Visible ring around each SO-101 base so the plate reads on both sides. */
const MOUNT_PAD_INNER = 0.042
const MOUNT_PAD_OUTER = 0.078
const MOUNT_PAD_H = 0.014
/** Skip LeKiwi onboard arm + cam tower. Keep real omni wheels. */
const LEKIWI_SKIP_MESH =
  /Base_08|SO_ARM|Rotation_Pitch_08|Moving_Jaw|Passive_Horn|STS3215_03a|WaveShare_Mounting|Camera-Mount|Camera-Model|Top-V2/i
/** Extra skips on mobile / lean tier (not the omni wheels). */
const LEKIWI_LEAN_MESH =
  /ST3215_Servo_Motor|94868A713|Battery---|lipo_battery|servo_controller|Bottom-V2/i
const KIWI_PLATE_LINKS = ['base_plate_layer1-v5', 'base_plate_layer2-v3']
/** Match torso XY to LeKiwi plate (~216 mm) — shell is 120 mm at unit scale. */
const TORSO_XY_WIDEN = 216 / 120
const PRINT_SCALE = 0.001

function tintMesh(mesh: Mesh, hex: string, roughness = 0.58, metalness = 0.08, doubleSide = false) {
  const lean = getPerfTier().leanMeshes
  mesh.material = new MeshStandardMaterial({
    color: hex,
    roughness,
    metalness: lean ? 0 : metalness,
    flatShading: lean,
    side: doubleSide ? DoubleSide : undefined,
  })
  mesh.castShadow = !lean
  mesh.receiveShadow = !lean
}

/** Paint every mesh the colourway primary (whole twin body). */
function colorizeRoot(root: Object3D, colour: Colourway, doubleSide = false) {
  const body = colour.primary
  root.traverse((obj) => {
    const mesh = obj as Mesh
    if (!mesh.isMesh || !mesh.geometry) return
    tintMesh(mesh, body, 0.55, 0.08, doubleSide)
  })
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

/** Drop a thin bottom shelf so the dense armbase plate sits on the torso. */
function trimThinBottomShelf(geom: BufferGeometry, maxShelfMm = 18) {
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
  let firstSolid = -1
  let firstGap = -1
  let secondSolid = -1
  for (let i = 0; i < bins; i++) {
    if (counts[i] > thr) {
      if (firstSolid < 0) firstSolid = i
      else if (firstGap >= 0 && secondSolid < 0) secondSolid = i
    } else if (firstSolid >= 0 && firstGap < 0) {
      firstGap = i
    }
  }
  if (firstSolid < 0 || firstGap < 0 || secondSolid < 0) return geom
  const shelfMm = ((firstGap - firstSolid) / bins) * span
  if (shelfMm > maxShelfMm) return geom
  const cutZ = zMin + (secondSolid / bins) * span - 0.01
  const kept: number[] = []
  for (let i = 0; i < pos.count; i++) {
    if (pos.getZ(i) >= cutZ) {
      kept.push(pos.getX(i), pos.getY(i), pos.getZ(i))
    }
  }
  if (kept.length < 27) return geom
  const clean = new BufferGeometry()
  clean.setAttribute('position', new BufferAttribute(new Float32Array(kept), 3))
  clean.computeBoundingBox()
  clean.computeVertexNormals()
  return clean
}

function usePreparedStl(url: string, opts?: { collapseGaps?: boolean; trimThinShelf?: boolean }) {
  const raw = useLoader(STLLoader, url) as BufferGeometry
  return useMemo(() => {
    let solid = opts?.collapseGaps ? collapseZGaps(raw) : raw
    if (opts?.trimThinShelf) solid = trimThinBottomShelf(solid)
    return footGeometry(solid)
  }, [raw, opts?.collapseGaps, opts?.trimThinShelf])
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

function liftT(carriageAglMm: number) {
  const span = TELESCOPE.max_agl_mm - TELESCOPE.min_agl_mm
  return span > 0 ? Math.max(0, Math.min(1, (carriageAglMm - TELESCOPE.min_agl_mm) / span)) : 0
}

function setJoint(robot: URDFRobot, name: string, value: number) {
  if (robot.joints[name]) robot.setJointValue(name, value)
}

function hideSo101FlangeMesh(robot: URDFRobot) {
  // Prefer the explicit mount pads under each arm; the URDF flange seats inconsistently.
  robot.traverse((obj) => {
    const mesh = obj as Mesh
    if (!mesh.isMesh) return
    const file = String(mesh.userData.meshFile ?? mesh.name ?? '').toLowerCase()
    if (file.includes('base_so101')) mesh.visible = false
  })
}

function MountPad({
  y,
  z,
  colour,
  shadows,
}: {
  y: number
  z: number
  colour: Colourway
  shadows: boolean
}) {
  // Annulus on the deck around each arm base (reads even when the motor covers the center).
  // RingGeometry lies in XY with normal +Z — matches stack Z-up.
  return (
    <mesh
      position={[0.021, y, z]}
      castShadow={shadows}
      receiveShadow={shadows}
      renderOrder={2}
    >
      <ringGeometry args={[MOUNT_PAD_INNER, MOUNT_PAD_OUTER, 64]} />
      <meshStandardMaterial
        color={colour.primary}
        roughness={0.48}
        metalness={0.12}
        side={DoubleSide}
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </mesh>
  )
}

function mapSo101Arm(
  robot: URDFRobot,
  carriageAglMm: number,
  armShoulderRad: number,
  armElbowRad: number,
  _side: 'L' | 'R',
) {
  const t = liftT(carriageAglMm)
  // Identical absolute pose on both arms so they face the same forward direction
  // with matching circular flanges (no π yaw / scale mirror — those hid one plate).
  void _side
  setJoint(robot, 'shoulder_pan', 0.35)
  setJoint(robot, 'shoulder_lift', -0.25 - t * 0.2 + armShoulderRad * 0.35)
  setJoint(robot, 'elbow_flex', 1.0 - t * 0.25 + armElbowRad * 0.4)
  setJoint(robot, 'wrist_flex', -0.15)
  setJoint(robot, 'wrist_roll', 0)
  setJoint(robot, 'gripper', 0.35)
}

/** World Y of the circular base_so101 flange underside (not the higher motor/plate). */
function mountFlangeBottomY(robot: URDFRobot) {
  let plateY: number | null = null
  let lowest = Infinity
  let found = false
  robot.traverse((obj) => {
    const mesh = obj as Mesh
    if (!mesh.isMesh || !mesh.geometry) return
    const link = nearestUrdfLink(obj, robot)
    if (link !== 'base_link') return
    const file = String(mesh.userData.meshFile ?? mesh.name ?? '').toLowerCase()
    const label = `${obj.name} ${meshLabel(obj)} ${file}`.toLowerCase()
    const b = new Box3().setFromObject(mesh)
    if (!Number.isFinite(b.min.y)) return
    if (file.includes('base_so101') || label.includes('base_so101')) {
      plateY = plateY == null ? b.min.y : Math.min(plateY, b.min.y)
      return
    }
    if (!mesh.visible) return
    if (b.min.y < lowest) {
      lowest = b.min.y
      found = true
    }
  })
  if (plateY != null) return plateY
  // Fall back to the true foot of base_link (lowest mesh), never a higher motor bottom.
  return found ? lowest : null
}

function seatArmFlange(group: Group, robot: URDFRobot, deckTopY: number) {
  group.updateWorldMatrix(true, true)
  robot.updateMatrixWorld(true)
  for (let i = 0; i < 2; i++) {
    let bottom = mountFlangeBottomY(robot)
    if (bottom == null) {
      const world = new Vector3()
      group.getWorldPosition(world)
      bottom = world.y
    }
    // Sit slightly proud of the deck so the circular flange reads as a plate.
    nudgeWorldY(group, deckTopY + SIT_EPS - bottom)
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
        // Clone geometry so L/R arms don't share buffers (missing base on one side).
        // Name meshes from the STL path so seating can find base_so101 (URDF visuals are unnamed).
        if (scene) {
          const leaf = path.split('/').pop()?.replace(/\?.*$/, '') ?? ''
          scene.traverse((obj) => {
            const mesh = obj as Mesh
            if (mesh.isMesh && mesh.geometry) {
              mesh.geometry = mesh.geometry.clone()
              if (leaf) {
                mesh.name = leaf
                mesh.userData.meshFile = leaf
              }
            }
          })
          if (leaf && !scene.name) scene.name = leaf
        }
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
  const lekiwi = useUrdf(LEKIWI_URDF, LEKIWI_PATH, LEKIWI_SKIP_MESH, lekiwiLean)
  // Separate URLs so each arm gets its own Object3D tree + cloned geometries.
  const so101L = useUrdf(`${SO101_URDF}?side=L`, SO101_PATH)
  const so101R = useUrdf(`${SO101_URDF}?side=R`, SO101_PATH)

  const torsoGeom = usePreparedStl(TORSO_STL)
  const armbaseGeom = usePreparedStl(ARMBASE_STL, { collapseGaps: true, trimThinShelf: true })
  const neckGeom = usePreparedStl(NECK_STL, { collapseGaps: true })
  const headMountGeom = usePreparedStl(HEAD_MOUNT_STL, { collapseGaps: true })
  const headCamGeom = usePreparedStl(HEAD_CAM_STL)
  const torsoMm = useMemo(() => cadHeightMm(torsoGeom), [torsoGeom])
  const armMm = useMemo(() => cadHeightMm(armbaseGeom), [armbaseGeom])
  const neckMm = useMemo(() => cadHeightMm(neckGeom), [neckGeom])
  const headMountMm = useMemo(() => cadHeightMm(headMountGeom), [headMountGeom])

  const rootRef = useRef<Group>(null)
  const kiwiRef = useRef<Group>(null)
  const stackRef = useRef<Group>(null)
  const armbaseRef = useRef<Mesh>(null)
  const armLRef = useRef<Group>(null)
  const armRRef = useRef<Group>(null)
  const [floorY, setFloorY] = useState(0)
  const [stackPose, setStackPose] = useState({ x: 0, y: 0, z: 0 })
  const [armLPose, setArmLPose] = useState({ x: 0, y: 0, z: 0 })
  const [armRPose, setArmRPose] = useState({ x: 0, y: 0, z: 0 })
  const [revealed, setRevealed] = useState(false)

  const assembled = !!(lekiwi.robot && so101L.robot && so101R.robot)
  const loading =
    (!lekiwi.robot && !lekiwi.failed) ||
    (!so101L.robot && !so101L.failed) ||
    (!so101R.robot && !so101R.failed)

  useLayoutEffect(() => {
    if (!lekiwi.robot) return
    applyLeKiwiVisibility(lekiwi.robot)
    colorizeRoot(lekiwi.robot, colour)
  }, [lekiwi.robot, lekiwi.generation, colour])

  useLayoutEffect(() => {
    if (!so101L.robot) return
    colorizeRoot(so101L.robot, colour)
    hideSo101FlangeMesh(so101L.robot)
    mapSo101Arm(so101L.robot, carriageAglMm, armShoulderRad, armElbowRad, 'L')
  }, [so101L.robot, so101L.generation, colour, carriageAglMm, armShoulderRad, armElbowRad])

  useLayoutEffect(() => {
    if (!so101R.robot) return
    colorizeRoot(so101R.robot, colour)
    hideSo101FlangeMesh(so101R.robot)
    mapSo101Arm(so101R.robot, carriageAglMm, armShoulderRad, armElbowRad, 'R')
  }, [so101R.robot, so101R.generation, colour, carriageAglMm, armShoulderRad, armElbowRad])

  useLayoutEffect(() => {
    const root = rootRef.current
    const kiwiG = kiwiRef.current
    const stack = stackRef.current
    const armL = armLRef.current
    const armR = armRRef.current
    if (!root) return

    withIdentityParents(root, () => {
      root.position.y = 0
      if (stack) stack.position.set(0, 0, 0)
      root.updateWorldMatrix(true, true)

      const kiwiBox = kiwiG ? visibleWorldBox(kiwiG) : null
      const nextFloor = kiwiBox ? -kiwiBox.min.y + SIT_EPS : 0
      root.position.y = nextFloor
      root.updateWorldMatrix(true, true)

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

      // Arms (meters) sit on armbase top in the stack frame.
      const shoulderTopM = (torsoMm + armMm) * PRINT_SCALE
      if (armL) armL.position.set(0, -MOUNT_HALF_M, shoulderTopM)
      if (armR) armR.position.set(0, MOUNT_HALF_M, shoulderTopM)
      root.updateWorldMatrix(true, true)

      const shoulders = armbaseRef.current ? new Box3().setFromObject(armbaseRef.current) : null
      const mountTop =
        shoulders && Number.isFinite(shoulders.max.y) && shoulders.max.y - shoulders.min.y > 0.01
          ? shoulders.max.y
          : plateTop + shoulderTopM

      if (armL && so101L.robot) {
        mapSo101Arm(so101L.robot, carriageAglMm, armShoulderRad, armElbowRad, 'L')
        seatArmFlange(armL, so101L.robot, mountTop + MOUNT_PAD_H)
        hideSo101FlangeMesh(so101L.robot)
      }
      if (armR && so101R.robot) {
        mapSo101Arm(so101R.robot, carriageAglMm, armShoulderRad, armElbowRad, 'R')
        seatArmFlange(armR, so101R.robot, mountTop + MOUNT_PAD_H)
        hideSo101FlangeMesh(so101R.robot)
      }

      const nextArmL = armL
        ? { x: armL.position.x, y: armL.position.y, z: armL.position.z }
        : { x: 0, y: -MOUNT_HALF_M, z: shoulderTopM }
      const nextArmR = armR
        ? { x: armR.position.x, y: armR.position.y, z: armR.position.z }
        : { x: 0, y: MOUNT_HALF_M, z: shoulderTopM }

      if (lekiwi.robot) colorizeRoot(lekiwi.robot, colour)
      if (so101L.robot) colorizeRoot(so101L.robot, colour)
      if (so101R.robot) colorizeRoot(so101R.robot, colour)

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
      setRevealed(true)
    })
  }, [
    lekiwi.robot,
    so101L.robot,
    so101R.robot,
    lekiwi.generation,
    so101L.generation,
    so101R.generation,
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
  const headZ = torsoMm + armMm + neckMm
  const camZ = headZ + headMountMm

  return (
    <group>
      <group ref={rootRef} position={[0, floorY, 0]} visible={revealed}>
        {lekiwi.robot ? (
          <group ref={kiwiRef} rotation={ROS_TO_THREE}>
            <primitive object={lekiwi.robot} />
          </group>
        ) : null}

        {assembled ? (
          <group ref={stackRef} rotation={STACK_TO_THREE} position={[stackPose.x, stackPose.y, stackPose.z]}>
            {/* Printables in mm→m; arms stay in meters as siblings. */}
            <group scale={PRINT_SCALE}>
              <group scale={[TORSO_XY_WIDEN, TORSO_XY_WIDEN, 1]}>
                <mesh geometry={torsoGeom} castShadow={shadows} receiveShadow={shadows}>
                  <meshStandardMaterial color={colour.primary} roughness={0.55} metalness={0.08} />
                </mesh>
              </group>

              <mesh
                ref={armbaseRef}
                geometry={armbaseGeom}
                position={[0, 0, torsoMm]}
                castShadow={shadows}
                receiveShadow={shadows}
              >
                <meshStandardMaterial color={colour.primary} roughness={0.5} metalness={0.1} />
              </mesh>

              <mesh
                geometry={neckGeom}
                position={[0, 0, torsoMm + armMm]}
                castShadow={shadows}
                receiveShadow={shadows}
              >
                <meshStandardMaterial color={colour.primary} roughness={0.52} metalness={0.1} />
              </mesh>

              <mesh
                geometry={headMountGeom}
                position={[0, 0, headZ]}
                castShadow={shadows}
                receiveShadow={shadows}
              >
                <meshStandardMaterial color={colour.primary} roughness={0.45} metalness={0.12} />
              </mesh>
              <mesh
                geometry={headCamGeom}
                position={[0, 25, camZ + 18]}
                rotation={[Math.PI / 2, 0, 0]}
                castShadow={shadows}
                receiveShadow={shadows}
              >
                <meshStandardMaterial color={colour.primary} roughness={0.4} metalness={0.15} />
              </mesh>
            </group>

            {/* Matched circular plates on the deck under both arms. */}
            <MountPad
              key="mount-pad-L"
              y={-MOUNT_HALF_M}
              z={(torsoMm + armMm) * PRINT_SCALE + 0.001}
              colour={colour}
              shadows={shadows}
            />
            <MountPad
              key="mount-pad-R"
              y={MOUNT_HALF_M}
              z={(torsoMm + armMm) * PRINT_SCALE + 0.001}
              colour={colour}
              shadows={shadows}
            />

            <group ref={armLRef} position={[armLPose.x, armLPose.y, armLPose.z]}>
              <primitive key={`arm-L-${so101L.generation}`} object={so101L.robot!} />
            </group>
            <group ref={armRRef} position={[armRPose.x, armRPose.y, armRPose.z]}>
              <primitive key={`arm-R-${so101R.generation}`} object={so101R.robot!} />
            </group>
          </group>
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
    `2× SO-101 + OG RealSense cam head (TheRobotStudio / Vector-Wangel), Apache-2.0. ` +
    `Stack: LeKiwi plate → torso → arm-base → SO-101s → neck → cam head. ` +
    `No IKEA RÅSKOG cart/wheels. Overall BOM stack ~${OVERALL_HEIGHT_MM} mm optional.`
  )
}

export const MESH_ATTRIBUTION = meshAttribution({
  preset: 'xlerobot',
  base: 'lekiwi',
  arms: 'xlerobot',
  head: 'xlerobot',
})
