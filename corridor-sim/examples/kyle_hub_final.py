"""Definitive Case 1 corridor: single hub at Kyle, TX (~mile 213).

Laredo -> Kyle hub -> Dallas, 10 Windrose R700 trucks at the US legal max
(80,000 lb, 1.80 kWh/mi), departing every stop at 80% SOC.

Reports:
  1. SOC profile -- departure/arrival SOC at each site, feasibility.
  2. Energy delivered per site per day.
  3. Minimum grid connection per site (sweep each cap down until KPIs drop).
  4. Warehouse depot: can the mobile-charger (Lifeyounger + 40 kW Wallbox)
     concept still cover the warehouse refill, or is stationary needed?

Usage:  python examples/kyle_hub_final.py
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from corridor_sim.charging.chargers import CabinetConfig, get_charger_type
from corridor_sim.config.scenario import (DispatchConfig, FleetEntry, Scenario)
from corridor_sim.network.locations import SiteConfig
from corridor_sim.network.route import Route, RouteSegment
from corridor_sim.sim.engine import run_scenario

KYLE_MI = 213                      # driving miles Laredo warehouse -> Kyle
CORRIDOR_MI = 430
USABLE = 669.75
KWHPM = 1.80


def build(warehouse_hw, laredo_grid_kw=5000.0, dallas_grid_kw=5000.0):
    nodes = [("Warehouse Laredo", 0, 27.5306, -99.4803),
             ("Kyle", KYLE_MI, 29.9890, -97.8772),
             ("Warehouse Dallas", CORRIDOR_MI, 32.7767, -96.7970)]
    route = Route(
        segments=[RouteSegment(a[0], b[0], b[1] - a[1])
                  for a, b in zip(nodes, nodes[1:])],
        node_coords={n[0]: (n[2], n[3]) for n in nodes})
    sites = [
        SiteConfig(name="Warehouse Laredo", is_warehouse=True,
                   land_lease_usd_per_month=0.0, grid_connection_kw=laredo_grid_kw,
                   transformer_limit_kw=laredo_grid_kw, utility_limit_kw=laredo_grid_kw,
                   deployment=list(warehouse_hw)),
        SiteConfig(name="Kyle", is_warehouse=False,
                   construction_cost_usd=400_000.0,
                   energy_price_usd_per_kwh=0.105,
                   demand_charge_usd_per_kw_month=14.0,
                   deployment=[CabinetConfig("autel_mcs_3d", 2)]),
        SiteConfig(name="Warehouse Dallas", is_warehouse=True,
                   land_lease_usd_per_month=0.0, grid_connection_kw=dallas_grid_kw,
                   transformer_limit_kw=dallas_grid_kw, utility_limit_kw=dallas_grid_kw,
                   deployment=list(warehouse_hw)),
    ]
    sc = Scenario(
        name="Kyle single-hub corridor (Windrose)",
        fleet=[FleetEntry("windrose_r700", 10, {"max_soc": 0.80})],
        route=route, sites=sites,
        dispatch=DispatchConfig(mode="interval", headway_minutes=45))
    sc.warehouse_charge_policy = "full"        # warehouses charge to max (80%)
    sc.enroute_target_soc = 0.80               # Kyle hub charges to 80%
    sc.sim_days = 8.0
    sc.warmup_days = 2.0
    return sc


def soc_profile(r, sc):
    w = sc.warmup_days * 24.0
    print("\n2. SOC PROFILE (post-warm-up averages):")
    for site in ("Warehouse Laredo", "Kyle", "Warehouse Dallas"):
        sess = [s for s in r.sessions if s.site == site and s.arrive_h >= w]
        if not sess:
            print(f"   {site:18s}: (no sessions)")
            continue
        arr = sum(s.start_soc for s in sess) / len(sess) * 100
        dep = sum(s.end_soc for s in sess) / len(sess) * 100
        print(f"   {site:18s}: arrive {arr:4.0f}%  ->  depart {dep:4.0f}%   "
              f"({len(sess)} sessions)")
    hop = KYLE_MI * KWHPM / USABLE * 100
    print(f"   (each 213-mi leg consumes ~{hop:.0f} SOC points)")


def min_grid(warehouse_hw):
    """Sweep each site's grid cap down to the minimum that holds KPIs."""
    print("\n3. MINIMUM GRID CONNECTION PER SITE:")
    ref = run_scenario(build(warehouse_hw))
    ref_trips = ref.fleet_kpis()["throughput_trips_per_day"]
    for site in ("Warehouse Laredo", "Kyle", "Warehouse Dallas"):
        nameplate = sum(
            (get_charger_type(c.charger_type).grid_recharge_kw
             if get_charger_type(c.charger_type).is_mobile
             else get_charger_type(c.charger_type).cabinet_kw) * c.count
            for c in (warehouse_hw if "Warehouse" in site
                      else [CabinetConfig("autel_mcs_3d", 2)]))
        best = nameplate
        for kw in range(int(nameplate) - 100, 100, -100):
            sc = build(warehouse_hw)
            s = sc.site(site)
            s.grid_connection_kw = s.transformer_limit_kw = s.utility_limit_kw = float(kw)
            k = run_scenario(sc).fleet_kpis()
            if k["stranded_trucks"] == 0 and k["throughput_trips_per_day"] >= 0.98 * ref_trips \
                    and k["avg_wait_time_min"] <= 5.0:
                best = kw
            else:
                break
        margin = round(best * 1.2 / 50) * 50
        print(f"   {site:18s}: min {best:5.0f} kW  (recommend {margin:5.0f} kW with 20% margin)")


