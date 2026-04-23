import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Mail, MapPin, Clock, Zap, MessageSquare } from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'
import ContactForm from '@/components/ContactForm'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'contact' })
  return { title: t('badge'), description: t('subtitle') }
}

export default function ContactPage() {
  const t = useTranslations('contact')

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: t('email'),
      sub: 'Respondemos en < 24 hrs',
      href: `mailto:${t('email')}`,
    },
    {
      icon: MapPin,
      title: 'Cobertura',
      value: t('location'),
      sub: 'Presencia regional',
      href: null,
    },
    {
      icon: Clock,
      title: 'Horario',
      value: 'Lun – Vie: 8am – 6pm',
      sub: 'Soporte 24/7 para clientes',
      href: null,
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      value: '+502 0000 0000',
      sub: 'Respuesta inmediata',
      href: 'https://wa.me/50200000000',
    },
  ]

  const faqs = [
    {
      q: '¿Cuánto tiempo tarda la instalación?',
      a: 'Una instalación residencial estándar se completa en 1 día. Proyectos comerciales o públicos varían entre 1 y 4 semanas según el alcance.',
    },
    {
      q: '¿Ofrecen financiamiento?',
      a: 'Trabajamos con aliados financieros para proyectos residenciales y comerciales. Contáctanos para conocer las opciones disponibles en tu país.',
    },
    {
      q: '¿Qué vehículos son compatibles?',
      a: 'Todos nuestros cargadores son compatibles con cualquier vehículo eléctrico o híbrido enchufable del mercado (Tesla, BMW, Audi, Hyundai, KIA, etc.).',
    },
    {
      q: '¿Qué pasa si el cargador tiene una falla?',
      a: 'Ofrecemos soporte técnico 24/7 y garantía del fabricante. En la mayoría de los casos resolvemos incidencias de forma remota o en menos de 48 horas.',
    },
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

      {/* Main content */}
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
            <div className="lg:col-span-2 space-y-6">
              <AnimateIn direction="right" delay={100}>
                <div className="mb-2">
                  <h2 className="font-display font-bold text-white text-2xl mb-1">{t('infoTitle')}</h2>
                </div>
              </AnimateIn>

              {contactInfo.map(({ icon: Icon, title, value, sub, href }, i) => (
                <AnimateIn key={title} direction="right" delay={150 + i * 80}>
                  <div className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-green-500/20 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                      <Icon className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-0.5">{title}</p>
                      {href ? (
                        <a href={href} className="text-white font-semibold hover:text-green-400 transition-colors">{value}</a>
                      ) : (
                        <p className="text-white font-semibold">{value}</p>
                      )}
                      <p className="text-white/30 text-xs mt-0.5">{sub}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}

              {/* Quick note */}
              <AnimateIn direction="right" delay={500}>
                <div className="glass rounded-2xl p-5 border-green-500/15">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-semibold">Respuesta rápida garantizada</span>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Nuestro equipo técnico revisa cada solicitud en detalle para ofrecerte la propuesta más ajustada a tu proyecto.
                  </p>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <div className="text-center mb-12">
            <AnimateIn><h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Preguntas frecuentes</h2></AnimateIn>
            <AnimateIn delay={100}><p className="text-white/40">Las respuestas a las dudas más comunes de nuestros clientes.</p></AnimateIn>
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
