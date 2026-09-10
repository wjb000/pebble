# HouseHand assembly — printable twin stack

Twin: `/model` + `/sim`. Print list: `print/README.md`. Buy list: `BOM_V3.md`.  
Generate structure: `python3 scripts/gen_structure_kit.py`.

**Product:** LeKiwi **3-omni** base + **HouseHand Ø180 torso (flange Ø190)** + shoulder deck + **2× SO-101** + neck + head cam.  
**Not** official Pollen / XLeRobot / LeKiwi. Draft — not for sale. **No RÅSKOG cart. No 4-mecanum deck.**

---

## CAD mates (locked)

1. **LeKiwi layer1** = motor deck (3× drive mount v11 + hubs + bought STS3215 + 3× 4″ omni).
2. **6× M3 hex standoffs** (`94868A713` class) space **layer1 → layer2**.
3. **HouseHand torso** Ø180 / flange Ø190 bolts to **layer2** through **8× M3** at `(±40,±80)` / `(±80,±40)` (layer2 20 mm grid). Twin uses the same STL — **no fake XY scale**. Flange ≤Ø190 so front omnis that poke above layer2 clear.
4. **Shoulder deck** registration ring slips over torso top rim; **6× M3** at r=88 (30°/90°/…). Pads at **(−26, ±138) mm** with **4× M4** through-holes each (56 mm PCD). **Ø36 cable hole** through the plate into the hollow torso.
5. **SO-101 L/R** on those pads, yawed forward with the head.
6. **Neck** on deck boss, **4× M3** at r=28; **head mount + camera** on neck (same bolt circle — drill head to match).
7. **12 V pack** centered in base bay; hardware e-stop cuts drive + arms.

---

## Bolt-up order

| # | Module | Mate | Fasteners |
|---|--------|------|-----------|
| **1** | `base_plate_layer1` + 3× `drive_motor_mount` + 3× STS3215 + 3× `servo_wheel_hub` + 3× omni | Wheels @ 120° | Motor screws |
| **2** | Battery / Pi / controller mounts | On layer1 per LeKiwi | Straps / M3 |
| **3** | **6× hex standoffs** | Layer1 top → layer2 bottom | M3 into standoffs |
| **4** | `base_plate_layer2` | On standoffs | M3 |
| **5** | HouseHand torso (full **or** `_bottom`+`_top`: pins + **6× M3** through split ring) | Flange → **layer2** center, plumb | **8× M3** flange; **6× M3×16** if split |
| **6** | Shoulder deck (full **or** `_L`+`_R` + `HouseHand_deck_splice`) | Ring → torso rim; pads forward | **6× M3** rim; **8× M3** splice |
| **7** | SO-101 L + R | Base on pad centers | **4× M4** per arm through pad |
| **8** | Neck | Collar → deck boss | **4× M3** |
| **9** | Head mount + camera | On neck flange | **4× M3** (drill head to r=28) |
| **10** | Wire + e-stop | Pack centered | XT60 / panel |

**Exploded:** layer1 + drives → power mounts → **standoffs** → layer2 → torso → deck → arms → neck → head → wire.

---

## Torque checklist (power OFF)

1. [ ] 12 V pack centered — **REQUIRED**
2. [ ] 3× omni (no casters); each servo bridges mount → hub
3. [ ] **6× standoffs** snug between plates
4. [ ] Torso plumb on layer2; **8× flange M3**; split ring **6× M3** if halved; flange clears wheel tops
5. [ ] Deck ring seated; **6× rim M3**; splice bar if L/R; Ø36 cable hole clear
6. [ ] Both SO-101 bases on pads, **4× M4** each, facing forward
7. [ ] Torque **one** arm fully before the other
8. [ ] Neck **4× M3** on boss; head **4× M3** on r=28; cam secure
9. [ ] Hardware e-stop cuts drive + arms
10. [ ] L/R bus labels → bring-up

**Kill-switch:** hardware e-stop; sim **Space** = e-stop / reset.

## Sim AI

`/sim` → Train panel: teleop → Train BC → Test AI. See `docs/TRAIN.md`.

## Controls

W/S drive · A/D strafe · ←/→ turn · Q/E arms · F pick · G demo · TAB mode · Space e-stop.
