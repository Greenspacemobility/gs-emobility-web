"""Example: run the reference full-corridor scenario headlessly.

Usage:  python examples/run_baseline.py [preset_key]

Runs the simulation, prints fleet / site / financial KPIs, and writes
CSV + Excel + HTML report exports to ./exports/.
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from corridor_sim.config.presets import PRESET_SCENARIOS, build_preset
from corridor_sim.config.scenario import save_scenario
from corridor_sim.costs.model import CostModel
from corridor_sim.data.export import (export_html_report, export_results_csv,
                                      export_results_excel)
from corridor_sim.sim.engine import run_scenario


def main() -> None:
    preset = sys.argv[1] if len(sys.argv) > 1 else "full_corridor"
    if preset not in PRESET_SCENARIOS:
        print(f"Unknown preset '{preset}'. Options: {sorted(PRESET_SCENARIOS)}")
        raise SystemExit(1)

    scenario = build_preset(preset)
    print(f"Scenario: {scenario.name} ({scenario.fleet_size} trucks, "
          f"{scenario.sim_days:g} days)")
    result = run_scenario(scenario)
    costs = CostModel(scenario).evaluate(result)

    print("\n--- Fleet KPIs ---")
    for k, v in result.fleet_kpis().items():
        print(f"  {k:35s} {v:10.2f}")
    print("\n--- Site KPIs ---")
    print(result.site_kpis().round(1).to_string(index=False))
    print("\n--- Energy ---")
    for k, v in result.energy_summary().items():
        print(f"  {k:35s} {v:10.2f}")
    print("\n--- Financials ---")
    for k, v in costs.summary().items():
        print(f"  {k:35s} {v}")

    out = Path(__file__).resolve().parents[1] / "exports"
    out.mkdir(exist_ok=True)
    export_results_csv(result, out / "csv")
    export_results_excel(result, out / f"{preset}.xlsx")
    export_html_report(scenario, result, costs, out / f"{preset}_report.html")
    save_scenario(scenario, out / f"{preset}_scenario.json")
    print(f"\nExports written to {out}")


if __name__ == "__main__":
    main()
