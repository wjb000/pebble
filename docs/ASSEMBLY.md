# Pebble assembly — poka-yoke (hard to mess up)

Digital twin: `src/robot/dims.ts`. **Sim and /model share `RobotAssembly`**.  
OSS meshes only from `public/assets/{base,lift,head,so101}/`. No ForgeCAD / generated bodies.

**Product:** perceptron_bot base + bought 2040 extrusion → **1730 mm (~5′8″)** + Prusa lead-screw carriage + **2× SO-101** + SO-ARM cam (1:1).  
**Not** official Pollen / Microduck. Legacy Microduck → `refs/quarantine/`.

---

## ⚠ Safety (read first)

- **Kill-switch:** hardware e-stop on power; in sim **Space = e-stop / reset**.
- **Pinch hazard:** STS3215 joints and lead-screw carriage — keep fingers clear; **power off while wiring**.
- **Do not skip ballast** — narrow base + tall dual-arm stack tips. LiPo (~$40) + scrap steel (~$10) low in bay.
- **Tip risk:** sim applies drive slowdown when carriage is high; IRL drive slow with arms raised.

---

## Height assert

`BASE 108 + EXTRUSION 1540 + HEAD stack 82 = 1730 mm`.  
**Bought (not printed):** 2040 extrusion + T8 screw. Model tab captions mark these as bought envelopes.

---

## Poka-yoke: keyed L/R + screw orientation

| Rule | Why |
|------|-----|
| **L arm = +X (blue tick)** · **R arm = −X (orange tick)** | Twin shows colour ticks on 4040 mounts — match IRL tape/paint |
| **4040 mounts are mirrored** — print one, mirror second in slicer (or print L + R keyed) | Prevents silent L/R swap |
| **Lead screw on `SCREW_AXIS_X_MM` (+22 mm)** coax with Prusa Z bottom → carriage → Z top | Wrong side = carriage binds |
| **Motor plug: mark LEFT / RIGHT** with blue/orange heat-shrink | Arm bus swap = wrong side motion |
| **Motor bus vs logic:** red/black = motor rail; green/white (or JST TTL) = logic — never cross | Burns hub / Pi |

Mark with permanent marker on printed parts if upstream STL has no emboss: `L`, `R`, `TOP`, `MATE→COLUMN`.

---

## Print orientation + mate faces (OSS)

We do not author new bodies — document mates so upstream STLs go on correctly.

### Base (`print/base/` — perceptron_bot MIT)

| Part | Print orientation | Mate face |
|------|-------------------|-----------|
| `lower_plate` | Flat on bed (largest face down) | Top face mates middle spacers/walls |
| `middle_plate_raspberry` | Flat; Pi nest **up** | Nest faces up toward top plate |
| `top_plate` | Flat; support as upstream | **Top** faces extrusion foot |
| Walls L/U | As exported; check NOTICE | Between plates; front Z+ / back Z− in CAD |
| Caster trio | Orient per upstream README | Rear of chassis; wheels down |

### Lift (`print/lift/`)

| Part | Print orientation | Mate face |
|------|-------------------|-----------|
| `z-axis-bottom` | Motor face accessible | Bolts to column **base**; screw axis through bore |
| `z-axis-top` | Bearing bore vertical | Column **top**; same screw axis |
| `carriage_x-end-motor` | Nut bore along screw | Rides T8; **4040 faces outward** L/R |
| `4040_base_mount` ×2 | Flat; **mirror one** for R | Keyed: blue tape = L (+X), orange = R (−X) |
| `z-screw-cover` | Flat | Caps screw top |

### Head (`print/head/` — 1:1, do not scale)

| Part | Print orientation | Mate face |
|------|-------------------|-----------|
| `cam_mount_bottom/middle/top` | As stacked in upstream boom | Boom forward (+Z); camera at tip |

### Arms (`print/SO101/` — **print 2×**)

See `print/SO101/README.md`. Seat each follower on matching 4040 (L blue / R orange).

Diagram (ASCII — Docs mirrors this):

```
        [cam boom → +Z]
              |
         2040 extrusion (BOUGHT)
              |
     L(+X,blue)  carriage  R(−X,orange)
              |
           T8 screw (BOUGHT, +X axis)
              |
         perceptron base
         ● tires    caster●
```

---

## Torque / order checklist (one joint at a time)

Power **OFF**. Complete each line before the next.

1. [ ] Ballast installed low in bay (**do not skip**)
2. [ ] Gearmotors + tires on base; caster free
3. [ ] 2040 bolted to top plate; plumb with square
4. [ ] T8 through z-bottom → carriage nut → z-top; spin free by hand
5. [ ] NEMA17 coupled; driver **unpowered** until step 10
6. [ ] 4040 L (blue) + R (orange) on carriage; SO-101 seated — **one arm fully torqued before starting the other**
7. [ ] Cam stack 1:1 on column top
8. [ ] Wiring: logic harness first (TTL/JST), then motor bus — **labels match L/R**
9. [ ] Kill-switch in series with motor rail
10. [ ] Bring-up order (below) — no motion until complete

---

## Foolproof bring-up (no motion until ready)

1. Logic / Pi power only — cams enumerate, arm servos **torque off / limp**
2. Confirm L/R IDs in software match blue/orange plugs
3. Enable **one** arm, tiny jog, power off
4. Enable second arm, tiny jog, power off
5. Enable screw stepper, crawl Q/E range — verify soft limits mentally (160–1250 mm AGL)
6. Enable wheel drivers last — crawl drive with carriage mid-height
7. Only then full teleop; keep e-stop in hand

Sim mirrors limits: Q/E hard-clamped; **LIMIT** in HUD; tip slowdown when carriage high; **Space** resets.

---

## Controls

- **Sim:** W/S drive · A/D turn · Q/E lift · F pick · **Space e-stop/reset** · Tab auto
- **Model:** Orbit only · fixed default AGL · captions = bought vs printed

## Cost

`/bom` dual twin ≈ **$740**. Arms DIY ~$250 dominate. Ballast line is required, not optional.
