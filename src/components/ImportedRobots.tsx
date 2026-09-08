/**
 * Twin CAD — mix-and-match real URDFs.
 * LeKiwi rover · printable torso · XLe armbase + neck + head gimbal · 2× SO-101
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
  Vector3,
  type Object3D,
} from 'three'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import URDFLoader, { type URDFRobot } from 'urdf-loader'
import type { Colourway } from '../product'
import { OVERALL_HEIGHT_MM, TELESCOPE } from '../robot/dims'
import { kitCaption, type KitBuild } from '../kit/catalog'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const LEKIWI_URDF = asset('assets/lekiwi/LeKiwi.urdf')
const LEKIWI_PATH = asset('assets/lekiwi/')
const SO101_URDF = asset('assets/so101/so101_new_calib.urdf')
const SO101_PATH = asset('assets/so101/')
const XLE_TORSO_STL = asset('assets/xlerobot/hardware/torso_shell.stl') + '?v=3'
const XLE_ARMBASE_STL = asset('assets/xlerobot/hardware/XLeRobot_035_armbase.stl') + '?v=3'
const XLE_NECK_STL = asset('assets/xlerobot/hardware/XLeRobot040_neck_refined.stl') + '?v=3'
const XLE_HEAD_STL = asset('assets/xlerobot/hardware/Gimbal_mesh_all_d435.stl') + '?v=3'

const ARM_L_HEX = '#38bdf8'
const ARM_R_HEX = '#f97316'

function tintMesh(mesh: Mesh, hex: string, roughness = 0.58, metalness = 0.08) {
  const mat = new MeshStandardMaterial({ color: hex, roughness, metalness })
  mesh.material = mat
  mesh.castShadow = true
  mesh.receiveShadow = true
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

function colorizeLeKiwi(root: Object3D, colour: Colourway) {
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return
    const n = meshLabel(obj)
    if (n.includes('omni') || n.includes('wheel')) tintMesh(obj, '#1a1a1a', 0.9, 0.04)
    else if (n.includes('sts3215') || n.includes('st3215') || n.includes('servo')) tintMesh(obj, '#1f2937', 0.35, 0.55)
    else if (n.includes('battery')) tintMesh(obj, '#374151', 0.5, 0.2)
    else if (n.includes('camera')) tintMesh(obj, '#111827', 0.4, 0.25)
    else tintMesh(obj, colour.primary, 0.55, 0.08)
  })
}

function colorizeSo101(root: Object3D, hex: string) {
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return
    const n = meshLabel(obj)
    if (n.includes('sts3215') || n.includes('st3215') || n.includes('servo')) {
      tintMesh(obj, '#1f2937', 0.35, 0.55)
    } else {
      tintMesh(obj, hex, 0.48, 0.12)
    }
  })
}

function liftT(carriageAglMm: number) {
  const span = TELESCOPE.max_agl_mm - TELESCOPE.min_agl_mm
  return span > 0 ? Math.max(0, Math.min(1, (carriageAglMm - TELESCOPE.min_agl_mm) / span)) : 0
}

function setJoint(robot: URDFRobot, name: string, value: number) {
  if (robot.joints[name]) robot.setJointValue(name, value)
}

function mapLeKiwiArm(robot: URDFRobot, carriageAglMm: number, armShoulderRad: number, armElbowRad: number) {
  const t = liftT(carriageAglMm)
  setJoint(robot, 'arm_shoulder_pan', 0)
  setJoint(robot, 'arm_shoulder_lift', -1.35 + t * 1.55 + armShoulderRad * 0.35)
  setJoint(robot, 'arm_elbow_flex', 1.05 - t * 0.85 + armElbowRad * 0.4)
  setJoint(robot, 'arm_wrist_flex', 0.15)
  setJoint(robot, 'arm_wrist_roll', 0)
  setJoint(robot, 'arm_gripper', 0.4)
}

function mapSo101Arm(
  robot: URDFRobot,
  carriageAglMm: number,
  armShoulderRad: number,
  armElbowRad: number,
  side: 'L' | 'R',
) {
  const t = liftT(carriageAglMm)
  setJoint(robot, 'shoulder_pan', side === 'L' ? 0.35 : -0.35)
  setJoint(robot, 'shoulder_lift', 0.35 - t * 0.5 + armShoulderRad * 0.35)
  setJoint(robot, 'elbow_flex', 0.85 - t * 0.4 + armElbowRad * 0.4)
  setJoint(robot, 'wrist_flex', -0.15)
  setJoint(robot, 'wrist_roll', 0)
  setJoint(robot, 'gripper', 0.4)
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

/** Onboard LeKiwi cam tower — hidden; twin uses the XLe gimbal head instead. */
function isLeKiwiCamTower(n: string) {
  return n.includes('camera-mount') || n.includes('camera-model') || n.includes('top-v2')
}

