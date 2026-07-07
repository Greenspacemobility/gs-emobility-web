"""Unit tests: charging curves and cabinet power-sharing logic."""
import pytest

from corridor_sim.charging.chargers import get_charger_type
from corridor_sim.charging.curves import ChargingCurve
from corridor_sim.vehicles.models import get_truck_spec


def test_curve_interpolation():
    curve = ChargingCurve([(0.0, 1.0), (0.5, 1.0), (1.0, 0.2)])
    assert curve.fraction_at(0.25) == 1.0
    assert curve.fraction_at(0.75) == pytest.approx(0.6)
    assert curve.fraction_at(-0.1) == 1.0     # clamped
    assert curve.fraction_at(1.5) == 0.2      # clamped


def test_curve_validation():
    with pytest.raises(ValueError):
        ChargingCurve([(0.0, 1.0)])            # too few points
    with pytest.raises(ValueError):
        ChargingCurve([(0.0, 1.2), (1.0, 0.5)])  # fraction out of range


def test_curve_csv_roundtrip(tmp_path):
    p = tmp_path / "curve.csv"
    p.write_text("soc,fraction\n0,100\n50,90\n100,20\n")
    # percent-scale detection: soc 0-100 and fraction... fraction >1 invalid;
    # use 0-1 fractions with percent SOC
    p.write_text("soc,fraction\n0,1.0\n50,0.9\n100,0.2\n")
    curve = ChargingCurve.from_csv(p)
    assert curve.fraction_at(0.5) == pytest.approx(0.9)


def test_tesla_mcs_power_sharing():
    ct = get_charger_type("tesla_mcs")
    assert ct.per_session_kw(1) == 1200.0
    assert ct.per_session_kw(2) == 600.0
    assert ct.per_session_kw(3) == 600.0      # beyond table -> largest key


def test_autel_power_sharing_2d():
    ct = get_charger_type("autel_mcs_2d")
    assert ct.per_session_kw(1) == 750.0      # capped at truck acceptance
    assert ct.per_session_kw(2) == 600.0


def test_autel_power_sharing_3d():
    ct = get_charger_type("autel_mcs_3d")
    assert ct.dispensers == 3
    assert ct.per_session_kw(1) == 750.0
    assert ct.per_session_kw(2) == 600.0
    assert ct.per_session_kw(3) == 400.0


def test_truck_accepted_power_tapers():
    tesla = get_truck_spec("tesla_semi")
    low = tesla.accepted_power_kw(0.10)
    high = tesla.accepted_power_kw(0.90)
    assert low > high
    assert low <= tesla.max_charge_kw


def test_truck_range_math():
    tesla = get_truck_spec("tesla_semi")
    r = tesla.range_miles(0.9, 0.1)
    # (0.8 * 855) / 1.75 ~ 390 miles
    assert 350 < r < 430


def test_truck_overrides():
    t = get_truck_spec("tesla_semi", {"battery_kwh": 1000.0})
    assert t.battery_kwh == 1000.0
    # registry untouched
    assert get_truck_spec("tesla_semi").battery_kwh == 900.0


def test_autel_dt1500_mcs_reference():
    """Autel DT1500 + 2x600kW cabinets: 1.2 MW on a single MCS gun.

    Lives in the Windrose (CCS_HD) compatibility group: fleet policy is
    that Tesla Semis charge only on Tesla hardware."""
    ct = get_charger_type("autel_dt1500_2x600")
    assert ct.connector == "CCS_HD"
    assert ct.dispensers == 1
    assert ct.cabinet_kw == 1200.0
    assert ct.per_session_kw(1) == 1200.0
    assert not ct.is_mobile and not ct.light_install
