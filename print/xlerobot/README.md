# HouseHand structure printables

```bash
python3 scripts/gen_structure_kit.py
python3 scripts/prep_print_stls.py   # required: bed origin + splits
```

## Print these

| File | Qty | Size | Notes |
|------|----:|------|-------|
| `hardware/HouseHand_torso.stl` | 1 | 190×190×**320** | Needs tall Z **or** use splits below |
| `hardware/HouseHand_torso_bottom.stl` | 1 | 190×190×**160** | Glue/bolt to top at mid seam |
| `hardware/HouseHand_torso_top.stl` | 1 | 184×184×**160** | |
| `hardware/HouseHand_shoulder_deck.stl` | 1 | 200×**380**×30 | Needs ≥380 mm axis **or** use L/R |
| `hardware/HouseHand_shoulder_deck_L.stl` | 1 | 200×190×30 | Bolt to R across center |
| `hardware/HouseHand_shoulder_deck_R.stl` | 1 | 200×190×30 | |
| `hardware/HouseHand_neck.stl` | 1 | 82×82×120 | 4× M3 at r=28 both ends |
| `hardware/HouseHand_head_mount.stl` | 1 | ~82×48×46 | **Prints** neck bolt circle + cam bulkhead |
| `hardware/HouseHand_head_camera.stl` | 1 | 36×36×24 | Clamp plate for 32×32 UVC (4× M2) |

`torso_shell.stl` aliases `HouseHand_torso.stl`.

**Small beds (≤220 mm):** print `_bottom`+`_top` and `_L`+`_R` instead of the full torso/deck.

## Do not print from archive

See `print/_archive/` for old XLe decks / RÅSKOG armbase / optional overhead cam.

Base: `print/lekiwi/` · Arms: **2×** `print/SO101/` · Master: `print/README.md`
