/**
 * Investor page copy, EN and ES.
 *
 * The page body used to be hardcoded in English, so /es/investors served
 * English to Spanish-speaking investors. Icons, images and layout stay in the
 * page; only words live here.
 *
 * Nothing confidential belongs in this file: no ticket size, valuation, IRR,
 * per-station economics, counterparties under discussion, or the name of any
 * investor. Those stay in the deck, which is requested through the form.
 */

export interface InvestorsCopy {
  heroBadge: string
  heroTitleTop: string
  heroTitleAccent: string
  heroLead: string
  heroSub: string
  ctaDeck: string
  ctaLearnMore: string

  caseEyebrow: string
  caseTitle: string
  caseLead: string
  pillars: { title: string; desc: string }[]

  marketsEyebrow: string
  markets: { label: string; desc: string }[]

  structuresBadge: string
  structuresTitle: string
  structuresLead: string
  structures: { title: string; desc: string }[]

  moatBadge: string
  moatTitle: string
  moatLead: string
  moatCta: string
  moats: string[]

  roadmapTitle: string
  roadmapLead: string
  statusActive: string
  statusBuilding: string
  timeline: { phase: string; market: string; desc: string }[]

  finalBadge: string
  finalTitle: string
  finalLead: string
  finalNote: string
}

const en: InvestorsCopy = {
  heroBadge: 'Investor Relations',
  heroTitleTop: 'Investment in',
  heroTitleAccent: 'impactful infrastructure',
  heroLead: 'Greenspace E-mobility is building the first fully integrated electric freight network connecting Mexico, Texas, the U.S. West and Panama — purpose-built for Class 8 trucks.',
  heroSub: 'Our solution benefits customers and stakeholders by using fewer resources to provide a better service — increasing margins and creating value without the need for government subsidies.',
  ctaDeck: 'Request Investor Deck',
  ctaLearnMore: 'Learn More',

  caseEyebrow: 'The Investment Case',
  caseTitle: 'Why Greenspace E-mobility',
  caseLead: 'Our operation uses fewer resources to provide a better service to the market — increasing margins and creating value without the need for government subsidies, or tax dollars.',
  pillars: [
    { title: 'First-Mover Advantage', desc: 'No integrated Class 8 electric freight corridor exists between Mexico and the U.S. — and we are already running on it. The first Windrose Class 8 in U.S. commercial service has worked the Laredo–Dallas lane with Allogic Transport since April 2026, past 20,000 electric miles, while the hubs that will serve it are being built. Locations, interconnections and fleet contracts are being secured ahead of the market.' },
    { title: 'Deployable Infrastructure', desc: 'Standardized, modular Green Hub design, replicable across every market. Each site follows the same blueprint: high-power charging sized three times day-one demand behind a single medium-voltage interconnection, on-site solar, battery storage and driver services. Expanding a hub means adding a dispenser, not redoing the civil works.' },
    { title: 'Massive Market Opportunity', desc: 'Port Laredo alone moved $354 billion in trade in 2025, and 2.95 million trucks entered the U.S. there — 38.8% of every truck arriving from Mexico. There is no dedicated Class 8 electric charging on that corridor today.' },
    { title: 'Proven Management Team', desc: 'A team of five with Tesla, Circle K, Aker, CEMEX and MAERSK backgrounds, a U.S. general manager based in Laredo, and an operating record in Panama since 2022 — charging the Banco General fleet, the largest in the country, and DHL Express. A binational cargo route agreement signed with the Government of Nuevo León.' },
  ],

  marketsEyebrow: 'Active & Planned Markets',
  markets: [
    { label: 'Texas, USA', desc: 'I-35 Laredo–Dallas. Phase 1 · 4 Green Hubs.' },
    { label: 'Monterrey, Mexico', desc: 'Monterrey–Laredo binational route, signed with Nuevo León.' },
    { label: 'Texas Triangle', desc: 'I-10 and I-45 via Houston. Phase 2 · 4 Green Hubs.' },
    { label: 'I-10 West, USA', desc: 'El Paso – Phoenix – LA/Long Beach. Phase 3 · 3 Green Hubs.' },
    { label: 'Panama', desc: 'Four Green Hub sites in permitting. Operating since 2022.' },
  ],

  structuresBadge: 'Investment Structures',
  structuresTitle: 'Multiple entry points',
  structuresLead: 'Flexible structures depending on your mandate — from equity participation to asset-backed SPV ownership.',
  structures: [
    { title: 'Equity / Preferred Equity', desc: 'Direct ownership stake with preferred return structure. Flexible investor and sponsor ownership split.' },
    { title: 'Joint Venture (JV)', desc: 'Co-develop specific Green Hub stations or market segments — Texas, Mexico, the I-10 West corridor or Panama as standalone SPVs.' },
    { title: 'Fleet Leasing Structure', desc: 'Asset-backed leasing of Class 8 electric trucks. Fixed lease rate and fixed energy price per long-term fleet agreement.' },
    { title: 'Infrastructure SPV', desc: 'Asset ownership of charging stations via Special Purpose Vehicle. Predominantly asset-based — tangible, insured, long-life infrastructure.' },
  ],

  moatBadge: 'Competitive Moat',
  moatTitle: 'Why Greenspace wins this market',
  moatLead: 'Building physical infrastructure takes years of relationships, permits, and capital. We have a head start that competitors cannot replicate in the near term — across government agreements, secured sites and interconnections, and an operating record that goes back to 2022.',
  moatCta: 'Request Full Investor Deck',
  moats: [
    'Binational cargo route agreement signed with the Government of Nuevo León (September 2025)',
    'First Windrose Class 8 in commercial service in the United States — Laredo–Dallas since April 2026',
    'DSV: ten Windrose Class 8 units announced July 2026, with 25 more in 2027',
    'Authorized Windrose electric truck distributor for Panama, Mexico and Texas',
    'Vendor-neutral, OCPP-based charging operations across Autel, Sinexcel, LumosEnergy, Sungrow and EN+ hardware',
    'Operating record since 2022: the Banco General fleet, the largest in Panama, and DHL Express',
    'Multi-market regulatory experience across four countries',
    'OEM buy-back on every truck unit at 400,000 miles or five years',
  ],

  roadmapTitle: 'Phased deployment plan',
  roadmapLead: 'A structured rollout across the I-35 corridor, the Texas Triangle, the I-10 West corridor and Panama — built to de-risk each phase before the next begins.',
  statusActive: 'Active',
  statusBuilding: 'In Development',
  timeline: [
    { phase: 'Phase 1', market: 'I-35 Texas', desc: 'Four Green Hubs between Laredo and Dallas — Encinal/Laredo, Kyle/Buda, Waco–Dallas and Lancaster — plus depot charging at DSV sites. The first Windrose Class 8 in U.S. commercial service has run this lane since April 2026.' },
    { phase: 'Mexico', market: 'Monterrey–Laredo', desc: 'Binational electric cargo route agreed with the Government of Nuevo León in September 2025, with a hub planned at the Colombia Bridge crossing — making the Monterrey–Laredo–Dallas lane fully electric.' },
    { phase: 'Phase 2', market: 'Texas Triangle', desc: 'Four Green Hubs on I-10 between San Antonio and Houston and I-45 between Houston and Dallas, closing the loop for Port Houston volumes and DFW distribution.' },
    { phase: 'Phase 3', market: 'I-10 West', desc: 'Three Green Hubs west along I-10 — El Paso, Phoenix and Los Angeles/Long Beach — reaching the Pacific trade gateway, the ZEV-mandate freight market and a second border crossing.' },
    { phase: 'Panama', market: 'Open now', desc: 'Four Green Hub sites in permitting and design — Costa del Este, Vía España, Chitré and David — anchored by fleets Greenspace has charged since 2022, with the Canal logistics route as the next step.' },
  ],

  finalBadge: 'Ready to invest?',
  finalTitle: 'Join the electric freight revolution',
  finalLead: 'We are actively raising for our current deployment phase. Request the full investor deck, financial model, and project documentation.',
  finalNote: 'This page is intended for qualified investors only.',
}

