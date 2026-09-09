/**
 * Twin CAD — LeKiwi kit mobile base (3-wheel omni, no arm)
 * + printable torso · XLe armbase + neck · XLe dual SO-101 + OG head.
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
const XLE_URDF = asset('assets/xlerobot/xlerobot/xlerobot.urdf')
const XLE_PATH = asset('assets/xlerobot/xlerobot/')
const TORSO_STL = asset('assets/xlerobot/hardware/torso_shell.stl')
const ARMBASE_STL = asset('assets/xlerobot/hardware/XLeRobot_035_armbase.stl')
const NECK_STL = asset('assets/xlerobot/hardware/XLeRobot040_neck_refined.stl')

/** LeKiwi + torso: ROS Z-up → Three Y-up. */
const ROS_TO_THREE: [number, number, number] = [-Math.PI / 2, 0, Math.PI]
/**
 * XLe upper (arms+head): same ROS lift, yawed +90° (to the right) so it faces
 * base-forward instead of sideways / off the torso.
 */
const UPPER_TO_THREE: [number, number, number] = [-Math.PI / 2, 0, Math.PI / 2]
const SIT_EPS = 0.0005
/** Drop XLe arm/head mounts from cart-top height toward a low deck. */
const DECK_DROP_M = 0.4
/** Skip IKEA cart + URDF topbase stand-ins (printable neck replaces them). */
const XLE_SKIP_MESH = /raskog(body|wheel)|topbase\d/i
/** Skip LeKiwi onboard arm + cam tower (twin uses XLe arms/head). Keep real omni wheels. */
const LEKIWI_SKIP_MESH =
  /Base_08|SO_ARM|Rotation_Pitch_08|Moving_Jaw|Passive_Horn|STS3215_03a|WaveShare_Mounting|Camera-Mount|Camera-Model|Top-V2/i
/** Extra skips on mobile / lean tier (not the omni wheels). */
const LEKIWI_LEAN_MESH =
  /ST3215_Servo_Motor|94868A713|Battery---|lipo_battery|servo_controller|Bottom-V2/i
const XLE_LEAN_MESH = /ply\.convex|_Motor\.stl|XLeRobot_camera/i
const KIWI_PLATE_LINKS = ['base_plate_layer1-v5', 'base_plate_layer2-v3']
/** Center upper on mounts/head — not the full arm AABB (outstretched arms pull the center back). */
const UPPER_CORE_LINKS = ['Base', 'Base_2', 'top_base_link', 'head_pan_link', 'head_tilt_link']
/** Match torso XY to LeKiwi plate (~216 mm) — shell is 120 mm at unit scale. */
const TORSO_XY_SCALE = 0.001 * (216 / 120)
const TORSO_Z_SCALE = 0.001
const PRINT_SCALE = 0.001
/** No forward nudge — seat upper core on the cylinder center. */
const UPPER_FORWARD_M = 0

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
    if (!(obj instanceof Mesh)) return
    const n = meshLabel(obj)
    if (isLeKiwiCamTower(n) || isLeKiwiArmMesh(n)) {
      obj.visible = false
      return
    }
    obj.visible = true
  })
}

/** Paint every visible mesh the colourway primary (whole twin body). */
function colorizeLeKiwi(root: Object3D, colour: Colourway) {
  const body = colour.primary
  root.traverse((obj) => {
    if (!(obj instanceof Mesh) || !obj.visible) return
    tintMesh(obj, body, 0.58, 0.08)
  })
}

function colorizeXle(robot: URDFRobot, colour: Colourway) {
  const body = colour.primary
  robot.traverse((obj) => {
    if (!(obj instanceof Mesh) || !obj.visible) return
    tintMesh(obj, body, 0.55, 0.08)
  })
}

function liftT(carriageAglMm: number) {
  const span = TELESCOPE.max_agl_mm - TELESCOPE.min_agl_mm
  return span > 0 ? Math.max(0, Math.min(1, (carriageAglMm - TELESCOPE.min_agl_mm) / span)) : 0
}

function setJoint(robot: URDFRobot, name: string, value: number) {
  if (robot.joints[name]) robot.setJointValue(name, value)
}

