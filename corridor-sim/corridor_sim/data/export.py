"""Result exports: CSV bundle, Excel workbook, standalone HTML report.

The HTML report embeds interactive Plotly charts and is the print-to-PDF
deliverable for executive decks (File > Print > Save as PDF preserves the
charts as vector graphics).
"""
from __future__ import annotations

from pathlib import Path
from typing import Dict, Optional

import pandas as pd

from corridor_sim.config.scenario import Scenario
from corridor_sim.costs.model import CostBreakdown
from corridor_sim.sim.metrics import SimulationResult
from corridor_sim.viz import charts, maps


def export_results_csv(result: SimulationResult, out_dir: "str | Path") -> None:
    """Write trips, sessions, and site KPI tables as CSV files."""
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    result.trips_frame().to_csv(out / "trips.csv", index=False)
    result.sessions_frame().to_csv(out / "charge_sessions.csv", index=False)
    result.site_kpis().to_csv(out / "site_kpis.csv", index=False)
    pd.DataFrame([result.fleet_kpis()]).to_csv(out / "fleet_kpis.csv",
                                               index=False)


def export_results_excel(result: SimulationResult,
                         path: "str | Path") -> None:
    """Single Excel workbook with one sheet per table."""
    with pd.ExcelWriter(path, engine="openpyxl") as xl:
        pd.DataFrame([result.fleet_kpis()]).to_excel(
            xl, sheet_name="Fleet KPIs", index=False)
        result.site_kpis().to_excel(xl, sheet_name="Site KPIs", index=False)
        result.trips_frame().to_excel(xl, sheet_name="Trips", index=False)
        result.sessions_frame().to_excel(
            xl, sheet_name="Charge Sessions", index=False)


def export_html_report(scenario: Scenario, result: SimulationResult,
                       costs: Optional[CostBreakdown],
                       path: "str | Path") -> None:
    """Standalone interactive HTML report (print to PDF for decks)."""
    kpis = result.fleet_kpis()
    energy = result.energy_summary()
    figs = [
        maps.corridor_map(scenario, result),
        charts.power_demand(result),
        charts.soc_over_time(result),
        charts.queue_lengths(result),
        charts.charger_utilization(result),
        charts.truck_gantt(result),
    ]
    kpi_rows = "".join(
        f"<tr><td>{k.replace('_', ' ')}</td><td>{v:,.1f}</td></tr>"
        for k, v in kpis.items())
    cost_rows = ""
    if costs:
        cost_rows = "".join(
            f"<tr><td>{k.replace('_', ' ')}</td><td>{v}</td></tr>"
            for k, v in costs.summary().items())
    parts = [f"""<!doctype html><html><head><meta charset="utf-8">
<title>Corridor report - {scenario.name}</title>
<style>
 body{{font-family:-apple-system,Segoe UI,sans-serif;margin:2rem;color:#212529}}
 h1{{color:#0b7285}} table{{border-collapse:collapse;margin:1rem 0}}
 td{{border:1px solid #dee2e6;padding:4px 12px}} .row{{display:flex;gap:3rem}}
</style></head><body>
<h1>EV Corridor Simulation Report</h1>
<p><b>Scenario:</b> {scenario.name} &mdash; {scenario.description}</p>
<p><b>Fleet:</b> {scenario.fleet_size} trucks &middot;
<b>Simulated:</b> {scenario.sim_days:g} days &middot;
<b>Energy:</b> {energy['energy_delivered_mwh_per_day']:.1f} MWh/day &middot;
<b>Peak:</b> {energy['total_peak_demand_mw']:.2f} MW</p>
<div class="row"><div><h2>Fleet KPIs</h2><table>{kpi_rows}</table></div>
<div><h2>Financials</h2><table>{cost_rows}</table></div></div>
"""]
    for i, fig in enumerate(figs):
        parts.append(fig.to_html(full_html=False,
                                 include_plotlyjs=(i == 0)))
    parts.append("</body></html>")
    Path(path).write_text("\n".join(parts))
