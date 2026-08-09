// ─────────────────────────────────────────────────────────────
// Greenspace E-mobility · Charger catalogue
// Single source of truth for every charger model shown on the
// website. Specs are taken from manufacturer datasheets stored
// in /public/datasheets — do not edit values without a source.
// ─────────────────────────────────────────────────────────────

export type BrandId = 'autel' | 'sinexcel' | 'lumosenergy' | 'sungrow'

export interface ChargerModel {
  id: string
  brand: BrandId
  model: string
  /** Short spec badge shown on the card, e.g. "DC Fast · 60–240 kW" */
  badge: string
  /** Max power in kW (for sorting / schema) */
  powerKw: number
  /** Display power, e.g. "60–240 kW" */
  power: string
  category: 'AC' | 'DC' | 'HPC' | 'V2X'
  connectors: string
  /** Technical feature bullets (language-neutral) */
  features: string[]
  image?: string
  /** 'light' renders the card's image panel on white — for photos with white/gray backgrounds */
  imageBg?: 'light'
  /** Path under /public, e.g. "/datasheets/….pdf" */
  datasheet?: string
  /** Restrict visibility label to a market, e.g. 'CO' → Colombia */
  market?: 'CO'
  /** One-line description used for Product schema */
  schemaDesc: string
}

export const chargerCatalog: ChargerModel[] = [
  // ── Autel Energy ──────────────────────────────────────────
  {
    id: 'autel-ac-wallbox',
    brand: 'autel',
    model: 'MaxiCharger AC Wallbox (IEC)',
    badge: 'AC · 7.4–22 kW',
    powerKw: 22,
    power: '7.4 / 11 / 22 kW',
    category: 'AC',
    connectors: 'Type 2',
    features: [
      'Type 2 · up to 32 A three-phase',
      'Dynamic load balancing · OTA updates',
      'Wi-Fi · Bluetooth · Ethernet · 4G',
      'OCPP 1.6J · IP65 · CE',
    ],
    image: '/images/products/autel-ac-wallbox.png',
    datasheet: '/datasheets/autel-maxicharger-ac-wallbox-iec.pdf',
    schemaDesc: 'Level 2 AC EV charger, 7.4 to 22 kW, Type 2 connector, OCPP 1.6J, for residential and commercial installations.',
  },
  {
    id: 'autel-ac-elite',
    brand: 'autel',
    model: 'MaxiCharger AC Elite — Home & Business',
    badge: 'AC Level 2 · 12 kW',
    powerKw: 12,
    power: 'Up to 12 kW (240 V × 50 A)',
    category: 'AC',
    connectors: 'SAE J1772',
    features: [
      'SAE J1772 · 25 ft tethered cable',
      '5" LCD touchscreen · RFID + APP auth (Business)',
      '4G · Wi-Fi · Ethernet · Bluetooth',
      'OCPP 1.6J · NEMA 4 · UL · Energy Star',
    ],
    image: '/images/products/autel-ac-elite-business.png',
    datasheet: '/datasheets/autel-maxicharger-ac-elite-home-business.pdf',
    schemaDesc: 'Level 2 AC EV charger up to 12 kW with SAE J1772 connector, OCPP 1.6J, for homes, workplaces and commercial parking.',
  },
  {
    id: 'autel-ac-floor',
    brand: 'autel',
    model: 'MaxiCharger AC Floor-Standing',
    badge: 'AC Dual · 2×19.2 kW',
    powerKw: 38.4,
    power: '2 × 19.2 kW',
    category: 'AC',
    connectors: '2× SAE J1772',
    features: [
      'Charges 2 vehicles simultaneously · 6–80 A per port',
      '8" HD screen · advertising-capable',
      'ISO 15118 Plug & Charge · dynamic load balancing',
      'OCPP 1.6J · NEMA 3R · cable management',
    ],
    image: '/images/products/autel-ac-floor-standing.png',
    datasheet: '/datasheets/autel-maxicharger-ac-floor-standing.pdf',
    schemaDesc: 'Dual-port floor-standing AC charger, 2×19.2 kW, SAE J1772, ISO 15118 Plug & Charge, for workplace and commercial parking.',
  },
  {
    id: 'autel-dc-compact',
    brand: 'autel',
    model: 'MaxiCharger DC Wall Compact',
    badge: 'DC Fast · 40 kW',
    powerKw: 40,
    power: '20 / 40 kW',
    category: 'DC',
    connectors: 'Dual CCS1 or CCS1 + CHAdeMO',
    features: [
      'Dual CCS1 or CCS1 + CHAdeMO',
      '21.5" LCD touchscreen · ISO 15118 PnC',
      '4G · Wi-Fi · Ethernet · OCPP 1.6J',
      'NEMA 3S · wall or floor mount',
    ],
    image: '/images/products/autel-dc-compact.png',
    datasheet: '/datasheets/autel-maxicharger-dc-wall-compact.pdf',
    schemaDesc: 'Compact 40 kW DC fast charger, wall or floor mounted, dual CCS1 or CCS1 + CHAdeMO, for dealerships, fleets and retail.',
  },
  {
    id: 'autel-dc-fast-iec',
    brand: 'autel',
    model: 'MaxiCharger DC Fast (IEC)',
    badge: 'DC Fast · 60–240 kW',
    powerKw: 240,
    power: '60–240 kW',
    category: 'DC',
    connectors: '2× CCS2 or CCS2 + CHAdeMO',
    features: [
      'CCS2 · 200 A std · up to 400 A peak boost',
      '150–950 V · ≥96% efficiency',
      '27" screen with advertising portal',
      'OCPP 1.6J→2.0.1 · ISO 15118 PnC · Eichrecht opt.',
    ],
    image: '/images/products/autel-dc-fast-iec.png',
    datasheet: '/datasheets/autel-maxicharger-dc-fast-iec.pdf',
    schemaDesc: 'DC fast charger 60 to 240 kW, CCS2, up to 400 A, 27-inch advertising display, OCPP, for public charging and fleets (IEC markets).',
  },
  {
    id: 'autel-dc-fast-na',
    brand: 'autel',
    model: 'MaxiCharger DC Fast (NA)',
    badge: 'DC Fast · 60–240 kW',
    powerKw: 240,
    power: '60–240 kW · 20 kW steps',
    category: 'DC',
    connectors: 'Dual CCS1 or CCS1 + CHAdeMO',
    features: [
      'Dual CCS1 / CCS1 Boost or CCS1 + CHAdeMO',
      'Flexible 20 kW power module design',
      '27" touchscreen · ISO 15118 Plug & Charge',
      'Dynamic load balancing · remote diagnostics',
    ],
    image: '/images/products/autel-dc-fast-na.png',
    datasheet: '/datasheets/autel-maxicharger-dc-fast-120-240kw-na.pdf',
    schemaDesc: 'DC fast charger 60 to 240 kW in 20 kW increments, dual CCS1, ISO 15118 Plug & Charge, for North American markets.',
  },
  {
    id: 'autel-dh480',
    brand: 'autel',
    model: 'MaxiCharger DH480',
    badge: 'DC Ultra-Fast · 480 kW',
    powerKw: 480,
    power: '120–480 kW',
    category: 'HPC',
    connectors: '1–4 outputs (2 std)',
    features: [
      'All-in-one 480 kW · up to 480 kW to a single port',
      '150–950 V adaptive voltage range',
      '1–4 outputs · modular, 5-min module swap',
      'Cable management · POS payment · voice prompts',
    ],
    image: '/images/products/autel-dh480.png',
    datasheet: '/datasheets/autel-maxicharger-dh480.pdf',
    schemaDesc: 'All-in-one 480 kW DC ultra-fast charger with up to 4 outputs and 480 kW to a single vehicle, for charging hubs and corridors.',
  },
  {
    id: 'autel-hipower',
    brand: 'autel',
    model: 'MaxiCharger DC HiPower',
    badge: 'DC Ultra-Fast · 640 kW',
    powerKw: 640,
    power: '320–640 kW system',
    category: 'HPC',
    connectors: 'Dual CCS1 per dispenser',
    features: [
      '360 kW per port · max 480 kW · Dual CCS1',
      'Liquid-cooled · up to 8 vehicles simultaneously',
      '150–950 V · 500 A (max 650 A)',
      'UL 2202 · NEMA 3S · ~250 mi in 10 min',
    ],
    image: '/images/products/autel-dc-hipower.png',
    datasheet: '/datasheets/autel-maxicharger-dc-hipower-360-640kw.pdf',
    schemaDesc: 'Liquid-cooled DC high-power charging system, 320 to 640 kW, up to 480 kW per vehicle, for highway hubs and heavy-duty fleets.',
  },
  {
    id: 'autel-ds600l',
    brand: 'autel',
    model: 'MaxiCharger DS600L Liquid-Cooled',
    badge: 'DC Ultra-Fast · 600 kW',
    powerKw: 600,
    power: '600 kW system',
    category: 'HPC',
    connectors: 'CCS2 liquid-cooled',
    features: [
      'Distributed power cabinet + slim dispensers',
      'Liquid-cooled cables · high current sustained',
      'Dynamic power allocation across dispensers',
      'OCPP · designed for hub deployments (CE)',
    ],
    image: '/images/products/autel-ds600l.png',
    datasheet: '/datasheets/autel-maxicharger-ds600l.pdf',
    schemaDesc: 'Liquid-cooled 600 kW distributed DC charging system with power cabinet and dispensers, for high-utilization charging hubs.',
  },
  {
    id: 'autel-v2x',
    brand: 'autel',
    model: 'MaxiCharger DC V2X',
    badge: 'V2G Bidirectional · 12 kW',
    powerKw: 12,
    power: '7 / 12 kW',
    category: 'V2X',
    connectors: 'CCS1 or CHAdeMO',
    features: [
      'Bidirectional DC — vehicle-to-grid / home / load',
      '150–950 V DC · ≥97% peak efficiency',
      '208/240 Vac input · NEMA 4X',
      'Energy resilience & demand-response ready',
    ],
    image: '/images/products/autel-dc-v2x.png',
    imageBg: 'light',
    datasheet: '/datasheets/autel-dc-v2x.pdf',
    schemaDesc: 'Bidirectional 7/12 kW DC charger (V2X) enabling vehicle-to-grid and backup power applications, CCS1 or CHAdeMO.',
  },

  // ── Sinexcel ──────────────────────────────────────────────
  {
    id: 'sinexcel-sec-60-compact',
    brand: 'sinexcel',
    model: 'SEC 60 kW Compact',
    badge: 'DC Fast · 60 kW',
    powerKw: 60,
    power: '60 kW',
    category: 'DC',
    connectors: '2× CCS2',
    features: [
      '40 kW power modules · 97% peak efficiency',
      'Ultra-compact 620×300×1000 mm · 150 kg',
      'Up to 200 A per connector',
      'IP54 / IK10 · OCPP 1.6J & 2.0.1',
    ],
    image: '/images/products/sinexcel-sec-60-compact.png',
    schemaDesc: 'Compact 60 kW DC fast charger with small footprint, dual CCS2, OCPP 1.6J/2.0.1, for space-constrained sites.',
  },
  {
    id: 'sinexcel-sec-60',
    brand: 'sinexcel',
    model: 'SEC 60 kW',
    badge: 'DC Fast · 60 kW',
    powerKw: 60,
    power: '60 kW',
    category: 'DC',
    connectors: 'CCS2 · CCS2+CCS2 · CCS2+CHAdeMO',
    features: [
      '20 kW modules · dynamic power sharing',
      '200–1000 Vdc · 96% peak efficiency',
      '15" HD touchscreen · RFID / APP / NFC',
      'OCPP 1.6J · IP55 / IK10 · CE · TÜV',
    ],
    image: '/images/products/sinexcel-sec-60.png',
    imageBg: 'light',
    datasheet: '/datasheets/sinexcel-sec-60kw.pdf',
    schemaDesc: 'Integrated 60 kW DC fast charger, CCS2 and CHAdeMO options, OCPP 1.6J, CE and TÜV certified, for fleets and public charging.',
  },
  {
    id: 'sinexcel-sec-80',
    brand: 'sinexcel',
    model: 'SEC 80 kW',
    badge: 'DC Fast · 80 kW',
    powerKw: 80,
    power: '60 / 80 kW',
    category: 'DC',
    connectors: 'CCS2 · CCS2+CCS2 · CCS2+CHAdeMO',
    features: [
      '20 kW modules · simultaneous dual charging',
      '200–1000 Vdc · 96% peak efficiency',
      '15" HD touchscreen · RFID / APP / NFC',
      'OCPP 1.6J · IP55 / IK10 · CE · TÜV',
    ],
    image: '/images/products/sinexcel-sec-80.png',
    imageBg: 'light',
    datasheet: '/datasheets/sinexcel-sec-80kw.pdf',
    schemaDesc: 'Integrated 80 kW DC fast charger, dual CCS2, OCPP 1.6J, CE and TÜV certified, high power density for depots and public sites.',
  },
  {
    id: 'sinexcel-sec-120',
    brand: 'sinexcel',
    model: 'SEC 120 kW',
    badge: 'DC Fast · 120 kW',
    powerKw: 120,
    power: '120 kW',
    category: 'DC',
    connectors: 'CCS2 · CCS2+CCS2 · CCS2+CHAdeMO',
    features: [
      'Up to 350 A continuous per connector',
      'Algorithm-controlled dynamic power split',
      '15" HD touchscreen · barrier-free design',
      'OCPP 1.6J · IP55 / IK10 · CE · TÜV',
    ],
    image: '/images/products/sinexcel-sec-120.png',
    datasheet: '/datasheets/sinexcel-sec-120kw.pdf',
    schemaDesc: 'Integrated 120 kW DC fast charger with 350 A continuous output, dual CCS2, OCPP 1.6J, for buses, trucks and high-traffic sites.',
  },
  {
    id: 'sinexcel-sec-160',
    brand: 'sinexcel',
    model: 'SEC 160 kW',
    badge: 'DC Fast · 160 kW',
    powerKw: 160,
    power: '160 kW',
    category: 'DC',
    connectors: '2× CCS2',
    features: [
      '350 A continuous · 500 A boost capability',
      'Suited to buses & commercial vehicles',
      'OCPP 1.6J & 2.0.1 · ISO 15118 PnC-ready',
      'MID metering option · IP55 / IK10',
    ],
    schemaDesc: 'Integrated 160 kW DC fast charger with 350 A continuous and 500 A boost, dual CCS2, OCPP 2.0.1, for heavy commercial vehicles.',
  },

  // ── Lumosenergy (Gresgying Digital Technology) ────────────
  {
    id: 'lumos-f1-30',
    brand: 'lumosenergy',
    model: 'F1 · 30 kW Wall-Mounted',
    badge: 'DC Fast · 30 kW',
    powerKw: 30,
    power: '30 kW',
    category: 'DC',
    connectors: '1× CCS2',
    features: [
      'Wall-mounted entry-level DC charging',
      '150–1000 Vdc · up to 125 A',
      '7" LCD touchscreen · QR / RFID / PnC',
      'OCPP 1.6J · IP54 / IK10',
    ],
    image: '/images/products/lumos-f1-30.png',
    imageBg: 'light',
    schemaDesc: 'Wall-mounted 30 kW DC charger, single CCS2, OCPP 1.6J, ideal entry point for dealerships and workplaces.',
  },
  {
    id: 'lumos-f2-60',
    brand: 'lumosenergy',
    model: 'F2 · 60 kW',
    badge: 'DC Fast · 60 kW',
    powerKw: 60,
    power: '60 kW',
    category: 'DC',
    connectors: '2× CCS2',
    features: [
      'Dual CCS2 · up to 200 A per connector',
      '150–1000 Vdc output range',
      '7" LCD touchscreen · QR / RFID / PnC',
      'OCPP 1.6J · IP54 / IK10',
    ],
    image: '/images/products/lumos-f-series.png',
    imageBg: 'light',
    schemaDesc: 'Integrated 60 kW DC fast charger, dual CCS2, OCPP 1.6J, for retail, fleet and destination charging.',
  },
  {
    id: 'lumos-f3-180',
    brand: 'lumosenergy',
    model: 'F3 · 180 kW',
    badge: 'DC Fast · 180 kW',
    powerKw: 180,
    power: '180 kW',
    category: 'DC',
    connectors: '2× CCS2',
    features: [
      'Dual CCS2 · up to 300 A per connector',
      '150–1000 Vdc output range',
      '10" LCD touchscreen · QR / RFID / PnC',
      'OCPP 1.6J · IP54 / IK10',
    ],
    image: '/images/products/lumos-f-series.png',
    imageBg: 'light',
    schemaDesc: 'Integrated 180 kW DC fast charger, dual CCS2 up to 300 A, OCPP 1.6J, for public fast charging and fleet depots.',
  },
  {
    id: 'lumos-240',
    brand: 'lumosenergy',
    model: 'LCND320E6 · 240 kW',
    badge: 'DC Ultra-Fast · 240→320 kW',
    powerKw: 240,
    power: '240 kW · field-upgradable to 320 kW',
    category: 'HPC',
    connectors: '2× CCS2',
    features: [
      'Field-upgradable to 320 kW — same cabinet',
      'Dual CCS2 · up to 380 A per connector',
      '10" LCD touchscreen · payment terminal opt.',
      'OCPP 1.6J · IP54 / IK10',
    ],
    schemaDesc: '240 kW DC ultra-fast charger field-upgradable to 320 kW without cabinet replacement, dual CCS2 up to 380 A.',
  },
  {
    id: 'lumos-320',
    brand: 'lumosenergy',
    model: 'LCND320E · 320 kW',
    badge: 'DC Ultra-Fast · 320 kW',
    powerKw: 320,
    power: '320 kW',
    category: 'HPC',
    connectors: '2× CCS2',
    features: [
      'Dual CCS2 · up to 380 A per connector',
      '150–1000 Vdc output range',
      '10" LCD touchscreen · MID metering opt.',
      'OCPP 1.6J · IP54 / IK10',
    ],
    schemaDesc: '320 kW DC ultra-fast charger, dual CCS2 up to 380 A, OCPP 1.6J, for highway corridors and high-utilization hubs.',
  },
  {
    id: 'lumos-hub-480',
    brand: 'lumosenergy',
    model: 'LCSD480E · 480 kW Hub',
    badge: 'Hub Power Unit · 480 kW',
    powerKw: 480,
    power: '480 kW power unit',
    category: 'HPC',
    connectors: 'Distributed dispensers',
    features: [
      '1600 A system current · hub architecture',
      'Min. 40 kW switching per dispenser',
      'Power unit + separate dispensers',
      'OCPP 1.6J · Ethernet · 4G',
    ],
    schemaDesc: '480 kW distributed charging hub power unit delivering 1600 A across multiple dispensers, for large charging hubs.',
  },

  // ── Sungrow (Colombia) ────────────────────────────────────
  {
    id: 'sungrow-idc80e',
    brand: 'sungrow',
    model: 'IDC80E',
    badge: 'DC Fast · 49.9–80 kW',
    powerKw: 80,
    power: '49.9 / 60 / 80 kW',
    category: 'DC',
    connectors: '2× CCS2 (GB/T optional)',
    features: [
      'Wall, pedestal or mobile trolley mount',
      '150–1000 Vdc · up to 250 A · 97% efficiency',
      '10.1" color touchscreen · RFID / QR / auto-charge',
      'IP65 · C5 anti-corrosion · OCPP 1.6J',
    ],
    market: 'CO',
    schemaDesc: 'DC fast charger configurable 49.9 to 80 kW, dual CCS2, IP65 with C5 anti-corrosion rating, 3-year warranty. Available for projects in Colombia.',
  },
  {
    id: 'sungrow-idc180e',
    brand: 'sungrow',
    model: 'IDC180E',
    badge: 'DC Fast · 60–180 kW',
    powerKw: 180,
    power: '60 / 120 / 150 / 180 kW',
    category: 'DC',
    connectors: '2× CCS2',
    features: [
      '250 A per connector · 380 A optional',
      '200–1000 Vdc · 96.5% efficiency · <48 W standby',
      'Integrated MID meter · Eichrecht optional',
      'IP65 · C5 anti-corrosion · OCPP 1.6J → 2.0.1',
    ],
    market: 'CO',
    schemaDesc: 'DC fast charger configurable 60 to 180 kW, dual CCS2 up to 380 A, MID metering, IP65/C5, 3-year warranty. Available for projects in Colombia.',
  },
]

export const brandOrder: BrandId[] = ['autel', 'sinexcel', 'lumosenergy', 'sungrow']

export const brandNames: Record<BrandId, string> = {
  autel: 'Autel Energy',
  sinexcel: 'Sinexcel',
  lumosenergy: 'Lumosenergy · Gresgying',
  sungrow: 'Sungrow',
}

export function chargersByBrand(brand: BrandId): ChargerModel[] {
  return chargerCatalog.filter(c => c.brand === brand)
}
