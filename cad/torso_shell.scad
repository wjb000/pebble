// HouseHand torso — mates LeKiwi layer2 (bottom) + shoulder deck (top).
// Units: mm. Export STL → print/xlerobot/hardware/HouseHand_torso.stl
// Prefer: python3 scripts/gen_structure_kit.py  (same geometry — authoritative)
//
// Clearance: bought 4″ omnis poke above layer2 outside r≈103 mm.
// Flange OD ≤190 keeps ≥8 mm; tube OD 180 keeps ~13 mm to wheel mesh.
// Flange bolts hit LeKiwi layer2 20 mm grid: (±40,±80) and (±80,±40).

OD = 180;
WALL = 5;
H = 320;
FLANGE_OD = 190;
FLANGE_Z = 8;
RIM_Z = 4;
HOLE_R = 1.7; // M3 clearance
BOLTS = [
  [40, 80], [-40, 80], [40, -80], [-40, -80],
  [80, 40], [-80, 40], [80, -40], [-80, -40]
];
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
  // through-holes → layer2 grid
  for (b = BOLTS)
    translate([b[0], b[1], -1])
      cylinder(h = FLANGE_Z + 2, r = HOLE_R, $fn = 24);
}
