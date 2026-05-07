import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { Mail, MapPin, Zap, MessageSquare, CheckCircle2, CalendarCheck } from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'
import ContactForm from '@/components/ContactForm'
import BookVisitForm from '@/components/BookVisitForm'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'contact' })
  return { title: t('badge'), description: t('subtitle') }
}

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('contact')
  const tb = useTranslations('bookVisit')

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'info@gs-emobility.com',
      sub: t('emailSub'),
      href: 'mailto:info@gs-emobility.com',
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp · Panama',
      value: '+507 6180 8504',
      sub: t('whatsappSub'),
      href: 'https://wa.me/50761808504',
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp · Mexico',
      value: '+52 1 81 2201 1785',
      sub: t('whatsappSub'),
      href: 'https://wa.me/5218122011785',
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp · USA',
      value: '+1 956 334 7819',
      sub: t('whatsappSub'),
      href: 'https://wa.me/19563347819',
    },
  ]

  const coverage = [
    { flag: '🇵🇦', label: t('coveragePanama') },
    { flag: '🇲🇽', label: t('coverageMonterrey') },
    { flag: '🇺🇸', label: t('coverageTexas') },
    { flag: '🇳🇴', label: t('coverageOslo') },
  ]

  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
  ]

  const promises = [
    tb('promise1'),
    tb('promise2'),
    tb('promise3'),
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-green-500/8 rounded-full blur-3xl" />
        <div className="container-wide relative z-10 text-center">
          <AnimateIn><Badge className="mb-6">{t('badge')}</Badge></AnimateIn>
          <AnimateIn delay={100}>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t('title')}
            </h1>
          </AnimateIn>
          <AnimateIn delay={200}>
            <p className="text-white/50 text-lg max-w-xl mx-auto">{t('subtitle')}</p>
          </AnimateIn>
        </div>
      </section>

      {/* General contact */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <AnimateIn direction="left">
                <ContactForm />
              </AnimateIn>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-5">
              <AnimateIn direction="right" delay={100}>
                <h2 className="font-display font-bold text-white text-2xl mb-1">{t('infoTitle')}</h2>
              </AnimateIn>

              {contactInfo.map(({ icon: Icon, title, value, sub, href }, i) => (
                <AnimateIn key={title} direction="right" delay={150 + i * 80}>
                  <div className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-green-500/20 transition-all group">
                    <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                      <Icon className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-0.5">{title}</p>
                      <a href={href!} className="text-white font-semibold hover:text-green-400 transition-colors text-sm">{value}</a>
                      <p className="text-white/30 text-xs mt-0.5">{sub}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}

              {/* Coverage */}
              <AnimateIn direction="right" delay={480}>
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <span className="text-white/40 text-xs uppercase tracking-widest font-semibold">{t('coverageTitle')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {coverage.map(({ flag, label }) => (
                      <div key={label} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                        <span className="text-base leading-none">{flag}</span>
                        <span className="text-white/70 text-xs font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateIn>

              {/* Quick note */}
              <AnimateIn direction="right" delay={560}>
                <div className="glass rounded-2xl p-5 border-green-500/15">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-semibold">{t('quickNoteTitle')}</span>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed">{t('quickNoteDesc')}</p>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* Book a Site Visit */}
      <section id="book-visit" className="section-padding">
        <div className="absolute inset-0 pointer-events-none" />
        <div className="container-wide">
          <div className="grid lg:grid-cols-5 gap-12 items-start">

            {/* Left: info */}
            <div className="lg:col-span-2">
              <AnimateIn direction="left">
                <Badge className="mb-5">{tb('sectionBadge')}</Badge>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 leading-snug">
                  {tb('sectionTitle')}
                </h2>
                <p className="text-white/50 text-sm leading-relaxed mb-8">
                  {tb('sectionSubtitle')}
                </p>
                <ul className="space-y-3">
                  {promises.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/65 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>

                {/* 24h badge */}
                <div className="mt-8 glass rounded-2xl p-5 border-green-500/20 inline-flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                    <CalendarCheck className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">24h</p>
                    <p className="text-white/40 text-xs leading-snug mt-0.5">{tb('promise2')}</p>
                  </div>
                </div>
              </AnimateIn>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-3">
              <AnimateIn direction="right" delay={100}>
                <BookVisitForm />
              </AnimateIn>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <div className="text-center mb-12">
            <AnimateIn><h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{t('faqTitle')}</h2></AnimateIn>
            <AnimateIn delay={100}><p className="text-white/40">{t('faqSubtitle')}</p></AnimateIn>
          </div>
          <div className="space-y-4">
            {faqs.map(({ q, a }, i) => (
              <AnimateIn key={i} delay={i * 80}>
                <div className="glass rounded-2xl p-6 hover:border-white/12 transition-all">
                  <h3 className="font-semibold text-white mb-3 flex items-start gap-3">
                    <span className="text-green-400 text-sm font-bold shrink-0 mt-0.5">0{i + 1}</span>
                    {q}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed pl-7">{a}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
