/**
 * HouseHand twin — real CAD only (no box/cylinder fake body).
 *
 * Base + 3× omni + SO-101 #1: SIGRobotics-UIUC/LeKiwi URDF meshes (Apache-2.0)
 * SO-101 #2: TheRobotStudio/SO-ARM100 so101_new_calib URDF + Simulation/SO101/assets
 *
 * Print: print/lekiwi/ + print/SO101/Individual/ (×2)
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box3, Group, LoadingManager, Mesh, MeshStandardMaterial, type Object3D } from 'three'
import URDFLoader, { type URDFRobot } from 'urdf-loader'
import type { Colourway } from '../product'
import { OVERALL_HEIGHT_MM, TELESCOPE, mmToM } from '../robot/dims'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const LEKIWI_URDF = asset('assets/lekiwi/LeKiwi.urdf')
const LEKIWI_PATH = asset('assets/lekiwi/')
const SO101_URDF = asset('assets/so101/so101_new_calib.urdf')
const SO101_PATH = asset('assets/so101/')

function tintMesh(mesh: Mesh, hex: string, roughness = 0.58, metalness = 0.08) {
  const mat = new MeshStandardMaterial({ color: hex, roughness, metalness })
  mesh.material = mat
  mesh.castShadow = true
  mesh.receiveShadow = true
}

function meshLabel(obj: Object3D) {
  const parts = [obj.name, obj.parent?.name, obj.parent?.parent?.name, obj.parent?.parent?.parent?.name]
  return parts.filter(Boolean).join(' ').toLowerCase()
}

function colorizeLeKiwi(root: Object3D, colour: Colourway) {
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return
    const n = meshLabel(obj)
    if (n.includes('omni') || n.includes('wheel')) {
      tintMesh(obj, '#1a1a1a', 0.9, 0.04)
    } else if (n.includes('sts3215') || n.includes('st3215') || n.includes('servo')) {
      tintMesh(obj, '#1f2937', 0.35, 0.55)
    } else if (n.includes('battery')) {
      tintMesh(obj, '#374151', 0.5, 0.2)
    } else if (n.includes('camera')) {
      tintMesh(obj, '#111827', 0.4, 0.25)
    } else if (
      n.includes('jaw') ||
      n.includes('wrist') ||
      n.includes('arm') ||
      n.includes('so_arm') ||
      n.includes('rotation') ||
      n.includes('base_08')
    ) {
      tintMesh(obj, '#38bdf8', 0.45, 0.12)
    } else {
      tintMesh(obj, colour.primary, 0.62, 0.06)
    }
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
  return span > 0
    ? Math.max(0, Math.min(1, (carriageAglMm - TELESCOPE.min_agl_mm) / span))
    : 0
}

function setJoint(robot: URDFRobot, name: string, value: number) {
  if (robot.joints[name]) robot.setJointValue(name, value)
}

function mapLeKiwiArm(
  robot: URDFRobot,
  carriageAglMm: number,
  armShoulderRad: number,
  armElbowRad: number,
) {
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
) {
  const t = liftT(carriageAglMm)
  setJoint(robot, 'shoulder_pan', 0.35)
  setJoint(robot, 'shoulder_lift', 0.55 - t * 0.7 + armShoulderRad * 0.35)
  setJoint(robot, 'elbow_flex', 0.9 - t * 0.5 + armElbowRad * 0.4)
  setJoint(robot, 'wrist_flex', -0.2)
  setJoint(robot, 'wrist_roll', 0)
  setJoint(robot, 'gripper', 0.4)
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
      (err) => {
        console.error('URDF failed to load', url, err)
      },
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
  const lekiwi = useUrdf(LEKIWI_URDF, LEKIWI_PATH)
  const so101 = useUrdf(SO101_URDF, SO101_PATH)
  const rootRef = useRef<Group>(null)

  useLayoutEffect(() => {
    if (!lekiwi.robot) return
    colorizeLeKiwi(lekiwi.robot, colour)
    mapLeKiwiArm(lekiwi.robot, carriageAglMm, armShoulderRad, armElbowRad)
  }, [lekiwi.robot, lekiwi.generation, colour, carriageAglMm, armShoulderRad, armElbowRad])

  useLayoutEffect(() => {
    if (!so101.robot) return
    colorizeSo101(so101.robot, '#f97316')
    mapSo101Arm(so101.robot, carriageAglMm, armShoulderRad, armElbowRad)
  }, [so101.robot, so101.generation, carriageAglMm, armShoulderRad, armElbowRad])

  useLayoutEffect(() => {
    const g = rootRef.current
    if (!g || !lekiwi.robot) return
    g.position.y = mmToM(48)
    g.updateWorldMatrix(true, true)
    const box = new Box3().setFromObject(g)
    if (Number.isFinite(box.min.y)) g.position.y -= box.min.y
  }, [lekiwi.generation, so101.generation, carriageAglMm, armShoulderRad, armElbowRad])

  return (
    <group ref={rootRef} rotation={[-Math.PI / 2, 0, Math.PI]} position={[0, mmToM(48), 0]}>
      {lekiwi.robot ? <primitive object={lekiwi.robot} /> : null}
      {so101.robot ? (
        <group position={[0.0, -0.175, 0.052]} rotation={[0, 0, Math.PI]}>
          <primitive object={so101.robot} />
        </group>
      ) : null}
    </group>
  )
}

export const MESH_ATTRIBUTION =
  `Real CAD: LeKiwi URDF (SIGRobotics-UIUC, Apache-2.0) + SO-101 URDF (TheRobotStudio/SO-ARM100, Apache-2.0). ` +
  `Print: print/lekiwi/ + print/SO101/Individual/ ×2. Twin is the printable robot, not generated envelopes. Overall BOM stack ~${OVERALL_HEIGHT_MM} mm if you add a nested column.`
