"""Unit tests: scenario serialization and the financial model."""
import pytest

from corridor_sim.config.presets import build_preset
from corridor_sim.config.scenario import Scenario, load_scenario, save_scenario
from corridor_sim.costs.model import CostModel, irr, npv


def test_scenario_json_roundtrip(tmp_path):
    sc = build_preset("full_corridor")
    p = tmp_path / "sc.json"
    save_scenario(sc, p)
    sc2 = load_scenario(p)
    assert sc2.name == sc.name
    assert sc2.fleet_size == sc.fleet_size
    assert [s.name for s in sc2.sites] == [s.name for s in sc.sites]
    assert sc2.site("Waco Area").total_dispensers == \
        sc.site("Waco Area").total_dispensers


def test_scenario_copy_is_independent():
    sc = build_preset("full_corridor")
    cp = sc.copy()
    cp.site("Waco Area").deployment = []
    assert sc.site("Waco Area").deployment  # original untouched


def test_npv_and_irr():
    flows = [-1000.0] + [300.0] * 5
    assert npv(0.0, flows) == pytest.approx(500.0)
    r = irr(flows)
    assert r is not None and 0.14 < r < 0.16   # ~15.24%
    assert irr([-100.0, -50.0]) is None        # no sign change


def test_capex_scales_with_deployment():
    empty = build_preset("full_corridor")
    for s in empty.sites:
        s.deployment = []
    assert CostModel(empty).total_capex() == 0.0

    full = build_preset("full_corridor")
    capex = CostModel(full).total_capex()
    assert capex > 1_000_000  # eight+ cabinets, transformers, civil works

    bigger = build_preset("full_corridor")
    for s in bigger.sites:
        for c in s.deployment:
            c.count += 1
    assert CostModel(bigger).total_capex() > capex


def test_site_capex_zero_without_charging():
    sc = build_preset("warehouse_only")
    cm = CostModel(sc)
    assert cm.site_capex("Waco Area") == 0.0
    assert cm.site_capex("Warehouse Laredo") > 0.0
