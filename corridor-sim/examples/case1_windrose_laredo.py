"""Case 1 -- Windrose fleet, Laredo warehouse mobile-charger depot.

Setup under study:
  * 10 Windrose R700 trucks.
  * Laredo Warehouse 1: ONE Lifeyounger 217 kWh mobile charger with 2 CCS1
    guns, replenished by ONE Autel 40 kW DC Wallbox. Up to 2 trucks charge
    at once (90 kW/gun when both busy, 180 kW single gun).
  * Trucks charge during a 2-hour loading window (charging concurrent with
    container loading, capped at 2 h).
  * First hub: Fuel America Encinal, 40 mi north.

Reports, per truck and fleet-average:
  * energy received in the 2-hour Laredo window,
  * SOC leaving Laredo and SOC arriving at Encinal,
  * how often the 2-gun / 40 kW-fed buffer is the binding constraint.

Usage:  python examples/case1_windrose_laredo.py
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from corridor_sim.charging.chargers import CabinetConfig
from corridor_sim.config.presets import build_preset
from corridor_sim.config.scenario import FleetEntry
from corridor_sim.sim.engine import run_scenario

WINDROSE_KWH_PER_MILE = 1.80
LAREDO_ENCINAL_MI = 40.0


def build_case1(window_h: float = 2.0, n_trucks: int = 10):
    """Windrose-only corridor with the Laredo Lifeyounger+Wallbox depot."""
    sc = build_preset("mobile_warehouse_hubs")
    sc.name = "Case 1 - Windrose Laredo depot"
    sc.fleet = [FleetEntry("windrose_r700", n_trucks)]
    sc.warehouse_charge_window_h = window_h   # charge while loading, 2 h cap
    sc.enroute_target_soc = 0.80              # hubs bring trucks back to 80%
    sc.sim_days = 10.0
    sc.warmup_days = 2.0

    # Laredo: exactly one Lifeyounger mobile charger fed by one 40 kW Wallbox
    laredo = sc.site("Warehouse Laredo")
    laredo.deployment = [CabinetConfig("lifeyounger_217_wb40", 1)]
    laredo.grid_connection_kw = 50.0          # the Wallbox's feed only
    # Dallas + hubs keep the corridor running (Windrose needs en-route hubs)
    sc.site("Warehouse Dallas").deployment = [
        CabinetConfig("lifeyounger_217_wb40", 2)]
    for hub in ("Fuel America Encinal", "Waco Area"):
        sc.site(hub).deployment = [CabinetConfig("autel_mcs_3d", 2)]
    return sc


def charge_capability(window_h: float = 2.0, buffer_kwh: float = 217.0,
                      wallbox_kw: float = 40.0, gun_kw: float = 90.0,
                      single_gun_kw: float = 180.0,
                      deliver_eff: float = 0.92, usable: float = 669.75):
    """Max energy a truck can absorb in the window (buffer starts full).

    Energy available = buffer + wallbox inflow over the window; power is
    capped by the gun. Returns (kWh to battery, SOC points) for the 1-truck
    and 2-trucks-simultaneous cases.
    """
    avail = buffer_kwh + wallbox_kw * window_h        # gross from the unit
    # one truck: single gun caps throughput
    one = min(avail, single_gun_kw * window_h) * deliver_eff
    # two trucks: 90 kW/gun cap each, share the same avail pool
    two_each = min(avail / 2.0, gun_kw * window_h) * deliver_eff
    return (one, one / usable, two_each, two_each / usable)


def main() -> None:
    one_kwh, one_soc, two_kwh, two_soc = charge_capability()
    print("=" * 74)
    print("CHARGING CAPABILITY in a 2-hour window (buffer starts full):")
    print(f"  1 truck  (180 kW gun) ....... up to {one_kwh:5.0f} kWh  "
          f"= {one_soc*100:4.0f} SOC points")
    print(f"  2 trucks (90 kW/gun each) ... up to {two_kwh:5.0f} kWh  "
          f"= {two_soc*100:4.0f} SOC points  EACH")
    print("  (capped by buffer 217 kWh + Wallbox 80 kWh over 2 h = 297 kWh,")
    print("   not by the guns; buffer needs ~5.4 h at 40 kW to fully refill.)")

    sc = build_case1()
    r = run_scenario(sc)
    w = sc.warmup_days * 24.0

    # --- Grid requirement for the Autel 40 kW Wallbox ---
    print("=" * 74)
    print("MINIMUM GRID REQUIREMENT (Autel 40 kW DC Wallbox at Laredo)")
    print("  Wallbox DC output ......... 40 kW")
    print("  AC->DC efficiency ......... ~0.94  ->  grid draw ~42.5 kW")
    print("  Service ................... 480 V 3-phase, 60 A  (~50 kVA)")
    print("  = a standard commercial service; no substation/transformer.")
    print("=" * 74)

    # --- Laredo depot: per-truck charging in the 2-hour window ---
    laredo = [s for s in r.sessions
              if s.site == "Warehouse Laredo" and s.end_h >= w]
    depart_socs = [s.end_soc for s in laredo]
    gained = [(s.end_soc - s.start_soc) for s in laredo]
    energy = [s.energy_kwh for s in laredo]
    dur = [s.duration_min for s in laredo]
    waits = [s.wait_min for s in laredo]

    usable = 669.75  # Windrose usable kWh
    target = sc.enroute_target_soc or 0.80
    reached = sum(1 for d in depart_socs if d >= target - 0.005)
    print(f"\nRULE: every truck must depart Laredo at >= {target*100:.0f}% SOC")
    print(f"Laredo 2-hour charging window  ({len(laredo)} sessions, "
          f"{sc.warmup_days:g}-day warm-up excluded):")
    print(f"  Arrival SOC at Laredo (avg) ...... {sum(s.start_soc for s in laredo)/len(laredo)*100:5.1f} %")
    print(f"  Energy delivered / truck (avg) ... {sum(energy)/len(energy):5.0f} kWh "
          f"(range {min(energy):.0f}-{max(energy):.0f})")
    print(f"  SOC gained / truck (avg) ......... {sum(gained)/len(gained)*100:5.1f} pts")
    print(f"  Departure SOC from Laredo (avg) .. {sum(depart_socs)/len(depart_socs)*100:5.1f} % "
          f"(range {min(depart_socs)*100:.0f}-{max(depart_socs)*100:.0f})")
    print(f"  Reached the 80% rule ............. {reached}/{len(laredo)} sessions "
          f"({'ALL OK' if reached == len(laredo) else 'SOME SHORT OF 80%'})")
    print(f"  Actual charge time (avg/max) ..... {sum(dur)/len(dur):5.0f} / {max(dur):.0f} min of the 120 min window")
    print(f"  Queue wait for a gun (avg/max) ... {sum(waits)/len(waits):4.1f} / {max(waits):.0f} min")

    # --- Arrival SOC at Encinal (first hub, 40 mi north) ---
    hop_frac = LAREDO_ENCINAL_MI * WINDROSE_KWH_PER_MILE / usable
    arr = [d - hop_frac for d in depart_socs]
    print(f"\nLaredo -> Encinal hop (40 mi, {LAREDO_ENCINAL_MI*WINDROSE_KWH_PER_MILE:.0f} kWh "
          f"= {hop_frac*100:.1f} SOC pts):")
    print(f"  Arrival SOC at Encinal (avg) ..... {sum(arr)/len(arr)*100:5.1f} % "
          f"(range {min(arr)*100:.0f}-{max(arr)*100:.0f})")
    print(f"  Min arrival SOC across fleet ..... {min(arr)*100:5.1f} %  "
          f"({'OK' if min(arr) > 0.10 else 'BELOW 10% FLOOR'})")

    k = r.fleet_kpis()
    print(f"\nFleet: {k['throughput_trips_per_day']:.1f} trips/day, "
          f"stranded {k['stranded_trucks']:.0f}, "
          f"Laredo mobile-charger utilization "
          f"{r.site_kpis().set_index('site').loc['Warehouse Laredo','charger_utilization_pct']:.0f}%")


if __name__ == "__main__":
    main()
