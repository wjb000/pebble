# LeKiwi print STLs — omni base

Upstream [SIGRobotics-UIUC/LeKiwi](https://github.com/SIGRobotics-UIUC/LeKiwi) (Apache-2.0).

Print these, then buy **3× 4″ omni wheels** + STS3215 drive servos (LeKiwi BOM).  
**Do not** print the onboard LeKiwi arm — HouseHand uses **2× SO-101** on the shoulder deck.

| STL | Qty | Notes |
|-----|----:|-------|
| `base_plate_layer1.stl` | 1 | Bottom plate (synced from URDF `base_plate_layer1-v5`) |
| `base_plate_layer2.stl` | 1 | Top plate — **HouseHand torso flanges here** |
| `drive_motor_mount.stl` | 3 | URDF `drive_motor_mount-v11` (not the old `_v2`) |
| `servo_wheel_hub.stl` | 3 | URDF `omni_wheel_mount-v5` — hub only; wheel is bought |
| `servo_controller_mount.stl` | 1 | |
| `battery_mount.stl` (or `_eu`) | 1 | |
| `pi_case_top.stl` + `pi_case_bottom.stl` | 1 | |
| `base_camera_mount.stl` | 0–1 | Optional (head cam is on the neck) |

## Clearance (verified against twin / URDF meshes)

- Motors + hubs sit on **layer1**; hubs clear **layer2** underside by ~4–5 mm.
- **Buy hex standoffs** (LeKiwi BOM / McMaster `94868A713` class) between layer1 and layer2 — they are not printed. Without them the torso looks like it floats above the motor deck.
- Drive chain per corner: `drive_motor_mount` → **STS3215 servo** (bought) → `servo_wheel_hub` → **4″ omni** (bought). The servo is the bridge; the hub alone will not reach the plate.
- Bought omni wheels hang below the plate and also poke **above layer2** outside ~r103 mm.
- HouseHand torso **Ø180 / flange Ø190** seats on **layer2** with ≥8 mm radial gap to those wheel tops.
- Do **not** use a flange larger than Ø190 — it will crowd the front wheels.

Archived wrong mounts (`drive_motor_mount_v2`, B/C): `print/_archive/lekiwi/`.  
`wrist_camera_mount.stl` is LeKiwi-arm specific — use `print/SO101/.../Wrist_camera_mount_SO101.stl`.

Next: `HouseHand_torso.stl` → deck → **2× SO-101**. Master: `print/README.md`.
