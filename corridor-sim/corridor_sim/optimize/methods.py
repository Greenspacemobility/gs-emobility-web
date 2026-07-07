"""Optimization methods: exhaustive, random search, and genetic algorithm.

All methods share the same interface: they take a :class:`SearchSpace` and
return an :class:`OptimizationRun` containing every evaluation, the best
candidate, and the Pareto front over (CAPEX, avg wait, -throughput).

Mixed-integer programming: an analytical MILP sizing model is a planned
addition (Pyomo/OR-Tools); the simulation-based methods here capture the
queueing dynamics a MILP would have to approximate.
"""
from __future__ import annotations

import random
from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional, Sequence

from corridor_sim.optimize.evaluate import (
    EvaluationResult, ObjectiveWeights, evaluate_candidate,
)
from corridor_sim.optimize.space import Candidate, SearchSpace

ProgressCallback = Callable[[int, int, EvaluationResult], None]


@dataclass
class OptimizationRun:
    """Everything an optimization produced."""

    method: str
    evaluations: List[EvaluationResult] = field(default_factory=list)

    @property
    def best(self) -> EvaluationResult:
        feasible = [e for e in self.evaluations if e.stranded == 0]
        pool = feasible or self.evaluations
        return min(pool, key=lambda e: e.fitness)

    @property
    def pareto(self) -> List[EvaluationResult]:
        return pareto_front(self.evaluations)

    def recommendation(self) -> Dict[str, object]:
        """Executive-summary dict for the best candidate."""
        b = self.best
        sites = {}
        for choice in b.candidate.choices:
            if choice.total_cabinets:
                sites[choice.site] = {
                    k: n for k, n in choice.counts if n > 0
                }
        return {
            "recommended_deployment": sites,
            "expected_throughput_trips_per_day": round(
                b.throughput_trips_per_day, 1),
            "avg_wait_min": round(b.avg_wait_min, 1),
            "fleet_utilization_pct": round(b.fleet_utilization_pct, 1),
            "total_capex_usd": round(b.capex_usd),
            "energy_delivered_mwh_per_day": round(b.energy_mwh_per_day, 1),
            "peak_demand_mw": round(b.peak_demand_mw, 2),
            "dispensers_total": b.n_dispensers,
            "stranded_trucks": b.stranded,
        }


def pareto_front(evals: Sequence[EvaluationResult]) -> List[EvaluationResult]:
    """Non-dominated set over (capex min, wait min, throughput max).

    Only feasible (non-stranding) candidates are eligible.
    """
    feasible = [e for e in evals if e.stranded == 0]
    front: List[EvaluationResult] = []
    for e in feasible:
        dominated = False
        for other in feasible:
            if other is e:
                continue
            if (other.capex_usd <= e.capex_usd
                    and other.avg_wait_min <= e.avg_wait_min
                    and other.throughput_trips_per_day >= e.throughput_trips_per_day
                    and (other.capex_usd < e.capex_usd
                         or other.avg_wait_min < e.avg_wait_min
                         or other.throughput_trips_per_day > e.throughput_trips_per_day)):
                dominated = True
                break
        if not dominated:
            front.append(e)
    # Deduplicate identical deployments
    seen = set()
    unique = []
    for e in sorted(front, key=lambda e: e.capex_usd):
        key = e.candidate.label()
        if key not in seen:
            seen.add(key)
            unique.append(e)
    return unique


# ---------------------------------------------------------------------------
# Methods
# ---------------------------------------------------------------------------

def _run_exhaustive(space: SearchSpace, sim_days: float,
                    weights: Optional[ObjectiveWeights],
                    progress: Optional[ProgressCallback],
                    max_evaluations: int) -> OptimizationRun:
    run = OptimizationRun(method="exhaustive")
    candidates = list(space.enumerate_all(max_candidates=max_evaluations))
    for i, cand in enumerate(candidates):
        ev = evaluate_candidate(cand, space.scenario, sim_days, weights)
        run.evaluations.append(ev)
        if progress:
            progress(i + 1, len(candidates), ev)
    return run


def _run_random(space: SearchSpace, sim_days: float,
                weights: Optional[ObjectiveWeights],
                progress: Optional[ProgressCallback],
                n_samples: int, seed: int) -> OptimizationRun:
    run = OptimizationRun(method="random")
    rng = random.Random(seed)
    seen = set()
    i = 0
    attempts = 0
    while i < n_samples and attempts < n_samples * 20:
        cand = space.random_candidate(rng)
        attempts += 1
        if cand.label() in seen:
            continue
        seen.add(cand.label())
        ev = evaluate_candidate(cand, space.scenario, sim_days, weights)
        run.evaluations.append(ev)
        i += 1
        if progress:
            progress(i, n_samples, ev)
    return run


def _run_genetic(space: SearchSpace, sim_days: float,
                 weights: Optional[ObjectiveWeights],
                 progress: Optional[ProgressCallback],
                 population: int, generations: int, seed: int,
                 elite: int = 2, tournament: int = 3,
                 mutation_rate: float = 0.25) -> OptimizationRun:
    run = OptimizationRun(method="genetic")
    rng = random.Random(seed)
    cache: Dict[str, EvaluationResult] = {}
    total = population * generations

    def score(cand: Candidate) -> EvaluationResult:
        key = cand.label()
        if key not in cache:
            cache[key] = evaluate_candidate(cand, space.scenario,
                                            sim_days, weights)
            run.evaluations.append(cache[key])
            if progress:
                progress(len(run.evaluations), total, cache[key])
        return cache[key]

    # Seed with the full build-out so a feasible anchor is always present
    pop = [space.max_candidate()]
    pop += [space.random_candidate(rng) for _ in range(population - 1)]
    scored = sorted((score(c) for c in pop), key=lambda e: e.fitness)
    for _ in range(generations - 1):
        next_pop: List[Candidate] = [e.candidate for e in scored[:elite]]
        while len(next_pop) < population:
            def pick() -> Candidate:
                contenders = rng.sample(scored, min(tournament, len(scored)))
                return min(contenders, key=lambda e: e.fitness).candidate
            child = SearchSpace.crossover(pick(), pick(), rng)
            child = space.mutate(child, rng, mutation_rate)
            next_pop.append(child)
        scored = sorted((score(c) for c in next_pop), key=lambda e: e.fitness)
    return run


def optimize(
    space: SearchSpace,
    method: str = "genetic",
    sim_days: float = 3.0,
    weights: Optional[ObjectiveWeights] = None,
    progress: Optional[ProgressCallback] = None,
    # method-specific knobs
    population: int = 16,
    generations: int = 10,
    n_samples: int = 60,
    max_evaluations: int = 5000,
    seed: int = 7,
) -> OptimizationRun:
    """Run an infrastructure search.

    Parameters
    ----------
    method:
        ``"exhaustive"`` (small spaces), ``"random"``, or ``"genetic"``.
    sim_days:
        Simulated horizon per evaluation (shorter = faster, noisier).
    """
    if method == "exhaustive":
        return _run_exhaustive(space, sim_days, weights, progress,
                               max_evaluations)
    if method == "random":
        return _run_random(space, sim_days, weights, progress,
                           n_samples, seed)
    if method == "genetic":
        return _run_genetic(space, sim_days, weights, progress,
                            population, generations, seed)
    raise ValueError(f"Unknown method '{method}' "
                     "(expected exhaustive | random | genetic)")
