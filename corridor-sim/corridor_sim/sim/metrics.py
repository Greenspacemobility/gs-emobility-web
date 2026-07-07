"""Simulation output records and KPI computation.

The engine appends plain dataclass records while running; all KPI math
lives here so it can be unit-tested without running a simulation.

All times in records are **hours** from simulation start.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional

import pandas as pd


@dataclass
class TripRecord:
    """One completed one-way trip between warehouses."""

    truck_id: str
    truck_type: str
    origin: str
    destination: str
    depart_h: float
    arrive_h: float
    drive_h: float
    wait_h: float
    charge_h: float
    break_h: float
    n_charge_stops: int
    energy_used_kwh: float

    @property
    def duration_h(self) -> float:
        return self.arrive_h - self.depart_h


@dataclass
class ChargeSession:
    """One charging session (or warehouse top-up)."""

    truck_id: str
    truck_type: str
    site: str
    charger_type: str
    arrive_h: float
    start_h: float
    end_h: float
    energy_kwh: float
    start_soc: float
    end_soc: float
    energy_cost_usd: float

    @property
    def wait_min(self) -> float:
        return (self.start_h - self.arrive_h) * 60.0

    @property
    def duration_min(self) -> float:
        return (self.end_h - self.start_h) * 60.0


@dataclass
class RescueEvent:
    """A mobile unit dispatched to revive a range-stranded truck."""

    truck_id: str
    truck_type: str
    time_h: float
    mile: float
    dispatched_from: str
    response_h: float
    energy_kwh: float


@dataclass
class SimulationResult:
    """Everything a simulation run produced."""

    scenario_name: str
    sim_days: float
    warmup_days: float
    fleet_size: int
    trips: List[TripRecord] = field(default_factory=list)
    sessions: List[ChargeSession] = field(default_factory=list)
    stranded_trucks: List[str] = field(default_factory=list)
    rescues: List[RescueEvent] = field(default_factory=list)
    # Time series, sampled on a fixed grid
    sample_times_h: List[float] = field(default_factory=list)
    site_power_kw: Dict[str, List[float]] = field(default_factory=dict)
    site_queue_len: Dict[str, List[int]] = field(default_factory=dict)
    truck_soc: Dict[str, List[float]] = field(default_factory=dict)
    truck_mile: Dict[str, List[float]] = field(default_factory=dict)
    truck_state: Dict[str, List[str]] = field(default_factory=dict)
    # Aggregates maintained by the engine
    truck_state_hours: Dict[str, Dict[str, float]] = field(default_factory=dict)
    site_energy_kwh: Dict[str, float] = field(default_factory=dict)
    site_dispenser_count: Dict[str, int] = field(default_factory=dict)
    site_busy_dispenser_h: Dict[str, float] = field(default_factory=dict)

    # ------------------------------------------------------------------
    @property
    def analysis_days(self) -> float:
        """Days of data after the warm-up window."""
        return max(1e-9, self.sim_days - self.warmup_days)

    def _post_warmup_trips(self) -> List[TripRecord]:
        w = self.warmup_days * 24.0
        return [t for t in self.trips if t.arrive_h >= w]

    def _post_warmup_sessions(self, include_external: bool = True
                              ) -> List[ChargeSession]:
        w = self.warmup_days * 24.0
        return [s for s in self.sessions if s.end_h >= w
                and (include_external
                     or not s.truck_id.startswith("external-"))]

    # -- fleet KPIs ----------------------------------------------------
    def fleet_kpis(self) -> Dict[str, float]:
        trips = self._post_warmup_trips()
        # fleet wait stats must not be polluted by third-party sessions
        sessions = self._post_warmup_sessions(include_external=False)
        n = len(trips)
        days = self.analysis_days
        total_hours = sum(sum(d.values()) for d in self.truck_state_hours.values())
        drive_hours = sum(d.get("driving", 0.0) for d in self.truck_state_hours.values())
        productive = sum(d.get("driving", 0.0) + d.get("loading", 0.0)
                         for d in self.truck_state_hours.values())
        waits = [s.wait_min for s in sessions]
        return {
            "trips_completed": float(n),
            "throughput_trips_per_day": n / days,
            "avg_trip_time_h": (sum(t.duration_h for t in trips) / n) if n else 0.0,
            "avg_drive_time_h": (sum(t.drive_h for t in trips) / n) if n else 0.0,
            "avg_charge_time_h": (sum(t.charge_h for t in trips) / n) if n else 0.0,
            "avg_wait_time_min": (sum(waits) / len(waits)) if waits else 0.0,
            "max_wait_time_min": max(waits) if waits else 0.0,
            "p95_wait_time_min": (float(pd.Series(waits).quantile(0.95))
                                  if waits else 0.0),
            "fleet_utilization_pct": 100.0 * productive / total_hours if total_hours else 0.0,
            "driving_share_pct": 100.0 * drive_hours / total_hours if total_hours else 0.0,
            "stranded_trucks": float(len(self.stranded_trucks)),
            "roadside_rescues": float(len(
                [r for r in self.rescues if r.time_h >= self.warmup_days * 24.0])),
            "energy_consumed_kwh_per_day": (
                sum(t.energy_used_kwh for t in trips) / days),
        }

    # -- infrastructure KPIs --------------------------------------------
    def site_kpis(self) -> pd.DataFrame:
        """Per-site utilization, energy, peak demand and queue stats."""
        rows = []
        days = self.analysis_days
        w = self.warmup_days * 24.0
        for site, disp in self.site_dispenser_count.items():
            power = self.site_power_kw.get(site, [])
            queue = self.site_queue_len.get(site, [])
            mask = [t >= w for t in self.sample_times_h]
            p = [v for v, m in zip(power, mask) if m]
            q = [v for v, m in zip(queue, mask) if m]
            sessions = [s for s in self._post_warmup_sessions() if s.site == site]
            busy_h = self.site_busy_dispenser_h.get(site, 0.0)
            avail_h = disp * days * 24.0
            rows.append({
                "site": site,
                "dispensers": disp,
                "sessions": len(sessions),
                "energy_delivered_kwh_per_day": self.site_energy_kwh.get(site, 0.0) / days,
                "peak_demand_kw": max(p) if p else 0.0,
                "avg_demand_kw": (sum(p) / len(p)) if p else 0.0,
                "charger_utilization_pct": 100.0 * busy_h / avail_h if avail_h else 0.0,
                "avg_wait_min": (sum(s.wait_min for s in sessions) / len(sessions)
                                 if sessions else 0.0),
                "max_wait_min": max((s.wait_min for s in sessions), default=0.0),
                "avg_queue_len": (sum(q) / len(q)) if q else 0.0,
                "max_queue_len": max(q) if q else 0,
            })
        return pd.DataFrame(rows)

    # -- convenience frames for the UI / exports ------------------------
    def trips_frame(self) -> pd.DataFrame:
        return pd.DataFrame([vars(t) for t in self.trips])

    def sessions_frame(self) -> pd.DataFrame:
        rows = []
        for s in self.sessions:
            d = dict(vars(s))
            d["wait_min"] = s.wait_min
            d["duration_min"] = s.duration_min
            rows.append(d)
        return pd.DataFrame(rows)

    def energy_summary(self) -> Dict[str, float]:
        sessions = self._post_warmup_sessions()
        days = self.analysis_days
        delivered = sum(s.energy_kwh for s in sessions)
        cost = sum(s.energy_cost_usd for s in sessions)
        peaks = {site: max((v for v, t in zip(p, self.sample_times_h)
                            if t >= self.warmup_days * 24.0), default=0.0)
                 for site, p in self.site_power_kw.items()}
        return {
            "energy_delivered_mwh_per_day": delivered / days / 1000.0,
            "energy_cost_usd_per_day": cost / days,
            "corridor_peak_demand_mw": max(peaks.values(), default=0.0) / 1000.0,
            "total_peak_demand_mw": sum(peaks.values()) / 1000.0,
        }
