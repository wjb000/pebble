# HouseHand / Pebble — print kit (one robot)

Send **only** these folders to the slicer. The twin on `/model` loads the **same** STLs.

**Stack:** LeKiwi 3-omni base → **HouseHand torso Ø180 / flange Ø190** → **shoulder deck** → **2× SO-101** → **neck** → **head + cam**

Do **not** print `print/_archive/` (legacy, leader-only, optional extras).

---

## Bed size (read this first)

| Part | Full size | Fits typical bed? | Split STLs (≤220 mm) |
|------|-----------|-------------------|----------------------|
| Torso | **190×190×320** | Needs **Z ≥ 320** | `HouseHand_torso_bottom.stl` + `_top.stl` (split bolt-ring + **4 registration pins**) — **6× M3×16** at seam |
| Shoulder deck | **200×380×30** | Needs **one axis ≥ 380** | `_L` + `_R` + `HouseHand_deck_splice.stl` (**8× M3**) — pins on cut |
| SO-101 Prusa plate | **~243×205×87** | Needs **≥250 mm** bed | Else print `SO101/Individual/` ×2 |
| Everything else | ≤200 mm | Fine on 220³ | — |

All kit STLs under `print/` are **footed to bed origin** (min-Z = 0). Hardware XY is centered; LeKiwi / SO-101 keep assembly XY. Regenerate with `python3 scripts/prep_print_stls.py`.

### Torso → layer2 bolts (critical)

Flange has **8× Ø3.4 through-holes** on the LeKiwi layer2 **20 mm grid**:
`(±40, ±80)` and `(±80, ±40)` mm. Use M3 through flange into those plate holes — not freehand drilling.

### Fastener map (printed structure)

| Joint | Hardware | Pattern |
|-------|----------|---------|
| Torso flange → layer2 | **8× M3** | `(±40,±80)`, `(±80,±40)` |
| Torso split (if using halves) | **6× M3×16** + pins | r=88 mm, 0°/60°/… |
| Deck → torso rim | **6× M3** | r=88 mm, 30°/90°/… |
| Deck L/R splice | **8× M3** + `HouseHand_deck_splice.stl` | y=±8, x=±20/±60 |
| SO-101 pads | **4× M4 per arm** | 56 mm PCD @ 45° through pad+plate |
| Neck → deck boss | **4× M3** | r=28 mm @ 45° |
| Head → neck flange | **4× M3** | same r=28 (drill head to match) |
| Cable | — | Ø36 through deck + hollow torso |

---

## Master checklist

| # | Module | Path | Qty | Notes |
|---|--------|------|----:|-------|
| **1** | Omni base | `print/lekiwi/` | 1 set | Plates, 3× `drive_motor_mount`, 3× `servo_wheel_hub`, battery, Pi case, controller mount |
| **2** | Torso | `HouseHand_torso.stl` **or** `_bottom`+`_top` | 1 | Ø180 / **6 mm wall** / flange Ø190 → layer2. Skip `torso_shell.stl`. |
| **3** | Shoulder deck | `HouseHand_shoulder_deck.stl` **or** `_L`+`_R` + `_deck_splice` | 1 | Pads (−26, ±138); Ø36 cable hole |
| **4** | Arms | `print/SO101/` | **2×** | Follower set twice — see folder README |
| **5** | Wrist cams (opt.) | `SO101/Individual/Wrist_camera_mount_SO101.stl` | 0–2 | |
| **6** | Neck | `HouseHand_neck.stl` | 1 | Deck center boss |
| **7** | Head | `HouseHand_head_mount.stl` + `HouseHand_head_camera.stl` | 1 | Print-origin clean; matches twin |

Structure files live under `print/xlerobot/hardware/`.

### Must **buy** (not printed)

| Item | Qty | Why |
|------|----:|-----|
| 4″ omni wheels | **3** | Drive |
| STS3215 drive servos | **3** | Mount → hub bridge |
| Hex standoffs M3 (`94868A713` class) | **6** | Layer1 ↔ layer2 |
| STS3215 arm servos | **12** | 2× SO-101 |
| 12 V pack, e-stop, Pi/laptop, head cam | 1 | Power / safety / compute |

Full buy list: `BOM_V3.md` · Assembly: `docs/ASSEMBLY.md`

### Regenerate structure STLs

```bash
python3 scripts/gen_structure_kit.py
python3 scripts/prep_print_stls.py   # foot origins + bed splits + registration pins
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
