"""SimPy discrete-event simulation of the corridor.

Every truck is an independent agent cycling Laredo <-> Dallas:

  dwell (trailer swap) -> warehouse charge -> drive node-to-node ->
  en-route charge stops (greedy planner) -> arrive -> repeat southbound.

Charging is stepped in one-minute slices so cabinet power sharing responds
dynamically as trucks plug in and out. Cabinet-level sharing tables
(1200/600 for Tesla MCS; 750/600/400 for Autel) and the vehicle's
SOC-dependent acceptance curve are both applied every step, plus a
site-level grid ceiling.

Time base: SimPy env time is in **hours**.
"""
from __future__ import annotations

import random
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

import simpy

from corridor_sim.charging.chargers import ChargerType, get_charger_type
from corridor_sim.config.scenario import Scenario
from corridor_sim.network.locations import SiteConfig
from corridor_sim.sim.metrics import (ChargeSession, RescueEvent,
                                      SimulationResult, TripRecord)
from corridor_sim.vehicles.models import TruckSpec, get_truck_spec

CHARGE_STEP_H = 1.0 / 60.0        # 1-minute charging integration step
SAMPLE_STEP_H = 5.0 / 60.0        # time-series sampling interval
SOC_TARGET_MARGIN = 0.02          # extra SOC planned on top of exact need


# ---------------------------------------------------------------------------
# Runtime state objects
# ---------------------------------------------------------------------------

class CabinetState:
    """One physical cabinet: a SimPy resource plus live session powers."""

    def __init__(self, env: simpy.Environment, ctype: ChargerType, uid: str):
        self.env = env
        self.ctype = ctype
        self.uid = uid
        self.resource = simpy.Resource(env, capacity=ctype.dispensers)
        self.session_kw: Dict[int, float] = {}   # session id -> delivered kW
        self._next_session = 0
        self.down = False                        # maintenance outage flag
        self.busy_dispenser_h = 0.0
        # Mobile units: onboard energy buffer (starts full)
        self.buffer_kwh = ctype.buffer_kwh if ctype.is_mobile else None
        # Effective replenishment rate: intrinsic feed plus any wallbox
        # allocation assigned by SiteState wallbox<->mobile pairing.
        self.recharge_kw = ctype.grid_recharge_kw
        # Wallboxes dedicated to feeding mobile units don't serve trucks
        # and report no grid draw of their own (counted via the unit).
        self.dedicated_feeder = False

    @property
    def is_mobile(self) -> bool:
        return self.ctype.is_mobile

    def grid_kw(self) -> float:
        """Grid-side draw right now (demand-charge relevant).

        Stationary cabinets draw what they deliver; mobile units draw
        their replenishment power whenever the buffer is not full or a
        session is active. Dedicated feeder wallboxes report 0 -- their
        draw is accounted through the mobile unit they feed.
        """
        if self.dedicated_feeder:
            return 0.0
        if not self.is_mobile:
            return self.current_kw
        recharging = (self.buffer_kwh is not None
                      and self.buffer_kwh < self.ctype.buffer_kwh - 1e-6)
        return self.recharge_kw if (recharging or self.session_kw) else 0.0

    def open_session(self) -> int:
        sid = self._next_session
        self._next_session += 1
        self.session_kw[sid] = 0.0
        return sid

    def close_session(self, sid: int) -> None:
        self.session_kw.pop(sid, None)

    @property
    def active_sessions(self) -> int:
        return len(self.session_kw)

    @property
    def current_kw(self) -> float:
        return sum(self.session_kw.values())

    def queue_len(self) -> int:
        return len(self.resource.queue)


