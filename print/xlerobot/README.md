# XLeRobot / HouseHand printables

Upstream XLe hardware (Apache-2.0) + HouseHand torso/shoulder.

## Print these (twin stack)

| File | Qty | What it is |
|------|----:|------------|
| `hardware/torso_shell.stl` | 1 | Hollow cylinder 120 mm OD × 4 mm wall × 320 mm. On LeKiwi top plate. |
| **`hardware/HouseHand_shoulder_deck.stl`** | **1** | **Print this shoulder.** Solid deck with dual SO-101 pads (−26, ±138) mm + neck boss. |
| `hardware/XLeRobot040_neck_refined.stl` | 1 | Hollow neck. On deck center boss. |
| `hardware/Gimbal_mesh_all_d435.stl` | 1 | Gimbal plate (D435) — or use `print/head/` cam stack. |

Regenerate deck: `python3 scripts/gen_shoulder_deck.py` (source `cad/shoulder_deck.scad`).

## Reference only — do **not** print

| File | Why skip |
|------|----------|
| `hardware/XLeRobot040_armbase.stl` | Includes RÅSKOG cart |
| `hardware/XLeRobot_035_armbase.stl` | Asymmetric upstream shelf |
| `hardware/XLeRobot_035_armbase_deck.stl` | Fragmented flatten of upstream — **replaced** |
| `hardware/XLeRobot_035_armbase_symmetric.stl` | Intermediate — **replaced** |

Drive base: `print/lekiwi/`. Arms: **2×** `print/SO101/`.
