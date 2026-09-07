# Pebble

Draft wheeled home chore bot composed from **real OSS meshes** (no generated bodies):

- **Base:** [PedroS235/perceptron_bot](https://github.com/PedroS235/perceptron_bot) (MIT)
- **Lift:** [prusa3d/Original-Prusa-i3](https://github.com/prusa3d/Original-Prusa-i3) Z + x-end carriage (GPL-2.0)
- **Head/cam:** [TheRobotStudio/SO-ARM100](https://github.com/TheRobotStudio/SO-ARM100) Overhead Cam (Apache-2.0), **1:1**
- **Arms:** **2×** LeRobot SO-101 (Apache-2.0) — print two follower sets

Overall **~5′8″ / 1730 mm** = base 108 + bought 2040 extrusion 1540 + head stack 82.  
Sim: Q/E lead-screw elevator. Model tab: orbit-only shared `RobotAssembly`.  
Draft twin ≈ **$740** (arms DIY ~$250 dominate). Not for sale · not official Pollen.

- Sim: [/pebble/sim](https://wjb000.github.io/pebble/sim)
- Model: [/pebble/model](https://wjb000.github.io/pebble/model)
- Dims: `src/robot/dims.ts`
- Print: `print/{base,lift,head,SO101}/` + NOTICE files (SO101 = **2×**)

## Poka-yoke

- **Space** in sim = e-stop / reset · Q/E soft lift limits · tip slowdown when carriage high
- **IRL:** power off while wiring · do not skip ballast · L/R keyed blue/orange · see `docs/ASSEMBLY.md`
