"""Heavy-duty electric truck specifications.

Each truck model is described by a :class:`TruckSpec`. New models are added
by registering another spec in :data:`TRUCK_MODELS` (or at runtime via
``TRUCK_MODELS["key"] = TruckSpec(...)``) -- nothing else in the codebase
needs to change.

SOC conventions: all SOC values are fractions of *usable* battery energy
(``battery_kwh * usable_fraction``), in the range 0..1.
"""
from __future__ import annotations

import dataclasses
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

from corridor_sim.charging.curves import ChargingCurve, DEFAULT_CURVE_POINTS


@dataclass
class TruckSpec:
    """Static parameters of one truck model.

    Attributes
    ----------
    key:
        Registry identifier, e.g. ``"tesla_semi"``.
    name:
        Human-readable model name.
    battery_kwh:
        Nominal (gross) battery capacity.
    usable_fraction:
        Fraction of the nominal pack that is usable (buffer excluded).
    max_charge_kw:
        Maximum DC power the vehicle will accept at the plug.
    charging_curve:
        SOC-dependent power limit, as a fraction of ``max_charge_kw``.
    consumption_kwh_per_mile:
        Baseline loaded consumption before weather correction.
    vehicle_weight_lb / gross_combination_weight_lb:
        Tractor weight and max GCW (informational; used by future
        load-dependent consumption models).
    avg_speed_mph:
        Corridor average speed before traffic correction.
    min_soc / max_soc:
        Operating SOC window. Trucks never plan to go below ``min_soc``
        and never charge above ``max_soc`` in normal operation.
    preferred_arrival_soc:
        Target SOC when arriving at the next charging stop; the buffer
        the stop planner aims for.
    charging_efficiency:
        Grid-to-battery efficiency of a charging session.
    temp_correction:
        Multiplier on consumption for ambient temperature (1.0 = mild).
    connector:
        Connector standard; a truck may only use chargers whose
        ``connector`` matches.
    break_after_drive_hours / break_minutes:
        Hours-of-service rule: after this much cumulative driving the
        driver must rest ``break_minutes`` (a charging stop of at least
        that length counts as the break).
    """

    key: str
    name: str
    battery_kwh: float
    usable_fraction: float
    max_charge_kw: float
    consumption_kwh_per_mile: float
    vehicle_weight_lb: float
    gross_combination_weight_lb: float
    avg_speed_mph: float
    min_soc: float = 0.10
    max_soc: float = 0.90
    preferred_arrival_soc: float = 0.15
    charging_efficiency: float = 0.94
    temp_correction: float = 1.0
    connector: str = "MCS"
    break_after_drive_hours: float = 8.0
    break_minutes: float = 30.0
    charging_curve: ChargingCurve = field(
        default_factory=lambda: ChargingCurve(DEFAULT_CURVE_POINTS)
    )

    @property
    def usable_kwh(self) -> float:
        """Usable pack energy in kWh."""
        return self.battery_kwh * self.usable_fraction

    def range_miles(self, from_soc: float, to_soc: float,
                    weather_multiplier: float = 1.0) -> float:
        """Miles drivable when going from ``from_soc`` down to ``to_soc``."""
        per_mile = self.consumption_kwh_per_mile * self.temp_correction * weather_multiplier
        return max(0.0, (from_soc - to_soc)) * self.usable_kwh / per_mile

    def energy_for_miles(self, miles: float, weather_multiplier: float = 1.0) -> float:
        """kWh drawn from the pack to drive ``miles``."""
        return miles * self.consumption_kwh_per_mile * self.temp_correction * weather_multiplier

    def accepted_power_kw(self, soc: float) -> float:
        """Vehicle-side power limit at a given SOC (before charger limits)."""
        return self.charging_curve.fraction_at(soc) * self.max_charge_kw

    def with_overrides(self, **overrides: object) -> "TruckSpec":
        """Return a copy with selected fields replaced (user tuning)."""
        return dataclasses.replace(self, **overrides)  # type: ignore[arg-type]


# ---------------------------------------------------------------------------
# Registry -- add new truck models here.
# ---------------------------------------------------------------------------

TRUCK_MODELS: Dict[str, TruckSpec] = {
    "tesla_semi": TruckSpec(
        key="tesla_semi",
        name="Tesla Semi",
        battery_kwh=900.0,
        usable_fraction=0.95,
        max_charge_kw=1200.0,
        # Tesla fleet-proven figure: 1.7 avg kWh/mi over 12M+ miles
        # (Q1 2026 Semi Product Update)
        consumption_kwh_per_mile=1.70,
        vehicle_weight_lb=27000,
        gross_combination_weight_lb=82000,
        avg_speed_mph=58.0,
        connector="MCS",
        charging_curve=ChargingCurve([
            (0.00, 1.00), (0.20, 1.00), (0.50, 0.95),
            (0.60, 0.85), (0.80, 0.55), (0.90, 0.35), (1.00, 0.12),
        ]),
    ),
    "windrose_r700": TruckSpec(
        key="windrose_r700",
        name="Windrose R700",
        battery_kwh=705.0,
        usable_fraction=0.95,
        max_charge_kw=750.0,
        consumption_kwh_per_mile=1.80,
        vehicle_weight_lb=26500,
        gross_combination_weight_lb=80000,
        avg_speed_mph=58.0,
        connector="CCS_HD",
        charging_curve=ChargingCurve([
            (0.00, 1.00), (0.20, 1.00), (0.60, 0.90),
            (0.80, 0.60), (0.90, 0.35), (1.00, 0.12),
        ]),
    ),
}


def get_truck_spec(key: str, overrides: Optional[Dict[str, object]] = None) -> TruckSpec:
    """Fetch a registered truck spec, optionally applying field overrides."""
    try:
        spec = TRUCK_MODELS[key]
    except KeyError:
        raise KeyError(
            f"Unknown truck model '{key}'. Registered: {sorted(TRUCK_MODELS)}"
        ) from None
    if overrides:
        curve = overrides.pop("charging_curve_points", None)
        if curve is not None:
            overrides["charging_curve"] = ChargingCurve(
                [(float(s), float(f)) for s, f in curve]  # type: ignore[union-attr]
            )
        spec = spec.with_overrides(**overrides)
    return spec
