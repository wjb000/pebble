# LeKiwi print STLs — omni base

Upstream [SIGRobotics-UIUC/LeKiwi](https://github.com/SIGRobotics-UIUC/LeKiwi) `3DPrintMeshes/` (Apache-2.0).

Print these, then buy **3×** omni wheels + STS3215 drive servos (LeKiwi BOM).  
Skip printing the onboard LeKiwi arm — Pebble uses **2× SO-101** on the XLe deck instead.

| STL | Qty |
|-----|----:|
| `base_plate_layer1.stl` | 1 |
| `base_plate_layer2.stl` | 1 |
| `drive_motor_mount_v2.stl` | 3 |
| `servo_wheel_hub.stl` | 3 (supports) |
| `servo_controller_mount.stl` | 1 |
| `battery_mount.stl` | 1 |
| `pi_case_top.stl` + `pi_case_bottom.stl` | 1 |
| `base_camera_mount.stl` | 1 (optional) |

Next: `print/xlerobot/hardware/torso_shell.stl` → arm-base deck → **2×** `print/SO101/`.  
Master list: `print/README.md`. Assembly: https://github.com/SIGRobotics-UIUC/LeKiwi/blob/main/Assembly.md
