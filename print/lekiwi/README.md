# LeKiwi print STLs — omni base

Upstream [SIGRobotics-UIUC/LeKiwi](https://github.com/SIGRobotics-UIUC/LeKiwi) (Apache-2.0).

Print these, then buy **3× 4″ omni wheels**, **3× STS3215** drive servos, and **6× M3 hex standoffs** (`94868A713` class).  
**Do not** print the onboard LeKiwi arm — HouseHand uses **2× SO-101** on the shoulder deck.

| STL | Qty | Notes |
|-----|----:|-------|
| `base_plate_layer1.stl` | 1 | Bottom plate (URDF `base_plate_layer1-v5`) |
| `base_plate_layer2.stl` | 1 | Top plate — **HouseHand torso flanges here** |
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
- Omni tops poke above layer2 outside ~r103 mm; torso flange **Ø190** keeps ≥8 mm gap.
- Archived junk (wrong mounts, wrist cam, Jetson holder): `print/_archive/lekiwi/`.

Next: `HouseHand_torso.stl` → deck → **2× SO-101**. Master: `print/README.md`. Buy: `BOM_V3.md`.
