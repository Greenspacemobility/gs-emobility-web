import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEs = locale === 'es'
  const title = isEs
    ? 'Preguntas Frecuentes | Cargadores EV y Camiones Eléctricos | Greenspace'
    : 'FAQ | EV Chargers, Electric Trucks & Charging Infrastructure | Greenspace'
  const description = isEs
    ? 'Respuestas a las preguntas más comunes sobre cargadores EV Autel, camiones Windrose, autopista eléctrica México-Texas, y soluciones de carga para flotas en Panamá y México.'
    : 'Answers to the most common questions about Autel EV chargers, Windrose electric trucks, Mexico–Texas electric highway, fleet charging, and EV infrastructure in Panama, Mexico and Texas.'

  return {
    title,
    description,
    keywords: [
      'EV charger Panama FAQ', 'Autel charger distributor questions',
      'Windrose electric truck FAQ', 'electric highway Mexico Texas questions',
      'fleet EV charging questions', 'EV charging Latin America FAQ',
    ],
    alternates: {
      canonical: `https://www.gs-emobility.com/${locale}/faq`,
      languages: {
        en: 'https://www.gs-emobility.com/en/faq',
        es: 'https://www.gs-emobility.com/es/faq',
      },
    },
  }
}

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const FAQ_EN = [
  {
    category: 'About Greenspace E-mobility',
    questions: [
      {
        q: 'What is Greenspace E-mobility?',
        a: 'Greenspace E-mobility is an EV charging infrastructure company and electric vehicle distributor founded in 2020. We build, install, and operate high-power charging stations, and distribute Autel Energy EV chargers and Windrose Class 8 electric trucks across Panama, Mexico, Texas (USA), and Norway.',
      },
      {
        q: 'Where does Greenspace E-mobility operate?',
        a: 'Greenspace E-mobility operates in four countries: Panama (headquarters), Monterrey, Mexico, Texas, USA, and Oslo, Norway. Our primary markets are Panama and Mexico, where we serve residential, commercial, fleet, and public charging customers.',
      },
      {
        q: 'How can I contact Greenspace E-mobility?',
        a: 'You can reach us by email at info@gs-emobility.com or by filling out the contact form at gs-emobility.com/contact. Our team speaks English and Spanish and serves clients across Panama, Mexico, and the United States.',
      },
      {
        q: 'What makes Greenspace different from other EV charging companies?',
        a: 'Greenspace is the only company in Latin America simultaneously offering: official Autel Energy charger distribution (up to 360 kW DC), exclusive Windrose Class 8 electric truck distribution, a proprietary smart charging management platform, and active development of the Mexico–Texas electric highway corridor. We are a vertically integrated, multi-country EV infrastructure operator.',
      },
    ],
  },
  {
    category: 'EV Chargers & Products',
    questions: [
      {
        q: 'Who is the official Autel Energy EV charger distributor in Panama and Mexico?',
        a: 'Greenspace E-mobility is the official Autel Energy distributor for Panama, Mexico, and the United States. We carry the full MaxiCharger lineup from 7.2 kW Level 2 chargers up to 360 kW ultra-fast DC chargers.',
      },
      {
        q: 'What EV charger models does Greenspace offer?',
        a: 'We distribute the complete Autel Energy MaxiCharger range: AC chargers at 7.2 kW and 22 kW for home and workplace use; DC fast chargers at 60 kW, 120 kW, 180 kW, and 360 kW for commercial, public, and fleet applications. All models are OCPP-compatible and support smart charging management.',
      },
      {
        q: 'What is the most powerful EV charger available in Panama?',
        a: 'Greenspace offers the Autel MaxiCharger DC 360 kW — one of the most powerful commercially available EV chargers in the market. At 360 kW, it can charge most EVs to 80% in under 20 minutes, making it ideal for highway hubs, fleet depots, and high-traffic commercial sites.',
      },
      {
        q: 'Do you offer home EV charger installation in Panama?',
        a: 'Yes. Greenspace provides residential EV charger installation in Panama. We supply and install Level 2 AC chargers (7.2 kW to 22 kW), handle all electrical work and permits, and provide after-sales support. Contact us at info@gs-emobility.com for a free quote.',
      },
      {
        q: 'What is a DC fast charger and who needs one?',
        a: 'A DC fast charger (DCFC) converts AC grid power to DC directly, bypassing the car\'s onboard charger for much higher charge rates. A 120 kW DC fast charger can add 100 km of range in roughly 5–10 minutes. DC fast chargers are ideal for gas stations, highway rest stops, shopping centers, hotels, and fleet depots where customers need a quick top-up rather than an overnight charge.',
      },
    ],
  },
  {
    category: 'Windrose Electric Trucks',
    questions: [
      {
        q: 'Who is the Windrose electric truck distributor in Latin America?',
        a: 'Greenspace E-mobility is the exclusive distributor of Windrose Class 8 electric trucks in Latin America. We cover Panama, Mexico, and other markets across the region.',
      },
      {
        q: 'What is the range of the Windrose electric truck?',
        a: 'The Windrose Class 8 electric truck achieves up to 500 km (310 miles) of range per charge under standard load conditions. It carries a 422 kWh battery pack, produces 480 kW of motor power, and delivers 6,000 Nm of torque — making it competitive with diesel Class 8 trucks on performance while eliminating fuel costs.',
      },
      {
        q: 'How long does it take to charge a Windrose electric truck?',
        a: 'The Windrose electric truck charges from 20% to 80% in approximately 60 minutes using DC fast charging. Using one of Greenspace\'s 120 kW or 180 kW MaxiCharger DC units, a full overnight charge takes 4–6 hours, making it compatible with typical driver rest periods.',
      },
      {
        q: 'Can I get a Windrose electric truck for my fleet in Mexico?',
        a: 'Yes. Greenspace E-mobility supplies Windrose Class 8 electric trucks in Mexico, with our distribution hub in Monterrey, Nuevo León. We handle importation, delivery, and provide the charging infrastructure for your depot. Contact us to discuss fleet needs and pricing.',
      },
      {
        q: 'What is the payload capacity of the Windrose electric truck?',
        a: 'The Windrose Class 8 electric truck supports up to 36 tonnes Gross Vehicle Weight (GVW), which is competitive with conventional diesel Class 8 semis. The electric drivetrain adds some weight versus diesel, but Windrose\'s engineering achieves comparable net payload for most freight applications.',
      },
    ],
  },
  {
    category: 'Mexico–Texas Electric Highway',
    questions: [
      {
        q: 'What is the Greenspace Electric Highway?',
        a: 'The Greenspace Electric Highway is a planned network of DC fast charging stations connecting Monterrey, Mexico to Dallas, Texas and the Texas Triangle (Dallas–Houston–San Antonio) via Highway 85 in Mexico and I-35 in the United States. It will consist of 15 "Green Hubs" across 5 phases, enabling zero-emission long-haul trucking and passenger EV travel across the Mexico–Texas corridor.',
      },
      {
        q: 'Why is the Mexico–Texas electric highway important?',
        a: 'The Mexico–US border region is one of the most active trade corridors in the world, with over $800 billion in annual trade and millions of truck crossings per year. The Monterrey–Dallas corridor alone handles a significant share of USMCA freight. Without DC fast charging infrastructure, electric trucks cannot viably operate on this route. Greenspace\'s Electric Highway solves this bottleneck, enabling decarbonization of cross-border freight.',
      },
      {
        q: 'When will the Mexico–Texas electric highway be completed?',
        a: 'Greenspace is actively developing the corridor in phases. Phase 1 and 2 cover the Monterrey to San Antonio stretch. The full 5-phase buildout including the Texas Triangle is planned for completion within the coming years, aligned with growing EV truck adoption and regulatory requirements for emissions reduction in the US and Mexico.',
      },
    ],
  },
  {
    category: 'Fleet Electrification',
    questions: [
      {
        q: 'How do I electrify my vehicle fleet in Panama or Mexico?',
        a: 'Greenspace offers a complete fleet electrification service: (1) Fleet audit — we assess your routes, vehicle types, and energy needs; (2) Infrastructure design — we specify the right charger types and grid connection; (3) Supply and installation of Autel MaxiCharger stations at your depot; (4) Charging management platform setup for scheduling, reporting, and energy optimization; (5) Ongoing maintenance and support. Contact info@gs-emobility.com to start.',
      },
      {
        q: 'What is the return on investment (ROI) for fleet electrification?',
        a: 'Typical fleets see fuel savings of 60–80% compared to diesel when switching to electric (based on regional electricity vs. diesel prices in Panama and Mexico). Maintenance costs drop 30–40% due to fewer moving parts. Most medium-duty fleet electrification projects reach ROI within 3–5 years, with heavy-duty electric trucks (like the Windrose) achieving payback in 4–6 years depending on mileage and fuel price assumptions.',
      },
      {
        q: 'What charging power does a commercial fleet depot need?',
        a: 'It depends on fleet size, vehicle types, and overnight dwell time. For a depot of 10 electric trucks, Greenspace typically installs 2–4 DC fast chargers at 60–180 kW, combined with load management software to prevent grid demand spikes. For passenger vehicle fleets, Level 2 AC chargers (22 kW) with smart scheduling are usually sufficient. We provide a free sizing study for all fleet inquiries.',
      },
    ],
  },
  {
    category: 'Charging Management Platform',
    questions: [
      {
        q: 'What is the Greenspace charging management platform?',
        a: 'The Greenspace smart charging management platform is a cloud-based software system for operating EV charging networks. It provides real-time station monitoring, energy consumption tracking, user management, payment processing, demand response, and reporting. It is OCPP 1.6 and 2.0 compliant, meaning it works with any OCPP-compatible charger, not just Autel units.',
      },
      {
        q: 'Can businesses make money from EV charging stations?',
        a: 'Yes. Greenspace\'s platform enables multiple revenue models: pay-per-use (by kWh or time), monthly subscriptions, advertising on charging station screens, and selling excess capacity back to the grid where regulations allow. Shopping centers, hotels, and parking operators are increasingly monetizing EV charging as a premium amenity that drives customer dwell time and loyalty.',
      },
    ],
  },
]

