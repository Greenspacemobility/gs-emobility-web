import { setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight, CheckCircle2, TrendingUp, Zap, MapPin,
  Users, Shield, BarChart3, Building2, Truck, Globe, Lock
} from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const title = locale === 'es'
    ? 'Inversores | Greenspace E-mobility'
    : 'Investors | Greenspace E-mobility'
  const description = locale === 'es'
    ? 'Oportunidad de inversión en infraestructura de carga eléctrica y flota de camiones Clase 8 en Texas, Monterrey, California y Panamá. Capital raise: $55.5M USD.'
    : 'Investment opportunity in Class 8 electric truck charging infrastructure across Texas, Monterrey, California and Panama. Capital raise: $55.5M USD.'
  return {
    title,
    description,
    robots: { index: false, follow: false }, // Keep investor page off search engines
    openGraph: { title, description },
  }
}

const pillars = [
  {
    icon: Shield,
    title: 'First-Mover Advantage',
    desc: 'No fully integrated Class 8 electric freight corridor exists today between Mexico and the U.S. We are building the infrastructure before the market demands it — locking in locations, permits, and fleet contracts ahead of every competitor.',
  },
  {
    icon: Zap,
    title: 'Deployable Infrastructure',
    desc: 'Standardized, modular Green Hub design across all 12 stations — replicable from Texas to Panama. Each station follows the same blueprint: high-power charging, solar, battery storage, and driver services.',
  },
  {
    icon: Globe,
    title: 'Massive Market Opportunity',
    desc: '$354 billion in annual trade at Laredo alone. 6 million commercial truck crossings per year. 15,000 trucks per day on this single corridor — and zero dedicated Class 8 EV charging infrastructure today.',
  },
  {
    icon: Users,
    title: 'Proven Management Team',
    desc: '11+ years in EV charging, 18+ years in cross-border logistics, 15+ years in energy infrastructure. Partnerships with Nuevo León and Tamaulipas state governments. Operations in Panama, Mexico, Texas, and Norway.',
  },
]

const financialKPIs = [
  { value: '21.2%', label: 'Revenue CAGR', sub: '10-year projection' },
  { value: '33%',   label: 'Gross Margin',  sub: 'Year 10' },
  { value: '23%',   label: 'EBITDA Margin', sub: 'Year 10' },
  { value: '7.5yr', label: 'Infra Payback', sub: 'Per station' },
  { value: '18.5%', label: 'ROIC',          sub: 'Before tax, Year 10' },
  { value: '98%',   label: 'Uptime Target', sub: 'Per charger' },
]

const investmentStructures = [
  { icon: TrendingUp, title: 'Equity / Preferred Equity',  desc: 'Direct ownership stake with preferred return structure. Investor ownership: 50–60%. GSEM retains 40–50%.' },
  { icon: Building2,  title: 'Joint Venture (JV)',          desc: 'Co-develop specific Green Hub stations or market segments (e.g., Texas-only or Panama-only SPV).' },
  { icon: Truck,      title: 'Fleet Leasing Structure',     desc: 'Asset-backed fleet leasing of Class 8 electric trucks. Fixed lease rate + fixed energy price. +5 year agreements.' },
  { icon: Lock,       title: 'Infrastructure SPV',          desc: 'Asset ownership of charging stations via Special Purpose Vehicle. 85% asset-based — tangible, insured infrastructure.' },
]

const deploymentPhases = [
  {
    phase: 'Q3–Q4 2026',
    market: 'Texas',
    stations: '4 Green Hubs',
    trucks: '50 Class 8 trucks',
    capex: '$25.5M',
    detail: 'Laredo–Dallas corridor operational. First electric cross-border freight route in North America goes live.',
    status: 'active',
  },
  {
    phase: 'Q1–Q2 2027',
    market: 'Monterrey, Mexico',
    stations: '2 Green Hubs',
    trucks: '25 additional trucks',
    capex: '+$13.5M',
    detail: 'Codefront International Bridge + Monterrey hub. Full Monterrey–Laredo–Dallas electric route live.',
    status: 'building',
  },
  {
    phase: 'Q3–Q4 2027',
    market: 'California',
    stations: '4 Green Hubs',
    trucks: '25 additional trucks',
    capex: '+$9M',
    detail: 'West Coast expansion. 100-truck fleet target reached. Pacific trade gateway captured.',
    status: 'planned',
  },
  {
    phase: '2027–2028',
    market: 'Panama City',
    stations: '2 Green Hubs',
    trucks: 'Fleet support',
    capex: '+$7.5M',
    detail: 'Panama Canal logistics zone. Full 12-station, 4-market network complete.',
    status: 'planned',
  },
]

