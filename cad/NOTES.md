# CAD notes

HouseHand printable structure is generated from one geometry contract:

| Constant | Value | Role |
|----------|------:|------|
| `TORSO_OD` | 216 mm | Matches LeKiwi plate / twin (no fake scale) |
| Pad centers | (−26, ±138) mm | SO-101 L/R |
| Neck boss | Ø72 / Ø36 hole | `HouseHand_neck` seats here |

## Generate

```bash
python3 scripts/gen_structure_kit.py
```

Writes identical STLs to:
- `public/assets/xlerobot/hardware/HouseHand_{torso,shoulder_deck,neck}.stl`
- `print/xlerobot/hardware/` (same files)
- aliases `torso_shell.stl` → torso

OpenSCAD sources: `cad/torso_shell.scad`, `cad/shoulder_deck.scad`.

## Twin loads

`src/components/ImportedRobots.tsx` — LeKiwi URDF + HouseHand torso/deck/neck/head + 2× SO-101 URDF.  
No `TORSO_XY_WIDEN`, no shelf-trim / Z-gap hacks.

## Not part of the kit

RÅSKOG cart, XLe 035 fragmented decks, perceptron base, Prusa Z — see `print/_archive/`.
