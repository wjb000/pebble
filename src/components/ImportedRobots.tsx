/**
 * Twin CAD — mix-and-match real URDFs.
 * LeKiwi (SIGRobotics-UIUC) · XLeRobot (Vector-Wangel) · SO-101 (TheRobotStudio)
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { Box3, Group, LoadingManager, Mesh, MeshStandardMaterial, type BufferGeometry, type Object3D } from 'three'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import URDFLoader, { type URDFRobot } from 'urdf-loader'
import type { Colourway } from '../product'
import { OVERALL_HEIGHT_MM, TELESCOPE } from '../robot/dims'
import { kitCaption, type KitBuild } from '../kit/catalog'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const LEKIWI_URDF = asset('assets/lekiwi/LeKiwi.urdf')
const LEKIWI_PATH = asset('assets/lekiwi/')
const XLE_URDF = asset('assets/xlerobot/xlerobot/xlerobot.urdf')
const XLE_PATH = asset('assets/xlerobot/xlerobot/')
const XLE_TORSO_STL = asset('assets/xlerobot/hardware/torso_shell.stl') + '?v=2'
const XLE_ARMBASE_STL = asset('assets/xlerobot/hardware/XLeRobot_035_armbase.stl')
const XLE_NECK_STL = asset('assets/xlerobot/hardware/XLeRobot040_neck_refined.stl')

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

function nearestUrdfLink(obj: Object3D, robot: URDFRobot) {
  let p: Object3D | null = obj
  while (p) {
    if (p.name && robot.links[p.name]) return p.name
    p = p.parent
  }
  return null
}

/** Bright L/R so dual SO-101 CAD reads on the dark /model stage. */
const ARM_L_HEX = '#38bdf8'
const ARM_R_HEX = '#f97316'

function xleArmSide(link: string | null): 'L' | 'R' | null {
  if (!link) return null
  const n = link.toLowerCase()
  // XLe right chain uses `_2` suffix; wrist cams are named opposite the arm they ride on.
  if (n.endsWith('_2') || n.includes('_2_') || n.startsWith('left_arm')) return 'R'
  if (n.startsWith('right_arm')) return 'L'
  if (/^(base|rotation|pitch|elbow|upper_arm|lower_arm|wrist|jaw|fixed_jaw|moving_jaw)/.test(n)) return 'L'
  return null
}

