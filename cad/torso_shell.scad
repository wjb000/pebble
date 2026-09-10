// HouseHand torso — mates LeKiwi plate (bottom) + shoulder deck (top).
// Units: mm. Export STL → print/xlerobot/hardware/HouseHand_torso.stl
// Prefer: python3 scripts/gen_structure_kit.py  (same geometry)

OD = 216;
WALL = 5;
H = 320;
FLANGE_OD = 236;
FLANGE_Z = 6;
RIM_Z = 4;
$fn = 72;

difference() {
  union() {
    // bottom flange
    cylinder(h = FLANGE_Z, d = FLANGE_OD);
    // main tube
    translate([0, 0, FLANGE_Z])
      cylinder(h = H - FLANGE_Z - RIM_Z, d = OD);
    // top rim for deck registration ring
    translate([0, 0, H - RIM_Z])
      cylinder(h = RIM_Z, d = OD + 4);
  }
  translate([0, 0, -1])
    cylinder(h = H + 2, d = OD - 2 * WALL);
}
