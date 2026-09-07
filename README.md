# Pebble

Draft wheeled home chore bot composed from **real OSS meshes** (no generated bodies):

- **Base:** [PedroS235/perceptron_bot](https://github.com/PedroS235/perceptron_bot) (MIT)
- **Lift:** [prusa3d/Original-Prusa-i3](https://github.com/prusa3d/Original-Prusa-i3) Z + x-end carriage (GPL-2.0)
- **Head/cam:** [TheRobotStudio/SO-ARM100](https://github.com/TheRobotStudio/SO-ARM100) Overhead Cam (Apache-2.0)
- **Arms:** 2× LeRobot SO-101 (Apache-2.0)

Overall **~5′8″ / 1730 mm** via bought 2040 extrusion. Sim: Q/E lead-screw elevator. Not for sale · not official Pollen.

- Sim: [/pebble/sim](https://wjb000.github.io/pebble/sim)
- Dims: `src/robot/dims.ts`
- Print: `print/{base,lift,head,SO101}/` + NOTICE files