class SiteState:
    """Runtime wrapper around a SiteConfig with its deployed cabinets."""

    def __init__(self, env: simpy.Environment, config: SiteConfig):
        self.env = env
        self.config = config
        self.cabinets: List[CabinetState] = []
        for cab_cfg in config.deployment:
            ctype = get_charger_type(cab_cfg.charger_type)
            for i in range(cab_cfg.count):
                uid = f"{config.name}/{ctype.key}#{i}"
                self.cabinets.append(CabinetState(env, ctype, uid))
        self._pair_wallboxes_to_mobiles()

    def _pair_wallboxes_to_mobiles(self) -> None:
        """Dedicate light-install wallboxes to replenishing mobile units.

        Wallbox power is split evenly across mobile units, capped at each
        unit's DC input limit on top of its intrinsic feed. Whole
        wallboxes are marked ``dedicated_feeder`` (unavailable to trucks);
        leftover wallboxes keep charging trucks directly.
        """
        # Pair per connector group: a feeder can only replenish a mobile
        # unit whose DC input it can plug into (e.g. a CCS wallbox feeds a
        # Lifeyounger, but a Tesla MCS integrated post never does).
        connectors = {c.ctype.connector for c in self.cabinets if c.is_mobile}
        for conn in connectors:
            mobiles = [c for c in self.cabinets
                       if c.is_mobile and c.ctype.connector == conn]
            feeders = [c for c in self.cabinets
                       if c.ctype.light_install and not c.is_mobile
                       and c.ctype.connector == conn]
            if not mobiles or not feeders:
                continue
            pool_kw = sum(f.ctype.cabinet_kw for f in feeders)
            assigned = 0.0
            for m in mobiles:
                cap = max(0.0, (m.ctype.dc_input_limit_kw or float("inf"))
                          - m.ctype.grid_recharge_kw)
                take = min(cap, pool_kw / len(mobiles))
                m.recharge_kw = m.ctype.grid_recharge_kw + take
                assigned += take
            # Convert the assigned power into whole dedicated wallboxes
            acc = 0.0
            for f in feeders:
                if acc >= assigned - 1e-9:
                    break
                f.dedicated_feeder = True
                acc += f.ctype.cabinet_kw

    def compatible_cabinets(self, connector: str) -> List[CabinetState]:
        return [c for c in self.cabinets
                if c.ctype.connector == connector and not c.down
                and not c.dedicated_feeder]

    def supports(self, connector: str) -> bool:
        return any(c.ctype.connector == connector and not c.dedicated_feeder
                   for c in self.cabinets)

    def pick_cabinet(self, connector: str) -> Optional[CabinetState]:
        """Shortest-queue-first among compatible cabinets (FIFO per cabinet)."""
        options = self.compatible_cabinets(connector)
        if not options:
            return None
        return min(options, key=lambda c: (c.queue_len() + c.active_sessions
                                           - 0.001 * (c.resource.capacity
                                                      - c.active_sessions)))

    def current_kw(self) -> float:
        """Grid-side site demand (mobile units count at recharge power).

        Clamped to the interconnection limit: session powers rebalance on
        a 1-minute step, so raw sums can transiently overshoot for less
        than a minute -- a real site controller holds the limit.
        """
        raw = sum(c.grid_kw() for c in self.cabinets)
        return min(raw, self.config.site_power_limit_kw)

    def queue_len(self) -> int:
        return sum(c.queue_len() for c in self.cabinets)

    def grid_scale_factor(self) -> float:
        """Derate factor if concurrent sessions exceed the site grid limit.

        Applies to stationary cabinets only; mobile units discharge their
        buffer and hit the grid at just their replenishment power.
        """
        nominal = 0.0
        for cab in self.cabinets:
            if cab.is_mobile:
                nominal += cab.grid_kw()
                continue
            n = cab.active_sessions
            if n:
                nominal += cab.ctype.per_session_kw(n) * n
        limit = self.config.site_power_limit_kw
        if nominal <= limit or nominal == 0.0:
            return 1.0
        return limit / nominal

    def is_open(self, hour_of_day: float) -> bool:
        lo, hi = self.config.operational_hours
        return lo <= hour_of_day < hi or (lo, hi) == (0.0, 24.0)


