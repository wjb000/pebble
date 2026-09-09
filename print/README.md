# Pebble print kit — what to send to the slicer

Print these folders in bolt-up order. Twin on `/model` stacks the same CAD.

**Stack:** LeKiwi omni base → torso shell → XLe arm-base deck → **2× SO-101** → neck → cam head.

Licenses stay with each folder (Apache-2.0 / MIT / GPL where noted). Do **not** print the IKEA RÅSKOG cart.

---

## Master checklist (qty for one robot)

| # | Module | Folder | Key STLs | Qty | Notes |
|---|--------|--------|----------|----:|-------|
| **1** | Omni base | `print/lekiwi/` | `base_plate_layer1/2`, `drive_motor_mount_v2`×3, hubs, battery, Pi case, controller mount | 1 set | Buy 3× 4″ omni + STS3215 drive |
| **2** | Torso | `print/xlerobot/hardware/` | **`torso_shell.stl`** | 1 | 120 mm OD × 320 mm; sits on LeKiwi plate |
| **3** | Shoulder deck | `print/xlerobot/hardware/` | **`XLeRobot_035_armbase_deck.stl`** | 1 | Twin mount pads at (−26, ±138) mm |
| **4** | Arms | `print/SO101/Individual/` | Full follower set | **2×** | Or 2× `Follower/Prusa_Follower_SO101.stl` plates |
| **5** | Neck | `print/xlerobot/hardware/` | `XLeRobot040_neck_refined.stl` | 1 | On arm-base deck center |
| **6** | Head / cam | `print/xlerobot/hardware/` + `print/head/` | Gimbal D435 **or** SO-ARM cam stack | 1 | Pick one cam path |
| **7** | Shoulder mounts (optional) | `print/lift/` | `4040_base_mount.stl` | 2 (mirror one) | Keyed L/R if using 4040 bars |

**Skip for this kit:** `print/base/` (legacy perceptron chassis), Prusa Z / MGN lift STLs in `print/lift/` (except 4040 mounts), `XLeRobot040_armbase.stl` (includes cart).

---

## Filament (rough)

| Block | PLA+/PETG |
|-------|-----------|
| LeKiwi base set | ~400–600 g |
| Torso + arm-base deck + neck | ~500–800 g |
| 2× SO-101 follower | ~600–800 g |
| Head / gimbal | ~100–250 g |
| **Total** | **~1.6–2.5 kg** |

Upstream settings: PLA+, ~20% infill, SO-ARM `3DPRINT.md` / LeKiwi Assembly.

---

## Buy (not printed)

See `BOM_V3.md`: STS3215×12 (arms) + drive servos, Waveshare buses, 12V pack, 3× omni wheels, e-stop, compute, cameras.

---

## Per-folder READMEs

- `lekiwi/README.md` — base plates + motor mounts  
- `xlerobot/README.md` — torso / deck / neck / gimbal  
- `SO101/README.md` — **print 2×** follower  
- `head/README.md` — SO-ARM overhead cam stack (alt head)  
- `lift/README.md` — 4040 mounts only for v3  
- `base/README.md` — legacy archive (do not print for v3)

Assembly: `docs/ASSEMBLY.md` · Sim AI: `/sim` Train panel.
