# Pebble assembly — OSS-composed wheeled twin + lead-screw + 2× SO-101

Digital twin: `src/robot/dims.ts`. **Sim and /model share `RobotAssembly`** — real upstream meshes from `public/assets/{base,lift,head,so101}/` — no generated placeholder bodies, no ForgeCAD.

**Product:** perceptron_bot wheeled base + bought 2040 extrusion column to **1730 mm (~5′8″)** + Prusa lead-screw nut carriage + **2× LeRobot SO-101** + SO-ARM overhead cam (1:1).  
**Not** an official Pollen Robotics / Microduck product. Legacy Microduck assets are quarantined under `refs/quarantine/`.

## Height honesty

- Assert: `BASE.height_mm (108) + EXTRUSION.length_mm (1540) + HEAD.stack_h_mm (82) = 1730`.
- Printable OSS mesh stack alone is **shorter** than 5′8″.
- Overall **1730 mm** comes from a **purchased 2040 extrusion** (~1540 mm) called out in the BOM (stock envelope in the twin).
- Lead screw ~1.5 m runs **coax on `SCREW_AXIS_X_MM`**; carriage travel ~160→1250 mm AGL (Q/E in sim; /model uses fixed default AGL).

## Upstream print list

| Area | Path | Source | License |
|------|------|--------|---------|
| Base | `print/base/` | [PedroS235/perceptron_bot](https://github.com/PedroS235/perceptron_bot) | MIT |
| Lift | `print/lift/` | [prusa3d/Original-Prusa-i3](https://github.com/prusa3d/Original-Prusa-i3) Z + x-end-motor; SO-ARM [4040_Base_Mount](https://github.com/TheRobotStudio/SO-ARM100) ×2 | GPL-2.0 / Apache-2.0 |
| Head | `print/head/` | SO-ARM100 Optional Overhead_Cam_Mount_32x32_UVC_Module (1:1) | Apache-2.0 |
| Arms | `print/SO101/` | [TheRobotStudio/SO-ARM100](https://github.com/TheRobotStudio/SO-ARM100) SO-101 — **print 2× followers** | Apache-2.0 |

See each folder’s `NOTICE.md` / README.

## Bought (not printed)

- 2040 extrusion ~1540 mm; T8/Tr8 lead screw ~1.5 m + coupler + bearings; NEMA17 + driver (no MGN12 on cheap default)
- Rubber drive tires / gearmotors; **LiPo + scrap-steel ballast** (required); Pi 5 4GB (or Pi 4); M3/M4/M5
- 2× SO-101 DIY servo kits (~$125/arm)

## Assembly order

1. Print perceptron chassis plates/walls/casters from `print/base/`.
2. Print Prusa `z-axis-bottom`, `z-axis-top`, `x-end-motor` (carriage), `z-screw-cover`; print **2×** `4040_base_mount`; print overhead cam trio (1:1).
3. Print / obtain **2×** SO-101 followers from `print/SO101/`.
4. Mount gearmotors + bought tires on base; fit caster; add **ballast**.
5. Bolt 2040 extrusion to top plate; install lead screw coax on screw axis through Prusa Z mounts; seat nut carriage (`x-end-motor`).
6. Bolt SO-101s to carriage via L/R 4040 mounts (idle hang, seated on mounts).
7. Mount overhead cam at column top at true scale; wire Pi + shared arm TTL hub + screw stepper.
8. Brain: locomotion = browser sim tank; arms = LeRobot `so101_follower`; lift = screw stepper.

## Controls

- **Sim:** W/S drive · A/D yaw · Q/E raise/lower carriage · F pick/drop · Space reset · Tab auto
- **Model (`/model`):** OrbitControls only (orbit/pan/zoom) · shared assembly · fixed default AGL · no physics

## Safety

- Not a babysitter. Pinch hazards on STS3215. Tip risk on tall dual-arm stack — ballast hard. LiPo fire-safe charge. Draft — not for sale.

## Cost

See `/bom`: base vs +1 arm vs +2 arms (product). Draft dual twin ≈ **$740**. Arms DIY dominate.
