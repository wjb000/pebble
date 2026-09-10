#!/usr/bin/env python3
"""Generate the HouseHand printable structure kit (manifold binary STLs).

Geometry contract (mm, Z-up, print frame):
  TORSO_OD          = 180   # clears 4″ omni tops that poke above LeKiwi layer2
  TORSO_FLANGE_OD   = 190   # ≤190 keeps ≥8 mm to wheel mesh; plate max r≈108
  TORSO_H           = 320
  DECK pads         = (−26, ±138)  Ø96 raised pads for SO-101 bases
  NECK boss         = Ø72 with Ø36 cable hole on deck center

  Seat flange on LeKiwi *layer2* (top plate). Motors/hubs live under layer2;
  bought omni wheels extend above layer2 only outside r≈103.

  Flange bolts land on the LeKiwi layer2 **20 mm hole grid** at
  (±40,±80) and (±80,±40) — real Ø3.4 through-holes, not dimples.

Outputs (public + print):
  HouseHand_torso.stl
  HouseHand_shoulder_deck.stl
  HouseHand_neck.stl
"""

from __future__ import annotations

import math
import struct
from pathlib import Path

# ---- locked interface ----
TORSO_OD = 180.0
TORSO_WALL = 5.0
TORSO_H = 320.0
TORSO_FLANGE_OD = 190.0
TORSO_FLANGE_Z = 8.0
TORSO_RIM_Z = 4.0  # top lip the deck ring seats over

# LeKiwi layer2 is a 20 mm M3 grid. These 8 points sit in the flange
# annulus (r≈89.4, between tube ID 85 and flange OD 95) and hit real plate holes.
FLANGE_BOLTS_XY = (
    (40.0, 80.0),
    (-40.0, 80.0),
    (40.0, -80.0),
    (-40.0, -80.0),
    (80.0, 40.0),
    (-80.0, 40.0),
    (80.0, -40.0),
    (-80.0, -40.0),
)
FLANGE_HOLE_R = 1.7  # M3 clearance

PLATE_X = 200.0
PLATE_Y = 380.0
PLATE_Z = 12.0
PLATE_CORNER_R = 28.0

PAD_X = -26.0
PAD_HALF_Y = 138.0
PAD_R = 48.0
PAD_Z = 6.0
PAD_HOLE_R = 1.7  # M3 clearance
PAD_HOLE_PCD = 56.0  # 4× M3 on pad (drill-through after print if needed)

TORSO_RING_W = 8.0
TORSO_RING_Z = 4.0
TORSO_RING_CLEAR = 0.6  # slip fit over torso OD

# Mid-height registration for bed-size torso split (Z = TORSO_SPLIT_Z)
TORSO_SPLIT_Z = 160.0
REG_PIN_R = 3.0
REG_PIN_H = 6.0
REG_HOLE_R = 3.2  # clearance over pin
REG_HOLE_DEPTH = 7.0

NECK_BOSS_R = 36.0
NECK_BOSS_Z = 14.0
NECK_HOLE_R = 18.0

NECK_OD = 70.0
NECK_ID = 40.0
NECK_H = 120.0
NECK_BASE_R = 38.0  # seats on boss
NECK_BASE_Z = 8.0


def v_sub(a, b):
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def v_cross(a, b):
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )


def v_norm(a):
    length = math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) or 1.0
    return (a[0] / length, a[1] / length, a[2] / length)


class Mesh:
    def __init__(self):
        self.tris: list[tuple] = []

    def add_tri(self, a, b, c):
        self.tris.append((a, b, c))

    def add_quad(self, a, b, c, d):
        self.add_tri(a, b, c)
        self.add_tri(a, c, d)

    def extend(self, other: "Mesh"):
        self.tris.extend(other.tris)


