// Pebble CAD twin — chore-class body + 2× SO-101 arms
// MUST MATCH src/robot/dims.ts (hardcoded constants below).
// Units: millimeters. Open in OpenSCAD: File → Open → F5 preview / F6 render.
// NOT an official Pollen / legacy-ref product — public specs only.

// ===== must match dims.ts =====
XL330_L = 20.0;
XL330_W = 34.0;
XL330_H = 26.0;

STS3215_L = 45.2;
STS3215_W = 24.7;
STS3215_H = 35.0;

FOOT_L = 55;
FOOT_W = 32;
FOOT_H = 12;

SHIN_LEN = 48;
THIGH_LEN = 42;

PELVIS_W = 72;
PELVIS_H = 20;
PELVIS_D = 48;

TORSO_W = 100;
TORSO_H = 68;
TORSO_D = 78;

NECK_LEN = 22;

HEAD_W = 48;
HEAD_H = 38;
HEAD_D = 52;

BEAK_L = 28;
BEAK_W = 16;
BEAK_H = 10;

CAMERA_W = 12;
CAMERA_H = 12;
CAMERA_D = 8;

LINK_R = 6;
HORN_THICKNESS = 2.5;

SO101_UPPER = 112.6;
SO101_FORE = 134.9;
SO101_WRIST = 61.1;
SO101_GRIP = 80;
SO101_BASE_Z = 62.4;

SHOULDER_SPAN = 140;
HIP_LATERAL = 30;

PI_W = 65;
PI_H = 30;
PI_D = 12;

BAT_W = 40;
BAT_H = 18;
BAT_D = 30;

JOINT_YAW_TO_ROLL = 12;
JOINT_ROLL_TO_PITCH = 16;

STANDING_HEIGHT =
  FOOT_H + SHIN_LEN + THIGH_LEN + PELVIS_H + TORSO_H + NECK_LEN + HEAD_H;
// expect 250
HIP_HEIGHT = FOOT_H + SHIN_LEN + THIGH_LEN; // 102

$fn = 24;

module servo_xl330() {
  color([0.2, 0.22, 0.26])
    cube([XL330_L, XL330_H, XL330_W], center = true);
  color([0.95, 0.45, 0.1])
    translate([XL330_L * 0.35, 0, 0])
      rotate([0, 90, 0])
        cylinder(h = HORN_THICKNESS, r = 2.5, center = true);
}

module servo_sts3215() {
  color([0.12, 0.16, 0.22])
    cube([STS3215_L, STS3215_H, STS3215_W], center = true);
  color([0.95, 0.45, 0.1])
    translate([STS3215_L * 0.35, 0, 0])
      rotate([0, 90, 0])
        cylinder(h = 3, r = 4, center = true);
}

module tube_link(len, r = LINK_R) {
  color([0.6, 0.65, 0.72])
    translate([0, -len / 2, 0])
      cylinder(h = len, r = r, center = true);
}

module foot() {
  color([0.18, 0.2, 0.24])
    translate([0, -FOOT_H / 2, FOOT_L * 0.15])
      cube([FOOT_W, FOOT_H, FOOT_L], center = true);
}

module leg(side = 1) {
  translate([side * HIP_LATERAL, 0, 0]) {
    rotate([0, 0, 90]) servo_xl330(); // hip_yaw
    translate([0, -JOINT_YAW_TO_ROLL, 0]) {
      servo_xl330(); // hip_roll
      translate([0, -JOINT_ROLL_TO_PITCH, 0]) {
        rotate([90, 0, 0]) servo_xl330(); // hip_pitch
        tube_link(THIGH_LEN, LINK_R * 0.85);
        translate([0, -THIGH_LEN, 0]) {
          rotate([90, 0, 0]) servo_xl330(); // knee
          tube_link(SHIN_LEN, LINK_R * 0.8);
          translate([0, -SHIN_LEN, 0]) {
            rotate([90, 0, 0]) servo_xl330(); // ankle
            foot();
          }
        }
      }
    }
  }
}

