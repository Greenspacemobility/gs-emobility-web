"""Hub location study: where should the northern hub sit instead of Waco?

Sweeps candidate hub towns on I-35 between Waco and Dallas (West,
Hillsboro, Italy, Waxahachie), each closer to Dallas than Waco, under the
mobile-charger operating concept (iTrailers at warehouses, 'hop' policy,
hubs to 80%). Because the Windrose R700 cannot reach past ~mile 338 from
a 90% departure at Encinal, each northern candidate is also run with an
Austin support hub.

Usage:  python examples/hub_location_study.py
"""
from __future__ import annotations

import sys
from pathlib import Path
from typing import List, Optional, Tuple

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from corridor_sim.charging.chargers import CabinetConfig
from corridor_sim.config.presets import build_preset
from corridor_sim.config.scenario import Scenario
from corridor_sim.costs.model import CostModel
from corridor_sim.network.locations import SiteConfig
from corridor_sim.network.route import Route, RouteSegment
from corridor_sim.sim.engine import run_scenario

# (name, mile marker from Laredo, lat, lon)
CANDIDATES = [
    ("Waco Area",   335.0, 31.5493, -97.1467),   # baseline
    ("West TX",     355.0, 31.8021, -97.0917),
    ("Hillsboro",   370.0, 32.0110, -97.1300),   # I-35E/I-35W junction
    ("Italy TX",    385.0, 32.1840, -96.8840),
    ("Waxahachie",  400.0, 32.3865, -96.8483),
]

FIXED_NODES = [
    ("Warehouse Laredo",     0.0,   27.5306, -99.4803),
    ("Fuel America Encinal", 40.0,  28.0414, -99.3550),
    ("San Antonio",          155.0, 29.4241, -98.4936),
    ("Austin",               235.0, 30.2672, -97.7431),
]
DALLAS = ("Warehouse Dallas", 430.0, 32.7767, -96.7970)

HUB_HW = [CabinetConfig("tesla_mcs", 1), CabinetConfig("autel_mcs_3d", 1)]
BIG_HUB_HW = [CabinetConfig("tesla_mcs", 2), CabinetConfig("autel_mcs_3d", 2)]


def _hub_site(name: str) -> SiteConfig:
    """Highway hub site config (Waco-like economics)."""
    return SiteConfig(
        name=name, is_warehouse=False, available_land_acres=2.5,
        land_lease_usd_per_month=7000.0, construction_cost_usd=400_000.0,
        energy_price_usd_per_kwh=0.105, demand_charge_usd_per_kw_month=14.0,
        queue_spots=4,
    )


def build_variant(hub: Tuple[str, float, float, float],
                  hub_hw: List[CabinetConfig],
                  austin_hw: Optional[List[CabinetConfig]] = None) -> Scenario:
    """Mobile-warehouse scenario with the northern hub at ``hub`` and an
    optional Austin support hub."""
    base = build_preset("mobile_warehouse_hubs")
    name, mile, lat, lon = hub

    nodes = FIXED_NODES + [(name, mile, lat, lon), DALLAS]
    segments = [
        RouteSegment(a[0], b[0], b[1] - a[1])
        for a, b in zip(nodes, nodes[1:])
    ]
    route = Route(segments=segments,
                  node_coords={n: (la, lo) for n, _, la, lo in nodes})

    sites = [s for s in base.sites
             if s.name in ("Warehouse Laredo", "Fuel America Encinal",
                           "Warehouse Dallas")]
    hub_site = _hub_site(name)
    hub_site.deployment = list(hub_hw)
    sites.insert(2, hub_site)
    if austin_hw is not None:
        austin = _hub_site("Austin")
        austin.deployment = list(austin_hw)
        sites.insert(2, austin)

    sc = base
    sc.route = route
    sc.sites = sites
    label = name + (" + Austin" if austin_hw is not None else "")
    sc.name = f"Hub @ {label}"
    sc.sim_days = 7.0
    return sc


def evaluate(sc: Scenario) -> dict:
    result = run_scenario(sc)
    costs = CostModel(sc).evaluate(result)
    k = result.fleet_kpis()
    site_df = result.site_kpis().set_index("site")
    dallas_kwh = result.site_energy_kwh.get("Warehouse Dallas", 0.0) \
        / result.analysis_days
    hub_peaks = {s: site_df.loc[s, "peak_demand_kw"] / 1000.0
                 for s in site_df.index
                 if s not in ("Warehouse Laredo", "Warehouse Dallas")}
    return {
        "scenario": sc.name,
        "trips_day": round(k["throughput_trips_per_day"], 1),
        "trip_h": round(k["avg_trip_time_h"], 2),
        "wait_avg_min": round(k["avg_wait_time_min"], 1),
        "wait_max_min": round(k["max_wait_time_min"], 0),
        "stranded": int(k["stranded_trucks"]),
        "util_pct": round(k["fleet_utilization_pct"], 0),
        "dallas_mobile_kwh_day": round(dallas_kwh, 0),
        "capex_musd": round(costs.total_capex / 1e6, 2),
        "hub_peaks_mw": {s: round(v, 2) for s, v in hub_peaks.items()},
    }


def main() -> None:
    rows = []
    # Baseline: Waco with the big hub hardware (current preset sizing)
    rows.append(evaluate(build_variant(CANDIDATES[0], BIG_HUB_HW)))
    # Northern candidates alone (Windrose feasibility check)
    for cand in CANDIDATES[1:]:
        rows.append(evaluate(build_variant(cand, BIG_HUB_HW)))
    # Northern candidates with an Austin support hub (right-sized hubs)
    for cand in CANDIDATES[1:]:
        rows.append(evaluate(build_variant(cand, HUB_HW, austin_hw=HUB_HW)))
    # Waco with Austin support, for a fair 2-hub comparison
    rows.append(evaluate(build_variant(CANDIDATES[0], HUB_HW,
                                       austin_hw=HUB_HW)))

    hdr = (f"{'scenario':28s} {'trips/d':>7s} {'trip h':>6s} {'wait':>5s} "
           f"{'max w':>6s} {'strand':>6s} {'util%':>5s} "
           f"{'DAL kWh/d':>9s} {'CAPEX$M':>8s}  hub peaks (MW)")
    print(hdr)
    print("-" * len(hdr))
    for r in rows:
        peaks = ", ".join(f"{s.split()[0]}:{v}" for s, v in
                          r["hub_peaks_mw"].items())
        print(f"{r['scenario']:28s} {r['trips_day']:7.1f} {r['trip_h']:6.2f} "
              f"{r['wait_avg_min']:5.1f} {r['wait_max_min']:6.0f} "
              f"{r['stranded']:6d} {r['util_pct']:5.0f} "
              f"{r['dallas_mobile_kwh_day']:9.0f} {r['capex_musd']:8.2f}  "
              f"{peaks}")


if __name__ == "__main__":
    main()
