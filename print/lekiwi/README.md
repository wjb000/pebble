# LeKiwi print STLs — omni base

Upstream [SIGRobotics-UIUC/LeKiwi](https://github.com/SIGRobotics-UIUC/LeKiwi) (Apache-2.0).

Print these, then buy 3× omni wheels + STS3215 drive servos (LeKiwi BOM).  
**Do not** print the onboard LeKiwi arm — HouseHand uses **2× SO-101** on the shoulder deck.

| STL | Qty |
|-----|----:|
| `base_plate_layer1.stl` | 1 |
| `base_plate_layer2.stl` | 1 |
| `drive_motor_mount_v2.stl` | 3 |
| `servo_wheel_hub.stl` | 3 |
| `servo_controller_mount.stl` | 1 |
| `battery_mount.stl` (or `_eu`) | 1 |
| `pi_case_top.stl` + `pi_case_bottom.stl` | 1 |
| `base_camera_mount.stl` | 0–1 | Optional (head cam is on the neck) |

`drive_motor_mount.stl` (v1) is superseded by `_v2`.  
`wrist_camera_mount.stl` is LeKiwi-arm specific — use `print/SO101/.../Wrist_camera_mount_SO101.stl` instead.  
Onboard arm adapter is in `print/_archive/lekiwi/`.

Next: `HouseHand_torso.stl` → deck → **2× SO-101**. Master: `print/README.md`.