def main() -> None:
    print("=" * 70)
    print("KYLE SINGLE-HUB CORRIDOR  --  10 Windrose, 80k lb, 80% departures")
    print("=" * 70)

    # --- Option A: stationary Autel cabinet at each warehouse ---
    stationary = [CabinetConfig("autel_mcs_3d", 1)]
    sc = build(stationary)
    r = run_scenario(sc)
    k = r.fleet_kpis()
    print(f"\n1. FEASIBILITY (stationary warehouse charging):")
    print(f"   trips/day {k['throughput_trips_per_day']:.1f} | "
          f"stranded {k['stranded_trucks']:.0f} | "
          f"avg wait {k['avg_wait_time_min']:.1f} min")
    soc_profile(r, sc)
    days = r.analysis_days
    print("\n   Energy delivered per site:")
    for site in ("Warehouse Laredo", "Kyle", "Warehouse Dallas"):
        print(f"     {site:18s}: {r.site_energy_kwh[site]/days:5.0f} kWh/day")
    min_grid(stationary)

    # --- Option B: can the mobile-charger concept cover the warehouse? ---
    print("\n4. MOBILE-CHARGER CONCEPT AT WAREHOUSES (Kyle layout):")
    refill_kwh = (0.80 - 0.21) * USABLE
    print(f"   Each truck arrives ~21% and must leave at 80% "
          f"=> ~{refill_kwh:.0f} kWh in the 2-h window.")
    one_unit = 217 + 40 * 2.0
    print(f"   One Lifeyounger + one 40 kW Wallbox delivers at most "
          f"~{one_unit*0.92:.0f} kWh in 2 h  ->  "
          f"{'ENOUGH' if one_unit*0.92 >= refill_kwh else 'NOT ENOUGH (needs stationary or more units)'}.")
    for n_wb in (2, 3, 4, 5):
        cap = (217 + 40 * n_wb * 2.0) * 0.92
        print(f"     1 mobile unit + {n_wb} x 40kW Wallbox: ~{cap:5.0f} kWh/2h "
              f"({'OK' if cap >= refill_kwh else 'short'})")
    daily_wh = refill_kwh * 12 / 0.90
    print(f"   Daily warehouse energy ~{refill_kwh*12:.0f} kWh/truck-departures "
          f"=> ~{daily_wh/960:.0f} x 40kW Wallboxes on energy alone.")


if __name__ == "__main__":
    main()
