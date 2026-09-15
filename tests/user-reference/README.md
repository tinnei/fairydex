# User sunflower screenshot regression

Private development fixture, not a licensed public reference dataset.
Source: user-provided screenshot `df4b56e3-a1c6-40e4-a85e-ebb0cfcf3526.png`, 2048 × 887, supplied 2026-09-15.
Transformation: crop only the original-photo panel at [140,181,395,481), convert to RGBA bytes, 255 × 300. No labels, recolouring or sharpening. Original uploaded JPEG was not available; screenshot resampling affects pixels.

Before engine 0.14, the screenshot-derived photo produced null centre/ray measurements and sunflower was filtered out. This is a development regression used during tuning, not held-out accuracy evidence. Lower rows y >= 225 contain leaf/stem/context and must not become flower pixels. Centre and ray boundaries are provisional, not manual botanical annotations. The public worker does not serve this tests directory.
