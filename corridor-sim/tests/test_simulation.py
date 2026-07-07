"""Integration tests: the discrete-event simulation engine."""
import pytest

from corridor_sim.config.presets import build_preset
from corridor_sim.config.scenario import FleetEntry
from corridor_sim.costs.model import CostModel
from corridor_sim.sim.engine import CorridorSimulation, run_scenario


def _quick(preset: str, days: float = 2.0):
    sc = build_preset(preset)
    sc.sim_days = days
    sc.warmup_days = 0.5
    return sc


def test_full_corridor_completes_trips():
    result = run_scenario(_quick("full_corridor"))
    assert len(result.trips) > 0
    assert not result.stranded_trucks
    k = result.fleet_kpis()
    assert k["throughput_trips_per_day"] > 5.0
    # A 430-mile trip at ~58 mph plus stops: between 7 and 16 hours
    assert 7.0 < k["avg_trip_time_h"] < 16.0


def test_energy_conservation_per_trip():
    result = run_scenario(_quick("tesla_only"))
    trip = result.trips[0]
    # 430 miles * 1.70 kWh/mi (Tesla fleet-proven) per one-way trip
    assert trip.energy_used_kwh == pytest.approx(430 * 1.70, rel=0.01)


def test_soc_stays_in_bounds():
    result = run_scenario(_quick("full_corridor"))
    for tid, socs in result.truck_soc.items():
        assert min(socs) > 0.0, f"{tid} hit 0 SOC"
        assert max(socs) <= 1.0


def test_no_midroute_chargers_strands_windrose():
    """Windrose (~298 mi range at 90%->10% SOC) cannot cross 430 mi
    warehouse-to-warehouse; with warehouse-only charging it must strand."""
    sc = _quick("warehouse_only")
    sc.fleet = [FleetEntry("windrose_r700", 4)]
    result = run_scenario(sc)
    assert result.stranded_trucks


def test_charge_sessions_recorded_with_costs():
    result = run_scenario(_quick("full_corridor"))
    assert result.sessions
    s = result.sessions[0]
    assert s.energy_kwh > 0
    assert s.energy_cost_usd >= 0
    assert s.end_soc > s.start_soc
    assert s.start_h >= s.arrive_h
    # Laredo warehouse energy is free; everywhere else costs money
    assert all(x.energy_cost_usd == 0 for x in result.sessions
               if x.site == "Warehouse Laredo")
    assert any(x.energy_cost_usd > 0 for x in result.sessions
               if x.site != "Warehouse Laredo")


def test_site_power_respects_grid_limit():
    sc = _quick("tesla_only")
    site = sc.site("Warehouse Laredo")
    site.grid_connection_kw = 1500.0     # tighter than 2 cabinets' 2400 kW
    result = run_scenario(sc)
    peaks = result.site_kpis().set_index("site")["peak_demand_kw"]
    # allow small tolerance for the sampling grid
    assert peaks["Warehouse Laredo"] <= 1500.0 * 1.05


def test_deterministic_with_same_seed():
    r1 = run_scenario(_quick("full_corridor"))
    r2 = run_scenario(_quick("full_corridor"))
    assert len(r1.trips) == len(r2.trips)
    assert r1.fleet_kpis() == r2.fleet_kpis()


def test_cost_model_end_to_end():
    sc = _quick("full_corridor")
    result = run_scenario(sc)
    cb = CostModel(sc).evaluate(result)
    assert cb.total_capex > 0
    assert cb.annual_energy_cost > 0
    assert cb.annual_energy_mwh > 0
    assert cb.lcoe_usd_per_kwh > 0
    summary = cb.summary()
    assert set(summary) >= {"total_capex_usd", "npv_usd", "lcoe_usd_per_kwh"}


def test_mixed_fleet_uses_compatible_hardware_only():
    result = run_scenario(_quick("full_corridor"))
    for s in result.sessions:
        if s.truck_type == "tesla_semi":
            assert s.charger_type == "tesla_mcs"
        else:
            assert s.charger_type.startswith("autel")
