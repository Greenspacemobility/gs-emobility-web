"""Minimum grid-connection study.

For a given scenario, finds the minimum grid connection (kW) per site that
keeps corridor performance intact. The engine proportionally derates
charging sessions when concurrent demand exceeds a site's limit, so a cap
that is too low shows up as longer charge times, queues, and lost trips.

Method: run unconstrained as the reference; sweep each site's cap
independently (others unconstrained) downward until performance degrades;
then validate all minimum caps applied together.

Pass criteria vs the unconstrained reference:
  * throughput >= 98%
  * avg charger wait <= 5 min and p95 wait <= scenario max_wait_minutes
  * no stranded trucks

Usage:  python examples/grid_requirements.py [scenario.json]
        (default: scenarios/hub_waxahachie_austin.json)
"""
from __future__ import annotations

import sys
from pathlib import Path
from typing import Dict, List, Optional

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from corridor_sim.charging.chargers import get_charger_type
from corridor_sim.config.scenario import Scenario, load_scenario
from corridor_sim.sim.engine import run_scenario

UNCONSTRAINED_KW = 50_000.0
# Sweep grid caps downward in 200 kW steps from nameplate
STEP_KW = 200.0


def _set_cap(sc: Scenario, site_name: str, kw: float) -> None:
    site = sc.site(site_name)
    site.grid_connection_kw = kw
    site.transformer_limit_kw = kw
    site.utility_limit_kw = kw


def _unconstrain_all(sc: Scenario) -> None:
    for s in sc.sites:
        _set_cap(sc, s.name, UNCONSTRAINED_KW)


def _kpis(sc: Scenario) -> Dict[str, float]:
    r = run_scenario(sc)
    k = r.fleet_kpis()
    peaks = r.site_kpis().set_index("site")["peak_demand_kw"].to_dict()
    return {
        "throughput": k["throughput_trips_per_day"],
        "avg_wait": k["avg_wait_time_min"],
        "p95_wait": k["p95_wait_time_min"],
        "stranded": k["stranded_trucks"],
        "peaks": peaks,
    }


def _ok(ref: Dict[str, float], test: Dict[str, float],
        max_wait: float) -> bool:
    return (test["stranded"] == 0
            and test["throughput"] >= 0.98 * ref["throughput"]
            and test["avg_wait"] <= 5.0
            and test["p95_wait"] <= max_wait)


def _site_nameplate_kw(sc: Scenario, site_name: str) -> float:
    """Grid-side worst case: stationary nameplate + mobile recharge feeds."""
    total = 0.0
    for cab in sc.site(site_name).deployment:
        ct = get_charger_type(cab.charger_type)
        total += (ct.grid_recharge_kw if ct.is_mobile else ct.cabinet_kw) \
            * cab.count
    return total


def minimum_cap(base: Scenario, site_name: str,
                ref: Dict[str, float]) -> float:
    """Lowest cap for one site (others unconstrained) that still passes."""
    nameplate = _site_nameplate_kw(base, site_name)
    best = nameplate
    kw = nameplate - STEP_KW
    while kw >= STEP_KW:
        sc = base.copy()
        _unconstrain_all(sc)
        _set_cap(sc, site_name, kw)
        if _ok(ref, _kpis(sc), base.max_wait_minutes):
            best = kw
            kw -= STEP_KW
        else:
            break
    return best


def main() -> None:
    path = sys.argv[1] if len(sys.argv) > 1 else \
        "scenarios/hub_waxahachie_austin.json"
    base = load_scenario(path)
    base.sim_days = 7.0
    print(f"Scenario: {base.name} ({base.fleet_size} trucks, "
          f"{base.sim_days:g} days)\n")

    ref_sc = base.copy()
    _unconstrain_all(ref_sc)
    ref = _kpis(ref_sc)
    print(f"Unconstrained reference: {ref['throughput']:.1f} trips/day, "
          f"avg wait {ref['avg_wait']:.1f} min\n")

    sites = [s for s in base.sites if s.has_charging]
    results = []
    for s in sites:
        nameplate = _site_nameplate_kw(base, s.name)
        min_kw = minimum_cap(base, s.name, ref)
        results.append((s.name, nameplate, ref["peaks"].get(s.name, 0.0),
                        min_kw, s.demand_charge_usd_per_kw_month))

    # Validate all minimum caps applied together
    val_sc = base.copy()
    for name, _, _, min_kw, _ in results:
        _set_cap(val_sc, name, min_kw)
    val = _kpis(val_sc)
    passed = _ok(ref, val, base.max_wait_minutes)

    hdr = (f"{'site':24s} {'nameplate kW':>12s} {'sim peak kW':>11s} "
           f"{'min grid kW':>11s} {'w/ 20% margin':>13s} "
           f"{'demand save $/yr':>16s}")
    print(hdr)
    print("-" * len(hdr))
    for name, nameplate, peak, min_kw, dc in results:
        margin = round(min_kw * 1.2 / 100) * 100
        save = (nameplate - min_kw) * dc * 12
        print(f"{name:24s} {nameplate:12.0f} {peak:11.0f} "
              f"{min_kw:11.0f} {margin:13.0f} {save:16,.0f}")

    print(f"\nAll minimum caps together: {val['throughput']:.1f} trips/day, "
          f"avg wait {val['avg_wait']:.1f} min, p95 "
          f"{val['p95_wait']:.0f} min, stranded {val['stranded']:.0f} "
          f"-> {'PASS' if passed else 'FAIL'}")
    print("Site peaks under caps:",
          {k: round(v) for k, v in val["peaks"].items()})


if __name__ == "__main__":
    main()