const FAQ_ES = [
  {
    category: 'Sobre Greenspace E-mobility',
    questions: [
      {
        q: '¿Qué es Greenspace E-mobility?',
        a: 'Greenspace E-mobility es una empresa de infraestructura de carga eléctrica y distribuidora de vehículos eléctricos fundada en 2020. Construimos, instalamos y operamos estaciones de carga de alta potencia, y distribuimos cargadores EV Autel Energy y camiones eléctricos Clase 8 Windrose en Panamá, México, Texas (EE. UU.) y Noruega.',
      },
      {
        q: '¿En qué países opera Greenspace E-mobility?',
        a: 'Greenspace E-mobility opera en cuatro países: Panamá (sede principal), Monterrey, México, Texas, EE. UU. y Oslo, Noruega. Nuestros mercados principales son Panamá y México, donde atendemos clientes residenciales, comerciales, flotas y carga pública.',
      },
      {
        q: '¿Cómo puedo contactar a Greenspace E-mobility?',
        a: 'Puedes escribirnos a info@gs-emobility.com o usar el formulario de contacto en gs-emobility.com/contact. Nuestro equipo habla español e inglés y atiende clientes en Panamá, México y Estados Unidos.',
      },
      {
        q: '¿Qué diferencia a Greenspace de otras empresas de carga EV?',
        a: 'Greenspace es la única empresa en Latinoamérica que combina: distribución oficial de cargadores Autel Energy (hasta 360 kW DC), distribución exclusiva de camiones eléctricos Windrose Clase 8, plataforma propia de gestión de carga inteligente, y desarrollo activo de la autopista eléctrica México–Texas. Somos un operador integrado verticalmente en múltiples países.',
      },
    ],
  },
  {
    category: 'Cargadores EV y Productos',
    questions: [
      {
        q: '¿Quién es el distribuidor oficial de cargadores Autel Energy en Panamá y México?',
        a: 'Greenspace E-mobility es el distribuidor oficial de Autel Energy para Panamá, México y Estados Unidos. Ofrecemos toda la línea MaxiCharger, desde cargadores Level 2 de 7.2 kW hasta cargadores DC ultrarrápidos de 360 kW.',
      },
      {
        q: '¿Qué modelos de cargadores EV ofrece Greenspace?',
        a: 'Distribuimos la gama completa Autel Energy MaxiCharger: cargadores AC de 7.2 kW y 22 kW para hogar y lugar de trabajo; cargadores DC rápidos de 60 kW, 120 kW, 180 kW y 360 kW para aplicaciones comerciales, públicas y de flotas. Todos los modelos son compatibles con OCPP y gestión inteligente de carga.',
      },
      {
        q: '¿Ofrecen instalación de cargadores para el hogar en Panamá?',
        a: 'Sí. Greenspace proporciona instalación de cargadores EV residenciales en Panamá. Suministramos e instalamos cargadores AC Level 2 (7.2 kW a 22 kW), gestionamos todos los trabajos eléctricos y permisos, y ofrecemos soporte postventa. Contáctenos en info@gs-emobility.com para un presupuesto gratuito.',
      },
    ],
  },
  {
    category: 'Camiones Eléctricos Windrose',
    questions: [
      {
        q: '¿Quién distribuye los camiones eléctricos Windrose en Latinoamérica?',
        a: 'Greenspace E-mobility es el distribuidor exclusivo de camiones eléctricos Windrose Clase 8 en Latinoamérica, con presencia en Panamá y México (Monterrey).',
      },
      {
        q: '¿Cuál es la autonomía del camión eléctrico Windrose?',
        a: 'El camión Windrose Clase 8 alcanza hasta 500 km (310 millas) de autonomía por carga en condiciones de carga estándar. Cuenta con una batería de 422 kWh, 480 kW de potencia de motor y 6,000 Nm de torque, siendo competitivo con los camiones diésel Clase 8 en rendimiento.',
      },
      {
        q: '¿Puedo obtener un camión eléctrico Windrose para mi flota en México?',
        a: 'Sí. Greenspace E-mobility suministra camiones Windrose Clase 8 en México desde nuestro hub de distribución en Monterrey, Nuevo León. Gestionamos la importación, entrega e instalación de la infraestructura de carga para tu depósito. Contáctenos para hablar sobre tus necesidades de flota.',
      },
    ],
  },
  {
    category: 'Autopista Eléctrica México–Texas',
    questions: [
      {
        q: '¿Qué es la Autopista Eléctrica Greenspace?',
        a: 'La Autopista Eléctrica Greenspace es una red planificada de estaciones de carga DC rápida que conectará Monterrey, México con Dallas, Texas y el Triángulo de Texas (Dallas–Houston–San Antonio) por la Carretera 85 en México y la I-35 en EE. UU. Contará con 15 "Green Hubs" en 5 fases, permitiendo el transporte de carga de larga distancia con cero emisiones.',
      },
      {
        q: '¿Por qué es importante la autopista eléctrica México–Texas?',
        a: 'La región fronteriza México–EE. UU. es uno de los corredores comerciales más activos del mundo, con más de $800 mil millones en comercio anual. El corredor Monterrey–Dallas maneja una parte importante de la carga del T-MEC. Sin infraestructura de carga DC, los camiones eléctricos no pueden operar en esta ruta. La Autopista Eléctrica Greenspace soluciona este cuello de botella.',
      },
    ],
  },
  {
    category: 'Electrificación de Flotas',
    questions: [
      {
        q: '¿Cómo electrifico mi flota de vehículos en Panamá o México?',
        a: 'Greenspace ofrece un servicio completo de electrificación de flotas: (1) Auditoría de flota; (2) Diseño de infraestructura; (3) Suministro e instalación de estaciones MaxiCharger; (4) Configuración de plataforma de gestión de carga; (5) Mantenimiento y soporte continuo. Escríbenos a info@gs-emobility.com para comenzar.',
      },
      {
        q: '¿Cuál es el retorno de inversión de la electrificación de flotas?',
        a: 'Las flotas típicas ahorran entre 60–80% en combustible al comparar electricidad con diésel en Panamá y México. Los costos de mantenimiento bajan 30–40% por tener menos partes móviles. La mayoría de los proyectos de electrificación de flotas medianas alcanzan el ROI en 3–5 años.',
      },
    ],
  },
]

