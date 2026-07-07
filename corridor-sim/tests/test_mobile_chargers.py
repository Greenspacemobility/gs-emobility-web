"""Tests: mobile battery-buffered chargers (iTrailer) and the hop policy."""
import pytest

from corridor_sim.charging.chargers import get_charger_type
from corridor_sim.config.presets import build_preset
from corridor_sim.config.scenario import load_scenario, save_scenario
from corridor_sim.costs.model import CostModel
from corridor_sim.sim.engine import run_scenario


def test_itrailer_spec():
    ct = get_charger_type("itrailer_217")
    assert ct.is_mobile
    assert ct.buffer_kwh == 217.0
    assert ct.per_session_kw(1) == 180.0   # single gun
    assert ct.per_session_kw(2) == 90.0    # double gun
    assert ct.grid_recharge_kw == 50.0
    assert not get_charger_type("tesla_mcs").is_mobile


def test_mobile_preset_runs_without_stranding():
    sc = build_preset("mobile_warehouse_hubs")
    sc.sim_days = 3.0
    sc.warmup_days = 0.5
    result = run_scenario(sc)
    assert not result.stranded_trucks
    assert result.fleet_kpis()["throughput_trips_per_day"] > 5.0


def test_hub_80_policy_reflected_in_sessions():
    sc = build_preset("mobile_warehouse_hubs")
    sc.sim_days = 2.0
    sc.warmup_days = 0.5
    result = run_scenario(sc)
    hub_sessions = [s for s in result.sessions
                    if s.site in ("Fuel America Encinal", "Waco Area")]
    assert hub_sessions
    # hub stops end at >= ~80% SOC (or the truck's max if the leg needs more)
    assert all(s.end_soc >= 0.79 for s in hub_sessions)


def test_warehouse_grid_draw_capped_at_replenishment():
    """Mobile units never pull more than their AC feed from the grid,
    regardless of how hard they discharge into trucks."""
    sc = build_preset("mobile_warehouse_hubs")
    sc.sim_days = 2.0
    sc.warmup_days = 0.5
    result = run_scenario(sc)
    kpis = result.site_kpis().set_index("site")
    for wh in ("Warehouse Laredo", "Warehouse Dallas"):
        # 4 units x 50 kW replenishment = 200 kW max grid draw
        assert kpis.loc[wh, "peak_demand_kw"] <= 200.0 + 1e-6


def test_buffer_throttles_sustained_throughput():
    """With the buffer exhausted, delivery falls to the 50 kW feed: a
    lone iTrailer cannot sustainably deliver faster than it refills."""
    sc = build_preset("mobile_warehouse_hubs")
    sc.sim_days = 3.0
    sc.warmup_days = 0.5
    result = run_scenario(sc)
    days = result.analysis_days
    for wh in ("Warehouse Laredo", "Warehouse Dallas"):
        delivered_per_day = result.site_energy_kwh[wh] / days
        # 4 units x 50 kW x 24 h = 4800 kWh/day sustained ceiling
        assert delivered_per_day <= 4800.0 * 1.1


def test_mobile_capex_much_cheaper_than_stationary():
    sc = build_preset("mobile_warehouse_hubs")
    cm = CostModel(sc)
    # warehouse = 4 mobile units, no transformer/civil/interconnect
    wh = cm.site_capex("Warehouse Laredo")
    hub = cm.site_capex("Fuel America Encinal")
    assert wh < 700_000
    assert hub > 2_000_000
    assert wh < hub / 3


def test_strategy_fields_serialize(tmp_path):
    sc = build_preset("mobile_warehouse_hubs")
    p = tmp_path / "mobile.json"
    save_scenario(sc, p)
    sc2 = load_scenario(p)
    assert sc2.warehouse_charge_policy == "hop"
    assert sc2.enroute_target_soc == pytest.approx(0.80)


def test_dc_wallbox_40_registered():
    ct = get_charger_type("autel_wallbox_40")
    assert not ct.is_mobile
    assert ct.light_install
    assert ct.dispensers == 1
    assert ct.per_session_kw(1) == 40.0
    # heavy cabinets are not light-install
    assert not get_charger_type("tesla_mcs").light_install


def test_wallbox_capex_is_light():
    """A warehouse with only wallboxes must not pay heavy civil works."""
    from corridor_sim.charging.chargers import CabinetConfig
    sc = build_preset("full_corridor")
    laredo = sc.site("Warehouse Laredo")
    laredo.deployment = [CabinetConfig("autel_wallbox_40", 4)]
    cm = CostModel(sc)
    wb_capex = cm.site_capex("Warehouse Laredo")
    # 4 x $9k hardware + 4 x $3k mount + 15% of site fixed costs -> well
    # under $150k; a stationary-cabinet site costs $1M+
    assert wb_capex < 150_000
    heavy = cm.site_capex("Warehouse Dallas")
    assert heavy > 1_000_000


