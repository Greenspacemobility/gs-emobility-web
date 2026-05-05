import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import {
  MapPin, Users, Building2, Calendar, Star, ArrowRight,
  ExternalLink, Zap, Truck, Globe,
} from 'lucide-react'
import Link from 'next/link'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'
import VideoPlayer from '@/components/VideoPlayer'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'projects' })
  return { title: `${t('title')} — Greenspace E-Mobility`, description: t('subtitle') }
}

export default function ProjectsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('projects')

  // Original video project cards
  const videoProjects = [
    {
      key: 'p1',
      video: '/videos/dhl-panama.mp4',
      poster: '/videos/dhl-panama-poster.jpg',
      stats: [
        { icon: MapPin,    val: t('p1Stat1Val'), label: t('p1Stat1Label') },
        { icon: Users,     val: t('p1Stat2Val'), label: t('p1Stat2Label') },
        { icon: Building2, val: t('p1Stat3Val'), label: t('p1Stat3Label') },
        { icon: Calendar,  val: t('p1Stat4Val'), label: t('p1Stat4Label') },
      ],
    },
    {
      key: 'p2',
      video: '/videos/banco-general-panama.mp4',
      poster: '/videos/banco-general-panama-poster.jpg',
      stats: [
        { icon: MapPin,    val: t('p2Stat1Val'), label: t('p2Stat1Label') },
        { icon: Star,      val: t('p2Stat2Val'), label: t('p2Stat2Label') },
        { icon: Building2, val: t('p2Stat3Val'), label: t('p2Stat3Label') },
        { icon: Calendar,  val: t('p2Stat4Val'), label: t('p2Stat4Label') },
      ],
    },
  ]

  const mediaArticles = [
    {
      pub: t('m1Pub'), headline: t('m1Headline'),
      href: 'https://www.reuters.com/business/autos-transportation/chinese-electric-truck-maker-windrose-makes-first-us-delivery-2026-04-08/',
    },
    {
      pub: t('m2Pub'), headline: t('m2Headline'),
      href: 'https://www.automotivelogistics.media/ev-and-battery/ev-charging-firm-plans-first-usmexico-electric-freight-route/1607209',
    },
    {
      pub: t('m3Pub'), headline: t('m3Headline'),
      href: 'https://mexiconewsdaily.com/business/electric-trucks-cargo-monterrey-dallas/',
    },
    {
      pub: t('m4Pub'), headline: t('m4Headline'),
      href: 'https://www.lmtonline.com/local/article/texas-nuevo-leon-electric-route-laredo-21079376.php',
    },
    {
      pub: t('m5Pub'), headline: t('m5Headline'),
      href: 'https://border-now.com/new-green-freight-corridor-powered-by-electric-trucks-to-connect-texas-and-nuevo-leon/',
    },
    {
      pub: t('m6Pub'), headline: t('m6Headline'),
      href: 'https://www.bnamericas.com/es/noticias/dhl-panama-y-green-space-e-mobility-presentan-a-cime-el-proyecto-de-recambio-de-flota-hacia-modelos-electricos-y-cargadores-mas-completo-en-panama',
    },
    {
      pub: t('m7Pub'), headline: t('m7Headline'),
      href: 'https://www.ecotvpanama.com/nacionales/tercera-edicion-expo-e-movilidad-panama-2024-n6017746',
    },
    {
      pub: t('m8Pub'), headline: t('m8Headline'),
      href: 'https://elcapitalfinanciero.com/movilidad-electrica-gana-cada-vez-mas-terreno-en-panama/',
    },
    {
      pub: t('m9Pub'), headline: t('m9Headline'),
      href: 'https://www.octanosmedia.com/post/autos-el%C3%A9ctricos-se-toman-el-panama-convention-center',
    },
  ]

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[45vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, rgba(0,200,83,0.5) 0px, rgba(0,200,83,0.5) 2px, transparent 2px, transparent 60px)`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-green-500/6 rounded-full blur-3xl" />

        <div className="container-wide relative z-10 text-center py-20">
          <AnimateIn>
            <Badge className="mb-8">{t('badge')}</Badge>
          </AnimateIn>
          <AnimateIn delay={100}>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl mx-auto">
              {t('title')}
            </h1>
          </AnimateIn>
          <AnimateIn delay={200}>
            <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── Section 2: Panama Projects ──────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-wide">

          {/* Country header */}
          <AnimateIn>
            <div className="flex items-center gap-4 mb-12">
              <span className="text-2xl">🇵🇦</span>
              <span className="font-display font-bold text-white text-xl">{t('panamaHeader')}</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>
          </AnimateIn>

          {/* Video project cards (DHL + Banco General — keep unchanged) */}
          <div className="space-y-8 mb-8">
            {videoProjects.map(({ key, video, poster, stats }, idx) => (
              <AnimateIn key={key} delay={idx * 120}>
                <div className="glass rounded-3xl overflow-hidden border border-white/[0.08] hover:border-green-500/20 transition-colors">
                  <div className="grid lg:grid-cols-[5fr_7fr] gap-0">

                    {/* Video */}
                    <div className="relative bg-navy-900/60 flex items-center justify-center p-6 lg:p-8 min-h-[480px]">
                      <VideoPlayer
                        src={video}
                        poster={poster}
                        label={t('videoLabel')}
                      />
                    </div>

                    {/* Info */}
                    <div className="p-8 lg:p-12 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full tracking-wide">
                            {t(`${key}Badge` as any)}
                          </span>
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
                          {t(`${key}Title` as any)}
                        </h2>
                        <p className="text-white/55 leading-relaxed text-[0.95rem] mb-8">
                          {t(`${key}Desc` as any)}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                          {stats.map(({ icon: Icon, val, label }, i) => (
                            <div key={i} className="glass-forest rounded-xl p-4 text-center">
                              <Icon className="w-4 h-4 text-green-400 mx-auto mb-2 opacity-70" />
                              <div className="font-display font-bold text-white text-sm">{val}</div>
                              <div className="text-white/35 text-[10px] mt-0.5 leading-snug">{label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Partner strip */}
                      <div className="flex items-center gap-3 pt-6 border-t border-white/[0.07]">
                        <span className="text-white/25 text-xs uppercase tracking-widest">Partner</span>
                        <div className="glass rounded-lg px-4 py-2">
                          <span className="font-display font-bold text-white/80 text-sm tracking-wider">
                            {t(`${key}Partner` as any)}
                          </span>
                          <span className="text-white/30 text-xs ml-2">Panama</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Panama Pacifico — horizontal card (no video) */}
          <AnimateIn delay={240}>
            <a
              href="https://es.linkedin.com/posts/greenspace-emobility_gracias-apanama-pacificoywaste-revolution-activity-7196585424616624129-lvED"
              target="_blank"
              rel="noopener noreferrer"
              className="block glass rounded-3xl overflow-hidden border border-white/[0.08] hover:border-green-500/20 transition-colors group"
            >
              <div className="p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center gap-8">
                {/* Left: info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full tracking-wide">
                      {t('p3Badge')}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                    {t('p3Title')}
                  </h2>
                  <p className="text-white/55 leading-relaxed text-[0.9rem] mb-0">
                    {t('p3Desc')}
                  </p>
                </div>

                {/* Right: stats + link */}
                <div className="lg:w-64 shrink-0">
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { val: t('p3Stat1Val'), label: t('p3Stat1Label') },
                      { val: t('p3Stat2Val'), label: t('p3Stat2Label') },
                      { val: t('p3Stat3Val'), label: t('p3Stat3Label') },
                      { val: t('p3Stat4Val'), label: t('p3Stat4Label') },
                    ].map(({ val, label }, i) => (
                      <div key={i} className="glass-forest rounded-xl p-3 text-center">
                        <div className="font-display font-bold text-white text-sm">{val}</div>
                        <div className="text-white/35 text-[10px] mt-0.5 leading-snug">{label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-green-400 text-sm font-semibold group-hover:gap-3 transition-all">
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    {t('p3LinkLabel')}
                  </div>
                </div>
              </div>
            </a>
          </AnimateIn>
        </div>
      </section>

      {/* ── Section 3: Mexico · USA Projects ───────────────────────────── */}
      <section className="section-padding pt-0">
        <div className="container-wide">

          {/* Country header */}
          <AnimateIn>
            <div className="flex items-center gap-4 mb-12">
              <span className="text-2xl">🇲🇽🇺🇸</span>
              <span className="font-display font-bold text-white text-xl">{t('mexicoUsaHeader')}</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>
          </AnimateIn>

          {/* Cross-Border Electric Highway — large featured card */}
          <AnimateIn delay={80}>
            <div className="glass rounded-3xl overflow-hidden border border-green-500/20 hover:border-green-500/35 transition-colors mb-8 relative">
              {/* Background accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.05] to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />

              <div className="relative z-10 grid lg:grid-cols-[3fr_2fr]">
                {/* Content */}
                <div className="p-8 lg:p-14">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full tracking-wide">
                      {t('ehBadge')}
                    </span>
                    <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full tracking-wide">
                      {t('ehStatus')}
                    </span>
                  </div>

                  <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 leading-tight max-w-3xl">
                    {t('ehTitle')}
                  </h2>
                  <p className="text-white/60 leading-relaxed text-base mb-10 max-w-2xl">
                    {t('ehDesc')}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-2xl">
                    {[
                      { val: t('ehStat1Val'), label: t('ehStat1Label'), icon: Globe },
                      { val: t('ehStat2Val'), label: t('ehStat2Label'), icon: Zap },
                      { val: t('ehStat3Val'), label: t('ehStat3Label'), icon: MapPin },
                      { val: t('ehStat4Val'), label: t('ehStat4Label'), icon: Calendar },
                    ].map(({ val, label, icon: Icon }, i) => (
                      <div key={i} className="glass-forest rounded-xl p-4 text-center">
                        <Icon className="w-4 h-4 text-green-400 mx-auto mb-2 opacity-70" />
                        <div className="font-display font-bold text-white text-lg">{val}</div>
                        <div className="text-white/35 text-[10px] mt-0.5 leading-snug">{label}</div>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/${locale}/electric-highway`}
                    className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-7 py-3.5 rounded-2xl transition-all glow-green text-sm"
                  >
                    {t('ehCta')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Image */}
                <div className="hidden lg:block relative overflow-hidden min-h-[360px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/projects/electric-highway-corridor.webp"
                    alt="US-Mexico Electric Freight Corridor"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-navy-900/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />
                </div>
              </div>
            </div>
          </AnimateIn>

          {/* Windrose × Allogic card */}
          <AnimateIn delay={160}>
            <div className="glass rounded-3xl overflow-hidden border border-white/[0.08] hover:border-green-500/20 transition-colors">
              <div className="grid lg:grid-cols-[5fr_4fr] gap-0">

                {/* Content */}
                <div className="p-8 lg:p-12">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full tracking-wide">
                      {t('wrBadge')}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                    {t('wrTitle')}
                  </h2>
                  <p className="text-white/55 leading-relaxed text-[0.95rem] mb-8 max-w-2xl">
                    {t('wrDesc')}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 max-w-xl">
                    {[
                      { val: t('wrStat1Val'), label: t('wrStat1Label'), icon: MapPin },
                      { val: t('wrStat2Val'), label: t('wrStat2Label'), icon: Truck },
                      { val: t('wrStat3Val'), label: t('wrStat3Label'), icon: Zap },
                      { val: t('wrStat4Val'), label: t('wrStat4Label'), icon: Star },
                    ].map(({ val, label, icon: Icon }, i) => (
                      <div key={i} className="glass-forest rounded-xl p-4 text-center">
                        <Icon className="w-4 h-4 text-green-400 mx-auto mb-2 opacity-70" />
                        <div className="font-display font-bold text-white text-sm">{val}</div>
                        <div className="text-white/35 text-[10px] mt-0.5 leading-snug">{label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/[0.07]">
                    {/* Press citation */}
                    <a
                      href="https://www.reuters.com/business/autos-transportation/chinese-electric-truck-maker-windrose-makes-first-us-delivery-2026-04-08/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/50 hover:text-green-400 text-xs font-semibold transition-colors uppercase tracking-wide"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      {t('wrPressCite')}
                    </a>
                    {/* Partner strip */}
                    <div className="flex items-center gap-3">
                      <span className="text-white/25 text-xs uppercase tracking-widest">Partners</span>
                      <div className="glass rounded-lg px-4 py-2">
                        <span className="font-display font-bold text-white/80 text-sm tracking-wider">
                          {t('wrPartners')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo */}
                <div className="hidden lg:block relative overflow-hidden min-h-[320px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/projects/windrose-greenspace-ruta-verde.jpg"
                    alt="Greenspace E-mobility team with Ruta Verde electric fleet"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-navy-900/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-white/50 text-[10px] uppercase tracking-widest">
                      Ruta Verde · Mexico
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── Section 4: Ecosystem & Industry Leadership ──────────────────── */}
      <section className="section-padding pt-0">
        <div className="container-wide">

          <AnimateIn>
            <div className="flex items-center gap-4 mb-12">
              <Badge>{t('ecosystemHeader')}</Badge>
              <div className="flex-1 h-px bg-white/8" />
            </div>
          </AnimateIn>

          {/* Expo E-Movilidad Panama — large card with timeline */}
          <AnimateIn delay={80}>
            <div className="glass rounded-3xl border border-white/[0.08] hover:border-green-500/20 transition-colors overflow-hidden mb-8">

              {/* Hero image banner */}
              <div className="relative h-52 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/projects/expo-emovilidad-panama-convention-center.jpg"
                  alt="Expo E-Movilidad at Panama Convention Center"
                  className="w-full h-full object-cover object-center opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
                <div className="absolute bottom-4 left-8">
                  <span className="text-white/40 text-[10px] uppercase tracking-widest">
                    Panama Convention Center · Panama City
                  </span>
                </div>
              </div>

              <div className="p-8 lg:p-12">
              <div className="mb-8">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                  {t('expoTitle')}
                </h2>
                <p className="text-white/50 text-[0.95rem] leading-relaxed max-w-2xl">
                  {t('expoDesc')}
                </p>
              </div>

              {/* Timeline */}
              <div className="relative border-l-2 border-green-500/30 pl-8 space-y-8 mb-10">
                {[
                  { year: t('expo2022Year'), label: t('expo2022Label'), desc: t('expo2022Desc') },
                  { year: t('expo2023Year'), label: t('expo2023Label'), desc: t('expo2023Desc') },
                  { year: t('expo2024Year'), label: t('expo2024Label'), desc: t('expo2024Desc') },
                ].map(({ year, label, desc }, i) => (
                  <div key={i} className="relative">
                    {/* dot */}
                    <div className="absolute -left-[calc(2rem+1px)] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-500/20" />
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="font-display font-bold text-green-400 text-sm">{year}</span>
                      <span className="text-white/80 font-semibold text-sm">{label}</span>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Media coverage */}
              <div className="mb-8">
                <div className="text-white/30 text-xs uppercase tracking-widest mb-3">{t('expoMediaLabel')}</div>
                <div className="flex flex-wrap gap-2">
                  {['EcoTV', 'Octanos', 'Capital Financiero', 'Panorama Económico', 'Panama Conventions'].map((outlet) => (
                    <span
                      key={outlet}
                      className="glass text-white/60 text-xs px-3 py-1.5 rounded-full border border-white/[0.07]"
                    >
                      {outlet}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-semibold px-6 py-3 rounded-2xl transition-all text-sm"
              >
                {t('expoCta')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              </div>{/* end p-8 lg:p-12 */}
            </div>{/* end glass card */}
          </AnimateIn>

          {/* World EV Forum + CABEI — two side-by-side cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* World EV Forum */}
            <AnimateIn delay={160}>
              <a
                href="https://electricdrives.tv/"
                target="_blank"
                rel="noopener noreferrer"
                className="block glass rounded-3xl border border-white/[0.08] hover:border-green-500/20 transition-colors p-8 h-full group"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full tracking-wide">
                    {t('wevfBadge')}
                  </span>
                  <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-green-400 transition-colors shrink-0 mt-0.5" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3 leading-tight">
                  {t('wevfTitle')}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-5">
                  {t('wevfDesc')}
                </p>
                <div className="text-green-400 text-xs font-semibold uppercase tracking-widest">
                  {t('wevfLink')}
                </div>
              </a>
            </AnimateIn>

            {/* CABEI */}
            <AnimateIn delay={220}>
              <a
                href="https://proveedoreserp.bcie.org/en/news/article?cHash=9332411f3fd295761b1ca7465b23fa04&tx_news_pi1%5Baction%5D=detail&tx_news_pi1%5Bcontroller%5D=News&tx_news_pi1%5Bnews%5D=9281"
                target="_blank"
                rel="noopener noreferrer"
                className="block glass rounded-3xl border border-white/[0.08] hover:border-green-500/20 transition-colors p-8 h-full group"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full tracking-wide">
                    {t('caeiBadge')}
                  </span>
                  <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-green-400 transition-colors shrink-0 mt-0.5" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3 leading-tight">
                  {t('cabeiTitle')}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {t('cabeiDesc')}
                </p>
              </a>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Section 5: Media & Publications ────────────────────────────── */}
      <section className="section-padding pt-0">
        <div className="container-wide">

          <AnimateIn>
            <div className="mb-10">
              <h2 className="font-display text-3xl font-bold text-white mb-2">{t('mediaHeader')}</h2>
              <p className="text-white/40 text-sm">{t('mediaSubtext')}</p>
            </div>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mediaArticles.map(({ pub, headline, href }, i) => (
              <AnimateIn key={i} delay={i * 60}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block glass rounded-2xl border border-white/[0.07] hover:border-green-500/20 transition-colors p-6 h-full group"
                >
                  <div className="text-green-400 text-[11px] font-bold uppercase tracking-[0.12em] mb-3">
                    {pub}
                  </div>
                  <p className="text-white/80 text-sm leading-snug mb-5 line-clamp-3 flex-1">
                    {headline}
                  </p>
                  <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold group-hover:gap-2.5 transition-all">
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    {t('mediaReadLink')}
                  </div>
                </a>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: Interviews & Thought Leadership ─────────────────── */}
      <section className="section-padding pt-0">
        <div className="container-wide">

          <AnimateIn>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="font-display text-2xl font-bold text-white">{t('interviewsHeader')}</h2>
              <div className="flex-1 h-px bg-white/8" />
            </div>
          </AnimateIn>

          <div className="grid md:grid-cols-2 gap-6">
            {/* ElectricDrives */}
            <AnimateIn delay={80}>
              <a
                href="https://electricdrives.tv/ev-leaders-william-pui-martinez-ceo-greenspace-e-mobility/"
                target="_blank"
                rel="noopener noreferrer"
                className="block glass rounded-3xl border border-white/[0.08] hover:border-green-500/20 transition-colors p-8 lg:p-10 h-full group"
              >
                <div className="text-green-400 text-[11px] font-bold uppercase tracking-[0.12em] mb-4">
                  {t('i1Pub')}
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3 leading-tight">
                  {t('i1Headline')}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  {t('i1Desc')}
                </p>
                <div className="flex items-center gap-1.5 text-green-400 text-sm font-semibold group-hover:gap-2.5 transition-all">
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  {t('i1Link')}
                </div>
              </a>
            </AnimateIn>

            {/* Sostenibles */}
            <AnimateIn delay={160}>
              <a
                href="https://sostenibles.com.pa/post/-mas-alla-de-crear-una-compania-se-trata-de-un-movimiento-en-el-campo-de-la-electromovilidad-"
                target="_blank"
                rel="noopener noreferrer"
                className="block glass rounded-3xl border border-white/[0.08] hover:border-green-500/20 transition-colors p-8 lg:p-10 h-full group"
              >
                <div className="text-green-400 text-[11px] font-bold uppercase tracking-[0.12em] mb-4">
                  {t('i2Pub')}
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3 leading-tight">
                  {t('i2Headline')}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  {t('i2Desc')}
                </p>
                <div className="flex items-center gap-1.5 text-green-400 text-sm font-semibold group-hover:gap-2.5 transition-all">
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  {t('i2Link')}
                </div>
              </a>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Section 7: CTA block ────────────────────────────────────────── */}
      <section className="pb-24">
        <div className="container-wide">
          <AnimateIn>
            <div className="glass rounded-3xl p-10 md:p-14 text-center max-w-2xl mx-auto">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                {t('ctaTitle')}
              </h3>
              <p className="text-white/40 leading-relaxed mb-8">
                {t('ctaDesc')}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-7 py-3.5 rounded-2xl transition-all glow-green text-sm"
              >
                {t('ctaButton')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  )
}
