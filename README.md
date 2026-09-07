# Pebble

Draft **cheap wheeled house-chore bot** from **real OSS meshes** (no generated bodies):

- **Base:** [PedroS235/perceptron_bot](https://github.com/PedroS235/perceptron_bot) (MIT)
- **Lift:** [prusa3d/Original-Prusa-i3](https://github.com/prusa3d/Original-Prusa-i3) Z + x-end carriage (GPL-2.0)
- **Head/cam:** [TheRobotStudio/SO-ARM100](https://github.com/TheRobotStudio/SO-ARM100) Overhead Cam (Apache-2.0), **1:1**
- **Arms:** **2×** LeRobot SO-101 (Apache-2.0)

**Height ~1200 mm (~3′11″)** — chore stack (counters / washer rim / floor), not full 5′8″.  
Shoulders **160→950 mm AGL**. Chores: floor pick, wipe, dishes assist, laundry basket / open-washer assist.  
Draft twin ≈ **$655**. Not for sale · not official Pollen.

- Sim: [/pebble/sim](https://wjb000.github.io/pebble/sim)
- Model: [/pebble/model](https://wjb000.github.io/pebble/model)
- Dims: `src/robot/dims.ts` · Assembly: `docs/ASSEMBLY.md`

## Poka-yoke

- **Space** = e-stop / reset · soft lift limits · tip slowdown when high
- Power off while wiring · do not skip ballast · L/R blue/orange keyed mounts
