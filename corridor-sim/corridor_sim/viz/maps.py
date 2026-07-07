"""Corridor map figures (Plotly, OpenStreetMap tiles -- no token needed)."""
from __future__ import annotations

from typing import Optional

import plotly.graph_objects as go

from corridor_sim.config.scenario import Scenario
from corridor_sim.sim.metrics import SimulationResult


def corridor_map(scenario: Scenario,
                 result: Optional[SimulationResult] = None) -> go.Figure:
    """Static corridor map: route line, sites sized by deployment."""
    route = scenario.route
    lats = [route.node_coords[n][0] for n in route.nodes if n in route.node_coords]
    lons = [route.node_coords[n][1] for n in route.nodes if n in route.node_coords]
    fig = go.Figure()
    fig.add_trace(go.Scattermapbox(
        lat=lats, lon=lons, mode="lines",
        line=dict(width=3, color="#1971c2"), name="I-35 corridor",
        hoverinfo="skip"))
    site_kpis = result.site_kpis().set_index("site") if result is not None else None
    for site in scenario.sites:
        if site.name not in route.node_coords:
            continue
        lat, lon = route.node_coords[site.name]
        disp = site.total_dispensers
        extra = ""
        if site_kpis is not None and site.name in site_kpis.index:
            row = site_kpis.loc[site.name]
            extra = (f"<br>Util: {row['charger_utilization_pct']:.0f}%"
                     f"<br>Peak: {row['peak_demand_kw']:.0f} kW"
                     f"<br>Avg wait: {row['avg_wait_min']:.1f} min")
        fig.add_trace(go.Scattermapbox(
            lat=[lat], lon=[lon], mode="markers",
            marker=dict(size=max(10, 8 + disp * 3),
                        color="#e8590c" if disp else "#868e96"),
            name=site.name,
            hovertemplate=(f"<b>{site.name}</b><br>"
                           f"Dispensers: {disp}{extra}<extra></extra>")))
    fig.update_layout(
        mapbox=dict(style="open-street-map",
                    center=dict(lat=30.2, lon=-98.1), zoom=5.4),
        margin=dict(l=0, r=0, t=30, b=0), height=560,
        title="I-35 corridor: Laredo - Dallas",
        legend=dict(bgcolor="rgba(255,255,255,0.8)"))
    return fig


def truck_animation(scenario: Scenario, result: SimulationResult,
                    start_h: float = 24.0, hours: float = 12.0,
                    frame_step: int = 2) -> go.Figure:
    """Animated truck positions along the corridor.

    Builds Plotly animation frames from the sampled truck mile markers
    (5-minute grid); ``frame_step`` skips samples to keep frames light.
    """
    route = scenario.route
    t = result.sample_times_h
    idx = [k for k, tt in enumerate(t) if start_h <= tt <= start_h + hours]
    idx = idx[::frame_step]
    ids = list(result.truck_mile)

    def frame_data(k: int):
        lats, lons, texts = [], [], []
        for tid in ids:
            mile = result.truck_mile[tid][k]
            soc = result.truck_soc[tid][k]
            state = result.truck_state[tid][k]
            lat, lon = route.coord_at_mile(mile)
            lats.append(lat)
            lons.append(lon)
            texts.append(f"{tid}<br>SOC {soc*100:.0f}% - {state}")
        return lats, lons, texts

    base_lats = [route.node_coords[n][0] for n in route.nodes]
    base_lons = [route.node_coords[n][1] for n in route.nodes]
    lats0, lons0, texts0 = frame_data(idx[0]) if idx else ([], [], [])
    fig = go.Figure(
        data=[
            go.Scattermapbox(lat=base_lats, lon=base_lons, mode="lines",
                             line=dict(width=2, color="#1971c2"),
                             hoverinfo="skip", name="corridor"),
            go.Scattermapbox(lat=lats0, lon=lons0, mode="markers",
                             marker=dict(size=10, color="#e8590c"),
                             text=texts0, hoverinfo="text", name="trucks"),
        ],
        frames=[
            go.Frame(
                name=f"{t[k]:.2f}",
                data=[go.Scattermapbox(),  # route unchanged
                      go.Scattermapbox(lat=fd[0], lon=fd[1], text=fd[2])],
                traces=[0, 1])
            for k in idx
            for fd in [frame_data(k)]
        ],
    )
    fig.update_layout(
        mapbox=dict(style="open-street-map",
                    center=dict(lat=30.2, lon=-98.1), zoom=5.2),
        margin=dict(l=0, r=0, t=30, b=0), height=600,
        title=f"Truck movement (t = {start_h:.0f}h to {start_h+hours:.0f}h)",
        updatemenus=[dict(
            type="buttons", showactive=False, y=0, x=0, xanchor="left",
            buttons=[
                dict(label="Play", method="animate",
                     args=[None, dict(frame=dict(duration=120, redraw=True),
                                      fromcurrent=True)]),
                dict(label="Pause", method="animate",
                     args=[[None], dict(frame=dict(duration=0, redraw=False),
                                        mode="immediate")]),
            ])],
        sliders=[dict(
            steps=[dict(label=f"{t[k]:.1f}h", method="animate",
                        args=[[f"{t[k]:.2f}"],
                              dict(mode="immediate",
                                   frame=dict(duration=0, redraw=True))])
                   for k in idx],
            x=0.1, len=0.85, y=0,
        )],
    )
    return fig
