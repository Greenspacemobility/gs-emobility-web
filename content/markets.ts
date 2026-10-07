/**
 * Market landing pages — one per country.
 *
 * These exist to answer a specific search intent ("cargadores para vehículos
 * eléctricos en <país>"), which no generic page on this site can answer well.
 * Every proof point below must be something Greenspace can evidence; where a
 * market has no deployed projects yet (Colombia), the page says what we can
 * supply and does not imply a track record that is not there.
 */

export type MarketId = 'panama' | 'mexico' | 'usa' | 'colombia'

export interface MarketCopy {
  metaTitle: string
  metaDesc: string
  badge: string
  h1: string
  lead: string
  servicesTitle: string
  servicesLead: string
  services: { title: string; desc: string }[]
  proofTitle: string
  proofLead: string
  proof: { title: string; desc: string }[]
  hardwareTitle: string
  hardwareLead: string
  faqTitle: string
  faq: { q: string; a: string }[]
  ctaTitle: string
  ctaDesc: string
  ctaLabel: string
}

export interface Market {
  id: MarketId
  slug: string
  countryName: { en: string; es: string }
  countryCode: string
  region: string
  copy: { en: MarketCopy; es: MarketCopy }
}

/* Shared service lines, worded once per language. */
const SERVICES_ES = [
  { title: 'Consultoría y estrategia de carga', desc: 'Definimos cuántos cargadores, de qué potencia y en qué orden, a partir del uso real de los vehículos y de la capacidad eléctrica disponible.' },
  { title: 'Evaluación de sitio e ingeniería', desc: 'Revisión de acometida, tableros, canalizaciones y espacio. Diseño eléctrico y plano de implantación antes de comprar equipo.' },
  { title: 'Suministro de cargadores AC y DC', desc: 'Cargadores AC de 7 a 22 kW y carga rápida DC de 30 kW en adelante, de fabricantes con respaldo y repuestos.' },
  { title: 'Instalación y puesta en marcha', desc: 'Coordinamos la obra con el contratista eléctrico, configuramos los equipos y los dejamos operando y conectados a la plataforma.' },
  { title: 'Software y operación', desc: 'Gestión de carga sobre OCPP: usuarios, tarifas, control de potencia, reportes y monitoreo remoto de cada conector.' },
  { title: 'Mantenimiento y soporte', desc: 'Mantenimiento preventivo y correctivo, atención de fallas y seguimiento de disponibilidad de la red.' },
  { title: 'Solar y almacenamiento', desc: 'Generación solar en techo o marquesina y baterías para reducir el costo de la energía y la demanda contratada.' },
  { title: 'Electrificación de flotas', desc: 'Plan de transición de flota: análisis de rutas y recorridos, dimensionamiento de carga en depósito y costo total de operación.' },
]

const SERVICES_EN = [
  { title: 'Charging strategy and consulting', desc: 'How many chargers, at what power, and in what order — decided from how the vehicles are actually used and from the electrical capacity available.' },
  { title: 'Site assessment and engineering', desc: 'Service entrance, switchgear, conduit routes and space. Electrical design and site layout before any equipment is bought.' },
  { title: 'AC and DC charger supply', desc: 'AC chargers from 7 to 22 kW and DC fast charging from 30 kW upward, from manufacturers with local support and spare parts.' },
  { title: 'Installation and commissioning', desc: 'We coordinate the works with the electrical contractor, configure the units and hand them over operating and connected to the platform.' },
  { title: 'Software and operations', desc: 'OCPP-based charge management: users, tariffs, power control, reporting and remote monitoring of every connector.' },
  { title: 'Maintenance and support', desc: 'Preventive and corrective maintenance, fault response and uptime tracking across the network.' },
  { title: 'Solar and storage', desc: 'Rooftop or canopy solar generation and batteries to cut energy cost and contracted demand.' },
  { title: 'Fleet electrification', desc: 'Fleet transition planning: route and duty-cycle analysis, depot charging sizing and total cost of operation.' },
]

const HARDWARE_ES = 'Trabajamos con varios fabricantes y elegimos según el caso, no según el catálogo: Autel Energy (AC y DC hasta 640 kW), Sinexcel, LumosEnergy, Sungrow y nuestra propia línea Greenspace. Todos los equipos que desplegamos hablan OCPP, de modo que la red no queda atada a un solo proveedor.'
const HARDWARE_EN = 'We work with several manufacturers and choose per project rather than per catalogue: Autel Energy (AC and DC up to 640 kW), Sinexcel, LumosEnergy, Sungrow and our own Greenspace line. Everything we deploy speaks OCPP, so the network is never locked to one supplier.'

