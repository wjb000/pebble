# XLeRobot printables

Upstream: [Vector-Wangel/XLeRobot](https://github.com/Vector-Wangel/XLeRobot) `hardware/` (Apache-2.0).

The browser twin uses:

- **Drive base:** LeKiwi omni (`print/lekiwi/`)
- **Torso:** HouseHand cylindrical shell (`hardware/torso_shell.stl`) — plate to shoulders
- **Shoulders:** XLeRobot 0.35 arm-base
- **Neck:** XLeRobot 0.4 neck
- **Arms:** 2× SO-101 from XLeRobot / SO-ARM100

The RÅSKOG / IKEA cart is not part of this kit. Do **not** print `XLeRobot040_armbase.stl` for the twin — that STEP includes the cart.

## Torso (print these)

| File | Upstream | What it is |
|------|----------|------------|
| `hardware/torso_shell.stl` | HouseHand (this repo) | Hollow cylinder 120 mm OD × 4 mm wall × 320 mm. Sits on the LeKiwi top plate. |
| `hardware/XLeRobot_035_armbase.stl` | `hardware/ongoing_upgrades/XLeRobot 035 armbase.stl` | Dual-arm T / storage shell. Sits on the torso shell. |
| `hardware/XLeRobot040_neck_refined.stl` | `hardware/step/XLeRobot_040/XLeRobot040_neck_refined.step` | Hollow neck. Sits on the arm base. |
| `hardware/Gimbal_mesh_all_d435.stl` | `hardware/camera_connector/Gimbal_mesh_all_d435.stl` | Gimbal print plate (D435). |

`XLeRobot040_armbase.stl` is kept for reference only (cart + arm-base assembly).
