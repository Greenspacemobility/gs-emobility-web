"""Optimization search space.

A :class:`Candidate` assigns, per site, how many cabinets of each allowed
charger type to deploy. The :class:`SearchSpace` bounds those counts (from
site power limits and user budget constraints) and provides random sampling
and enumeration used by all optimization methods.
"""
from __future__ import annotations

import itertools
import random
from dataclasses import dataclass, field
from typing import Dict, Iterator, List, Sequence, Tuple

from corridor_sim.charging.chargers import CabinetConfig, get_charger_type
from corridor_sim.config.scenario import Scenario


@dataclass(frozen=True)
class SiteChoice:
    """Deployment decision at one site: counts per charger type key."""

    site: str
    counts: Tuple[Tuple[str, int], ...]   # ((charger_type, count), ...)

    def to_deployment(self) -> List[CabinetConfig]:
        return [CabinetConfig(k, n) for k, n in self.counts if n > 0]

    @property
    def total_cabinets(self) -> int:
        return sum(n for _, n in self.counts)


@dataclass(frozen=True)
class Candidate:
    """One full corridor deployment (genome of the search)."""

    choices: Tuple[SiteChoice, ...]

    def apply(self, scenario: Scenario) -> Scenario:
        """Return a scenario copy with this deployment installed."""
        sc = scenario.copy()
        for choice in self.choices:
            sc.site(choice.site).deployment = choice.to_deployment()
        return sc

    def label(self) -> str:
        parts = []
        for c in self.choices:
            inner = "+".join(f"{n}x{k}" for k, n in c.counts if n > 0) or "none"
            parts.append(f"{c.site}: {inner}")
        return " | ".join(parts)


@dataclass
class SearchSpace:
    """Bounds of the deployment search.

    Attributes
    ----------
    scenario:
        Base scenario (fleet, route, tariffs); deployments get replaced.
    charger_types:
        Charger type keys the search may deploy.
    max_cabinets_per_type:
        Upper bound of cabinets of one type at one site.
    sites:
        Site names being optimized (defaults to all scenario sites).
    """

    scenario: Scenario
    charger_types: Sequence[str] = ("tesla_mcs", "autel_mcs_2d", "autel_mcs_3d")
    max_cabinets_per_type: int = 3
    sites: Sequence[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        if not self.sites:
            self.sites = [s.name for s in self.scenario.sites]
        # Only offer connector-relevant charger types for the fleet mix
        connectors = {  # connectors present in the fleet
            self._truck_connector(e.truck_type) for e in self.scenario.fleet
        }
        self.charger_types = [
            k for k in self.charger_types
            if get_charger_type(k).connector in connectors
        ] or list(self.charger_types)

    @staticmethod
    def _truck_connector(truck_type: str) -> str:
        from corridor_sim.vehicles.models import get_truck_spec
        return get_truck_spec(truck_type).connector

    def _site_max(self, site: str, ctype_key: str) -> int:
        """Cap cabinet count by the site's grid power limit."""
        cfg = self.scenario.site(site)
        ct = get_charger_type(ctype_key)
        by_power = int(cfg.site_power_limit_kw // ct.cabinet_kw)
        return max(0, min(self.max_cabinets_per_type, by_power))

    def max_candidate(self) -> Candidate:
        """Full build-out: every site at its cabinet cap (feasibility anchor)."""
        return Candidate(tuple(
            SiteChoice(site, tuple((k, self._site_max(site, k))
                                   for k in self.charger_types))
            for site in self.sites
        ))

    def random_candidate(self, rng: random.Random) -> Candidate:
        choices = []
        for site in self.sites:
            counts = tuple(
                (k, rng.randint(0, self._site_max(site, k)))
                for k in self.charger_types
            )
            choices.append(SiteChoice(site, counts))
        return Candidate(tuple(choices))

    def mutate(self, cand: Candidate, rng: random.Random,
               rate: float = 0.25) -> Candidate:
        """Randomly nudge cabinet counts up/down."""
        new_choices = []
        for choice in cand.choices:
            counts = []
            for k, n in choice.counts:
                if rng.random() < rate:
                    n = max(0, min(self._site_max(choice.site, k),
                                   n + rng.choice([-1, 1])))
                counts.append((k, n))
            new_choices.append(SiteChoice(choice.site, tuple(counts)))
        return Candidate(tuple(new_choices))

    @staticmethod
    def crossover(a: Candidate, b: Candidate, rng: random.Random) -> Candidate:
        """Uniform site-level crossover."""
        choices = tuple(
            ca if rng.random() < 0.5 else cb
            for ca, cb in zip(a.choices, b.choices)
        )
        return Candidate(choices)

    def enumerate_all(self, max_candidates: int = 200_000) -> Iterator[Candidate]:
        """Full enumeration (exhaustive search); guarded by a size cap."""
        per_site: List[List[SiteChoice]] = []
        for site in self.sites:
            ranges = [range(self._site_max(site, k) + 1) for k in self.charger_types]
            opts = [
                SiteChoice(site, tuple(zip(self.charger_types, combo)))
                for combo in itertools.product(*ranges)
            ]
            per_site.append(opts)
        total = 1
        for opts in per_site:
            total *= len(opts)
        if total > max_candidates:
            raise ValueError(
                f"Search space has {total:,} candidates -- too large for "
                f"exhaustive search; use 'genetic' or 'random' instead.")
        for combo in itertools.product(*per_site):
            yield Candidate(tuple(combo))

    def size(self) -> int:
        total = 1
        for site in self.sites:
            n = 1
            for k in self.charger_types:
                n *= self._site_max(site, k) + 1
            total *= n
        return total
