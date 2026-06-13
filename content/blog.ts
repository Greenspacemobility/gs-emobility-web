// ─────────────────────────────────────────────────────────────────────────────
// Blog / Insights content source
//
// Each article carries an English and Spanish version. The blog pages read from
// this file; the weekly-article cron emails new drafts to the team, and once
// approved an editor adds the article object here.
//
// Styling: `body` is HTML rendered inside a `.article-prose` wrapper (see
// globals.css). Use only <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <a>.
// Keep brand names out of marketing copy — use generic terms like "high-power
// DC charging" and "Class 8 electric trucks".
// ─────────────────────────────────────────────────────────────────────────────

export type Reference = { title: string; url: string; publisher: string; year: string }

export type ArticleContent = {
  title: string
  metaDescription: string
  excerpt: string
  readingTime: string
  category: string
  body: string
  references: Reference[]
}

export type Article = {
  slug: string
  date: string // ISO date, used for sorting + sitemap lastModified
  heroImage: string
  keywords: string[]
  en: ArticleContent
  es: ArticleContent
}

export const ARTICLES: Article[] = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'ev-charging-hubs-panama',
    date: '2026-06-08',
    heroImage: '/images/projects/electric-highway-corridor.webp',
    keywords: [
      'EV charging Panama', 'estaciones de carga Panamá', 'cargador vehículo eléctrico Panamá',
      'EV charging hub Panama', 'carga rápida Panamá', 'solar EV charging Panama',
    ],
    en: {
      title: 'EV Charging Hubs in Panama: Closing the Infrastructure Gap with Solar-Powered Stations',
      metaDescription: 'How solar-and-storage EV charging hubs are expanding fast-charging access across Panama — and what drivers, fleets and site owners need to know in 2026.',
      excerpt: 'Panama is electrifying faster than its grid can keep up. Here is how solar-powered charging hubs are closing the gap — and what it means for drivers and businesses.',
      readingTime: '6 min read',
      category: 'Market Insights',
      body: `
<p>Panama has one of the fastest-growing electric-vehicle markets in Central America, but charging infrastructure has not kept pace. Drivers outside Panama City still plan trips around a handful of public chargers, and many sites that <em>could</em> host a station are held back by grid capacity rather than demand. The bottleneck is no longer interest — it is power delivery.</p>

<h2>Why the grid is the real constraint</h2>
<p>Adding a single high-power DC charger to a commercial site can mean requesting a service upgrade, waiting months for utility approval, and paying for transformer and feeder work. For a station with several fast chargers, the connected load rivals that of a small factory. In a market where the distribution network was never designed for clustered, high-peak EV loads, that is the single biggest reason good locations stay empty.</p>

<h2>How solar-and-storage hubs change the math</h2>
<p>A charging hub that pairs on-site solar generation with battery storage flips the problem. Instead of drawing every kilowatt from the grid at the moment a vehicle plugs in, the battery buffers demand — charging slowly from solar and the grid during off-peak hours, then discharging quickly when a driver needs 150 kW for ten minutes. This delivers three concrete advantages:</p>
<ul>
<li><strong>Build where the grid is weak.</strong> Storage lets a hub deliver fast charging even on a constrained feeder, opening up highway and rural sites that would otherwise be impossible.</li>
<li><strong>Lower operating cost.</strong> Solar generation and off-peak charging cut the energy bill and shave the demand charges that dominate commercial electricity rates.</li>
<li><strong>Resilience.</strong> When the grid dips — not unheard of during the dry-season peak — a hub with storage keeps serving customers.</li>
</ul>

<h2>What this means for drivers</h2>
<p>For everyday EV owners, the practical effect is more places to charge and shorter waits. A modern DC hub can add roughly 100 km of range in five to ten minutes, turning a charging stop into the length of a coffee break rather than a planning exercise. As hubs spread along the Pan-American Highway and toward the interior, the "range anxiety" that still deters first-time buyers steadily disappears.</p>

<h2>What this means for site owners and fleets</h2>
<p>For a shopping center, hotel, fuel station or logistics depot, a charging hub is increasingly a revenue and retention play rather than a cost. Charging customers dwell longer and return more often, and a well-sited hub can sell energy by the kilowatt-hour, by subscription, or as a premium amenity. Fleets gain the most: predictable depot charging plus access to a public network turns vehicle electrification from a pilot into an operating decision.</p>

<h2>The road ahead</h2>
<p>Panama's advantage is that it can build the right infrastructure from the start — solar-integrated, storage-backed, software-managed — rather than retrofitting a legacy network. The hubs going in now are designed for the heavy-duty corridor traffic of the next decade, not just today's passenger cars. That is the gap worth closing, and it is closing fast.</p>

<p><em>Greenspace E-mobility designs, installs and operates solar-powered charging hubs across Panama. If you own a site or run a fleet, <a href="/en/contact">talk to our team</a> about a feasibility study.</em></p>
`,
      references: [
        { title: 'Global EV Outlook 2025', url: 'https://www.iea.org/reports/global-ev-outlook-2025', publisher: 'International Energy Agency', year: '2025' },
        { title: 'Electric Vehicle Charging Infrastructure Trends', url: 'https://www.bnef.com', publisher: 'BloombergNEF', year: '2025' },
        { title: 'Latin America EV Market Overview', url: 'https://latamobility.com', publisher: 'Latam Mobility', year: '2025' },
      ],
    },
    es: {
      title: 'Estaciones de Carga para Autos Eléctricos en Panamá: Cerrando la Brecha con Energía Solar',
      metaDescription: 'Cómo las estaciones de carga con energía solar y almacenamiento están ampliando el acceso a la carga rápida en Panamá — y lo que conductores, flotas y dueños de sitios deben saber en 2026.',
      excerpt: 'Panamá se electrifica más rápido de lo que su red puede soportar. Así es como las estaciones de carga con energía solar están cerrando la brecha — y qué significa para conductores y empresas.',
      readingTime: '6 min de lectura',
      category: 'Perspectivas de Mercado',
      body: `
<p>Panamá tiene uno de los mercados de vehículos eléctricos de más rápido crecimiento en Centroamérica, pero la infraestructura de carga no ha seguido el ritmo. Los conductores fuera de la Ciudad de Panamá todavía planifican sus viajes en torno a un puñado de cargadores públicos, y muchos sitios que <em>podrían</em> alojar una estación están limitados por la capacidad de la red eléctrica, no por la demanda. El cuello de botella ya no es el interés — es la entrega de potencia.</p>

<h2>Por qué la red eléctrica es la verdadera limitación</h2>
<p>Agregar un solo cargador DC de alta potencia a un sitio comercial puede implicar solicitar una ampliación del servicio, esperar meses por la aprobación de la distribuidora y pagar por trabajos de transformador y acometida. Para una estación con varios cargadores rápidos, la carga conectada se acerca a la de una pequeña fábrica. En un mercado donde la red de distribución nunca fue diseñada para cargas EV agrupadas y de alto pico, esa es la razón principal por la que buenas ubicaciones permanecen vacías.</p>

<h2>Cómo las estaciones solares con almacenamiento cambian la ecuación</h2>
<p>Una estación de carga que combina generación solar en sitio con almacenamiento en baterías le da la vuelta al problema. En lugar de tomar cada kilovatio de la red en el momento en que un vehículo se conecta, la batería amortigua la demanda — cargándose lentamente con energía solar y de la red en horas de bajo consumo, y descargándose rápidamente cuando un conductor necesita 150 kW durante diez minutos. Esto entrega tres ventajas concretas:</p>
<ul>
<li><strong>Construir donde la red es débil.</strong> El almacenamiento permite entregar carga rápida incluso en una acometida limitada, habilitando sitios en carretera y zonas rurales que de otro modo serían imposibles.</li>
<li><strong>Menor costo de operación.</strong> La generación solar y la carga en horas valle reducen la factura energética y los cargos por demanda que dominan las tarifas comerciales.</li>
<li><strong>Resiliencia.</strong> Cuando la red falla — algo no inusual durante el pico de la estación seca — una estación con almacenamiento sigue atendiendo a sus clientes.</li>
</ul>

<h2>Qué significa para los conductores</h2>
<p>Para los dueños de vehículos eléctricos, el efecto práctico es más lugares para cargar y esperas más cortas. Una estación DC moderna puede agregar unos 100 km de autonomía en cinco a diez minutos, convirtiendo la parada de carga en algo tan breve como un café. A medida que las estaciones se extienden por la Carretera Panamericana y hacia el interior, la "ansiedad de autonomía" que aún frena a los nuevos compradores desaparece progresivamente.</p>

<h2>Qué significa para dueños de sitios y flotas</h2>
<p>Para un centro comercial, hotel, estación de servicio o depósito logístico, una estación de carga es cada vez más una oportunidad de ingresos y fidelización en lugar de un costo. Los clientes que cargan permanecen más tiempo y regresan con mayor frecuencia, y una estación bien ubicada puede vender energía por kilovatio-hora, por suscripción o como servicio premium. Las flotas son las más beneficiadas: la carga predecible en el depósito más el acceso a una red pública convierten la electrificación de vehículos de un piloto a una decisión operativa.</p>

<h2>El camino por delante</h2>
<p>La ventaja de Panamá es que puede construir la infraestructura correcta desde el principio — integrada con solar, respaldada con almacenamiento y gestionada por software — en lugar de modernizar una red heredada. Las estaciones que se instalan ahora están diseñadas para el tráfico de carga pesada del corredor de la próxima década, no solo para los autos de hoy. Esa es la brecha que vale la pena cerrar, y se está cerrando rápido.</p>

<p><em>Greenspace E-mobility diseña, instala y opera estaciones de carga con energía solar en todo Panamá. Si tienes un sitio o gestionas una flota, <a href="/es/contact">habla con nuestro equipo</a> sobre un estudio de factibilidad.</em></p>
`,
      references: [
        { title: 'Global EV Outlook 2025', url: 'https://www.iea.org/reports/global-ev-outlook-2025', publisher: 'Agencia Internacional de Energía', year: '2025' },
        { title: 'Tendencias en Infraestructura de Carga EV', url: 'https://www.bnef.com', publisher: 'BloombergNEF', year: '2025' },
        { title: 'Panorama del Mercado EV en Latinoamérica', url: 'https://latamobility.com', publisher: 'Latam Mobility', year: '2025' },
      ],
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'electric-truck-charging-corridor-texas-mexico',
    date: '2026-05-28',
    heroImage: '/images/projects/windrose-greenspace-ruta-verde.jpg',
    keywords: [
      'electric truck charging Texas', 'Laredo corridor charging', 'corredor eléctrico Monterrey',
      'Class 8 electric truck charging', 'Mexico Texas electric highway', 'freight corridor EV charging',
    ],
    en: {
      title: 'Charging the Mexico–Texas Freight Corridor: What It Takes to Electrify Class 8 Trucking',
      metaDescription: 'The Monterrey–Laredo–Texas corridor moves a huge share of North American trade. Here is what charging infrastructure heavy-duty electric trucks actually need to run it.',
      excerpt: 'The busiest freight corridor in North America is going electric. The hard part is not the trucks — it is the charging network that lets them cross the border without stopping.',
      readingTime: '7 min read',
      category: 'Electric Highway',
      body: `
<p>The corridor running from Monterrey through Laredo and up into the Texas Triangle is one of the most intense freight routes on the continent. Hundreds of billions of dollars in goods cross it every year, much of it on Class 8 trucks. Electrifying that flow is one of the largest decarbonization opportunities in the Americas — and it hinges almost entirely on charging infrastructure, not on the trucks themselves.</p>

<h2>The trucks are ready. The network is not.</h2>
<p>Today's Class 8 electric trucks can cover roughly 400–500 km on a charge and recover most of that range in about an hour of high-power DC charging. That is enough to run real freight lanes — <em>if</em> there is somewhere to charge at each end and at the midpoint of a long haul. The missing piece is a chain of stations spaced for heavy-duty range and built to deliver megawatt-class power to several trucks at once.</p>

<h2>Why heavy-duty charging is a different problem</h2>
<p>Charging a fleet of trucks is not just "a bigger version" of charging cars. The differences are structural:</p>
<ul>
<li><strong>Power per stall.</strong> A passenger fast charger delivers 50–150 kW. A heavy-duty truck wants 350 kW or more, and the next standard pushes toward the megawatt range for the largest vehicles.</li>
<li><strong>Simultaneity.</strong> Trucks arrive in clusters and run on schedules. A corridor hub may need to serve several vehicles at full power at the same time — connected loads in the multiple-megawatt range.</li>
<li><strong>Footprint.</strong> Stalls must fit a tractor-trailer pulling straight through, not a sedan reversing into a bay.</li>
<li><strong>Uptime.</strong> A dead charger on a freight lane is not an inconvenience — it strands cargo. Redundancy and remote monitoring are non-negotiable.</li>
</ul>

<h2>The role of on-site generation and storage</h2>
<p>Pulling several megawatts off the grid at a remote highway interchange is often impossible on the existing network, and always expensive. Pairing each hub with solar generation and large-scale battery storage lets the site charge its batteries steadily and then deliver bursts of high power on demand. It also smooths the enormous demand charges that would otherwise make corridor charging uneconomic. In effect, storage is what makes a megawatt hub buildable at a rural exit.</p>

<h2>Cross-border continuity</h2>
<p>A truck does not care which country it is in — it cares whether the next station is reachable. The corridor only works if charging is continuous across the border, with compatible connectors, interoperable payment and roaming, and consistent power levels on both sides. Designing the Mexican and U.S. segments as one network — rather than two national projects that happen to meet at Laredo — is what turns a series of stations into a usable freight lane.</p>

<h2>Building ahead of demand</h2>
<p>The economics of corridor charging reward whoever builds first and builds right. Early hubs anchor freight relationships, establish the network effect that makes later sites more valuable, and lock in the best highway locations. The phased approach — launch the anchor markets, then fill the gaps between them — is how a continental electric highway gets built without waiting for every truck to be electric first.</p>

<p><em>Greenspace E-mobility is developing solar-powered charging hubs along the Mexico–Texas freight corridor. <a href="/en/electric-highway">Explore the Electric Highway</a> or <a href="/en/contact">contact our team</a> about fleet and corridor partnerships.</em></p>
`,
      references: [
        { title: 'Laredo Port of Entry Trade Statistics', url: 'https://www.bts.gov', publisher: 'U.S. Bureau of Transportation Statistics', year: '2025' },
        { title: 'Megawatt Charging System (MCS) Standard', url: 'https://www.charin.global', publisher: 'CharIN', year: '2025' },
        { title: 'Electrifying Long-Haul Trucking', url: 'https://rmi.org', publisher: 'Rocky Mountain Institute', year: '2024' },
      ],
    },
    es: {
      title: 'Corredor Eléctrico México–Texas: La Infraestructura de Carga para Camiones de Carga Pesada',
      metaDescription: 'El corredor Monterrey–Laredo–Texas mueve gran parte del comercio de Norteamérica. Esto es lo que realmente necesita la infraestructura de carga para electrificar los camiones Clase 8.',
      excerpt: 'El corredor de carga más activo de Norteamérica se vuelve eléctrico. Lo difícil no son los camiones — es la red de carga que les permite cruzar la frontera sin detenerse.',
      readingTime: '7 min de lectura',
      category: 'Autopista Eléctrica',
      body: `
<p>El corredor que va de Monterrey, pasando por Laredo y subiendo hacia el Triángulo de Texas, es una de las rutas de carga más intensas del continente. Cientos de miles de millones de dólares en mercancías lo cruzan cada año, gran parte en camiones Clase 8. Electrificar ese flujo es una de las mayores oportunidades de descarbonización en las Américas — y depende casi por completo de la infraestructura de carga, no de los camiones.</p>

<h2>Los camiones están listos. La red no.</h2>
<p>Los camiones eléctricos Clase 8 actuales pueden recorrer entre 400 y 500 km por carga y recuperar la mayor parte de esa autonomía en aproximadamente una hora de carga DC de alta potencia. Eso es suficiente para operar rutas de carga reales — <em>siempre que</em> haya dónde cargar en cada extremo y en el punto medio de un viaje largo. La pieza faltante es una cadena de estaciones espaciadas para la autonomía de carga pesada y construidas para entregar potencia de nivel megavatio a varios camiones a la vez.</p>

<h2>Por qué la carga pesada es un problema distinto</h2>
<p>Cargar una flota de camiones no es simplemente "una versión más grande" de cargar autos. Las diferencias son estructurales:</p>
<ul>
<li><strong>Potencia por puesto.</strong> Un cargador rápido para autos entrega entre 50 y 150 kW. Un camión de carga pesada requiere 350 kW o más, y el siguiente estándar avanza hacia el rango de megavatios para los vehículos más grandes.</li>
<li><strong>Simultaneidad.</strong> Los camiones llegan en grupos y operan según horarios. Una estación del corredor puede necesitar atender a varios vehículos a plena potencia al mismo tiempo — cargas conectadas en el rango de varios megavatios.</li>
<li><strong>Espacio físico.</strong> Los puestos deben acomodar un tractocamión que pasa de frente, no un sedán que se estaciona en reversa.</li>
<li><strong>Disponibilidad.</strong> Un cargador averiado en una ruta de carga no es una molestia — deja varada la mercancía. La redundancia y el monitoreo remoto son indispensables.</li>
</ul>

<h2>El papel de la generación y el almacenamiento en sitio</h2>
<p>Tomar varios megavatios de la red en un cruce de carretera remoto suele ser imposible con la red existente, y siempre es costoso. Combinar cada estación con generación solar y almacenamiento de gran escala permite cargar las baterías de manera constante y luego entregar ráfagas de alta potencia bajo demanda. También suaviza los enormes cargos por demanda que harían inviable la carga en el corredor. En la práctica, el almacenamiento es lo que hace construible una estación de megavatios en una salida rural.</p>

<h2>Continuidad transfronteriza</h2>
<p>A un camión no le importa en qué país está — le importa si la siguiente estación es alcanzable. El corredor solo funciona si la carga es continua a través de la frontera, con conectores compatibles, pago e itinerancia interoperables y niveles de potencia consistentes en ambos lados. Diseñar los tramos mexicano y estadounidense como una sola red — en lugar de dos proyectos nacionales que coinciden en Laredo — es lo que convierte una serie de estaciones en una ruta de carga utilizable.</p>

<h2>Construir antes que la demanda</h2>
<p>La economía de la carga en corredor premia a quien construye primero y construye bien. Las primeras estaciones anclan las relaciones de carga, establecen el efecto de red que hace más valiosos los sitios posteriores y aseguran las mejores ubicaciones en carretera. El enfoque por fases — lanzar los mercados ancla y luego llenar los espacios intermedios — es la forma de construir una autopista eléctrica continental sin esperar a que todos los camiones sean eléctricos primero.</p>

<p><em>Greenspace E-mobility está desarrollando estaciones de carga con energía solar a lo largo del corredor de carga México–Texas. <a href="/es/electric-highway">Conoce la Autopista Eléctrica</a> o <a href="/es/contact">contacta a nuestro equipo</a> sobre alianzas de flota y corredor.</em></p>
`,
      references: [
        { title: 'Estadísticas Comerciales del Puerto de Laredo', url: 'https://www.bts.gov', publisher: 'Oficina de Estadísticas de Transporte de EE. UU.', year: '2025' },
        { title: 'Estándar Megawatt Charging System (MCS)', url: 'https://www.charin.global', publisher: 'CharIN', year: '2025' },
        { title: 'Electrificación del Transporte de Larga Distancia', url: 'https://rmi.org', publisher: 'Rocky Mountain Institute', year: '2024' },
      ],
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'fleet-electrification-mexico-guide',
    date: '2026-05-20',
    heroImage: '/images/service-installations.png',
    keywords: [
      'carga para camiones eléctricos México', 'electrificación de flotas México', 'fleet charging Mexico',
      'depósito de carga EV', 'fleet electrification guide', 'electric fleet Monterrey',
    ],
    en: {
      title: 'Fleet Electrification in Mexico: A Practical Roadmap for Logistics Operators',
      metaDescription: 'A step-by-step guide to electrifying a commercial fleet in Mexico — from route audit and depot charging design to financing and total cost of ownership.',
      excerpt: 'Electrifying a fleet is an operations project, not a vehicle purchase. Here is the practical sequence logistics operators in Mexico are using to get it right.',
      readingTime: '6 min read',
      category: 'Fleet Solutions',
      body: `
<p>For logistics operators in Mexico, fleet electrification has moved from "someday" to a live planning question. Fuel and maintenance savings are real, corporate clients increasingly ask for low-emission transport, and the vehicles finally exist for most duty cycles. What trips operators up is treating it as a vehicle purchase rather than what it actually is: an operations and infrastructure project. Here is the sequence that works.</p>

<h2>1. Start with the routes, not the trucks</h2>
<p>The first question is not "which truck" but "what do my vehicles actually do each day?" Map daily distances, dwell times at the depot, payloads and schedules. Most fleets discover that a large share of their routes already fit comfortably within today's electric range — and those are the ones to convert first. The routes that don't fit yet stay diesel for now. This is how you avoid buying capability you won't use.</p>

<h2>2. Design the depot before you buy a single vehicle</h2>
<p>Charging infrastructure has a longer lead time than the trucks. Designing the depot early means answering:</p>
<ul>
<li><strong>How much power do you need, and when?</strong> A depot that charges overnight needs different infrastructure than one cycling vehicles through the day.</li>
<li><strong>What is the grid connection at the site?</strong> The available service capacity often dictates the pace of electrification — and whether on-site storage is needed to avoid a costly utility upgrade.</li>
<li><strong>Charge management.</strong> Smart software that staggers charging across vehicles prevents demand spikes and keeps every truck ready for its departure window without oversizing the connection.</li>
</ul>

<h2>3. Right-size with storage</h2>
<p>Pairing depot chargers with battery storage does two things in Mexico's commercial tariff environment: it cuts the demand charges that can dominate an electricity bill, and it lets a site charge more vehicles than its raw grid connection would otherwise allow. For depots facing long utility-upgrade timelines, storage is frequently the difference between electrifying this year and waiting two.</p>

<h2>4. Run the total cost of ownership, honestly</h2>
<p>Electric trucks cost more upfront and less to run. The comparison that matters is total cost of ownership over the vehicle's life: purchase price, energy, maintenance, and downtime. Energy savings versus diesel and the lower maintenance of electric drivetrains do most of the work; the payback period depends heavily on annual mileage and local energy prices. High-utilization routes pay back fastest — another reason to electrify your busiest, best-fitting routes first.</p>

<h2>5. Phase it, and instrument it</h2>
<p>Convert a first wave of well-matched routes, measure real-world energy use and uptime, and use that data to plan the next wave. Telematics and charge-management reporting turn the pilot into evidence — for the next capital request, for client commitments, and for tuning the depot. Fleets that treat the first deployment as a learning system scale far more smoothly than those that try to convert everything at once.</p>

<h2>The bottom line</h2>
<p>Fleet electrification in Mexico succeeds when it is sequenced: routes first, depot second, storage to right-size, honest TCO, then phased rollout. Done in that order, it is an operating decision with a clear payback — not a leap of faith.</p>

<p><em>Greenspace E-mobility provides depot charging design, installation and management for fleets in Mexico, with a distribution and service hub in Monterrey. <a href="/en/contact">Request a free fleet sizing study.</a></em></p>
`,
      references: [
        { title: 'Total Cost of Ownership: Electric vs. Diesel Trucks', url: 'https://rmi.org', publisher: 'Rocky Mountain Institute', year: '2024' },
        { title: 'Global EV Outlook 2025 — Heavy-Duty Vehicles', url: 'https://www.iea.org/reports/global-ev-outlook-2025', publisher: 'International Energy Agency', year: '2025' },
        { title: 'Fleet Electrification Planning Guide', url: 'https://www.bnef.com', publisher: 'BloombergNEF', year: '2025' },
      ],
    },
    es: {
      title: 'Electrificación de Flotas en México: Guía Práctica para Operadores Logísticos',
      metaDescription: 'Guía paso a paso para electrificar una flota comercial en México — desde la auditoría de rutas y el diseño de carga en el depósito hasta el financiamiento y el costo total de propiedad.',
      excerpt: 'Electrificar una flota es un proyecto de operaciones, no una compra de vehículos. Esta es la secuencia práctica que los operadores logísticos en México están usando para hacerlo bien.',
      readingTime: '6 min de lectura',
      category: 'Soluciones de Flota',
      body: `
<p>Para los operadores logísticos en México, la electrificación de flotas pasó de ser un "algún día" a una pregunta de planificación real. Los ahorros en combustible y mantenimiento son tangibles, los clientes corporativos piden cada vez más transporte de bajas emisiones, y los vehículos por fin existen para la mayoría de los ciclos de trabajo. Lo que confunde a los operadores es tratarlo como una compra de vehículos en lugar de lo que realmente es: un proyecto de operaciones e infraestructura. Esta es la secuencia que funciona.</p>

<h2>1. Empieza por las rutas, no por los camiones</h2>
<p>La primera pregunta no es "qué camión" sino "qué hacen realmente mis vehículos cada día". Mapea las distancias diarias, los tiempos de permanencia en el depósito, las cargas y los horarios. La mayoría de las flotas descubren que una buena parte de sus rutas ya entra cómodamente dentro de la autonomía eléctrica actual — y esas son las primeras a convertir. Las rutas que aún no encajan se quedan en diésel por ahora. Así evitas pagar por capacidad que no usarás.</p>

<h2>2. Diseña el depósito antes de comprar un solo vehículo</h2>
<p>La infraestructura de carga tiene un tiempo de implementación más largo que los camiones. Diseñar el depósito desde el inicio significa responder:</p>
<ul>
<li><strong>¿Cuánta potencia necesitas, y cuándo?</strong> Un depósito que carga de noche necesita una infraestructura distinta a uno que rota vehículos durante el día.</li>
<li><strong>¿Cuál es la conexión a la red en el sitio?</strong> La capacidad de servicio disponible suele determinar el ritmo de electrificación — y si se necesita almacenamiento en sitio para evitar una costosa ampliación con la distribuidora.</li>
<li><strong>Gestión de carga.</strong> Un software inteligente que escalona la carga entre vehículos evita los picos de demanda y mantiene cada camión listo para su salida sin sobredimensionar la conexión.</li>
</ul>

<h2>3. Dimensiona correctamente con almacenamiento</h2>
<p>Combinar los cargadores del depósito con almacenamiento en baterías logra dos cosas en el entorno tarifario comercial de México: reduce los cargos por demanda que pueden dominar la factura eléctrica, y permite cargar más vehículos de los que la conexión a la red permitiría por sí sola. Para depósitos que enfrentan largos plazos de ampliación con la distribuidora, el almacenamiento es con frecuencia la diferencia entre electrificar este año o esperar dos.</p>

<h2>4. Calcula el costo total de propiedad, con honestidad</h2>
<p>Los camiones eléctricos cuestan más al inicio y menos al operar. La comparación que importa es el costo total de propiedad a lo largo de la vida del vehículo: precio de compra, energía, mantenimiento y tiempo fuera de servicio. Los ahorros de energía frente al diésel y el menor mantenimiento de los trenes motrices eléctricos hacen la mayor parte del trabajo; el periodo de recuperación depende mucho del kilometraje anual y de los precios locales de energía. Las rutas de alta utilización se pagan más rápido — otra razón para electrificar primero tus rutas más activas y mejor adaptadas.</p>

<h2>5. Hazlo por fases, y mídelo</h2>
<p>Convierte una primera ola de rutas bien adaptadas, mide el consumo de energía y la disponibilidad reales, y usa esos datos para planificar la siguiente ola. La telemetría y los reportes de gestión de carga convierten el piloto en evidencia — para la próxima solicitud de capital, para los compromisos con clientes y para afinar el depósito. Las flotas que tratan el primer despliegue como un sistema de aprendizaje escalan con mucha más fluidez que las que intentan convertir todo de una vez.</p>

<h2>En resumen</h2>
<p>La electrificación de flotas en México funciona cuando se secuencia: primero las rutas, segundo el depósito, almacenamiento para dimensionar, costo total de propiedad honesto, y luego despliegue por fases. Hecho en ese orden, es una decisión operativa con una recuperación clara — no un salto de fe.</p>

<p><em>Greenspace E-mobility ofrece diseño, instalación y gestión de carga en depósito para flotas en México, con un hub de distribución y servicio en Monterrey. <a href="/es/contact">Solicita un estudio de dimensionamiento de flota gratuito.</a></em></p>
`,
      references: [
        { title: 'Costo Total de Propiedad: Camiones Eléctricos vs. Diésel', url: 'https://rmi.org', publisher: 'Rocky Mountain Institute', year: '2024' },
        { title: 'Global EV Outlook 2025 — Vehículos Pesados', url: 'https://www.iea.org/reports/global-ev-outlook-2025', publisher: 'Agencia Internacional de Energía', year: '2025' },
        { title: 'Guía de Planificación para Electrificación de Flotas', url: 'https://www.bnef.com', publisher: 'BloombergNEF', year: '2025' },
      ],
    },
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug)
}

export function getArticlesSorted(): Article[] {
  return [...ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1))
}
