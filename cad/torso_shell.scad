// HouseHand torso shell — plate to XLe 035 arm-base.
// Units: mm. F6 render, then export STL to print/xlerobot/hardware/torso_shell.stl
OD = 120;
WALL = 4;
H = 320;
$fn = 64;

difference() {
  cylinder(h = H, d = OD);
  translate([0, 0, -1]) cylinder(h = H + 2, d = OD - 2 * WALL);
}