// ─── Build JSON-LD schema ─────────────────────────────────────────────────────
function buildFAQSchema(faqs: typeof FAQ_EN) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.flatMap((cat) =>
      cat.questions.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      }))
    ),
  }
}

// ─── Client accordion component ───────────────────────────────────────────────
// (server-rendered; uses CSS details/summary for zero-JS accordion)
function FAQAccordion({ faqs }: { faqs: typeof FAQ_EN }) {
  return (
    <div className="space-y-10">
      {faqs.map((cat) => (
        <div key={cat.category}>
          <h2 className="font-display text-xl font-bold text-green-400 mb-5 uppercase tracking-widest text-sm">
            {cat.category}
          </h2>
          <div className="space-y-3">
            {cat.questions.map((item, i) => (
              <details
                key={i}
                className="glass rounded-2xl border border-white/5 hover:border-green-500/20 transition-colors group"
              >
                <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                  <span className="font-semibold text-white text-base leading-snug">{item.q}</span>
                  <ChevronDown className="w-5 h-5 text-green-400 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-white/60 leading-relaxed text-sm">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FAQPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const isEs = locale === 'es'
  const faqs = isEs ? FAQ_ES : FAQ_EN
  const schema = buildFAQSchema(faqs)

  return (
    <>
      {/* JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-900/80" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="container-wide relative z-10 text-center">
          <AnimateIn>
            <Badge className="mb-6">
              {isEs ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
            </Badge>
          </AnimateIn>
          <AnimateIn delay={100}>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl mx-auto">
              {isEs
                ? 'Todo lo que necesitas saber'
                : 'Everything you need to know'}
            </h1>
          </AnimateIn>
          <AnimateIn delay={200}>
            <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
              {isEs
                ? 'Respuestas a las preguntas más frecuentes sobre nuestros cargadores EV, camiones eléctricos, autopista eléctrica y soluciones de flota.'
                : 'Answers to the most common questions about our EV chargers, electric trucks, electric highway, and fleet solutions.'}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding">
        <div className="container-wide max-w-3xl mx-auto">
          <AnimateIn>
            <FAQAccordion faqs={faqs} />
          </AnimateIn>

          {/* CTA */}
          <AnimateIn delay={200}>
            <div className="mt-16 glass rounded-3xl p-10 text-center border border-green-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent" />
              <div className="relative z-10">
                <p className="text-white font-semibold text-lg mb-2">
                  {isEs ? '¿No encontraste tu respuesta?' : "Didn't find your answer?"}
                </p>
                <p className="text-white/50 text-sm mb-6">
                  {isEs
                    ? 'Nuestro equipo responde en menos de 24 horas.'
                    : 'Our team responds within 24 hours.'}
                </p>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-7 py-3.5 rounded-xl transition-all glow-green-sm"
                >
                  {isEs ? 'Contáctanos' : 'Contact Us'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  )
}
