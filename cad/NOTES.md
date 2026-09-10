# CAD notes

HouseHand printable structure is generated from one geometry contract:

| Constant | Value | Role |
|----------|------:|------|
| `TORSO_OD` | 180 mm | Clears 4″ omni tops above LeKiwi layer2 |
| `TORSO_FLANGE_OD` | 190 mm | Bolts to layer2; ≥8 mm to wheel mesh; plate max r≈108 |
| Flange bolts | `(±40,±80)`, `(±80,±40)` | **8× Ø3.4 through-holes** on LeKiwi layer2 20 mm grid |
| Pad centers | (−26, ±138) mm | SO-101 L/R |
| Neck boss | Ø72 / Ø36 hole | `HouseHand_neck` seats here |
| Torso split | Z = 160 mm | Bed-size halves + 4 registration pins (via `prep_print_stls.py`) |

## Generate

```bash
python3 scripts/gen_structure_kit.py
python3 scripts/prep_print_stls.py   # foot origins, bed splits, registration pins
```

Writes identical STLs to:
- `public/assets/xlerobot/hardware/HouseHand_{torso,shoulder_deck,neck}.stl`
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
