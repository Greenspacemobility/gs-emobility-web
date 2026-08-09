import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight, ChevronDown, Zap, CheckCircle2, Globe, Wrench, Cpu, Leaf,
  MapPin, Truck, Settings
} from 'lucide-react'
import Image from 'next/image'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'
import CountUp from '@/components/CountUp'
import SolutionsSection from '@/components/SolutionsSection'
import HighwayMap from '@/components/HighwayMap'
import AmbientBackground from '@/components/AmbientBackground'
import EnergyNetwork from '@/components/EnergyNetwork'
import VideoPlayer from '@/components/VideoPlayer'
import { alternatesFor } from '@/lib/seo'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEs = locale === 'es'
  const description = isEs
    ? 'Greenspace E-mobility es la empresa líder en infraestructura de carga eléctrica en Panamá y México. Distribuidor oficial de cargadores Autel Energy (hasta 640 kW DC HiPower) y distribuidor exclusivo de camiones eléctricos Windrose Clase 8 en Latinoamérica. Autopista eléctrica México–Texas.'
    : 'Greenspace E-mobility is the leading EV charging infrastructure company in Panama and Mexico. Official Autel Energy charger distributor (up to 640 kW DC HiPower) and exclusive Windrose Class 8 electric truck distributor in Latin America. Building the Mexico–Texas electric highway.'
  return {
    title: 'Greenspace E-mobility | EV Charging Infrastructure & Electric Trucks Americas',
    description,
    keywords: [
      'EV charging Panama', 'Autel EV charger distributor Panama', 'DC fast charger Panama',
      'Windrose electric truck Latin America', 'electric truck distributor Mexico',
      'fleet electrification Panama Mexico', 'electric highway Mexico Texas',
      'cargador EV Panamá', 'camión eléctrico México', 'infraestructura carga eléctrica',
    ],
    alternates: alternatesFor('', locale),
  }
}

function HeroSection() {
  const t = useTranslations('hero')
  const locale = useTranslations('nav')
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cinematic background photo with slow Ken-Burns drift */}
      <div className="absolute inset-0 animate-kenburns">
        <Image
          src="/images/hero-bg.jpg"
          alt="Close-up of an EV charging connector plugged into an electric vehicle's illuminated charge port"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={90}
        />
      </div>
      {/* Dark overlay to keep text readable */}
      <div className="absolute inset-0 bg-navy-900/72" />
      {/* Green tint gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900/70 via-navy-900/25 to-navy-900/85" />

      {/* Techy charging-network motif */}
      <EnergyNetwork className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />

      {/* Cinematic vignette + scanning sweep */}
      <div className="cine-vignette" />
      <div className="scan-sweep" />

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
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            {t('subtitle')}
          </p>
        </AnimateIn>

        <AnimateIn delay={280}>
          <p className="text-white/30 text-xs md:text-sm tracking-widest uppercase mb-10 font-medium">
            {t('proofLine')}
          </p>
        </AnimateIn>

        <AnimateIn delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <HeroCTALink />
            <HeroHighwayLink />
          </div>
        </AnimateIn>

        <AnimateIn delay={450} className="mt-16">
          <HeroMarquee />
        </AnimateIn>

        <AnimateIn delay={600} className="mt-10">
          <div className="flex justify-center">
            <ChevronDown className="w-6 h-6 text-white/20 animate-bounce" />
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

function HeroMarquee() {
  const t = useTranslations('hero')
  // One localized, brand-free string of markets + capabilities, separated by " · "
  const items = t('marquee').split('·').map((s) => s.trim()).filter(Boolean)
  const loop = [...items, ...items]
  return (
    <div className="marquee-mask w-full overflow-hidden">
      <div className="animate-marquee gap-0">
        {loop.map((item, i) => (
          <span key={i} className="inline-flex items-center text-white/35 text-xs md:text-sm tracking-widest uppercase font-medium">
            <span className="px-5">{item}</span>
            <span className="w-1 h-1 rounded-full bg-green-400/50" />
          </span>
        ))}
      </div>
    </div>
  )
}

