import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight, ChevronDown, Zap, CheckCircle2, Globe, Wrench, Cpu, Leaf
} from 'lucide-react'
import Image from 'next/image'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'
import CountUp from '@/components/CountUp'
import SolutionsSection from '@/components/SolutionsSection'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'hero' })
  return { title: 'Greenspace E-Mobility', description: t('subtitle') }
}

function HeroSection() {
  const t = useTranslations('hero')
  const locale = useTranslations('nav')
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Real hero background image */}
      <Image
        src="/images/hero-bg.jpg"
        alt="Hero background"
        fill
        priority
        className="object-cover object-center"
        quality={90}
      />
      {/* Dark overlay to keep text readable */}
      <div className="absolute inset-0 bg-navy-900/70" />
      {/* Green tint gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900/60 via-transparent to-navy-900/80" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />

      <div className="container-wide relative z-10 pt-24 pb-16 text-center">
        <AnimateIn delay={0}>
          <Badge className="mb-8">{t('badge')}</Badge>
        </AnimateIn>

        <AnimateIn delay={100}>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8">
            <span className="text-white">{t('headline1')} </span>
            <br className="hidden md:block" />
            <span className="text-gradient">{t('headline2')}</span>
            <br />
            <span className="text-white">{t('headline3')}</span>
          </h1>
        </AnimateIn>

        <AnimateIn delay={200}>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            {t('subtitle')}
          </p>
        </AnimateIn>

        <AnimateIn delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <HeroCTALink />
            <HeroHighwayLink />
          </div>
        </AnimateIn>

        <AnimateIn delay={500} className="mt-20">
          <div className="flex justify-center">
            <ChevronDown className="w-6 h-6 text-white/20 animate-bounce" />
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

function HeroCTALink() {
  const t = useTranslations('hero')
  const locale = useTranslations('nav')
  return (
    <Link
      href="#solutions"
      className="group flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-8 py-4 rounded-2xl transition-all duration-200 glow-green hover:scale-105 text-base"
    >
      {t('cta1')}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  )
}

function HeroHighwayLink() {
  const t = useTranslations('hero')
  return (
    <Link
      href="#highway"
      className="flex items-center gap-2 glass border border-white/10 hover:border-green-500/30 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 text-base hover:bg-white/5"
    >
      <Zap className="w-4 h-4 text-green-400" />
      {t('cta2')}
    </Link>
  )
}

function StatsSection() {
  const t = useTranslations('stats')
  const stats = [
    { value: 500, suffix: '+', label: t('chargingPoints'), sub: t('chargingPointsDesc') },
    { value: 12, suffix: '+', label: t('partners'), sub: t('partnersDesc') },
    { value: 6, suffix: '', label: t('countries'), sub: t('countriesDesc') },
    { value: 1200, suffix: '+', label: t('co2'), sub: t('co2Desc') },
  ]
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/0 via-navy-800/30 to-navy-900/0" />
      <div className="container-wide relative z-10">
        <AnimateIn>
          <p className="text-center text-white/40 text-xs font-semibold tracking-widest uppercase mb-12">{t('title')}</p>
        </AnimateIn>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <AnimateIn key={i} delay={i * 100}>
              <div className="glass rounded-2xl p-6 text-center hover:border-green-500/20 transition-colors group">
                <div className="font-display text-4xl md:text-5xl font-bold text-gradient mb-2 group-hover:scale-105 transition-transform">
                  <CountUp end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-white font-semibold text-sm mb-1">{s.label}</div>
                <div className="text-white/40 text-xs">{s.sub}</div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function HighwayTeaser() {
  const t = useTranslations('highway')
  const locale = useTranslations('nav')
  return (
    <section id="highway" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-navy-800/50" />

      {/* Road lines decoration */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
      <div className="absolute left-0 right-0 top-1/2 translate-y-4 h-px bg-gradient-to-r from-transparent via-green-500/10 to-transparent" />

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <AnimateIn direction="left">
              <Badge className="mb-6">{t('badge')}</Badge>
            </AnimateIn>
            <AnimateIn direction="left" delay={100}>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {t('title')}
              </h2>
            </AnimateIn>
            <AnimateIn direction="left" delay={200}>
              <p className="text-white/50 text-lg leading-relaxed mb-10">{t('subtitle')}</p>
            </AnimateIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                { title: t('feature1Title'), desc: t('feature1Desc') },
                { title: t('feature2Title'), desc: t('feature2Desc') },
                { title: t('feature3Title'), desc: t('feature3Desc') },
                { title: t('feature4Title'), desc: t('feature4Desc') },
              ].map((f, i) => (
                <AnimateIn key={i} direction="left" delay={300 + i * 80}>
                  <div className="glass rounded-xl p-5 hover:border-green-500/25 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      <span className="text-white font-semibold text-sm">{f.title}</span>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed pl-6">{f.desc}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>

            <AnimateIn direction="left" delay={600}>
              <HighwayCTALink />
            </AnimateIn>
          </div>

          {/* Map / visual */}
          <AnimateIn direction="right" delay={200}>
            <div className="glass rounded-3xl overflow-hidden relative" style={{ aspectRatio: '1/1' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900" />
              {/* Grid background */}
              <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: 'linear-gradient(rgba(0,200,83,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,83,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
              />
              <div className="absolute inset-0 p-5 flex flex-col">
                <p className="text-white/20 text-xs uppercase tracking-widest mb-2">{t('mapTitle')}</p>
                <div className="flex-1 relative">
                  <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">

                    {/* US–Mexico border line at Laredo latitude */}
                    <line x1="0" y1="270" x2="400" y2="270" stroke="white" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="6 4" />
                    <text x="8" y="262" fill="white" fillOpacity="0.18" fontSize="8" fontFamily="sans-serif" fontWeight="700" letterSpacing="2">TEXAS</text>
                    <text x="8" y="288" fill="white" fillOpacity="0.18" fontSize="8" fontFamily="sans-serif" fontWeight="700" letterSpacing="2">MEXICO</text>

                    {/* ── Phase 1: Monterrey → Laredo ── */}
                    <path d="M 78 368 C 82 340 88 312 102 272"
                      stroke="#00C853" strokeWidth="2.5" strokeDasharray="7 4" strokeOpacity="0.9" fill="none" />

                    {/* ── Phase 1 cont: Laredo → Dallas ── */}
                    <path d="M 102 268 C 140 210 180 140 218 72"
                      stroke="#00C853" strokeWidth="2.5" strokeDasharray="7 4" strokeOpacity="0.9" fill="none" />

                    {/* ── Phase 2: Dallas → Houston ── */}
                    <path d="M 222 70 C 260 110 290 150 318 188"
                      stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="7 4" strokeOpacity="0.9" fill="none" />

                    {/* ── Phase 3: Houston → Laredo ── */}
                    <path d="M 316 192 C 260 225 190 248 106 268"
                      stroke="#FB923C" strokeWidth="2.5" strokeDasharray="7 4" strokeOpacity="0.85" fill="none" />

                    {/* Phase labels */}
                    <text x="56" y="322" fill="#00C853" fillOpacity="0.7" fontSize="8" fontFamily="sans-serif" fontWeight="600">Phase 1</text>
                    <text x="270" y="128" fill="#38BDF8" fillOpacity="0.7" fontSize="8" fontFamily="sans-serif" fontWeight="600">Phase 2</text>
                    <text x="196" y="248" fill="#FB923C" fillOpacity="0.7" fontSize="8" fontFamily="sans-serif" fontWeight="600">Phase 3</text>

                    {/* ── City: Monterrey ── */}
                    <circle cx="78" cy="368" r="18" fill="#00C853" fillOpacity="0.12" />
                    <circle cx="78" cy="368" r="9" fill="#00C853" />
                    <circle cx="78" cy="368" r="4" fill="white" />
                    <text x="92" y="364" fill="white" fillOpacity="0.9" fontSize="10.5" fontFamily="sans-serif" fontWeight="700">Monterrey</text>
                    <text x="92" y="377" fill="white" fillOpacity="0.4" fontSize="8" fontFamily="sans-serif">México</text>

                    {/* ── City: Laredo (Border Crossing) ── */}
                    <circle cx="102" cy="268" r="16" fill="#00C853" fillOpacity="0.12" />
                    <circle cx="102" cy="268" r="7" fill="#00C853" />
                    <circle cx="102" cy="268" r="3" fill="white" />
                    {/* border cross icon */}
                    <text x="114" y="264" fill="white" fillOpacity="0.9" fontSize="10.5" fontFamily="sans-serif" fontWeight="700">Laredo</text>
                    <text x="114" y="276" fill="#00C853" fillOpacity="0.7" fontSize="8" fontFamily="sans-serif">Cross Border ✦</text>

                    {/* ── City: Dallas ── */}
                    <circle cx="220" cy="70" r="18" fill="#00C853" fillOpacity="0.12" />
                    <circle cx="220" cy="70" r="9" fill="#00C853" />
                    <circle cx="220" cy="70" r="4" fill="white" />
                    <text x="234" y="66" fill="white" fillOpacity="0.9" fontSize="10.5" fontFamily="sans-serif" fontWeight="700">Dallas</text>
                    <text x="234" y="78" fill="white" fillOpacity="0.4" fontSize="8" fontFamily="sans-serif">Texas</text>

                    {/* ── City: Houston ── */}
                    <circle cx="318" cy="190" r="18" fill="#38BDF8" fillOpacity="0.12" />
                    <circle cx="318" cy="190" r="9" fill="#38BDF8" />
                    <circle cx="318" cy="190" r="4" fill="white" />
                    <text x="332" y="186" fill="white" fillOpacity="0.9" fontSize="10.5" fontFamily="sans-serif" fontWeight="700">Houston</text>
                    <text x="332" y="198" fill="white" fillOpacity="0.4" fontSize="8" fontFamily="sans-serif">Texas</text>

                    {/* Legend */}
                    <rect x="6" y="336" width="122" height="56" rx="6" fill="white" fillOpacity="0.04" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
                    <circle cx="18" cy="350" r="4" fill="#00C853" />
                    <text x="27" y="354" fill="white" fillOpacity="0.6" fontSize="8" fontFamily="sans-serif">Phase 1 — MTY › LRD › DAL</text>
                    <circle cx="18" cy="364" r="4" fill="#38BDF8" />
                    <text x="27" y="368" fill="white" fillOpacity="0.6" fontSize="8" fontFamily="sans-serif">Phase 2 — DAL › HOU</text>
                    <circle cx="18" cy="378" r="4" fill="#FB923C" />
                    <text x="27" y="382" fill="white" fillOpacity="0.6" fontSize="8" fontFamily="sans-serif">Phase 3 — HOU › LRD</text>

                  </svg>
                </div>
              </div>

              {/* Overlay badge */}
              <div className="absolute bottom-5 right-5 glass rounded-xl px-4 py-3 flex items-center gap-2 border border-green-500/20">
                <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-xs">Monterrey → Dallas → Houston</p>
                  <p className="text-white/40 text-[10px]">3 phases · Cross-border corridor</p>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}

function HighwayCTALink() {
  const t = useTranslations('highway')
  return (
    <Link
      href="/electric-highway"
      className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 glow-green-sm hover:glow-green"
    >
      {t('cta')}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  )
}

function WhyUsSection() {
  const t = useTranslations('whyUs')
  const reasons = [
    { icon: Globe, titleKey: 'reason1Title', descKey: 'reason1Desc' },
    { icon: Wrench, titleKey: 'reason2Title', descKey: 'reason2Desc' },
    { icon: Cpu,   titleKey: 'reason3Title', descKey: 'reason3Desc' },
    { icon: Leaf,  titleKey: 'reason4Title', descKey: 'reason4Desc' },
  ] as const

  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-16">
          <AnimateIn><Badge className="mb-6">{t('badge')}</Badge></AnimateIn>
          <AnimateIn delay={100}>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 max-w-2xl mx-auto leading-tight">
              {t('title')}
            </h2>
          </AnimateIn>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map(({ icon: Icon, titleKey, descKey }, i) => (
            <AnimateIn key={titleKey} delay={i * 100}>
              <div className="group relative glass rounded-2xl p-7 hover:border-green-500/25 transition-all duration-300 overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:bg-green-500/10 transition-colors" />
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-5 group-hover:bg-green-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-3">{t(titleKey as any)}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{t(descKey as any)}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function PartnersSection() {
  const t = useTranslations('partners')
  const partners = ['Autel Energy', 'Sinexcel', 'Gresgying']
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-800/20 to-transparent" />
      <div className="container-wide relative z-10">
        <div className="text-center mb-12">
          <AnimateIn><Badge className="mb-6">{t('badge')}</Badge></AnimateIn>
          <AnimateIn delay={100}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{t('title')}</h2>
          </AnimateIn>
          <AnimateIn delay={200}>
            <p className="text-white/40 max-w-xl mx-auto">{t('subtitle')}</p>
          </AnimateIn>
        </div>
        <AnimateIn delay={300}>
          <div className="flex flex-wrap justify-center gap-4">
            {partners.map((name) => (
              <div
                key={name}
                className="glass rounded-xl px-8 py-5 hover:border-green-500/20 hover:bg-white/[0.06] transition-all duration-300"
              >
                <span className="font-display font-bold text-white/40 hover:text-white/70 transition-colors text-lg tracking-wide">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

function CTASection() {
  const t = useTranslations('cta')
  return (
    <section className="section-padding">
      <div className="container-wide">
        <AnimateIn>
          <div className="relative glass rounded-3xl overflow-hidden p-12 md:p-20 text-center">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-navy-700/30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-green-500/60 to-transparent" />

            <div className="relative z-10">
              <Badge className="mb-8">Greenspace E-Mobility</Badge>
              <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {t('title')}
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto mb-12">{t('subtitle')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton />
                <CTASecondaryButton />
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

function CTAButton() {
  const t = useTranslations('cta')
  return (
    <Link
      href="/contact"
      className="group flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-8 py-4 rounded-2xl transition-all duration-200 glow-green text-base"
    >
      {t('button')}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  )
}

function CTASecondaryButton() {
  const t = useTranslations('cta')
  return (
    <Link
      href="/about"
      className="flex items-center justify-center gap-2 glass border border-white/10 hover:border-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 text-base"
    >
      {t('buttonAlt')}
    </Link>
  )
}

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  return (
    <>
      <HeroSection />
      <StatsSection />
      <SolutionsSection />
      <HighwayTeaser />
      <WhyUsSection />
      <PartnersSection />
      <CTASection />
    </>
  )
}
