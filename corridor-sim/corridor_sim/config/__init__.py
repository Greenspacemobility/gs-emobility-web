"""Scenario configuration, serialization, and presets."""
from .scenario import (
    Scenario, FleetEntry, DispatchConfig, EconomicsConfig,
    save_scenario, load_scenario,
)
from .presets import PRESET_SCENARIOS, build_preset

__all__ = [
    "Scenario", "FleetEntry", "DispatchConfig", "EconomicsConfig",
    "save_scenario", "load_scenario", "PRESET_SCENARIOS", "build_preset",
]
