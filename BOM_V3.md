# HouseHand — Bill of Materials (v3.2)

**Product of record:** LeKiwi **3-omni** base + printed **HouseHand** torso/deck/neck/head + **2× SO-101** followers.  
**Rough total:** **~$500–750** DIY (print yourself). Street USD hobby prices, 2026 — verify before buy.

Print list: `print/README.md`. Assembly: `docs/ASSEMBLY.md`. Twin: `/model`.

---

## A. Arms (2× SO-101 follower)

| # | Part | Qty | ~$ | Notes |
|---|---|---:|---:|---|
| A1 | Feetech STS3215 (C001 / 7.4V or 12V match) | **12** | 168 | 6 per follower |
| A2 | Waveshare bus servo adapter | 2 | 22 | One bus per arm |
| A3 | 5V ≥5A (or 12V) rail for arms | 1–2 | 12–24 | Match motor voltage |
| A4 | USB-C data cables | 2 | 8 | Bus → host |
| A5 | PLA+/PETG filament (2× follower) | ~0.8 kg | 16 | `print/SO101/` |
| A6 | Wrist UVC cams (optional) | 0–2 | 0–30 | + `Wrist_camera_mount_SO101.stl` ×2 |
| | **Arms subtotal** | | **~$230–270** | |

Upstream: https://github.com/TheRobotStudio/SO-ARM100

---

## B. HouseHand structure (printed)

| # | Part | Qty | ~$ | Notes |
|---|---|---:|---:|---|
| B1 | `HouseHand_torso.stl` Ø180 / **6 mm wall** / flange Ø190 × 320 mm | 1 | filament | Seats on layer2; **wheel wells** over forward omnis; split ring if bed-limited |
| B2 | `HouseHand_shoulder_deck.stl` (+ splice if L/R) | 1 | filament | Pads (−26, ±138); Ø36 cable hole |
| B3 | `HouseHand_neck.stl` | 1 | filament | 4× M3 into deck boss |
| B4 | `HouseHand_head_mount.stl` + `HouseHand_head_camera.stl` | 1 | filament | Head flange **prints** 4× M3 at r=28; clamp plate for 32×32 UVC |
| B5 | M3 + M4 hardware pack | 1 | 12–18 | Flange **6×M3**, rim 6×M3, split 6×M3, splice 8×M3, neck/head 8×M3, pads **8× M4×30** + wing nuts |
| | **Structure subtotal** | | **~$25–45** | filament + fasteners |

Generate: `python3 scripts/gen_structure_kit.py`

---

## C. LeKiwi omni base

| # | Part | Qty | ~$ | Notes |
|---|---|---:|---:|---|
| C1 | Printed plates + mounts (`print/lekiwi/`) | 1 set | filament | layer1, layer2, 3× drive mount v11, 3× hub, battery, Pi case, controller mount |
| C2 | **4″ omni wheels** (bought) | **3** | 35–50 | Not printed |
| C3 | **STS3215 drive servos** | **3** | 42–50 | Bridge: mount → hub → wheel |
| C4 | Waveshare bus (drive) | 1 | 11 | Or share a bus carefully |
| C5 | **Hex standoffs** McMaster-class **`94868A713`** (M3 ♀ threaded, ~50 mm stack height per URDF) | **6** | 8–15 | **Required** between layer1 ↔ layer2 |
| C6 | M3 screws for plates / mounts / standoffs | — | 8–12 | |
| | **Base subtotal** | | **~$110–160** | |

Upstream: https://github.com/SIGRobotics-UIUC/LeKiwi

---

## D. Power, compute, safety

| # | Part | Qty | ~$ | Notes |
|---|---|---:|---:|---|
| D1 | 12 V pack + BMS (centered in base bay) | 1 | 50–120 | Tip ballast |
| D2 | 5 V buck | 1–2 | 5–10 | Logic / hub / cams |
| D3 | Powered USB hub | 1 | 15 | Buses + cams |
| D4 | Laptop you own **or** Pi 5 | 0–1 | 0–80 | |
| D5 | USB gamepad | 1 | 20 | Teleop |
| D6 | Latching e-stop | 1 | 8–12 | Cuts drive + arms |
| D7 | Wire, XT60, fuses, switch | — | 15–25 | |
| D8 | Head UVC camera | 1 | 15–30 | On HouseHand head mount |
| | **Power/compute subtotal** | | **~$130–280** | |

---

## Cost rollup

| Block | Low | High |
|---|---:|---:|
| A Arms | 230 | 270 |
| B Structure (print) | 25 | 45 |
| C Omni base | 110 | 160 |
| D Power/compute | 130 | 220 |
| **Total** | **~$495** | **~$695** |

---

## Buy order
1. **C2+C3+C5** — omni wheels, 3× drive STS3215, **6× standoffs** (base cannot assemble without these)
2. **A1** — first 6× STS + one follower bring-up
3. Rest of **A** — second arm
4. Print **C1 + B** while hardware ships
5. **D** — pack, e-stop, compute, head cam

## Do not buy
RÅSKOG cart · 4× mecanum deck (this twin is **3-omni**) · ODrive/SteadyWin · Amazing Hand · nested telescoping column kit · exposed-rail-only lift · leader SO-101 (unless you want teleop leader)

## Sketch
- Twin stack on `/model` matches `print/` STLs
- This BOM: `BOM_V3.md` · UI: `/bom`
