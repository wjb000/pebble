/**
 * Headless check: synthetic teleop → BC train → policy predicts toward ball.
 * Run: npx tsx scripts/check-train.mts
 */
import {
  createRandomWeights,
  predict,
  trainBehavioralCloning,
} from '../src/sim/policy.ts'
import type { TrainObservation, TrainSample } from '../src/sim/train.ts'

function obsAt(x: number, y: number, theta: number, bx: number, by: number): TrainObservation {
  const ball_dx = bx - x
  const ball_dy = by - y
  const ball_range = Math.hypot(ball_dx, ball_dy)
  const desired = Math.atan2(ball_dy, ball_dx)
  const ball_bearing = Math.atan2(Math.sin(desired - theta), Math.cos(desired - theta))
  return {
    x, y, theta, v: 0, omega: 0,
    ball_x: bx, ball_y: by, ball_dx, ball_dy, ball_bearing, ball_range,
    box_x: 1, box_y: 0, box_dx: 1 - x, box_dy: -y, box_range: 1, box_held: false,
    lift_frac: 0.3, arm_shoulder: 0, arm_elbow: 0, mode: 'teleop',
  }
}

const samples: TrainSample[] = []
let t = 0
for (let i = 0; i < 120; i++) {
  const theta = 0
  const x = i * 0.01
  const y = 0
  const obs = obsAt(x, y, theta, 1.5, 0)
  samples.push({
    t: (t += 0.02),
    dt: 0.02,
    obs,
    action: { forward: 0.8, strafe: 0, yawRate: obs.ball_bearing * 0.5 },
  })
}

const w = createRandomWeights()
const report = trainBehavioralCloning(w, samples, { epochs: 40, lr: 0.08 })
if (!report.ok) {
  console.error('FAIL', report.message)
  process.exit(1)
}
const out = predict(w, obsAt(0, 0, 0, 1.5, 0))
if (out.forward < 0.2) {
  console.error('FAIL: expected forward drive toward ball', out)
  process.exit(1)
}
console.log('OK', report.message, 'pred', out)
