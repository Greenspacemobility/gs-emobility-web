"""Infrastructure financial model.

Combines a scenario's deployed hardware with simulation results to produce
CAPEX, annual OPEX, energy/demand charges, NPV, IRR, payback, LCOE and
per-truck / per-mile / per-kWh unit costs.

All money in USD. Annualization scales the post-warm-up simulated window
to a full year, so short runs still produce annual figures.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional

from corridor_sim.charging.chargers import get_charger_type
from corridor_sim.config.scenario import Scenario
from corridor_sim.sim.metrics import SimulationResult


def npv(rate: float, cashflows: List[float]) -> float:
    """Net present value; ``cashflows[0]`` is year 0 (undiscounted)."""
    return sum(cf / (1.0 + rate) ** t for t, cf in enumerate(cashflows))


def irr(cashflows: List[float], lo: float = -0.99, hi: float = 10.0,
        tol: float = 1e-7) -> Optional[float]:
    """Internal rate of return by bisection; None if no sign change."""
    f_lo, f_hi = npv(lo, cashflows), npv(hi, cashflows)
    if f_lo * f_hi > 0:
        return None
    for _ in range(200):
        mid = (lo + hi) / 2.0
        f_mid = npv(mid, cashflows)
        if abs(f_mid) < tol:
            return mid
        if f_lo * f_mid < 0:
            hi = mid
        else:
            lo, f_lo = mid, f_mid
    return (lo + hi) / 2.0


@dataclass
class CostBreakdown:
    """Full financial picture of one scenario + simulation result."""

    site_capex: Dict[str, float] = field(default_factory=dict)
    total_capex: float = 0.0
    annual_opex: float = 0.0
    annual_energy_cost: float = 0.0
    annual_demand_charges: float = 0.0
    annual_revenue: float = 0.0
    annual_charging_revenue: float = 0.0   # kWh sold at owned sites (total)
    annual_charging_revenue_own: float = 0.0       # our fleet's sessions
    annual_charging_revenue_external: float = 0.0  # third-party trucks
    annual_rescue_revenue: float = 0.0     # external roadside-rescue service
    annual_rescue_cost: float = 0.0        # all dispatches (own + external)
    npv_usd: float = 0.0
    irr_pct: Optional[float] = None
    payback_years: Optional[float] = None
    lcoe_usd_per_kwh: float = 0.0
    cost_per_truck: float = 0.0
    cost_per_mile: float = 0.0
    annual_energy_mwh: float = 0.0
    annual_trips: float = 0.0

    def summary(self) -> Dict[str, object]:
        return {
            "total_capex_usd": round(self.total_capex),
            "annual_opex_usd": round(self.annual_opex),
            "annual_energy_cost_usd": round(self.annual_energy_cost),
            "annual_demand_charges_usd": round(self.annual_demand_charges),
            "annual_revenue_usd": round(self.annual_revenue),
            "annual_charging_revenue_usd": round(self.annual_charging_revenue),
            "charging_revenue_own_fleet_usd": round(
                self.annual_charging_revenue_own),
            "charging_revenue_external_usd": round(
                self.annual_charging_revenue_external),
            "annual_rescue_revenue_usd": round(self.annual_rescue_revenue),
            "npv_usd": round(self.npv_usd),
            "irr_pct": (None if self.irr_pct is None
                        else round(self.irr_pct * 100.0, 1)),
            "payback_years": (None if self.payback_years is None
                              else round(self.payback_years, 1)),
            "lcoe_usd_per_kwh": round(self.lcoe_usd_per_kwh, 3),
            "capex_per_truck_usd": round(self.cost_per_truck),
            "cost_per_mile_usd": round(self.cost_per_mile, 2),
            "annual_energy_mwh": round(self.annual_energy_mwh),
        }


class CostModel:
    """Evaluates the economics of a scenario given its simulation result."""

    def __init__(self, scenario: Scenario):
        self.scenario = scenario
        self.econ = scenario.economics

    # -- CAPEX ----------------------------------------------------------
    def site_capex(self, site_name: str) -> float:
        """One-time cost to build the deployment at one site."""
        site = self.scenario.site(site_name)
        if not site.has_charging:
            return 0.0
        econ = self.econ
        hardware = 0.0          # heavy stationary (cabinets)
        light_hardware = 0.0    # light-install stationary (wallboxes)
        mobile_hardware = 0.0
        heavy_dispensers = 0
        light_units = 0
        grid_kw = 0.0
        any_heavy = False
        for cab in site.deployment:
            ct = get_charger_type(cab.charger_type)
            if ct.is_mobile:
                # Mobile units: hardware only, grid draw = replenishment
                # feed. No transformer/civil/interconnection at scale --
                # "no permits or construction" is their point.
                mobile_hardware += ct.hardware_cost_usd * cab.count
                grid_kw += ct.grid_recharge_kw * cab.count
            elif ct.light_install:
                # Wallboxes: wall/pedestal mount off a standard service.
                light_hardware += ct.hardware_cost_usd * cab.count
                light_units += cab.count
                grid_kw += ct.cabinet_kw * cab.count
            else:
                any_heavy = True
                hardware += ct.hardware_cost_usd * cab.count
                heavy_dispensers += ct.dispensers * cab.count
                grid_kw += ct.cabinet_kw * cab.count
        transformer_kw = min(grid_kw, site.site_power_limit_kw) \
            if any_heavy else 0.0
        # Sites with only mobile/light hardware need a modest service
        # upgrade and pads, not a full construction + interconnection.
        site_fixed = (site.construction_cost_usd
                      + site.utility_connection_cost_usd) \
            if any_heavy else 0.15 * (site.construction_cost_usd
                                      + site.utility_connection_cost_usd)
        return (
            hardware + light_hardware + mobile_hardware
            + hardware * econ.installation_pct_of_hardware
            + light_units * 3_000.0    # wallbox mount + electrical run
            + mobile_hardware * 0.02   # delivery/commissioning only
            + transformer_kw * econ.transformer_cost_usd_per_kw
            + econ.civil_cost_usd_per_dispenser * heavy_dispensers
            + site_fixed
        )

    def total_capex(self) -> float:
        return sum(self.site_capex(s.name) for s in self.scenario.sites)

    # -- OPEX (excl. energy) ---------------------------------------------
    def annual_fixed_opex(self) -> float:
        econ = self.econ
        total = 0.0
        for site in self.scenario.sites:
            if not site.has_charging:
                continue
            hardware = sum(get_charger_type(c.charger_type).hardware_cost_usd
                           * c.count for c in site.deployment)
            total += hardware * econ.maintenance_pct_of_hardware
            total += site.land_lease_usd_per_month * 12.0
            total += (site.total_dispensers
                      * econ.network_cost_usd_per_dispenser_month * 12.0)
        return total

    # -- full evaluation ---------------------------------------------------
    def evaluate(self, result: SimulationResult) -> CostBreakdown:
        econ = self.econ
        days = result.analysis_days
        annualize = 365.0 / days
        w_h = result.warmup_days * 24.0

        cb = CostBreakdown()
        cb.site_capex = {s.name: self.site_capex(s.name)
                         for s in self.scenario.sites if s.has_charging}
        cb.total_capex = sum(cb.site_capex.values())

        # Energy + demand charges from the simulated window
        energy_cost = sum(s.energy_cost_usd for s in result.sessions
                          if s.end_h >= w_h)
        cb.annual_energy_cost = energy_cost * annualize
        demand = 0.0
        for site in self.scenario.sites:
            powers = [p for p, t in zip(result.site_power_kw.get(site.name, []),
                                        result.sample_times_h) if t >= w_h]
            peak = max(powers, default=0.0)
            demand += peak * site.demand_charge_usd_per_kw_month * 12.0
        cb.annual_demand_charges = demand
        cb.annual_opex = (self.annual_fixed_opex() + cb.annual_energy_cost
                          + cb.annual_demand_charges)

        # Throughput-driven revenue
        trips = [t for t in result.trips if t.arrive_h >= w_h]
        cb.annual_trips = len(trips) * annualize
        cb.annual_revenue = cb.annual_trips * econ.revenue_per_trip_usd

        # Charging revenue, two tiers: own fleet vs third-party trucks
        retail_own = {s.name: s.retail_price_usd_per_kwh
                      for s in self.scenario.sites}
        retail_ext = {s.name: s.retail_price_external_usd_per_kwh
                      for s in self.scenario.sites}
        own_rev = ext_rev = 0.0
        for s in result.sessions:
            if s.end_h < w_h:
                continue
            if s.truck_id.startswith("external-"):
                ext_rev += s.energy_kwh * retail_ext.get(s.site, 0.0)
            else:
                own_rev += s.energy_kwh * retail_own.get(s.site, 0.0)
        cb.annual_charging_revenue_own = own_rev * annualize
        cb.annual_charging_revenue_external = ext_rev * annualize
        cb.annual_charging_revenue = (cb.annual_charging_revenue_own
                                      + cb.annual_charging_revenue_external)

        # Roadside rescue service: external calls are revenue; every
        # dispatch (own fleet included) costs a service call.
        ext_calls = econ.external_rescue_calls_per_month * 12.0
        own_calls = len([r for r in result.rescues
                         if r.time_h >= w_h]) * annualize
        cb.annual_rescue_revenue = ext_calls * (
            econ.rescue_fee_usd
            + econ.rescue_avg_kwh_external * econ.rescue_price_usd_per_kwh)
        cb.annual_rescue_cost = (ext_calls + own_calls) \
            * econ.rescue_cost_per_call_usd
        cb.annual_opex += cb.annual_rescue_cost

        delivered_kwh = sum(s.energy_kwh for s in result.sessions
                            if s.end_h >= w_h) * annualize
        cb.annual_energy_mwh = delivered_kwh / 1000.0

        # Cashflow series: year 0 = -CAPEX, years 1..H = revenue - opex
        net = (cb.annual_revenue + cb.annual_charging_revenue
               + cb.annual_rescue_revenue - cb.annual_opex)
        flows = [-cb.total_capex] + [net] * econ.horizon_years
        cb.npv_usd = npv(econ.discount_rate, flows)
        cb.irr_pct = irr(flows)
        cb.payback_years = (cb.total_capex / net) if net > 0 else None

        # LCOE: annualized capex + opex per delivered kWh
        crf = (econ.discount_rate * (1 + econ.discount_rate) ** econ.horizon_years
               / ((1 + econ.discount_rate) ** econ.horizon_years - 1)
               if econ.discount_rate > 0 else 1.0 / econ.horizon_years)
        if delivered_kwh > 0:
            cb.lcoe_usd_per_kwh = (cb.total_capex * crf + cb.annual_opex) / delivered_kwh
        total_miles = len(trips) * self.scenario.route.total_miles
        cb.cost_per_mile = ((cb.total_capex * crf + cb.annual_opex)
                            / (total_miles * annualize)) if total_miles else 0.0
        cb.cost_per_truck = (cb.total_capex / self.scenario.fleet_size
                             if self.scenario.fleet_size else 0.0)
        return cb
