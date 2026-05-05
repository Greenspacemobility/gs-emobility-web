import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Zap, ArrowRight, CheckCircle2, Home, Building2, Car, Sun, Battery, BatteryCharging, Monitor } from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'products' })
  return { title: t('badge'), description: t('subtitle') }
}

export default function ProductsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('products')

  const brands = [
    {
      name: 'Autel Energy',
      color: 'from-blue-500/20 to-navy-700',
      accentColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      initials: 'AE',
      lines: [
        { icon: Zap,            label: t('ac'),       desc: t('autelAc') },
        { icon: BatteryCharging, label: t('dc'),       desc: t('autelDc') },
        { icon: Battery,         label: t('storage'),  desc: t('autelStorage') },
      ],
    },
    {
      name: 'Sinexcel',
      color: 'from-green-500/20 to-navy-700',
      accentColor: 'text-green-400',
      borderColor: 'border-green-500/40',
      initials: 'SX',
      highlight: true,
      lines: [
        { icon: BatteryCharging, label: t('dc'),       desc: t('sinexcelDc') },
        { icon: Battery,         label: t('storage'),  desc: t('sinexcelStorage') },
      ],
    },
    {
      name: 'Gresgying',
      color: 'from-purple-500/20 to-navy-700',
      accentColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      initials: 'GG',
      lines: [
        { icon: Zap,            label: t('ac'),       desc: t('gresgyingAc') },
        { icon: BatteryCharging, label: t('dc'),       desc: t('gresgyingDc') },
        { icon: Battery,         label: t('storage'),  desc: t('gresgyingStorage') },
      ],
    },
  ]

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
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <Image src="/images/service-chargers.jpg" alt="EV Charging Infrastructure" fill priority className="object-cover object-center" quality={80} />
        <div className="absolute inset-0 bg-navy-900/72" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/60 via-transparent to-navy-900/80" />
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

      {/* Brand cards */}
      <section id="products" className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {brands.map(({ name, color, accentColor, borderColor, initials, highlight, lines }, i) => (
              <AnimateIn key={name} delay={i * 100}>
                <div className={`relative glass rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:scale-[1.01] ${
                  highlight ? `${borderColor} glow-green-sm` : 'hover:border-white/15'
                }`}>
                  {highlight && (
                    <div className="absolute top-4 right-4 text-[10px] font-bold text-navy-900 bg-green-400 px-2 py-1 rounded-full uppercase tracking-wider z-10">
                      {t('featured')}
                    </div>
                  )}

                  {/* Brand header */}
                  <div className={`h-40 bg-gradient-to-br ${color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20"
                      style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)' }}
                    />
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center border border-white/10 mx-auto mb-3">
                        <span className={`font-display font-bold text-lg ${accentColor}`}>{initials}</span>
                      </div>
                      <h3 className="font-display font-bold text-white text-xl">{name}</h3>
                    </div>
                  </div>

                  {/* Product lines */}
                  <div className="p-6 flex flex-col flex-1 gap-4">
                    {lines.map(({ icon: Icon, label, desc }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className={`w-4 h-4 ${accentColor}`} />
                        </div>
                        <div>
                          <span className={`text-xs font-bold uppercase tracking-widest ${accentColor}`}>{label}</span>
                          <p className="text-white/55 text-sm leading-relaxed mt-0.5">{desc}</p>
                        </div>
                      </div>
                    ))}

                    <div className="mt-auto pt-4">
                      <Link
                        href={`/${locale}/contact`}
                        className="w-full text-center bg-green-500/10 hover:bg-green-500 border border-green-500/20 hover:border-green-500 text-green-400 hover:text-navy-900 font-semibold text-sm py-3 rounded-xl transition-all duration-200 block"
                      >
                        {t('requestQuote')}
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

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
