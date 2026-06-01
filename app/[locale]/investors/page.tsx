import { setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight, CheckCircle2, TrendingUp, Zap,
  Users, Shield, Building2, Truck, Globe, MapPin, Route
} from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const title = locale === 'es' ? 'Inversores | Greenspace E-mobility' : 'Investors | Greenspace E-mobility'
  const description = locale === 'es'
    ? 'Oportunidad de inversión en infraestructura de carga eléctrica y red de transporte de carga para camiones Clase 8 en América del Norte y Panamá.'
    : 'Investment opportunity in EV charging infrastructure and Class 8 electric freight network across North America and Panama.'
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description },
  }
}

const pillars = [
  {
    icon: Shield,
    title: 'First-Mover Advantage',
    desc: 'No fully integrated Class 8 electric freight corridor exists today between Mexico and the U.S. We are building the infrastructure before the market demands it — locking in locations, permits, and fleet contracts ahead of every competitor.',
    img: '/images/projects/electric-highway-corridor.webp',
  },
  {
    icon: Zap,
    title: 'Deployable Infrastructure',
    desc: 'Standardized, modular Green Hub design — replicable across every market. Each station follows the same blueprint: high-power charging, renewable energy, battery storage, and driver services. Built to scale fast.',
    img: '/images/service-chargers.jpg',
  },
  {
    icon: Globe,
    title: 'Massive Market Opportunity',
    desc: 'The Americas\' most critical freight corridors move hundreds of billions in annual trade — with zero dedicated Class 8 electric charging infrastructure today. We are the first to solve this at scale.',
    img: '/images/projects/windrose-greenspace-ruta-verde.jpg',
  },
  {
    icon: Users,
    title: 'Proven Management Team',
    desc: 'Over a decade in EV charging, cross-border logistics, and energy infrastructure. Government partnerships in Mexico. Operational track record with DHL, Banco General, and leading fleet operators across four countries.',
    img: '/images/projects/expo-emovilidad-panama-convention-center.jpg',
  },
]

const structures = [
  { icon: TrendingUp, title: 'Equity / Preferred Equity',   desc: 'Direct ownership stake with preferred return structure. Flexible investor and sponsor ownership split.' },
  { icon: Building2,  title: 'Joint Venture (JV)',           desc: 'Co-develop specific Green Hub stations or market segments — Texas, Mexico, California, or Panama as standalone SPVs.' },
  { icon: Truck,      title: 'Fleet Leasing Structure',      desc: 'Asset-backed leasing of Class 8 electric trucks. Fixed lease rate and fixed energy price per long-term fleet agreement.' },
  { icon: Shield,     title: 'Infrastructure SPV',           desc: 'Asset ownership of charging stations via Special Purpose Vehicle. Predominantly asset-based — tangible, insured, long-life infrastructure.' },
]

const markets = [
  { icon: MapPin, label: 'Texas, USA',        desc: 'Laredo–Dallas corridor. Phase 1.' },
  { icon: MapPin, label: 'Monterrey, Mexico', desc: 'Codefront Bridge + Monterrey hub. Phase 2.' },
  { icon: MapPin, label: 'California, USA',   desc: 'West Coast expansion. Phase 3.' },
  { icon: MapPin, label: 'Panama City',       desc: 'Panama Canal logistics zone. Phase 4.' },
]

const moats = [
  'Commercial partnerships signed with Mexican state governments',
  'Codefront International Bridge — exclusive logistics corridor access',
  'Electric truck distribution rights for Latin America',
  'Proprietary OCPP-compatible charging management platform',
  'Operational track record: DHL, Banco General fleet electrification',
  'Multi-market regulatory experience across four countries',
  'Manufacturer warranty buy-back program per truck unit',
]

