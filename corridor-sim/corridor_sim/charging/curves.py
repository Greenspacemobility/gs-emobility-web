"""SOC-dependent charging curves.

A :class:`ChargingCurve` maps state-of-charge (0..1) to the fraction of the
vehicle's maximum charging power it will accept at that SOC. Curves are
piecewise-linear over user-supplied breakpoints and can be loaded from CSV
(``soc,fraction`` columns) so measured curves can replace the defaults.
"""
from __future__ import annotations

import csv
from pathlib import Path
from typing import List, Sequence, Tuple

# Conservative generic curve: full power to 20%, near-max to 60%,
# tapering above 80% -- matches the shape of published HD charging data.
DEFAULT_CURVE_POINTS: List[Tuple[float, float]] = [
    (0.00, 1.00), (0.20, 1.00), (0.60, 0.92),
    (0.80, 0.60), (0.90, 0.35), (1.00, 0.12),
]


class ChargingCurve:
    """Piecewise-linear SOC -> power-fraction curve."""

    def __init__(self, points: Sequence[Tuple[float, float]]):
        pts = sorted((float(s), float(f)) for s, f in points)
        if len(pts) < 2:
            raise ValueError("A charging curve needs at least two points")
        if not (0.0 <= pts[0][0] and pts[-1][0] <= 1.0):
            raise ValueError("Curve SOC breakpoints must lie in [0, 1]")
        for _, frac in pts:
            if not 0.0 <= frac <= 1.0:
                raise ValueError("Curve power fractions must lie in [0, 1]")
        self.points: List[Tuple[float, float]] = pts

    def fraction_at(self, soc: float) -> float:
        """Interpolated power fraction at ``soc`` (clamped to curve ends)."""
        pts = self.points
        if soc <= pts[0][0]:
            return pts[0][1]
        if soc >= pts[-1][0]:
            return pts[-1][1]
        for (s0, f0), (s1, f1) in zip(pts, pts[1:]):
            if s0 <= soc <= s1:
                if s1 == s0:
                    return f1
                t = (soc - s0) / (s1 - s0)
                return f0 + t * (f1 - f0)
        return pts[-1][1]  # unreachable, defensive

    @classmethod
    def from_csv(cls, path: "str | Path") -> "ChargingCurve":
        """Load a curve from a CSV file with ``soc,fraction`` columns.

        SOC may be given as 0..1 or 0..100 (auto-detected).
        """
        rows: List[Tuple[float, float]] = []
        with open(path, newline="") as fh:
            reader = csv.reader(fh)
            for row in reader:
                if not row or not row[0].strip():
                    continue
                try:
                    soc, frac = float(row[0]), float(row[1])
                except ValueError:
                    continue  # header row
                rows.append((soc, frac))
        if rows and max(s for s, _ in rows) > 1.5:  # percent scale
            rows = [(s / 100.0, f) for s, f in rows]
        return cls(rows)

    def to_points(self) -> List[Tuple[float, float]]:
        return list(self.points)
