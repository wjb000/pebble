# HouseHand assembly — printable twin stack

Twin: `/model` + `/sim`. Print list: `print/README.md`. Buy list: `BOM_V3.md`.  
Generate structure: `python3 scripts/gen_structure_kit.py`.

**Product:** LeKiwi **3-omni** base + **HouseHand Ø180 torso (flange Ø190)** + shoulder deck + **2× SO-101** + neck + head cam.  
**Not** official Pollen / XLeRobot / LeKiwi. Draft — not for sale. **No RÅSKOG cart. No 4-mecanum deck.**

---

## CAD mates (locked)

1. **LeKiwi layer1** = motor deck (3× drive mount v11 + hubs + bought STS3215 + 3× 4″ omni).
2. **6× M3 hex standoffs** (`94868A713` class) space **layer1 → layer2**.
3. **HouseHand torso** Ø180 / flange Ø190 bolts to **layer2**. Twin uses the same STL — **no fake XY scale**. Flange ≤Ø190 so front omnis that poke above layer2 clear.
4. **Shoulder deck** registration ring slips over torso top rim. Pads at **(−26, ±138) mm**.
5. **SO-101 L/R** on those pads, yawed forward with the head.
6. **Neck** on deck center boss; **head mount + camera** on neck.
7. **12 V pack** centered in base bay; hardware e-stop cuts drive + arms.

---

## Bolt-up order

| # | Module | Mate | Fasteners |
|---|--------|------|-----------|
| **1** | `base_plate_layer1` + 3× `drive_motor_mount` + 3× STS3215 + 3× `servo_wheel_hub` + 3× omni | Wheels @ 120° | Motor screws |
| **2** | Battery / Pi / controller mounts | On layer1 per LeKiwi | Straps / M3 |
| **3** | **6× hex standoffs** | Layer1 top → layer2 bottom | M3 into standoffs |
| **4** | `base_plate_layer2` | On standoffs | M3 |
| **5** | HouseHand torso | Flange → **layer2** center, plumb | M3 through flange guides |
| **6** | Shoulder deck | Ring → torso rim; pads forward | M3 into rim |
| **7** | SO-101 L + R | Base on pad centers | Kit hardware |
| **8** | Neck | Collar → deck boss | M3 |
| **9** | Head mount + camera | On neck flange | M3 |
| **10** | Wire + e-stop | Pack centered | XT60 / panel |

**Exploded:** layer1 + drives → power mounts → **standoffs** → layer2 → torso → deck → arms → neck → head → wire.

---

## Torque checklist (power OFF)

1. [ ] 12 V pack centered — **REQUIRED**
2. [ ] 3× omni (no casters); each servo bridges mount → hub
3. [ ] **6× standoffs** snug between plates
4. [ ] Torso plumb on layer2; flange bolts snug; flange clears wheel tops
5. [ ] Deck ring seated; both pads clear
6. [ ] Both SO-101 bases on pads, facing forward
7. [ ] Torque **one** arm fully before the other
8. [ ] Neck on boss; head + cam secure
9. [ ] Hardware e-stop cuts drive + arms
10. [ ] L/R bus labels → bring-up

**Kill-switch:** hardware e-stop; sim **Space** = e-stop / reset.

## Sim AI

`/sim` → Train panel: teleop → Train BC → Test AI. See `docs/TRAIN.md`.

## Controls

W/S drive · A/D strafe · ←/→ turn · Q/E arms · F pick · G demo · TAB mode · Space e-stop.
