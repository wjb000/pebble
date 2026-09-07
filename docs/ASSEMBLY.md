# Pebble assembly — wheeled base + SO-101 arm

Digital twin: `src/robot/dims.ts` is source of truth for mounts / BOM. Sim shows a **procedural placeholder chassis** + real SO-101 GLB until a printed shell CAD lands.

**Product:** Pebble — **low differential-drive wheeled base + mast camera + 1× LeRobot SO-101** (v1). Dual arms optional.
**Not** an official Pollen Robotics / Microduck product. Microduck biped is **not** the locomotion for this goal.

## Safety (read before power)

- **Not a babysitter.** Research / DIY — never leave unsupervised with children or pets.
- **Pinch hazards.** STS3215 arm joints and gripper pinch hard. E-stop on servo PSU.
- **Battery.** LiPo: fire-safe charge surface; wheel motor rail ≠ arm servo rail ≠ logic 5V.
- **Floors.** Rugs, cords, stairs, pets. Optional bumper/cliff sensors later — not in v1 UI.
- **Home deploy caveats.** Not certified. No warranty. You own electrical/mechanical risk.

## Assembly order

1. **Print / build low round-ish chassis** — diff-drive bay, battery tray, Pi bay, arm mount boss, mast socket.
2. **Wheels + motors + driver** — two geared motors + wheels; caster(s); TB6612/L298N-class driver. Tank `{forward, yawRate}`.
3. **Compute + eye** — Pi Zero 2 W (or similar) in base; CSI/USB cam on mast.
4. **Power** — 2S/3S LiPo; separate BEC/hub for STS3215 arm bus.
5. **SO-101 arm (v1 = one)** — build follower per LeRobot SO-101 docs. Mount side/front for floor / table-edge reach.
6. **Optional second arm** — only after base proves stable; update power budget.
7. **Brain hook** — locomotion same as browser sim. Arms: LeRobot `so101_follower`.

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
- Browser body: `src/components/Pebble.tsx`
- BOM UI: `/bom`
