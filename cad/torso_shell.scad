// HouseHand torso — mates LeKiwi layer2 (bottom) + shoulder deck (top).
// Units: mm. Export STL → print/xlerobot/hardware/HouseHand_torso.stl
// Prefer: python3 scripts/gen_structure_kit.py  (same geometry — authoritative)
//
// Two forward 4″ omnis poke above layer2. Wheel wells (print 90–144° /
// 214–271°) cut the flange + lower 36 mm of tube so the tires can spin.
// Seat those wells over the forward omnis (camera faces drive-forward).
// Flange bolts: 6× M3 on the layer2 20 mm grid. (−40, ±80) sit in the wells.

OD = 180;
WALL = 6;
H = 320;
FLANGE_OD = 190;
FLANGE_Z = 10;
RIM_Z = 6;
WHEEL_WELL_Z = 36;
HOLE_R = 1.7; // M3 clearance
BOLTS = [
  [40, 80], [40, -80],
  [80, 40], [80, -40], [-80, 40], [-80, -40]
];
WELLS = [[90, 144], [214, 271]];
$fn = 72;

module well_cut(a0, a1, h) {
  rotate([0, 0, a0])
    rotate_extrude(angle = a1 - a0)
      square([FLANGE_OD / 2 + 2, h]);
}

difference() {
  union() {
    cylinder(h = FLANGE_Z, d = FLANGE_OD);
    translate([0, 0, FLANGE_Z])
      cylinder(h = H - FLANGE_Z - RIM_Z, d = OD);
    translate([0, 0, H - RIM_Z])
      cylinder(h = RIM_Z, d = OD + 4);
  }
  translate([0, 0, -1])
    cylinder(h = H + 2, d = OD - 2 * WALL);
  for (b = BOLTS)
    translate([b[0], b[1], -1])
      cylinder(h = FLANGE_Z + 2, r = HOLE_R, $fn = 24);
  for (w = WELLS)
    translate([0, 0, -1])
      well_cut(w[0], w[1], WHEEL_WELL_Z + 2);
}