function mapXlePose(robot: URDFRobot, carriageAglMm: number, armShoulderRad: number, armElbowRad: number) {
  const t = liftT(carriageAglMm)
  const pitch = 0.4 - t * 0.15 + armShoulderRad * 0.35
  const elbow = 0.95 - t * 0.2 + armElbowRad * 0.4
  for (const side of ['_L', '_R'] as const) {
    setJoint(robot, `Rotation${side}`, side === '_L' ? 0.45 : -0.45)
    setJoint(robot, `Pitch${side}`, pitch)
    setJoint(robot, `Elbow${side}`, elbow)
    setJoint(robot, `Wrist_Pitch${side}`, 0.05)
    setJoint(robot, `Wrist_Roll${side}`, 0)
    setJoint(robot, `Jaw${side}`, 0.35)
  }
  setJoint(robot, 'head_pan_joint', 0)
  setJoint(robot, 'head_tilt_joint', 0.15)
}

/** XLe arms + OG head only — no RÅSKOG cart / 4-wheel set. */
function showXleArmsAndHead(robot: URDFRobot) {
  for (const link of Object.values(robot.links)) link.visible = true
  robot.traverse((obj) => {
    const n = obj.name.toLowerCase()
    const link = obj instanceof Mesh ? nearestUrdfLink(obj, robot) : null
    const linkN = (link ?? '').toLowerCase()
    if (
      XLE_SKIP_MESH.test(n) ||
      n.includes('raskog') ||
      linkN.includes('chassis_geom') ||
      linkN === 'left_wheel' ||
      linkN === 'right_wheel' ||
      linkN === 'chassis'
    ) {
      // Keep chassis link node for parenting, but hide its meshes / wheel children visuals.
      if (obj instanceof Mesh) obj.visible = false
      else if (linkN.includes('chassis_geom') || linkN === 'left_wheel' || linkN === 'right_wheel') obj.visible = false
      return
    }
    obj.visible = true
  })
  // Chassis link must stay visible so children (arms/head) render; meshes already hidden.
  if (robot.links.chassis) robot.links.chassis.visible = true
}

/** Arms/head authored on cart top — lower mounts onto a low deck before plate seating. */
function seatOnDeck(robot: URDFRobot) {
  for (const name of ['fixed_Base', 'fixed_Base_2', 'fixed_top_base_link'] as const) {
    const joint = robot.joints[name]
    if (!joint) continue
    if (joint.userData.deckDropApplied) continue
    joint.position.z -= DECK_DROP_M
    joint.userData.deckDropApplied = true
  }
  robot.updateMatrixWorld(true)
}

