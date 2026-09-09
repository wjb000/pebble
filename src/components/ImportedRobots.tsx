/**
 * Twin CAD — full XLeRobot URDF.
 * RÅSKOG base + dual SO-101 on the cart platform + OG XLe head (Vector-Wangel, Apache-2.0).
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box3, Group, LoadingManager, Mesh, MeshStandardMaterial, type Object3D } from 'three'
import URDFLoader, { type URDFRobot } from 'urdf-loader'
import type { Colourway } from '../product'
import { OVERALL_HEIGHT_MM, TELESCOPE } from '../robot/dims'
import { kitCaption, type KitBuild } from '../kit/catalog'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const XLE_URDF = asset('assets/xlerobot/xlerobot/xlerobot.urdf')
const XLE_PATH = asset('assets/xlerobot/xlerobot/')

const ARM_L_HEX = '#38bdf8'
const ARM_R_HEX = '#f97316'
const ROS_TO_THREE: [number, number, number] = [-Math.PI / 2, 0, Math.PI]
const SIT_EPS = 0.0005

function tintMesh(mesh: Mesh, hex: string, roughness = 0.58, metalness = 0.08) {
  mesh.material = new MeshStandardMaterial({ color: hex, roughness, metalness })
  mesh.castShadow = true
  mesh.receiveShadow = true
}

function nearestUrdfLink(obj: Object3D, robot: URDFRobot) {
  let p: Object3D | null = obj
  while (p) {
    if (p.name && robot.links[p.name]) return p.name
    p = p.parent
  }
  return null
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
    if (!(obj instanceof Mesh)) return
    const link = nearestUrdfLink(obj, robot)
    const bucket = link ? classifyXleLink(link) : 'base'
    const n = `${obj.name} ${link ?? ''}`.toLowerCase()
    const side = xleArmSide(link)
    if (n.includes('wheel') || n.includes('raskog')) tintMesh(obj, '#1a1a1a', 0.85, 0.05)
    else if (bucket === 'base') tintMesh(obj, colour.primary, 0.62, 0.08)
    else if (n.includes('motor') || n.includes('sts') || n.includes('servo')) tintMesh(obj, '#1f2937', 0.35, 0.55)
    else if (bucket === 'head' || n.includes('camera')) tintMesh(obj, '#111827', 0.4, 0.22)
    else if (side === 'L') tintMesh(obj, ARM_L_HEX, 0.48, 0.12)
    else if (side === 'R') tintMesh(obj, ARM_R_HEX, 0.48, 0.12)
    else tintMesh(obj, colour.accent, 0.55, 0.08)
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

/** Show the whole XLe twin: cart base, both arm trees, OG head. */
function showFullXle(robot: URDFRobot) {
  for (const link of Object.values(robot.links)) link.visible = true
  robot.traverse((obj) => {
    obj.visible = true
  })
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

function useUrdf(url: string, workingPath: string) {
  const [robot, setRobot] = useState<URDFRobot | null>(null)
  const [generation, setGeneration] = useState(0)

  useEffect(() => {
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
  }, [url, workingPath])

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
  const xle = useUrdf(XLE_URDF, XLE_PATH)
  const rootRef = useRef<Group>(null)
  const [floorY, setFloorY] = useState(0)

  useLayoutEffect(() => {
    if (!xle.robot) return
    showFullXle(xle.robot)
    colorizeXle(xle.robot, colour)
    mapXlePose(xle.robot, carriageAglMm, armShoulderRad, armElbowRad)
  }, [xle.robot, xle.generation, colour, carriageAglMm, armShoulderRad, armElbowRad])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !xle.robot) return
    root.position.y = 0
    root.updateWorldMatrix(true, true)
    const box = visibleWorldBox(root)
    const nextFloor = box ? -box.min.y + SIT_EPS : 0
    root.position.y = nextFloor
    setFloorY((y) => (Math.abs(y - nextFloor) > 1e-4 ? nextFloor : y))
  }, [xle.robot, xle.generation, carriageAglMm, armShoulderRad, armElbowRad])

  return (
    <group ref={rootRef} position={[0, floorY, 0]} rotation={ROS_TO_THREE}>
      {xle.robot ? <primitive object={xle.robot} /> : null}
    </group>
  )
}

export function meshAttribution(kit: KitBuild) {
  return (
    `${kitCaption(kit)}. ` +
    `XLeRobot (Vector-Wangel): RÅSKOG base + dual SO-101 on cart platform + OG head pan/tilt, Apache-2.0. ` +
    `URDF: public/assets/xlerobot/xlerobot/xlerobot.urdf. Print: print/xlerobot/hardware/. ` +
    `Not LeKiwi — cart is the drive base. Overall BOM stack ~${OVERALL_HEIGHT_MM} mm optional.`
  )
}

export const MESH_ATTRIBUTION = meshAttribution({
  preset: 'xlerobot',
  base: 'lekiwi',
  arms: 'xlerobot',
  head: 'xlerobot',
})