def test_wallbox_charges_truck_slowly():
    """A 40 kW wallbox delivers at most 40 kW to a Windrose during dwell."""
    from corridor_sim.charging.chargers import CabinetConfig
    sc = build_preset("mobile_warehouse_hubs")
    sc.fleet = sc.fleet[1:]  # windrose only
    sc.site("Warehouse Laredo").deployment = [
        CabinetConfig("autel_wallbox_40", 2)]
    sc.warehouse_charge_policy = "full"  # force warehouse top-ups to max SOC
    sc.sim_days = 2.0
    sc.warmup_days = 0.5
    result = run_scenario(sc)
    wb_sessions = [s for s in result.sessions
                   if s.site == "Warehouse Laredo"
                   and s.charger_type == "autel_wallbox_40"]
    assert wb_sessions
    for s in wb_sessions:
        dur_h = s.end_h - s.start_h
        if dur_h > 0.1:
            assert s.energy_kwh / dur_h <= 40.0 + 1e-6


def test_wallboxes_pair_with_mobile_units():
    """Wallboxes at a site with mobile units become dedicated feeders."""
    import simpy
    from corridor_sim.charging.chargers import CabinetConfig
    from corridor_sim.network.locations import SiteConfig
    from corridor_sim.sim.engine import SiteState

    env = simpy.Environment()
    cfg = SiteConfig(name="X", deployment=[
        CabinetConfig("lifeyounger_217", 1),
        CabinetConfig("autel_wallbox_40", 3),
    ])
    site = SiteState(env, cfg)
    mobile = next(c for c in site.cabinets if c.is_mobile)
    # 3 x 40 kW feed one unit (under its 140 kW DC input cap)
    assert mobile.recharge_kw == pytest.approx(120.0)
    feeders = [c for c in site.cabinets if c.dedicated_feeder]
    assert len(feeders) == 3
    # dedicated feeders are not truck-facing
    assert not any(c.dedicated_feeder
                   for c in site.compatible_cabinets("CCS_HD"))


def test_wallbox_surplus_beyond_dc_cap_serves_trucks():
    """5 wallboxes on one unit: 140 kW cap -> 4 dedicated, 1 for trucks."""
    import simpy
    from corridor_sim.charging.chargers import CabinetConfig
    from corridor_sim.network.locations import SiteConfig
    from corridor_sim.sim.engine import SiteState

    env = simpy.Environment()
    cfg = SiteConfig(name="X", deployment=[
        CabinetConfig("lifeyounger_217", 1),
        CabinetConfig("autel_wallbox_40", 5),
    ])
    site = SiteState(env, cfg)
    mobile = next(c for c in site.cabinets if c.is_mobile)
    assert mobile.recharge_kw == pytest.approx(140.0)   # DC input cap
    truck_facing = [c for c in site.compatible_cabinets("CCS_HD")
                    if c.ctype.key == "autel_wallbox_40"]
    assert len(truck_facing) == 1                        # the surplus box


def test_bare_lifeyounger_without_wallbox_has_no_feed():
    import simpy
    from corridor_sim.charging.chargers import CabinetConfig
    from corridor_sim.network.locations import SiteConfig
    from corridor_sim.sim.engine import SiteState

    env = simpy.Environment()
    cfg = SiteConfig(name="X", deployment=[
        CabinetConfig("lifeyounger_217", 1)])
    site = SiteState(env, cfg)
    mobile = site.cabinets[0]
    assert mobile.recharge_kw == 0.0   # nothing refills the buffer


def test_rescue_revives_stranded_truck():
    """A truck whose SOC ceiling can't reach the next hub gets a mobile
    rescue (95% emergency fill) instead of stranding."""
    from corridor_sim.charging.chargers import CabinetConfig
    from corridor_sim.config.scenario import FleetEntry
    sc = build_preset("full_corridor")
    # max_soc 0.72: Encinal->Waco (295 mi, needs ~0.87 to arrive at 10%)
    # is infeasible without an emergency fill
    sc.fleet = [FleetEntry("windrose_r700", 4, {"max_soc": 0.72})]
    sc.site("Warehouse Laredo").deployment.append(
        CabinetConfig("itrailer_217", 1))   # rescue base
    sc.rescue_enabled = True
    sc.sim_days = 2.0
    sc.warmup_days = 0.0
    result = run_scenario(sc)
    assert result.rescues, "expected at least one roadside rescue"
    assert not result.stranded_trucks
    r = result.rescues[0]
    assert r.energy_kwh > 0
    assert r.response_h > 0


