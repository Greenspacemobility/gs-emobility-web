"""Corridor route model.

A :class:`Route` is an ordered list of :class:`RouteSegment` between named
nodes. Nodes are identified by name and mile marker (miles from the southern
terminus). Charging sites reference nodes by name. The route is fully user
editable; :func:`default_i35_route` builds the launch Laredo <-> Dallas
corridor.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple


@dataclass
class RouteSegment:
    """One directed-agnostic stretch of highway between two named nodes.

    Attributes
    ----------
    from_node / to_node:
        Node names (south -> north order in the canonical route list).
    distance_miles:
        Segment length.
    avg_speed_mph:
        Free-flow average speed on the segment; ``None`` uses the truck's
        own average speed.
    elevation_gain_ft:
        Reserved for a future grade-aware consumption model.
    weather_multiplier / traffic_multiplier:
        Local multipliers on consumption and travel time respectively;
        they compound with the scenario-level global multipliers.
    """

    from_node: str
    to_node: str
    distance_miles: float
    avg_speed_mph: Optional[float] = None
    elevation_gain_ft: float = 0.0
    weather_multiplier: float = 1.0
    traffic_multiplier: float = 1.0

    def to_dict(self) -> Dict[str, object]:
        return {
            "from_node": self.from_node,
            "to_node": self.to_node,
            "distance_miles": self.distance_miles,
            "avg_speed_mph": self.avg_speed_mph,
            "elevation_gain_ft": self.elevation_gain_ft,
            "weather_multiplier": self.weather_multiplier,
            "traffic_multiplier": self.traffic_multiplier,
        }

    @classmethod
    def from_dict(cls, d: Dict[str, object]) -> "RouteSegment":
        return cls(
            from_node=str(d["from_node"]),
            to_node=str(d["to_node"]),
            distance_miles=float(d["distance_miles"]),  # type: ignore[arg-type]
            avg_speed_mph=(None if d.get("avg_speed_mph") is None
                           else float(d["avg_speed_mph"])),  # type: ignore[arg-type]
            elevation_gain_ft=float(d.get("elevation_gain_ft", 0.0)),  # type: ignore[arg-type]
            weather_multiplier=float(d.get("weather_multiplier", 1.0)),  # type: ignore[arg-type]
            traffic_multiplier=float(d.get("traffic_multiplier", 1.0)),  # type: ignore[arg-type]
        )


@dataclass
class Route:
    """Ordered corridor: node names south->north plus connecting segments."""

    segments: List[RouteSegment] = field(default_factory=list)
    # Optional geographic coordinates per node, for map rendering.
    node_coords: Dict[str, Tuple[float, float]] = field(default_factory=dict)

    @property
    def nodes(self) -> List[str]:
        """Node names in corridor order."""
        if not self.segments:
            return []
        names = [self.segments[0].from_node]
        names.extend(seg.to_node for seg in self.segments)
        return names

    @property
    def total_miles(self) -> float:
        return sum(s.distance_miles for s in self.segments)

    def mile_marker(self, node: str) -> float:
        """Miles from the first node to ``node``."""
        mm = 0.0
        if node == self.segments[0].from_node:
            return 0.0
        for seg in self.segments:
            mm += seg.distance_miles
            if seg.to_node == node:
                return mm
        raise KeyError(f"Node '{node}' not on route")

    def coord_at_mile(self, mile: float) -> Tuple[float, float]:
        """Interpolated (lat, lon) at a mile marker, for map animation."""
        nodes = self.nodes
        mile = max(0.0, min(mile, self.total_miles))
        acc = 0.0
        for seg in self.segments:
            if acc + seg.distance_miles >= mile - 1e-9:
                a = self.node_coords.get(seg.from_node)
                b = self.node_coords.get(seg.to_node)
                if a is None or b is None:
                    break
                t = 0.0 if seg.distance_miles == 0 else (mile - acc) / seg.distance_miles
                return (a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1]))
            acc += seg.distance_miles
        last = self.node_coords.get(nodes[-1], (0.0, 0.0))
        return last

    def to_dict(self) -> Dict[str, object]:
        return {
            "segments": [s.to_dict() for s in self.segments],
            "node_coords": {k: list(v) for k, v in self.node_coords.items()},
        }

    @classmethod
    def from_dict(cls, d: Dict[str, object]) -> "Route":
        return cls(
            segments=[RouteSegment.from_dict(s) for s in d.get("segments", [])],  # type: ignore[union-attr]
            node_coords={
                k: (float(v[0]), float(v[1]))
                for k, v in d.get("node_coords", {}).items()  # type: ignore[union-attr]
            },
        )


def default_i35_route() -> Route:
    """Laredo -> Dallas along I-35, ~430 miles, with intermediate nodes.

    Nodes exist wherever a charging site may be placed; adding a candidate
    site elsewhere means splitting a segment (the route is user editable).
    """
    return Route(
        segments=[
            RouteSegment("Warehouse Laredo", "Fuel America Encinal", 40.0),
            RouteSegment("Fuel America Encinal", "San Antonio", 115.0),
            RouteSegment("San Antonio", "Austin", 80.0),
            RouteSegment("Austin", "Waco Area", 100.0),
            RouteSegment("Waco Area", "Warehouse Dallas", 95.0),
        ],
        node_coords={
            "Warehouse Laredo": (27.5306, -99.4803),
            "Fuel America Encinal": (28.0414, -99.3550),
            "San Antonio": (29.4241, -98.4936),
            "Austin": (30.2672, -97.7431),
            "Waco Area": (31.5493, -97.1467),
            "Warehouse Dallas": (32.7767, -96.7970),
        },
    )
