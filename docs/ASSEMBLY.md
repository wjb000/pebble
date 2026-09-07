# Pebble assembly — Microduck body + SO-101 arms

**Digital twin rule:** `sim = CAD = BOM`. All millimeters live in `src/robot/dims.ts` (export `public/robot/dims.json`). OpenSCAD `cad/pebble.scad` hardcodes the same constants with comment `must match dims.ts`.

**Product name:** Pebble — **Microduck-class body + 2× LeRobot SO-101 arms**.  
**Not an official Pollen Robotics / Microduck product.** Public specs and MJCF kinematics only — do not copy proprietary STLs or brand as official.

Standing height: **250 mm**. Body: **15× Dynamixel XL330**. Arms: **2× SO-101** (6 DOF each, Feetech **STS3215** ×6/arm).

## Safety (read before power)

- **Not a babysitter.** Research / DIY platform — never leave unsupervised with children or pets.
- **Pinch hazards.** XL330 joints, STS3215 arm joints, and grippers pinch hard. E-stop on servo PSUs.
- **Battery.** LiPo packs: fire-safe charge surface; servo bus ≠ logic 5V.
- **Tip-over / top-heavy.** Dual SO-101 (~800 g each ≈ **1.6 kg**) on a Microduck-class body (**&lt;800 g**) is top-heavy. Prefer:
  - shoulder **mount plate** + optional **counterweight / ballast**
  - **docked / tabletop** manipulation with body braced
  - walk with arms **idle / stowed**
- **Home deploy caveats.** Not certified. No warranty. You own electrical/mechanical risk.

## Assembly order

1. **Print Microduck-scale body** — original twin from dims.ts (pelvis, trunk, thigh/shin). Do **not** redistribute proprietary Pollen meshes.
2. **Dry-fit legs** — hip_yaw → hip_roll → hip_pitch → knee → ankle. Mount visible XL330 bodies (20×34×26 mm).
3. **Trunk bay** — Pi Zero 2 W / Radxa Zero 3W; small LiPo tray.
4. **Neck + duck head + beak** — neck_pitch, head_pitch, head_yaw, head_roll + 15th XL330 for mouth/beak; tiny cam on crown.
5. **SO-101 arms** — build two follower arms per [LeRobot SO-101 docs](https://huggingface.co/docs/lerobot/en/so101) / TheRobotStudio SO-ARM100. Bolt mount plates to torso shoulders (span 140 mm).
6. **Bus + power** — separate TTL hubs/BECs for XL330 body vs STS3215 arms; bring-up one joint at a time.
7. **Brain hook** — locomotion `{forward, yawRate}` (same as browser sim). Arms: LeRobot `so101_follower` (idle pose in playground).
8. **Calibrate** — zero poses match sim rest; verify standing height ~250 mm sole to crown.

## LeRobot integration

| Item | Value |
|------|--------|
| Docs | https://huggingface.co/docs/lerobot/en/so101 |
| Class | `so101_follower` |
| Joints | shoulder_pan, shoulder_lift, elbow_flex, wrist_flex, wrist_roll, gripper |
| Motors | STS3215 ×6 / arm (1/345 follower gearing typical) |
| Reach / mass | ~500 mm · ~800 g (published kit figures) |
| Link lengths | URDF `so101_new_calib.urdf` origins — see `SO101` in dims.ts |

## Torque / mass honesty

| Stack | Approx mass |
|-------|-------------|
| Microduck-class body budget | &lt;800 g |
| Dual SO-101 | ~1.6 kg |
| Twin as built | body + arms + mounts — **top-heavy** |

## Files

| Artifact | Path |
|----------|------|
| Dims (SoT) | `src/robot/dims.ts` |
| Mass estimates | `src/robot/mass.ts` |
| JSON export | `public/robot/dims.json` |
| OpenSCAD twin | `cad/pebble.scad` |
| Browser body | `src/components/Pebble.tsx` |
| BOM UI | `/bom` |

Physics is kinematics-lite today — **geometry must stay exact**.