class TruckState:
    """Mutable runtime state of one truck agent."""

    def __init__(self, truck_id: str, spec: TruckSpec, home: str, soc: float):
        self.id = truck_id
        self.spec = spec
        self.soc = soc
        self.state = "idle"
        self.mile = 0.0
        self.stranded = False
        # interpolation info while driving
        self.leg_start_h = 0.0
        self.leg_start_mile = 0.0
        self.leg_mph = 0.0
        self.leg_kwh_per_mile = 0.0
        self.drive_since_break_h = 0.0
        self.state_hours: Dict[str, float] = {}
        self._state_since = 0.0

    def set_state(self, env_now: float, state: str) -> None:
        dt = env_now - self._state_since
        if dt > 0:
            self.state_hours[self.state] = self.state_hours.get(self.state, 0.0) + dt
        self.state = state
        self._state_since = env_now

    def sample_mile(self, now_h: float) -> float:
        if self.state == "driving":
            return self.leg_start_mile + self.leg_mph * (now_h - self.leg_start_h) * self._dir
        return self.mile

    def sample_soc(self, now_h: float) -> float:
        if self.state == "driving":
            miles = abs(self.sample_mile(now_h) - self.leg_start_mile)
            return self.soc_at_leg_start - miles * self.leg_kwh_per_mile / self.spec.usable_kwh
        return self.soc

    _dir: int = 1
    soc_at_leg_start: float = 1.0


# ---------------------------------------------------------------------------
# Simulation
# ---------------------------------------------------------------------------

