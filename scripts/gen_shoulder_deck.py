#!/usr/bin/env python3
"""Generate a solid, manifold printable shoulder deck for HouseHand.

Sits on the printable torso shell and carries dual SO-101 bases at the twin
mount pads (−26, ±138) mm plus a center neck boss.

Outputs binary STLs under public/ + print/.
"""

from __future__ import annotations

import math
import struct
from pathlib import Path

# --- print-frame geometry (mm), Z-up ---
PLATE_X = 200.0
PLATE_Y = 380.0
PLATE_Z = 12.0
PLATE_CORNER_R = 28.0

# Match ImportedRobots mount constants
PAD_X = -26.0
PAD_HALF_Y = 138.0
PAD_R = 48.0  # supports SO-101 base (~111×72) with margin
PAD_Z = 6.0

# Torso mate: widened shell OD ≈ 216 mm
TORSO_OD = 216.0
TORSO_RING_W = 10.0
TORSO_RING_Z = 4.0

# Neck boss
NECK_BOSS_R = 36.0
NECK_BOSS_Z = 14.0
NECK_HOLE_R = 18.0


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


def cylinder(cx, cy, z0, z1, r, seg=48, top=True, bottom=True) -> Mesh:
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


def tube(cx, cy, z0, z1, r_out, r_in, seg=48) -> Mesh:
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


def rounded_plate(wx, wy, z0, z1, corner_r, seg=16) -> Mesh:
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


def write_stl(mesh: Mesh, path: Path, name: str = "HouseHand_shoulder_deck"):
    path.parent.mkdir(parents=True, exist_ok=True)
    n = len(mesh.tris)
    buf = bytearray(80 + 4 + n * 50)
    header = f"{name}".encode("ascii", "ignore")[:80]
    buf[0:80] = header.ljust(80, b"\0")
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
    print(f"wrote {path}  tris={n}  bytes={path.stat().st_size}")


def build_deck() -> Mesh:
    m = Mesh()
    m.extend(rounded_plate(PLATE_X, PLATE_Y, 0.0, PLATE_Z, PLATE_CORNER_R))

    r_out = TORSO_OD / 2 + 2
    r_in = TORSO_OD / 2 - TORSO_RING_W
    m.extend(tube(0, 0, -TORSO_RING_Z, 0.0, r_out, max(8.0, r_in), seg=64))

    for sign in (-1, 1):
        m.extend(cylinder(PAD_X, sign * PAD_HALF_Y, PLATE_Z, PLATE_Z + PAD_Z, PAD_R, seg=48))
        m.extend(
            tube(
                PAD_X,
                sign * PAD_HALF_Y,
                PLATE_Z + PAD_Z,
                PLATE_Z + PAD_Z + 1.2,
                PAD_R,
                PAD_R - 4.0,
                seg=48,
            )
        )

    m.extend(tube(0, 0, PLATE_Z, PLATE_Z + NECK_BOSS_Z, NECK_BOSS_R, NECK_HOLE_R, seg=48))
    m.extend(box(-4, 4, -PAD_HALF_Y + 10, PAD_HALF_Y - 10, 0.0, PLATE_Z))
    m.extend(box(PAD_X - 40, PAD_X + 40, -4, 4, 0.0, PLATE_Z))
    return m


def main():
    root = Path(__file__).resolve().parents[1]
    mesh = build_deck()
    outs = [
        root / "public/assets/xlerobot/hardware/HouseHand_shoulder_deck.stl",
        root / "print/xlerobot/hardware/HouseHand_shoulder_deck.stl",
    ]
    for p in outs:
        write_stl(mesh, p)

    xs = [v[0] for t in mesh.tris for v in t]
    ys = [v[1] for t in mesh.tris for v in t]
    zs = [v[2] for t in mesh.tris for v in t]
    print(
        f"bounds X[{min(xs):.1f},{max(xs):.1f}] "
        f"Y[{min(ys):.1f},{max(ys):.1f}] "
        f"Z[{min(zs):.1f},{max(zs):.1f}]"
    )
    print(f"pads at ({PAD_X}, ±{PAD_HALF_Y}) top Z={PLATE_Z + PAD_Z + 1.2}")


if __name__ == "__main__":
    main()