def test_rescue_disabled_still_strands():
    from corridor_sim.charging.chargers import CabinetConfig
    from corridor_sim.config.scenario import FleetEntry
    sc = build_preset("full_corridor")
    sc.fleet = [FleetEntry("windrose_r700", 4, {"max_soc": 0.72})]
    sc.rescue_enabled = False
    sc.sim_days = 2.0
    sc.warmup_days = 0.0
    result = run_scenario(sc)
    assert result.stranded_trucks
    assert not result.rescues


def test_charging_revenue_at_owned_site():
    sc = build_preset("full_corridor")
    sc.site("Waco Area").retail_price_usd_per_kwh = 0.40
    sc.sim_days = 2.0
    sc.warmup_days = 0.5
    result = run_scenario(sc)
    cb = CostModel(sc).evaluate(result)
    assert cb.annual_charging_revenue > 0
    # matches Waco kWh * retail, annualized
    w = sc.warmup_days * 24.0
    waco_kwh = sum(s.energy_kwh for s in result.sessions
                   if s.site == "Waco Area" and s.end_h >= w)
    expected = waco_kwh * 0.40 * (365.0 / result.analysis_days)
    assert cb.annual_charging_revenue == pytest.approx(expected, rel=1e-6)


def test_external_rescue_service_revenue():
    sc = build_preset("full_corridor")
    sc.economics.external_rescue_calls_per_month = 10.0
    sc.sim_days = 2.0
    sc.warmup_days = 0.5
    result = run_scenario(sc)
    cb = CostModel(sc).evaluate(result)
    # 120 calls/yr x ($750 fee + 150 kWh x $1.00)
    assert cb.annual_rescue_revenue == pytest.approx(120 * 900.0)
    assert cb.annual_rescue_cost >= 120 * 250.0


def test_per_site_charge_target_override():
    """Laredo charge_target_soc=0.9 makes trucks depart deeper than the
    80% scenario rule."""
    sc = build_preset("full_corridor")
    sc.enroute_target_soc = 0.80
    sc.warehouse_charge_policy = "full"
    sc.site("Warehouse Laredo").charge_target_soc = 0.90
    sc.site("Warehouse Dallas").charge_target_soc = 0.80
    sc.sim_days = 2.0
    sc.warmup_days = 0.5
    result = run_scenario(sc)
    lar = [s for s in result.sessions if s.site == "Warehouse Laredo"]
    dal = [s for s in result.sessions if s.site == "Warehouse Dallas"]
    assert lar and dal
    assert max(s.end_soc for s in lar) > 0.88
    assert all(s.end_soc <= 0.81 for s in dal)


def test_two_tier_charging_revenue():
    """Own fleet pays the fleet rate; external trucks pay the public rate
    and show up as extra sessions on the same hardware."""
    sc = build_preset("full_corridor")
    waco = sc.site("Waco Area")
    waco.energy_price_usd_per_kwh = 0.10
    waco.retail_price_usd_per_kwh = 0.20
    waco.retail_price_external_usd_per_kwh = 0.30
    waco.external_trucks_per_day = 8.0
    sc.sim_days = 3.0
    sc.warmup_days = 0.5
    result = run_scenario(sc)
    ext = [s for s in result.sessions if s.truck_id.startswith("external-")]
    own = [s for s in result.sessions if not s.truck_id.startswith("external-")
           and s.site == "Waco Area"]
    assert ext and own
    cb = CostModel(sc).evaluate(result)
    assert cb.annual_charging_revenue_own > 0
    assert cb.annual_charging_revenue_external > 0
    # revenue math: kWh x tier price, annualized
    w = sc.warmup_days * 24.0
    ann = 365.0 / result.analysis_days
    exp_ext = sum(s.energy_kwh for s in ext if s.end_h >= w) * 0.30 * ann
    assert cb.annual_charging_revenue_external == pytest.approx(exp_ext, rel=1e-6)
    # external trucks never appear in fleet wait KPIs
    k = result.fleet_kpis()
    assert k["trips_completed"] > 0


def test_tesla_posts_never_feed_ccs_mobiles():
    """MCS integrated posts must not be hijacked as Lifeyounger feeders."""
    import simpy
    from corridor_sim.charging.chargers import CabinetConfig
    from corridor_sim.network.locations import SiteConfig
    from corridor_sim.sim.engine import SiteState

    env = simpy.Environment()
    cfg = SiteConfig(name="X", deployment=[
        CabinetConfig("lifeyounger_217", 1),
        CabinetConfig("autel_wallbox_40", 2),
        CabinetConfig("tesla_v4_integrated_125", 4),
    ])
    site = SiteState(env, cfg)
    mobile = next(c for c in site.cabinets if c.is_mobile)
    assert mobile.recharge_kw == pytest.approx(80.0)   # only the wallboxes
    tesla_posts = [c for c in site.cabinets
                   if c.ctype.key == "tesla_v4_integrated_125"]
    assert all(not p.dedicated_feeder for p in tesla_posts)
    assert len(site.compatible_cabinets("MCS")) == 4
