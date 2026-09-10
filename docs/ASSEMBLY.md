# Pebble assembly — printable twin stack

Twin: `RobotAssembly` → `WheeledChassis` (`/model` + `/sim`).  
Print list: `print/README.md`. BOM: `BOM_V3.md`.

**Product:** LeKiwi 3-wheel omni base + printable torso + XLe shoulder deck + **2× SO-101** + cam head.  
**Not** official Pollen / XLeRobot / LeKiwi. Draft — not for sale. **No RÅSKOG cart.**

---

## CAD mates (locked)

1. **LeKiwi plates** are the support polygon (3× omni). No casters.
2. **Torso shell** sits centered on the LeKiwi plate (widened in twin to ~216 mm plate).
3. **HouseHand shoulder deck** (`HouseHand_shoulder_deck.stl`) on torso top — solid printable plate with dual pads.
4. **SO-101 L/R** seat on circular pads at **(−26, ±138) mm** in the deck print frame, yawed forward with the head.
5. **Neck** on deck center boss; cam / gimbal on neck.
6. **12V pack** centered in the base bay; hardware e-stop cuts drive + arms.

---

## Bolt-up order

| # | Module | Mate | Fasteners |
|---|--------|------|-----------|
| **1** | LeKiwi plates + 3× drive mounts + hubs | Wheels at 120° | Motor screws |
| **2** | Battery / Pi / controller mounts | Per LeKiwi Assembly | Straps / M3 |
| **3** | Torso shell | Shell → plate center, plumb | M3 / clamps |
| **4** | **Shoulder deck** (print) | Deck → torso top; pads face forward | M3 into torso rim |
| **5** | SO-101 L + R kits | `Base_SO101` on pad centers (−26, ±138) | Kit hardware |
| **6** | Neck | Neck → deck center boss | M3 |
| **7** | Cam / gimbal | On neck | M3 |
| **8** | Wire + e-stop | Pack centered; e-stop reachable | XT60 / panel nut |

**Exploded:** 1 base → 2 power/compute → 3 torso → **4 shoulder deck** → 5 arms → 6 neck → 7 cam → wire.

---

## Torque checklist (power OFF)

1. [ ] 12V pack centered — **REQUIRED**
2. [ ] 3× omni (no casters)
3. [ ] Torso plumb on plate
4. [ ] Deck pads clear; both `Base_SO101` seated
5. [ ] Arms face forward with head (not aft)
6. [ ] Torque **one** arm fully before the other
7. [ ] Neck flush on deck; cam secure
8. [ ] Hardware e-stop cuts drive + arms
9. [ ] L/R bus labels → bring-up

**Kill-switch:** hardware e-stop; sim **Space** = e-stop / reset.

---

## Sim AI

`/sim` → **Train** panel: teleop to record → **Train BC** → **Test AI**.  
API: `window.__PEBBLE_TRAIN__`. Details: `docs/TRAIN.md`.

## Controls

W/S drive · A/D strafe · ←/→ turn · Q/E arms · F pick · G demo · **TAB** auto/teleop · **Space** e-stop · Train panel for BC.
