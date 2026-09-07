# Upstream — lead-screw Z lift / carriage

## Prusa i3 MK3 Z + nut carriage (primary printable lift)
**Source:** [prusa3d/Original-Prusa-i3](https://github.com/prusa3d/Original-Prusa-i3)  
**License:** GPL-2.0 (see `LICENSE.GPL-2.0.txt`)  
**Files:**
- `z-axis-bottom.stl` — NEMA17 Z motor mount (column base)
- `z-axis-top.stl` — top lead-screw bearing block
- `z-screw-cover.stl` — screw cover
- `carriage_x-end-motor.stl` ← upstream `x-end-motor.stl` (trapezoidal-nut carriage; both SO-101s bolt here via 4040 mounts)

## SO-ARM100 4040 mount (arm → column/carriage adapter)
**Source:** [TheRobotStudio/SO-ARM100](https://github.com/TheRobotStudio/SO-ARM100) `Optional/4040_Base_Mount`  
**License:** Apache-2.0 (see `LICENSE.SO-ARM100.Apache-2.0.txt`)  
**File:** `4040_base_mount.stl`

## Bought (not printed) — called out in BOM
- T8 / Tr8 lead screw (~1.4–1.6 m) + coupler + bearings
- 2040/2020 aluminium extrusion column to reach overall **1730 mm (~5′8″)**
- MGN12 rail (anti-rotation) optional

Printable lift meshes alone are short Prusa-scale parts; **purchased extrusion** extends the column to human height.
