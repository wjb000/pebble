# Pebble assembly — cheap house-chore twin (poka-yoke)

Digital twin: `src/robot/dims.ts`. **Sim and /model share `RobotAssembly`**.  
OSS meshes only from `public/assets/{base,lift,head,so101}/`. No ForgeCAD / generated bodies.

**Product:** perceptron_bot base + **short** bought 2040 (~1010 mm) → **overall 1200 mm (~3′11″)** + Prusa lead-screw carriage + **2× SO-101** + SO-ARM cam (1:1).  
Sized for **house chores** (not fashion 5′8″): floor pick, wipe, dishes assist, laundry basket / open-washer assist.

**Not** official Pollen / Microduck. Legacy Microduck → `refs/quarantine/`.

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

## ⚠ Safety (read first)

- **Kill-switch:** hardware e-stop on power; in sim **Space = e-stop / reset**.
- **Pinch hazard:** STS3215 + lead-screw — **power off while wiring**.
- **Do not skip ballast** — narrow base + dual arms tip.
- **Tip risk:** sim slows drive when carriage high; crawl IRL with arms raised.
- Soft pads are **not** waterproof; no hot water.

---

## Height assert (chore stack)

`BASE 108 + EXTRUSION 1010 + HEAD 82 = 1200 mm`.  
**Bought (not printed):** 2040 extrusion + T8 screw. Full 5′8″ extrusion was cost overkill for this envelope.

---

## Poka-yoke: keyed L/R + wiring

| Rule | Why |
|------|-----|
| **L = +X blue** · **R = −X orange** on 4040 | Twin colour ticks — match IRL tape |
| Mirror one 4040 in slicer | Prevents silent L/R swap |
| Screw on `SCREW_AXIS_X_MM` (+22) coax Z-bottom → carriage → Z-top | Wrong side binds |
| Blue/orange heat-shrink on arm plugs | Bus swap = wrong side |
| Motor rail ≠ TTL logic — never cross | Burns hub / Pi |

---

## Torque checklist (power OFF)

1. [ ] Ballast installed low (**do not skip**)
2. [ ] Gearmotors + tires; caster free
3. [ ] 2040 (~1010 mm) bolted plumb to top plate
4. [ ] T8 ~1.1 m through z-bottom → carriage → z-top; spins free
5. [ ] NEMA17 coupled; driver unpowered until bring-up
6. [ ] 4040 L (blue) + R (orange); torque **one arm fully** before the other
7. [ ] Soft gripper pads + microfiber wipe clip
8. [ ] Cam 1:1 on column top
9. [ ] Wiring: logic first, then motor bus — L/R labels
10. [ ] Kill-switch on motor rail → bring-up (logic → arm1 → arm2 → screw → wheels)

---

## Controls

- **Sim:** W/S drive · A/D turn · Q/E lift (soft 160–950) · F pick/drop · **Space e-stop** · tip slowdown when high  
  Props: counter, sink, plate, laundry basket, cloth, washer rim
- **Model:** Orbit only · bought vs printed captions · fixed default AGL

## Cost

`/bom` min dual ≈ **$655**. Arms DIY ~$250 dominate. Cut list: shorter 2040/T8, Pi 4-class, cheap cam, min ballast, soft pads + wipe.
