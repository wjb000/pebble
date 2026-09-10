# CAD notes

HouseHand printable structure is generated from one geometry contract:

| Constant | Value | Role |
|----------|------:|------|
| `TORSO_OD` / wall | 180 / **6 mm** | Clears 4″ omni tops; thicker wall for dual-arm load |
| `TORSO_FLANGE_OD` | 190 mm | Bolts to layer2; ≥8 mm to wheel mesh |
| Flange bolts | `(±40,±80)`, `(±80,±40)` | **8× Ø3.4** on layer2 20 mm grid |
| Split ring | Z=155–165, r=88, 6× M3 | Bed-size halves clamp (plus 4 pins) |
| Deck → torso | r=88, 30°/90°/… | **6× M3** through plate into top rim |
| Pad centers | (−26, ±138) mm | SO-101 L/R; **4× Ø5** on SO-ARM100 4040 48×46.5 mm rectangle |
| Cable | Ø36 through deck | Into hollow torso |
| Neck boss / bolts | Ø72 / Ø36; r=28 4× M3 | Collar and **generated head** share this circle |
| Head | flange Ø82, 4× M3 r=28 | Forward bulkhead + 32×32 UVC (4× M2, 28 mm) |
| Deck splice | 180×24×5, 8× M3 | L/R seam bar |

## Generate

```bash
python3 scripts/gen_structure_kit.py
python3 scripts/prep_print_stls.py   # foot origins, bed splits, registration pins
python3 scripts/verify_structure_kit.py
```

Writes identical STLs to:
- `public/assets/xlerobot/hardware/HouseHand_{torso,shoulder_deck,neck,head_mount,head_camera}.stl`
- `print/xlerobot/hardware/` (same files)
- aliases `torso_shell.stl` → torso (**do not print twice**)

OpenSCAD sources: `cad/torso_shell.scad`, `cad/shoulder_deck.scad` (reference; Python generator is authoritative).

## Twin loads

`src/components/ImportedRobots.tsx` — LeKiwi URDF + HouseHand torso/deck/neck/head + 2× SO-101 URDF.  
No `TORSO_XY_WIDEN`, no shelf-trim / Z-gap hacks. Torso sits on **layer2** top.

## Wheel / base fit

- Print kit motor mounts = URDF `drive_motor_mount-v11` (×3).
- Print kit hubs = URDF `omni_wheel_mount-v5` (×3); wheels + drive servos are bought.
- Hex standoffs between layer1 and layer2 are bought (LeKiwi BOM) — required, not printed.
- Flange OD must stay ≤190 mm or front omnis crowd the flange above layer2.

## Not part of the kit

RÅSKOG cart, XLe fragments, perceptron base, Prusa Z — see `print/_archive/`.
