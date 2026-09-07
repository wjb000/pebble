/** LEGACY — gated off. /sim default is ImportedRobots (real Microduck+SO-101 STLs). Do not import from Scene. */
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { GaitPose, LegAngles, NeckAngles } from '../gait'
import type { Colourway } from '../product'
import {
  ARM,
  BATTERY,
  BEAK,
  CAMERA,
  FOOT,
  FRAME,
  HEAD,
  HIP_HEIGHT_MM,
  HIP_LATERAL,
  JOINT,
  NECK_LEN,
  PELVIS,
  PI_ZERO,
  SHIN_LEN,
  SO101,
  STANDING_HEIGHT_MM,
  STS3215,
  THIGH_LEN,
  TORSO,
  XL330,
  mmToM,
} from '../robot/dims'

type Props = {
  x: number
  y: number
  theta: number
  pose: GaitPose
  colour: Colourway
}

const m = mmToM
const hipY = m(HIP_HEIGHT_MM)
const thigh = m(THIGH_LEN)
const shin = m(SHIN_LEN)
const footL = m(FOOT.L)
const footW = m(FOOT.W)
const footH = m(FOOT.H)
const pelvisW = m(PELVIS.W)
const pelvisH = m(PELVIS.H)
const pelvisD = m(PELVIS.D)
const torsoW = m(TORSO.W)
const torsoH = m(TORSO.H)
const torsoD = m(TORSO.D)
const neckLen = m(NECK_LEN)
const headW = m(HEAD.W)
const headH = m(HEAD.H)
const headD = m(HEAD.D)
const beakL = m(BEAK.L)
const beakW = m(BEAK.W)
const beakH = m(BEAK.H)
const camW = m(CAMERA.W)
const camH = m(CAMERA.H)
const camD = m(CAMERA.D)
const xlL = m(XL330.L)
const xlW = m(XL330.W)
const xlH = m(XL330.H)
const stsL = m(STS3215.L)
const stsW = m(STS3215.W)
const stsH = m(STS3215.H)
const tubeR = m(FRAME.link_radius)
const hipLat = m(HIP_LATERAL)
const shoulderSpan = m(ARM.shoulder_span)
const soUpper = m(SO101.upper_arm)
const soFore = m(SO101.forearm)
const soWrist = m(SO101.wrist)
const soGrip = m(SO101.gripper)
const soBaseZ = m(SO101.base_z)
const soLiftZ = m(SO101.shoulder_lift_z)
const piW = m(PI_ZERO.W)
const piH = m(PI_ZERO.H)
const piD = m(PI_ZERO.D)
const batW = m(BATTERY.W)
const batH = m(BATTERY.H)
const batD = m(BATTERY.D)
const yawToRoll = m(JOINT.yaw_to_roll)
const rollToPitch = m(JOINT.roll_to_pitch)

/** Dynamixel XL330 body (legs / neck / beak) */
function XL330Block({
  colour,
  rot = [0, 0, 0] as [number, number, number],
}: {
  colour: Colourway
  rot?: [number, number, number]
}) {
  return (
    <group rotation={rot}>
      <mesh castShadow>
        <boxGeometry args={[xlL, xlH, xlW]} />
        <meshStandardMaterial color={colour.dark} metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[xlL * 0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[m(2.5), m(2.5), m(FRAME.horn_thickness), 10]} />
        <meshStandardMaterial color={colour.accent} metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  )
}

