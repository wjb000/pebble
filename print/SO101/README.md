# SO-101 follower printable parts (upstream) — **print 2×**

Copied from local checkout of **[TheRobotStudio/SO-ARM100](https://github.com/TheRobotStudio/SO-ARM100)**  
(`robosim/SO-ARM100` on this machine). License: **Apache-2.0** — see `LICENSE.Apache-2.0.txt`.

Pebble’s default product mounts **two** LeRobot SO-101 followers on the lead-screw carriage
(via L/R `4040_Base_Mount`). **Print a full follower set twice** (or two Follower plate packs).

Upstream paths:
- Individual printables: `STL/SO101/Individual/*.stl`
- Follower plate packs: `STL/SO101/Follower/*.stl` (Prusa / Ender beds)
- Sim / URDF visuals: `Simulation/SO101/assets/*.stl` + `so101_new_calib.urdf`

## What to print (per follower arm — do this **twice**)

Print the **Individual** parts (or one **Follower** plate pack) **×2**:

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

**Follower plate packs** (`Follower/Prusa_Follower_SO101.stl` or `Ender_Follower_SO101.stl`) print the whole follower set on one bed — run **two** plates for dual-arm Pebble.

Also print **2×** `print/lift/4040_base_mount.stl` (or upstream SO-ARM `Optional/4040_Base_Mount`).

See also upstream `3DPRINT.md` for Craftcloud3d / PCBWay settings (PLA+, ~20% infill).

## Browser twin

- `/sim` and `/model` share `RobotAssembly` → dual **bought SO-101 kits** as bright link-envelope arms (L blue / R orange). `follower_idle.glb` is kept in-repo for attribution only — **not loaded** by the twin.
- BOM still quotes real SO-101 DIY kits + STS3215×12 — envelopes are visual, not a cost-down.
- Attribution: `public/assets/so101/NOTICE.md`.

Pebble is **not** Microduck. Product = wheeled perceptron base + Prusa lead-screw carriage + **2×** SO-101 + SO-ARM overhead cam. Legacy Microduck assets live under `refs/quarantine/` and are unused.

## Filament (BOM)

Upstream follower plate is roughly **~300–400 g PLA** each depending on infill.
Dual-arm BOM filament line accounts for **2× follower print sets** plus chassis/lift/cam PLA — verify in your slicer.
