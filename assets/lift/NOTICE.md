# Upstream — lead-screw Z lift / carriage

## Prusa i3 MK3 Z + nut carriage (primary printable lift)
**Source:** [prusa3d/Original-Prusa-i3](https://github.com/prusa3d/Original-Prusa-i3)  
**License:** GPL-2.0 (see `LICENSE.GPL-2.0.txt`) — **derivatives of these STLs must remain GPL-2.0**  
**Files:**
- `z-axis-bottom.stl` — NEMA17 Z motor mount (column base)
- `z-axis-top.stl` — top lead-screw bearing block
- `z-screw-cover.stl` — screw cover
- `carriage_x-end-motor.stl` ← upstream `x-end-motor.stl` (trapezoidal-nut carriage; both SO-101s bolt here via 4040 mounts)

## SO-ARM100 4040 mount (arm → column/carriage adapter)
**Source:** [TheRobotStudio/SO-ARM100](https://github.com/TheRobotStudio/SO-ARM100) `Optional/4040_Base_Mount`  
**License:** Apache-2.0 (see `LICENSE.SO-ARM100.Apache-2.0.txt`)  
**File:** `4040_base_mount.stl`

## Bought (not printed) — v3 BOM
- Nested telescoping column + **internal** T8 (not an exposed MGN rail)
- HouseHand v3 twin does **not** load the Prusa Z carriage STLs — only `4040_base_mount.stl`

Prusa Z meshes remain as a GPL-2.0 print archive.
