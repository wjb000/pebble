# SO-101 follower printable parts (upstream)

Copied from local checkout of **[TheRobotStudio/SO-ARM100](https://github.com/TheRobotStudio/SO-ARM100)**  
(`robosim/SO-ARM100` on this machine). License: **Apache-2.0** — see `LICENSE.Apache-2.0.txt`.

Upstream paths:
- Individual printables: `STL/SO101/Individual/*.stl`
- Follower plate packs: `STL/SO101/Follower/*.stl` (Prusa / Ender beds)
- Sim / URDF visuals: `Simulation/SO101/assets/*.stl` + `so101_new_calib.urdf`

## What to print (follower arm for Pebble v1)

Print the **Individual** parts (or one **Follower** plate pack):

| File | Role |
|------|------|
| `Individual/Base_SO101.stl` | Arm base |
| `Individual/Base_motor_holder_SO101.stl` | Base motor holder |
| `Individual/Motor_holder_SO101_Base.stl` | Shoulder motor holder |
| `Individual/Motor_holder_SO101_Wrist.stl` | Wrist motor holder |
| `Individual/Rotation_Pitch_SO101.stl` | Shoulder / pitch |
| `Individual/Upper_arm_SO101.stl` | Upper arm |
| `Individual/Under_arm_SO101.stl` | Forearm |
| `Individual/Wrist_Roll_Pitch_SO101.stl` | Wrist pitch |
| `Individual/Wrist_Roll_Follower_SO101.stl` | Wrist roll (follower) |
| `Individual/Moving_Jaw_SO101.stl` | Gripper jaw |
| `Individual/WaveShare_Mounting_Plate_SO101.stl` | Controller plate |
| `Individual/Seeedstudio_Mounting_Plate_SO101.stl` | Alt mount plate |
| `Individual/Handle_SO101.stl` | Optional handle |
| `Individual/Trigger_SO101.stl` | Leader trigger (not needed for follower-only) |
| `Individual/Wrist_Roll_SO101.stl` | Leader wrist roll variant |

**Follower plate packs** (`Follower/Prusa_Follower_SO101.stl` or `Ender_Follower_SO101.stl`) print the whole follower set on one bed.

See also upstream `3DPRINT.md` for Craftcloud3d / PCBWay settings (PLA+, ~20% infill).

## Browser sim

Pebble `/sim` loads `public/assets/so101/follower_idle.glb`, which is **baked from the same upstream URDF visual STLs** (`Simulation/SO101/assets/*.stl`) at an idle pose — not handmade primitives. Attribution: `public/assets/so101/NOTICE.md`.

Pebble does **not** invent Microduck as the product. Product = wheeled base (our `print/base/`) + 1× SO-101 follower + mast eye.

## Filament

Upstream follower plate is roughly **~300–400 g PLA** depending on infill; verify in your slicer.
