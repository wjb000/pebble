# Pebble assembly — 8 modules (short tree, clear mates)

Twin: `RobotAssembly` → `WheeledChassis` (sim + /model). Dims: `src/robot/dims.ts`. Tip: `stability.ts`.

**Product:** wheeled base + lead-screw lift + **2× bought SO-101 kits** + cam head · chores (dishes / wipe / laundry assist).  
**Twin note:** arms render as **link envelopes** (boxes/cylinders from `SO101`/`STS3215` dims) for FPS/clarity — **BOM still costs real kits + STS3215×12**. Do not treat envelopes as a cost-down.  
**Not** official Pollen. Draft — not for sale.

---

## CAD sanity (locked)

1. **Outriggers + 4.0 kg ballast REQUIRED.** Track **160 mm ≠** tip support **400 mm**. Never optional in checklist.
2. **T8 + MGN12H both REQUIRED** (anti-rotation + lift). See `public/assets/lift/NOTICE.md`.
3. **Dual BOM stays ~$715 class** with safety lines (outriggers / MGN / ballast / e-stop) even when twin arms look simple.
4. Prefer **M3** for printed structure; SO-101 kits use **kit hardware**.

---

## 8 modules (bolt-up order)

| # | Module | Mate | Fasteners |
|---|--------|------|-----------|
| **1** | **Base** — perceptron plates + tires | Plates stack; gearmotors → hubs → tires | M3 plate stack; motor screws per kit |
| **2** | **Outriggers + ballast** (bought) **REQUIRED** | Outriggers → base rails (stance **400 mm**); **4.0 kg** low bay | M3 / M4 into rail; ballast straps |
| **3** | **2040 column** (bought ~1010 mm) | Column → top plate, plumb on center | M5 T-nuts into 2040 + M3 into plate |
| **4** | **T8 + Prusa Z bits + MGN12H** **REQUIRED** | Z-bottom → column base; T8 through; MGN rail ‖ T8 | M3 into extrusion; MGN rail screws |
| **5** | **Carriage sled** (print) + MGN block | Nut carriage on T8; **MGN block under LIFT** | M3 carriage↔block; free spin check |
| **6** | **Yoke / 4040 L+R** (print) | Crossbar + keyed mounts → carriage (**one bridge**) | M3 yoke↔carriage; L blue / R orange |
| **7** | **SO-101 L/R kits** (bought) | `base_link` seats on 4040 faces (children of LIFT) | **Kit hardware** (not M3 structure) |
| **8** | **Head cam nest** | Cam stack on column top **X=0** | M3 into extrusion / nest |

**Exploded order:** 1 base → 2 outriggers/ballast → 3 column → 4 screw/MGN → 5 carriage → 6 yoke L/R → 7 arm kits → 8 head → wire.

---

## Torque checklist (power OFF) — Critic P0

1. [ ] **4.0 kg ballast** low bay — **REQUIRED (do not skip)**
2. [ ] **Outriggers** — support width **400 mm** (track 160 alone fails tip math)
3. [ ] **MGN12H** rail + block parallel to **T8**; block bolted under carriage — **both REQUIRED**
4. [ ] T8 spins free through z-bottom → carriage → z-top
5. [ ] 2040 plumb; column top ready for head
6. [ ] Yoke crossbar + 4040 L (**blue rectangular lug**) / R (**orange wedge**)
7. [ ] Torque **one bought SO-101 kit fully** before the other; soft pads + wipe on R
8. [ ] Cam 1:1 on column top (X=0)
9. [ ] Hardware **e-stop** on motor rail
10. [ ] Wire: logic first, then motor bus — L/R labels → bring-up

**Kill-switch:** hardware e-stop; sim **Space** = e-stop / reset.  
**Pinch:** STS3215 + lead-screw — power off while wiring.  
Tip slowdown in HUD is UX only; live tip margin is physics.

---

## Tip / CG (must pass)

| | |
|--|--|
| Track (wheels) | 160 mm — **not** tip support |
| Support (outriggers) | **400 mm REQUIRED** |
| Tip @ 0.40 m / 2 kg / 950 AGL | **≈7.85 N·m** |
| Restore (low mass + 4 kg ballast) | **≈9.6 N·m** |
| Margin | **≈1.22×** |

Do **not** skip ballast, outriggers, T8, or MGN12.

---

## Chores (honest)

| Does | Does NOT |
|------|----------|
| Floor pick → basket | Fold / detergent |
| Open-washer assist (~850–950 rim) | Closed-door cycles |
| Wipe / dish assist (soft pads) | Hot water / glass-safe |

Shoulders **160→950 mm AGL** + SO-101 ~**500 mm** reach.

---

## Height + licenses

`108 + 1010 + 82 = 1200 mm`. Bought: 2040, T8, MGN12H, outriggers, ballast, **2× SO-101 kits** (STS3215×12).  
Prusa Z / x-end = **GPL-2.0** (derivatives stay GPL). Cam / 4040 / SO-101 docs = Apache-2.0.

## Controls

W/S drive · A/D turn · Q/E lift · F pick · **G** chore demo · **Space** e-stop.  
Cost dual ≈ **$715** (arms + safety lines dominate — envelopes do not change BOM).