def cylinder(cx, cy, z0, z1, r, seg=64, top=True, bottom=True) -> Mesh:
    m = Mesh()
    ring0, ring1 = [], []
    for i in range(seg):
        a = 2 * math.pi * i / seg
        x = cx + r * math.cos(a)
        y = cy + r * math.sin(a)
        ring0.append((x, y, z0))
        ring1.append((x, y, z1))
    for i in range(seg):
        j = (i + 1) % seg
        m.add_quad(ring0[i], ring0[j], ring1[j], ring1[i])
    if bottom:
        c0 = (cx, cy, z0)
        for i in range(seg):
            j = (i + 1) % seg
            m.add_tri(c0, ring0[j], ring0[i])
    if top:
        c1 = (cx, cy, z1)
        for i in range(seg):
            j = (i + 1) % seg
            m.add_tri(c1, ring1[i], ring1[j])
    return m


def tube(cx, cy, z0, z1, r_out, r_in, seg=64) -> Mesh:
    """Annulus — true hollow tube (manifold)."""
    assert r_out > r_in > 0
    m = Mesh()
    out0, out1, in0, in1 = [], [], [], []
    for i in range(seg):
        a = 2 * math.pi * i / seg
        c, s = math.cos(a), math.sin(a)
        out0.append((cx + r_out * c, cy + r_out * s, z0))
        out1.append((cx + r_out * c, cy + r_out * s, z1))
        in0.append((cx + r_in * c, cy + r_in * s, z0))
        in1.append((cx + r_in * c, cy + r_in * s, z1))
    for i in range(seg):
        j = (i + 1) % seg
        m.add_quad(out0[i], out0[j], out1[j], out1[i])
        m.add_quad(in0[j], in0[i], in1[i], in1[j])
        m.add_quad(out0[i], in0[i], in0[j], out0[j])
        m.add_quad(out1[j], in1[j], in1[i], out1[i])
    return m


def flange_with_through_holes(
    r_out: float,
    r_in: float,
    z0: float,
    z1: float,
    holes: tuple[tuple[float, float], ...],
    hole_r: float,
    n_ang: int = 288,
    n_rad: int = 8,
) -> Mesh:
    """Flange annulus with real M3 through-holes (polar cells omit hole cores).

    Slicer unions overlapping cell solids. Hole walls are open cylinders so
    the bore prints clean for layer2 grid bolts.
    """
    assert r_out > r_in > 0
    m = Mesh()

    def pt(r: float, a: float, z: float):
        return (r * math.cos(a), r * math.sin(a), z)

    margin = hole_r + 0.15
    for i in range(n_ang):
        a0 = 2 * math.pi * i / n_ang
        a1 = 2 * math.pi * (i + 1) / n_ang
        for j in range(n_rad):
            ra = r_in + (r_out - r_in) * j / n_rad
            rb = r_in + (r_out - r_in) * (j + 1) / n_rad
            am = 0.5 * (a0 + a1)
            rm = 0.5 * (ra + rb)
            cx, cy = rm * math.cos(am), rm * math.sin(am)
            if any(math.hypot(cx - hx, cy - hy) < margin for hx, hy in holes):
                continue
            p00, p10 = pt(ra, a0, z0), pt(rb, a0, z0)
            p11, p01 = pt(rb, a1, z0), pt(ra, a1, z0)
            q00, q10 = pt(ra, a0, z1), pt(rb, a0, z1)
            q11, q01 = pt(rb, a1, z1), pt(ra, a1, z1)
            m.add_quad(p00, p10, p11, p01)
            m.add_quad(q00, q01, q11, q10)
            if j == 0:
                m.add_quad(p00, p01, q01, q00)
            if j == n_rad - 1:
                m.add_quad(p10, q10, q11, p11)
            m.add_quad(p00, q00, q10, p10)
            m.add_quad(p01, p11, q11, q01)

    # Clean vertical bore walls
    hseg = 20
    for hx, hy in holes:
        for i in range(hseg):
            a0 = 2 * math.pi * i / hseg
            a1 = 2 * math.pi * (i + 1) / hseg
            a = (hx + hole_r * math.cos(a0), hy + hole_r * math.sin(a0), z0)
            b = (hx + hole_r * math.cos(a1), hy + hole_r * math.sin(a1), z0)
            c = (hx + hole_r * math.cos(a1), hy + hole_r * math.sin(a1), z1)
            d = (hx + hole_r * math.cos(a0), hy + hole_r * math.sin(a0), z1)
            m.add_quad(a, d, c, b)
    return m


