/**
 * Locomotion controllers: beacon StubBrain + BC LearnedBrain.
 */

import { clamp, type Steering } from './steering'
import { predict, type PolicyWeights } from './sim/policy'
import type { TrainObservation } from './sim/train'

export type Observation = {
  robot_x: number
  robot_y: number
  robot_theta: number
  beacon_x: number
  beacon_y: number
}

export type Brain = {
  step(observation: Observation): Steering
}

export class StubBrain implements Brain {
  yawGain: number
  arriveRadius: number
  cruiseForward: number

  constructor(opts?: {
    yawGain?: number
    arriveRadius?: number
    cruiseForward?: number
  }) {
    this.yawGain = opts?.yawGain ?? 1.8
    this.arriveRadius = opts?.arriveRadius ?? 0.12
    this.cruiseForward = opts?.cruiseForward ?? 0.9
  }

  step(observation: Observation): Steering {
    const rx = observation.robot_x
    const ry = observation.robot_y
    const rth = observation.robot_theta
    const bx = observation.beacon_x
    const by = observation.beacon_y

    const dx = bx - rx
    const dy = by - ry
    const dist = Math.hypot(dx, dy)
    const desired = Math.atan2(dy, dx)
    const err = Math.atan2(Math.sin(desired - rth), Math.cos(desired - rth))

    let yaw = clamp((this.yawGain * err) / Math.PI * 2)
    const align = Math.max(0, 1 - Math.abs(err) / (Math.PI * 0.6))

    let forward = 0
    if (dist < this.arriveRadius) {
      yaw = 0
      forward = 0
    } else {
      forward = this.cruiseForward * align
    }

    return {
      forward: clamp(forward),
      yawRate: clamp(yaw),
      strafe: 0,
    }
  }
}

export class LearnedBrain {
  weights: PolicyWeights

  constructor(weights: PolicyWeights) {
    this.weights = weights
  }

  stepFromObs(obs: TrainObservation): Steering {
    return predict(this.weights, obs)
  }
}
