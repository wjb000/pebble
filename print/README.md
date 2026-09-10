# HouseHand / Pebble — print kit (one robot)

Send **only** these folders to the slicer. The twin on `/model` loads the **same** STLs.

**Stack:** LeKiwi 3-omni base → **HouseHand torso Ø180 / flange Ø190** → **shoulder deck** → **2× SO-101** → **neck** → **head + cam**

Do **not** print `print/_archive/` (legacy, leader-only, optional extras).

---

## Master checklist

| # | Module | Path | Qty | Notes |
|---|--------|------|----:|-------|
| **1** | Omni base | `print/lekiwi/` | 1 set | See folder README — plates, 3× `drive_motor_mount`, 3× `servo_wheel_hub`, battery, Pi case, controller mount |
| **2** | Torso | `print/xlerobot/hardware/HouseHand_torso.stl` | 1 | Ø180 × 320 mm, flange Ø190 → LeKiwi **layer2** |
| **3** | Shoulder deck | `print/xlerobot/hardware/HouseHand_shoulder_deck.stl` | 1 | Pads (−26, ±138) mm |
| **4** | Arms | `print/SO101/` | **2×** | Follower set twice — see `print/SO101/README.md` |
| **5** | Wrist cams (opt.) | `print/SO101/Individual/Wrist_camera_mount_SO101.stl` | 0–2 | |
| **6** | Neck | `print/xlerobot/hardware/HouseHand_neck.stl` | 1 | Deck center boss |
| **7** | Head | `print/xlerobot/hardware/HouseHand_head_mount.stl` + `HouseHand_head_camera.stl` | 1 | Matches twin |

### Must **buy** (not printed)

| Item | Qty | Why |
|------|----:|-----|
| 4″ omni wheels | **3** | Drive |
| STS3215 drive servos | **3** | Mount → hub bridge |
| Hex standoffs M3 (~`94868A713` class) | **6** | Layer1 ↔ layer2 spacing |
| STS3215 arm servos | **12** | 2× SO-101 |
| 12 V pack, e-stop, Pi/laptop, head cam | 1 | Power / safety / compute |

Full buy list: `BOM_V3.md` · Assembly: `docs/ASSEMBLY.md`

### Regenerate structure STLs

```bash
python3 scripts/gen_structure_kit.py
```

---

## Filament (rough)

| Block | PLA+/PETG |
|-------|-----------|
| LeKiwi base | 400–600 g |
| Torso + deck + neck + head | 700–1100 g |
| 2× SO-101 follower | 600–800 g |
| **Total** | **~1.8–2.5 kg** |

Archive / optional: `print/_archive/README.md` · Sim AI: `/sim`
