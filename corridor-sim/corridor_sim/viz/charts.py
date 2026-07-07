"""Plotly chart builders for simulation results.

Every function takes a :class:`SimulationResult` (and sometimes extra data)
and returns a ``plotly.graph_objects.Figure`` so the UI, notebooks, and PDF
exports all render identical charts.
"""
from __future__ import annotations

from typing import Dict, List, Optional, Sequence

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

from corridor_sim.sim.metrics import SimulationResult

_TEMPLATE = "plotly_white"


def soc_over_time(result: SimulationResult,
                  truck_ids: Optional[Sequence[str]] = None) -> go.Figure:
    """SOC traces for selected trucks (default: first 8)."""
    ids = list(truck_ids or list(result.truck_soc)[:8])
    fig = go.Figure()
    t = result.sample_times_h
    for tid in ids:
        fig.add_trace(go.Scatter(
            x=t, y=[s * 100 for s in result.truck_soc.get(tid, [])],
            mode="lines", name=tid, line=dict(width=1.5)))
    fig.update_layout(template=_TEMPLATE, title="State of Charge over time",
                      xaxis_title="Simulation time (h)",
                      yaxis_title="SOC (%)", yaxis_range=[0, 100],
                      legend=dict(font=dict(size=10)))
    return fig


def power_demand(result: SimulationResult) -> go.Figure:
    """Stacked site power demand over time."""
    fig = go.Figure()
    t = result.sample_times_h
    for site, p in result.site_power_kw.items():
        fig.add_trace(go.Scatter(x=t, y=p, mode="lines", name=site,
                                 stackgroup="one", line=dict(width=0.5)))
    fig.update_layout(template=_TEMPLATE, title="Grid power demand by site",
                      xaxis_title="Simulation time (h)",
                      yaxis_title="Power (kW)")
    return fig


def queue_lengths(result: SimulationResult) -> go.Figure:
    fig = go.Figure()
    t = result.sample_times_h
    for site, q in result.site_queue_len.items():
        if result.site_dispenser_count.get(site, 0) == 0:
            continue
        fig.add_trace(go.Scatter(x=t, y=q, mode="lines", name=site))
    fig.update_layout(template=_TEMPLATE, title="Charging queue length by site",
                      xaxis_title="Simulation time (h)",
                      yaxis_title="Trucks waiting")
    return fig


def charger_utilization(result: SimulationResult) -> go.Figure:
    df = result.site_kpis()
    if df.empty:
        return go.Figure()
    df = df[df["dispensers"] > 0]
    fig = px.bar(df, x="site", y="charger_utilization_pct",
                 title="Charger (dispenser) utilization",
                 labels={"charger_utilization_pct": "Utilization (%)",
                         "site": ""},
                 text=df["charger_utilization_pct"].round(1))
    fig.update_layout(template=_TEMPLATE, yaxis_range=[0, 100])
    return fig


def wait_heatmap(result: SimulationResult) -> go.Figure:
    """Hour-of-day x site heat map of average charging wait."""
    df = result.sessions_frame()
    if df.empty:
        return go.Figure()
    df["hour"] = (df["arrive_h"] % 24).astype(int)
    pivot = df.pivot_table(index="site", columns="hour",
                           values="wait_min", aggfunc="mean")
    pivot = pivot.reindex(columns=range(24), fill_value=0).fillna(0)
    fig = px.imshow(pivot, aspect="auto", color_continuous_scale="YlOrRd",
                    labels=dict(x="Hour of day", y="", color="Avg wait (min)"),
                    title="Average charging wait by site and hour")
    fig.update_layout(template=_TEMPLATE)
    return fig


def truck_gantt(result: SimulationResult, max_trucks: int = 12,
                window_h: float = 48.0) -> go.Figure:
    """Gantt-style state timeline for the first trucks over a window."""
    colors = {"driving": "#2b8a3e", "charging": "#1971c2", "waiting": "#e03131",
              "loading": "#f08c00", "idle": "#adb5bd", "break": "#9c36b5",
              "stranded": "#000000"}
    rows = []
    ids = list(result.truck_state)[:max_trucks]
    t = result.sample_times_h
    for tid in ids:
        states = result.truck_state[tid]
        start = 0
        for k in range(1, len(states) + 1):
            if k == len(states) or states[k] != states[start]:
                t0, t1 = t[start], t[k - 1] if k < len(t) else t[-1]
                if t0 <= window_h:
                    rows.append(dict(truck=tid, state=states[start],
                                     start=t0, end=min(t1, window_h)))
                start = k
    if not rows:
        return go.Figure()
    fig = go.Figure()
    seen = set()
    for r in rows:
        fig.add_trace(go.Bar(
            x=[r["end"] - r["start"]], base=[r["start"]], y=[r["truck"]],
            orientation="h", marker_color=colors.get(r["state"], "#888"),
            name=r["state"], showlegend=r["state"] not in seen,
            hovertemplate=(f"{r['truck']}<br>{r['state']}: "
                           f"{r['start']:.1f}h - {r['end']:.1f}h<extra></extra>"),
        ))
        seen.add(r["state"])
    fig.update_layout(template=_TEMPLATE, barmode="stack",
                      title=f"Truck activity timeline (first {window_h:.0f} h)",
                      xaxis_title="Simulation time (h)",
                      yaxis=dict(autorange="reversed"), height=400)
    return fig


def pareto_scatter(evals: List, best_label: str = "") -> go.Figure:
    """CAPEX vs wait scatter of optimization evaluations, Pareto marked."""
    from corridor_sim.optimize.methods import pareto_front
    rows = [dict(capex=e.capex_usd / 1e6, wait=e.avg_wait_min,
                 throughput=e.throughput_trips_per_day,
                 stranded=e.stranded, label=e.candidate.label())
            for e in evals]
    df = pd.DataFrame(rows)
    front = {e.candidate.label() for e in pareto_front(evals)}
    df["pareto"] = df["label"].map(lambda l: "Pareto-optimal" if l in front
                                   else ("infeasible" if False else "dominated"))
    df.loc[df["stranded"] > 0, "pareto"] = "infeasible (stranded)"
    fig = px.scatter(
        df, x="capex", y="wait", color="pareto", size="throughput",
        hover_data={"label": True, "throughput": ":.1f"},
        color_discrete_map={"Pareto-optimal": "#e8590c",
                            "dominated": "#74c0fc",
                            "infeasible (stranded)": "#ced4da"},
        title="Optimization landscape: CAPEX vs average wait",
        labels={"capex": "CAPEX ($M)", "wait": "Avg wait (min)"})
    fig.update_layout(template=_TEMPLATE)
    return fig


def scenario_comparison(rows: List[Dict[str, object]]) -> go.Figure:
    """Grouped bar comparison of saved scenario KPI dictionaries."""
    df = pd.DataFrame(rows)
    metrics = ["throughput_trips_per_day", "avg_wait_time_min",
               "fleet_utilization_pct"]
    fig = go.Figure()
    for m in metrics:
        if m in df:
            fig.add_trace(go.Bar(name=m.replace("_", " "),
                                 x=df["scenario"], y=df[m]))
    fig.update_layout(template=_TEMPLATE, barmode="group",
                      title="Scenario comparison")
    return fig
