# HouseHand assembly — printable twin stack

Twin: `RobotAssembly` → wheeled chassis (`/model` + `/sim`).  
Print list: `print/README.md`. Generate structure: `python3 scripts/gen_structure_kit.py`.

**Product:** LeKiwi 3-omni base + **HouseHand Ø216 torso** + shoulder deck + **2× SO-101** + neck + head cam.  
**Not** official Pollen / XLeRobot / LeKiwi. Draft — not for sale. **No RÅSKOG cart.**

---

## CAD mates (locked)

1. **LeKiwi plates** = support polygon (3× omni).
2. **HouseHand torso** Ø216 sits on LeKiwi plate (printed flange). Twin uses the same STL — **no fake XY scale**.
3. **Shoulder deck** registration ring slips over torso top rim.
4. **SO-101 L/R** on pads at **(−26, ±138) mm**, yawed forward with the head.
5. **HouseHand neck** on deck center boss; **head mount + camera** on neck.
6. **12 V pack** centered in base bay; hardware e-stop cuts drive + arms.

---

## Bolt-up order

| # | Module | Mate | Fasteners |
|---|--------|------|-----------|
| **1** | LeKiwi plates + 3× drive mounts + hubs | Wheels @ 120° | Motor screws |
| **2** | Battery / Pi / controller mounts | Per LeKiwi | Straps / M3 |
| **3** | HouseHand torso | Flange → plate center, plumb | M3 through flange guides |
| **4** | Shoulder deck | Ring → torso rim; pads forward | M3 into rim |
| **5** | SO-101 L + R | `Base_SO101` on pad centers | Kit hardware |
| **6** | Neck | Collar → deck boss | M3 |
| **7** | Head mount + camera | On neck flange | M3 |
| **8** | Wire + e-stop | Pack centered | XT60 / panel |

**Exploded:** base → power → torso → deck → arms → neck → head → wire.

---

## Torque checklist (power OFF)

1. [ ] 12 V pack centered — **REQUIRED**
2. [ ] 3× omni (no casters)
3. [ ] Torso plumb; flange bolts snug
4. [ ] Deck ring seated; both pads clear
5. [ ] Both SO-101 bases on pads, facing forward
6. [ ] Torque **one** arm fully before the other
7. [ ] Neck on boss; head + cam secure
8. [ ] Hardware e-stop cuts drive + arms
9. [ ] L/R bus labels → bring-up

**Kill-switch:** hardware e-stop; sim **Space** = e-stop / reset.

## Sim AI

`/sim` → Train panel: teleop → Train BC → Test AI. See `docs/TRAIN.md`.

## Controls

W/S drive · A/D strafe · ←/→ turn · Q/E arms · F pick · G demo · TAB mode · Space e-stop.
