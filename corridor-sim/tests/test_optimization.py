"""Tests: search space, Pareto logic, and a small end-to-end optimization."""
import random

import pytest

from corridor_sim.config.presets import build_preset
from corridor_sim.optimize.evaluate import EvaluationResult, evaluate_candidate
from corridor_sim.optimize.methods import optimize, pareto_front
from corridor_sim.optimize.space import Candidate, SearchSpace, SiteChoice


def _space(max_cabs: int = 1) -> SearchSpace:
    sc = build_preset("full_corridor")
    sc.fleet = sc.fleet[:1]            # Tesla-only -> smaller space
    sc.fleet[0].count = 6
    return SearchSpace(scenario=sc, max_cabinets_per_type=max_cabs)


def test_space_filters_charger_types_by_fleet():
    space = _space()
    # Tesla-only fleet -> only MCS-connector hardware offered
    assert space.charger_types == ["tesla_mcs"]


def test_random_candidate_within_bounds():
    space = _space(max_cabs=2)
    rng = random.Random(1)
    for _ in range(20):
        cand = space.random_candidate(rng)
        for choice in cand.choices:
            for k, n in choice.counts:
                assert 0 <= n <= 2


def test_candidate_apply_replaces_deployment():
    space = _space()
    cand = Candidate(tuple(
        SiteChoice(s, (("tesla_mcs", 1),)) for s in space.sites))
    sc2 = cand.apply(space.scenario)
    assert all(sc2.site(s).total_dispensers == 2 for s in space.sites)
    # base scenario unchanged
    assert space.scenario.site("Warehouse Laredo").deployment


def _ev(capex, wait, thr, stranded=0, name="x"):
    # Distinct site name per candidate: pareto_front dedups by deployment
    # label, so identical labels would collapse distinct test candidates.
    cand = Candidate((SiteChoice(name, (("tesla_mcs", 1),)),))
    return EvaluationResult(
        candidate=cand, fitness=0.0, capex_usd=capex,
        throughput_trips_per_day=thr, avg_wait_min=wait, p95_wait_min=wait,
        stranded=stranded, fleet_utilization_pct=90.0,
        energy_mwh_per_day=10.0, peak_demand_mw=2.0, n_dispensers=4)


def test_pareto_front_dominance():
    a = _ev(1e6, 5.0, 20.0, name="a")     # cheap, fast
    b = _ev(2e6, 5.0, 20.0, name="b")     # dominated by a
    c = _ev(0.5e6, 30.0, 18.0, name="c")  # cheaper but slower -> non-dominated
    d = _ev(0.1e6, 1.0, 25.0, stranded=2, name="d")  # infeasible
    front = pareto_front([a, b, c, d])
    assert a in front and c in front
    assert b not in front and d not in front


def test_evaluate_candidate_scores_deployment():
    space = _space()
    cand = Candidate(tuple(
        SiteChoice(s, (("tesla_mcs", 1),)) for s in space.sites))
    ev = evaluate_candidate(cand, space.scenario, sim_days=1.5)
    assert ev.capex_usd > 0
    assert ev.stranded == 0
    assert ev.throughput_trips_per_day > 0


def test_genetic_optimization_small_run():
    space = _space(max_cabs=1)
    run = optimize(space, method="genetic", sim_days=1.0,
                   population=4, generations=2, seed=3)
    assert run.evaluations
    best = run.best
    assert best.stranded == 0
    rec = run.recommendation()
    assert "recommended_deployment" in rec
    assert rec["total_capex_usd"] > 0
