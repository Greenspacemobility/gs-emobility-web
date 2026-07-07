"""Corridor-Sim Streamlit dashboard.

Run with:  streamlit run ui/app.py   (from the corridor-sim directory)

Pages (tabs):
  Scenario   -- fleet, dispatch, multipliers, per-site charger deployment
  Simulation -- run the DES, headline KPIs, map
  Results    -- SOC / power / queue / utilization / Gantt / heat map charts
  Optimization -- search deployments (exhaustive / random / genetic), Pareto
  Compare    -- side-by-side KPIs of saved runs
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

# Allow "streamlit run ui/app.py" without installing the package
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pandas as pd
import streamlit as st

from corridor_sim.charging.chargers import CHARGER_TYPES, CabinetConfig
from corridor_sim.config.presets import PRESET_SCENARIOS, build_preset
from corridor_sim.config.scenario import (FleetEntry, Scenario,
                                          load_scenario, save_scenario)
from corridor_sim.costs.model import CostModel
from corridor_sim.data.export import export_html_report, export_results_excel
from corridor_sim.optimize.methods import optimize
from corridor_sim.optimize.space import SearchSpace
from corridor_sim.sim.engine import run_scenario
from corridor_sim.vehicles.models import TRUCK_MODELS
from corridor_sim.viz import charts, maps

st.set_page_config(page_title="Corridor-Sim | I-35 EV Freight",
                   page_icon="⚡", layout="wide")

SCENARIO_DIR = Path(__file__).resolve().parents[1] / "scenarios"
SCENARIO_DIR.mkdir(exist_ok=True)


# ---------------------------------------------------------------------------
# Session state
# ---------------------------------------------------------------------------
if "scenario" not in st.session_state:
    st.session_state.scenario = build_preset("full_corridor")
if "runs" not in st.session_state:
    st.session_state.runs = {}          # name -> (scenario, result, costs)
if "opt_run" not in st.session_state:
    st.session_state.opt_run = None


def _current() -> Scenario:
    return st.session_state.scenario


def _load_scenario_into_state(scenario: Scenario) -> None:
    """Replace the working scenario and invalidate every scenario-bound
    widget by bumping the key revision -- otherwise the old widgets keep
    reporting their previous values and clobber the loaded deployment."""
    st.session_state.scenario = scenario
    st.session_state.scenario_rev = st.session_state.get("scenario_rev", 0) + 1


def _rev() -> int:
    return st.session_state.get("scenario_rev", 0)


# ---------------------------------------------------------------------------
# Sidebar: presets, save/load
# ---------------------------------------------------------------------------
with st.sidebar:
    st.title("⚡ Corridor-Sim")
    st.caption("EV freight corridor infrastructure planner — "
               "I-35 Laredo ↔ Dallas")

    preset = st.selectbox("Load preset scenario",
                          ["(keep current)"] + sorted(PRESET_SCENARIOS))
    if st.button("Load preset", use_container_width=True) \
            and preset != "(keep current)":
        _load_scenario_into_state(build_preset(preset))
        st.rerun()

    saved = sorted(p.stem for p in SCENARIO_DIR.glob("*.json"))
    if saved:
        pick = st.selectbox("Load saved scenario", saved)
        if st.button("Load from disk", use_container_width=True):
            _load_scenario_into_state(load_scenario(
                SCENARIO_DIR / f"{pick}.json"))
            st.rerun()

    st.divider()
    fname = st.text_input("Save current scenario as",
                          value=_current().name.lower().replace(" ", "_"))
    if st.button("💾 Save scenario", use_container_width=True):
        save_scenario(_current(), SCENARIO_DIR / f"{fname}.json")
        st.success(f"Saved scenarios/{fname}.json")

    st.divider()
    st.caption("Greenspace E-mobility · internal planning tool")


tab_scenario, tab_sim, tab_results, tab_opt, tab_cmp = st.tabs(
    ["📋 Scenario", "▶️ Simulation", "📊 Results", "🧬 Optimization",
     "⚖️ Compare"])


# ---------------------------------------------------------------------------
# Scenario tab
# ---------------------------------------------------------------------------
with tab_scenario:
    sc = _current()
    c1, c2 = st.columns([1, 1])
    with c1:
        sc.name = st.text_input("Scenario name", sc.name)
        sc.description = st.text_input("Description", sc.description)
        st.subheader("Fleet")
        n_tesla = st.number_input(
            "Tesla Semi", 0, 500,
            next((e.count for e in sc.fleet if e.truck_type == "tesla_semi"), 0))
        n_wind = st.number_input(
            "Windrose R700", 0, 500,
            next((e.count for e in sc.fleet
                  if e.truck_type == "windrose_r700"), 0))
        sc.fleet = [e for e in [FleetEntry("tesla_semi", int(n_tesla)),
                                FleetEntry("windrose_r700", int(n_wind))]
                    if e.count > 0]
        st.caption(f"Fleet size: **{sc.fleet_size}** trucks")

        st.subheader("Operations")
        sc.sim_days = st.slider("Simulated days", 2.0, 30.0,
                                float(sc.sim_days), 1.0)
        sc.dispatch.mode = st.selectbox(
            "Dispatch mode", ["interval", "wave", "random", "shift"],
            index=["interval", "wave", "random", "shift"
                   ].index(sc.dispatch.mode))
        sc.dispatch.headway_minutes = st.slider(
            "Departure headway (min)", 10.0, 240.0,
            float(sc.dispatch.headway_minutes), 5.0)
        sc.weather_multiplier = st.slider(
            "Weather consumption multiplier", 0.9, 1.5,
            float(sc.weather_multiplier), 0.05)
        sc.traffic_multiplier = st.slider(
            "Traffic time multiplier", 0.9, 1.6,
            float(sc.traffic_multiplier), 0.05)
        sc.max_wait_minutes = st.slider(
            "Max acceptable wait (min)", 5.0, 120.0,
            float(sc.max_wait_minutes), 5.0)

        st.subheader("Charging strategy")
        sc.warehouse_charge_policy = st.selectbox(
            "Warehouse charging policy", ["full", "hop"],
            index=["full", "hop"].index(sc.warehouse_charge_policy),
            help="full: top up to max SOC at warehouses. "
                 "hop: only charge enough to reach the next hub "
                 "(mobile-charger operating concept).")
        fixed_hub = st.toggle("Hubs always charge to a fixed SOC",
                              value=sc.enroute_target_soc is not None)
        if fixed_hub:
            sc.enroute_target_soc = st.slider(
                "Hub charge target (% SOC)", 50, 90,
                int((sc.enroute_target_soc or 0.80) * 100), 5) / 100.0
        else:
            sc.enroute_target_soc = None

        st.subheader("Roadside rescue service")
        sc.rescue_enabled = st.toggle(
            "Mobile-unit rescue of stranded trucks", value=sc.rescue_enabled,
            help="A mobile charger is dispatched from the nearest "
                 "mobile-equipped site; emergency fill to 95%.")
        sc.economics.external_rescue_calls_per_month = st.number_input(
            "External rescue calls sold /month", 0.0, 500.0,
            float(sc.economics.external_rescue_calls_per_month), 1.0,
            help="Third-party roadside rescues (revenue: call-out fee "
                 "+ premium $/kWh).")
    with c2:
        st.subheader("Charger deployment by site")
        for site in sc.sites:
            with st.expander(
                    f"**{site.name}**"
                    + (" 🏭" if site.is_warehouse else " ⛽")
                    + f" — {site.total_dispensers} dispensers deployed",
                    expanded=False):
                new_dep = []
                items = list(CHARGER_TYPES.items())
                per_row = 3
                for row_start in range(0, len(items), per_row):
                    row = items[row_start:row_start + per_row]
                    cols = st.columns(per_row)
                    for col, (key, ct) in zip(cols, row):
                        cur = next((c.count for c in site.deployment
                                    if c.charger_type == key), 0)
                        with col:
                            n = st.number_input(
                                ct.name, 0, 12, cur,
                                key=f"dep_{_rev()}_{site.name}_{key}")
                        if n > 0:
                            new_dep.append(CabinetConfig(key, int(n)))
                site.deployment = new_dep
                # Wallbox <-> mobile pairing preview
                from corridor_sim.charging.chargers import get_charger_type
                n_mob = sum(c.count for c in new_dep
                            if get_charger_type(c.charger_type).is_mobile)
                wb_kw = sum(get_charger_type(c.charger_type).cabinet_kw * c.count
                            for c in new_dep
                            if get_charger_type(c.charger_type).light_install
                            and not get_charger_type(c.charger_type).is_mobile)
                if n_mob and wb_kw:
                    per_unit = min(140.0, wb_kw / n_mob)
                    st.caption(
                        f"⚡ Wallboxes feed the mobile units: "
                        f"~{per_unit:.0f} kW refill per unit "
                        f"(217 kWh buffer refills in ~{217/per_unit:.1f} h). "
                        f"Dedicated feeder wallboxes don't charge trucks.")
                sc1, sc2, sc3 = st.columns(3)
                site.energy_price_usd_per_kwh = sc1.number_input(
                    "Energy $/kWh", 0.01, 1.0,
                    float(site.energy_price_usd_per_kwh), 0.005,
                    key=f"ep_{_rev()}_{site.name}", format="%.3f")
                site.demand_charge_usd_per_kw_month = sc2.number_input(
                    "Demand $/kW·mo", 0.0, 50.0,
                    float(site.demand_charge_usd_per_kw_month), 0.5,
                    key=f"dc_{_rev()}_{site.name}")
                site.grid_connection_kw = sc3.number_input(
                    "Grid limit kW", 500.0, 50000.0,
                    float(site.grid_connection_kw), 100.0,
                    key=f"gl_{_rev()}_{site.name}")
                sc4, sc5, sc6 = st.columns(3)
                site.retail_price_usd_per_kwh = sc4.number_input(
                    "Own fleet $/kWh", 0.0, 2.0,
                    float(site.retail_price_usd_per_kwh), 0.01,
                    key=f"rp_{_rev()}_{site.name}", format="%.2f",
                    help="What our fleet pays per kWh here (owned sites). "
                         "0 = no revenue.")
                site.retail_price_external_usd_per_kwh = sc5.number_input(
                    "3rd-party $/kWh", 0.0, 2.0,
                    float(site.retail_price_external_usd_per_kwh), 0.01,
                    key=f"re_{_rev()}_{site.name}", format="%.2f",
                    help="Public rate for third-party trucks.")
                site.external_trucks_per_day = sc6.number_input(
                    "3rd-party trucks/day", 0.0, 200.0,
                    float(site.external_trucks_per_day), 1.0,
                    key=f"et_{_rev()}_{site.name}",
                    help="Third-party charging demand (Poisson arrivals; "
                         "they share the same dispensers and queues).")
                tgt_pct = st.number_input(
                    "Charge target % (0 = scenario policy)", 0, 95,
                    int((site.charge_target_soc or 0) * 100), 5,
                    key=f"ct_{_rev()}_{site.name}",
                    help="Per-site departure SOC override, e.g. charge "
                         "deeper where energy is free/owned.")
                site.charge_target_soc = (tgt_pct / 100.0) if tgt_pct else None
                if site.is_warehouse:
                    site.dwell_minutes = st.slider(
                        "Warehouse dwell (min)", 15.0, 180.0,
                        float(site.dwell_minutes), 5.0,
                        key=f"dw_{_rev()}_{site.name}")

        st.subheader("Truck reference data")
        st.dataframe(pd.DataFrame([
            {"Model": t.name, "Battery kWh": t.battery_kwh,
             "Usable kWh": round(t.usable_kwh),
             "Max kW": t.max_charge_kw,
             "kWh/mi": t.consumption_kwh_per_mile,
             "Connector": t.connector}
            for t in TRUCK_MODELS.values()]), hide_index=True)


# ---------------------------------------------------------------------------
# Simulation tab
# ---------------------------------------------------------------------------
with tab_sim:
    sc = _current()
    left, right = st.columns([1, 2])
    with left:
        st.subheader("Run")
        st.write(f"**{sc.name}** — {sc.fleet_size} trucks, "
                 f"{sc.sim_days:g} days")
        total_disp = sum(s.total_dispensers for s in sc.sites)
        st.write(f"Deployed dispensers: **{total_disp}**")
        if st.button("▶️ Run simulation", type="primary",
                     use_container_width=True):
            with st.spinner("Simulating corridor..."):
                result = run_scenario(sc)
                costs = CostModel(sc).evaluate(result)
                st.session_state.runs[sc.name] = (sc.copy(), result, costs)
            st.success("Done")
        run = st.session_state.runs.get(sc.name)
        if run:
            _, result, costs = run
            k = result.fleet_kpis()
            e = result.energy_summary()
            st.metric("Throughput", f"{k['throughput_trips_per_day']:.1f} trips/day")
            m1, m2 = st.columns(2)
            m1.metric("Avg trip", f"{k['avg_trip_time_h']:.1f} h")
            m2.metric("Avg wait", f"{k['avg_wait_time_min']:.1f} min")
            m1.metric("Fleet utilization",
                      f"{k['fleet_utilization_pct']:.0f}%")
            m2.metric("Stranded", int(k["stranded_trucks"]))
            m1.metric("Rescues", int(k.get("roadside_rescues", 0)))
            m1.metric("Energy", f"{e['energy_delivered_mwh_per_day']:.1f} MWh/d")
            m2.metric("Peak demand", f"{e['total_peak_demand_mw']:.2f} MW")
            st.metric("Total CAPEX", f"${costs.total_capex/1e6:.2f} M")
            if costs.payback_years:
                st.caption(f"NPV ${costs.npv_usd/1e6:.1f}M · "
                           f"payback {costs.payback_years:.1f} y · "
                           f"LCOE ${costs.lcoe_usd_per_kwh:.3f}/kWh")
    with right:
        run = st.session_state.runs.get(sc.name)
        st.plotly_chart(
            maps.corridor_map(sc, run[1] if run else None),
            use_container_width=True)


# ---------------------------------------------------------------------------
# Results tab
# ---------------------------------------------------------------------------
with tab_results:
    sc = _current()
    run = st.session_state.runs.get(sc.name)
    if not run:
        st.info("Run a simulation first (Simulation tab).")
    else:
        _, result, costs = run
        r1, r2 = st.columns(2)
        r1.plotly_chart(charts.power_demand(result), use_container_width=True)
        r2.plotly_chart(charts.queue_lengths(result), use_container_width=True)
        r1.plotly_chart(charts.soc_over_time(result), use_container_width=True)
        r2.plotly_chart(charts.charger_utilization(result),
                        use_container_width=True)
        st.plotly_chart(charts.truck_gantt(result), use_container_width=True)
        st.plotly_chart(charts.wait_heatmap(result), use_container_width=True)

        st.subheader("Site KPIs")
        st.dataframe(result.site_kpis().round(1), hide_index=True)
        st.subheader("Financials")
        st.json(costs.summary())

        st.subheader("Truck movement animation")
        if st.toggle("Build animation (heavier)"):
            st.plotly_chart(maps.truck_animation(sc, result),
                            use_container_width=True)

        st.subheader("Export")
        e1, e2, e3 = st.columns(3)
        out_dir = Path(__file__).resolve().parents[1] / "exports"
        out_dir.mkdir(exist_ok=True)
        if e1.button("Excel workbook"):
            p = out_dir / f"{sc.name.replace(' ', '_')}.xlsx"
            export_results_excel(result, p)
            e1.success(f"Wrote {p}")
        if e2.button("HTML report (print → PDF)"):
            p = out_dir / f"{sc.name.replace(' ', '_')}_report.html"
            export_html_report(sc, result, costs, p)
            e2.success(f"Wrote {p}")
        e3.download_button(
            "Scenario JSON",
            json.dumps(sc.to_dict(), indent=2),
            file_name=f"{sc.name.replace(' ', '_')}.json")


# ---------------------------------------------------------------------------
# Optimization tab
# ---------------------------------------------------------------------------
with tab_opt:
    sc = _current()
    st.subheader("Infrastructure optimization")
    st.caption("Searches cabinet/dispenser deployments across all sites, "
               "evaluating each candidate with the discrete-event simulator.")
    o1, o2, o3, o4 = st.columns(4)
    method = o1.selectbox("Method", ["genetic", "random", "exhaustive"])
    sim_days = o2.slider("Days per evaluation", 1.0, 7.0, 2.0, 0.5)
    max_cabs = o3.slider("Max cabinets/type/site", 1, 4, 2)
    if method == "genetic":
        budget = o4.slider("Generations", 3, 25, 8)
    else:
        budget = o4.slider("Evaluations", 10, 300, 60, 10)

    space = SearchSpace(scenario=sc, max_cabinets_per_type=max_cabs)
    st.caption(f"Search space: {space.size():,} possible deployments · "
               f"charger types offered: {', '.join(space.charger_types)}")

    if st.button("🧬 Run optimization", type="primary"):
        bar = st.progress(0.0, text="Evaluating candidates...")
        best_wait = [float("inf")]

        def cb(i, total, ev):
            if ev.stranded == 0:
                best_wait[0] = min(best_wait[0], ev.avg_wait_min)
            note = ("" if best_wait[0] == float("inf")
                    else f" — best feasible avg wait {best_wait[0]:.1f} min")
            bar.progress(min(1.0, i / max(1, total)),
                         text=f"Candidate {i}/{total}{note}")

        opt = optimize(space, method=method, sim_days=sim_days,
                       progress=cb,
                       population=12,
                       generations=budget if method == "genetic" else 10,
                       n_samples=budget if method != "genetic" else 60,
                       max_evaluations=min(2000, budget * 10)
                       if method == "exhaustive" else 5000)
        st.session_state.opt_run = opt
        bar.progress(1.0, text=f"Done — {len(opt.evaluations)} candidates")

    opt = st.session_state.opt_run
    if opt:
        st.plotly_chart(charts.pareto_scatter(opt.evaluations),
                        use_container_width=True)
        st.subheader("Recommendation")
        rec = opt.recommendation()
        st.json(rec)
        st.subheader("Pareto-optimal deployments")
        rows = [{
            "CAPEX ($M)": round(e.capex_usd / 1e6, 2),
            "Avg wait (min)": round(e.avg_wait_min, 1),
            "Trips/day": round(e.throughput_trips_per_day, 1),
            "Utilization %": round(e.fleet_utilization_pct, 1),
            "Peak MW": round(e.peak_demand_mw, 2),
            "Deployment": e.candidate.label(),
        } for e in opt.pareto]
        st.dataframe(pd.DataFrame(rows), hide_index=True)
        if st.button("Apply recommended deployment to current scenario"):
            applied = opt.best.candidate.apply(sc)
            applied.name = sc.name + " (optimized)"
            _load_scenario_into_state(applied)
            st.success("Applied — see Scenario tab, then re-run simulation.")


# ---------------------------------------------------------------------------
# Compare tab
# ---------------------------------------------------------------------------
with tab_cmp:
    runs = st.session_state.runs
    if len(runs) < 1:
        st.info("Run one or more simulations; each named scenario appears here.")
    else:
        rows = []
        for name, (s, result, costs) in runs.items():
            k = result.fleet_kpis()
            e = result.energy_summary()
            rows.append({
                "scenario": name,
                "fleet": s.fleet_size,
                "throughput_trips_per_day": round(
                    k["throughput_trips_per_day"], 1),
                "avg_trip_time_h": round(k["avg_trip_time_h"], 2),
                "avg_wait_time_min": round(k["avg_wait_time_min"], 1),
                "fleet_utilization_pct": round(k["fleet_utilization_pct"], 1),
                "energy_mwh_per_day": round(
                    e["energy_delivered_mwh_per_day"], 1),
                "peak_mw": round(e["total_peak_demand_mw"], 2),
                "capex_musd": round(costs.total_capex / 1e6, 2),
                "npv_musd": round(costs.npv_usd / 1e6, 1),
            })
        df = pd.DataFrame(rows)
        st.dataframe(df, hide_index=True, use_container_width=True)
        st.plotly_chart(charts.scenario_comparison(rows),
                        use_container_width=True)
        if st.button("Clear stored runs"):
            st.session_state.runs = {}
            st.rerun()
