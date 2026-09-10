#!/usr/bin/env python3
"""Check that bolt-hole centers are empty in generated HouseHand STLs.

Run after gen_structure_kit.py (+ prep_print_stls.py). Exit 1 on failure.
"""
from __future__ import annotations

import math
import struct
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from gen_structure_kit import (  # noqa: E402
    DECK_TORSO_BOLTS,
    FLANGE_BOLTS_XY,
    HEAD_CAM_BOLTS_YZ,
    HEAD_CAM_X0,
    HEAD_CAM_X1,
    HEAD_LENS_Z,
    M3_R,
    NECK_BOLTS,
    PAD_HOLE_R,
    SPLICE_BOLTS,
    SPLIT_BOLTS,
    pad_bolts,
    PAD_HALF_Y,
)


def load_verts(path: Path):
    data = path.read_bytes()
    n = struct.unpack_from("<I", data, 80)[0]
    verts = []
    off = 84
    for _ in range(n):
        vals = struct.unpack_from("<12f", data, off)
        verts.extend((vals[3:6], vals[6:9], vals[9:12]))
        off += 50
    return verts


def empty_xy(verts, holes, z, r, label) -> int:
    bad = 0
    for hx, hy in holes:
        n = sum(1 for v in verts if abs(v[2] - z) < 2.5 and math.hypot(v[0] - hx, v[1] - hy) < r)
        ok = n == 0
        print(f"  {'OK' if ok else 'FAIL'} {label:28s} ({hx:7.2f},{hy:7.2f}) @z≈{z:.0f}  verts={n}")
        if not ok:
            bad += 1
    return bad


def empty_yz(verts, holes, x, r, label) -> int:
    bad = 0
    for hy, hz in holes:
        n = sum(
            1
            for v in verts
            if abs(v[0] - x) < 2.5 and math.hypot(v[1] - hy, v[2] - hz) < r
        )
        ok = n == 0
        print(f"  {'OK' if ok else 'FAIL'} {label:28s} (y={hy:7.2f},z={hz:7.2f}) @x≈{x:.0f}  verts={n}")
        if not ok:
            bad += 1
    return bad


def main() -> int:
    hw = ROOT / "public/assets/xlerobot/hardware"
    bad = 0
    print("torso flange / split / rim")
    torso = load_verts(hw / "HouseHand_torso.stl")
    bad += empty_xy(torso, FLANGE_BOLTS_XY, 5.0, 1.2, "flange M3")
    bad += empty_xy(torso, SPLIT_BOLTS, 160.0, 1.2, "split M3")
    bad += empty_xy(torso, DECK_TORSO_BOLTS, 317.0, 1.2, "rim M3")

    print("deck pads / neck / splice")
    deck = load_verts(hw / "HouseHand_shoulder_deck.stl")
    pad_holes = pad_bolts(-PAD_HALF_Y) + pad_bolts(PAD_HALF_Y)
    bad += empty_xy(deck, pad_holes, 10.0, 1.6, "SO-101 M4")
    bad += empty_xy(deck, NECK_BOLTS, 18.0, 1.2, "neck boss M3")
    bad += empty_xy(deck, DECK_TORSO_BOLTS, 6.0, 1.2, "deck→torso M3")
    bad += empty_xy(deck, SPLICE_BOLTS, 6.0, 1.2, "splice M3")

    print("neck")
    neck = load_verts(hw / "HouseHand_neck.stl")
    bad += empty_xy(neck, NECK_BOLTS, 4.0, 1.2, "neck collar M3")
    bad += empty_xy(neck, NECK_BOLTS, 117.0, 1.2, "neck top M3")

    print("head")
    head = load_verts(hw / "HouseHand_head_mount.stl")
    bad += empty_xy(head, NECK_BOLTS, 4.0, 1.2, "head flange M3")
    xmid = 0.5 * (HEAD_CAM_X0 + HEAD_CAM_X1)
    bad += empty_yz(head, HEAD_CAM_BOLTS_YZ, xmid, 0.7, "head cam M2")
    bad += empty_yz(head, ((0.0, HEAD_LENS_Z),), xmid, HEAD_LENS_Z * 0 + 6.0, "head lens")

    print("splice bar")
    spl = load_verts(hw / "HouseHand_deck_splice.stl")
    bad += empty_xy(spl, SPLICE_BOLTS, 2.5, 1.2, "splice bar M3")

    print()
    if bad:
        print(f"FAILED {bad} hole-center checks")
        return 1
    print("All hole centers empty.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
