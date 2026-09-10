# LeKiwi print STLs — omni base

Upstream [SIGRobotics-UIUC/LeKiwi](https://github.com/SIGRobotics-UIUC/LeKiwi) (Apache-2.0).

Print these, then buy **3× 4″ omni wheels**, **3× STS3215** drive servos, and **6× M3 hex standoffs** (`94868A713` class).  
**Do not** print the onboard LeKiwi arm — HouseHand uses **2× SO-101** on the shoulder deck.

| STL | Qty | Notes |
|-----|----:|-------|
| `base_plate_layer1.stl` | 1 | Bottom plate (URDF `base_plate_layer1-v5`) |
| `base_plate_layer2.stl` | 1 | Top plate — torso bolts at `(±40,±80)` / `(±80,±40)` on the 20 mm grid |
| `drive_motor_mount.stl` | 3 | URDF `drive_motor_mount-v11` |
| `servo_wheel_hub.stl` | 3 | URDF `omni_wheel_mount-v5` — hub only; wheel bought |
| `servo_controller_mount.stl` | 1 | |
| `battery_mount.stl` (or `_eu`) | 1 | |
| `pi_case_top.stl` + `pi_case_bottom.stl` | 1 | |
| `base_camera_mount.stl` | 0–1 | Optional (head cam is on the neck) |

## Clearance / assembly

- Motors + hubs on **layer1**; hubs clear **layer2** underside ~4–5 mm.
- **6× hex standoffs** between layer1 ↔ layer2 — required, not printed.
- Drive chain: `drive_motor_mount` → **STS3215** → `servo_wheel_hub` → **4″ omni**.
- **3× omni at 120°** (LeKiwi kit layout: one aft, two forward-quarter). Do not rearrange for “symmetry” — mounts and wiring follow the kit.
- Omni tops poke above layer2; torso flange **Ø190** plus **wheel wells** over the two forward omnis so the 4″ tires can spin.
- Torso flange has **6× Ø3.4 through-holes** matching layer2’s 20 mm M3 grid (`(40,±80)`, `(±80,±40)`) — no freehand drill. `(−40,±80)` sit in the wells.
- STLs are Z-footed for the slicer (`python3 scripts/prep_print_stls.py`).
- Archived junk (wrong mounts, wrist cam, Jetson holder): `print/_archive/lekiwi/`.

Next: `HouseHand_torso.stl` → deck → **2× SO-101**. Master: `print/README.md`. Buy: `BOM_V3.md`.
