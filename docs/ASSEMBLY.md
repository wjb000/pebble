# Pebble assembly — HouseHand v3 (8 modules)

Twin: `RobotAssembly` → `WheeledChassis` (sim + /model). Dims: `src/robot/dims.ts`. Tip: `stability.ts`. BOM: `BOM_V3.md`.

**Product:** 400×450 mm omni deck + nested telescoping torso + **2× bought SO-101 kits** + cam head · chores (dishes / wipe / laundry assist).  
**Twin note:** arms render as **link envelopes** — **BOM still costs real kits + STS3215×12**.  
**Not** official Pollen. Draft — not for sale.

---

## CAD sanity (locked)

1. **Omni deck is the support polygon.** 400×450 mm — no outriggers, no casters.
2. **Nested tubes + internal T8.** Column grows/shrinks. Do **not** use an exposed-rail-only lift.
3. **12V pack centered in the bay** (~4 kg) is the low mass. Hardware e-stop cuts drive + arms + lift.
4. Prefer **M3** for printed structure; SO-101 kits use **kit hardware**.

---

## 8 modules (bolt-up order)

| # | Module | Mate | Fasteners |
|---|--------|------|-----------|
| **1** | **Omni deck** — 400×450 + 4× mecanum + bumper | Motors → hubs → wheels at corners | Motor screws; bumper foam |
| **2** | **Power bay** — 12V pack + BMS + e-stop + tote | Pack centered under deck; tote rear; e-stop front | Straps / XT60; panel nut |
| **3** | **Column base plate** | Plate → deck center, plumb | M5 into deck |
| **4** | **Nested tubes + internal T8 + lift motor** | Outer tube → base plate; screw inside | Tube clamps; motor at base |
| **5** | **Inner stage** | Telescopes; limit switches min/max | Free slide check |
| **6** | **Shoulder bar / 4040 L+R** (print) | Crossbar → inner tube top; keyed mounts | M3; L blue / R orange |
| **7** | **SO-101 L/R kits** (bought) | `base_link` seats on 4040 faces | **Kit hardware** |
| **8** | **Head cam nest** | Cam stack on inner-tube top | M3 into nest |

**Exploded order:** 1 deck → 2 power/tote → 3 base plate → 4 nested column → 5 inner stage → 6 shoulder L/R → 7 arm kits → 8 head → wire.

---

## Torque checklist (power OFF)

1. [ ] **12V pack** centered in bay — **REQUIRED**
2. [ ] **4× mecanum** (or 3-kiwi) — **no casters**
3. [ ] Nested tubes slide free; **internal T8** (not exposed MGN)
4. [ ] Limit switches at min/max height
5. [ ] Shoulder bar plumb on inner tube
6. [ ] 4040 L (**blue rectangular lug**) / R (**orange wedge**)
7. [ ] Torque **one bought SO-101 kit fully** before the other; soft pads + wipe on R
8. [ ] Cam on inner-tube top
9. [ ] Hardware **e-stop** cuts drive + arms + lift
10. [ ] Wire: logic first, then motor bus — L/R labels → bring-up

**Kill-switch:** hardware e-stop; sim **Space** = e-stop / reset.  
**Pinch:** STS3215 + internal lead-screw — power off while wiring.  
Tip slowdown in HUD is UX only; live tip margin is physics.

---

## Tip / CG (must pass)

| | |
|--|--|
| Support (deck) | **400 mm** |
| Wheelbase | **394 mm** |
| Tip @ 0.40 m / 2 kg / max AGL | **≈7.85 N·m** |
| Restore (structure + 4 kg pack) | **≈19.6 N·m** |
| Margin | **≈2.5×** |

Do **not** skip the centered pack, nested column, or e-stop.

---

## Chores (honest)

| Does | Does NOT |
|------|----------|
| Floor pick → basket | Fold / detergent |
| Open-washer assist (~850–950 rim) | Closed-door cycles |
| Wipe / dish assist (soft pads) | Hot water / glass-safe |

Shoulders **462→1022 mm AGL** + SO-101 ~**500 mm** reach.

---

## Height + licenses

`82 + 380 + 560 + 78 = 1100 mm` extended; collapsed ~**540 mm**.  
Bought: deck, mecanum, nested column, T8, 12V pack, **2× SO-101 kits** (STS3215×12), tote, e-stop.  
Cam / 4040 / SO-101 docs = Apache-2.0.

## Controls

W/S forward · **A/D strafe** · ←/→ or Z/X yaw · Q/E lift · F pick · **G** chore demo · **Space** e-stop.  
Cost dual DIY **~$450–730** (itemized mid on /bom).