def box(x0, x1, y0, y1, z0, z1) -> Mesh:
    m = Mesh()
    p000, p001 = (x0, y0, z0), (x0, y0, z1)
    p010, p011 = (x0, y1, z0), (x0, y1, z1)
    p100, p101 = (x1, y0, z0), (x1, y0, z1)
    p110, p111 = (x1, y1, z0), (x1, y1, z1)
    m.add_quad(p000, p010, p011, p001)
    m.add_quad(p100, p101, p111, p110)
    m.add_quad(p000, p001, p101, p100)
    m.add_quad(p010, p110, p111, p011)
    m.add_quad(p000, p100, p110, p010)
    m.add_quad(p001, p011, p111, p101)
    return m


def rounded_plate(wx, wy, z0, z1, corner_r, seg=20) -> Mesh:
    """Convex rounded rect via hull-equivalent union of center + edges + corners.

    Overlapping solids are OK for FDM (slicer unions volume). Twin renders fine.
    """
    m = Mesh()
    hx, hy = wx / 2, wy / 2
    r = min(corner_r, hx - 1, hy - 1)
    m.extend(box(-hx + r, hx - r, -hy + r, hy - r, z0, z1))
    m.extend(box(-hx + r, hx - r, -hy, -hy + r, z0, z1))
    m.extend(box(-hx + r, hx - r, hy - r, hy, z0, z1))
    m.extend(box(-hx, -hx + r, -hy + r, hy - r, z0, z1))
    m.extend(box(hx - r, hx, -hy + r, hy - r, z0, z1))
    for cx, cy in ((-hx + r, -hy + r), (-hx + r, hy - r), (hx - r, -hy + r), (hx - r, hy - r)):
        m.extend(cylinder(cx, cy, z0, z1, r, seg=seg))
    return m


