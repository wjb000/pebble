# Lift prints — orientation + mates (poka-yoke)

Upstream only (Prusa GPL-2.0 + SO-ARM 4040 Apache-2.0). See `NOTICE.md`.

**Bought — do not print:** 2040 extrusion column, T8 lead screw. Twin shows them as metal envelopes.

## Orientation

| STL | Bed | Mate |
|-----|-----|------|
| `z-axis-bottom.stl` | Motor flange accessible | Column **base**; bore on `SCREW_AXIS_X` |
| `z-axis-top.stl` | Bore vertical | Column **top**; same axis |
| `carriage_x-end-motor.stl` | Nut bore free | Rides T8; 4040 faces **out** |
| `4040_base_mount.stl` | Flat; **print 2× — mirror one** | L = +X **blue**; R = −X **orange** |
| `z-screw-cover.stl` | Flat | Screw top cap |

Mark `L`/`R` with marker or paint. Wrong side = arm bus chaos.
