/**
 * Twin CAD — LeKiwi omni base (no arm) + XLe dual SO-101 + OG head.
 * No IKEA RÅSKOG cart body / 4-wheel set (Vector-Wangel / SIGRobotics, Apache-2.0).
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box3, Group, LoadingManager, Mesh, MeshStandardMaterial, Object3D } from 'three'
import URDFLoader, { type URDFRobot } from 'urdf-loader'
import type { Colourway } from '../product'
import { OVERALL_HEIGHT_MM, TELESCOPE } from '../robot/dims'
import { kitCaption, type KitBuild } from '../kit/catalog'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const LEKIWI_URDF = asset('assets/lekiwi/LeKiwi.urdf')
const LEKIWI_PATH = asset('assets/lekiwi/')
const XLE_URDF = asset('assets/xlerobot/xlerobot/xlerobot.urdf')
const XLE_PATH = asset('assets/xlerobot/xlerobot/')

const ARM_L_HEX = '#38bdf8'
const ARM_R_HEX = '#f97316'
const ROS_TO_THREE: [number, number, number] = [-Math.PI / 2, 0, Math.PI]
const SIT_EPS = 0.0005
/** Drop XLe arm/head mounts from cart-top height toward a low deck. */
const DECK_DROP_M = 0.4
/** Skip IKEA cart body + its 4 floor wheels. */
const XLE_SKIP_MESH = /raskog(body|wheel)/i
/** Skip LeKiwi onboard arm + cam tower STLs (twin uses XLe arms/head). */
const LEKIWI_SKIP_MESH =
  /Base_08|SO_ARM|Rotation_Pitch_08|Moving_Jaw|Passive_Horn|STS3215_03a|WaveShare_Mounting|Camera-Mount|Camera-Model|Top-V2/i
const KIWI_PLATE_LINKS = ['base_plate_layer1-v5', 'base_plate_layer2-v3']

