"""Preset scenarios for quick evaluation and demos.

Each preset is a factory returning a fresh :class:`Scenario`, so callers may
mutate the result freely. Presets cover the deployment ladder (warehouse
only -> +Encinal -> +Waco), fleet compositions, and growth cases.
"""
from __future__ import annotations

from typing import Callable, Dict, List, Optional

from corridor_sim.charging.chargers import CabinetConfig
from corridor_sim.config.scenario import FleetEntry, Scenario


def _deploy(scenario: Scenario, site_name: str,
            cabinets: List[CabinetConfig]) -> None:
    scenario.site(site_name).deployment = cabinets


def _mixed_fleet(n_tesla: int, n_windrose: int) -> List[FleetEntry]:
    fleet = []
    if n_tesla:
        fleet.append(FleetEntry("tesla_semi", n_tesla))
    if n_windrose:
        fleet.append(FleetEntry("windrose_r700", n_windrose))
    return fleet


def _base(name: str, description: str, n_tesla: int = 10,
          n_windrose: int = 10) -> Scenario:
    sc = Scenario(name=name, description=description,
                  fleet=_mixed_fleet(n_tesla, n_windrose))
    return sc


def _full_corridor_deployment(sc: Scenario) -> None:
    """Reference deployment covering both truck types at all four sites."""
    _deploy(sc, "Warehouse Laredo", [
        CabinetConfig("tesla_mcs", 2), CabinetConfig("autel_mcs_2d", 2)])
    _deploy(sc, "Warehouse Dallas", [
        CabinetConfig("tesla_mcs", 2), CabinetConfig("autel_mcs_2d", 2)])
    _deploy(sc, "Fuel America Encinal", [
        CabinetConfig("tesla_mcs", 1), CabinetConfig("autel_mcs_3d", 1)])
    _deploy(sc, "Waco Area", [
        CabinetConfig("tesla_mcs", 1), CabinetConfig("autel_mcs_3d", 1)])


def preset_warehouse_only() -> Scenario:
    sc = _base("Warehouse charging only",
               "Chargers at Laredo and Dallas warehouses only. Trucks must "
               "cross 430 mi without en-route charging -- stress case.")
    _deploy(sc, "Warehouse Laredo", [
        CabinetConfig("tesla_mcs", 2), CabinetConfig("autel_mcs_2d", 2)])
    _deploy(sc, "Warehouse Dallas", [
        CabinetConfig("tesla_mcs", 2), CabinetConfig("autel_mcs_2d", 2)])
    return sc


def preset_warehouse_encinal() -> Scenario:
    sc = _base("Warehouse + Encinal",
               "Warehouse charging plus the Fuel America Encinal site.")
    _deploy(sc, "Warehouse Laredo", [
        CabinetConfig("tesla_mcs", 2), CabinetConfig("autel_mcs_2d", 2)])
    _deploy(sc, "Warehouse Dallas", [
        CabinetConfig("tesla_mcs", 2), CabinetConfig("autel_mcs_2d", 2)])
    _deploy(sc, "Fuel America Encinal", [
        CabinetConfig("tesla_mcs", 1), CabinetConfig("autel_mcs_3d", 1)])
    return sc


def preset_full_corridor() -> Scenario:
    sc = _base("Warehouse + Encinal + Waco",
               "Reference full-corridor deployment at all four sites.")
    _full_corridor_deployment(sc)
    return sc


def preset_tesla_only() -> Scenario:
    sc = _base("Tesla-only fleet", "20 Tesla Semis, Tesla MCS hardware only.",
               n_tesla=20, n_windrose=0)
    _deploy(sc, "Warehouse Laredo", [CabinetConfig("tesla_mcs", 2)])
    _deploy(sc, "Warehouse Dallas", [CabinetConfig("tesla_mcs", 2)])
    _deploy(sc, "Fuel America Encinal", [CabinetConfig("tesla_mcs", 1)])
    _deploy(sc, "Waco Area", [CabinetConfig("tesla_mcs", 1)])
    return sc


def preset_windrose_only() -> Scenario:
    sc = _base("Windrose-only fleet",
               "20 Windrose R700s, Autel/Sinexcel hardware only.",
               n_tesla=0, n_windrose=20)
    _deploy(sc, "Warehouse Laredo", [CabinetConfig("autel_mcs_2d", 2)])
    _deploy(sc, "Warehouse Dallas", [CabinetConfig("autel_mcs_2d", 2)])
    _deploy(sc, "Fuel America Encinal", [CabinetConfig("autel_mcs_3d", 1)])
    _deploy(sc, "Waco Area", [CabinetConfig("autel_mcs_3d", 1)])
    return sc


def preset_mobile_warehouse_hubs() -> Scenario:
    """The mobile-charger operating concept.

    Warehouses get a couple of iTrailer 217 kWh mobile units per connector
    (no construction) and only top trucks up enough to reach a hub
    ('hop' policy); the grid-connected hubs at Encinal and Waco carry the
    real charging load, returning every truck to 80% SOC.
    """
    sc = _base("Mobile chargers at warehouses + hubs to 80%",
               "iTrailer mobile units at both warehouses (hop top-ups only); "
               "Encinal and Waco grid hubs charge to 80% SOC.")
    sc.warehouse_charge_policy = "hop"
    sc.enroute_target_soc = 0.80
    for wh in ("Warehouse Laredo", "Warehouse Dallas"):
        _deploy(sc, wh, [CabinetConfig("itrailer_217", 2),
                         CabinetConfig("itrailer_217_mcs", 2)])
    for hub in ("Fuel America Encinal", "Waco Area"):
        _deploy(sc, hub, [CabinetConfig("tesla_mcs", 2),
                          CabinetConfig("autel_mcs_3d", 2)])
    return sc


def _growth(n: int) -> Scenario:
    sc = _base(f"Growth: {n} trucks",
               f"Mixed fleet scaled to {n} trucks on the reference "
               "full-corridor deployment.",
               n_tesla=n // 2, n_windrose=n - n // 2)
    _full_corridor_deployment(sc)
    return sc


PRESET_SCENARIOS: Dict[str, Callable[[], Scenario]] = {
    "warehouse_only": preset_warehouse_only,
    "warehouse_encinal": preset_warehouse_encinal,
    "full_corridor": preset_full_corridor,
    "tesla_only": preset_tesla_only,
    "windrose_only": preset_windrose_only,
    "mobile_warehouse_hubs": preset_mobile_warehouse_hubs,
    "growth_40": lambda: _growth(40),
    "growth_80": lambda: _growth(80),
    "growth_150": lambda: _growth(150),
}


def build_preset(key: str) -> Scenario:
    """Instantiate a preset scenario by key."""
    try:
        return PRESET_SCENARIOS[key]()
    except KeyError:
        raise KeyError(
            f"Unknown preset '{key}'. Available: {sorted(PRESET_SCENARIOS)}"
        ) from None
