# Pebble — HouseHand v3

Draft **cheap wheeled house-chore bot**. Twin matches **`BOM_V3.md`**:

- **Form:** NYRO-like silhouette · telescoping torso · omni base · dual SO-101
- **Base:** 400×450 mm deck + **4× 4″ mecanum** (no casters, no RÅSKOG)
- **Lift:** nested tubes + internal T8 — column **grows/shrinks**, not an exposed rail carriage
- **Arms:** 2× LeRobot SO-101 (Apache-2.0)
- **Head:** SO-ARM100 Overhead Cam (Apache-2.0)

**Height ~1100 mm extended / ~540 mm collapsed.**  
Shoulders **462→1022 mm AGL**. Deck **400 mm** + 12V pack **4 kg** → tip margin ≈**2.5×**.  
Draft dual DIY **~$450–730**. Not for sale · not official Pollen.

- Sim: [/pebble/sim](https://wjb000.github.io/pebble/sim)
- Model: [/pebble/model](https://wjb000.github.io/pebble/model)
- BOM: [/pebble/bom](https://wjb000.github.io/pebble/bom)
- Docs: [/pebble/docs](https://wjb000.github.io/pebble/docs)
- Dims: `src/robot/dims.ts` · Tip: `src/robot/stability.ts` · Assembly: `docs/ASSEMBLY.md`

## Controls

W/S forward · **A/D strafe** · ←/→ or Z/X yaw · Q/E telescope · F pick · **G** chore demo · **Space** e-stop.

## Poka-yoke

- **Space** = e-stop / reset · soft lift limits · tip HUD (physics) + tip slowdown (UX)
- **G** = chore demo (floor→basket, wipe, washer @~900)
- Power off while wiring · do not skip nested column / 12V pack / e-stop · keyed L/R physical lugs
- **Do not buy:** RÅSKOG · ODrive/SteadyWin · Amazing Hand · exposed-rail-only lift · diff-only