function applyLeKiwiVisibility(robot: URDFRobot, showBase: boolean, showArm: boolean) {
  robot.traverse((obj) => {
    if (!(obj instanceof Mesh)) return
    const n = meshLabel(obj)
    if (isLeKiwiCamTower(n)) {
      obj.visible = false
      return
    }
    const arm = isLeKiwiArmMesh(n)
    obj.visible = arm ? showArm : showBase
  })
}

function nearestUrdfLink(obj: Object3D, robot: URDFRobot) {
  let p: Object3D | null = obj
  while (p) {
    if (p.name && robot.links[p.name]) return p.name
    p = p.parent
  }
  return null
}

const ROS_TO_THREE: [number, number, number] = [-Math.PI / 2, 0, Math.PI]
/** Shoulder pack faces rover front. */
const XLE_TO_THREE: [number, number, number] = [-Math.PI / 2, 0, Math.PI / 2]

function visibleWorldBox(root: Object3D, skip?: (mesh: Mesh) => boolean) {
  root.updateWorldMatrix(true, true)
  const box = new Box3()
  let any = false
  root.traverse((obj) => {
    if (!(obj instanceof Mesh) || !obj.geometry) return
    let p: Object3D | null = obj
    while (p) {
      if (!p.visible) return
      p = p.parent
    }
    if (skip?.(obj)) return
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

const KIWI_PLATE_LINKS = ['base_plate_layer1-v5', 'base_plate_layer2-v3']
const SIT_EPS = 0.0005
/** Half-span between SO-101 bases on the XLe 0.35 armbase (meters). */
const MOUNT_HALF_M = 0.11

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

  // Merge nearly-adjacent runs, then pack remaining runs flush.
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

function useUrdf(url: string, workingPath: string, enabled: boolean) {
  const [robot, setRobot] = useState<URDFRobot | null>(null)
  const [generation, setGeneration] = useState(0)

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    let parsed: URDFRobot | null = null
    const manager = new LoadingManager()
    manager.onLoad = () => {
      if (cancelled || !parsed) return
      setRobot(parsed)
      setGeneration((g) => g + 1)
    }
    const loader = new URDFLoader(manager)
    loader.workingPath = workingPath
    loader.parseCollision = false
    loader.parseVisual = true
    loader.load(
      url,
      (r) => {
        parsed = r
      },
      undefined,
      (err) => console.error('URDF failed to load', url, err),
    )
    return () => {
      cancelled = true
    }
  }, [url, workingPath, enabled])

  return { robot, generation }
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
  const lekiwi = useUrdf(LEKIWI_URDF, LEKIWI_PATH, true)
  // Separate URLs so each arm gets its own Object3D tree (shared URL can steal meshes).
  const so101L = useUrdf(`${SO101_URDF}?side=L`, SO101_PATH, true)
  const so101R = useUrdf(`${SO101_URDF}?side=R`, SO101_PATH, true)
  const torsoGeom = usePreparedStl(XLE_TORSO_STL)
  const armbaseGeom = usePreparedStl(XLE_ARMBASE_STL, { collapseGaps: true })
  const neckGeom = usePreparedStl(XLE_NECK_STL, { collapseGaps: true })
  const headGeom = usePreparedStl(XLE_HEAD_STL)
  const torsoMm = cadHeightMm(torsoGeom)
  const armMm = cadHeightMm(armbaseGeom)
  const neckMm = cadHeightMm(neckGeom)
  const rootRef = useRef<Group>(null)
  const kiwiRef = useRef<Group>(null)
  const stackRef = useRef<Group>(null)
  const armbaseRef = useRef<Mesh>(null)
  const armLRef = useRef<Group>(null)
  const armRRef = useRef<Group>(null)
  const [floorY, setFloorY] = useState(0)
  const [stackPose, setStackPose] = useState({ x: 0, y: 0, z: 0 })

  useLayoutEffect(() => {
    if (!lekiwi.robot) return
    colorizeLeKiwi(lekiwi.robot, colour)
    mapLeKiwiArm(lekiwi.robot, carriageAglMm, armShoulderRad, armElbowRad)
    applyLeKiwiVisibility(lekiwi.robot, true, false)
  }, [lekiwi.robot, lekiwi.generation, colour, carriageAglMm, armShoulderRad, armElbowRad])

  useLayoutEffect(() => {
    if (!so101L.robot) return
    colorizeSo101(so101L.robot, ARM_L_HEX)
    mapSo101Arm(so101L.robot, carriageAglMm, armShoulderRad, armElbowRad, 'L')
  }, [so101L.robot, so101L.generation, carriageAglMm, armShoulderRad, armElbowRad])

  useLayoutEffect(() => {
    if (!so101R.robot) return
    colorizeSo101(so101R.robot, ARM_R_HEX)
    mapSo101Arm(so101R.robot, carriageAglMm, armShoulderRad, armElbowRad, 'R')
  }, [so101R.robot, so101R.generation, carriageAglMm, armShoulderRad, armElbowRad])

  useLayoutEffect(() => {
    const root = rootRef.current
    const kiwiG = kiwiRef.current
    const stack = stackRef.current
    const armL = armLRef.current
    const armR = armRRef.current
    if (!root) return

    root.position.y = 0
    if (stack) stack.position.set(0, 0, 0)
    root.updateWorldMatrix(true, true)

    // 1) Park LeKiwi wheels on the floor.
    const wheels = kiwiG ? visibleWorldBox(kiwiG, (mesh) => isLeKiwiArmMesh(meshLabel(mesh))) : null
    const nextFloor = wheels ? -wheels.min.y : 0
    root.position.y = nextFloor
    root.updateWorldMatrix(true, true)

    // 2) Sit humanoid stack on the LeKiwi top plate.
    const plateBox = lekiwi.robot ? meshBoxForLinks(lekiwi.robot, KIWI_PLATE_LINKS) : null
    const deck = kiwiG ? visibleWorldBox(kiwiG, (mesh) => isLeKiwiArmMesh(meshLabel(mesh))) : null
    const plateCx = plateBox ? (plateBox.min.x + plateBox.max.x) * 0.5 : 0
    const plateCz = plateBox ? (plateBox.min.z + plateBox.max.z) * 0.5 : 0
    const plateTop = plateBox?.max.y ?? deck?.max.y ?? 0

    const nextStack = {
      x: plateCx,
      y: plateTop - SIT_EPS - nextFloor,
      z: plateCz,
    }
    if (stack) stack.position.set(nextStack.x, nextStack.y, nextStack.z)

    // 3) Seat SO-101 base_link origins in the armbase shoulder holes (local ROS frame).
    // Do not AABB-lift: hanging motors would float the whole arm above the deck.
    const shoulderTopM = (torsoMm + armMm) * 0.001
    if (armL) armL.position.set(0, -MOUNT_HALF_M, shoulderTopM)
    if (armR) armR.position.set(0, MOUNT_HALF_M, shoulderTopM)
    root.updateWorldMatrix(true, true)

    // Fine-tune so the base flange (near origin) kisses the armbase top.
    const shoulders = armbaseRef.current ? new Box3().setFromObject(armbaseRef.current) : null
    const mountTop =
      shoulders && Number.isFinite(shoulders.max.y) && shoulders.max.y - shoulders.min.y > 0.01
        ? shoulders.max.y
        : plateTop + shoulderTopM

    const seatArmOrigin = (group: Group | null) => {
      if (!group) return
      root.updateWorldMatrix(true, true)
      const world = new Vector3()
      group.getWorldPosition(world)
      nudgeWorldY(group, mountTop - SIT_EPS - world.y)
    }
    seatArmOrigin(armL)
    seatArmOrigin(armR)

    setFloorY((y) => (Math.abs(y - nextFloor) > 1e-4 ? nextFloor : y))
    setStackPose((prev) => (
      Math.abs(prev.x - nextStack.x) > 1e-4 || Math.abs(prev.y - nextStack.y) > 1e-4 || Math.abs(prev.z - nextStack.z) > 1e-4
        ? nextStack
        : prev
    ))
  }, [
    lekiwi.robot,
    so101L.robot,
    so101R.robot,
    lekiwi.generation,
    so101L.generation,
    so101R.generation,
    torsoGeom,
    armbaseGeom,
    neckGeom,
    headGeom,
    torsoMm,
    armMm,
    neckMm,
    carriageAglMm,
    armShoulderRad,
    armElbowRad,
  ])

  return (
    <group ref={rootRef} position={[0, floorY, 0]}>
      {lekiwi.robot ? (
        <group ref={kiwiRef} rotation={ROS_TO_THREE}>
          <primitive object={lekiwi.robot} />
        </group>
      ) : null}

      <group ref={stackRef} rotation={XLE_TO_THREE} position={[stackPose.x, stackPose.y, stackPose.z]}>
        <group scale={0.001}>
          {/* Printable torso shell on the LeKiwi plate */}
          <mesh geometry={torsoGeom} castShadow receiveShadow>
            <meshStandardMaterial color={colour.primary} roughness={0.55} metalness={0.08} />
          </mesh>
          {/* XLe dual-arm base plate / shoulder pack */}
          <mesh ref={armbaseRef} geometry={armbaseGeom} position={[0, 0, torsoMm]} castShadow receiveShadow>
            <meshStandardMaterial color={colour.primary} roughness={0.5} metalness={0.1} />
          </mesh>
          {/* Neck column */}
          <mesh geometry={neckGeom} position={[0, 0, torsoMm + armMm]} castShadow receiveShadow>
            <meshStandardMaterial color={colour.primary} roughness={0.52} metalness={0.1} />
          </mesh>
          {/* Head / D435 gimbal on the neck */}
          <mesh geometry={headGeom} position={[0, 0, torsoMm + armMm + neckMm]} castShadow receiveShadow>
            <meshStandardMaterial color="#1f2937" roughness={0.35} metalness={0.25} />
          </mesh>
        </group>

        {so101L.robot ? (
          <group ref={armLRef}>
            <primitive object={so101L.robot} />
          </group>
        ) : null}
        {so101R.robot ? (
          <group ref={armRRef} rotation={[0, 0, Math.PI]}>
            <primitive object={so101R.robot} />
          </group>
        ) : null}
      </group>
    </group>
  )
}

export function meshAttribution(kit: KitBuild) {
  return (
    `${kitCaption(kit)}. ` +
    `LeKiwi rover (SIGRobotics-UIUC) · XLeRobot arm-base / neck / gimbal (Vector-Wangel) · SO-101 (TheRobotStudio), Apache-2.0. ` +
    `Print: print/lekiwi/ · print/SO101/Individual/ · print/xlerobot/hardware/. ` +
    `Stack: LeKiwi plate → torso shell → XLe arm-base plate → 2× SO-101 → neck → D435 gimbal head. ` +
    `Torso shell 120×320 mm. BOM nested column ~${OVERALL_HEIGHT_MM} mm optional.`
  )
}

export const MESH_ATTRIBUTION = meshAttribution({
  preset: 'xlerobot',
  base: 'lekiwi',
  arms: 'xlerobot',
  head: 'xlerobot',
})
