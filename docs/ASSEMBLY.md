# Pebble assembly — cheap house-chore twin (poka-yoke)

Digital twin: `src/robot/dims.ts` + tip math `src/robot/stability.ts`.  
**Sim and /model share `RobotAssembly`**. OSS meshes only from `public/assets/{base,lift,head,so101}/`. No ForgeCAD / generated bodies.

**Product:** perceptron_bot base + bought 2040 (~1010 mm) → **overall 1200 mm (~3′11″)** + Prusa lead-screw carriage + **MGN12H REQUIRED** + **outriggers (400 mm stance)** + **4.0 kg low-bay ballast** + **2× SO-101** + SO-ARM cam (1:1).

Sized for **house chores**: floor pick, wipe, dishes assist, laundry basket / open-washer assist.

**Not** an official Pollen Robotics product.

---

## Chore list (honest)

| Does | Does NOT |
|------|----------|
| Pick clothes / clutter off floor | Fold laundry |
| Load/unload into laundry basket | Detergent dosing |
| Nudge/push basket | Closed-door washer/dryer cycles |
| Drop into **open** washer if rim reachable (~850–950 mm) | Waterproof / wet sink dunking |
| Wipe tables / counters (~750–900 mm) | Hot water / dishwasher |
| Dish assist (move plate, soft pads) | Glass-safe grip (breakage risk) |

**Reach:** shoulders **160→950 mm AGL** + SO-101 ~**500 mm**. Counters ~900, sink rim ~860, washer rim ~850–950, floor = 0.

---

## ⚠ Tip / CG (Critic P0-1) — read first

Footprint track **160 mm** + **0.5 kg** ballast is **inadequate** for dual SO-101 (~1.6–2 kg) at **950 mm AGL**.

| Qty | Value |
|-----|-------|
| Support width (outriggers) | **400 mm** |
| Wheelbase | 140 mm |
| Tip mass @ max AGL | ~2.0 kg |
| Worst reach | 0.40 m |
| Tip moment | **≈7.85 N·m** |
| Low mass + ballast | 0.9 + **4.0 kg** |
| Restoring moment | **≈9.6 N·m** |
| **Margin** | **≈1.22×** |

```
         arms@950 AGL ──●── reach 0.40 m
                        │
                   tip M ≈ 7.85 N·m
                        │
         ┌──────────────┼──────────────┐  support 400 mm
         │   ballast 4 kg (low bay)    │  restore ≈ 9.6 N·m
         └──────────────┴──────────────┘  margin ≈ 1.22×
              track/outriggers
```

- **Kill-switch:** hardware e-stop on power; in sim **Space = e-stop / reset**.
- **Pinch hazard:** STS3215 + lead-screw — **power off while wiring**.
- **Do not skip ballast, outriggers, or MGN12.**
- **Tip slowdown ≠ tip physics.** Sim HUD shows live tip margin; freeze/lean when tip > restore.
- Soft pads are **not** waterproof; no hot water.

---

## Anti-rotation (Critic P0-2)

**MGN12H REQUIRED** — silver rail parallel to T8. Extrusion slot alone will not carry dual-arm torque. BOM ~$18–25.

---

## Height assert (chore stack)

`BASE 108 + EXTRUSION 1010 + HEAD 82 = 1200 mm`.  
**Bought (not printed):** 2040 extrusion + T8 screw + **MGN12H** + outriggers + ballast.

### GPL callout
Prusa i3 Z / x-end meshes are **GPL-2.0**. Printed derivatives of those parts must remain GPL-2.0 (see `public/assets/lift/LICENSE.GPL-2.0.txt`).

---

## Poka-yoke: keyed L/R + wiring

| Rule | Why |
|------|-----|
| **L = +X blue rectangular lug** · **R = −X orange wedge lug** | Physical asymmetry — not colour alone |
| Mirror one 4040 in slicer | Prevents silent L/R swap |
| Screw on `SCREW_AXIS_X_MM` (+22) coax Z-bottom → carriage → Z-top | Wrong side binds |
| MGN12 parallel to T8, block bolted to carriage | Anti-rotation under arm load |
| Blue/orange heat-shrink on arm plugs | Bus swap = wrong side |
| Motor rail ≠ TTL logic — never cross | Burns hub / Pi |

---

## Torque checklist (power OFF)

1. [ ] **4.0 kg ballast** installed low (**do not skip**)
2. [ ] **Outriggers** installed — support width 400 mm
3. [ ] Gearmotors + tires; caster free
4. [ ] 2040 (~1010 mm) bolted plumb to top plate
5. [ ] T8 ~1.1 m through z-bottom → carriage → z-top; spins free
6. [ ] **MGN12H rail + block** parallel to T8; block bolted to carriage
7. [ ] NEMA17 coupled; driver unpowered until bring-up
8. [ ] 4040 L (blue lug) + R (orange wedge); torque **one arm fully** before the other
9. [ ] Soft gripper pads + microfiber wipe clip (visible on twin)
10. [ ] Cam 1:1 on column top
11. [ ] Hardware e-stop on motor rail
12. [ ] Wiring: logic first, then motor bus — L/R labels → bring-up

---

## Controls

- **Sim:** W/S drive · A/D turn · Q/E lift (soft 160–950) · F pick/drop · **G chore demo** (floor→basket, wipe contact, washer drop @~900, held Y tracks AGL) · **Space e-stop**  
  Tip HUD = physics margin; tip slowdown = UX only. Props: counter, sink, **dish plate**, **laundry basket**, cloth, washer rim
- **Model:** Orbit only · bought vs printed captions · MGN + outriggers + ballast visible · fixed default AGL

## Cost

`/bom` dual ≈ **$715** (prior ~$655 + safety delta: outriggers + MGN12 + sized ballast + e-stop). Arms DIY ~$250 dominate.
