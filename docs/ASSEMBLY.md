# Pebble assembly — wheeled base + SO-101 arm

Digital twin: `src/robot/dims.ts` is source of truth for mounts / BOM / print dims.
**Sim shows the actual printable parts:** base STLs from `print/base/` (= `public/assets/base/`) + SO-101 follower GLB baked from upstream printable URDF meshes.

**Product:** Pebble — **low differential-drive wheeled base + mast camera + 1× LeRobot SO-101** (v1). Dual arms optional.
**Not** an official Pollen Robotics / Microduck product. Microduck biped is **not** the locomotion for this goal.

## Print list

### Base (authored — `print/base/`)

| File | Qty | Notes |
|------|-----|-------|
| `chassis_bottom_plate.stl` | 1 | Octagon ~280 mm flat-to-flat, 3.5 mm |
| `chassis_top_plate.stl` | 1 | Same |
| `standoff.stl` | 6 | 55 mm tall |
| `motor_pod_left.stl` / `motor_pod_right.stl` | 1 each | Gearmotor bays |
| `caster_mount.stl` | 1 | Rear caster pocket |
| `mast.stl` | 1 | ~180 mm |
| `camera_shelf.stl` | 1 | On mast top |
| `so101_mount_pad.stl` | 1 | Front-right arm pad |
| `wheel_hub.stl` | 2 | Hubs only |

**Filament (base):** ~350–450 g PLA @ ~20% infill (slicer will confirm).

### SO-101 follower (upstream — `print/SO101/`)

Print Individual parts **or** `Follower/Prusa_Follower_SO101.stl` plate pack.
See `print/SO101/README.md` → [TheRobotStudio/SO-ARM100](https://github.com/TheRobotStudio/SO-ARM100) (Apache-2.0).
Upstream `3DPRINT.md`: PLA+, ~20% infill.

**Filament (arm):** ~300–400 g PLA typical for follower set.

### Bought (not printed)

- Rubber tires / complete wheels (~70 mm OD) — hubs are printed
- Geared DC motors (diff-drive pair) + motor driver
- Swivel caster (~28 mm)
- CSI/USB camera module
- Pi Zero-class SBC, LiPo, fasteners, SO-101 servos / kit electronics

## Safety (read before power)

- **Not a babysitter.** Research / DIY — never leave unsupervised with children or pets.
- **Pinch hazards.** STS3215 arm joints and gripper pinch hard. E-stop on servo PSU.
- **Battery.** LiPo: fire-safe charge surface; wheel motor rail ≠ arm servo rail ≠ logic 5V.
- **Floors.** Rugs, cords, stairs, pets. Optional bumper/cliff sensors later — not in v1 UI.
- **Home deploy caveats.** Not certified. No warranty. You own electrical/mechanical risk.

## Assembly order

1. **Print base set** from `print/base/` — plates, standoffs, pods, mast, shelf, hubs, arm pad.
2. **Print / obtain SO-101 follower** from `print/SO101/` (or buy printed enclosure).
3. **Wheels + motors + driver** — mount gearmotors in pods; press hubs; fit **bought** rubber tires; install caster in rear mount. Tank `{forward, yawRate}`.
4. **Compute + eye** — Pi in base bay; CSI/USB cam on mast shelf.
5. **Power** — 2S/3S LiPo; separate BEC/hub for STS3215 arm bus.
6. **SO-101 arm (v1 = one)** — assemble per LeRobot SO-101 docs; bolt to `so101_mount_pad` (front-right).
7. **Optional second arm** — only after base proves stable; update power budget.
8. **Brain hook** — locomotion same as browser sim. Arms: LeRobot `so101_follower`.

## What it can do (honest)

- In scope: pick/place small items; wipe within reach; nudge laundry basket
- Out of scope: laundry folding; MuJoCo autonomy; babysitting

## LeRobot

- Docs: https://huggingface.co/docs/lerobot/en/so101
- Class: `so101_follower` · STS3215 ×6 / arm · reach ~500 mm · ~800 g

## Cost

See `/bom`: Base kit vs + 1 arm (v1) vs optional second arm. Draft street USD; aggressive DIY twin aims roughly USD 400–600 with one arm — not a 1.4k biped XL330 stack.

## Files

- Dims: `src/robot/dims.ts`
- Mass: `src/robot/mass.ts`
- Print base: `print/base/` (+ sim copies in `public/assets/base/`)
- Print arm: `print/SO101/`
- Browser body: `src/components/Pebble.tsx` / `ImportedRobots.tsx`
- BOM UI: `/bom`
