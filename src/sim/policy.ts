/**
 * In-browser behavioral cloning for the digital twin.
 * Linear policy: action = tanh(W · features + b), trained with SGD on teleop dumps.
 */

import { clamp, type Steering } from '../steering'
import type { TrainObservation, TrainSample } from './train'

export const POLICY_FEATURE_DIM = 12
export const POLICY_ACTION_DIM = 3
const STORAGE_KEY = 'pebble-bc-policy-v1'

export type PolicyWeights = {
  version: 1
  featureDim: number
  actionDim: number
  /** row-major [actionDim × featureDim] */
  W: number[]
  b: number[]
  epochs: number
  samples: number
  loss: number
  updatedAt: number
}

export type TrainReport = {
  epochs: number
  samples: number
  loss: number
  ok: boolean
  message: string
}

function feat(obs: TrainObservation): number[] {
  return [
    Math.tanh(obs.ball_dx),
    Math.tanh(obs.ball_dy),
    Math.tanh(obs.ball_bearing),
    Math.tanh(obs.ball_range / 2),
    Math.tanh(obs.box_dx),
    Math.tanh(obs.box_dy),
    Math.tanh(obs.box_range / 2),
    obs.box_held ? 1 : 0,
    Math.tanh(obs.v),
    Math.tanh(obs.omega),
    obs.lift_frac * 2 - 1,
    Math.tanh(obs.arm_shoulder),
  ]
}

function zeros(n: number) {
  return Array.from({ length: n }, () => 0)
}

function randn() {
  // Box-Muller
  const u = 1 - Math.random()
  const v = 1 - Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export function createRandomWeights(scale = 0.08): PolicyWeights {
  const W = Array.from({ length: POLICY_ACTION_DIM * POLICY_FEATURE_DIM }, () => randn() * scale)
  return {
    version: 1,
    featureDim: POLICY_FEATURE_DIM,
    actionDim: POLICY_ACTION_DIM,
    W,
    b: zeros(POLICY_ACTION_DIM),
    epochs: 0,
    samples: 0,
    loss: 0,
    updatedAt: Date.now(),
  }
}

export function predict(weights: PolicyWeights, obs: TrainObservation): Steering {
  const x = feat(obs)
  const out = [0, 0, 0]
  for (let a = 0; a < POLICY_ACTION_DIM; a++) {
    let s = weights.b[a] ?? 0
    const row = a * POLICY_FEATURE_DIM
    for (let i = 0; i < POLICY_FEATURE_DIM; i++) s += (weights.W[row + i] ?? 0) * (x[i] ?? 0)
    out[a] = Math.tanh(s)
  }
  return {
    forward: clamp(out[0] ?? 0),
    strafe: clamp(out[1] ?? 0),
    yawRate: clamp(out[2] ?? 0),
  }
}

/** One SGD pass over samples; mutates weights. */
export function trainBehavioralCloning(
  weights: PolicyWeights,
  samples: readonly TrainSample[],
  opts?: { epochs?: number; lr?: number; l2?: number },
): TrainReport {
  const usable = samples.filter((s) => {
    const a = s.action
    return Math.hypot(a.forward, a.strafe ?? 0, a.yawRate) > 0.02
  })
  if (usable.length < 40) {
    return {
      epochs: 0,
      samples: usable.length,
      loss: weights.loss,
      ok: false,
      message: `Need ≥40 moving teleop samples (have ${usable.length}). Drive in TELEOP first.`,
    }
  }

  const epochs = opts?.epochs ?? 25
  const lr = opts?.lr ?? 0.05
  const l2 = opts?.l2 ?? 1e-4
  let loss = 0

  for (let ep = 0; ep < epochs; ep++) {
    loss = 0
    // shuffle indices
    const idx = usable.map((_, i) => i)
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[idx[i], idx[j]] = [idx[j]!, idx[i]!]
    }
    for (const i of idx) {
      const sample = usable[i]!
      const x = feat(sample.obs)
      const y = [
        clamp(sample.action.forward),
        clamp(sample.action.strafe ?? 0),
        clamp(sample.action.yawRate),
      ]
      const pred = [0, 0, 0]
      const pre = [0, 0, 0]
      for (let a = 0; a < POLICY_ACTION_DIM; a++) {
        let s = weights.b[a] ?? 0
        const row = a * POLICY_FEATURE_DIM
        for (let f = 0; f < POLICY_FEATURE_DIM; f++) s += (weights.W[row + f] ?? 0) * (x[f] ?? 0)
        pre[a] = s
        pred[a] = Math.tanh(s)
        const err = (pred[a] ?? 0) - (y[a] ?? 0)
        loss += err * err
        const dTanh = 1 - (pred[a] ?? 0) * (pred[a] ?? 0)
        const g = 2 * err * dTanh
        weights.b[a] = (weights.b[a] ?? 0) - lr * (g + l2 * (weights.b[a] ?? 0))
        for (let f = 0; f < POLICY_FEATURE_DIM; f++) {
          const wi = row + f
          const w = weights.W[wi] ?? 0
          weights.W[wi] = w - lr * (g * (x[f] ?? 0) + l2 * w)
        }
      }
    }
    loss /= usable.length * POLICY_ACTION_DIM
  }

  weights.epochs += epochs
  weights.samples = usable.length
  weights.loss = loss
  weights.updatedAt = Date.now()

  return {
    epochs,
    samples: usable.length,
    loss,
    ok: true,
    message: `Trained ${epochs} epochs on ${usable.length} samples · loss ${loss.toFixed(4)}`,
  }
}

export function savePolicy(weights: PolicyWeights): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weights))
  } catch {
    /* ignore quota */
  }
}

export function loadPolicy(): PolicyWeights | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PolicyWeights
    if (parsed?.version !== 1 || !Array.isArray(parsed.W) || !Array.isArray(parsed.b)) return null
    if (parsed.W.length !== POLICY_ACTION_DIM * POLICY_FEATURE_DIM) return null
    return parsed
  } catch {
    return null
  }
}

export function clearSavedPolicy(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function downloadPolicy(weights: PolicyWeights, filename = `pebble-policy-${Date.now()}.json`): void {
  const blob = new Blob([JSON.stringify(weights, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
