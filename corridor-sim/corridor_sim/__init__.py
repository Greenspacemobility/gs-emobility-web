"""Corridor-Sim: EV freight corridor infrastructure simulation & optimization.

A discrete-event simulation and optimization toolkit for planning commercial
EV charging infrastructure along freight corridors, built for the I-35
Laredo <-> Dallas corridor as the first deployment.

Modules
-------
vehicles      Truck models and specifications (Tesla Semi, Windrose R700, ...)
charging      Charger types, power-sharing cabinets, SOC-dependent curves
network       Route segments and charging-site definitions
config        Scenario dataclasses, JSON serialization, preset scenarios
sim           SimPy discrete-event simulation engine and KPI collection
costs         CAPEX / OPEX / NPV / IRR / LCOE financial model
optimize      Infrastructure search (exhaustive, random, genetic) + Pareto
viz           Plotly chart and map builders shared by the UI and reports
"""

__version__ = "0.1.0"