/** Feetech STS3215 — visible on every SO-101 joint */
function STS3215Block({
  colour,
  rot = [0, 0, 0] as [number, number, number],
}: {
  colour: Colourway
  rot?: [number, number, number]
}) {
  return (
    <group rotation={rot}>
      <mesh castShadow>
        <boxGeometry args={[stsL, stsH, stsW]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.28} />
      </mesh>
      <mesh position={[stsL * 0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[m(4), m(4), m(3), 12]} />
        <meshStandardMaterial color={colour.accent} metalness={0.55} roughness={0.25} />
      </mesh>
    </group>
  )
}

function LinkTube({ len, colour, radius = tubeR }: { len: number; colour: Colourway; radius?: number }) {
  return (
    <mesh position={[0, -len / 2, 0]} castShadow>
      <capsuleGeometry args={[radius, Math.max(0.008, len - radius * 2), 6, 10]} />
      <meshStandardMaterial color={colour.primary} roughness={0.42} metalness={0.15} />
    </mesh>
  )
}

/** 5-DOF Microduck leg: hip_yaw → hip_roll → hip_pitch → knee → ankle */
function Leg({
  side,
  angles,
  colour,
}: {
  side: 'L' | 'R'
  angles: LegAngles
  colour: Colourway
}) {
  const sx = side === 'L' ? hipLat : -hipLat
  return (
    <group position={[sx, 0, 0]}>
      <group rotation={[0, angles.hipYaw, 0]}>
        <XL330Block colour={colour} rot={[0, 0, Math.PI / 2]} />
        <group position={[0, -yawToRoll, 0]} rotation={[0, 0, angles.hipRoll]}>
          <XL330Block colour={colour} />
          <group position={[0, -rollToPitch, 0]} rotation={[angles.hipPitch, 0, 0]}>
            <XL330Block colour={colour} rot={[Math.PI / 2, 0, 0]} />
            <LinkTube len={thigh} colour={colour} radius={tubeR * 0.85} />
            <group position={[0, -thigh, 0]} rotation={[angles.knee, 0, 0]}>
              <XL330Block colour={colour} rot={[Math.PI / 2, 0, 0]} />
              <LinkTube len={shin} colour={colour} radius={tubeR * 0.8} />
              <group position={[0, -shin, 0]} rotation={[angles.ankle, 0, 0]}>
                <XL330Block colour={colour} rot={[Math.PI / 2, 0, 0]} />
                <mesh position={[0, -footH * 0.5, footL * 0.15]} castShadow>
                  <boxGeometry args={[footW, footH, footL]} />
                  <meshStandardMaterial color={colour.dark} roughness={0.55} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

/**
 * LeRobot SO-101 follower — 6 DOF idle pose.
 * Joints: shoulder_pan, shoulder_lift, elbow_flex, wrist_flex, wrist_roll, gripper
 * Visible STS3215 at each joint. Reach ~500 mm (published).
 */
function SO101Arm({
  side,
  colour,
  gripperClose = 0,
}: {
  side: 'L' | 'R'
  colour: Colourway
  gripperClose?: number
}) {
  const sx = side === 'L' ? 1 : -1
  const mountY = torsoH * ARM.mount_y_frac
  // Idle: slight outward pan, lift down, elbow bent, wrist neutral
  const pan = sx * 0.35
  const lift = 0.55
  const elbow = -1.15
  const wFlex = -0.35
  const wRoll = sx * 0.15
  const jaw = 0.02 + gripperClose * 0.035

  return (
    <group position={[sx * shoulderSpan * 0.5, mountY, m(ARM.mount_forward)]}>
      {/* mount plate on torso */}
      <mesh position={[-sx * m(8), 0, 0]} castShadow>
        <boxGeometry args={[m(18), m(28), m(14)]} />
        <meshStandardMaterial color={colour.dark} metalness={0.35} roughness={0.4} />
      </mesh>
      {/* shoulder_pan */}
      <group rotation={[0, pan, 0]}>
        <STS3215Block colour={colour} rot={[0, 0, Math.PI / 2]} />
        <mesh position={[0, soBaseZ * 0.35, 0]}>
          <cylinderGeometry args={[m(18), m(20), soBaseZ * 0.7, 14]} />
          <meshStandardMaterial color={colour.dark} roughness={0.45} />
        </mesh>
        {/* shoulder_lift */}
        <group position={[0, soBaseZ * 0.75, 0]} rotation={[lift, 0, sx * 0.08]}>
          <STS3215Block colour={colour} />
          <group position={[0, -soLiftZ * 0.15, 0]} rotation={[0, 0, 0]}>
            <LinkTube len={soUpper} colour={colour} radius={m(10)} />
            {/* elbow_flex */}
            <group position={[0, -soUpper, 0]} rotation={[elbow, 0, 0]}>
              <STS3215Block colour={colour} rot={[Math.PI / 2, 0, 0]} />
              <LinkTube len={soFore} colour={colour} radius={m(9)} />
              {/* wrist_flex */}
              <group position={[0, -soFore, 0]} rotation={[wFlex, 0, 0]}>
                <STS3215Block colour={colour} rot={[Math.PI / 2, 0, 0]} />
                {/* wrist_roll */}
                <group position={[0, -soWrist * 0.35, 0]} rotation={[0, 0, wRoll]}>
                  <STS3215Block colour={colour} />
                  <mesh position={[0, -soWrist * 0.35, 0]} castShadow>
                    <cylinderGeometry args={[m(8), m(8), soWrist * 0.5, 10]} />
                    <meshStandardMaterial color={colour.primary} roughness={0.4} />
                  </mesh>
                  {/* gripper */}
                  <group position={[0, -soWrist * 0.7, 0]}>
                    <STS3215Block colour={colour} rot={[0, 0, Math.PI / 2]} />
                    <mesh position={[-jaw, -soGrip * 0.35, 0]} castShadow>
                      <boxGeometry args={[m(8), soGrip * 0.7, m(14)]} />
                      <meshStandardMaterial color={colour.belly} roughness={0.45} />
                    </mesh>
                    <mesh position={[jaw, -soGrip * 0.35, 0]} castShadow>
                      <boxGeometry args={[m(8), soGrip * 0.7, m(14)]} />
                      <meshStandardMaterial color={colour.belly} roughness={0.45} />
                    </mesh>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

/** Duck head: neck_pitch → head_pitch → head_yaw → head_roll + beak */
function DuckHead({ neck, colour }: { neck: NeckAngles; colour: Colourway }) {
  return (
    <group position={[0, torsoH * 0.5 + neckLen * 0.1, 0]}>
      <group rotation={[neck.neckPitch, 0, 0]}>
        <XL330Block colour={colour} rot={[Math.PI / 2, 0, 0]} />
        <mesh position={[0, neckLen * 0.4, 0]} castShadow>
          <cylinderGeometry args={[m(8), m(10), neckLen * 0.75, 12]} />
          <meshStandardMaterial color={colour.dark} metalness={0.35} roughness={0.35} />
        </mesh>
        <group position={[0, neckLen * 0.85, 0]} rotation={[neck.headPitch, 0, 0]}>
          <XL330Block colour={colour} rot={[Math.PI / 2, 0, 0]} />
          <group position={[0, m(10), 0]} rotation={[0, neck.headYaw, 0]}>
            <XL330Block colour={colour} rot={[0, 0, Math.PI / 2]} />
            <group position={[0, m(10), 0]} rotation={[0, 0, neck.headRoll]}>
              <XL330Block colour={colour} />
              {/* head shell */}
              <mesh position={[0, headH * 0.25, 0]} castShadow>
                <boxGeometry args={[headW, headH, headD]} />
                <meshStandardMaterial color={colour.primary} roughness={0.4} metalness={0.08} />
              </mesh>
              {/* cheek / eye */}
              <mesh position={[-headW * 0.28, headH * 0.3, headD * 0.45]}>
                <sphereGeometry args={[m(5), 10, 10]} />
                <meshStandardMaterial color="#0a0a0a" />
              </mesh>
              <mesh position={[headW * 0.28, headH * 0.3, headD * 0.45]}>
                <sphereGeometry args={[m(5), 10, 10]} />
                <meshStandardMaterial color="#0a0a0a" />
              </mesh>
              {/* beak — mouth/beak XL330 slot (15th) */}
              <group position={[0, headH * 0.05, headD * 0.45]}>
                <XL330Block colour={colour} rot={[Math.PI / 2, 0, 0]} />
                <mesh position={[0, -m(2), beakL * 0.45]} castShadow>
                  <boxGeometry args={[beakW, beakH, beakL]} />
                  <meshStandardMaterial color={colour.accent} roughness={0.5} />
                </mesh>
                <mesh position={[0, -beakH * 0.9, beakL * 0.35]}>
                  <boxGeometry args={[beakW * 0.9, beakH * 0.55, beakL * 0.75]} />
                  <meshStandardMaterial color={colour.cheek} roughness={0.55} />
                </mesh>
              </group>
              {/* camera */}
              <group position={[0, headH * 0.55 + camH * 0.5 + m(CAMERA.rise), m(4)]}>
                <mesh>
                  <boxGeometry args={[camW, camH, camD]} />
                  <meshStandardMaterial color="#111" metalness={0.5} roughness={0.3} />
                </mesh>
                <mesh position={[0, 0, camD * 0.4]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[m(2.5), m(2.5), m(2), 12]} />
                  <meshStandardMaterial color="#222" metalness={0.7} roughness={0.2} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

function ScaleBar() {
  const barLen = m(STANDING_HEIGHT_MM)
  return (
    <group position={[m(120), 0, 0]}>
      <mesh position={[0, barLen / 2, 0]}>
        <boxGeometry args={[m(3), barLen, m(3)]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[m(24), m(2), m(24)]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      <mesh position={[0, barLen, 0]}>
        <boxGeometry args={[m(24), m(2), m(24)]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
    </group>
  )
}

export function Pebble({ x, y, theta, pose, colour }: Props) {
  const root = useRef<Group>(null)
  useFrame(() => {
    if (!root.current) return
    root.current.position.set(x, pose.bob, y)
    root.current.rotation.y = -theta + Math.PI / 2
  })

  return (
    <group ref={root}>
      <ScaleBar />
      <group position={[0, hipY, 0]}>
        {/* pelvis */}
        <mesh castShadow>
          <boxGeometry args={[pelvisW, pelvisH, pelvisD]} />
          <meshStandardMaterial color={colour.dark} metalness={0.3} roughness={0.4} />
        </mesh>
        <Leg side="L" angles={pose.left} colour={colour} />
        <Leg side="R" angles={pose.right} colour={colour} />

        {/* duck trunk */}
        <group position={[0, pelvisH * 0.5 + torsoH * 0.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[torsoW, torsoH, torsoD]} />
            <meshStandardMaterial color={colour.primary} roughness={0.4} metalness={0.08} />
          </mesh>
          {/* belly */}
          <mesh position={[0, -m(8), torsoD * 0.38]}>
            <boxGeometry args={[torsoW * 0.72, torsoH * 0.55, m(12)]} />
            <meshStandardMaterial color={colour.belly} roughness={0.5} />
          </mesh>
          {/* rounded back hint */}
          <mesh position={[0, m(4), -torsoD * 0.35]}>
            <sphereGeometry args={[m(28), 12, 10]} />
            <meshStandardMaterial color={colour.primary} roughness={0.42} />
          </mesh>
          {/* compute bay */}
          <mesh position={[m(-12), m(8), -torsoD * 0.28]}>
            <boxGeometry args={[piW, piH, piD]} />
            <meshStandardMaterial color="#2d6a4f" metalness={0.25} roughness={0.4} />
          </mesh>
          <mesh position={[m(22), -m(12), -torsoD * 0.28]}>
            <boxGeometry args={[batW, batH, batD]} />
            <meshStandardMaterial color={colour.dark} metalness={0.35} roughness={0.35} />
          </mesh>
          <DuckHead neck={pose.neck} colour={colour} />
          <SO101Arm side="L" colour={colour} gripperClose={pose.handClose} />
          <SO101Arm side="R" colour={colour} gripperClose={pose.handClose} />
        </group>
      </group>
    </group>
  )
}

export const PEBBLE_HEIGHT_LABEL = `${STANDING_HEIGHT_MM} mm`
