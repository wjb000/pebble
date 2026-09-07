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

## Bought (not printed) — called out in BOM
- T8 / Tr8 lead screw (~1.1 m) + coupler + bearings — travel **160→950 mm AGL**
- 2040 aluminium extrusion column ~**1010 mm** → overall stack **~1200 mm** (chore envelope: counters / washer rim / floor)
- **MGN12H linear rail + carriage — REQUIRED** (anti-rotation; carries dual-arm torque). Not optional.

Printable lift meshes alone are short Prusa-scale parts; **purchased extrusion + T8 + MGN12** make the chore-height elevator.
