"""Charging-site (location) definitions.

A :class:`SiteConfig` describes one physical location: its position on the
route, grid/land constraints, economics, and the charger deployment placed
there. Deployment (which cabinets, how many) is the primary decision
variable of the optimizer; the physical constraints bound the search.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional

from corridor_sim.charging.chargers import CabinetConfig, get_charger_type


@dataclass
class SiteConfig:
    """One charging location on the corridor.

    Attributes
    ----------
    name:
        Must match a route node name.
    is_warehouse:
        Warehouses are trip endpoints where trucks swap trailers.
    available_land_acres:
        Land constraint (bounds queue area and cabinet count).
    grid_connection_kw / transformer_limit_kw / utility_limit_kw:
        Power ceilings; the effective site limit is their minimum.
    expansion_capable:
        Whether the utility can upgrade the connection later.
    construction_cost_usd:
        Site-level civil works baseline (pads, canopy, switchgear room).
    utility_connection_cost_usd:
        One-time interconnection cost.
    land_lease_usd_per_month:
        Monthly lease (0 for owned warehouse land).
    energy_price_usd_per_kwh / demand_charge_usd_per_kw_month:
        Tariff at this site (what WE pay for energy).
    retail_price_usd_per_kwh:
        What OUR OWN fleet pays per kWh at this site (owned sites sell
        energy to the fleet). 0 = no charging revenue here.
    retail_price_external_usd_per_kwh:
        What THIRD-PARTY trucks pay per kWh (public/other-fleet rate).
    external_trucks_per_day:
        Third-party charging demand at this site (Poisson arrivals).
        External trucks queue on the same dispensers as the fleet and
        charge from a random low SOC to 80%.
    charge_target_soc:
        Per-site departure-SOC override. Trucks charging here aim for
        this SOC instead of the scenario-level policy target -- lets the
        strategy charge deeper at free/owned sites and minimally at
        paid ones. ``None`` = use the scenario policy.
    operational_hours:
        (open_hour, close_hour) in 0-24; (0, 24) = always open.
    queue_spots:
        Physical waiting positions; trucks beyond this still queue but
        the statistic is reported for site design review.
    deployment:
        List of :class:`CabinetConfig` actually installed (scenario /
        optimizer decision).
    dwell_minutes:
        Warehouse only -- trailer unload+load time.
    """

    name: str
    is_warehouse: bool = False
    available_land_acres: float = 2.0
    grid_connection_kw: float = 5000.0
    transformer_limit_kw: float = 5000.0
    utility_limit_kw: float = 5000.0
    expansion_capable: bool = True
    construction_cost_usd: float = 250_000.0
    utility_connection_cost_usd: float = 250_000.0
    land_lease_usd_per_month: float = 4000.0
    energy_price_usd_per_kwh: float = 0.10
    demand_charge_usd_per_kw_month: float = 12.0
    retail_price_usd_per_kwh: float = 0.0
    retail_price_external_usd_per_kwh: float = 0.0
    external_trucks_per_day: float = 0.0
    charge_target_soc: Optional[float] = None
    operational_hours: List[float] = field(default_factory=lambda: [0.0, 24.0])
    queue_spots: int = 4
    deployment: List[CabinetConfig] = field(default_factory=list)
    dwell_minutes: float = 45.0

    @property
    def site_power_limit_kw(self) -> float:
        """Binding power ceiling across grid, transformer and utility."""
        return min(self.grid_connection_kw, self.transformer_limit_kw,
                   self.utility_limit_kw)

    @property
    def deployed_cabinet_kw(self) -> float:
        """Nameplate cabinet power installed (before the site limit)."""
        return sum(get_charger_type(c.charger_type).cabinet_kw * c.count
                   for c in self.deployment)

    @property
    def total_dispensers(self) -> int:
        return sum(get_charger_type(c.charger_type).dispensers * c.count
                   for c in self.deployment)

    @property
    def has_charging(self) -> bool:
        return any(c.count > 0 for c in self.deployment)

    def to_dict(self) -> Dict[str, object]:
        return {
            "name": self.name,
            "is_warehouse": self.is_warehouse,
            "available_land_acres": self.available_land_acres,
            "grid_connection_kw": self.grid_connection_kw,
            "transformer_limit_kw": self.transformer_limit_kw,
            "utility_limit_kw": self.utility_limit_kw,
            "expansion_capable": self.expansion_capable,
            "construction_cost_usd": self.construction_cost_usd,
            "utility_connection_cost_usd": self.utility_connection_cost_usd,
            "land_lease_usd_per_month": self.land_lease_usd_per_month,
            "energy_price_usd_per_kwh": self.energy_price_usd_per_kwh,
            "demand_charge_usd_per_kw_month": self.demand_charge_usd_per_kw_month,
            "retail_price_usd_per_kwh": self.retail_price_usd_per_kwh,
            "retail_price_external_usd_per_kwh":
                self.retail_price_external_usd_per_kwh,
            "external_trucks_per_day": self.external_trucks_per_day,
            "charge_target_soc": self.charge_target_soc,
            "operational_hours": list(self.operational_hours),
            "queue_spots": self.queue_spots,
            "deployment": [c.to_dict() for c in self.deployment],
            "dwell_minutes": self.dwell_minutes,
        }

    @classmethod
    def from_dict(cls, d: Dict[str, object]) -> "SiteConfig":
        kwargs = dict(d)
        kwargs["deployment"] = [
            CabinetConfig.from_dict(c) for c in d.get("deployment", [])  # type: ignore[union-attr]
        ]
        return cls(**kwargs)  # type: ignore[arg-type]


def default_i35_sites() -> List[SiteConfig]:
    """The four launch locations, with no chargers deployed yet."""
    return [
        SiteConfig(
            name="Warehouse Laredo", is_warehouse=True,
            available_land_acres=5.0, land_lease_usd_per_month=0.0,
            construction_cost_usd=200_000.0,
            # Energy at the Laredo warehouse is included in warehouse
            # operations -- free to the charging project.
            energy_price_usd_per_kwh=0.0, demand_charge_usd_per_kw_month=0.0,
            dwell_minutes=45.0, queue_spots=6,
        ),
        SiteConfig(
            name="Fuel America Encinal", is_warehouse=False,
            available_land_acres=3.0, land_lease_usd_per_month=6000.0,
            construction_cost_usd=350_000.0,
            energy_price_usd_per_kwh=0.095, demand_charge_usd_per_kw_month=13.0,
            queue_spots=4,
        ),
        SiteConfig(
            name="Waco Area", is_warehouse=False,
            available_land_acres=2.5, land_lease_usd_per_month=7000.0,
            construction_cost_usd=400_000.0,
            energy_price_usd_per_kwh=0.105, demand_charge_usd_per_kw_month=14.0,
            queue_spots=4,
        ),
        SiteConfig(
            name="Warehouse Dallas", is_warehouse=True,
            available_land_acres=4.0, land_lease_usd_per_month=0.0,
            construction_cost_usd=220_000.0,
            energy_price_usd_per_kwh=0.10, demand_charge_usd_per_kw_month=13.5,
            dwell_minutes=45.0, queue_spots=6,
        ),
    ]