const moats = [
  'Commercial partnerships signed with Nuevo León and Tamaulipas state governments',
  'Codefront International Bridge — exclusive logistics corridor access',
  'Windrose Technology distribution rights for Latin America',
  'OCPP-compatible proprietary charging management platform',
  'Operational track record: DHL Panama, Banco General fleet electrification',
  'Multi-market regulatory experience across 4 countries',
  'Warranty buy-back program (400,000 miles or 5 years per truck)',
]

export default function InvestorsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden pt-20">
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
              <span className="text-gradient">Impactful Infrastructure</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={200}>
            <p className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed mb-4">
              Greenspace E-mobility is building the first fully integrated electric freight network connecting Mexico, the United States, California, and Panama — purpose-built for Class 8 trucks.
            </p>
          </AnimateIn>
          <AnimateIn delay={250}>
            <p className="text-white/30 text-sm max-w-xl mx-auto mb-12">
              No government subsidies. No dependence on public charging demand. Fixed-rate fleet leasing + energy contracts — revenue from day one.
            </p>
          </AnimateIn>

          {/* Capital raise strip */}
          <AnimateIn delay={300}>
            <div className="inline-flex flex-wrap items-center justify-center gap-8 glass rounded-2xl px-10 py-6 border border-white/10">
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-green-400">$55.5M</div>
                <div className="text-white/40 text-xs uppercase tracking-widest mt-1">Capital Raise</div>
              </div>
              <div className="w-px h-10 bg-white/10 hidden sm:block" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-white">85%</div>
                <div className="text-white/40 text-xs uppercase tracking-widest mt-1">Asset-Based</div>
              </div>
              <div className="w-px h-10 bg-white/10 hidden sm:block" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-white">50–60%</div>
                <div className="text-white/40 text-xs uppercase tracking-widest mt-1">Investor Ownership</div>
              </div>
              <div className="w-px h-10 bg-white/10 hidden sm:block" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-white">4</div>
                <div className="text-white/40 text-xs uppercase tracking-widest mt-1">Markets</div>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-8 py-4 rounded-2xl transition-all glow-green text-base"
              >
                Request Investor Deck
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#financials"
                className="inline-flex items-center gap-2 glass hover:border-white/20 text-white/70 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all text-base"
              >
                View Financials
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="section-padding">
        <div className="container-wide">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-green-400 text-xs font-bold uppercase tracking-[0.25em] mb-4">Why Greenspace E-mobility</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                The investment case
              </h2>
              <p className="text-white/40 max-w-xl mx-auto">
                Our operation uses fewer resources to provide a better service — increasing margins and creating value without the need for government subsidies or tax dollars.
              </p>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map(({ icon: Icon, title, desc }, i) => (
              <AnimateIn key={i} delay={i * 100}>
                <div className="glass rounded-2xl p-8 hover:border-green-500/25 transition-all group h-full flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors shrink-0">
                    <Icon className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="font-display font-bold text-white text-lg mb-3">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed flex-1">{desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Financial KPIs */}
      <section id="financials" className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/3 via-transparent to-transparent pointer-events-none" />
        <div className="container-wide relative z-10">
          <AnimateIn>
            <div className="text-center mb-16">
              <Badge className="mb-6">Financial Highlights</Badge>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Built for returns
              </h2>
              <p className="text-white/40 max-w-xl mx-auto">
                Modeled on a 10-year horizon across 12 stations. $5M–$9M annual charging revenue potential once fully operational.
              </p>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {financialKPIs.map((kpi, i) => (
              <AnimateIn key={i} delay={i * 80}>
                <div className="glass rounded-2xl p-6 text-center hover:border-green-500/20 transition-colors">
                  <div className="font-display text-3xl font-bold text-gradient mb-1">{kpi.value}</div>
                  <div className="text-white/70 text-sm font-semibold mb-1">{kpi.label}</div>
                  <div className="text-white/30 text-xs">{kpi.sub}</div>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Revenue model detail */}
          <AnimateIn>
            <div className="glass rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">Revenue Model</div>
                  <div className="space-y-3">
                    {[
                      'Fixed lease rate per truck (5+ year contracts)',
                      'Fixed energy price per kWh sold',
                      'Public charging revenue (variable)',
                      'Fleet telematics & software subscriptions',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">Risk Mitigation</div>
                  <div className="space-y-3">
                    {[
                      'Fixed lease model — revenue independent of EV adoption rate',
                      'Long-term fleet contracts (5+ years) per power unit',
                      'Warranty buy-back: 400k miles or 5 years per truck',
                      'Variable public pricing protects against energy cost swings',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">Station Economics</div>
                  <div className="space-y-3">
                    {[
                      ['CAPEX per station', '$2.25M'],
                      ['Year 1 revenue / station', '$322K'],
                      ['Year 10 revenue / station', '$2.2M'],
                      ['Energy gross spread', '63–300%'],
                    ].map(([label, val], i) => (
                      <div key={i} className="flex items-center justify-between text-sm border-b border-white/[0.06] pb-2">
                        <span className="text-white/50">{label}</span>
                        <span className="text-white font-semibold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Investment Structures */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <AnimateIn><h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Investment structures</h2></AnimateIn>
            <AnimateIn delay={100}><p className="text-white/40 max-w-xl mx-auto">Multiple entry points depending on your mandate — from equity to asset-backed SPV structures.</p></AnimateIn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {investmentStructures.map(({ icon: Icon, title, desc }, i) => (
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
          <AnimateIn delay={200}>
            <div className="mt-6 glass rounded-2xl p-6 border border-white/[0.06]">
              <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-white/50">
                <BarChart3 className="w-5 h-5 text-green-400 shrink-0" />
                <p>Minimum investment: <span className="text-white font-semibold">USD $55.5M</span> (full program) — structured tranches available per market or phase. Senior debt and infrastructure debt financing also considered. Contact us to discuss your specific mandate.</p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Capital Deployment Timeline */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/4 via-transparent to-transparent pointer-events-none" />
        <div className="container-wide relative z-10">
          <div className="text-center mb-16">
            <AnimateIn><Badge className="mb-6">Capital Deployment</Badge></AnimateIn>
            <AnimateIn delay={100}>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                $55.5M deployed across 4 markets
              </h2>
            </AnimateIn>
            <AnimateIn delay={200}>
              <p className="text-white/40 max-w-xl mx-auto">
                Two-year execution plan — 2026 and 2027. 12 Green Hubs. 100 Class 8 electric trucks. Four countries.
              </p>
            </AnimateIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deploymentPhases.map((phase, i) => (
              <AnimateIn key={i} delay={i * 100}>
                <div className={`glass rounded-2xl p-8 h-full hover:border-green-500/20 transition-all ${
                  phase.status === 'active' ? 'border-green-500/30' : ''
                }`}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      phase.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-white/5 text-white/40'
                    }`}>
                      {phase.phase}
                    </span>
                    {phase.status === 'active' && (
                      <span className="flex items-center gap-1.5 text-xs text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        In execution
                      </span>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-green-400" />
                        <h3 className="font-display font-bold text-white text-xl">{phase.market}</h3>
                      </div>
                      <p className="text-white/40 text-sm leading-relaxed">{phase.detail}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display font-bold text-green-400 text-2xl">{phase.capex}</div>
                      <div className="text-white/30 text-xs">CAPEX</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.06]">
                    <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                      <div className="text-white font-semibold text-sm">{phase.stations}</div>
                      <div className="text-white/30 text-xs mt-0.5">Green Hubs</div>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                      <div className="text-white font-semibold text-sm">{phase.trucks}</div>
                      <div className="text-white/30 text-xs mt-0.5">Fleet</div>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Total summary bar */}
          <AnimateIn delay={200}>
            <div className="mt-6 glass rounded-2xl p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { val: '$22.5M', label: 'Infrastructure CAPEX' },
                  { val: '$28M',   label: 'Fleet CAPEX' },
                  { val: '$5M',    label: 'OPEX Buffer' },
                  { val: '$55.5M', label: 'Total Program' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="font-display text-2xl font-bold text-gradient">{s.val}</div>
                    <div className="text-white/40 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Competitive Moats */}
      <section className="section-padding">
        <div className="container-wide">
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
                  We are actively raising for our 2026–2027 deployment. Request the full investor deck, financial model, and project documentation.
                </p>
                <p className="text-white/30 text-sm max-w-lg mx-auto mb-10">
                  This page is for qualified investors only. All financial projections are forward-looking estimates based on current market conditions.
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