function colorizeXle(robot: URDFRobot, colour: Colourway) {
  robot.traverse((obj) => {
    if (!(obj instanceof Mesh)) return
    const link = nearestUrdfLink(obj, robot)
    const bucket = link ? classifyXleLink(link) : 'arm'
    const n = `${obj.name} ${link ?? ''}`.toLowerCase()
    const side = xleArmSide(link)
    if (bucket === 'base') tintMesh(obj, '#1e3a5f', 0.7, 0.08)
    else if (n.includes('motor') || n.includes('sts') || n.includes('servo')) {
      tintMesh(obj, '#1f2937', 0.35, 0.55)
    } else if (n.includes('camera') || n.includes('head')) {
      tintMesh(obj, '#111827', 0.4, 0.25)
    } else if (side === 'L') {
      tintMesh(obj, ARM_L_HEX, 0.48, 0.12)
    } else if (side === 'R') {
      tintMesh(obj, ARM_R_HEX, 0.48, 0.12)
    } else if (n.includes('jaw') || n.includes('wrist') || n.includes('arm') || n.includes('rotation') || n.includes('base')) {
      tintMesh(obj, colour.primary, 0.48, 0.12)
    } else {
      tintMesh(obj, colour.accent, 0.55, 0.08)
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

function mapXleArms(robot: URDFRobot, carriageAglMm: number, armShoulderRad: number, armElbowRad: number) {
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
  setJoint(robot, 'head_tilt_joint', 0.2)
}

function isLeKiwiArmMesh(n: string) {
  return (
    n.includes('base_08') ||
    n.includes('so_arm') ||
    n.includes('rotation_pitch_08') ||
    n.includes('wrist') ||
    n.includes('jaw') ||
    n.includes('passive_horn') ||
    n.includes('sts3215_03a')
  )
}

function applyLeKiwiVisibility(robot: URDFRobot, showBase: boolean, showArm: boolean) {
  robot.traverse((obj) => {
    if (!(obj instanceof Mesh)) return
    const arm = isLeKiwiArmMesh(meshLabel(obj))
    obj.visible = arm ? showArm : showBase
  })
}

function classifyXleLink(name: string): 'base' | 'head' | 'arm' {
  const n = name.toLowerCase()
  if (n === 'world' || n.includes('chassis') || n.includes('wheel') || n.includes('raskog')) return 'base'
  // Wrist cams ride on the arms — keep them with the arm bucket.
  if (n.includes('arm_camera')) return 'arm'
  if (n.includes('camera')) return 'base'
  if (n.includes('head') || n.includes('top_base')) return 'head'
  if (/^(base|rotation|pitch|elbow|upper_arm|lower_arm|wrist|jaw|fixed_jaw|moving_jaw)/.test(n)) return 'arm'
  return 'base'
}

/**
 * Show dual SO-101 CAD; hide the XLe RÅSKOG cart.
 * Keep world/chassis Object3Ds visible as ancestors — Three.js hides whole subtrees
 * when a parent has visible=false, which previously blanked both arms.
 */
function applyXleVisibility(robot: URDFRobot, showArms: boolean, showHead: boolean) {
  for (const [name, link] of Object.entries(robot.links)) {
    const bucket = classifyXleLink(name)
    if (bucket === 'arm') link.visible = showArms
    else if (bucket === 'head') link.visible = showHead
    else link.visible = true
  }
  robot.traverse((obj) => {
    if (!(obj instanceof Mesh)) return
    const link = nearestUrdfLink(obj, robot)
    const bucket = link ? classifyXleLink(link) : 'base'
    if (bucket === 'arm') obj.visible = showArms
    else if (bucket === 'head') obj.visible = showHead
    else obj.visible = false
  })
}

const ROS_TO_THREE: [number, number, number] = [-Math.PI / 2, 0, Math.PI]
/** Same ROS→Three as the LeKiwi, plus 90° yaw so the shoulder pack faces the rover front. */
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

const ARM_MOUNT_LINKS = ['Base', 'Base_2']
const KIWI_PLATE_LINKS = ['base_plate_layer1-v5', 'base_plate_layer2-v3']
const SIT_EPS = 0.001

function sitDelta(box: Box3, cx: number, top: number, cz: number) {
  return {
    x: cx - (box.min.x + box.max.x) * 0.5,
    y: top - SIT_EPS - box.min.y,
    z: cz - (box.min.z + box.max.z) * 0.5,
  }
}

function cadHeightMm(geom: BufferGeometry) {
  const b = geom.boundingBox
  if (!b) return 200
  return Math.max(50, b.max.z - b.min.z)
}

function useFootedStl(url: string) {
  const raw = useLoader(STLLoader, url) as BufferGeometry
  return useMemo(() => {
    const g = raw.clone()
    g.computeBoundingBox()
    const b = g.boundingBox
    if (b) {
      g.translate(-(b.min.x + b.max.x) * 0.5, -(b.min.y + b.max.y) * 0.5, -b.min.z)
    }
    g.computeBoundingBox()
    g.computeVertexNormals()
    return g
  }, [raw])
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
  const xle = useUrdf(XLE_URDF, XLE_PATH, true)
  const torsoGeom = useFootedStl(XLE_TORSO_STL)
  const armbaseGeom = useFootedStl(XLE_ARMBASE_STL)
  const neckGeom = useFootedStl(XLE_NECK_STL)
  const torsoMm = cadHeightMm(torsoGeom)
  const armMm = cadHeightMm(armbaseGeom)
  const rootRef = useRef<Group>(null)
  const kiwiRef = useRef<Group>(null)
  const torsoRef = useRef<Group>(null)
  const armbaseRef = useRef<Mesh>(null)
  const xleLiftRef = useRef<Group>(null)
  const [floorY, setFloorY] = useState(0)
  const [torsoPose, setTorsoPose] = useState({ x: 0, y: 0, z: 0 })
  const [xlePose, setXlePose] = useState({ x: 0, y: 0, z: 0 })

  useLayoutEffect(() => {
    if (!lekiwi.robot) return
    colorizeLeKiwi(lekiwi.robot, colour)
    mapLeKiwiArm(lekiwi.robot, carriageAglMm, armShoulderRad, armElbowRad)
    applyLeKiwiVisibility(lekiwi.robot, true, false)
  }, [lekiwi.robot, lekiwi.generation, colour, carriageAglMm, armShoulderRad, armElbowRad])

  useLayoutEffect(() => {
    if (!xle.robot) return
    colorizeXle(xle.robot, colour)
    mapXleArms(xle.robot, carriageAglMm, armShoulderRad, armElbowRad)
    applyXleVisibility(xle.robot, true, false)
  }, [xle.robot, xle.generation, colour, carriageAglMm, armShoulderRad, armElbowRad])

  useLayoutEffect(() => {
    const root = rootRef.current
    const kiwiG = kiwiRef.current
    const torso = torsoRef.current
    const xleLift = xleLiftRef.current
    if (!root) return

    root.position.y = 0
    if (torso) torso.position.set(0, 0, 0)
    if (xleLift) xleLift.position.set(0, 0, 0)
    root.updateWorldMatrix(true, true)

    const wheels = kiwiG ? visibleWorldBox(kiwiG, (mesh) => isLeKiwiArmMesh(meshLabel(mesh))) : null
    const nextFloor = wheels ? -wheels.min.y : 0
    root.position.y = nextFloor
    root.updateWorldMatrix(true, true)

    const plateBox = lekiwi.robot ? meshBoxForLinks(lekiwi.robot, KIWI_PLATE_LINKS) : null
    const deck = kiwiG ? visibleWorldBox(kiwiG, (mesh) => isLeKiwiArmMesh(meshLabel(mesh))) : null
    const plateCx = plateBox ? (plateBox.min.x + plateBox.max.x) * 0.5 : 0
    const plateCz = plateBox ? (plateBox.min.z + plateBox.max.z) * 0.5 : 0
    const plateTop = plateBox?.max.y ?? deck?.max.y ?? 0

    const nextTorso = {
      x: plateCx,
      y: plateTop - SIT_EPS - nextFloor,
      z: plateCz,
    }
    if (torso) torso.position.set(nextTorso.x, nextTorso.y, nextTorso.z)
    root.updateWorldMatrix(true, true)

    const stackM = (torsoMm + armMm) * 0.001
    const shoulders = armbaseRef.current ? new Box3().setFromObject(armbaseRef.current) : null
    const shoulderOk = !!(shoulders && Number.isFinite(shoulders.max.y) && shoulders.max.y - shoulders.min.y > 0.02)
    const mountTop = shoulderOk ? shoulders.max.y : plateTop + stackM
    const mountCx = shoulderOk ? (shoulders.min.x + shoulders.max.x) * 0.5 : plateCx
    const mountCz = shoulderOk ? (shoulders.min.z + shoulders.max.z) * 0.5 : plateCz
    let nextXle = { x: 0, y: 0, z: 0 }
    if (xleLift && xle.robot) {
      const mounts = meshBoxForLinks(xle.robot, [...ARM_MOUNT_LINKS, 'Base_geom_1', 'Base_2_geom_1'])
      if (mounts) {
        nextXle = sitDelta(mounts, mountCx, mountTop, mountCz)
        xleLift.position.set(nextXle.x, nextXle.y, nextXle.z)
      }
    }

    setFloorY((y) => (Math.abs(y - nextFloor) > 1e-4 ? nextFloor : y))
    setTorsoPose((prev) => (
      Math.abs(prev.x - nextTorso.x) > 1e-4 || Math.abs(prev.y - nextTorso.y) > 1e-4 || Math.abs(prev.z - nextTorso.z) > 1e-4
        ? nextTorso
        : prev
    ))
    setXlePose((prev) => (
      Math.abs(prev.x - nextXle.x) > 1e-4 || Math.abs(prev.y - nextXle.y) > 1e-4 || Math.abs(prev.z - nextXle.z) > 1e-4
        ? nextXle
        : prev
    ))
  }, [lekiwi.robot, xle.robot, lekiwi.generation, xle.generation, torsoGeom, armbaseGeom, neckGeom, torsoMm, armMm, carriageAglMm, armShoulderRad, armElbowRad])

  return (
    <group ref={rootRef} position={[0, floorY, 0]}>
      {lekiwi.robot ? (
        <group ref={kiwiRef} rotation={ROS_TO_THREE}>
          <primitive object={lekiwi.robot} />
        </group>
      ) : null}
      <group ref={torsoRef} rotation={XLE_TO_THREE} position={[torsoPose.x, torsoPose.y, torsoPose.z]}>
        <group scale={0.001}>
          <mesh geometry={torsoGeom} castShadow receiveShadow>
            <meshStandardMaterial color={colour.primary} roughness={0.55} metalness={0.08} />
          </mesh>
          <mesh ref={armbaseRef} geometry={armbaseGeom} position={[0, 0, torsoMm]} castShadow receiveShadow>
            <meshStandardMaterial color={colour.primary} roughness={0.52} metalness={0.1} />
          </mesh>
          <mesh geometry={neckGeom} position={[0, 0, torsoMm + armMm]} castShadow receiveShadow>
            <meshStandardMaterial color={colour.primary} roughness={0.52} metalness={0.1} />
          </mesh>
        </group>
      </group>
      {xle.robot ? (
        <group ref={xleLiftRef} position={[xlePose.x, xlePose.y, xlePose.z]}>
          <group rotation={XLE_TO_THREE}>
            <primitive object={xle.robot} />
          </group>
        </group>
      ) : null}
    </group>
  )
}

export function meshAttribution(kit: KitBuild) {
  return (
    `${kitCaption(kit)}. ` +
    `LeKiwi (SIGRobotics-UIUC) · XLeRobot (Vector-Wangel) · SO-101 (TheRobotStudio), Apache-2.0. ` +
    `Print: print/lekiwi/ · print/SO101/Individual/ · print/xlerobot/hardware/. ` +
    `Humanoid stack: LeKiwi plate, printable torso shell, XLe arm-base shoulders, neck, 2× SO-101. ` +
    `Torso shell is 120×320 mm (print/xlerobot/hardware/torso_shell.stl). BOM nested column ~${OVERALL_HEIGHT_MM} mm is optional.`
  )
}

export const MESH_ATTRIBUTION = meshAttribution({
  preset: 'xlerobot',
  base: 'lekiwi',
  arms: 'xlerobot',
  head: 'xlerobot',
})