class CorridorSimulation:
    """Builds and runs one scenario. Create a fresh instance per run."""

    def __init__(self, scenario: Scenario):
        self.scenario = scenario
        self.env = simpy.Environment()
        self.rng = random.Random(scenario.random_seed)
        self.route = scenario.route
        self.nodes = self.route.nodes
        self.mile_of = {n: self.route.mile_marker(n) for n in self.nodes}
        self.sites: Dict[str, SiteState] = {
            s.name: SiteState(self.env, s) for s in scenario.sites
        }
        self.result = SimulationResult(
            scenario_name=scenario.name,
            sim_days=scenario.sim_days,
            warmup_days=min(scenario.warmup_days, scenario.sim_days * 0.5),
            fleet_size=scenario.fleet_size,
        )
        for name, st in self.sites.items():
            self.result.site_dispenser_count[name] = sum(
                c.resource.capacity for c in st.cabinets)
            self.result.site_energy_kwh[name] = 0.0
            self.result.site_busy_dispenser_h[name] = 0.0
        self.trucks: List[TruckState] = []
        self._build_fleet()

    # -- construction ---------------------------------------------------
    def _build_fleet(self) -> None:
        warehouses = [s.name for s in self.scenario.warehouses]
        if len(warehouses) < 2:
            raise ValueError("Scenario needs two warehouse sites")
        i = 0
        for entry in self.scenario.fleet:
            spec = get_truck_spec(entry.truck_type, dict(entry.overrides))
            for _ in range(entry.count):
                home = warehouses[i % 2]   # alternate ends for balance
                t = TruckState(f"{spec.key}-{i:03d}", spec, home, spec.max_soc)
                t.mile = self.mile_of[home]
                self.trucks.append(t)
                self.env.process(self._truck_proc(t, home,
                                                  self._departure_offset(i)))
                i += 1

    def _departure_offset(self, idx: int) -> float:
        """First-departure time (hours) for truck ``idx`` per dispatch mode."""
        d = self.scenario.dispatch
        per_end = idx // 2   # trucks alternate ends; stagger within each end
        if d.mode == "wave":
            wave = per_end // max(1, d.wave_size)
            return wave * d.wave_interval_minutes / 60.0
        if d.mode == "random":
            # Poisson process: cumulative exponential gaps
            gaps = [self.rng.expovariate(60.0 / max(1e-6, d.headway_minutes))
                    for _ in range(per_end + 1)]
            return sum(gaps)
        offset = per_end * d.headway_minutes / 60.0
        if d.mode == "shift":
            lo, hi = d.shift_hours
            span = max(0.5, hi - lo)
            return lo + (offset % span)
        return offset  # "interval"

    # -- helpers ---------------------------------------------------------
    def _leg_params(self, seg_idx: int, spec: TruckSpec) -> Tuple[float, float]:
        """(hours, kWh) to traverse route segment ``seg_idx`` for ``spec``."""
        seg = self.route.segments[seg_idx]
        sc = self.scenario
        speed = (seg.avg_speed_mph or spec.avg_speed_mph)
        hours = seg.distance_miles / speed * seg.traffic_multiplier * sc.traffic_multiplier
        kwh = spec.energy_for_miles(
            seg.distance_miles, seg.weather_multiplier * sc.weather_multiplier)
        return hours, kwh

    def _leg_energy_frac(self, i: int, j: int, spec: TruckSpec) -> float:
        """SOC fraction consumed driving from node index i to j."""
        lo, hi = min(i, j), max(i, j)
        kwh = sum(self._leg_params(k, spec)[1] for k in range(lo, hi))
        return kwh / spec.usable_kwh

    def _chargeable(self, node: str, spec: TruckSpec) -> bool:
        site = self.sites.get(node)
        return bool(site and site.supports(spec.connector))

    def _next_stop(self, i: int, direction: int, soc: float,
                   spec: TruckSpec) -> Optional[int]:
        """Greedy planner: farthest node we should drive to next.

        Returns the destination index if reachable with >= min_soc,
        else the farthest chargeable node reachable with >= preferred
        arrival SOC (falling back to >= min_soc), else ``None``
        (stranded: no feasible move).
        """
        dest = len(self.nodes) - 1 if direction > 0 else 0
        if soc - self._leg_energy_frac(i, dest, spec) >= spec.min_soc:
            return dest
        candidates = []
        j = i + direction
        while j != dest + direction:
            if self._chargeable(self.nodes[j], spec):
                arrival = soc - self._leg_energy_frac(i, j, spec)
                candidates.append((j, arrival))
            j += direction
        preferred = [j for j, a in candidates if a >= spec.preferred_arrival_soc]
        feasible = [j for j, a in candidates if a >= spec.min_soc]
        pool = preferred or feasible
        if not pool:
            return None
        return max(pool, key=lambda j: abs(j - i))

    def _charge_target(self, i: int, direction: int, spec: TruckSpec) -> float:
        """SOC to charge to at node i so the next planned leg lands at the
        preferred arrival SOC (capped at max_soc)."""
        nxt = self._next_stop(i, direction, spec.max_soc, spec)
        if nxt is None:
            return spec.max_soc
        need = self._leg_energy_frac(i, nxt, spec)
        arrival_target = (spec.min_soc + SOC_TARGET_MARGIN
                          if (nxt == 0 or nxt == len(self.nodes) - 1)
                          else spec.preferred_arrival_soc)
        return min(spec.max_soc, need + arrival_target + SOC_TARGET_MARGIN)

    def _hop_target(self, i: int, direction: int, spec: TruckSpec) -> float:
        """Warehouse 'hop' policy target: just enough SOC to reach the
        NEAREST charging hub at the preferred arrival SOC.

        The mobile-charger operating concept: warehouse units give a
        small top-up, the grid hubs do the real charging. Falls back to
        the regular planner target if no hub lies ahead.
        """
        dest = len(self.nodes) - 1 if direction > 0 else 0
        j = i + direction
        while j != dest + direction:
            if self._chargeable(self.nodes[j], spec):
                need = self._leg_energy_frac(i, j, spec)
                return min(spec.max_soc,
                           need + spec.preferred_arrival_soc + SOC_TARGET_MARGIN)
            j += direction
        return self._charge_target(i, direction, spec)

    # -- charging --------------------------------------------------------
    def _charge_proc(self, truck: TruckState, site: SiteState, target: float,
                     time_cap_h: Optional[float] = None):
        """Queue for a dispenser and charge to ``target`` SOC (generator).

        If ``time_cap_h`` is set, the whole visit (queue wait + charging)
        is bounded to that many hours from arrival -- models a fixed
        service window such as the warehouse loading dwell. If no gun
        frees up within the window the truck leaves uncharged; charging
        stops when the window expires even if ``target`` is not reached.
        """
        env = self.env
        spec = truck.spec
        arrive_h = env.now
        deadline = (arrive_h + time_cap_h) if time_cap_h is not None else None
        if not site.supports(spec.connector):   # no compatible hardware here
            return
        cabinet = site.pick_cabinet(spec.connector)
        while cabinet is None:
            # All compatible cabinets are down for maintenance: wait for
            # one to return rather than driving on and stranding.
            if deadline is not None and env.now >= deadline:
                return
            truck.set_state(env.now, "waiting")
            yield env.timeout(0.25)
            cabinet = site.pick_cabinet(spec.connector)
        # Respect site operating hours (skipped when a service window applies)
        hod = env.now % 24.0
        if deadline is None and not site.is_open(hod):
            lo = site.config.operational_hours[0]
            wait = (lo - hod) % 24.0
            truck.set_state(env.now, "waiting")
            yield env.timeout(wait)
        truck.set_state(env.now, "waiting")
        req = cabinet.resource.request()
        if deadline is not None:
            remaining = deadline - env.now
            if remaining <= 0:
                req.cancel()
                return
            outcome = yield req | env.timeout(remaining)
            if req not in outcome:      # never got a gun within the window
                req.cancel()
                return
        else:
            yield req
        try:
            start_h = env.now
            truck.set_state(env.now, "charging")
            sid = cabinet.open_session()
            start_soc = truck.soc
            energy = 0.0
            try:
                while truck.soc < target - 1e-6 and (
                        deadline is None or env.now < deadline - 1e-9):
                    n = cabinet.active_sessions
                    kw = min(cabinet.ctype.per_session_kw(n),
                             spec.accepted_power_kw(truck.soc))
                    recharge_share = 0.0
                    if cabinet.is_mobile:
                        # Empty buffer -> throttled to the feed share
                        # (intrinsic + paired wallboxes)
                        recharge_share = cabinet.recharge_kw / n
                        if cabinet.buffer_kwh <= 1e-6:
                            kw = min(kw, recharge_share)
                    else:
                        kw *= site.grid_scale_factor()
                    cabinet.session_kw[sid] = kw
                    step = min(CHARGE_STEP_H,
                               # don't overshoot the target on the last step
                               max(1e-4, (target - truck.soc) * spec.usable_kwh
                                   / max(kw * spec.charging_efficiency, 1.0)))
                    if deadline is not None:      # don't run past the window
                        step = min(step, deadline - env.now)
                    yield env.timeout(step)
                    delivered = kw * step
                    truck.soc = min(1.0, truck.soc + delivered
                                    * spec.charging_efficiency / spec.usable_kwh)
                    energy += delivered
                    cabinet.busy_dispenser_h += step
                    if cabinet.is_mobile:
                        # Net buffer flow: discharge minus concurrent refill
                        cabinet.buffer_kwh = min(
                            cabinet.ctype.buffer_kwh,
                            max(0.0, cabinet.buffer_kwh
                                - (kw - recharge_share) * step))
            finally:
                cabinet.close_session(sid)
            end_h = env.now
        finally:
            cabinet.resource.release(req)
        price = site.config.energy_price_usd_per_kwh
        grid_energy = energy / cabinet.ctype.efficiency
        self.result.sessions.append(ChargeSession(
            truck_id=truck.id, truck_type=spec.key, site=site.config.name,
            charger_type=cabinet.ctype.key, arrive_h=arrive_h,
            start_h=start_h, end_h=end_h, energy_kwh=energy,
            start_soc=start_soc, end_soc=truck.soc,
            energy_cost_usd=grid_energy * price,
        ))
        self.result.site_energy_kwh[site.config.name] += energy
        self.result.site_busy_dispenser_h[site.config.name] += end_h - start_h
        # A charging stop long enough counts as the HOS break
        if (end_h - start_h) * 60.0 >= spec.break_minutes:
            truck.drive_since_break_h = 0.0

    def _external_traffic_proc(self, site: SiteState):
        """Third-party trucks arriving to buy energy at an owned site.

        Poisson arrivals at ``external_trucks_per_day``; each picks a
        registered truck model compatible with the site's hardware,
        arrives at a random low SOC, and charges to 80% on the same
        dispensers (and queues) as the fleet.
        """
        from corridor_sim.vehicles.models import TRUCK_MODELS
        env = self.env
        rate = site.config.external_trucks_per_day
        n = 0
        while True:
            yield env.timeout(self.rng.expovariate(rate / 24.0))
            n += 1
            connectors = {c.ctype.connector for c in site.cabinets
                          if not c.dedicated_feeder}
            specs = sorted((s for s in TRUCK_MODELS.values()
                            if s.connector in connectors),
                           key=lambda s: s.key)
            if not specs:
                continue
            spec = self.rng.choice(specs)
            t = TruckState(f"external-{site.config.name}-{n:04d}", spec,
                           site.config.name, self.rng.uniform(0.10, 0.35))
            t.mile = self.mile_of[site.config.name]
            env.process(self._external_session(t, site))

    def _external_session(self, truck: TruckState, site: SiteState):
        target = min(truck.spec.max_soc, 0.80)
        yield from self._charge_proc(truck, site, target)

    def _rescue_bases(self) -> List[str]:
        """Sites that keep a mobile unit and can dispatch a rescue."""
        return [name for name, st in self.sites.items()
                if any(c.is_mobile for c in st.cabinets)]

    def _rescue_proc(self, truck: TruckState):
        """Dispatch a mobile unit to a range-stranded truck.

        The nearest mobile-equipped site sends a unit (drive time at
        rescue_speed_mph plus hook-up); the truck gets an emergency fill
        to 95% SOC (the 80/90% operating ceiling doesn't apply in an
        emergency) at single-gun power, then re-plans its trip.
        """
        env = self.env
        spec = truck.spec
        bases = self._rescue_bases()
        base = min(bases, key=lambda b: abs(self.mile_of[b] - truck.mile))
        dist = abs(self.mile_of[base] - truck.mile)
        response_h = dist / self.scenario.rescue_speed_mph \
            + self.scenario.rescue_setup_h
        truck.set_state(env.now, "waiting")
        yield env.timeout(response_h)
        truck.set_state(env.now, "charging")
        target = 0.95
        kwh = max(0.0, (target - truck.soc)) * spec.usable_kwh \
            / spec.charging_efficiency
        # single-gun mobile delivery, capped by the truck's acceptance
        kw = min(180.0, spec.max_charge_kw)
        yield env.timeout(kwh / kw if kw else 0.0)
        truck.soc = target
        self.result.rescues.append(RescueEvent(
            truck_id=truck.id, truck_type=spec.key, time_h=env.now,
            mile=truck.mile, dispatched_from=base,
            response_h=response_h, energy_kwh=kwh))

    # -- truck agent -------------------------------------------------------
    def _truck_proc(self, truck: TruckState, home: str, start_offset: float):
        env = self.env
        spec = truck.spec
        truck.set_state(0.0, "idle")
        yield env.timeout(start_offset)
        i = self.nodes.index(home)
        direction = 1 if i == 0 else -1
        while True:
            # ---- at a warehouse: swap trailers, top up, depart ----
            site = self.sites[self.nodes[i]]
            window = self.scenario.warehouse_charge_window_h
            if window and site.supports(spec.connector):
                # Charging runs *concurrently* with the loading dwell and is
                # capped by the idle window. Per-site target override wins;
                # under the 'hop' policy trucks stop charging (and free the
                # gun) once they can reach the next hub; otherwise the
                # departure SOC rule, then max SOC.
                if site.config.charge_target_soc is not None:
                    wh_target = site.config.charge_target_soc
                elif self.scenario.warehouse_charge_policy == "hop":
                    wh_target = self._hop_target(i, direction, spec)
                else:
                    wh_target = (self.scenario.enroute_target_soc
                                 or spec.max_soc)
                wh_target = min(wh_target, spec.max_soc)
                t0 = env.now
                truck.set_state(env.now, "loading")
                yield from self._charge_proc(truck, site, wh_target,
                                             time_cap_h=window)
                remaining = window - (env.now - t0)
                if remaining > 0:          # finished/queued early: keep loading
                    truck.set_state(env.now, "loading")
                    yield env.timeout(remaining)
            else:
                truck.set_state(env.now, "loading")
                yield env.timeout(site.config.dwell_minutes / 60.0)
                if site.supports(spec.connector):
                    if site.config.charge_target_soc is not None:
                        # Per-site economics override (e.g. free energy at
                        # Laredo -> charge deep; paid Dallas -> hop-minimal)
                        wh_target = min(site.config.charge_target_soc,
                                        spec.max_soc)
                        # never below what's needed to reach the next hub
                        wh_target = max(wh_target,
                                        self._hop_target(i, direction, spec))
                    elif self.scenario.warehouse_charge_policy == "hop":
                        # Mobile-charger concept: top up just enough to reach
                        # the NEAREST charging hub at the preferred arrival SOC.
                        wh_target = self._hop_target(i, direction, spec)
                    else:
                        wh_target = spec.max_soc
                    if truck.soc < wh_target - 0.02:
                        yield from self._charge_proc(truck, site, wh_target)
            depart_h = env.now
            drive_h = wait_h = charge_h = break_h = 0.0
            energy_kwh = 0.0
            n_stops = 0
            origin = self.nodes[i]
            dest_idx = len(self.nodes) - 1 if direction > 0 else 0
            # ---- travel loop ----
            rescued_this_trip = False
            while i != dest_idx:
                nxt = self._next_stop(i, direction, truck.soc, spec)
                if nxt is None:
                    # Range-stranded: dispatch a mobile rescue unit once per
                    # trip; if even a 95% emergency fill can't produce a
                    # feasible next leg, the corridor geometry is broken.
                    if (self.scenario.rescue_enabled and not rescued_this_trip
                            and self._rescue_bases()):
                        rescued_this_trip = True
                        t0 = env.now
                        yield from self._rescue_proc(truck)
                        wait_h += env.now - t0
                        continue
                    truck.stranded = True
                    truck.set_state(env.now, "stranded")
                    self.result.stranded_trucks.append(truck.id)
                    return
                # drive segment-by-segment to nxt
                step = 1 if nxt > i else -1
                while i != nxt:
                    seg_idx = i if step > 0 else i - 1
                    hours, kwh = self._leg_params(seg_idx, spec)
                    # HOS break before a leg that would exceed the limit
                    if truck.drive_since_break_h + hours > spec.break_after_drive_hours:
                        truck.set_state(env.now, "break")
                        yield env.timeout(spec.break_minutes / 60.0)
                        break_h += spec.break_minutes / 60.0
                        truck.drive_since_break_h = 0.0
                    truck.set_state(env.now, "driving")
                    truck.leg_start_h = env.now
                    truck.leg_start_mile = truck.mile
                    truck._dir = step
                    truck.leg_mph = self.route.segments[seg_idx].distance_miles / hours
                    truck.leg_kwh_per_mile = kwh / self.route.segments[seg_idx].distance_miles
                    truck.soc_at_leg_start = truck.soc
                    yield env.timeout(hours)
                    truck.soc -= kwh / spec.usable_kwh
                    truck.mile = self.mile_of[self.nodes[i + step]]
                    truck.drive_since_break_h += hours
                    drive_h += hours
                    energy_kwh += kwh
                    i += step
                # charge if this was a planned stop (not the destination)
                if i != dest_idx:
                    target = self._charge_target(i, direction, spec)
                    floor = (self.sites[self.nodes[i]].config.charge_target_soc
                             or self.scenario.enroute_target_soc)
                    if floor is not None:
                        # Operating policy: this hub returns trucks to at
                        # least this SOC (per-site override first, e.g. an
                        # owned site selling energy charges deeper).
                        target = min(max(target, floor), spec.max_soc)
                    if truck.soc < target - 1e-6:
                        t0 = env.now
                        yield from self._charge_proc(
                            truck, self.sites[self.nodes[i]], target)
                        sess = self.result.sessions[-1] if self.result.sessions else None
                        if sess and sess.truck_id == truck.id and sess.arrive_h >= t0 - 1e-9:
                            wait_h += max(0.0, sess.start_h - sess.arrive_h)
                            charge_h += sess.end_h - sess.start_h
                        n_stops += 1
            # ---- arrived ----
            self.result.trips.append(TripRecord(
                truck_id=truck.id, truck_type=spec.key, origin=origin,
                destination=self.nodes[dest_idx], depart_h=depart_h,
                arrive_h=env.now, drive_h=drive_h, wait_h=wait_h,
                charge_h=charge_h, break_h=break_h,
                n_charge_stops=n_stops, energy_used_kwh=energy_kwh,
            ))
            direction *= -1

    # -- background processes ---------------------------------------------
    def _sampler_proc(self):
        env = self.env
        while True:
            now = env.now
            self.result.sample_times_h.append(now)
            for name, site in self.sites.items():
                self.result.site_power_kw.setdefault(name, []).append(site.current_kw())
                self.result.site_queue_len.setdefault(name, []).append(site.queue_len())
            for t in self.trucks:
                self.result.truck_soc.setdefault(t.id, []).append(
                    round(max(0.0, t.sample_soc(now)), 4))
                self.result.truck_mile.setdefault(t.id, []).append(
                    round(t.sample_mile(now), 2))
                self.result.truck_state.setdefault(t.id, []).append(t.state)
            yield env.timeout(SAMPLE_STEP_H)

    def _buffer_recharge_proc(self, cabinet: CabinetState):
        """Refill a mobile unit's buffer from the grid while it is idle."""
        env = self.env
        dt = SAMPLE_STEP_H
        while True:
            yield env.timeout(dt)
            if cabinet.active_sessions == 0 \
                    and cabinet.buffer_kwh < cabinet.ctype.buffer_kwh:
                cabinet.buffer_kwh = min(
                    cabinet.ctype.buffer_kwh,
                    cabinet.buffer_kwh + cabinet.recharge_kw * dt)

    def _maintenance_proc(self, cabinet: CabinetState):
        """Random outages sized to the cabinet's reliability figure."""
        env = self.env
        daily_p = 1.0 - cabinet.ctype.reliability
        while True:
            yield env.timeout(24.0)
            if self.rng.random() < daily_p:
                cabinet.down = True
                yield env.timeout(4.0)
                cabinet.down = False

    # -- run ----------------------------------------------------------------
    def run(self) -> SimulationResult:
        self.env.process(self._sampler_proc())
        for site in self.sites.values():
            for cab in site.cabinets:
                self.env.process(self._maintenance_proc(cab))
                if cab.is_mobile:
                    self.env.process(self._buffer_recharge_proc(cab))
            if site.config.external_trucks_per_day > 0:
                self.env.process(self._external_traffic_proc(site))
        self.env.run(until=self.scenario.sim_days * 24.0)
        for t in self.trucks:  # flush state-hour accumulators
            t.set_state(self.env.now, t.state)
            self.result.truck_state_hours[t.id] = dict(t.state_hours)
        return self.result


def run_scenario(scenario: Scenario) -> SimulationResult:
    """Convenience one-shot: build and run a scenario."""
    return CorridorSimulation(scenario).run()
