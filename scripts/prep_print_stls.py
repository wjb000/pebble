#!/usr/bin/env python3
"""Prep kit STLs for printing: foot to bed origin + bed-size splits + registration.

Run after scripts/gen_structure_kit.py (or anytime hardware STLs change).

1. Foots HouseHand hardware STLs (min-Z = 0, XY centered). Twin already foots
   at runtime via footGeometry — files stay slicer-friendly.
2. Plane-clips oversized parts for common ~220 mm beds and adds registration
   pins/holes on the cut faces:
     HouseHand_torso_{bottom,top}.stl     cut Z=160 → ~190×190×160 + pins
     HouseHand_shoulder_deck_{L,R}.stl    cut Y=0   → ~200×190×30 + pins
3. Foots print/lekiwi/*.stl and print/SO101/Individual/*.stl in Z only
   (does NOT touch public/ URDF meshes — twin poses depend on those frames).

Writes identical HouseHand bytes to public/assets + print/xlerobot/hardware.
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
    "HouseHand_deck_splice.stl",
    "torso_shell.stl",
]

TORSO_SPLIT_Z = 160.0
TORSO_WALL_MID_R = 87.0  # (90 + 84) / 2 with 6 mm wall
REG_PIN_R = 3.0
REG_PIN_H = 6.0
REG_HOLE_R = 3.25
REG_HOLE_DEPTH = 7.0
DECK_REG_X = (-60.0, -20.0, 20.0, 60.0)


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


def foot_z_only(tris):
    """Drop to Z=0 without recentering XY (preserve bolt/assembly frames)."""
    *_, z0, _ = bbox(tris)
    return translate(tris, 0.0, 0.0, -z0)


def lerp(a, b, t):
    return (
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
    )


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


def cylinder_tris(cx, cy, cz0, cz1, r, seg=16):
    tris = []
    ring0, ring1 = [], []
    for i in range(seg):
        a = 2 * math.pi * i / seg
        x, y = cx + r * math.cos(a), cy + r * math.sin(a)
        ring0.append((x, y, cz0))
        ring1.append((x, y, cz1))
    for i in range(seg):
        j = (i + 1) % seg
        tris.append([ring0[i], ring0[j], ring1[j]])
        tris.append([ring0[i], ring1[j], ring1[i]])
    c0, c1 = (cx, cy, cz0), (cx, cy, cz1)
    for i in range(seg):
        tris.append([c0, ring0[(i + 1) % seg], ring0[i]])
        tris.append([c1, ring1[i], ring1[(i + 1) % seg]])
    return tris


def hole_wall_tris(cx, cy, cz0, cz1, r, seg=16):
    tris = []
    for i in range(seg):
        a0 = 2 * math.pi * i / seg
        a1 = 2 * math.pi * (i + 1) / seg
        a = (cx + r * math.cos(a0), cy + r * math.sin(a0), cz0)
        b = (cx + r * math.cos(a1), cy + r * math.sin(a1), cz0)
        c = (cx + r * math.cos(a1), cy + r * math.sin(a1), cz1)
        d = (cx + r * math.cos(a0), cy + r * math.sin(a0), cz1)
        tris.append([a, d, c])
        tris.append([a, c, b])
    return tris


def torso_reg_xy():
    pts = []
    for i in range(4):
        a = math.pi / 4 + i * math.pi / 2
        pts.append(
            (TORSO_WALL_MID_R * math.cos(a), TORSO_WALL_MID_R * math.sin(a))
        )
    return pts


def add_torso_registration(bot, top):
    bot = list(bot)
    top = list(top)
    for hx, hy in torso_reg_xy():
        bot.extend(
            cylinder_tris(
                hx, hy, TORSO_SPLIT_Z, TORSO_SPLIT_Z + REG_PIN_H, REG_PIN_R
            )
        )
        top.extend(
            hole_wall_tris(
                hx,
                hy,
                TORSO_SPLIT_Z,
                TORSO_SPLIT_Z + REG_HOLE_DEPTH,
                REG_HOLE_R,
            )
        )
    return bot, top


def y_cylinder(x, y0, length, z, r, seg=12):
    tris = []
    ring0, ring1 = [], []
    for i in range(seg):
        a = 2 * math.pi * i / seg
        dz, dx = r * math.cos(a), r * math.sin(a)
        ring0.append((x + dx, y0, z + dz))
        ring1.append((x + dx, y0 + length, z + dz))
    for i in range(seg):
        j = (i + 1) % seg
        tris.append([ring0[i], ring0[j], ring1[j]])
        tris.append([ring0[i], ring1[j], ring1[i]])
    c0, c1 = (x, y0, z), (x, y0 + length, z)
    for i in range(seg):
        tris.append([c0, ring0[(i + 1) % seg], ring0[i]])
        tris.append([c1, ring1[i], ring1[(i + 1) % seg]])
    return tris


def y_hole_wall(x, y0, depth, z, r, seg=12):
    tris = []
    for i in range(seg):
        a0 = 2 * math.pi * i / seg
        a1 = 2 * math.pi * (i + 1) / seg
        dx0, dz0 = r * math.sin(a0), r * math.cos(a0)
        dx1, dz1 = r * math.sin(a1), r * math.cos(a1)
        a = (x + dx0, y0, z + dz0)
        b = (x + dx1, y0, z + dz1)
        c = (x + dx1, y0 + depth, z + dz1)
        d = (x + dx0, y0 + depth, z + dz0)
        tris.append([a, d, c])
        tris.append([a, c, b])
    return tris


def add_deck_registration(right, left):
    right = list(right)
    left = list(left)
    zr = 6.0  # mid plate thickness
    for x in DECK_REG_X:
        right.extend(y_cylinder(x, 0.0, REG_PIN_H, zr, REG_PIN_R))
        left.extend(y_hole_wall(x, 0.0, REG_HOLE_DEPTH, zr, REG_HOLE_R))
    return right, left


def foot_on_flange(tris, z_tol=1.0):
    """Center XY on the bottom-face centroid (neck mating flange), then Z-foot."""
    x0, x1, y0, y1, z0, _ = bbox(tris)
    sx = sy = n = 0
    for t in tris:
        for v in t:
            if v[2] <= z0 + z_tol:
                sx += v[0]
                sy += v[1]
                n += 1
    if n < 8:
        return foot(tris)
    return translate(tris, -sx / n, -sy / n, -z0)


def emit_hardware(name: str, tris: list):
    # Head mount is asymmetric — bbox footing leaves the neck flange ~13 mm off-axis.
    if name == "HouseHand_head_mount.stl":
        tris = foot_on_flange(tris)
    else:
        tris = foot(tris)
    x0, x1, y0, y1, z0, z1 = bbox(tris)
    for folder in OUT_DIRS:
        write_stl(folder / name, tris, name)
    print(
        f"  {name:40s} {x1 - x0:.0f}×{y1 - y0:.0f}×{z1 - z0:.0f} mm  "
        f"Z[{z0:.1f},{z1:.1f}]  tris={len(tris)}"
    )


def foot_print_tree(folder: Path):
    files = sorted(folder.glob("*.stl"))
    if not files:
        print(f"  (no STLs in {folder})")
        return
    for path in files:
        tris = load_stl(path)
        before = bbox(tris)
        if abs(before[4]) < 0.05 and before[4] >= -0.01:
            print(f"  {path.relative_to(ROOT)} already Z-footed")
            continue
        tris = foot_z_only(tris)
        write_stl(path, tris, path.name)
        after = bbox(tris)
        print(
            f"  {path.relative_to(ROOT)}  "
            f"Z[{before[4]:.1f}→{after[4]:.1f}]  kept XY"
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
        emit_hardware(name, tris)
        if abs(before[4]) > 1 or abs((before[0] + before[1]) / 2) > 20:
            print(
                f"    recentered (was Z[{before[4]:.1f},{before[5]:.1f}] "
                f"ctr≈{(before[0] + before[1]) / 2:.0f},"
                f"{(before[2] + before[3]) / 2:.0f})"
            )

    print("Plane-clipped bed-size splits + registration…")
    if "HouseHand_torso.stl" in foote:
        bot, top = split_mesh(
            foote["HouseHand_torso.stl"], axis=2, cut=TORSO_SPLIT_Z
        )
        bot, top = add_torso_registration(bot, top)
        emit_hardware("HouseHand_torso_bottom.stl", bot)
        emit_hardware("HouseHand_torso_top.stl", top)
    if "HouseHand_shoulder_deck.stl" in foote:
        right, left = split_mesh(
            foote["HouseHand_shoulder_deck.stl"], axis=1, cut=0.0
        )
        right, left = add_deck_registration(right, left)
        emit_hardware("HouseHand_shoulder_deck_R.stl", right)
        emit_hardware("HouseHand_shoulder_deck_L.stl", left)

    print("Footing LeKiwi print STLs (Z only)…")
    foot_print_tree(ROOT / "print/lekiwi")

    print("Footing SO-101 Individual print STLs (Z only)…")
    foot_print_tree(ROOT / "print/SO101/Individual")

    print("done.")


if __name__ == "__main__":
    main()
