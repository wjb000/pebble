# Print kit — HouseHand (Pebble)

Everything below is what you send to the slicer for **one** robot. Twin on `/model` uses the same files.

**Stack:** LeKiwi omni base → torso shell → **HouseHand shoulder deck** → **2× SO-101** → neck → cam.

Licenses stay with each folder. Do **not** print the IKEA RÅSKOG cart (`XLeRobot040_armbase.stl`).

---

## Master checklist (qty = 1 robot)

| # | Module | Folder | Key file(s) | Qty | Notes |
|---|--------|--------|-------------|----:|-------|
| **1** | Omni base | `print/lekiwi/` | plates, 3× motor mounts, hubs, battery, Pi case | 1 set | Buy 3× 4″ omni + STS3215 drive |
| **2** | Torso | `print/xlerobot/hardware/` | `torso_shell.stl` | 1 | 120 mm OD × 320 mm; on LeKiwi plate |
| **3** | **Shoulder deck** | `print/xlerobot/hardware/` | **`HouseHand_shoulder_deck.stl`** | **1** | Solid printable deck — dual pads at (−26, ±138) mm + neck boss |
| **4** | Arms | `print/SO101/Individual/` | Full follower set | **2×** | Or 2× `Follower/Prusa_Follower_SO101.stl` |
| **5** | Neck | `print/xlerobot/hardware/` | `XLeRobot040_neck_refined.stl` | 1 | On deck center boss |
| **6** | Head / cam | `print/xlerobot/hardware/` + `print/head/` | Gimbal D435 **or** SO-ARM cam stack | 1 | Pick one cam path |
| **7** | Optional 4040 mounts | `print/lift/` | `4040_base_mount.stl` | 2 (mirror one) | Only if using 4040 bars |

### Do **not** print for this kit

| File | Why |
|------|-----|
| `XLeRobot_035_armbase.stl` / `_deck` / `_symmetric` | Fragmented upstream reference — **replaced by `HouseHand_shoulder_deck.stl`** |
| `XLeRobot040_armbase.stl` | Includes RÅSKOG cart |
| `print/base/` | Legacy perceptron chassis |
| Prusa Z / MGN lift STLs (except optional 4040 mounts) | v3 uses nested column or torso shell |

---

## Shoulder deck (print this)

- **File:** `print/xlerobot/hardware/HouseHand_shoulder_deck.stl`
- **Source:** `cad/shoulder_deck.scad` · regenerate with `python3 scripts/gen_shoulder_deck.py`
- **Bed:** flat underside down (registration ring faces bed)
- **Material:** PETG or PLA+, ≥4 walls, ≥20% gyroid, no supports needed
- **Size:** ~200 × 380 × 30 mm (includes underside ring + neck boss)
- **Pads:** Ø96 mm raised pads at (−26, ±138) mm for SO-101 bases
- **Neck boss:** Ø72 mm with Ø36 mm cable hole

---

## Filament (rough)

| Block | PLA+/PETG |
|-------|-----------|
| LeKiwi base set | ~400–600 g |
| Torso + **HouseHand deck** + neck | ~550–850 g |
| 2× SO-101 follower | ~600–800 g |
| Head / gimbal | ~100–250 g |
| **Total** | **~1.7–2.5 kg** |

---

## Buy (not printed)

See `BOM_V3.md`: STS3215 ×12 (arms) + drive servos, Waveshare buses, 12 V pack, 3× omni, e-stop, compute, cameras.

Assembly: `docs/ASSEMBLY.md` · Sim AI: `/sim` Train panel.
