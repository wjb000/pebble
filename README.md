# Pebble

Draft **cheap wheeled house-chore bot** from **real OSS meshes** (no generated bodies):

- **Base:** [PedroS235/perceptron_bot](https://github.com/PedroS235/perceptron_bot) (MIT)
- **Lift:** [prusa3d/Original-Prusa-i3](https://github.com/prusa3d/Original-Prusa-i3) Z + x-end carriage (**GPL-2.0** — derivatives stay GPL)
- **Head/cam:** [TheRobotStudio/SO-ARM100](https://github.com/TheRobotStudio/SO-ARM100) Overhead Cam (Apache-2.0), **1:1**
- **Arms:** **2×** LeRobot SO-101 (Apache-2.0)

**Height ~1200 mm (~3′11″)** — chore stack (counters / washer rim / floor).  
Shoulders **160→950 mm AGL**. **MGN12H REQUIRED**. Outriggers **400 mm** + ballast **4.0 kg** → tip margin ≈**1.22×**.  
Draft twin ≈ **$715** (prior ~$655 + safety delta). Not for sale · not official Pollen.

- Sim: [/pebble/sim](https://wjb000.github.io/pebble/sim)
- Model: [/pebble/model](https://wjb000.github.io/pebble/model)
- BOM: [/pebble/bom](https://wjb000.github.io/pebble/bom)
- Docs: [/pebble/docs](https://wjb000.github.io/pebble/docs)
- Dims: `src/robot/dims.ts` · Tip: `src/robot/stability.ts` · Assembly: `docs/ASSEMBLY.md`

## Poka-yoke

- **Space** = e-stop / reset · soft lift limits · tip HUD (physics) + tip slowdown (UX)
- **G** = chore demo (floor→basket, wipe, washer @~900)
- Power off while wiring · do not skip ballast / outriggers / MGN12 · keyed L/R physical lugs
