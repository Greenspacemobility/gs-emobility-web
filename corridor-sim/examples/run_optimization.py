"""Example: search for the minimum-CAPEX feasible deployment.

Usage:  python examples/run_optimization.py [genetic|random|exhaustive]

Prints the recommended deployment and the Pareto front.
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from corridor_sim.config.presets import build_preset
from corridor_sim.optimize.methods import optimize
from corridor_sim.optimize.space import SearchSpace


def main() -> None:
    method = sys.argv[1] if len(sys.argv) > 1 else "genetic"
    scenario = build_preset("full_corridor")
    space = SearchSpace(scenario=scenario, max_cabinets_per_type=2)
    print(f"Method: {method} | search space: {space.size():,} deployments")

    def progress(i, total, ev):
        flag = "STRANDED" if ev.stranded else f"wait {ev.avg_wait_min:5.1f}m"
        print(f"  [{i:3d}/{total}] ${ev.capex_usd/1e6:5.2f}M  "
              f"{ev.throughput_trips_per_day:5.1f} trips/d  {flag}")

    run = optimize(space, method=method, sim_days=2.0,
                   population=10, generations=6, n_samples=40,
                   progress=progress)

    print("\n=== Recommendation ===")
    for k, v in run.recommendation().items():
        print(f"  {k}: {v}")

    print("\n=== Pareto front ===")
    for e in run.pareto:
        print(f"  ${e.capex_usd/1e6:5.2f}M | wait {e.avg_wait_min:5.1f} min | "
              f"{e.throughput_trips_per_day:5.1f} trips/d | "
              f"{e.candidate.label()}")


if __name__ == "__main__":
    main()