export const MARKETS: Market[] = [
  {
    id: 'panama',
    slug: 'panama',
    countryName: { en: 'Panama', es: 'Panamá' },
    countryCode: 'PA',
    region: 'Panama City',
    copy: {
      es: {
        metaTitle: 'Cargadores para vehículos eléctricos en Panamá',
        metaDesc: 'Suministro, instalación y operación de cargadores para vehículos eléctricos en Panamá. Carga AC y DC rápida para empresas, flotas, hoteles y edificios. Operando desde 2022 con DHL Express y Banco General.',
        badge: 'Panamá',
        h1: 'Cargadores para vehículos eléctricos en Panamá',
        lead: 'Greenspace E-mobility diseña, suministra, instala y opera infraestructura de carga para vehículos eléctricos en Panamá desde 2022. Nuestra sede está en Ciudad de Panamá. Atendemos flotas comerciales, edificios residenciales y de oficinas, hoteles, centros comerciales y operadores logísticos — desde un cargador AC en un estacionamiento hasta carga rápida DC y hubs con generación solar y almacenamiento.',
        servicesTitle: 'Qué hacemos en Panamá',
        servicesLead: 'Cubrimos el ciclo completo. No vendemos un cargador y nos vamos: el equipo que instalamos es el que después operamos y mantenemos.',
        services: SERVICES_ES,
        proofTitle: 'Proyectos en Panamá',
        proofLead: 'Infraestructura que ya está instalada y operando, no planes.',
        proof: [
          { title: 'Banco General', desc: 'La mayor flota eléctrica de Panamá. Greenspace diseñó y desplegó la infraestructura de carga completa y la opera desde 2022.' },
          { title: 'DHL Express Panamá', desc: 'Dos depósitos sobre nuestra plataforma de gestión de carga desde diciembre de 2022, como parte de la electrificación de su flota de reparto.' },
          { title: 'Panama Pacifico', desc: 'Infraestructura de carga desplegada junto a socios locales, ampliando el acceso a carga eléctrica para residentes, conmutadores y flotas en una de las comunidades planificadas clave del país.' },
          { title: 'Panama Convention Center', desc: 'Seis cargadores en la Calzada de Amador: el primer centro de convenciones de Panamá con carga para vehículos eléctricos.' },
          { title: 'Green Hubs en desarrollo', desc: 'Cuatro sitios en permisos y diseño — Costa del Este, Vía España, Chitré y David — para llevar carga rápida a los corredores con más tránsito del país.' },
          { title: 'Expo E-Movilidad Panamá', desc: 'Greenspace es fundador y co-organizador de la Expo E-Movilidad Panamá, en sus ediciones 2022, 2023 y 2024.' },
        ],
        hardwareTitle: 'Equipos disponibles en Panamá',
        hardwareLead: HARDWARE_ES,
        faqTitle: 'Preguntas frecuentes — Panamá',
        faq: [
          { q: '¿Qué tipo de cargadores instalan en Panamá?', a: 'Cargadores AC de 7 a 22 kW para estacionamientos de edificios, oficinas, hoteles y flotas que cargan durante la noche; y carga rápida DC desde 30 kW hasta alta potencia para flotas comerciales, estaciones públicas y corredores. La elección depende del tiempo que el vehículo está detenido y de la capacidad eléctrica del sitio.' },
          { q: '¿Hacen también la obra eléctrica?', a: 'Hacemos el diseño eléctrico, el suministro, la configuración, la puesta en marcha y la operación. La ejecución de la obra la realiza el contratista eléctrico del cliente siguiendo nuestro diseño, o un contratista que coordinamos nosotros. Esto deja claro el alcance desde el principio y evita sorpresas de costo.' },
          { q: '¿Trabajan con flotas comerciales?', a: 'Sí. La electrificación de flotas es nuestra línea principal en Panamá: operamos la carga de la flota eléctrica más grande del país y de los depósitos de DHL Express desde 2022. El trabajo incluye análisis de rutas, dimensionamiento de la carga en depósito, control de potencia para no exceder la demanda contratada, y operación.' },
          { q: '¿Qué pasa después de la instalación?', a: 'Los cargadores quedan conectados a una plataforma de gestión sobre OCPP: monitoreo remoto de cada conector, control de usuarios y tarifas, reportes de consumo y alertas de falla. Ofrecemos mantenimiento preventivo y correctivo con seguimiento de disponibilidad.' },
          { q: '¿Desde cuándo opera Greenspace en Panamá?', a: 'Desde 2022. Panamá es la sede de la compañía y el mercado donde tenemos más infraestructura instalada y operando.' },
        ],
        ctaTitle: 'Hablemos de su proyecto de carga en Panamá',
        ctaDesc: 'Cuéntenos cuántos vehículos tiene, dónde cargan y en qué horario. Con eso le decimos qué necesita y qué no.',
        ctaLabel: 'Solicitar evaluación de sitio',
      },
      en: {
        metaTitle: 'EV charging in Panama — chargers, fleets and hubs',
        metaDesc: 'Supply, installation and operation of EV chargers in Panama. AC and DC fast charging for business, fleets, hotels and buildings. Operating since 2022 with DHL Express and Banco General.',
        badge: 'Panama',
        h1: 'EV charging infrastructure in Panama',
        lead: 'Greenspace E-mobility has designed, supplied, installed and operated EV charging infrastructure in Panama since 2022. The company is headquartered in Panama City. We work with commercial fleets, residential and office buildings, hotels, shopping centres and logistics operators — from a single AC charger in a car park to DC fast charging and hubs with on-site solar and storage.',
        servicesTitle: 'What we do in Panama',
        servicesLead: 'We cover the full lifecycle. We do not sell a charger and leave: the equipment we install is the equipment we then operate and maintain.',
        services: SERVICES_EN,
        proofTitle: 'Projects in Panama',
        proofLead: 'Infrastructure that is installed and running, not plans.',
        proof: [
          { title: 'Banco General', desc: 'The largest electric fleet in Panama. Greenspace designed and deployed the complete charging infrastructure and has operated it since 2022.' },
          { title: 'DHL Express Panama', desc: 'Two depots on our charge management platform since December 2022, as part of the electrification of their delivery fleet.' },
          { title: 'Panama Pacifico', desc: 'Charging infrastructure deployed alongside local partners, widening access to EV charging for residents, commuters and fleet operators in one of the country’s key planned communities.' },
          { title: 'Panama Convention Center', desc: 'Six chargers on the Amador Causeway — the first convention venue in Panama with EV charging.' },
          { title: 'Green Hubs in development', desc: 'Four sites in permitting and design — Costa del Este, Vía España, Chitré and David — bringing fast charging to the country’s busiest corridors.' },
          { title: 'Expo E-Movilidad Panamá', desc: 'Greenspace is the founder and co-organiser of Expo E-Movilidad Panamá, across its 2022, 2023 and 2024 editions.' },
        ],
        hardwareTitle: 'Hardware available in Panama',
        hardwareLead: HARDWARE_EN,
        faqTitle: 'Frequently asked questions — Panama',
        faq: [
          { q: 'What kind of chargers do you install in Panama?', a: 'AC chargers from 7 to 22 kW for building, office, hotel and fleet car parks where vehicles sit overnight; and DC fast charging from 30 kW up to high power for commercial fleets, public sites and corridors. The choice follows how long the vehicle is parked and what electrical capacity the site has.' },
          { q: 'Do you carry out the electrical works as well?', a: 'We do the electrical design, supply, configuration, commissioning and operation. The works themselves are executed by the customer’s electrical contractor following our design, or by a contractor we coordinate. That keeps the scope explicit from the start and avoids cost surprises.' },
          { q: 'Do you work with commercial fleets?', a: 'Yes. Fleet electrification is our main line of work in Panama: we operate charging for the largest electric fleet in the country and for DHL Express depots, both since 2022. The work covers route analysis, depot charging sizing, power control so contracted demand is not exceeded, and ongoing operation.' },
          { q: 'What happens after installation?', a: 'Chargers are connected to an OCPP-based management platform: remote monitoring of every connector, user and tariff control, consumption reporting and fault alerts. Preventive and corrective maintenance is offered with uptime tracking.' },
          { q: 'How long has Greenspace operated in Panama?', a: 'Since 2022. Panama is the company’s headquarters and the market where we have the most infrastructure installed and running.' },
        ],
        ctaTitle: 'Let us talk about your charging project in Panama',
        ctaDesc: 'Tell us how many vehicles you run, where they charge and on what schedule. From that we can tell you what you need — and what you do not.',
        ctaLabel: 'Request a site assessment',
      },
    },
  },
  {
    id: 'mexico',
    slug: 'mexico',
    countryName: { en: 'Mexico', es: 'México' },
    countryCode: 'MX',
    region: 'Monterrey, Nuevo León',
    copy: {
      es: {
        metaTitle: 'Cargadores para vehículos eléctricos en México',
        metaDesc: 'Infraestructura de carga para vehículos eléctricos en México: carga rápida DC, carga para flotas y camiones de carga. Ruta binacional Monterrey–Laredo acordada con el Gobierno de Nuevo León.',
        badge: 'México',
        h1: 'Cargadores para vehículos eléctricos en México',
        lead: 'Greenspace E-mobility desarrolla infraestructura de carga para vehículos eléctricos en México, con foco en Nuevo León y el corredor de carga hacia la frontera. En septiembre de 2025 firmamos un acuerdo con el Gobierno de Nuevo León para la ruta binacional de carga eléctrica Monterrey–Laredo. Atendemos flotas, operadores logísticos, desarrolladores inmobiliarios y empresas que necesitan carga comercial.',
        servicesTitle: 'Qué hacemos en México',
        servicesLead: 'Desde el estudio de un solo sitio hasta el desarrollo de un hub de carga sobre el corredor.',
        services: SERVICES_ES,
        proofTitle: 'Nuestro trabajo en México',
        proofLead: 'Lo que está firmado, lo que está en desarrollo y lo que podemos suministrar hoy.',
        proof: [
          { title: 'Acuerdo con el Gobierno de Nuevo León', desc: 'Firmado en septiembre de 2025 para la ruta binacional de carga eléctrica Monterrey–Laredo: la primera ruta de carga 100% eléctrica entre México y Estados Unidos.' },
          { title: 'Hub en el Puente Colombia', desc: 'Hub de carga previsto en el cruce de Colombia, Nuevo León, para dar servicio al tránsito de carga transfronterizo entre Monterrey y Laredo.' },
          { title: 'Corredor Monterrey–Laredo–Dallas', desc: 'La extensión mexicana de la Autopista Eléctrica Greenspace, que conecta Monterrey con Dallas por la Carretera 85 y la I-35.' },
          { title: 'Carga comercial y de flotas', desc: 'Suministro, diseño e instalación de carga AC y DC para flotas, centros de distribución, desarrollos comerciales y estacionamientos en México.' },
        ],
        hardwareTitle: 'Equipos disponibles en México',
        hardwareLead: HARDWARE_ES,
        faqTitle: 'Preguntas frecuentes — México',
        faq: [
          { q: '¿En qué parte de México operan?', a: 'Nuestro foco está en Nuevo León y el corredor de carga hacia la frontera con Texas, que es donde se concentra el tránsito de carga pesada entre México y Estados Unidos. Atendemos proyectos comerciales y de flota en otras zonas del país según el alcance.' },
          { q: '¿Qué es la ruta Monterrey–Laredo?', a: 'Un acuerdo firmado con el Gobierno de Nuevo León en septiembre de 2025 para habilitar una ruta de carga eléctrica entre Monterrey y Laredo, con un hub previsto en el cruce del Puente Colombia. Del lado estadounidense se conecta con nuestros Green Hubs sobre la I-35.' },
          { q: '¿Instalan carga para camiones eléctricos?', a: 'Sí. La carga de vehículos Clase 8 es una línea central de nuestro trabajo: potencias altas en DC, conectores CCS1 y preparación para MCS, con gestión de potencia y generación solar y almacenamiento donde el sitio lo permite.' },
          { q: '¿Suministran cargadores a empresas en México?', a: 'Sí, con catálogo comercial propio para México. Suministramos cargadores AC y DC de fabricantes con respaldo y repuestos, junto con el diseño, la puesta en marcha y la operación sobre OCPP.' },
        ],
        ctaTitle: 'Hablemos de su proyecto de carga en México',
        ctaDesc: 'Flota, centro de distribución, desarrollo comercial o hub sobre el corredor: cuéntenos el caso y le decimos qué hace falta.',
        ctaLabel: 'Hablar con un especialista',
      },
      en: {
        metaTitle: 'EV charging in Mexico — fleets, trucks and corridor hubs',
        metaDesc: 'EV charging infrastructure in Mexico: DC fast charging, fleet charging and freight charging. Monterrey–Laredo binational route agreed with the Government of Nuevo León.',
        badge: 'Mexico',
        h1: 'EV charging infrastructure in Mexico',
        lead: 'Greenspace E-mobility develops EV charging infrastructure in Mexico, focused on Nuevo León and the freight corridor to the border. In September 2025 we signed an agreement with the Government of Nuevo León for the Monterrey–Laredo binational electric cargo route. We work with fleets, logistics operators, real-estate developers and companies that need commercial charging.',
        servicesTitle: 'What we do in Mexico',
        servicesLead: 'From a single site study to developing a charging hub on the corridor.',
        services: SERVICES_EN,
        proofTitle: 'Our work in Mexico',
        proofLead: 'What is signed, what is in development, and what we can supply today.',
        proof: [
          { title: 'Agreement with the Government of Nuevo León', desc: 'Signed in September 2025 for the Monterrey–Laredo binational electric cargo route — the first fully electric freight route between Mexico and the United States.' },
          { title: 'Colombia Bridge hub', desc: 'A charging hub planned at the Colombia, Nuevo León crossing, serving cross-border freight between Monterrey and Laredo.' },
          { title: 'Monterrey–Laredo–Dallas corridor', desc: 'The Mexican leg of the Greenspace Electric Highway, connecting Monterrey to Dallas via Highway 85 and I-35.' },
          { title: 'Commercial and fleet charging', desc: 'Supply, design and installation of AC and DC charging for fleets, distribution centres, commercial developments and car parks across Mexico.' },
        ],
        hardwareTitle: 'Hardware available in Mexico',
        hardwareLead: HARDWARE_EN,
        faqTitle: 'Frequently asked questions — Mexico',
        faq: [
          { q: 'Where in Mexico do you operate?', a: 'Our focus is Nuevo León and the freight corridor to the Texas border, where heavy freight between Mexico and the United States concentrates. We take commercial and fleet projects elsewhere in the country depending on scope.' },
          { q: 'What is the Monterrey–Laredo route?', a: 'An agreement signed with the Government of Nuevo León in September 2025 to enable an electric cargo route between Monterrey and Laredo, with a hub planned at the Colombia Bridge crossing. On the US side it connects to our Green Hubs on I-35.' },
          { q: 'Do you install charging for electric trucks?', a: 'Yes. Class 8 charging is central to our work: high-power DC, CCS1 connectors and MCS readiness, with power management and on-site solar and storage where the site allows it.' },
          { q: 'Do you supply chargers to companies in Mexico?', a: 'Yes, with a dedicated commercial catalogue for Mexico. We supply AC and DC chargers from manufacturers with local support and spare parts, together with design, commissioning and OCPP-based operation.' },
        ],
        ctaTitle: 'Let us talk about your charging project in Mexico',
        ctaDesc: 'Fleet, distribution centre, commercial development or a hub on the corridor — tell us the case and we will tell you what it takes.',
        ctaLabel: 'Talk to a specialist',
      },
    },
  },
  {
    id: 'usa',
    slug: 'usa',
    countryName: { en: 'United States', es: 'Estados Unidos' },
    countryCode: 'US',
    region: 'Laredo, Texas',
    copy: {
      es: {
        metaTitle: 'Cargadores para vehículos eléctricos en Estados Unidos',
        metaDesc: 'Infraestructura de carga para camiones eléctricos Clase 8 en Texas y el corredor I-35. Green Hubs entre Laredo y Dallas, carga en depósito y operación. Primer Windrose Clase 8 en servicio comercial en EE.UU.',
        badge: 'Estados Unidos',
        h1: 'Cargadores para vehículos eléctricos en Estados Unidos',
        lead: 'En Estados Unidos, Greenspace E-mobility construye la infraestructura de carga del corredor de carga más transitado del país: la I-35 entre Laredo y Dallas. Nuestro gerente general para EE.UU. está basado en Laredo. El trabajo se concentra en camiones Clase 8, carga en depósito para centros de distribución y Green Hubs de alta potencia sobre la carretera.',
        servicesTitle: 'Qué hacemos en Estados Unidos',
        servicesLead: 'Carga pesada sobre corredor, carga en depósito del cliente y la operación de ambas.',
        services: SERVICES_EN.map(s => s),
        proofTitle: 'Nuestro trabajo en Estados Unidos',
        proofLead: 'Camiones eléctricos que ya ruedan, y la infraestructura que los va a alimentar.',
        proof: [
          { title: 'Primer Windrose Clase 8 en servicio comercial en EE.UU.', desc: 'Opera la ruta Laredo–Dallas con Allogic Transport desde abril de 2026, superando las 20.000 millas eléctricas.' },
          { title: 'DSV — 10 camiones eléctricos', desc: 'DSV anunció en julio de 2026 el despliegue de diez camiones Windrose Clase 8 junto a Allogic y Greenspace, con 25 unidades adicionales en 2027.' },
          { title: 'Green Hubs Fase 1 sobre la I-35', desc: 'Cuatro hubs entre Laredo y Dallas — Encinal/Laredo, Kyle/Buda, Waco–Dallas y Lancaster — más carga en depósito en sitios de clientes.' },
          { title: 'Diseño de hub de alta potencia', desc: 'Carga DC de hasta nivel megavatio, conexión en media tensión dimensionada tres veces por encima de la demanda inicial, generación solar y almacenamiento para control de demanda.' },
        ],
        hardwareTitle: 'Equipos disponibles en Estados Unidos',
        hardwareLead: HARDWARE_ES,
        faqTitle: 'Preguntas frecuentes — Estados Unidos',
        faq: [
          { q: '¿Dónde opera Greenspace en Estados Unidos?', a: 'En Texas, sobre el corredor de la I-35 entre Laredo y Dallas, con gerencia general basada en Laredo. El plan de red se extiende después al Triángulo de Texas y hacia el oeste por la I-10.' },
          { q: '¿Solo trabajan con camiones?', a: 'La carga de camiones Clase 8 es el foco del corredor, pero también diseñamos y operamos carga en depósito para centros de distribución y almacenes, que es donde la mayor parte de la energía se entrega en una flota de carga.' },
          { q: '¿Qué potencia tienen los Green Hubs?', a: 'El diseño de referencia contempla carga DC de alta potencia con preparación para el estándar MCS de carga de megavatio, varias posiciones refrigeradas por líquido, y una conexión en media tensión dimensionada para crecer sin rehacer la obra civil.' },
          { q: '¿Pueden instalar carga en nuestro almacén?', a: 'Sí. Diseñamos, construimos y operamos carga en el sitio del cliente, incluyendo generación solar y almacenamiento, bajo contratos de suministro de energía de largo plazo para que el cliente no asuma la inversión.' },
        ],
        ctaTitle: 'Hablemos de su proyecto de carga en Estados Unidos',
        ctaDesc: 'Flota de carga, centro de distribución o sitio sobre el corredor: podemos evaluar la capacidad eléctrica y el caso de negocio.',
        ctaLabel: 'Hablar con un especialista',
      },
      en: {
        metaTitle: 'EV charging in the United States — I-35 corridor and depots',
        metaDesc: 'Charging infrastructure for Class 8 electric trucks in Texas and the I-35 corridor. Green Hubs between Laredo and Dallas, depot charging and operations. First Windrose Class 8 in US commercial service.',
        badge: 'United States',
        h1: 'EV charging infrastructure in the United States',
        lead: 'In the United States, Greenspace E-mobility is building the charging infrastructure for the country’s busiest freight corridor: I-35 between Laredo and Dallas. Our US general manager is based in Laredo. The work concentrates on Class 8 trucks, depot charging for distribution centres, and high-power Green Hubs on the highway.',
        servicesTitle: 'What we do in the United States',
        servicesLead: 'Heavy-duty charging on the corridor, charging at the customer’s own depot, and the operation of both.',
        services: SERVICES_EN,
        proofTitle: 'Our work in the United States',
        proofLead: 'Electric trucks already running, and the infrastructure that will feed them.',
        proof: [
          { title: 'First Windrose Class 8 in US commercial service', desc: 'Running the Laredo–Dallas lane with Allogic Transport since April 2026, past 20,000 electric miles.' },
          { title: 'DSV — 10 electric trucks', desc: 'DSV announced in July 2026 the deployment of ten Windrose Class 8 trucks with Allogic and Greenspace, with 25 further units in 2027.' },
          { title: 'Phase 1 Green Hubs on I-35', desc: 'Four hubs between Laredo and Dallas — Encinal/Laredo, Kyle/Buda, Waco–Dallas and Lancaster — plus depot charging at customer sites.' },
          { title: 'High-power hub design', desc: 'DC charging up to megawatt level, a medium-voltage connection sized three times above day-one demand, with solar generation and storage for demand control.' },
        ],
        hardwareTitle: 'Hardware available in the United States',
        hardwareLead: HARDWARE_EN,
        faqTitle: 'Frequently asked questions — United States',
        faq: [
          { q: 'Where does Greenspace operate in the United States?', a: 'In Texas, on the I-35 corridor between Laredo and Dallas, with the general manager based in Laredo. The network plan then extends into the Texas Triangle and west along I-10.' },
          { q: 'Do you only work with trucks?', a: 'Class 8 charging is the focus of the corridor, but we also design and operate depot charging for distribution centres and warehouses — which is where most of the energy in a freight fleet is actually delivered.' },
          { q: 'What power do the Green Hubs deliver?', a: 'The reference design covers high-power DC with readiness for the MCS megawatt charging standard, several liquid-cooled positions, and a medium-voltage connection sized to grow without redoing the civil works.' },
          { q: 'Can you install charging at our warehouse?', a: 'Yes. We design, build and operate charging at the customer site, including solar generation and storage, under long-term energy supply agreements so the customer does not carry the capital cost.' },
        ],
        ctaTitle: 'Let us talk about your charging project in the United States',
        ctaDesc: 'Freight fleet, distribution centre or a site on the corridor — we can assess the electrical capacity and the business case.',
        ctaLabel: 'Talk to a specialist',
      },
    },
  },
  {
    id: 'colombia',
    slug: 'colombia',
    countryName: { en: 'Colombia', es: 'Colombia' },
    countryCode: 'CO',
    region: 'Colombia',
    copy: {
      es: {
        metaTitle: 'Cargadores para vehículos eléctricos en Colombia',
        metaDesc: 'Suministro, diseño e instalación de cargadores para vehículos eléctricos en Colombia. Carga AC y DC rápida para empresas, flotas y edificios, con operación sobre OCPP.',
        badge: 'Colombia',
        h1: 'Cargadores para vehículos eléctricos en Colombia',
        lead: 'Greenspace E-mobility suministra e implementa infraestructura de carga para vehículos eléctricos en Colombia. Llevamos a este mercado el mismo modelo con el que operamos en Panamá desde 2022: ingeniería primero, equipos de fabricantes con respaldo, y una red que se opera y se mantiene después de encenderla. Atendemos empresas, flotas comerciales, edificios y desarrollos inmobiliarios.',
        servicesTitle: 'Qué ofrecemos en Colombia',
        servicesLead: 'Alcance completo de suministro e implementación, con el soporte de nuestra operación regional.',
        services: SERVICES_ES,
        proofTitle: 'Qué respalda nuestro trabajo',
        proofLead: 'Colombia es un mercado en apertura para nosotros. Lo que traemos es la experiencia de operar infraestructura en otros países de la región.',
        proof: [
          { title: 'Operación propia desde 2022', desc: 'En Panamá operamos la mayor flota eléctrica del país y los depósitos de DHL Express. No somos un intermediario: operamos lo que instalamos.' },
          { title: 'Catálogo multimarca', desc: 'Cargadores AC y DC de Autel Energy, Sinexcel, LumosEnergy, Sungrow y nuestra propia línea Greenspace, seleccionados según el caso y no según un acuerdo exclusivo.' },
          { title: 'Operación sobre OCPP', desc: 'Gestión de carga abierta: monitoreo remoto, usuarios, tarifas y control de potencia, sin quedar atados a la plataforma de un único fabricante.' },
          { title: 'Energía integrada', desc: 'Donde el proyecto lo justifica, combinamos carga con generación solar y almacenamiento para reducir el costo de la energía y la demanda contratada.' },
        ],
        hardwareTitle: 'Equipos disponibles en Colombia',
        hardwareLead: HARDWARE_ES,
        faqTitle: 'Preguntas frecuentes — Colombia',
        faq: [
          { q: '¿Greenspace tiene operación en Colombia?', a: 'Colombia es un mercado en apertura para Greenspace. Suministramos equipos y ejecutamos proyectos de diseño, implementación y operación desde nuestra estructura regional, con sede principal en Panamá, donde operamos desde 2022.' },
          { q: '¿Qué cargadores pueden suministrar en Colombia?', a: 'Cargadores AC de 7 a 22 kW para edificios, oficinas y flotas que cargan de noche, y carga rápida DC desde 30 kW en adelante para uso comercial y público. Todos los equipos son compatibles con OCPP.' },
          { q: '¿Qué incluye el alcance?', a: 'Evaluación del sitio y de la capacidad eléctrica, diseño, suministro de equipos, coordinación de la instalación con el contratista eléctrico, puesta en marcha, configuración de la plataforma de gestión y mantenimiento.' },
          { q: '¿Cómo empezamos?', a: 'Con una conversación sobre el caso concreto: cuántos vehículos, dónde cargan, cuánto tiempo están detenidos y qué capacidad eléctrica tiene el sitio. A partir de ahí dimensionamos y cotizamos.' },
        ],
        ctaTitle: 'Hablemos de su proyecto de carga en Colombia',
        ctaDesc: 'Cuéntenos el caso y le decimos qué equipo y qué capacidad eléctrica necesita, antes de cotizar nada.',
        ctaLabel: 'Hablar con un especialista',
      },
      en: {
        metaTitle: 'EV charging in Colombia — supply, design and operation',
        metaDesc: 'Supply, design and installation of EV chargers in Colombia. AC and DC fast charging for business, fleets and buildings, operated over OCPP.',
        badge: 'Colombia',
        h1: 'EV charging infrastructure in Colombia',
        lead: 'Greenspace E-mobility supplies and implements EV charging infrastructure in Colombia. We bring the same model we have run in Panama since 2022: engineering first, hardware from manufacturers with real support, and a network that is operated and maintained after it is switched on. We work with companies, commercial fleets, buildings and property developments.',
        servicesTitle: 'What we offer in Colombia',
        servicesLead: 'Full supply and implementation scope, backed by our regional operation.',
        services: SERVICES_EN,
        proofTitle: 'What backs our work',
        proofLead: 'Colombia is a market we are opening. What we bring to it is the experience of operating infrastructure elsewhere in the region.',
        proof: [
          { title: 'Our own operation since 2022', desc: 'In Panama we operate the largest electric fleet in the country and the DHL Express depots. We are not a middleman: we operate what we install.' },
          { title: 'Multi-brand catalogue', desc: 'AC and DC chargers from Autel Energy, Sinexcel, LumosEnergy, Sungrow and our own Greenspace line, chosen per project rather than by an exclusive agreement.' },
          { title: 'OCPP-based operation', desc: 'Open charge management: remote monitoring, users, tariffs and power control, without being locked into one manufacturer’s platform.' },
          { title: 'Integrated energy', desc: 'Where the project justifies it, we combine charging with solar generation and storage to cut energy cost and contracted demand.' },
        ],
        hardwareTitle: 'Hardware available in Colombia',
        hardwareLead: HARDWARE_EN,
        faqTitle: 'Frequently asked questions — Colombia',
        faq: [
          { q: 'Does Greenspace operate in Colombia?', a: 'Colombia is a market Greenspace is opening. We supply equipment and deliver design, implementation and operation projects through our regional structure, headquartered in Panama, where we have operated since 2022.' },
          { q: 'What chargers can you supply in Colombia?', a: 'AC chargers from 7 to 22 kW for buildings, offices and fleets charging overnight, and DC fast charging from 30 kW upward for commercial and public use. Everything we supply is OCPP compatible.' },
          { q: 'What does the scope include?', a: 'Site and electrical capacity assessment, design, equipment supply, coordination of the installation with the electrical contractor, commissioning, management platform configuration and maintenance.' },
          { q: 'How do we start?', a: 'With a conversation about the actual case: how many vehicles, where they charge, how long they sit, and what electrical capacity the site has. We size and quote from there.' },
        ],
        ctaTitle: 'Let us talk about your charging project in Colombia',
        ctaDesc: 'Tell us the case and we will tell you what hardware and what electrical capacity it needs, before quoting anything.',
        ctaLabel: 'Talk to a specialist',
      },
    },
  },
]
