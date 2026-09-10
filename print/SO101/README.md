# SO-101 follower — print **2×**

Upstream [TheRobotStudio/SO-ARM100](https://github.com/TheRobotStudio/SO-ARM100) (Apache-2.0).

HouseHand mounts **two** followers on `HouseHand_shoulder_deck` pads (−26, ±138) mm.

## Easiest path (large bed)

Print `Follower/Prusa_Follower_SO101.stl` **twice** (one plate per arm).  
Plate is **~243×205×87 mm** — needs a **≥250 mm** bed. On ≤220 mm beds, use Individual below.

## Individual (fits ≤220 mm beds) — per arm, ×2

Follower-only parts in `Individual/` (leader parts are in `print/_archive/SO101/leader/`):

| STL | Qty per arm |
|-----|----:|
| `Base_SO101.stl` | 1 |
| `Base_motor_holder_SO101.stl` | 1 |
| `Motor_holder_SO101_Base.stl` | 1 |
| `Under_arm_SO101.stl` | 1 |
| `Upper_arm_SO101.stl` | 1 |
| `Rotation_Pitch_SO101.stl` | 1 |
| `Wrist_Roll_Follower_SO101.stl` | 1 |
| `Wrist_Roll_Pitch_SO101.stl` | 1 |
| `Motor_holder_SO101_Wrist.stl` | 1 |
| `Moving_Jaw_SO101.stl` | 1 |
| `WaveShare_Mounting_Plate_SO101.stl` **or** `Seeedstudio_Mounting_Plate_SO101.stl` | 1 |

| Optional | Qty |
|----------|----:|
| `Wrist_camera_mount_SO101.stl` | 0–1 per arm |

**Do not print** (archived leader): `Trigger_SO101`, `Handle_SO101`, `Wrist_Roll_SO101`.

## Buy

**12× STS3215** + 2× Waveshare bus. Filament ~300–400 g PLA per follower.

Master: `print/README.md` · Hardware BOM: `BOM_V3.md`
