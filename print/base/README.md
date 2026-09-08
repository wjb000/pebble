# Base prints — orientation + mates (poka-yoke)

**v3 sim uses BOM envelopes** (400×450 mm mecanum deck) — not these chassis STLs.

Upstream [perceptron_bot](https://github.com/PedroS235/perceptron_bot) (MIT) remains here as a **legacy print archive**. See `NOTICE.md`.

| STL | Bed | Mate |
|-----|-----|------|
| `lower_plate.stl` | Largest face down | Walls / middle above |
| `middle_plate_raspberry.stl` | Pi nest **up** | Compute nest faces up |
| `top_plate.stl` | Flat (+ supports if upstream) | Legacy extrusion foot |
| `*_wall.stl` | As exported | Between plates; front/back per CAD |
| `wheel_frame` + `wheel_left/right` | Per upstream caster note | Unused on v3 omni (no casters) |

**v3 bought:** 400×450 deck, 4× mecanum, 12V pack, bumper foam.
