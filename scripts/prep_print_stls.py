#!/usr/bin/env python3
"""Prep HouseHand STLs for printing: foot to bed origin + bed-size splits.

Run after scripts/gen_structure_kit.py (or anytime hardware STLs change).

- Foots every hardware STL so min-Z = 0 and XY is centered (twin already does
  this at runtime via footGeometry — files stay slicer-friendly).
- Plane-clips oversized parts for common ~220 mm beds:
    HouseHand_torso_{bottom,top}.stl        cut Z=160 → 190×190×160 each
    HouseHand_shoulder_deck_{L,R}.stl       cut Y=0   → 200×190×30 each

Writes identical bytes to public/assets + print/xlerobot/hardware.
"""

from __future__ import annotations

import math
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIRS = [
    ROOT / "public/assets/xlerobot/hardware",
    ROOT / "print/xlerobot/hardware",
]
HARDWARE = [
    "HouseHand_torso.stl",
    "HouseHand_shoulder_deck.stl",
    "HouseHand_neck.stl",
    "HouseHand_head_mount.stl",
    "HouseHand_head_camera.stl",
    "torso_shell.stl",
]


def load_stl(path: Path):
    data = path.read_bytes()
    n = struct.unpack_from("<I", data, 80)[0]
    tris = []
    off = 84
    for _ in range(n):
        vals = struct.unpack_from("<12f", data, off)
        tris.append([list(vals[3:6]), list(vals[6:9]), list(vals[9:12])])
        off += 50
    return tris


def write_stl(path: Path, tris: list, name: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    buf = bytearray(80 + 4 + len(tris) * 50)
    buf[0:80] = name.encode("ascii", "ignore")[:80].ljust(80, b"\0")
    struct.pack_into("<I", buf, 80, len(tris))
    off = 84
    for a, b, c in tris:
        ux, uy, uz = b[0] - a[0], b[1] - a[1], b[2] - a[2]
        vx, vy, vz = c[0] - a[0], c[1] - a[1], c[2] - a[2]
        nx, ny, nz = uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx
        ln = math.sqrt(nx * nx + ny * ny + nz * nz) or 1.0
        struct.pack_into("<fff", buf, off, nx / ln, ny / ln, nz / ln)
        struct.pack_into("<fff", buf, off + 12, *a)
        struct.pack_into("<fff", buf, off + 24, *b)
        struct.pack_into("<fff", buf, off + 36, *c)
        struct.pack_into("<H", buf, off + 48, 0)
        off += 50
    path.write_bytes(buf)


def bbox(tris):
    xs = [v[0] for t in tris for v in t]
    ys = [v[1] for t in tris for v in t]
    zs = [v[2] for t in tris for v in t]
    return min(xs), max(xs), min(ys), max(ys), min(zs), max(zs)


def translate(tris, dx, dy, dz):
    return [[(v[0] + dx, v[1] + dy, v[2] + dz) for v in t] for t in tris]


def foot(tris):
    x0, x1, y0, y1, z0, _ = bbox(tris)
    return translate(tris, -(x0 + x1) * 0.5, -(y0 + y1) * 0.5, -z0)


def lerp(a, b, t):
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t)


def clip_tri(tri, axis: int, cut: float, keep_low: bool):
    def inside(p):
        return (p[axis] <= cut) if keep_low else (p[axis] >= cut)

    def intersect(p, q):
        dp = q[axis] - p[axis]
        if abs(dp) < 1e-12:
            return tuple(p)
        return lerp(p, q, (cut - p[axis]) / dp)

    out = []
    for i in range(3):
        cur, prev = tri[i], tri[i - 1]
        cin, pin = inside(cur), inside(prev)
        if cin:
            if not pin:
                out.append(intersect(prev, cur))
            out.append(tuple(cur))
        elif pin:
            out.append(intersect(prev, cur))
    if len(out) < 3:
        return []
    return [[out[0], out[i], out[i + 1]] for i in range(1, len(out) - 1)]


def split_mesh(tris, axis: int, cut: float):
    lo, hi = [], []
    for t in tris:
        lo.extend(clip_tri(t, axis, cut, True))
        hi.extend(clip_tri(t, axis, cut, False))
    return lo, hi


def emit(name: str, tris: list):
    tris = foot(tris)
    x0, x1, y0, y1, z0, z1 = bbox(tris)
    for folder in OUT_DIRS:
        write_stl(folder / name, tris, name)
    print(
        f"  {name:40s} {x1 - x0:.0f}×{y1 - y0:.0f}×{z1 - z0:.0f} mm  "
        f"Z[{z0:.1f},{z1:.1f}]  tris={len(tris)}"
    )


def main():
    src = OUT_DIRS[1]
    print("Footing hardware STLs to print origin…")
    foote: dict[str, list] = {}
    for name in HARDWARE:
        path = src / name
        if not path.exists():
            print(f"  skip missing {name}")
            continue
        before = bbox(load_stl(path))
        tris = foot(load_stl(path))
        foote[name] = tris
        emit(name, tris)
        if abs(before[4]) > 1 or abs((before[0] + before[1]) / 2) > 20:
            print(
                f"    recentered (was Z[{before[4]:.1f},{before[5]:.1f}] "
                f"ctr≈{(before[0] + before[1]) / 2:.0f},{(before[4] + before[5]) / 2:.0f})"
            )

    print("Plane-clipped bed-size splits…")
    if "HouseHand_torso.stl" in foote:
        bot, top = split_mesh(foote["HouseHand_torso.stl"], axis=2, cut=160.0)
        emit("HouseHand_torso_bottom.stl", bot)
        emit("HouseHand_torso_top.stl", top)
    if "HouseHand_shoulder_deck.stl" in foote:
        right, left = split_mesh(foote["HouseHand_shoulder_deck.stl"], axis=1, cut=0.0)
        emit("HouseHand_shoulder_deck_R.stl", right)
        emit("HouseHand_shoulder_deck_L.stl", left)
    print("done.")


if __name__ == "__main__":
    main()
