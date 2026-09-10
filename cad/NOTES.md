# CAD notes

HouseHand twin mixes real OSS CAD with one HouseHand printable shoulder:

- `public/assets/lekiwi/` — SIGRobotics-UIUC/LeKiwi URDF + meshes (Apache-2.0). Print: `print/lekiwi/`.
- `public/assets/xlerobot/hardware/torso_shell.stl` — printable torso. Print: `print/xlerobot/hardware/`.
- **`public/assets/xlerobot/hardware/HouseHand_shoulder_deck.stl`** — solid printable dual-pad shoulder deck
  (source `cad/shoulder_deck.scad`, generator `scripts/gen_shoulder_deck.py`). **Print this**, not the old XLe 035 armbase fragments.
- `public/assets/xlerobot/hardware/XLeRobot040_neck_refined.stl` + gimbal — neck/cam. Print: same folder / `print/head/`.
- `public/assets/so101/` — TheRobotStudio SO-101 URDF (2× on deck pads). Print: `print/SO101/` **×2**.

Do **not** print the RÅSKOG cart (`XLeRobot040_armbase.stl`) or the fragmented `XLeRobot_035_armbase_*.stl` references.  
Master checklist: `print/README.md`.
