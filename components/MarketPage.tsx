import Link from 'next/link'
import {
  ArrowRight, CheckCircle2, MapPin, Zap, Wrench, Settings,
  Sun, Truck, ClipboardCheck, Cpu,
} from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'
import { breadcrumbLd } from '@/lib/seo'
import { MARKETS, type MarketId } from '@/content/markets'

const SERVICE_ICONS = [ClipboardCheck, MapPin, Zap, Wrench, Cpu, Settings, Sun, Truck]

export default function MarketPage({ id, locale }: { id: MarketId; locale: string }) {
  const market = MARKETS.find(m => m.id === id)!
  const isEs = locale === 'es'
  const c = isEs ? market.copy.es : market.copy.en
  const country = isEs ? market.countryName.es : market.countryName.en

  /* FAQPage so the answers can be surfaced directly by search and AI systems,
     plus a Service entry that states where the service is actually offered. */
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: c.h1,
    serviceType: isEs ? 'Infraestructura de carga para vehículos eléctricos' : 'EV charging infrastructure',
    description: c.metaDesc,
    provider: {
      '@type': 'Organization',
      name: 'Greenspace E-mobility',
      url: 'https://www.gs-emobility.com',
    },
    areaServed: { '@type': 'Country', name: country, identifier: market.countryCode },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `https://www.gs-emobility.com/${locale}/contact`,
    },
  }

  const crumbs = breadcrumbLd(locale, [{ name: country, path: `/${market.slug}` }])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-green-500/8 rounded-full blur-3xl" />
        <div className="container-wide relative z-10">
          <AnimateIn>
            <Badge className="mb-6">{c.badge}</Badge>
          </AnimateIn>
          <AnimateIn delay={80}>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.08] max-w-4xl">
              {c.h1}
            </h1>
          </AnimateIn>
          <AnimateIn delay={160}>
            <p className="text-white/55 text-lg leading-relaxed max-w-3xl mb-10">{c.lead}</p>
          </AnimateIn>
          <AnimateIn delay={240}>
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-8 py-4 rounded-2xl transition-all glow-green text-base"
            >
              {c.ctaLabel}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-wide">
          <AnimateIn>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">{c.servicesTitle}</h2>
            <p className="text-white/40 max-w-2xl mb-12">{c.servicesLead}</p>
          </AnimateIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.services.map((s, i) => {
              const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length]
              return (
                <AnimateIn key={s.title} delay={i * 60}>
                  <div className="glass rounded-2xl p-6 h-full hover:border-green-500/25 transition-colors">
                    <Icon className="w-5 h-5 text-green-400 mb-4" />
                    <h3 className="font-display font-bold text-white text-base mb-2">{s.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </AnimateIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Proof ────────────────────────────────────────────────────── */}
      <section className="section-padding border-t border-white/[0.06]">
        <div className="container-wide">
          <AnimateIn>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">{c.proofTitle}</h2>
            <p className="text-white/40 max-w-2xl mb-12">{c.proofLead}</p>
          </AnimateIn>
          <div className="grid md:grid-cols-2 gap-6">
            {c.proof.map((p, i) => (
              <AnimateIn key={p.title} delay={i * 70}>
                <div className="glass rounded-2xl p-7 h-full hover:border-green-500/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-display font-bold text-white text-lg mb-2">{p.title}</h3>
                      <p className="text-white/45 text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hardware ─────────────────────────────────────────────────── */}
      <section className="section-padding border-t border-white/[0.06]">
        <div className="container-wide max-w-4xl">
          <AnimateIn>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{c.hardwareTitle}</h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8">{c.hardwareLead}</p>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold transition-colors"
            >
              {isEs ? 'Ver el catálogo completo' : 'See the full catalogue'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="section-padding border-t border-white/[0.06]">
        <div className="container-wide max-w-3xl">
          <AnimateIn>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-12">{c.faqTitle}</h2>
          </AnimateIn>
          <div className="space-y-5">
            {c.faq.map((f, i) => (
              <AnimateIn key={f.q} delay={i * 60}>
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-display font-bold text-white text-base mb-3">{f.q}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{f.a}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA + other markets ──────────────────────────────────────── */}
      <section className="section-padding border-t border-white/[0.06]">
        <div className="container-wide">
          <AnimateIn>
            <div className="glass rounded-3xl p-10 md:p-14 text-center border border-green-500/20">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{c.ctaTitle}</h2>
              <p className="text-white/45 max-w-2xl mx-auto mb-8">{c.ctaDesc}</p>
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-8 py-4 rounded-2xl transition-all glow-green"
              >
                {c.ctaLabel}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateIn>

          <AnimateIn delay={120}>
            <p className="text-center text-white/25 text-[10px] uppercase tracking-[0.2em] mt-16 mb-6">
              {isEs ? 'Otros mercados' : 'Other markets'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {MARKETS.filter(m => m.id !== id).map(m => (
                <Link
                  key={m.id}
                  href={`/${locale}/${m.slug}`}
                  className="inline-flex items-center gap-2 glass rounded-xl px-5 py-3 text-white/60 hover:text-white hover:border-green-500/25 text-sm transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-green-400" />
                  {isEs ? m.countryName.es : m.countryName.en}
                </Link>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  )
}
