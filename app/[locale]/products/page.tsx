import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Zap, ArrowRight, CheckCircle2, Home, Building2, Car, Sun } from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'products' })
  return { title: t('badge'), description: t('subtitle') }
}

export default function ProductsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = useTranslations('products')

  const wallboxProducts = [
    {
      key: 'pulsar',
      badge: t('ac'),
      color: 'from-blue-500/20 to-navy-700',
      features: ['Monitoreo por app', 'Carga programada', 'Compatible con solar', 'Protección IP54'],
    },
    {
      key: 'commander2',
      badge: t('ac'),
      color: 'from-purple-500/20 to-navy-700',
      features: ['Pantalla táctil 7"', 'Autenticación RFID', 'OCPP 1.6', 'Gestión de energía'],
      highlight: true,
    },
    {
      key: 'hypernova',
      badge: t('dc'),
      color: 'from-green-500/20 to-navy-700',
      features: ['Carga ultrarrápida', 'Multi-estándar', 'Pantalla dinámica', 'Liquid cooled'],
    },
    {
      key: 'neo',
      badge: t('ac'),
      color: 'from-orange-500/20 to-navy-700',
      features: ['Diseño premium', 'Power sharing', 'Solar ready', 'Control remoto'],
    },
  ] satisfies { key: string; badge: string; color: string; features: readonly string[]; highlight?: boolean }[]

  const useCases = [
    { icon: Home,      title: 'Residencial',   desc: 'Cargadores inteligentes para el hogar. Instala en tu garaje y carga durante la noche con tarifas reducidas.' },
    { icon: Building2, title: 'Corporativo',   desc: 'Soluciones para flotas empresariales, parking de empleados y centros de distribución.' },
    { icon: Car,       title: 'Concesionarios', desc: 'Infraestructura de demostración y entrega para concesionarios de vehículos eléctricos.' },
    { icon: Sun,       title: 'Solar + EV',    desc: 'Integra tu instalación fotovoltaica con la carga de tu vehículo para autonomía energética total.' },
  ]

  const includes = [
    'Asesoría técnica personalizada',
    'Instalación certificada',
    'Garantía del fabricante',
    'Soporte técnico 24/7',
    'Acceso a plataforma de gestión',
    'Mantenimiento preventivo',
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-900/80" />
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

      {/* Wallbox products */}
      <section id="products" className="section-padding">
        <div className="container-wide">
          <div className="flex items-center gap-4 mb-4">
            <AnimateIn direction="left">
              <h2 className="font-display text-3xl font-bold text-white">{t('wallboxTitle')}</h2>
            </AnimateIn>
          </div>
          <AnimateIn>
            <p className="text-white/40 mb-12">{t('wallboxDesc')}</p>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {wallboxProducts.map(({ key, badge, color, features, highlight }, i) => (
              <AnimateIn key={key} delay={i * 100}>
                <div className={`relative glass rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:scale-[1.02] ${
                  highlight ? 'border-green-500/40 glow-green-sm' : 'hover:border-white/15'
                }`}>
                  {highlight && (
                    <div className="absolute top-4 right-4 text-[10px] font-bold text-navy-900 bg-green-400 px-2 py-1 rounded-full uppercase tracking-wider z-10">
                      Popular
                    </div>
                  )}
                  {/* Product visual */}
                  <div className={`h-48 bg-gradient-to-br ${color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-30"
                      style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 60%)' }}
                    />
                    <div className="w-20 h-32 rounded-2xl glass flex items-center justify-center border border-white/10">
                      <Zap className="w-8 h-8 text-green-400" />
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full w-fit mb-3">{badge}</span>
                    <h3 className="font-display font-bold text-white text-xl mb-1">{t(`${key}.name` as any)}</h3>
                    <p className="font-semibold text-green-400 text-sm mb-3">{t(`${key}.power` as any)} · {t(`${key}.type` as any)}</p>
                    <p className="text-white/50 text-sm leading-relaxed mb-5 flex-1">{t(`${key}.desc` as any)}</p>

                    <ul className="space-y-2 mb-6">
                      {features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-white/60">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/contact"
                      className="w-full text-center bg-green-500/10 hover:bg-green-500 border border-green-500/20 hover:border-green-500 text-green-400 hover:text-navy-900 font-semibold text-sm py-3 rounded-xl transition-all duration-200"
                    >
                      {t('requestQuote')}
                    </Link>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="residential" className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <AnimateIn><h2 className="font-display text-4xl font-bold text-white mb-4">Soluciones por sector</h2></AnimateIn>
            <AnimateIn delay={100}><p className="text-white/40 max-w-xl mx-auto">Diseñamos la solución ideal según el tipo de instalación y el volumen de carga requerido.</p></AnimateIn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map(({ icon: Icon, title, desc }, i) => (
              <AnimateIn key={title} delay={i * 100}>
                <div id={title.toLowerCase()} className="glass rounded-2xl p-8 flex gap-6 hover:border-green-500/25 transition-all group h-full">
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
                    <Badge className="mb-6">Servicio completo</Badge>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                      Todo incluido en cada proyecto
                    </h2>
                    <p className="text-white/50 leading-relaxed mb-8">
                      No vendemos solo hardware. Entregamos soluciones completas con instalación, soporte y plataforma de gestión incluidos.
                    </p>
                    <Link
                      href="/contact"
                      className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-7 py-3.5 rounded-xl transition-all glow-green-sm"
                    >
                      Solicitar cotización
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
