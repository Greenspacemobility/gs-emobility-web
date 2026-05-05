import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import {
  MapPin, Zap, BarChart3, CreditCard, Users, Wifi,
  Smartphone, Monitor, ArrowRight, CheckCircle2, Shield
} from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'platform' })
  return { title: t('metaTitle'), description: t('metaDesc') }
}

export default function PlatformPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('platform')

  const features = [
    { icon: MapPin,    title: t('feat1Title'), desc: t('feat1Desc') },
    { icon: Zap,       title: t('feat2Title'), desc: t('feat2Desc') },
    { icon: BarChart3, title: t('feat3Title'), desc: t('feat3Desc') },
    { icon: CreditCard,title: t('feat4Title'), desc: t('feat4Desc') },
    { icon: Users,     title: t('feat5Title'), desc: t('feat5Desc') },
    { icon: Shield,    title: t('feat6Title'), desc: t('feat6Desc') },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <Image src="/images/service-platform.jpg" alt="Greenspace Platform Dashboard" fill priority className="object-cover object-center" quality={80} />
        <div className="absolute inset-0 bg-navy-900/72" />
        <div className="absolute inset-0 bg-gradient-hero opacity-70" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="container-wide relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <AnimateIn>
                <Badge className="mb-6">{t('badge')}</Badge>
              </AnimateIn>
              <AnimateIn delay={100}>
                <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.05]">
                  {t('heroTitle')}
                </h1>
              </AnimateIn>
              <AnimateIn delay={200}>
                <p className="text-white/60 text-lg leading-relaxed mb-8">{t('heroSubtitle')}</p>
              </AnimateIn>
              <AnimateIn delay={300}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/${locale}/contact`}
                    className="group inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-7 py-3.5 rounded-xl transition-all glow-green-sm"
                  >
                    {t('heroCta')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="https://www.gs-emobility.com/en/plataforma"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 glass border border-white/10 hover:border-green-500/30 text-white font-semibold px-7 py-3.5 rounded-xl transition-all"
                  >
                    <Monitor className="w-4 h-4 text-green-400" />
                    {t('heroCtaAlt')}
                  </a>
                </div>
              </AnimateIn>
            </div>

            {/* App screenshots */}
            <AnimateIn direction="right" delay={200}>
              <div className="relative flex justify-center items-end gap-4 h-[520px]">
                {/* Map screen — taller, behind */}
                <div className="relative w-48 h-96 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 self-end mb-8 ring-1 ring-white/10">
                  <Image
                    src="/images/platform-app-map.png"
                    alt="GS E-Mobility app map"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                {/* Charging screen — slightly larger, front */}
                <div className="relative w-52 h-[440px] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 ring-2 ring-green-500/30 z-10">
                  <Image
                    src="/images/platform-app-charging.png"
                    alt="GS E-Mobility app charging"
                    fill
                    className="object-cover object-top"
                  />
                  {/* Green glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent" />
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Admin dashboard */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimateIn direction="left">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10">
                <Image
                  src="/images/platform-dashboard.png"
                  alt="GS E-Mobility admin dashboard"
                  width={900}
                  height={600}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/30 to-transparent pointer-events-none" />
              </div>
            </AnimateIn>

            <div>
              <AnimateIn direction="right">
                <Badge className="mb-6">{t('dashboardBadge')}</Badge>
              </AnimateIn>
              <AnimateIn direction="right" delay={100}>
                <h2 className="font-display text-4xl font-bold text-white mb-6 leading-tight">
                  {t('dashboardTitle')}
                </h2>
              </AnimateIn>
              <AnimateIn direction="right" delay={200}>
                <p className="text-white/55 leading-relaxed mb-8">{t('dashboardDesc')}</p>
              </AnimateIn>
              <AnimateIn direction="right" delay={300}>
                <ul className="space-y-3">
                  {[t('dash1'), t('dash2'), t('dash3'), t('dash4')].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/70 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile app section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-navy-800/30" />
        <div className="container-wide relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <AnimateIn>
                <Badge className="mb-6">{t('appBadge')}</Badge>
              </AnimateIn>
              <AnimateIn delay={100}>
                <h2 className="font-display text-4xl font-bold text-white mb-6 leading-tight">
                  {t('appTitle')}
                </h2>
              </AnimateIn>
              <AnimateIn delay={200}>
                <p className="text-white/55 leading-relaxed mb-8">{t('appDesc')}</p>
              </AnimateIn>
              <AnimateIn delay={300}>
                <ul className="space-y-3 mb-8">
                  {[t('app1'), t('app2'), t('app3'), t('app4')].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/70 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </AnimateIn>
              <AnimateIn delay={400}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 glass rounded-xl px-4 py-3 border border-white/10">
                    <Smartphone className="w-5 h-5 text-green-400" />
                    <span className="text-white text-sm font-medium">iOS & Android</span>
                  </div>
                  <div className="flex items-center gap-2 glass rounded-xl px-4 py-3 border border-white/10">
                    <Wifi className="w-5 h-5 text-green-400" />
                    <span className="text-white text-sm font-medium">OCPP 1.6 / 2.0</span>
                  </div>
                </div>
              </AnimateIn>
            </div>

            <AnimateIn direction="right" delay={150}>
              <div className="relative flex justify-center">
                <div className="relative w-56 h-[480px] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 ring-2 ring-white/10">
                  <Image
                    src="/images/platform-app-map.png"
                    alt="GS E-Mobility app"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                {/* Floating stat card */}
                <div className="absolute -right-4 top-16 glass rounded-2xl p-4 border border-green-500/20 shadow-xl max-w-[160px]">
                  <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-1">{t('statLabel')}</p>
                  <p className="text-white font-display font-bold text-2xl">100%</p>
                  <p className="text-white/50 text-xs">{t('statDesc')}</p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <AnimateIn><Badge className="mb-6">{t('featBadge')}</Badge></AnimateIn>
            <AnimateIn delay={100}>
              <h2 className="font-display text-4xl font-bold text-white mb-4">{t('featTitle')}</h2>
            </AnimateIn>
            <AnimateIn delay={200}>
              <p className="text-white/40 max-w-xl mx-auto">{t('featSubtitle')}</p>
            </AnimateIn>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <AnimateIn key={title} delay={i * 80}>
                <div className="glass rounded-2xl p-7 group hover:border-green-500/25 transition-all h-full">
                  <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center mb-5 group-hover:bg-green-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="font-display font-bold text-white mb-2">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <AnimateIn>
            <div className="glass rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/8 via-transparent to-navy-700/20" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
              <div className="relative z-10">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{t('ctaTitle')}</h2>
                <p className="text-white/50 max-w-lg mx-auto mb-8">{t('ctaDesc')}</p>
                <Link
                  href={`/${locale}/contact`}
                  className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-8 py-4 rounded-2xl transition-all glow-green"
                >
                  {t('ctaButton')}
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
