import { getTranslations, setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'
import { MapPin, Zap, TrendingUp, Shield, CheckCircle2, ArrowRight } from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'
import SiteForm from '@/components/SiteForm'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'partnerSite' })
  return { title: t('metaTitle'), description: t('metaDesc') }
}

export default function PartnerSitePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const t = useTranslations('partnerSite')

  const benefits = [
    {
      icon: TrendingUp,
      title: t('benefit1Title'),
      desc: t('benefit1Desc'),
    },
    {
      icon: Zap,
      title: t('benefit2Title'),
      desc: t('benefit2Desc'),
    },
    {
      icon: Shield,
      title: t('benefit3Title'),
      desc: t('benefit3Desc'),
    },
    {
      icon: MapPin,
      title: t('benefit4Title'),
      desc: t('benefit4Desc'),
    },
  ]

  const criteria = [
    t('criteria1'),
    t('criteria2'),
    t('criteria3'),
    t('criteria4'),
    t('criteria5'),
    t('criteria6'),
  ]

  const steps = [
    { num: '01', title: t('step1Title'), desc: t('step1Desc') },
    { num: '02', title: t('step2Title'), desc: t('step2Desc') },
    { num: '03', title: t('step3Title'), desc: t('step3Desc') },
    { num: '04', title: t('step4Title'), desc: t('step4Desc') },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-green-500/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/6 rounded-full blur-3xl" />
        <div className="container-wide relative z-10 text-center">
          <AnimateIn>
            <Badge className="mb-6">{t('badge')}</Badge>
          </AnimateIn>
          <AnimateIn delay={100}>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto">
              {t('heroTitle')}
            </h1>
          </AnimateIn>
          <AnimateIn delay={200}>
            <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-wide">
          <AnimateIn className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              {t('benefitsTitle')}
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">{t('benefitsSubtitle')}</p>
          </AnimateIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(({ icon: Icon, title, desc }, i) => (
              <AnimateIn key={title} delay={i * 80}>
                <div className="glass rounded-2xl p-6 h-full hover:border-green-500/20 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="font-display font-bold text-white text-base mb-2">{title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* What we look for + How it works */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* What we look for */}
            <AnimateIn direction="left">
              <div>
                <Badge className="mb-5">{t('criteriaLabel')}</Badge>
                <h2 className="font-display text-3xl font-bold text-white mb-3">{t('criteriaTitle')}</h2>
                <p className="text-white/45 text-sm leading-relaxed mb-8">{t('criteriaSubtitle')}</p>
                <ul className="space-y-3">
                  {criteria.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/65 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>

            {/* How it works */}
            <AnimateIn direction="right" delay={100}>
              <div>
                <Badge className="mb-5">{t('howLabel')}</Badge>
                <h2 className="font-display text-3xl font-bold text-white mb-8">{t('howTitle')}</h2>
                <div className="space-y-6">
                  {steps.map(({ num, title, desc }) => (
                    <div key={num} className="flex gap-5">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                        <span className="text-green-400 font-bold text-xs">{num}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{title}</h4>
                        <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>

          </div>
        </div>
      </section>

      {/* Form */}
      <section id="submit" className="section-padding">
        <div className="container-wide max-w-5xl">
          <AnimateIn className="text-center mb-12">
            <Badge className="mb-5">{t('formBadge')}</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              {t('formTitle')}
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">{t('formSubtitle')}</p>
          </AnimateIn>
          <AnimateIn delay={100}>
            <SiteForm />
          </AnimateIn>
        </div>
      </section>
    </>
  )
}
