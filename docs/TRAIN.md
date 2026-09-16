# Train & test AI in the browser twin

The `/sim` page records teleop and trains a small **behavioral cloning** policy in-browser (no server).

## Loop

1. Open `/sim` → press **DRIVE**
2. **TAB** or Train panel → **Teleop**
3. Drive toward the beacon / box (W/A/S/D, arrows). Recording is on by default.
4. **Train BC** when you have ≥40 moving samples
5. **Test AI** — mode switches to `POLICY`; the linear net drives from the same observation vector
6. **Space** e-stop / reset pose (keeps trajectory). **Clear traj** / **Clear AI** wipe demos or weights.

## Observation → action

| Obs (normalized) | Action |
|------------------|--------|
| ball dx/dy/bearing/range | `forward` |
| box dx/dy/range + held | `strafe` |
| v, omega, lift frac, arm shoulder | `yawRate` |

Fixed control rate **50 Hz** (`DT = 0.02`). Physics = planar holonomic mecanum (not MuJoCo).

## API

After Sim mounts:

```js
const t = window.__PEBBLE_TRAIN__
t.buffer.length
t.trainFromBuffer(40)
t.runPolicy()
t.downloadTrajectory()
t.downloadPolicy()
```

Weights persist in `localStorage` (`pebble-bc-policy-v1`).

## Honest limits

- BC copies your teleop style — garbage demos → garbage policy
- No vision / depth — state features only
- Arms/lift are observed but the action is base steering only (extend later)
- Stub **AUTO** (TAB) is still the simple beacon seeker when no policy is running

Print kit: `print/README.md`. Assembly: `docs/ASSEMBLY.md`.
