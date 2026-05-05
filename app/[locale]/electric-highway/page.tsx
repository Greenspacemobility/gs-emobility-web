import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Zap, MapPin, Wifi, Coffee, ShoppingBag,
  ArrowRight, CheckCircle2, BatteryCharging, Route, BarChart3, Sun, Truck
} from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'
import CountUp from '@/components/CountUp'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'highway' })
  return { title: t('badge'), description: t('subtitle') }
}

export default function ElectricHighwayPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t  = useTranslations('highway')
  const th = useTranslations('hub')

  const networkStats = [
    { value: 5,  suffix: '',              label: t('stat1Label') },
    { value: 15, suffix: t('stat2Suffix'), label: t('stat2Label') },
    { value: 99, suffix: t('stat3Suffix'), label: t('stat3Label') },
    { value: 20, suffix: t('stat4Suffix'), label: t('stat4Label') },
  ]

  const highwayFeatures = [
    { icon: Route,           title: t('feature1Title'), desc: t('feature1Desc') },
    { icon: Zap,             title: t('feature2Title'), desc: t('feature2Desc') },
    { icon: BatteryCharging, title: t('feature3Title'), desc: t('feature3Desc') },
    { icon: Truck,           title: t('feature4Title'), desc: t('feature4Desc') },
  ]

  const hubServices = [
    { icon: Zap,         title: t('hub1Title'), desc: t('hub1Desc') },
    { icon: Sun,         title: t('hub2Title'), desc: t('hub2Desc') },
    { icon: Coffee,      title: t('hub3Title'), desc: t('hub3Desc') },
    { icon: ShoppingBag, title: t('hub4Title'), desc: t('hub4Desc') },
    { icon: BarChart3,   title: t('hub5Title'), desc: t('hub5Desc') },
    { icon: Wifi,        title: t('hub6Title'), desc: t('hub6Desc') },
  ]

  const timeline = [
    { phase: t('phase1Name'), year: t('phase1Year'), title: t('phase1Title'), desc: t('phase1Desc'), status: 'active'   },
    { phase: t('phase2Name'), year: t('phase2Year'), title: t('phase2Title'), desc: t('phase2Desc'), status: 'building' },
    { phase: t('phase3Name'), year: t('phase3Year'), title: t('phase3Title'), desc: t('phase3Desc'), status: 'planned'  },
    { phase: t('phase4Name'), year: t('phase4Year'), title: t('phase4Title'), desc: t('phase4Desc'), status: 'planned'  },
    { phase: t('phase5Name'), year: t('phase5Year'), title: t('phase5Title'), desc: t('phase5Desc'), status: 'future'   },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, rgba(0,200,83,0.5) 0px, rgba(0,200,83,0.5) 2px, transparent 2px, transparent 60px)`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
        <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/10 to-transparent" />
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-green-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-24 w-72 h-72 bg-navy-500/20 rounded-full blur-3xl" />

        <div className="container-wide relative z-10 text-center py-24">
          <AnimateIn>
            <Badge className="mb-8">{t('badge')}</Badge>
          </AnimateIn>
          <AnimateIn delay={100}>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.05] max-w-4xl mx-auto">
              {t('title')}
            </h1>
          </AnimateIn>
          <AnimateIn delay={200}>
            <p className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed mb-12">
              {t('subtitle')}
            </p>
          </AnimateIn>
          <AnimateIn delay={300}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-8 py-4 rounded-2xl transition-all glow-green text-base"
            >
              {t('cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* Corridor context strip */}
      <section className="py-14 border-b border-white/[0.06]">
        <div className="container-wide">
          <AnimateIn>
            <p className="text-center text-white/25 text-[10px] uppercase tracking-[0.2em] mb-10">
              {t('corridorEyebrow')}
            </p>
          </AnimateIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { val: t('corridorStat1Val'), label: t('corridorStat1Label') },
              { val: t('corridorStat2Val'), label: t('corridorStat2Label') },
              { val: t('corridorStat3Val'), label: t('corridorStat3Label') },
              { val: t('corridorStat4Val'), label: t('corridorStat4Label') },
            ].map((s, i) => (
              <AnimateIn key={i} delay={i * 80}>
                <div className="text-center">
                  <div className="font-display text-4xl md:text-5xl font-bold text-gradient mb-2"
                       style={{ letterSpacing: '-0.03em' }}>
                    {s.val}
                  </div>
                  <div className="text-white/40 text-xs leading-snug max-w-[140px] mx-auto">{s.label}</div>
                </div>
              </AnimateIn>
            ))}
          </div>
          <AnimateIn delay={300}>
            <p className="text-center text-white/20 text-[10px] max-w-xl mx-auto leading-relaxed">
              {t('corridorNote')}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Project stats */}
      <section className="py-16">
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {networkStats.map((s, i) => (
              <AnimateIn key={i} delay={i * 100}>
                <div className="glass rounded-2xl p-6 text-center hover:border-green-500/20 transition-colors">
                  <div className="font-display text-4xl font-bold text-gradient mb-2">
                    <CountUp end={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-white/50 text-sm">{s.label}</div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Highway Features */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <AnimateIn>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">{t('featuresTitle')}</h2>
            </AnimateIn>
            <AnimateIn delay={100}>
              <p className="text-white/40 max-w-xl mx-auto">{t('featuresSubtitle')}</p>
            </AnimateIn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {highwayFeatures.map(({ icon: Icon, title, desc }, i) => (
              <AnimateIn key={i} delay={i * 100}>
                <div className="glass rounded-2xl p-8 hover:border-green-500/25 transition-all group h-full">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                      <Icon className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-white text-xl mb-3">{title}</h3>
                      <p className="text-white/50 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Electric Hub section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent" />
        <div className="container-wide relative z-10">
          <div className="text-center mb-16">
            <AnimateIn><Badge className="mb-6">{th('badge')}</Badge></AnimateIn>
            <AnimateIn delay={100}>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
                {th('title')}
              </h2>
            </AnimateIn>
            <AnimateIn delay={200}>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">{th('subtitle')}</p>
            </AnimateIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {hubServices.map(({ icon: Icon, title, desc }, i) => (
              <AnimateIn key={i} delay={i * 80}>
                <div className="glass rounded-2xl p-6 hover:border-green-500/25 hover:bg-white/[0.04] transition-all group h-full">
                  <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="font-display font-bold text-white mb-2">{title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Hub checklist */}
          <AnimateIn>
            <div className="glass rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-4">
                {[th('point1'), th('point2'), th('point3'), th('point4')].map((point, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    <span className="text-white/80">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Roadmap / Timeline */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <AnimateIn>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">{t('roadmapTitle')}</h2>
            </AnimateIn>
            <AnimateIn delay={100}>
              <p className="text-white/40 max-w-xl mx-auto">{t('roadmapSubtitle')}</p>
            </AnimateIn>
          </div>
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-green-500/50 via-green-500/20 to-transparent" />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <AnimateIn key={i} delay={i * 150} direction={i % 2 === 0 ? 'left' : 'right'}>
                  <div className={`flex gap-8 items-start ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} hidden md:block`} />
                    <div className="relative flex items-center justify-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                        item.status === 'active'   ? 'bg-green-500 glow-green' :
                        item.status === 'building' ? 'bg-navy-600 border-2 border-green-500/50' :
                        item.status === 'future'   ? 'bg-navy-600 border-2 border-sky-400/50' :
                        'glass border border-white/10'
                      }`}>
                        <Zap className={`w-5 h-5 ${item.status === 'active' ? 'text-navy-900' : item.status === 'future' ? 'text-sky-400/60' : 'text-white/40'}`} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="glass rounded-2xl p-6 hover:border-green-500/20 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            item.status === 'future'
                              ? 'text-sky-400 bg-sky-400/10'
                              : 'text-green-400 bg-green-500/10'
                          }`}>
                            {item.phase} · {item.year}
                          </span>
                          {item.status === 'active' && (
                            <span className="text-xs text-green-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                              {t('statusActive')}
                            </span>
                          )}
                          {item.status === 'building' && (
                            <span className="text-xs text-yellow-400/80">{t('statusBuilding')}</span>
                          )}
                          {item.status === 'planned' && (
                            <span className="text-xs text-white/30">{t('statusPlanned')}</span>
                          )}
                          {item.status === 'future' && (
                            <span className="text-xs text-sky-400/60">{t('statusFuture')}</span>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-white text-xl mb-2">{item.title}</h3>
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
                <Badge className="mb-6">{t('ctaBadge')}</Badge>
                <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                  {t('ctaJoinTitle')}
                </h2>
                <p className="text-white/50 max-w-lg mx-auto mb-8">
                  {t('ctaJoinDesc')}
                </p>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-8 py-4 rounded-2xl transition-all glow-green"
                >
                  {t('ctaJoinButton')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  )
}
