// HouseHand printable shoulder deck — dual SO-101 pads + neck boss.
// Units: mm. Flat on bed. Print PETG/PLA+ ~20% gyroid, 4 walls.

plate_x = 200;
plate_y = 380;
plate_z = 12;
corner_r = 28;

pad_x = -26;
pad_half_y = 138;
pad_r = 48;
pad_z = 6;

torso_od = 216;
torso_ring_w = 10;
torso_ring_z = 4;

neck_boss_r = 36;
neck_boss_z = 14;
neck_hole_r = 18;

module rounded_plate(wx, wy, hz, r) {
  hull() {
    for (sx = [-1, 1], sy = [-1, 1])
      translate([sx * (wx/2 - r), sy * (wy/2 - r), 0])
        cylinder(h = hz, r = r, $fn = 48);
  }
}

difference() {
  union() {
    translate([0, 0, 0]) rounded_plate(plate_x, plate_y, plate_z, corner_r);
    // torso registration ring (underside)
    translate([0, 0, -torso_ring_z])
      difference() {
        cylinder(h = torso_ring_z, r = torso_od/2 + 2, $fn = 96);
        translate([0, 0, -0.1])
          cylinder(h = torso_ring_z + 0.2, r = torso_od/2 - torso_ring_w, $fn = 96);
      }
    // SO-101 pads
    for (sy = [-1, 1]) {
      translate([pad_x, sy * pad_half_y, plate_z])
        cylinder(h = pad_z, r = pad_r, $fn = 64);
      translate([pad_x, sy * pad_half_y, plate_z + pad_z])
        difference() {
          cylinder(h = 1.2, r = pad_r, $fn = 64);
          translate([0, 0, -0.1]) cylinder(h = 1.4, r = pad_r - 4, $fn = 64);
        }
    }
    // neck boss
    translate([0, 0, plate_z])
      difference() {
        cylinder(h = neck_boss_z, r = neck_boss_r, $fn = 64);
        translate([0, 0, -0.1]) cylinder(h = neck_boss_z + 0.2, r = neck_hole_r, $fn = 48);
      }
  }
}