module duck_head() {
  rotate([90, 0, 0]) servo_xl330(); // neck_pitch
  color([0.2, 0.22, 0.26])
    translate([0, NECK_LEN * 0.4, 0])
      cylinder(h = NECK_LEN * 0.75, r1 = 10, r2 = 8, center = true);
  translate([0, NECK_LEN * 0.85, 0]) {
    rotate([90, 0, 0]) servo_xl330(); // head_pitch
    translate([0, 10, 0]) {
      rotate([0, 0, 90]) servo_xl330(); // head_yaw
      translate([0, 10, 0]) {
        servo_xl330(); // head_roll
        color([0.6, 0.64, 0.7])
          translate([0, HEAD_H * 0.25, 0])
            cube([HEAD_W, HEAD_H, HEAD_D], center = true);
        // beak
        rotate([90, 0, 0]) servo_xl330();
        color([0.95, 0.45, 0.1])
          translate([0, -2, BEAK_L * 0.45])
            cube([BEAK_W, BEAK_H, BEAK_L], center = true);
        color([0.1, 0.1, 0.12])
          translate([0, HEAD_H * 0.55 + CAMERA_H / 2, 4])
            cube([CAMERA_W, CAMERA_H, CAMERA_D], center = true);
      }
    }
  }
}

module so101_arm(side = 1) {
  translate([side * SHOULDER_SPAN / 2, TORSO_H * 0.28, 8]) {
    // mount plate
    color([0.18, 0.2, 0.24])
      translate([-side * 8, 0, 0])
        cube([18, 28, 14], center = true);
    rotate([0, 0, 90]) servo_sts3215(); // shoulder_pan
    color([0.2, 0.22, 0.26])
      translate([0, SO101_BASE_Z * 0.35, 0])
        cylinder(h = SO101_BASE_Z * 0.7, r1 = 20, r2 = 18, center = true);
    translate([0, SO101_BASE_Z * 0.75, 0]) {
      servo_sts3215(); // shoulder_lift
      rotate([30, 0, side * 5]) {
        tube_link(SO101_UPPER, 10);
        translate([0, -SO101_UPPER, 0]) {
          rotate([90, 0, 0]) servo_sts3215(); // elbow
          rotate([-65, 0, 0]) {
            tube_link(SO101_FORE, 9);
            translate([0, -SO101_FORE, 0]) {
              rotate([90, 0, 0]) servo_sts3215(); // wrist_flex
              translate([0, -SO101_WRIST * 0.35, 0]) {
                servo_sts3215(); // wrist_roll
                translate([0, -SO101_WRIST * 0.7, 0]) {
                  rotate([0, 0, 90]) servo_sts3215(); // gripper
                  color([0.8, 0.82, 0.86]) {
                    translate([-12, -SO101_GRIP * 0.35, 0])
                      cube([8, SO101_GRIP * 0.7, 14], center = true);
                    translate([12, -SO101_GRIP * 0.35, 0])
                      cube([8, SO101_GRIP * 0.7, 14], center = true);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

module pebble() {
  translate([0, HIP_HEIGHT, 0]) {
    color([0.18, 0.2, 0.24])
      cube([PELVIS_W, PELVIS_H, PELVIS_D], center = true);
    leg(+1);
    leg(-1);
    translate([0, PELVIS_H / 2 + TORSO_H / 2, 0]) {
      color([0.6, 0.64, 0.7])
        cube([TORSO_W, TORSO_H, TORSO_D], center = true);
      color([0.15, 0.45, 0.3])
        translate([-12, 8, -TORSO_D * 0.28])
          cube([PI_W, PI_H, PI_D], center = true);
      color([0.2, 0.22, 0.26])
        translate([22, -12, -TORSO_D * 0.28])
          cube([BAT_W, BAT_H, BAT_D], center = true);
      translate([0, TORSO_H / 2 + NECK_LEN * 0.1, 0])
        duck_head();
      so101_arm(+1);
      so101_arm(-1);
    }
  }
  color([0.95, 0.45, 0.1]) {
    translate([120, STANDING_HEIGHT / 2, 0])
      cube([3, STANDING_HEIGHT, 3], center = true);
    translate([120, 0, 0]) cube([24, 2, 24], center = true);
    translate([120, STANDING_HEIGHT, 0]) cube([24, 2, 24], center = true);
  }
}

echo(str("STANDING_HEIGHT_MM = ", STANDING_HEIGHT, " (must be 250)"));
echo(str("HIP_HEIGHT_MM = ", HIP_HEIGHT));
echo("must match dims.ts — legacy-ref body + SO-101 arms");

pebble();
