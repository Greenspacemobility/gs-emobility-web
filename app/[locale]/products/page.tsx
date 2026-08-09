import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, CheckCircle2, Home, Building2, Car, Sun, Monitor, Truck, Zap, Battery, Route } from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'
import BrandSelector from '@/components/BrandSelector'
import { alternatesFor } from '@/lib/seo'
import { chargerCatalog, brandNames } from '@/lib/chargers'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const description = locale === 'es'
    ? 'Catálogo completo de cargadores EV: Autel, Sinexcel, Lumosenergy (Gresgying) y Sungrow — AC 7,4–22 kW y DC 30–640 kW — más camiones eléctricos Windrose Clase 8 y plataforma de gestión de carga. Distribuidor oficial en Panamá, México, Texas y Colombia.'
    : 'Full EV charger catalogue: Autel, Sinexcel, Lumosenergy (Gresgying) and Sungrow — AC 7.4–22 kW and DC 30–640 kW — plus Windrose Class 8 electric trucks and smart charging management platform. Official distributor in Panama, Mexico, Texas and Colombia.'
  return {
    alternates: alternatesFor('/products', locale),
    title: locale === 'es' ? 'Catálogo de Cargadores EV — AC y DC 7,4–640 kW' : 'EV Charger Catalogue — AC & DC 7.4–640 kW',
    description,
    keywords: [
      'Autel EV charger distributor', 'Sinexcel SEC DC charger', 'Gresgying DC charger', 'Lumosenergy charger', 'Sungrow IDC charger Colombia',
      'Windrose electric truck', 'MaxiCharger DC', 'DC fast charger Latin America', 'EV charger Panama', 'EV charger datasheet',
      'Class 8 electric truck Latin America', 'fleet charging solutions',
    ],
    openGraph: { title: 'Greenspace E-mobility Products — EV Chargers & Electric Trucks', description },
  }
}

// Product + ItemList schema for AI citation and Google rich results.
// Charger entries are generated from the catalogue in lib/chargers.ts,
// so the schema always matches what is rendered on the page.
const productsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Greenspace E-mobility Products',
  description: 'EV chargers from Autel Energy, Sinexcel, Lumosenergy (Gresgying) and Sungrow, electric trucks, and charging management software distributed by Greenspace E-mobility in Panama, Mexico, the USA and Colombia.',
  url: 'https://www.gs-emobility.com/en/products',
  itemListElement: [
    ...chargerCatalog.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: `${brandNames[c.brand].split(' · ')[0]} ${c.model}`,
        brand: { '@type': 'Brand', name: brandNames[c.brand] },
        description: c.schemaDesc,
        offers: {
          '@type': 'Offer',
          seller: { '@type': 'Organization', name: 'Greenspace E-mobility' },
          areaServed: c.market === 'CO' ? ['Colombia'] : ['Panama', 'Mexico', 'United States', 'Colombia'],
        },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Power Output', value: c.power },
          { '@type': 'PropertyValue', name: 'Connector Types', value: c.connectors },
        ],
      },
    })),
    {
      '@type': 'ListItem',
      position: chargerCatalog.length + 1,
      item: {
        '@type': 'Product',
        name: 'Windrose Class 8 Electric Truck',
        brand: { '@type': 'Brand', name: 'Windrose' },
        description: 'Class 8 electric semi-truck with 670 km (416 mi) loaded range, 729 kWh battery and 1,045 kW peak power. Exclusive distributor in Latin America: Greenspace E-mobility.',
        offers: { '@type': 'Offer', seller: { '@type': 'Organization', name: 'Greenspace E-mobility' }, areaServed: ['Panama', 'Mexico', 'Latin America'] },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Range', value: '670 km (416 miles), loaded' },
          { '@type': 'PropertyValue', name: 'Battery Capacity', value: '729 kWh' },
          { '@type': 'PropertyValue', name: 'Peak Power', value: '1,045 kW (approx. 1,400 hp)' },
          
          { '@type': 'PropertyValue', name: 'GCW', value: '98,000 lb (44.5 tonnes)' },
          { '@type': 'PropertyValue', name: 'Charge Time (20-80%)', value: '60 minutes' },
        ],
      },
    },
  ],
}