function HeroCTALink() {
  const t = useTranslations('hero')
  return (
    <Link
      href="/contact"
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
      href="/electric-highway"
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
    { value: 11, suffix: '+', label: t('chargingPoints'), sub: t('chargingPointsDesc') },
    { value: 15, suffix: '', label: t('partners'), sub: t('partnersDesc') },
    { value: 4, suffix: '', label: t('countries'), sub: t('countriesDesc') },
    { value: 400, suffix: ' kW+', label: t('co2'), sub: t('co2Desc') },
  ]
  return (
    <section className="py-20 relative overflow-hidden">
      <AmbientBackground variant="dots" />
      <div className="container-wide relative z-10">
        <AnimateIn>
          <p className="text-center text-white/40 text-xs font-semibold tracking-widest uppercase mb-12">{t('title')}</p>
        </AnimateIn>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <AnimateIn key={i} delay={i * 100}>
              <div className="glass lift rounded-2xl p-6 text-center hover:border-green-500/25 hover:glow-green-sm group">
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
      <AmbientBackground variant="corridor" sweep />

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
              {/* Real map */}
              <div className="absolute inset-0">
                <HighwayMap />
              </div>

              {/* Phase legend — top left */}
              <div className="absolute top-4 left-4 z-[1000] glass rounded-xl px-3 py-2.5 border border-white/10 space-y-1.5">
                <p className="text-white/30 text-[9px] uppercase tracking-widest mb-2">{t('mapTitle')}</p>
                {[
                  { color: '#00C853', label: 'Hwy 85 MX + I-35 US · Phases 1–4' },
                  { color: '#38BDF8', label: 'Texas Triangle · Phase 5' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="inline-block w-5 h-[2px] rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-white/65 text-[10px] font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* Bottom badge */}
              <div className="absolute bottom-4 left-4 right-4 z-[1000] glass rounded-xl px-4 py-3 flex items-center gap-3 border border-green-500/20">
                <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-xs">Monterrey → Dallas + Texas Triangle</p>
                  <p className="text-white/40 text-[10px]">4 phases · 12 Green Hubs · Hwy 85 MX + I-35 US</p>
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

function ModelsSection() {
  const t = useTranslations('models')
  return (
    <section className="section-padding relative overflow-hidden">
      <AmbientBackground variant="mesh" />
      <div className="container-wide relative z-10">
        <div className="text-center mb-16">
          <AnimateIn><Badge className="mb-6">{t('badge')}</Badge></AnimateIn>
          <AnimateIn delay={100}>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl mx-auto leading-tight">
              {t('title')}
            </h2>
          </AnimateIn>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Europe */}
          <AnimateIn direction="left" delay={100}>
            <div className="glass lift rounded-3xl h-full hover:border-emerald-500/30 group relative overflow-hidden">
              <Image
                src="/images/service-cooperation.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-[0.14] group-hover:opacity-25 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-navy-900/88 via-navy-900/82 to-navy-900/95" />
              <div className="relative z-10 p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
                    <Globe className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">{t('europeTag')}</span>
                    <h3 className="font-display font-bold text-white text-xl">{t('europeTitle')}</h3>
                  </div>
                </div>
                <p className="text-white/55 leading-relaxed mb-8">{t('europeDesc')}</p>
                <ul className="space-y-3">
                  {[t('europePoint1'), t('europePoint2'), t('europePoint3')].map((point, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-white/75 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimateIn>

          {/* Americas */}
          <AnimateIn direction="right" delay={200}>
            <div className="glass lift rounded-3xl h-full border-green-500/20 hover:border-green-500/45 group glow-green-sm relative overflow-hidden">
              <Image
                src="/images/products/windrose-truck.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-navy-900/85 via-navy-900/80 to-navy-900/95" />
              <div className="relative z-10 p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center group-hover:bg-green-500/25 transition-colors">
                    <Truck className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <span className="text-green-400 text-xs font-bold uppercase tracking-widest">{t('americasTag')}</span>
                    <h3 className="font-display font-bold text-white text-xl">{t('americasTitle')}</h3>
                  </div>
                </div>
                <p className="text-white/55 leading-relaxed mb-8">{t('americasDesc')}</p>
                <ul className="space-y-3">
                  {[t('americasPoint1'), t('americasPoint2'), t('americasPoint3')].map((point, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                      <span className="text-white/75 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
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
    <section className="section-padding relative overflow-hidden">
      <AmbientBackground variant="dots" />
      <div className="container-wide relative z-10">
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
              <div className="group relative glass lift rounded-2xl p-7 hover:border-green-500/25 hover:glow-green-sm overflow-hidden h-full">
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
    <section className="py-20 relative overflow-hidden">
      <AmbientBackground variant="mesh" />
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
            {/* Background glow + tech texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/12 via-transparent to-navy-700/30" />
            <div className="grid-dots opacity-50" />
            <div className="scan-sweep" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-green-500/60 to-transparent" />

            <div className="relative z-10">
              <Badge className="mb-8">Greenspace E-mobility</Badge>
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
      href="/electric-highway"
      className="flex items-center justify-center gap-2 glass border border-white/10 hover:border-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 text-base"
    >
      {t('buttonAlt')}
    </Link>
  )
}

function DeploymentsSection() {
  const t = useTranslations('deployments')
  const videos = [
    { src: '/videos/dhl-panama.mp4', poster: '/videos/dhl-panama-poster.jpg', label: t('dhlLabel') },
    { src: '/videos/banco-general-panama.mp4', poster: '/videos/banco-general-panama-poster.jpg', label: t('bancoLabel') },
  ]
  return (
    <section className="section-padding relative overflow-hidden">
      <AmbientBackground variant="grid" sweep />
      <div className="container-wide relative z-10">
        <div className="text-center mb-14">
          <AnimateIn><Badge className="mb-6">{t('badge')}</Badge></AnimateIn>
          <AnimateIn delay={100}>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 max-w-2xl mx-auto leading-tight">
              {t('title')}
            </h2>
          </AnimateIn>
          <AnimateIn delay={200}>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
          </AnimateIn>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto mb-12">
          {videos.map((v, i) => (
            <AnimateIn key={i} delay={i * 120}>
              <div className="glass lift rounded-3xl p-6 hover:border-green-500/25 hover:glow-green-sm">
                <VideoPlayer src={v.src} poster={v.poster} label={t('videoLabel')} />
                <p className="text-center text-white/70 text-xs font-semibold mt-5 uppercase tracking-widest">{v.label}</p>
              </div>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={300}>
          <div className="flex justify-center">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 glass border border-white/10 hover:border-green-500/30 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:bg-white/5"
            >
              {t('cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

// Homepage FAQ schema — top questions AI assistants receive about Greenspace
const homepageFAQSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Greenspace E-mobility?',
      acceptedAnswer: { '@type': 'Answer', text: 'Greenspace E-mobility is an EV charging infrastructure company and electric vehicle distributor operating in Panama, Mexico, Texas (USA), and Norway. The company is the official Autel Energy EV charger distributor and exclusive Windrose Class 8 electric truck distributor in Latin America.' },
    },
    {
      '@type': 'Question',
      name: 'Who sells EV chargers in Panama?',
      acceptedAnswer: { '@type': 'Answer', text: 'Greenspace E-mobility is the leading EV charging infrastructure company in Panama and the official distributor of Autel Energy MaxiCharger stations from 9.6 kW Level 2 chargers to 640 kW DC HiPower cabinets. Contact info@gs-emobility.com for a quote.' },
    },
    {
      '@type': 'Question',
      name: 'Who distributes Windrose electric trucks in Latin America?',
      acceptedAnswer: { '@type': 'Answer', text: 'Greenspace E-mobility is the exclusive distributor of Windrose Class 8 electric trucks in Latin America, with operations in Panama and Monterrey, Mexico. The Windrose truck offers up to 670 km (416 mi) loaded range and a 729 kWh battery.' },
    },
    {
      '@type': 'Question',
      name: 'Is there an electric highway between Mexico and Texas?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Greenspace E-mobility is developing the Mexico–Texas Electric Highway: a DC fast charging corridor along Highway 85 in Mexico and I-35 in the USA connecting Monterrey to Dallas and the Texas Triangle, planned across 4 phases with 12 Green Hubs.' },
    },
    {
      '@type': 'Question',
      name: 'Who is the official Autel Energy distributor in Latin America?',
      acceptedAnswer: { '@type': 'Answer', text: 'Greenspace E-mobility is the official Autel Energy distributor for Panama, Mexico, and the United States, offering the full MaxiCharger lineup including AC Level 2, DC Fast to 240 kW and DC HiPower to 640 kW.' },
    },
    {
      '@type': 'Question',
      name: 'Does Greenspace E-mobility offer fleet electrification in Mexico?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Greenspace E-mobility provides complete fleet electrification services in Mexico, including Autel Energy charger supply and installation, Windrose electric truck distribution, charging management platform, and ongoing support from its Monterrey, Nuevo León operations center.' },
    },
  ],
}

// WebSite schema (enables Google Sitelinks Searchbox + AI entity recognition)
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.gs-emobility.com/#website',
  url: 'https://www.gs-emobility.com',
  name: 'Greenspace E-mobility',
  description: 'EV charging infrastructure and electric vehicle distribution in Panama, Mexico, Texas and Norway.',
  publisher: { '@id': 'https://www.gs-emobility.com/#organization' },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://www.gs-emobility.com/en/faq?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
}

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFAQSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <HeroSection />
      <StatsSection />
      <ModelsSection />
      <HighwayTeaser />
      <SolutionsSection />
      <DeploymentsSection />
      <WhyUsSection />
      <CTASection />
    </>
  )
}