const es: InvestorsCopy = {
  heroBadge: 'Relación con Inversionistas',
  heroTitleTop: 'Inversión en',
  heroTitleAccent: 'infraestructura con impacto',
  heroLead: 'Greenspace E-mobility está construyendo la primera red de carga eléctrica totalmente integrada que conecta México, Texas, el oeste de Estados Unidos y Panamá — diseñada para camiones Clase 8.',
  heroSub: 'Nuestra solución beneficia a clientes y socios usando menos recursos para prestar un mejor servicio: más margen y más valor, sin depender de subsidios del Estado.',
  ctaDeck: 'Solicitar el dossier de inversión',
  ctaLearnMore: 'Conocer más',

  caseEyebrow: 'La tesis de inversión',
  caseTitle: 'Por qué Greenspace E-mobility',
  caseLead: 'Nuestra operación usa menos recursos para dar un mejor servicio al mercado: aumenta el margen y crea valor sin necesidad de subsidios ni de dinero público.',
  pillars: [
    { title: 'Ventaja de ser los primeros', desc: 'No existe un corredor de carga eléctrica Clase 8 integrado entre México y Estados Unidos, y nosotros ya operamos en él. El primer Windrose Clase 8 en servicio comercial en EE.UU. trabaja la ruta Laredo–Dallas con Allogic Transport desde abril de 2026, superando las 20.000 millas eléctricas, mientras se construyen los hubs que lo abastecerán. Estamos asegurando ubicaciones, acometidas eléctricas y contratos de flota antes que el mercado.' },
    { title: 'Infraestructura replicable', desc: 'Diseño de Green Hub estandarizado y modular, replicable en cada mercado. Cada sitio sigue el mismo plano: carga de alta potencia dimensionada tres veces por encima de la demanda inicial detrás de una sola acometida en media tensión, generación solar propia, almacenamiento en baterías y servicios para el conductor. Ampliar un hub es añadir un dispensador, no rehacer la obra civil.' },
    { title: 'Un mercado de gran escala', desc: 'Solo el Puerto de Laredo movió $354 mil millones en comercio en 2025, y por ahí entraron a EE.UU. 2,95 millones de camiones: el 38,8% de todos los que llegan desde México. Hoy no hay carga eléctrica dedicada a Clase 8 en ese corredor.' },
    { title: 'Equipo con trayectoria', desc: 'Un equipo de cinco personas con experiencia en Tesla, Circle K, Aker, CEMEX y MAERSK, un gerente general para EE.UU. basado en Laredo, y operación en Panamá desde 2022: gestionamos la carga de la flota de Banco General, la mayor del país, y la de DHL Express. Además, un acuerdo de ruta binacional de carga firmado con el Gobierno de Nuevo León.' },
  ],

  marketsEyebrow: 'Mercados activos y previstos',
  markets: [
    { label: 'Texas, EE.UU.', desc: 'I-35 Laredo–Dallas. Fase 1 · 4 Green Hubs.' },
    { label: 'Monterrey, México', desc: 'Ruta binacional Monterrey–Laredo, firmada con Nuevo León.' },
    { label: 'Triángulo de Texas', desc: 'I-10 e I-45 por Houston. Fase 2 · 4 Green Hubs.' },
    { label: 'I-10 Oeste, EE.UU.', desc: 'El Paso – Phoenix – Los Ángeles/Long Beach. Fase 3 · 3 Green Hubs.' },
    { label: 'Panamá', desc: 'Cuatro sitios de Green Hub en permisos. Operando desde 2022.' },
  ],

  structuresBadge: 'Estructuras de inversión',
  structuresTitle: 'Varias formas de entrar',
  structuresLead: 'Estructuras flexibles según su mandato: desde participación accionaria hasta propiedad de activos a través de un vehículo de propósito especial.',
  structures: [
    { title: 'Capital / capital preferente', desc: 'Participación directa en la propiedad con estructura de retorno preferente. Reparto flexible entre inversionista y promotor.' },
    { title: 'Coinversión (Joint Venture)', desc: 'Co-desarrollo de estaciones Green Hub concretas o de segmentos de mercado — Texas, México, el corredor I-10 Oeste o Panamá como vehículos independientes.' },
    { title: 'Arrendamiento de flota', desc: 'Arrendamiento respaldado por activos de camiones eléctricos Clase 8. Tarifa de arrendamiento fija y precio de energía fijo según contrato de flota a largo plazo.' },
    { title: 'Vehículo de infraestructura (SPV)', desc: 'Propiedad de las estaciones de carga a través de un vehículo de propósito especial. Fundamentalmente respaldado por activos: infraestructura tangible, asegurada y de larga vida útil.' },
  ],

  moatBadge: 'Ventaja competitiva',
  moatTitle: 'Por qué Greenspace gana este mercado',
  moatLead: 'Construir infraestructura física exige años de relaciones, permisos y capital. Tenemos una ventaja que la competencia no puede replicar en el corto plazo: acuerdos con gobiernos, sitios y acometidas eléctricas asegurados, y una operación que viene de 2022.',
  moatCta: 'Solicitar el dossier completo',
  moats: [
    'Acuerdo de ruta binacional de carga firmado con el Gobierno de Nuevo León (septiembre de 2025)',
    'Primer Windrose Clase 8 en servicio comercial en Estados Unidos — ruta Laredo–Dallas desde abril de 2026',
    'DSV: diez unidades Windrose Clase 8 anunciadas en julio de 2026, con 25 más en 2027',
    'Distribuidor autorizado de camiones eléctricos Windrose para Panamá, México y Texas',
    'Operación de carga independiente de fabricante, sobre OCPP, con equipos Autel, Sinexcel, LumosEnergy, Sungrow y EN+',
    'Operación desde 2022: la flota de Banco General, la mayor de Panamá, y DHL Express',
    'Experiencia regulatoria en cuatro países',
    'Recompra del fabricante sobre cada camión a las 400.000 millas o cinco años',
  ],

  roadmapTitle: 'Plan de despliegue por fases',
  roadmapLead: 'Un despliegue estructurado sobre el corredor I-35, el Triángulo de Texas, el corredor I-10 Oeste y Panamá, diseñado para reducir el riesgo de cada fase antes de empezar la siguiente.',
  statusActive: 'Activo',
  statusBuilding: 'En desarrollo',
  timeline: [
    { phase: 'Fase 1', market: 'I-35 Texas', desc: 'Cuatro Green Hubs entre Laredo y Dallas — Encinal/Laredo, Kyle/Buda, Waco–Dallas y Lancaster — más carga en depósito en sitios de DSV. El primer Windrose Clase 8 en servicio comercial en EE.UU. recorre esta ruta desde abril de 2026.' },
    { phase: 'México', market: 'Monterrey–Laredo', desc: 'Ruta binacional de carga eléctrica acordada con el Gobierno de Nuevo León en septiembre de 2025, con un hub previsto en el cruce del Puente Colombia, que hace 100% eléctrica la ruta Monterrey–Laredo–Dallas.' },
    { phase: 'Fase 2', market: 'Triángulo de Texas', desc: 'Cuatro Green Hubs sobre la I-10 entre San Antonio y Houston y la I-45 entre Houston y Dallas, cerrando el circuito para los volúmenes del Puerto de Houston y la distribución de DFW.' },
    { phase: 'Fase 3', market: 'I-10 Oeste', desc: 'Tres Green Hubs hacia el oeste por la I-10 — El Paso, Phoenix y Los Ángeles/Long Beach — alcanzando la puerta de entrada del Pacífico, el mercado de carga con mandato ZEV y un segundo cruce fronterizo.' },
    { phase: 'Panamá', market: 'Abierto ya', desc: 'Cuatro sitios de Green Hub en permisos y diseño — Costa del Este, Vía España, Chitré y David — anclados por flotas que Greenspace opera desde 2022, con la ruta logística del Canal como siguiente paso.' },
  ],

  finalBadge: '¿Listo para invertir?',
  finalTitle: 'Súmese a la transformación del transporte de carga',
  finalLead: 'Estamos levantando capital para la fase de despliegue actual. Solicite el dossier completo de inversión, el modelo financiero y la documentación de los proyectos.',
  finalNote: 'Esta página está dirigida únicamente a inversionistas calificados.',
}

export const INVESTORS_COPY = { en, es }