export default function ProductsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('products')

  const useCases = [
    { icon: Home,      title: t('sectorResidential'), desc: t('sectorResidentialDesc') },
    { icon: Building2, title: t('sectorCommercial'),  desc: t('sectorCommercialDesc') },
    { icon: Car,       title: t('sectorFleet'),       desc: t('sectorFleetDesc') },
    { icon: Sun,       title: t('sectorSolar'),       desc: t('sectorSolarDesc') },
  ]

  const includes = [
    t('include1'), t('include2'), t('include3'),
    t('include4'), t('include5'), t('include6'),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }} />
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-900/80" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="container-wide relative z-10 text-center">
          <AnimateIn><Badge className="mb-6">{t('badge')}</Badge></AnimateIn>
          <AnimateIn delay={100}>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl mx-auto">
              {t('title')}
            </h1>
          </AnimateIn>
          <AnimateIn delay={200}>
            <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">{t('subtitle')}</p>
          </AnimateIn>
        </div>
      </section>

      {/* Brand cards + click-to-expand portfolios */}
      <BrandSelector />

      {/* Platform card */}
      <section className="pb-4">
        <div className="container-wide">
          <AnimateIn>
            <div className="glass rounded-2xl overflow-hidden relative group hover:border-green-500/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-blue-500/5" />
              <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 rounded-2xl bg-green-500/15 flex items-center justify-center shrink-0 group-hover:bg-green-500/25 transition-colors">
                  <Monitor className="w-7 h-7 text-green-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="text-green-400 text-xs font-bold uppercase tracking-widest">{t('platformBadge')}</span>
                  <h3 className="font-display font-bold text-white text-2xl mt-1 mb-2">{t('platformTitle')}</h3>
                  <p className="text-white/55 max-w-2xl">{t('platformDesc')}</p>
                </div>
                <Link
                  href={`/${locale}/platform`}
                  className="shrink-0 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-6 py-3 rounded-xl transition-all glow-green-sm"
                >
                  {t('platformCta')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Windrose Electric Trucks */}
      <section id="windrose" className="section-padding">
        <div className="container-wide">
          <AnimateIn>
            <div className="relative glass rounded-3xl overflow-hidden border border-emerald-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-navy-700/20 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

              <div className="grid lg:grid-cols-[5fr_7fr]">
                {/* Video panel */}
                <div className="relative bg-navy-900/60 min-h-[320px] lg:min-h-[480px] overflow-hidden">
                  <video
                    autoPlay muted loop playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    poster="/images/products/windrose-truck.jpg"
                  >
                    <source src="/videos/windrose-truck.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy-900/60 lg:to-navy-900/70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
                  {/* Badge overlay */}
                  <div className="absolute top-5 left-5">
                    <span className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm">
                      <Truck className="w-3 h-3" />
                      {t('windroseBadge')}
                    </span>
                  </div>
                </div>

                {/* Info panel */}
                <div className="relative z-10 p-8 md:p-10 lg:p-12 flex flex-col justify-between">
                  <div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 leading-snug">
                      {t('windroseTitle')}
                    </h2>
                    <p className="text-white/50 text-sm leading-relaxed mb-8">
                      {t('windroseSubtitle')}
                    </p>

                    {/* Specs */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                      {[
                        { label: t('windroseRange'),   val: t('windroseRangeVal'),   icon: Route },
                        { label: t('windrosePower'),    val: t('windrosePowerVal'),   icon: Zap },
                        { label: t('windroseTorque'),   val: t('windroseTorqueVal'),  icon: Battery },
                        { label: t('windroseCharging'), val: t('windroseChargingVal'),icon: Zap },
                        { label: t('windrosePayload'),  val: t('windrosePayloadVal'), icon: Truck },
                      ].map(({ label, val, icon: Icon }, i) => (
                        <div key={i} className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06] text-center">
                          <Icon className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1.5" />
                          <div className="font-display font-bold text-white text-sm">{val}</div>
                          <div className="text-white/35 text-[10px] uppercase tracking-wide mt-0.5">{label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="space-y-2.5 mb-8">
                      {[
                        t('windroseFeature1'),
                        t('windroseFeature2'),
                        t('windroseFeature3'),
                        t('windroseFeature4'),
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-3 text-white/60 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-navy-900 font-semibold px-6 py-3 rounded-xl transition-all text-sm self-start"
                  >
                    {t('windroseCta')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Solutions by sector */}
      <section id="residential" className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <AnimateIn><h2 className="font-display text-4xl font-bold text-white mb-4">{t('sectorsTitle')}</h2></AnimateIn>
            <AnimateIn delay={100}><p className="text-white/40 max-w-xl mx-auto">{t('sectorsSubtitle')}</p></AnimateIn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map(({ icon: Icon, title, desc }, i) => (
              <AnimateIn key={title} delay={i * 100}>
                <div className="glass rounded-2xl p-8 flex gap-6 hover:border-green-500/25 transition-all group h-full">
                  <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-xl mb-3">{title}</h3>
                    <p className="text-white/50 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="section-padding">
        <div className="container-wide">
          <AnimateIn>
            <div className="glass rounded-3xl p-10 md:p-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/8 via-transparent to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
              <div className="relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <Badge className="mb-6">{t('includedBadge')}</Badge>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                      {t('includedTitle')}
                    </h2>
                    <p className="text-white/50 leading-relaxed mb-8">{t('includedDesc')}</p>
                    <Link
                      href={`/${locale}/contact`}
                      className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-7 py-3.5 rounded-xl transition-all glow-green-sm"
                    >
                      {t('requestQuote')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {includes.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 glass rounded-xl p-4">
                        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                        <span className="text-white/80 text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  )
}
