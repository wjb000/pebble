# Pebble

Microduck body + dual LeRobot SO-101 arms (not an official Pollen product).

## Meshes (visual truth)
**Meshes: Microduck (microduck_rl, CC BY-SA-NC) + SO-101 (TheRobotStudio/SO-ARM100)**

- `public/assets/microduck/` — assembled MJCF-derived body STL + NOTICE (CC BY-SA-NC)
- `public/assets/so101/` — URDF-baked follower STL + NOTICE (Apache-2.0 upstream)

`src/robot/dims.ts` documents nominal mm / mounts; on-screen geometry is the imported CAD meshes, not procedural primitives.

## Dev
npm run dev   # http://127.0.0.1:5173 — hard-refresh /sim
npm run build
Routes: / /sim /bom /docs

## Sim / teleop
Tank-style: W/S forward, A/D yaw, Space reset, Tab auto. DT=0.02 (50Hz).
Training: src/sim/train.ts and window.__PEBBLE_TRAIN__ (downloadTrajectory).
Not MuJoCo — CAD meshes are the visual twin. GITHUB_PAGES=true for /pebble/ base.
