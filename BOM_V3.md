# HouseHand — Bill of Materials (v3.1)

**Form:** NYRO-like silhouette · telescoping torso · omni base · dual SO-101 arms  
**Rough total:** **~$450–700** DIY (print yourself; no kits markup)

Prices are typical US hobby sourcing (AliExpress / Amazon), 2026. Shipping/tax extra.

---

## A. Arms (2× SO-101 follower)

| # | Part | Qty | ~$ ea | ~$ | Notes |
|---|---|---:|---:|---:|---|
| A1 | Feetech STS3215 7.4V 1/345 (C001) | 12 | 14 | 168 | 6 per arm |
| A2 | Waveshare bus servo adapter | 2 | 11 | 22 | One bus per arm |
| A3 | 5V ≥5A PSU (or 12V if using 12V STS) | 2 | 12 | 24 | Match motor voltage |
| A4 | USB-C data cables | 2 | 4 | 8 | |
| A5 | PLA+/PETG filament (both followers) | ~1 kg | 20 | 20 | Print from SO-ARM100 STLs |
| A6 | USB wrist cameras (UVC) | 2 | 15 | 30 | |
| A7 | Grip tape | 1 | 5 | 5 | |
| | **Arms subtotal** | | | **~$277** | |

Upstream: https://github.com/TheRobotStudio/SO-ARM100

---

## B. Telescoping torso + shoulder

| # | Part | Qty | ~$ | Notes |
|---|---|---:|---:|---|
| B1 | Nested tube / telescoping column kit (or DIY nested 2040 + internal lead screw) | 1 | 40–80 | Column **grows/shrinks** — not an exposed rail carriage |
| B2 | Lead screw T8 + nut **or** internal belt | 1 | 10–25 | Inside the torso |
| B3 | Lift motor: STS3215 **or** 12V gearmotor / linear actuator | 1 | 15–40 | |
| B4 | Printed shoulder crossbar (mounts 2× SO-101 bases) | 1 | 5–10 | Filament |
| B5 | Column base plate → deck | 1 | 5–10 | Print or plate |
| B6 | Limit switches (min/max height) | 2 | 3 | |
| B7 | Head / torso USB camera | 1 | 15–30 | On shoulder or top tube |
| | **Torso subtotal** | | **~$90–200** | |

---

## C. Omnidirectional base

| # | Part | Qty | ~$ | Notes |
|---|---|---:|---:|---|
| C1 | Chassis deck ~400×450 mm (plywood 18 mm or alu) | 1 | 15–25 | Low, stiff |
| C2 | Omni wheels 4″ (kiwi) **or** mecanum set | 3–4 | 30–60 | 3-omni LeKiwi-style **or** 4 mecanum |
| C3 | Drive motors: STS3215 12V ×3 **or** DC gearmotors + encoders | 3–4 | 45–80 | Match wheel count |
| C4 | Motor driver(s): Waveshare bus **or** high-current H-bridges | 1–2 | 15–40 | |
| C5 | Casters (only if using 2-drive + casters — skip for full omni) | 0 | 0 | Full omni: no casters |
| C6 | Fasteners, standoffs, bumper foam | — | 10–15 | |
| | **Base drive subtotal** | | **~$115–220** | |

LeKiwi reference (omni): https://github.com/SIGRobotics-UIUC/LeKiwi

---

## D. Power, compute, safety

| # | Part | Qty | ~$ | Notes |
|---|---|---:|---:|---|
| D1 | 12V battery pack + BMS **or** compact power station | 1 | 50–120 | Centered in base |
| D2 | 5V buck converter | 1–2 | 5–10 | Logic / hub / cams |
| D3 | Powered USB hub | 1 | 15 | Arms buses + 3 cams |
| D4 | Laptop you own **or** Raspberry Pi 5 | 0–1 | 0–80 | Gamepad teleop host |
| D5 | USB gamepad | 1 | 20 | |
| D6 | E-stop (latching) | 1 | 8–12 | Cuts drive + arms + lift |
| D7 | Wire, XT60, fuses, switch | — | 15–25 | |
| D8 | On-base bin / tote | 1 | 5–10 | Drops / laundry |
| | **Power/compute subtotal** | | **~$120–290** | |

---

## E. Optional later

| Part | ~$ | Why |
|---|---:|---|
| Leader SO-101 set | +110–230 | Better LeRobot demos |
| TPU soft fingers | 10 | Cloth grasp |
| Spray bottle + trigger servo + rag | 15–30 | Counter wipe |
| Second head depth cam | 50–220 | Nice-to-have, skip v1 |

---

## Cost rollup

| Block | Low | High |
|---|---:|---:|
| A Arms | 260 | 300 |
| B Torso | 90 | 200 |
| C Omni base | 115 | 220 |
| D Power/compute | 120 | 210 |
| **Total (no Pi, no leader)** | **~$485** | **~$730** |
| Aim if careful / printed | | **~$450–650** |

---

## Buy order
1. **A** — first 6× STS + one arm bring-up (floor grasp on bench)  
2. Rest of **A** — second arm  
3. **B** — telescoping torso + shoulder bar  
4. **C+D** — omni base + battery (tip tests with arms mounted)

## Do not buy
RÅSKOG cart · ODrive/SteadyWin · Amazing Hand · exposed-rail-only lift · diff-only if you want true omni

## Sketch files
- Concept: telescoping short/tall + omni (see chat images)
- This BOM: `BOM_V3.md`
