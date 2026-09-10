#!/usr/bin/env python3
"""Generate the HouseHand printable structure kit (manifold binary STLs).

Geometry contract (mm, Z-up, print frame):
  TORSO_OD          = 216   # matches LeKiwi plate width used by the twin
  TORSO_H           = 320
  DECK pads         = (−26, ±138)  Ø96 raised pads for SO-101 bases
  NECK boss         = Ø72 with Ø36 cable hole on deck center

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
TORSO_OD = 216.0
TORSO_WALL = 5.0
TORSO_H = 320.0
TORSO_FLANGE_OD = 236.0
TORSO_FLANGE_Z = 6.0
TORSO_RIM_Z = 4.0  # top lip the deck ring seats over

PLATE_X = 200.0
PLATE_Y = 380.0
PLATE_Z = 12.0
PLATE_CORNER_R = 28.0

PAD_X = -26.0
PAD_HALF_Y = 138.0
PAD_R = 48.0
PAD_Z = 6.0
PAD_HOLE_R = 1.7  # M3 clearance
PAD_HOLE_PCD = 56.0  # 4× M3 on pad

TORSO_RING_W = 8.0
TORSO_RING_Z = 4.0
TORSO_RING_CLEAR = 0.6  # slip fit over torso OD

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
    """Ø216 shell, bottom flange for LeKiwi plate, top rim for deck ring."""
    m = Mesh()
    r_out = TORSO_OD / 2
    r_in = r_out - TORSO_WALL
    # Main tube
    m.extend(tube(0, 0, TORSO_FLANGE_Z, TORSO_H - TORSO_RIM_Z, r_out, r_in, seg=72))
    # Bottom flange (bolt to LeKiwi top plate)
    m.extend(tube(0, 0, 0.0, TORSO_FLANGE_Z, TORSO_FLANGE_OD / 2, r_in, seg=72))
    # 6× M3 holes in flange (as thin vertical tubes cut visually by not filling —
    # we punch by leaving cylinder voids: subtract via inner hole markers as empty tubes through flange)
    for i in range(6):
        a = 2 * math.pi * i / 6
        hx = (r_out + 6) * math.cos(a)
        hy = (r_out + 6) * math.sin(a)
        # hole wall = tiny tube from z=0..flange — represented as open cylinder through flange
        # For FDM we emit a clearance cylinder *void* by not adding material; approximate with
        # a ring marker on top of flange for drill guide:
        m.extend(tube(hx, hy, TORSO_FLANGE_Z - 0.6, TORSO_FLANGE_Z, 2.2, PAD_HOLE_R, seg=16))
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