function visibleWorldBox(root: Object3D) {
  root.updateWorldMatrix(true, true)
  const box = new Box3()
  let any = false
  root.traverse((obj) => {
    if (!(obj instanceof Mesh) || !obj.geometry || !obj.visible) return
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
    if (!(obj instanceof Mesh) || !obj.visible || !obj.geometry) return
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

    const finish = () => {
      // Only expose the robot once every mesh has finished — avoids part-by-part pop-in on mobile.
      if (cancelled || !parsed || !meshesDone) return
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
      defaultMesh(path, mgr, material, done)
    }
    loader.load(
      url,
      (r) => {
        parsed = r
        // Sync skips can finish during parse; LoadingManager may already be idle.
        const mgr = manager as LoadingManager & { itemsTotal?: number; itemsLoaded?: number }
        const total = mgr.itemsTotal ?? 0
        const loaded = mgr.itemsLoaded ?? 0
        if (total === 0 || loaded >= total) {
          meshesDone = true
          finish()
        }
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
  const xle = useUrdf(XLE_URDF, XLE_PATH, XLE_SKIP_MESH, xleLean)
  const torsoGeom = usePreparedStl(TORSO_STL)
  const armbaseGeom = usePreparedStl(ARMBASE_STL, { collapseGaps: true })
  const neckGeom = usePreparedStl(NECK_STL, { collapseGaps: true })
  const torsoMm = useMemo(() => cadHeightMm(torsoGeom), [torsoGeom])
  const armMm = useMemo(() => cadHeightMm(armbaseGeom), [armbaseGeom])
  const neckMm = useMemo(() => cadHeightMm(neckGeom), [neckGeom])
  const torsoH = Math.max(0.2, torsoMm * PRINT_SCALE)

  const rootRef = useRef<Group>(null)
  const kiwiRef = useRef<Group>(null)
  const stackRef = useRef<Group>(null)
  const torsoRef = useRef<Group>(null)
  const neckRef = useRef<Group>(null)
  const xleRef = useRef<Group>(null)
  const [floorY, setFloorY] = useState(0)
  const [stackPose, setStackPose] = useState({ x: 0, y: 0, z: 0 })
  const [upperPose, setUpperPose] = useState({ x: 0, y: 0, z: 0 })
  /** Reveal only after both URDFs are fully meshed + seated. */
  const [revealed, setRevealed] = useState(false)

  const assembled = !!(lekiwi.robot && xle.robot)
  const loading = (!lekiwi.robot && !lekiwi.failed) || (!xle.robot && !xle.failed)

  useLayoutEffect(() => {
    if (!lekiwi.robot) return
    applyLeKiwiVisibility(lekiwi.robot)
    colorizeLeKiwi(lekiwi.robot, colour)
  }, [lekiwi.robot, lekiwi.generation, colour])

  useLayoutEffect(() => {
    if (!xle.robot) return
    seatOnDeck(xle.robot)
    showXleArmsAndHead(xle.robot)
    colorizeXle(xle.robot, colour)
  }, [xle.robot, xle.generation, colour])

  useLayoutEffect(() => {
    if (!xle.robot) return
    mapXlePose(xle.robot, carriageAglMm, armShoulderRad, armElbowRad)
  }, [xle.robot, xle.generation, carriageAglMm, armShoulderRad, armElbowRad])

  useLayoutEffect(() => {
    const root = rootRef.current
    const kiwiG = kiwiRef.current
    const stack = stackRef.current
    const torsoG = torsoRef.current
    const neckG = neckRef.current
    const xleG = xleRef.current
    if (!root) return

    withIdentityParents(root, () => {
      root.position.y = 0
      if (stack) stack.position.set(0, 0, 0)
      if (xleG) xleG.position.set(0, 0, 0)
      root.updateWorldMatrix(true, true)

      // 1) Park LeKiwi kit mobile base on the floor.
      const kiwiBox = kiwiG ? visibleWorldBox(kiwiG) : null
      const nextFloor = kiwiBox ? -kiwiBox.min.y + SIT_EPS : 0
      root.position.y = nextFloor
      root.updateWorldMatrix(true, true)

      const plateBox = lekiwi.robot ? meshBoxForLinks(lekiwi.robot, KIWI_PLATE_LINKS) : null
      const plateCx = plateBox ? (plateBox.min.x + plateBox.max.x) * 0.5 : 0
      const plateCz = plateBox ? (plateBox.min.z + plateBox.max.z) * 0.5 : 0
      const plateTop = plateBox?.max.y ?? kiwiBox?.max.y ?? nextFloor

      // 2) Sit printable stack (torso → armbase → neck) on the LeKiwi plate.
      const nextStack = { x: plateCx, y: 0, z: plateCz }
      if (stack) {
        stack.position.set(nextStack.x, 0, nextStack.z)
        root.updateWorldMatrix(true, true)
        const torsoBox = torsoG ? visibleWorldBox(torsoG) : null
        if (torsoBox) nextStack.y = plateTop - SIT_EPS - torsoBox.min.y
        stack.position.y = nextStack.y
      }

      // 3) Seat upper body on the neck top — core links only (ignore moving arms).
      const nextUpper = { x: 0, y: 0, z: 0 }
      if (xleG && xle.robot) {
        xleG.position.set(0, 0, 0)
        root.updateWorldMatrix(true, true)
        const deckBox = neckG
          ? visibleWorldBox(neckG)
          : torsoG
            ? visibleWorldBox(torsoG)
            : null
        const coreBox = meshBoxForLinks(xle.robot, UPPER_CORE_LINKS) ?? visibleWorldBox(xleG)
        if (deckBox && coreBox) {
          const deckCx = (deckBox.min.x + deckBox.max.x) * 0.5
          const deckCz = (deckBox.min.z + deckBox.max.z) * 0.5
          const coreCx = (coreBox.min.x + coreBox.max.x) * 0.5
          const coreCz = (coreBox.min.z + coreBox.max.z) * 0.5
          nextUpper.x = deckCx - coreCx
          nextUpper.z = deckCz - coreCz + UPPER_FORWARD_M
          nextUpper.y = deckBox.max.y - SIT_EPS - coreBox.min.y
        } else if (deckBox) {
          nextUpper.x = (deckBox.min.x + deckBox.max.x) * 0.5
          nextUpper.z = (deckBox.min.z + deckBox.max.z) * 0.5 + UPPER_FORWARD_M
          nextUpper.y = deckBox.max.y - SIT_EPS
        }
        xleG.position.set(nextUpper.x, nextUpper.y, nextUpper.z)
      }

      setFloorY((y) => (Math.abs(y - nextFloor) > 1e-4 ? nextFloor : y))
      setStackPose((prev) =>
        Math.abs(prev.x - nextStack.x) > 1e-4 ||
        Math.abs(prev.y - nextStack.y) > 1e-4 ||
        Math.abs(prev.z - nextStack.z) > 1e-4
          ? nextStack
          : prev,
      )
      setUpperPose((prev) =>
        Math.abs(prev.x - nextUpper.x) > 1e-4 ||
        Math.abs(prev.y - nextUpper.y) > 1e-4 ||
        Math.abs(prev.z - nextUpper.z) > 1e-4
          ? nextUpper
          : prev,
      )
      setRevealed(true)
    })
  }, [lekiwi.robot, xle.robot, lekiwi.generation, xle.generation, torsoH, armMm, neckMm])

  useEffect(() => {
    if (!assembled) setRevealed(false)
  }, [assembled])

  return (
    <group>
      <group ref={rootRef} position={[0, floorY, 0]} visible={revealed}>
        {assembled ? (
          <>
            <group ref={kiwiRef} rotation={ROS_TO_THREE}>
              <primitive object={lekiwi.robot!} />
            </group>

            <group ref={stackRef} rotation={ROS_TO_THREE} position={[stackPose.x, stackPose.y, stackPose.z]}>
              <group ref={torsoRef} scale={[TORSO_XY_SCALE, TORSO_XY_SCALE, TORSO_Z_SCALE]}>
                <mesh geometry={torsoGeom} castShadow={!perf.leanMeshes} receiveShadow={!perf.leanMeshes}>
                  <meshStandardMaterial color={colour.primary} roughness={0.55} metalness={0.08} />
                </mesh>
              </group>

              {/* Printable XLe shoulder pack + hollow neck (mm CAD → meters). */}
              <group scale={PRINT_SCALE}>
                <mesh
                  geometry={armbaseGeom}
                  position={[0, 0, torsoMm]}
                  castShadow={!perf.leanMeshes}
                  receiveShadow={!perf.leanMeshes}
                >
                  <meshStandardMaterial color={colour.primary} roughness={0.5} metalness={0.1} />
                </mesh>
                <group ref={neckRef} position={[0, 0, torsoMm + armMm]}>
                  <mesh geometry={neckGeom} castShadow={!perf.leanMeshes} receiveShadow={!perf.leanMeshes}>
                    <meshStandardMaterial color={colour.primary} roughness={0.52} metalness={0.1} />
                  </mesh>
                </group>
              </group>
            </group>

            <group ref={xleRef} rotation={UPPER_TO_THREE} position={[upperPose.x, upperPose.y, upperPose.z]}>
              <primitive object={xle.robot!} />
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
    `dual SO-101 + OG head (Vector-Wangel), Apache-2.0. ` +
    `Stack: LeKiwi plate → torso shell → XLe 0.35 arm-base → neck → arms/head. ` +
    `No IKEA RÅSKOG cart/wheels. Overall BOM stack ~${OVERALL_HEIGHT_MM} mm optional.`
  )
}

export const MESH_ATTRIBUTION = meshAttribution({
  preset: 'xlerobot',
  base: 'lekiwi',
  arms: 'xlerobot',
  head: 'xlerobot',
})
