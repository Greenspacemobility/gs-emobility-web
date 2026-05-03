import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { MapPin, Users, Building2, Calendar, Star, ArrowRight } from 'lucide-react'
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

  const projects = [
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

  const upcoming = [
    { country: 'Mexico',  flag: '🇲🇽', sector: 'Electric Highway' },
    { country: 'USA',     flag: '🇺🇸', sector: 'Fleet Electrification' },
    { country: 'Europe',  flag: '🇪🇺', sector: 'Strategic Consulting' },
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

      {/* ── Panama projects ───────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-wide">

          {/* Country header */}
          <AnimateIn>
            <div className="flex items-center gap-4 mb-12">
              <span className="text-2xl">🇵🇦</span>
              <span className="font-display font-bold text-white text-xl">Panama</span>
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                2 Projects
              </span>
            </div>
          </AnimateIn>

          {/* Project cards */}
          <div className="space-y-8">
            {projects.map(({ key, video, poster, stats }, idx) => (
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
                        {/* Badge */}
                        <div className="flex items-center gap-3 mb-6">
                          <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full tracking-wide">
                            {t(`${key}Badge` as any)}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
                          {t(`${key}Title` as any)}
                        </h2>

                        {/* Description */}
                        <p className="text-white/55 leading-relaxed text-[0.95rem] mb-8">
                          {t(`${key}Desc` as any)}
                        </p>

                        {/* Stats */}
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
        </div>
      </section>

      {/* ── Coming soon ───────────────────────────────────────────────────── */}
      <section className="pb-24">
        <div className="container-wide">
          <AnimateIn>
            <div className="flex items-center gap-4 mb-10">
              <Badge>{t('comingSoonBadge')}</Badge>
              <div className="flex-1 h-px bg-white/8" />
            </div>
          </AnimateIn>

          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {upcoming.map(({ country, flag, sector }, i) => (
              <AnimateIn key={country} delay={i * 100}>
                <div className="glass rounded-2xl p-8 border-dashed border border-white/[0.06] flex flex-col items-center justify-center text-center min-h-[220px] hover:border-white/10 transition-colors">
                  <span className="text-4xl mb-4">{flag}</span>
                  <div className="font-display font-bold text-white/40 text-lg mb-1">{country}</div>
                  <div className="text-white/20 text-xs uppercase tracking-widest">{sector}</div>
                  <div className="mt-4 text-white/15 text-[10px] uppercase tracking-widest">Coming soon</div>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* CTA block */}
          <AnimateIn>
            <div className="glass rounded-3xl p-10 md:p-14 text-center max-w-2xl mx-auto">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                {t('comingSoonTitle')}
              </h3>
              <p className="text-white/40 leading-relaxed mb-8">
                {t('comingSoonDesc')}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-7 py-3.5 rounded-2xl transition-all glow-green text-sm"
              >
                Get in touch
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  )
}
