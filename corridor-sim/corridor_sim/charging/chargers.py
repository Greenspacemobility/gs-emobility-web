"""Charger hardware: power cabinets, dispensers, and power-sharing logic.

A *cabinet* is the power-electronics unit (e.g. a 1.2 MW Tesla MCS cabinet)
feeding one or more *dispensers* (plugs). When several trucks charge on the
same cabinet, the cabinet splits its power according to a sharing table.

The two launch charger types:

* ``tesla_mcs``     -- 1.2 MW cabinet, 2 MCS dispensers, 1200/600 kW split.
* ``autel_mcs_2d``  -- 1.2 MW Autel/Sinexcel cabinet, 2 dispensers,
                       750 kW max per truck, 600 kW each when both busy.
* ``autel_mcs_3d``  -- same cabinet configured with 3 dispensers:
                       750 / 600 / 400 kW per truck at 1 / 2 / 3 sessions.

Sharing tables are data, so future dynamic-allocation strategies can be
implemented by swapping :meth:`ChargerType.per_session_kw`.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass(frozen=True)
class ChargerType:
    """Static description of one cabinet product/configuration.

    Attributes
    ----------
    key / name:
        Registry id and display name.
    cabinet_kw:
        Total cabinet power capability.
    dispensers:
        Number of plugs fed by one cabinet (max simultaneous sessions).
    connector:
        Connector standard served; must match the truck's connector.
    sharing_table:
        Map ``active_sessions -> kW available per session``. Sessions
        beyond the table's largest key get the largest-key value.
    max_session_kw:
        Hard cap per plug (e.g. Autel accepts at most 750 kW per truck).
    efficiency:
        Cabinet AC->DC efficiency (grid draw = delivered / efficiency).
    reliability:
        Long-run availability fraction (derates effective capacity in
        analytical sizing; the DES applies it as scheduled downtime).
    annual_maintenance_hours:
        Expected out-of-service hours per dispenser per year.
    cabinet_cost_usd / dispenser_cost_usd:
        Hardware CAPEX components.
    buffer_kwh:
        If set, this is a *mobile battery-buffered* unit (e.g. iTrailer):
        sessions draw from a finite onboard buffer instead of the grid.
    grid_recharge_kw:
        Grid-side replenishment power of a mobile unit (its only grid
        draw). Once the buffer is empty, sessions are throttled to this.
    """

    key: str
    name: str
    cabinet_kw: float
    dispensers: int
    connector: str
    sharing_table: Dict[int, float]
    max_session_kw: float
    efficiency: float = 0.95
    reliability: float = 0.97
    annual_maintenance_hours: float = 80.0
    cabinet_cost_usd: float = 350_000.0
    dispenser_cost_usd: float = 50_000.0
    buffer_kwh: Optional[float] = None
    grid_recharge_kw: float = 0.0
    # Light-install units (wallboxes) mount on a wall/pedestal: the cost
    # model skips heavy civil works and site interconnection for them.
    # At sites that also have mobile units, wallboxes are automatically
    # dedicated to replenishing the mobile buffers (their primary role).
    light_install: bool = False
    # Max DC input a mobile unit can accept from feeder wallboxes
    # (e.g. iTrailer/Lifeyounger: 200 A CCS1 input ~= 140 kW).
    dc_input_limit_kw: Optional[float] = None

    @property
    def is_mobile(self) -> bool:
        """Battery-buffered mobile unit (finite energy, small grid draw)."""
        return self.buffer_kwh is not None

    def per_session_kw(self, active_sessions: int) -> float:
        """Cabinet-side kW available to each truck at a given occupancy."""
        if active_sessions <= 0:
            return 0.0
        n = min(active_sessions, max(self.sharing_table))
        return min(self.sharing_table[n], self.max_session_kw)

    @property
    def hardware_cost_usd(self) -> float:
        return self.cabinet_cost_usd + self.dispensers * self.dispenser_cost_usd


@dataclass
class CabinetConfig:
    """One deployed cabinet at a site: which type, and how many units."""

    charger_type: str
    count: int = 1

    def to_dict(self) -> Dict[str, object]:
        return {"charger_type": self.charger_type, "count": self.count}

    @classmethod
    def from_dict(cls, d: Dict[str, object]) -> "CabinetConfig":
        return cls(charger_type=str(d["charger_type"]), count=int(d["count"]))


# ---------------------------------------------------------------------------
# Registry -- add new charger products/configurations here.
# ---------------------------------------------------------------------------

CHARGER_TYPES: Dict[str, ChargerType] = {
    # Tesla V4 Semi Charger (datasheet Nov 2024 + Q1'26 update): cabinet
    # 1200 kW DC @480VAC (1500A AC input, ~1247 kVA), power-sharing up to
    # 2 MCS posts -> 1.2 MW single / 600 kW each; >96% system efficiency
    # (targeting 98%); post: 1100 A continuous, ISO 15118-20.
    "tesla_mcs": ChargerType(
        key="tesla_mcs",
        name="Tesla V4 Semi Charger (1.2MW, 2 MCS posts)",
        cabinet_kw=1200.0,
        dispensers=2,
        connector="MCS",
        sharing_table={1: 1200.0, 2: 600.0},
        max_session_kw=1200.0,
        efficiency=0.96,
        cabinet_cost_usd=380_000.0,
        dispenser_cost_usd=55_000.0,
    ),
    # Tesla V4 Semi Integrated Post (Q1'26 update): 125 kW per post with
    # NO power conversion cabinets -- depot/dwell charging, derated power
    # to cut install cost, 6 m cable. Light install like a wallbox.
    "tesla_v4_integrated_125": ChargerType(
        key="tesla_v4_integrated_125",
        name="Tesla V4 Integrated Post 125kW (no cabinet)",
        cabinet_kw=125.0,
        dispensers=1,
        connector="MCS",
        sharing_table={1: 125.0},
        max_session_kw=125.0,
        efficiency=0.97,
        reliability=0.98,
        annual_maintenance_hours=20.0,
        cabinet_cost_usd=35_000.0,
        dispenser_cost_usd=0.0,
        light_install=True,
    ),
    "autel_mcs_2d": ChargerType(
        key="autel_mcs_2d",
        name="Autel/Sinexcel 1.2MW (2 dispensers)",
        cabinet_kw=1200.0,
        dispensers=2,
        connector="CCS_HD",
        sharing_table={1: 750.0, 2: 600.0},
        max_session_kw=750.0,
        cabinet_cost_usd=300_000.0,
        dispenser_cost_usd=45_000.0,
    ),
    # Autel DT1500 MCS dispenser fed by 2x DT600 600 kW power cabinets
    # (from the Autel DS1800/MCS installation package: modular 600 kW
    # cabinets, 2 sets of 3x350kcmil AC input each; the delivered 1.8 MW
    # site = 3 cabinets + 3x DT800 CCS dispensers + 1x DT1500 MCS).
    # This reference config dedicates 2 cabinets to the MCS gun: 1.2 MW
    # to a single truck. Adding a 3rd cabinet unlocks the DT1500's full
    # 1.5 MW rating (future variant).
    # NOTE connector: physically an MCS gun, but per fleet policy Tesla
    # Semis charge ONLY on Tesla hardware, so this unit lives in the
    # Windrose compatibility group (CCS_HD) and serves the Autel side.
    "autel_dt1500_2x600": ChargerType(
        key="autel_dt1500_2x600",
        name="Autel DT1500 MCS + 2x600kW cabinets",
        cabinet_kw=1200.0,
        dispensers=1,
        connector="CCS_HD",
        sharing_table={1: 1200.0},
        max_session_kw=1200.0,
        efficiency=0.96,
        reliability=0.97,
        annual_maintenance_hours=60.0,
        cabinet_cost_usd=280_000.0,   # 2x DT600 power cabinets
        dispenser_cost_usd=70_000.0,  # DT1500 MCS dispenser
    ),
    # Mobile battery-buffered units (iTrailer 217 kWh datasheet):
    # 217 kWh LFP, 180 kW single gun / 90 kW x 2, CCS1 x 2 dispensers,
    # replenished from one 480V/60A AC input (~50 kW). No permits or
    # construction -- the cost model skips transformer/civil/interconnect.
    "itrailer_217": ChargerType(
        key="itrailer_217",
        name="iTrailer 217kWh mobile (2x CCS1)",
        cabinet_kw=180.0,
        dispensers=2,
        connector="CCS_HD",
        sharing_table={1: 180.0, 2: 90.0},
        max_session_kw=180.0,
        efficiency=0.92,           # extra conversion hop through the buffer
        annual_maintenance_hours=40.0,
        cabinet_cost_usd=125_000.0,
        dispenser_cost_usd=0.0,    # guns included in the unit
        buffer_kwh=217.0,
        grid_recharge_kw=50.0,
        dc_input_limit_kw=140.0,   # 200 A CCS1 replenishment input
    ),
    # Autel DC Wallbox 40 kW: stationary single-gun CCS1 unit. PRIMARY ROLE:
    # replenishing mobile chargers -- at any site that also deploys mobile
    # units, wallboxes are automatically dedicated as their feeders (up to
    # each unit's DC input limit); leftover wallboxes charge trucks
    # directly. Light install (wall/pedestal, standard 480V service).
    "autel_wallbox_40": ChargerType(
        key="autel_wallbox_40",
        name="Autel DC Wallbox 40kW (1 gun)",
        cabinet_kw=40.0,
        dispensers=1,
        connector="CCS_HD",
        sharing_table={1: 40.0},
        max_session_kw=40.0,
        efficiency=0.94,
        reliability=0.98,
        annual_maintenance_hours=20.0,
        cabinet_cost_usd=9_000.0,
        dispenser_cost_usd=0.0,
        light_install=True,
    ),
    # Upgraded feeder: 50 kW single-gun DC wallbox (same light-install
    # profile as the 40 kW). Two of these feed a Lifeyounger at 100 kW;
    # three hit the unit's 140 kW DC-input cap.
    "autel_wallbox_50": ChargerType(
        key="autel_wallbox_50",
        name="Autel DC Wallbox 50kW (1 gun)",
        cabinet_kw=50.0,
        dispensers=1,
        connector="CCS_HD",
        sharing_table={1: 50.0},
        max_session_kw=50.0,
        efficiency=0.94,
        reliability=0.98,
        annual_maintenance_hours=20.0,
        cabinet_cost_usd=11_000.0,
        dispenser_cost_usd=0.0,
        light_install=True,
    ),
    # Lifeyounger 217 kWh mobile buffer, 2x CCS1 guns. It has NO intrinsic
    # grid feed: it replenishes via its CCS1 DC input (200 A ~= 140 kW max)
    # from Autel 40 kW Wallboxes deployed at the same site -- deploy this
    # together with 1+ wallboxes. Refill rate = 40 kW per feeding wallbox.
    "lifeyounger_217": ChargerType(
        key="lifeyounger_217",
        name="Lifeyounger 217kWh mobile (fed by Wallboxes)",
        cabinet_kw=180.0,
        dispensers=2,
        connector="CCS_HD",
        sharing_table={1: 180.0, 2: 90.0},
        max_session_kw=180.0,
        efficiency=0.92,
        annual_maintenance_hours=40.0,
        cabinet_cost_usd=125_000.0,
        dispenser_cost_usd=0.0,
        buffer_kwh=217.0,
        grid_recharge_kw=0.0,          # no feed of its own
        dc_input_limit_kw=140.0,       # 200 A CCS1 input ceiling
    ),
    # Back-compat variant: Lifeyounger with one 40 kW Wallbox baked in.
    # Prefer deploying `lifeyounger_217` + explicit `autel_wallbox_40`s.
    "lifeyounger_217_wb40": ChargerType(
        key="lifeyounger_217_wb40",
        name="Lifeyounger 217kWh mobile + Autel 40kW Wallbox",
        cabinet_kw=180.0,
        dispensers=2,
        connector="CCS_HD",
        sharing_table={1: 180.0, 2: 90.0},
        max_session_kw=180.0,
        efficiency=0.92,
        annual_maintenance_hours=40.0,
        cabinet_cost_usd=125_000.0,
        dispenser_cost_usd=0.0,
        buffer_kwh=217.0,
        grid_recharge_kw=40.0,     # single Autel 40 kW DC Wallbox
        dc_input_limit_kw=140.0,
    ),
    # Same unit fitted with an MCS adapter for Tesla Semi top-ups at
    # warehouses (hypothetical configuration -- verify with vendor).
    "itrailer_217_mcs": ChargerType(
        key="itrailer_217_mcs",
        name="iTrailer 217kWh mobile (MCS adapter)",
        cabinet_kw=180.0,
        dispensers=2,
        connector="MCS",
        sharing_table={1: 180.0, 2: 90.0},
        max_session_kw=180.0,
        efficiency=0.92,
        annual_maintenance_hours=40.0,
        cabinet_cost_usd=130_000.0,
        dispenser_cost_usd=0.0,
        buffer_kwh=217.0,
        grid_recharge_kw=50.0,
        dc_input_limit_kw=140.0,
    ),
    "autel_mcs_3d": ChargerType(
        key="autel_mcs_3d",
        name="Autel/Sinexcel 1.2MW (3 dispensers)",
        cabinet_kw=1200.0,
        dispensers=3,
        connector="CCS_HD",
        sharing_table={1: 750.0, 2: 600.0, 3: 400.0},
        max_session_kw=750.0,
        cabinet_cost_usd=300_000.0,
        dispenser_cost_usd=45_000.0,
    ),
}


def get_charger_type(key: str) -> ChargerType:
    try:
        return CHARGER_TYPES[key]
    except KeyError:
        raise KeyError(
            f"Unknown charger type '{key}'. Registered: {sorted(CHARGER_TYPES)}"
        ) from None
