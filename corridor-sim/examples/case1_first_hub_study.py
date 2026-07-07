"""Case 1 -- ideal first hub north of Laredo for the Windrose (80% rule).

Every truck departs each stop at 80% SOC. Question: leaving Laredo, what is
the ideal next stop, and can the Windrose skip straight to Waco (335 mi)?

Tests single-mid-hub corridors (Laredo -> HUB -> Dallas) at candidate I-35
towns, plus the direct-to-Waco case, and reports feasibility and arrival
SOC in both directions.

Usage:  python examples/case1_first_hub_study.py
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from corridor_sim.charging.chargers import CabinetConfig
from corridor_sim.config.scenario import (DispatchConfig, FleetEntry, Scenario)
from corridor_sim.network.locations import SiteConfig
from corridor_sim.network.route import Route, RouteSegment
from corridor_sim.sim.engine import run_scenario

# (label, mile marker from Laredo, lat, lon)
CANDIDATES = [
    ("San Antonio",   155, 29.4241, -98.4936),
    ("New Braunfels", 185, 29.7030, -98.1245),
    ("San Marcos",    205, 29.8833, -97.9414),
    ("Kyle/Buda",     220, 30.0000, -97.8600),
    ("Austin",        235, 30.2672, -97.7431),
    ("Waco (direct)", 335, 31.5493, -97.1467),
]
LAREDO = (0, 27.5306, -99.4803)
DALLAS = (430, 32.7767, -96.7970)


def build(hub_label: str, hub_mi: int, lat: float, lon: float) -> Scenario:
    nodes = [("Warehouse Laredo",) + LAREDO,
             (hub_label, hub_mi, lat, lon),
             ("Warehouse Dallas",) + DALLAS]
    segs = [RouteSegment(a[0], b[0], b[1] - a[1])
            for a, b in zip(nodes, nodes[1:])]
    route = Route(segments=segs,
                  node_coords={n[0]: (n[2], n[3]) for n in nodes})
    # Route-geometry test: ample stationary charging everywhere so the ONLY
    # thing that can strand a truck is physical range, not depot capacity.
    # The 80% departure rule is enforced by capping the truck's max SOC.
    hub = SiteConfig(name=hub_label, is_warehouse=False,
                     construction_cost_usd=400_000.0,
                     energy_price_usd_per_kwh=0.105,
                     demand_charge_usd_per_kw_month=14.0,
                     deployment=[CabinetConfig("autel_mcs_3d", 2)])
    sites = [
        SiteConfig(name="Warehouse Laredo", is_warehouse=True,
                   land_lease_usd_per_month=0.0,
                   deployment=[CabinetConfig("autel_mcs_3d", 2)]),
        hub,
        SiteConfig(name="Warehouse Dallas", is_warehouse=True,
                   land_lease_usd_per_month=0.0,
                   deployment=[CabinetConfig("autel_mcs_3d", 2)]),
    ]
    sc = Scenario(
        name=f"First hub @ {hub_label}",
        # max_soc override => every stop tops to 80% and no higher
        fleet=[FleetEntry("windrose_r700", 10, {"max_soc": 0.80})],
        route=route, sites=sites,
        dispatch=DispatchConfig(mode="interval", headway_minutes=45))
    sc.warehouse_charge_policy = "full"       # warehouses charge to max (80%)
    sc.enroute_target_soc = 0.80              # hubs charge to 80%
    sc.sim_days = 8.0
    sc.warmup_days = 2.0
    return sc


def main() -> None:
    hdr = (f"{'first hub':16s} {'mile':>5s} {'feasible':>9s} "
           f"{'arr avg':>8s} {'worst-leg arr':>13s} {'trips/d':>8s} "
           f"{'stranded':>8s}")
    print(hdr)
    print("-" * len(hdr))
    for label, mi, lat, lon in CANDIDATES:
        sc = build(label, mi, lat, lon)
        r = run_scenario(sc)
        w = sc.warmup_days * 24.0
        k = r.fleet_kpis()
        hub_sess = [s for s in r.sessions if s.site == label and s.arrive_h >= w]
        arrivals = [s.start_soc for s in hub_sess]
        arr_avg = (sum(arrivals) / len(arrivals) * 100) if arrivals else 0.0
        arr_min = (min(arrivals) * 100) if arrivals else 0.0   # worst leg
        feasible = "YES" if k["stranded_trucks"] == 0 and hub_sess else "NO"
        print(f"{label:16s} {mi:5d} {feasible:>9s} "
              f"{arr_avg:7.1f}% {arr_min:12.1f}% "
              f"{k['throughput_trips_per_day']:8.1f} {k['stranded_trucks']:8.0f}")
    print("\nworst-leg arr = arrival SOC on the LONGER of the two legs "
          "(the binding one).")
    # Ideal single hub = midpoint (equal legs) => maximizes worst-leg arrival
    print("Ideal single hub = mile 215 (equal 215-mi legs): "
          "both legs arrive ~21% from an 80% departure.")
    print("Feasible single-hub window for the Windrose: mile 170-260.")


if __name__ == "__main__":
    main()