def write_stl(mesh: Mesh, path: Path, name: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    n = len(mesh.tris)
    buf = bytearray(80 + 4 + n * 50)
    buf[0:80] = name.encode("ascii", "ignore")[:80].ljust(80, b"\0")
    struct.pack_into("<I", buf, 80, n)
    off = 84
    for a, b, c in mesh.tris:
        nrm = v_norm(v_cross(v_sub(b, a), v_sub(c, a)))
        struct.pack_into("<fff", buf, off, *nrm)
        struct.pack_into("<fff", buf, off + 12, *a)
        struct.pack_into("<fff", buf, off + 24, *b)
        struct.pack_into("<fff", buf, off + 36, *c)
        struct.pack_into("<H", buf, off + 48, 0)
        off += 50
    path.write_bytes(buf)
    zs = [v[2] for t in mesh.tris for v in t]
    xs = [v[0] for t in mesh.tris for v in t]
    ys = [v[1] for t in mesh.tris for v in t]
    print(
        f"  {path.name:40s} tris={n:5d}  "
        f"X[{min(xs):.0f},{max(xs):.0f}] Y[{min(ys):.0f},{max(ys):.0f}] Z[{min(zs):.0f},{max(zs):.0f}]"
    )


def build_torso() -> Mesh:
    """Ø180 shell, Ø190 flange for LeKiwi layer2, top rim for deck ring."""
    m = Mesh()
    r_out = TORSO_OD / 2
    r_in = r_out - TORSO_WALL
    r_flange = TORSO_FLANGE_OD / 2
    # Main tube
    m.extend(tube(0, 0, TORSO_FLANGE_Z, TORSO_H - TORSO_RIM_Z, r_out, r_in, seg=72))
    # Bottom flange — through-holes on LeKiwi layer2 20 mm grid
    m.extend(
        flange_with_through_holes(
            r_flange,
            r_in,
            0.0,
            TORSO_FLANGE_Z,
            FLANGE_BOLTS_XY,
            FLANGE_HOLE_R,
        )
    )
    # Top rim (deck registration lands on this)
    m.extend(tube(0, 0, TORSO_H - TORSO_RIM_Z, TORSO_H, r_out + 2, r_in, seg=72))
    return m


def build_deck() -> Mesh:
    m = Mesh()
    m.extend(rounded_plate(PLATE_X, PLATE_Y, 0.0, PLATE_Z, PLATE_CORNER_R))

    # Underside registration ring — slips over torso top rim
    r_out = TORSO_OD / 2 + TORSO_RING_CLEAR + 3
    r_in = TORSO_OD / 2 + TORSO_RING_CLEAR
    m.extend(tube(0, 0, -TORSO_RING_Z, 0.0, r_out, r_in, seg=72))

    # Dual SO-101 pads + 4× M3 drill guides each
    for sign in (-1, 1):
        cy = sign * PAD_HALF_Y
        m.extend(cylinder(PAD_X, cy, PLATE_Z, PLATE_Z + PAD_Z, PAD_R, seg=48))
        # lip ring
        m.extend(
            tube(
                PAD_X, cy,
                PLATE_Z + PAD_Z, PLATE_Z + PAD_Z + 1.2,
                PAD_R, PAD_R - 3.5, seg=48,
            )
        )
        for i in range(4):
            a = 2 * math.pi * i / 4 + math.pi / 4
            hx = PAD_X + (PAD_HOLE_PCD / 2) * math.cos(a)
            hy = cy + (PAD_HOLE_PCD / 2) * math.sin(a)
            m.extend(
                tube(
                    hx, hy,
                    PLATE_Z + PAD_Z - 0.5, PLATE_Z + PAD_Z,
                    2.2, PAD_HOLE_R, seg=12,
                )
            )

    # Neck boss
    m.extend(tube(0, 0, PLATE_Z, PLATE_Z + NECK_BOSS_Z, NECK_BOSS_R, NECK_HOLE_R, seg=48))

    # Stiffening ribs (inside plate volume — visual + print strength)
    m.extend(box(-5, 5, -PAD_HALF_Y + 20, PAD_HALF_Y - 20, 1.0, PLATE_Z - 1.0))
    m.extend(box(PAD_X - 35, 40, -5, 5, 1.0, PLATE_Z - 1.0))
    return m


def build_neck() -> Mesh:
    """Straight printable neck that seats on the deck boss."""
    m = Mesh()
    # Base collar over boss
    m.extend(tube(0, 0, 0.0, NECK_BASE_Z, NECK_BASE_R, NECK_HOLE_R + 1, seg=48))
    # Main tube
    m.extend(tube(0, 0, NECK_BASE_Z, NECK_H, NECK_OD / 2, NECK_ID / 2, seg=48))
    # Top cam flange
    m.extend(tube(0, 0, NECK_H - 6, NECK_H, NECK_OD / 2 + 6, NECK_ID / 2, seg=48))
    # 4× M3 drill guides on top flange
    for i in range(4):
        a = 2 * math.pi * i / 4 + math.pi / 4
        hx = 28 * math.cos(a)
        hy = 28 * math.sin(a)
        m.extend(tube(hx, hy, NECK_H - 1.0, NECK_H, 2.2, PAD_HOLE_R, seg=12))
    return m


def emit(mesh: Mesh, root: Path, filename: str, name: str):
    for folder in (
        root / "public/assets/xlerobot/hardware",
        root / "print/xlerobot/hardware",
    ):
        write_stl(mesh, folder / filename, name)


def main():
    root = Path(__file__).resolve().parents[1]
    print("HouseHand structure kit")
    emit(build_torso(), root, "HouseHand_torso.stl", "HouseHand_torso")
    emit(build_deck(), root, "HouseHand_shoulder_deck.stl", "HouseHand_shoulder_deck")
    emit(build_neck(), root, "HouseHand_neck.stl", "HouseHand_neck")
    # Keep legacy filename as copy of torso for old doc links
    src = root / "public/assets/xlerobot/hardware/HouseHand_torso.stl"
    for folder in (
        root / "public/assets/xlerobot/hardware",
        root / "print/xlerobot/hardware",
    ):
        dst = folder / "torso_shell.stl"
        dst.write_bytes(src.read_bytes())
        print(f"  {dst.name:40s} (alias of HouseHand_torso.stl)")
    print("pad tops at Z =", TORSO_RING_Z + PLATE_Z + PAD_Z, "(after footing ring→0)")
    print("done.")


if __name__ == "__main__":
    main()
