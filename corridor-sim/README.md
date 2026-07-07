# Corridor-Sim — EV Freight Corridor Infrastructure Planner

Discrete-event simulation and optimization tool for planning commercial EV
charging infrastructure on freight corridors. First deployment: the **I-35
corridor between Laredo and Dallas, TX (~430 mi)** for Greenspace
E-mobility.

The tool answers infrastructure-investment questions, not just "can the
trucks make it":

- Where should chargers be installed, and which technology at each site?
- How many power cabinets / dispensers per site?
- What grid connection (MW) does each site need?
- What is the minimum CAPEX to support 20 / 40 / 80 / 150 trucks per day?
- How do waits, queues, utilization, and cost change as the fleet grows?

## Quick start

```bash
cd corridor-sim
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Headless example run (prints KPIs, writes exports/)
python examples/run_baseline.py full_corridor

# Infrastructure optimization example
python examples/run_optimization.py genetic

# Interactive dashboard
streamlit run ui/app.py

# Tests
python -m pytest tests/ -q
```

## What's modeled

**Trucks** (`corridor_sim/vehicles/`) — Tesla Semi and Windrose R700 ship
in the registry; each `TruckSpec` carries battery capacity, usable
fraction, max charging power, an SOC-dependent charging curve,
consumption, weights, speed, SOC window (min / max / preferred arrival),
charging efficiency, temperature correction, connector standard, and
hours-of-service break rules. Add a model by registering another spec.

**Chargers** (`corridor_sim/charging/`) — cabinets with dispensers and
dynamic power sharing:

| Type | Cabinet | Dispensers | Sharing |
|---|---|---|---|
| Tesla MCS | 1.2 MW | 2 | 1→1200 kW, 2→600 kW each |
| Autel/Sinexcel | 1.2 MW | 2 | 1→750 kW (truck cap), 2→600 kW each |
| Autel/Sinexcel | 1.2 MW | 3 | 1→750, 2→600, 3→400 kW each |
| iTrailer 217 kWh (mobile) | 180 kW | 2 (CCS1) | 1→180, 2→90 kW each |

**Mobile battery-buffered units** (iTrailer, CCS1 or MCS-adapter variant)
carry a finite 217 kWh LFP buffer and replenish from a single 480V/60A
feed (~50 kW). Sessions discharge the buffer at up to 180 kW; once empty
they throttle to the feed. They need no transformer, civil works, or
interconnection, so a warehouse mobile deployment costs ~$0.6M vs ~$3.4M
for stationary cabinets. Their sustained ceiling is ~1.2 MWh/day per unit.

Two charging strategies support the mobile-charger operating concept:
`warehouse_charge_policy: "hop"` (warehouses top up just enough to reach
the nearest hub) and `enroute_target_soc: 0.8` (hubs always return trucks
to 80%). See the `mobile_warehouse_hubs` preset.

Charging is never linear: cabinet sharing, the truck's SOC-dependent
acceptance curve, and the site grid limit are all re-applied every
simulated minute. Curves can be loaded from CSV
(`ChargingCurve.from_csv`).

**Route & sites** (`corridor_sim/network/`) — segment-based, user-editable
route (distance, speed, weather/traffic multipliers, elevation reserved).
Launch sites: Warehouse Laredo, Fuel America Encinal, Waco Area, Warehouse
Dallas — each with land, grid/transformer/utility limits, construction and
interconnection cost, tariff (energy + demand charge), operating hours,
and queue area.

**Simulation** (`corridor_sim/sim/`) — SimPy discrete-event engine. Every
truck is an independent agent (driving / waiting / charging / loading /
break / idle / stranded) cycling continuously between warehouses with
trailer-swap dwell. A greedy range planner picks charging stops (charge
just enough to reach the next stop at the preferred arrival SOC);
warehouses top up to the SOC ceiling during turnaround. FIFO queues per
cabinet with shortest-queue site routing; random cabinet outages sized to
the reliability figure. Dispatch modes: interval, wave, random (Poisson),
shift.

**Costs** (`corridor_sim/costs/`) — CAPEX (cabinets, dispensers,
installation, transformer, civil, interconnection), OPEX (maintenance,
lease, network, energy, demand charges), NPV / IRR / payback / LCOE /
cost-per-truck / cost-per-mile.

**Optimization** (`corridor_sim/optimize/`) — searches deployments
(cabinet counts per type per site) with exhaustive enumeration, random
search, or a genetic algorithm; every candidate is scored by running the
simulator. Reports the scalar-best deployment *and* the Pareto front over
(CAPEX, avg wait, throughput). Infeasible deployments (stranded trucks)
are hard-penalized. A Pyomo/OR-Tools MILP sizing model is a planned
addition.

**UI** (`ui/app.py`) — Streamlit dashboard: scenario builder, one-click
simulation with KPI cards, interactive corridor map (OpenStreetMap, no
token), SOC / power / queue / utilization charts, truck state Gantt, wait
heat map, truck movement animation, optimization tab with Pareto scatter
and "apply recommendation", scenario comparison, and exports (CSV, Excel,
scenario JSON, HTML report — print to PDF for decks).

## Scenarios

Preset factories in `corridor_sim/config/presets.py`: warehouse-only,
warehouse+Encinal, full corridor, Tesla-only, Windrose-only, mobile
chargers at warehouses + 80% hubs, and 40/80/150 truck growth cases. Scenarios serialize to JSON (`scenarios/`) for
versioning and sharing.

## Architecture notes

- Pure-Python core; the UI is a thin layer over the same functions used
  headlessly, so the engine can later run inside a job queue or API.
- All KPI math lives in `sim/metrics.py`, testable without a simulation.
- Registries (trucks, chargers, presets) are plain dicts — extension means
  adding an entry, not editing the engine.
- Determinism: same scenario + seed ⇒ identical results (tested).

## Roadmap hooks

The module boundaries are chosen so these integrations drop in without
re-architecture: real GPS/telematics (Geotab), live traffic and weather,
ERCOT day-ahead pricing (replace `energy_price_usd_per_kwh` with a price
series), charger/truck telemetry, battery degradation, driver scheduling,
hydrogen trucks (another `TruckSpec` energy carrier), MCS standard
updates, and solar + BESS at sites (a site-level power source stacking
into `grid_scale_factor`).

## Known simplifications (v0.1)

- Site grid limit derates all sessions proportionally rather than
  re-optimizing the allocation.
- Warehouse charging happens after the trailer swap, not in parallel.
- Demand charges use the simulated peak as the billing peak.
- `demand-based` dispatch and reservation/priority queueing are stubs on
  the roadmap, not implemented.
