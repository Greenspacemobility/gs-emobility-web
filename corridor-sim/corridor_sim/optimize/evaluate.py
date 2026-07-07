"""Simulation-based candidate evaluation and scalarized fitness.

Each candidate deployment is scored by running the discrete-event
simulation on a shortened horizon and combining:

* total CAPEX (minimize)
* average + p95 charger wait (minimize)
* throughput in trips/day (maximize)
* stranded trucks (hard penalty -- infeasible deployments)
* wait beyond the scenario's ``max_wait_minutes`` (soft penalty)

The scalar fitness is used by the GA / random search; the full objective
vector is retained so Pareto fronts can be reported afterwards.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Optional

from corridor_sim.config.scenario import Scenario
from corridor_sim.costs.model import CostModel
from corridor_sim.optimize.space import Candidate
from corridor_sim.sim.engine import run_scenario


@dataclass
class ObjectiveWeights:
    """Relative weights of the scalarized fitness (USD-equivalent)."""

    capex: float = 1.0                       # $ per $
    wait_usd_per_min_per_session: float = 40.0
    throughput_usd_per_trip_day: float = 40_000.0
    stranded_penalty_usd: float = 5_000_000.0
    excess_wait_penalty_usd_per_min: float = 2_000.0


@dataclass
class EvaluationResult:
    """Objectives + fitness for one candidate."""

    candidate: Candidate
    fitness: float                 # lower is better
    capex_usd: float
    throughput_trips_per_day: float
    avg_wait_min: float
    p95_wait_min: float
    stranded: int
    fleet_utilization_pct: float
    energy_mwh_per_day: float
    peak_demand_mw: float
    n_dispensers: int

    def objectives(self) -> Dict[str, float]:
        return {
            "capex_usd": self.capex_usd,
            "avg_wait_min": self.avg_wait_min,
            "throughput_trips_per_day": self.throughput_trips_per_day,
        }


def evaluate_candidate(
    candidate: Candidate,
    base_scenario: Scenario,
    sim_days: float = 3.0,
    weights: Optional[ObjectiveWeights] = None,
) -> EvaluationResult:
    """Run the DES for one candidate and score it."""
    w = weights or ObjectiveWeights()
    sc = candidate.apply(base_scenario)
    sc.sim_days = sim_days
    sc.warmup_days = min(base_scenario.warmup_days, sim_days / 3.0)
    result = run_scenario(sc)

    kpis = result.fleet_kpis()
    energy = result.energy_summary()
    capex = CostModel(sc).total_capex()

    avg_wait = kpis["avg_wait_time_min"]
    p95_wait = kpis["p95_wait_time_min"]
    throughput = kpis["throughput_trips_per_day"]
    stranded = int(kpis["stranded_trucks"])

    fitness = (
        w.capex * capex
        + w.wait_usd_per_min_per_session * avg_wait * max(1.0, len(result.sessions))
        - w.throughput_usd_per_trip_day * throughput
        + w.stranded_penalty_usd * stranded
        + w.excess_wait_penalty_usd_per_min
        * max(0.0, p95_wait - base_scenario.max_wait_minutes)
    )
    n_disp = sum(sc.site(s.name).total_dispensers for s in sc.sites)
    return EvaluationResult(
        candidate=candidate,
        fitness=fitness,
        capex_usd=capex,
        throughput_trips_per_day=throughput,
        avg_wait_min=avg_wait,
        p95_wait_min=p95_wait,
        stranded=stranded,
        fleet_utilization_pct=kpis["fleet_utilization_pct"],
        energy_mwh_per_day=energy["energy_delivered_mwh_per_day"],
        peak_demand_mw=energy["total_peak_demand_mw"],
        n_dispensers=n_disp,
    )
