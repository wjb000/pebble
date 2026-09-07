# Pebble assembly — wheeled humanoid + 2× SO-101

Digital twin: `src/robot/dims.ts` is source of truth for mounts / BOM / print dims.
**Sim shows the actual printable parts:** base/torso/head STLs from `print/base/` (= `public/assets/base/`) + SO-101 follower GLB baked from upstream printable URDF meshes (idle hang remounted −Y).

**Product:** Pebble — **wide differential-drive wheeled base + vertical torso + head (screen+cam) + 2× LeRobot SO-101** hanging at the flanks.
**Not** an official Pollen Robotics / Microduck product.

## Reach / height (first principles)

- SO-101 reach ~500 mm
- Shoulders ~**527 mm** AGL → idle hang reaches near **floor**; raised/forward reach ≈ **US counter (~900 mm)**
- Overall height with head ~**717 mm**
- Tip risk rises with dual arms + height — **wide base (~340 mm) + ballast in bay**

## Print list

### Base + torso + head (authored — `print/base/`)

| File | Qty | Notes |
|------|-----|-------|
| `chassis_bottom_plate.stl` | 1 | Octagon ~340 mm flat-to-flat, 3.5 mm |
| `chassis_top_plate.stl` | 1 | Same |
| `standoff.stl` | 8 | 70 mm tall (taller bay / ballast) |
| `motor_pod_left.stl` / `motor_pod_right.stl` | 1 each | Gearmotor bays |
| `caster_mount.stl` | 1 | Rear caster pocket |
| `wheel_hub.stl` | 2 | Hubs only |
| `torso_column.stl` | 1 | ~450 mm vertical torso |
| `shoulder_pod_left.stl` / `shoulder_pod_right.stl` | 1 each | SO-101 mounts at shoulders |
| `head_neck.stl` | 1 | Neck |
| `head_bezel.stl` | 1 | Face frame |
| `screen_backplate.stl` | 1 | Behind bezel |
| `camera_mount.stl` | 1 | Forehead cam shelf |
| `mast.stl` / `camera_shelf.stl` / `so101_mount_pad.stl` | optional | Legacy single-mast / single-pad |

**Filament (structure):** ~550–750 g PLA @ ~20% infill (slicer will confirm).

### SO-101 follower ×2 (upstream — `print/SO101/`)

Print Individual parts **or** `Follower/Prusa_Follower_SO101.stl` plate pack — **two sets**.
See `print/SO101/README.md` → [TheRobotStudio/SO-ARM100](https://github.com/TheRobotStudio/SO-ARM100) (Apache-2.0).

**Filament (arms):** ~300–400 g PLA per follower set.

### Bought (not printed)

- Rubber tires / complete wheels (~70 mm OD) — hubs are printed
- Geared DC motors (diff-drive pair) + motor driver
- Swivel caster; **ballast weight** for the bay
- CSI/USB camera module + small HDMI/USB **face display**
- Pi Zero-class SBC, LiPo, fasteners, 2× SO-101 servo kits / electronics

## Safety (read before power)

- **Not a babysitter.** Research / DIY — never leave unsupervised with children or pets.
- **Pinch hazards.** STS3215 arm joints and grippers pinch hard. E-stop on servo PSU.
- **Tip risk.** Dual arms (~1.6 kg) on a tall torso — ballast the bay; go slow on rugs/ramps.
- **Battery.** LiPo: fire-safe charge surface; wheel motor rail ≠ arm servo rail ≠ logic 5V.
- **Floors.** Rugs, cords, stairs, pets. Optional bumper/cliff sensors later — not in v1 UI.
- **Home deploy caveats.** Not certified. No warranty. You own electrical/mechanical risk. **Draft — not for sale.**

## Assembly order

1. **Print structure** from `print/base/` — plates, standoffs, pods, torso, shoulders, head parts, hubs.
2. **Print / obtain 2× SO-101 followers** from `print/SO101/`.
3. **Wheels + motors + driver** — mount gearmotors; press hubs; fit **bought** rubber tires; install caster; add **ballast**.
4. **Torso + head** — bolt torso to top plate; neck + bezel + screen backplate; mount bought face display + forehead cam.
5. **Compute + power** — Pi in base bay; 2S/3S LiPo; dual-arm BEC/hub for STS3215 bus.
6. **SO-101 arms (×2)** — assemble per LeRobot docs; bolt to L/R shoulder pods; idle hang along flanks (grippers toward floor).
7. **Brain hook** — locomotion same as browser sim. Arms: LeRobot `so101_follower` ×2.

## What it can do (honest)

- In scope: pick/place floor→counter; wipe within reach; nudge laundry basket
- Out of scope: laundry folding; MuJoCo autonomy; babysitting

## LeRobot

- Docs: https://huggingface.co/docs/lerobot/en/so101
- Class: `so101_follower` · STS3215 ×6 / arm · reach ~500 mm · ~800 g

## Cost

See `/bom`: Base kit vs + 1 arm vs **+ 2 arms (default)**. Draft street USD; dual-arm twin rises vs prior one-arm ~$376.

## Files

- Dims: `src/robot/dims.ts`
- Mass: `src/robot/mass.ts`
- Print: `print/base/` (+ sim copies in `public/assets/base/`)
- Print arms: `print/SO101/`
- Browser body: `src/components/Pebble.tsx` / `ImportedRobots.tsx`
- BOM UI: `/bom`