export default function InvestorsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, rgba(0,200,83,0.5) 0px, rgba(0,200,83,0.5) 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, rgba(0,200,83,0.5) 0px, rgba(0,200,83,0.5) 1px, transparent 1px, transparent 80px)` }}
        />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-green-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />

        <div className="container-wide relative z-10 text-center py-24">
          <AnimateIn>
            <Badge className="mb-8">Investor Relations</Badge>
          </AnimateIn>
          <AnimateIn delay={100}>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.05] max-w-4xl mx-auto">
              Investment in<br />
              <span className="text-gradient">impactful infrastructure</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={200}>
            <p className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed mb-4">
              Greenspace E-mobility is building the first fully integrated electric freight network connecting Mexico, the United States, California, and Panama — purpose-built for Class 8 trucks.
            </p>
          </AnimateIn>
          <AnimateIn delay={250}>
            <p className="text-white/30 text-sm max-w-xl mx-auto mb-12">
              Our solution benefits customers and stakeholders by using fewer resources to provide a better service — increasing margins and creating value without the need for government subsidies.
            </p>
          </AnimateIn>
          <AnimateIn delay={350}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-8 py-4 rounded-2xl transition-all glow-green text-base"
              >
                Request Investor Deck
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#why"
                className="inline-flex items-center gap-2 glass hover:border-white/20 text-white/70 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all text-base"
              >
                Learn More
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* 4 Pillars — image cards */}
      <section id="why" className="section-padding">
        <div className="container-wide">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-green-400 text-xs font-bold uppercase tracking-[0.25em] mb-4">The Investment Case</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Why Greenspace E-mobility
              </h2>
              <p className="text-white/40 max-w-xl mx-auto">
                Our operation uses fewer resources to provide a better service to the market — increasing margins and creating value without the need for government subsidies, or tax dollars.
              </p>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map(({ icon: Icon, title, desc, img }, i) => (
              <AnimateIn key={i} delay={i * 100}>
                <div className="glass rounded-2xl overflow-hidden hover:border-green-500/25 transition-all group h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-navy-800">
                    <img
                      src={img}
                      alt={title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className="w-10 h-10 rounded-xl bg-green-500/20 backdrop-blur-sm border border-green-500/30 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-green-400" />
                      </div>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-display font-bold text-white text-lg mb-3">{title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed flex-1">{desc}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Markets */}
      <section className="py-16 border-y border-white/[0.06]">
        <div className="container-wide">
          <AnimateIn>
            <p className="text-center text-white/25 text-[10px] uppercase tracking-[0.2em] mb-10">Active & Planned Markets</p>
          </AnimateIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {markets.map(({ icon: Icon, label, desc }, i) => (
              <AnimateIn key={i} delay={i * 80}>
                <div className="text-center glass rounded-2xl p-6 hover:border-green-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-green-400 mx-auto mb-3" />
                  <div className="font-display font-bold text-white mb-1">{label}</div>
                  <div className="text-white/40 text-xs leading-snug">{desc}</div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Structures */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <AnimateIn><Badge className="mb-6">Investment Structures</Badge></AnimateIn>
            <AnimateIn delay={100}>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Multiple entry points
              </h2>
            </AnimateIn>
            <AnimateIn delay={200}>
              <p className="text-white/40 max-w-xl mx-auto">
                Flexible structures depending on your mandate — from equity participation to asset-backed SPV ownership.
              </p>
            </AnimateIn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {structures.map(({ icon: Icon, title, desc }, i) => (
              <AnimateIn key={i} delay={i * 100}>
                <div className="glass rounded-2xl p-8 hover:border-green-500/25 transition-all group h-full">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                      <Icon className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-white text-lg mb-2">{title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Moats */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/4 via-transparent to-transparent pointer-events-none" />
        <div className="container-wide relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimateIn>
              <div>
                <Badge className="mb-6">Competitive Moat</Badge>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Why Greenspace wins this market
                </h2>
                <p className="text-white/50 leading-relaxed mb-8">
                  Building physical infrastructure takes years of relationships, permits, and capital. We have a head start that competitors cannot replicate in the near term — across government partnerships, exclusive rights, and operational track record.
                </p>
                <Link
                  href={`/${locale}/contact`}
                  className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-7 py-3.5 rounded-xl transition-all glow-green-sm"
                >
                  Request Full Investor Deck
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </AnimateIn>
            <AnimateIn delay={150}>
              <div className="space-y-3">
                {moats.map((item, i) => (
                  <div key={i} className="glass rounded-xl p-4 flex items-start gap-4 hover:border-green-500/20 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-white/70 text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Deployment phases — visual, no numbers */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <AnimateIn><h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Phased deployment plan</h2></AnimateIn>
            <AnimateIn delay={100}><p className="text-white/40 max-w-xl mx-auto">A structured rollout across four strategic markets — Texas, Monterrey, California, and Panama — built to de-risk each phase before the next begins.</p></AnimateIn>
          </div>
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-green-500/50 via-green-500/20 to-transparent" />
            <div className="space-y-10">
              {[
                { phase: 'Phase 1', market: 'Texas, USA', status: 'active',  desc: 'Laredo–Dallas corridor — establishing the first high-power EV charging infrastructure on the U.S. side of the Mexico border, with initial Class 8 electric truck fleet deployment.' },
                { phase: 'Phase 2', market: 'Monterrey, Mexico', status: 'building', desc: 'Codefront International Bridge and Monterrey hub — completing the first fully electric cross-border freight route connecting Mexico and the United States.' },
                { phase: 'Phase 3', market: 'California, USA', status: 'planned',  desc: 'West Coast expansion — extending the network to the Pacific trade gateway and capturing major California freight corridors.' },
                { phase: 'Phase 4', market: 'Panama City', status: 'active',  desc: 'Panama Canal logistics zone — anchoring the southern end of the network and enabling electric freight operations across Latin America.' },
              ].map((item, i) => (
                <AnimateIn key={i} delay={i * 120} direction={i % 2 === 0 ? 'left' : 'right'}>
                  <div className={`flex gap-8 items-start ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="flex-1 hidden md:block" />
                    <div className="relative flex items-center justify-center shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                        item.status === 'active'   ? 'bg-green-500 glow-green' :
                        item.status === 'building' ? 'bg-navy-600 border-2 border-green-500/50' :
                        'glass border border-white/10'
                      }`}>
                        <Route className={`w-5 h-5 ${item.status === 'active' ? 'text-navy-900' : 'text-white/40'}`} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="glass rounded-2xl p-6 hover:border-green-500/20 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            item.status === 'active' ? 'text-green-400 bg-green-500/10' : 'text-white/30 bg-white/5'
                          }`}>{item.phase}</span>
                          {item.status === 'active' && (
                            <span className="text-xs text-green-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                              Active
                            </span>
                          )}
                          {item.status === 'building' && (
                            <span className="text-xs text-yellow-400/80">In Development</span>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-white text-xl mb-2">{item.market}</h3>
                        <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <AnimateIn>
            <div className="relative glass rounded-3xl overflow-hidden p-12 md:p-16 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-navy-700/20" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-0.5 bg-gradient-to-r from-transparent via-green-500/60 to-transparent" />
              <div className="relative z-10">
                <Badge className="mb-6">Ready to invest?</Badge>
                <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                  Join the electric freight revolution
                </h2>
                <p className="text-white/50 max-w-xl mx-auto mb-2">
                  We are actively raising for our current deployment phase. Request the full investor deck, financial model, and project documentation.
                </p>
                <p className="text-white/25 text-xs max-w-lg mx-auto mb-10">
                  This page is intended for qualified investors only.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={`/${locale}/contact`}
                    className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-8 py-4 rounded-2xl transition-all glow-green"
                  >
                    Request Investor Deck
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="mailto:info@gs-emobility.com?subject=Investor Inquiry — Greenspace E-mobility"
                    className="inline-flex items-center gap-2 glass hover:border-white/20 text-white/70 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all"
                  >
                    info@gs-emobility.com
                  </a>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  )
}