function tintMesh(mesh: Mesh, hex: string, roughness = 0.58, metalness = 0.08) {
  mesh.material = new MeshStandardMaterial({ color: hex, roughness, metalness })
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

function colorizeLeKiwi(root: Object3D, colour: Colourway) {
  root.traverse((obj) => {
    if (!(obj instanceof Mesh) || !obj.visible) return
    const n = meshLabel(obj)
    if (n.includes('omni') || n.includes('wheel')) tintMesh(obj, '#1a1a1a', 0.9, 0.04)
    else if (n.includes('sts3215') || n.includes('st3215') || n.includes('servo')) tintMesh(obj, '#1f2937', 0.35, 0.55)
    else if (n.includes('battery')) tintMesh(obj, '#374151', 0.5, 0.2)
    else tintMesh(obj, colour.primary, 0.55, 0.08)
  })
}

function classifyXleLink(name: string): 'base' | 'head' | 'arm' {
  const n = name.toLowerCase()
  if (n === 'world' || n.includes('chassis') || n.includes('wheel') || n.includes('raskog')) return 'base'
  if (n.includes('arm_camera')) return 'arm'
  if (n.includes('head') || n.includes('top_base') || n.includes('tophead') || n.includes('topbase')) return 'head'
  if (/^(base|rotation|pitch|elbow|upper_arm|lower_arm|wrist|jaw|fixed_jaw|moving_jaw)/.test(n)) return 'arm'
  return 'base'
}

function xleArmSide(link: string | null): 'L' | 'R' | null {
  if (!link) return null
  const n = link.toLowerCase()
  if (n.endsWith('_2') || n.includes('_2_') || n.startsWith('left_arm')) return 'R'
  if (n.startsWith('right_arm')) return 'L'
  if (/^(base|rotation|pitch|elbow|upper_arm|lower_arm|wrist|jaw|fixed_jaw|moving_jaw)/.test(n)) return 'L'
  return null
}

function colorizeXle(robot: URDFRobot, colour: Colourway) {
  robot.traverse((obj) => {
    if (!(obj instanceof Mesh) || !obj.visible) return
    const link = nearestUrdfLink(obj, robot)
    const bucket = link ? classifyXleLink(link) : 'base'
    const n = `${obj.name} ${link ?? ''}`.toLowerCase()
    const side = xleArmSide(link)
    if (n.includes('motor') || n.includes('sts') || n.includes('servo')) tintMesh(obj, '#1f2937', 0.35, 0.55)
    else if (bucket === 'head' || n.includes('camera')) tintMesh(obj, '#111827', 0.4, 0.22)
    else if (side === 'L') tintMesh(obj, ARM_L_HEX, 0.48, 0.12)
    else if (side === 'R') tintMesh(obj, ARM_R_HEX, 0.48, 0.12)
    else if (bucket === 'arm') tintMesh(obj, colour.accent, 0.55, 0.08)
    else tintMesh(obj, colour.primary, 0.62, 0.08)
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

function useUrdf(url: string, workingPath: string, skipMesh?: RegExp) {
  const [robot, setRobot] = useState<URDFRobot | null>(null)
  const [generation, setGeneration] = useState(0)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    let parsed: URDFRobot | null = null
    const bump = () => {
      if (cancelled || !parsed) return
      setRobot(parsed)
      setGeneration((g) => g + 1)
    }
    const manager = new LoadingManager()
    manager.onLoad = bump
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
      if (skipMesh?.test(path)) {
        done(new Object3D())
        return
      }
      defaultMesh(path, mgr, material, done)
    }
    loader.load(
      url,
      (r) => {
        parsed = r
        bump()
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
  }, [url, workingPath, skipMesh])

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
  const lekiwi = useUrdf(LEKIWI_URDF, LEKIWI_PATH, LEKIWI_SKIP_MESH)
  const xle = useUrdf(XLE_URDF, XLE_PATH, XLE_SKIP_MESH)
  const rootRef = useRef<Group>(null)
  const kiwiRef = useRef<Group>(null)
  const xleRef = useRef<Group>(null)
  const [floorY, setFloorY] = useState(0)
  const [stackPose, setStackPose] = useState({ x: 0, y: 0, z: 0 })

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
    mapXlePose(xle.robot, carriageAglMm, armShoulderRad, armElbowRad)
  }, [xle.robot, xle.generation, colour, carriageAglMm, armShoulderRad, armElbowRad])

  useLayoutEffect(() => {
    const root = rootRef.current
    const kiwiG = kiwiRef.current
    const xleG = xleRef.current
    if (!root) return

    root.position.y = 0
    if (xleG) xleG.position.set(0, 0, 0)
    root.updateWorldMatrix(true, true)

    const kiwiBox = kiwiG ? visibleWorldBox(kiwiG) : null
    const nextFloor = kiwiBox ? -kiwiBox.min.y + SIT_EPS : 0
    root.position.y = nextFloor
    root.updateWorldMatrix(true, true)

    const plateBox = lekiwi.robot ? meshBoxForLinks(lekiwi.robot, KIWI_PLATE_LINKS) : null
    const plateCx = plateBox ? (plateBox.min.x + plateBox.max.x) * 0.5 : 0
    const plateCz = plateBox ? (plateBox.min.z + plateBox.max.z) * 0.5 : 0
    const plateTop = plateBox?.max.y ?? kiwiBox?.max.y ?? nextFloor

    const nextStack = { x: plateCx, y: 0, z: plateCz }
    if (xleG) {
      xleG.position.set(nextStack.x, 0, nextStack.z)
      root.updateWorldMatrix(true, true)
      const xleBox = visibleWorldBox(xleG)
      if (xleBox) nextStack.y = plateTop - SIT_EPS - xleBox.min.y
      xleG.position.y = nextStack.y
    }

    setFloorY((y) => (Math.abs(y - nextFloor) > 1e-4 ? nextFloor : y))
    setStackPose((prev) =>
      Math.abs(prev.x - nextStack.x) > 1e-4 ||
      Math.abs(prev.y - nextStack.y) > 1e-4 ||
      Math.abs(prev.z - nextStack.z) > 1e-4
        ? nextStack
        : prev,
    )
  }, [lekiwi.robot, xle.robot, lekiwi.generation, xle.generation, carriageAglMm, armShoulderRad, armElbowRad])

  const loading = (!lekiwi.robot && !lekiwi.failed) || (!xle.robot && !xle.failed)

  return (
    <group ref={rootRef} position={[0, floorY, 0]}>
      {lekiwi.robot ? (
        <group ref={kiwiRef} rotation={ROS_TO_THREE}>
          <primitive object={lekiwi.robot} />
        </group>
      ) : null}
      {xle.robot ? (
        <group ref={xleRef} rotation={ROS_TO_THREE} position={[stackPose.x, stackPose.y, stackPose.z]}>
          <primitive object={xle.robot} />
        </group>
      ) : null}
      {loading ? (
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.18, 0.4, 0.18]} />
          <meshStandardMaterial color="#334155" wireframe />
        </mesh>
      ) : null}
    </group>
  )
}

export function meshAttribution(kit: KitBuild) {
  return (
    `${kitCaption(kit)}. ` +
    `LeKiwi omni base (SIGRobotics-UIUC, no onboard arm) · XLeRobot dual SO-101 + OG head (Vector-Wangel), Apache-2.0. ` +
    `No IKEA RÅSKOG cart/wheels. URDF: public/assets/lekiwi/LeKiwi.urdf + public/assets/xlerobot/xlerobot/xlerobot.urdf. ` +
    `Overall BOM stack ~${OVERALL_HEIGHT_MM} mm optional.`
  )
}

export const MESH_ATTRIBUTION = meshAttribution({
  preset: 'xlerobot',
  base: 'lekiwi',
  arms: 'xlerobot',
  head: 'xlerobot',
})
