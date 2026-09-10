# HouseHand / Pebble — print kit (one robot)

Send these folders to the slicer. The twin on `/model` loads the **same** STLs.

**Stack:** LeKiwi omni base → **HouseHand torso Ø180 / flange Ø190** → **shoulder deck** → **2× SO-101** → **neck** → **head + cam**

Do **not** print anything under `print/_archive/` (legacy / wrong product).

---

## Master checklist

| # | Module | Path | Qty | Notes |
|---|--------|------|----:|-------|
| **1** | Omni base | `print/lekiwi/` | 1 set | plates, 3× `drive_motor_mount` (v11), hubs, battery, Pi case, controller mount |
| **2** | Torso | `print/xlerobot/hardware/HouseHand_torso.stl` | 1 | **Ø180 × 320 mm**, flange Ø190 → LeKiwi **layer2** |
| **3** | Shoulder deck | `print/xlerobot/hardware/HouseHand_shoulder_deck.stl` | 1 | Pads at (−26, ±138) mm for SO-101; neck boss center |
| **4** | Arms | `print/SO101/Individual/` **or** 2× `Follower/Prusa_Follower_SO101.stl` | **2×** | Full follower set twice |
| **5** | Wrist cams (opt.) | `print/SO101/Individual/Wrist_camera_mount_SO101.stl` | 2 | If using wrist UVC |
| **6** | Neck | `print/xlerobot/hardware/HouseHand_neck.stl` | 1 | Seats on deck boss |
| **7** | Head | `HouseHand_head_mount.stl` + `HouseHand_head_camera.stl` | 1 | Primary cam path (matches twin) |

**Buy (wheels):** 3× 4″ omni — not printed. Hubs are `servo_wheel_hub.stl`. See `print/lekiwi/README.md` for clearance notes.

**Optional alternate head:** `print/head/cam_mount_{bottom,middle,top}.stl` (SO-ARM overhead stack) — only if you skip HouseHand head.

**Optional:** `print/lift/4040_base_mount.stl` ×2 — only if adding 4040 bars (not in twin).

### Regenerate structure STLs

```bash
python3 scripts/gen_structure_kit.py
```

Source: `cad/torso_shell.scad`, `cad/shoulder_deck.scad` (params locked to Ø180 / flange Ø190 / pads −26±138).

---

## Filament (rough)

| Block | PLA+/PETG |
|-------|-----------|
| LeKiwi base | 400–600 g |
| Torso + deck + neck + head | 700–1100 g |
| 2× SO-101 follower | 600–800 g |
| **Total** | **~1.8–2.5 kg** |

## Buy (not printed)

STS3215 ×3 drive + ×12 arms, Waveshare buses ×2–3, 12 V pack, 3× 4″ omni, e-stop, Pi/compute, head cam (± wrist cams). See `BOM_V3.md`.

Assembly: `docs/ASSEMBLY.md` · Sim AI: `/sim` Train panel · Archive: `print/_archive/README.md`
