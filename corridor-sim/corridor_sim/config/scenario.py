"""Scenario definition and JSON persistence.

A :class:`Scenario` is the single source of truth for one simulation run:
fleet, route, sites (with charger deployment), dispatch policy, global
multipliers, and financial assumptions. Scenarios serialize to plain JSON
so they can be versioned, diffed, and shared.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional

from corridor_sim.network.locations import SiteConfig, default_i35_sites
from corridor_sim.network.route import Route, default_i35_route


@dataclass
class FleetEntry:
    """A homogeneous group of trucks in the fleet."""

    truck_type: str          # key into vehicles.TRUCK_MODELS
    count: int
    # Optional per-scenario overrides of TruckSpec fields
    overrides: Dict[str, object] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, object]:
        return {"truck_type": self.truck_type, "count": self.count,
                "overrides": dict(self.overrides)}

    @classmethod
    def from_dict(cls, d: Dict[str, object]) -> "FleetEntry":
        return cls(truck_type=str(d["truck_type"]), count=int(d["count"]),
                   overrides=dict(d.get("overrides", {})))  # type: ignore[arg-type]


@dataclass
class DispatchConfig:
    """Departure scheduling policy.

    Modes
    -----
    ``interval``: trucks leave each warehouse every ``headway_minutes``.
    ``wave``:     ``wave_size`` trucks leave together every
                  ``wave_interval_minutes``.
    ``random``:   Poisson departures with mean ``headway_minutes``.
    ``shift``:    departures only inside ``shift_hours`` (interval mode
                  within the window).
    """

    mode: str = "interval"
    headway_minutes: float = 60.0
    wave_size: int = 4
    wave_interval_minutes: float = 240.0
    shift_hours: List[float] = field(default_factory=lambda: [6.0, 22.0])

    def to_dict(self) -> Dict[str, object]:
        return {
            "mode": self.mode, "headway_minutes": self.headway_minutes,
            "wave_size": self.wave_size,
            "wave_interval_minutes": self.wave_interval_minutes,
            "shift_hours": list(self.shift_hours),
        }

    @classmethod
    def from_dict(cls, d: Dict[str, object]) -> "DispatchConfig":
        return cls(**d)  # type: ignore[arg-type]


@dataclass
class EconomicsConfig:
    """Financial assumptions shared by the cost model."""

    discount_rate: float = 0.08
    horizon_years: int = 10
    revenue_per_trip_usd: float = 1200.0
    maintenance_pct_of_hardware: float = 0.03   # per year
    network_cost_usd_per_dispenser_month: float = 200.0
    transformer_cost_usd_per_kw: float = 150.0
    installation_pct_of_hardware: float = 0.15
    civil_cost_usd_per_dispenser: float = 30_000.0
    replacement_year: int = 12                  # beyond default horizon
    # Roadside rescue service economics: external (third-party) calls are
    # a revenue line; every dispatch (own fleet or external) costs a call.
    external_rescue_calls_per_month: float = 0.0
    rescue_fee_usd: float = 750.0
    rescue_price_usd_per_kwh: float = 1.00      # premium roadside rate
    rescue_avg_kwh_external: float = 150.0
    rescue_cost_per_call_usd: float = 250.0     # driver + service tractor

    def to_dict(self) -> Dict[str, object]:
        return {k: getattr(self, k) for k in (
            "discount_rate", "horizon_years", "revenue_per_trip_usd",
            "maintenance_pct_of_hardware", "network_cost_usd_per_dispenser_month",
            "transformer_cost_usd_per_kw", "installation_pct_of_hardware",
            "civil_cost_usd_per_dispenser", "replacement_year",
            "external_rescue_calls_per_month", "rescue_fee_usd",
            "rescue_price_usd_per_kwh", "rescue_avg_kwh_external",
            "rescue_cost_per_call_usd",
        )}

    @classmethod
    def from_dict(cls, d: Dict[str, object]) -> "EconomicsConfig":
        return cls(**d)  # type: ignore[arg-type]


@dataclass
class Scenario:
    """Complete, serializable description of one corridor configuration."""

    name: str = "Baseline"
    description: str = ""
    fleet: List[FleetEntry] = field(default_factory=lambda: [
        FleetEntry("tesla_semi", 10), FleetEntry("windrose_r700", 10),
    ])
    sim_days: float = 7.0
    warmup_days: float = 1.0        # excluded from KPI statistics
    dispatch: DispatchConfig = field(default_factory=DispatchConfig)
    route: Route = field(default_factory=default_i35_route)
    sites: List[SiteConfig] = field(default_factory=default_i35_sites)
    weather_multiplier: float = 1.0   # global consumption multiplier
    traffic_multiplier: float = 1.0   # global travel-time multiplier
    max_wait_minutes: float = 45.0    # design threshold, reported/penalized
    # Charging strategy:
    #   warehouse_charge_policy "full" -> top up to max_soc at warehouses;
    #   "hop" -> charge only enough to reach the next charging hub
    #   (the mobile-charger operating concept).
    warehouse_charge_policy: str = "full"
    # If set (e.g. 0.8), en-route hub stops charge to at least this SOC
    # instead of the minimal amount needed for the next leg.
    enroute_target_soc: Optional[float] = None
    # If set (hours), warehouse charging runs concurrently with loading and
    # is capped by this idle window (models "charge while loading for N h").
    # The truck grabs as much as it can up to max_soc within the window.
    warehouse_charge_window_h: Optional[float] = None
    # Roadside rescue service: a mobile unit is dispatched to a
    # range-stranded truck (emergency fill to ~95%) instead of the truck
    # being lost for the rest of the run.
    rescue_enabled: bool = True
    rescue_speed_mph: float = 50.0     # service tractor towing the unit
    rescue_setup_h: float = 0.5        # hook-up / safety time on scene
    economics: EconomicsConfig = field(default_factory=EconomicsConfig)
    random_seed: int = 42

    # ------------------------------------------------------------------
    @property
    def fleet_size(self) -> int:
        return sum(e.count for e in self.fleet)

    def site(self, name: str) -> SiteConfig:
        for s in self.sites:
            if s.name == name:
                return s
        raise KeyError(f"No site named '{name}'")

    @property
    def warehouses(self) -> List[SiteConfig]:
        return [s for s in self.sites if s.is_warehouse]

    def to_dict(self) -> Dict[str, object]:
        return {
            "name": self.name,
            "description": self.description,
            "fleet": [e.to_dict() for e in self.fleet],
            "sim_days": self.sim_days,
            "warmup_days": self.warmup_days,
            "dispatch": self.dispatch.to_dict(),
            "route": self.route.to_dict(),
            "sites": [s.to_dict() for s in self.sites],
            "weather_multiplier": self.weather_multiplier,
            "traffic_multiplier": self.traffic_multiplier,
            "max_wait_minutes": self.max_wait_minutes,
            "warehouse_charge_policy": self.warehouse_charge_policy,
            "enroute_target_soc": self.enroute_target_soc,
            "warehouse_charge_window_h": self.warehouse_charge_window_h,
            "rescue_enabled": self.rescue_enabled,
            "rescue_speed_mph": self.rescue_speed_mph,
            "rescue_setup_h": self.rescue_setup_h,
            "economics": self.economics.to_dict(),
            "random_seed": self.random_seed,
        }

    @classmethod
    def from_dict(cls, d: Dict[str, object]) -> "Scenario":
        return cls(
            name=str(d.get("name", "Scenario")),
            description=str(d.get("description", "")),
            fleet=[FleetEntry.from_dict(e) for e in d.get("fleet", [])],  # type: ignore[union-attr]
            sim_days=float(d.get("sim_days", 7.0)),  # type: ignore[arg-type]
            warmup_days=float(d.get("warmup_days", 1.0)),  # type: ignore[arg-type]
            dispatch=DispatchConfig.from_dict(d.get("dispatch", {})),  # type: ignore[arg-type]
            route=Route.from_dict(d.get("route", default_i35_route().to_dict())),  # type: ignore[arg-type]
            sites=[SiteConfig.from_dict(s) for s in d.get("sites", [])],  # type: ignore[union-attr]
            weather_multiplier=float(d.get("weather_multiplier", 1.0)),  # type: ignore[arg-type]
            traffic_multiplier=float(d.get("traffic_multiplier", 1.0)),  # type: ignore[arg-type]
            max_wait_minutes=float(d.get("max_wait_minutes", 45.0)),  # type: ignore[arg-type]
            warehouse_charge_policy=str(d.get("warehouse_charge_policy", "full")),
            enroute_target_soc=(None if d.get("enroute_target_soc") is None
                                else float(d["enroute_target_soc"])),  # type: ignore[arg-type]
            warehouse_charge_window_h=(
                None if d.get("warehouse_charge_window_h") is None
                else float(d["warehouse_charge_window_h"])),  # type: ignore[arg-type]
            rescue_enabled=bool(d.get("rescue_enabled", True)),
            rescue_speed_mph=float(d.get("rescue_speed_mph", 50.0)),  # type: ignore[arg-type]
            rescue_setup_h=float(d.get("rescue_setup_h", 0.5)),  # type: ignore[arg-type]
            economics=EconomicsConfig.from_dict(d.get("economics", {})),  # type: ignore[arg-type]
            random_seed=int(d.get("random_seed", 42)),  # type: ignore[arg-type]
        )

    def copy(self) -> "Scenario":
        """Deep copy via round-trip serialization (safe for mutation)."""
        return Scenario.from_dict(json.loads(json.dumps(self.to_dict())))


def save_scenario(scenario: Scenario, path: "str | Path") -> None:
    """Write a scenario to a JSON file."""
    Path(path).write_text(json.dumps(scenario.to_dict(), indent=2))


def load_scenario(path: "str | Path") -> Scenario:
    """Read a scenario from a JSON file."""
    return Scenario.from_dict(json.loads(Path(path).read_text()))
