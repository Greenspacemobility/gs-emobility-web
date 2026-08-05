import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock } from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import Badge from '@/components/Badge'
import { getArticlesSorted } from '@/content/blog'
import { alternatesFor } from '@/lib/seo'

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEs = locale === 'es'
  const title = isEs
    ? 'Blog | Carga EV, Camiones Eléctricos y Movilidad Sostenible'
    : 'Blog | EV Charging, Electric Trucks & Sustainable Mobility'
  const description = isEs
    ? 'Perspectivas sobre infraestructura de carga EV, camiones eléctricos Clase 8, electrificación de flotas y la autopista eléctrica en Panamá, México, Texas y Noruega.'
    : 'Insights on EV charging infrastructure, Class 8 electric trucks, fleet electrification, and the electric highway across Panama, Mexico, Texas and Norway.'

  return {
    title,
    description,
    keywords: [
      'EV charging blog', 'electric truck insights', 'fleet electrification Mexico',
      'EV charging Panama', 'electric highway corridor', 'sustainable mobility Latin America',
    ],
    alternates: alternatesFor('/blog', locale),
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogIndex({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const isEs = locale === 'es'
  const articles = getArticlesSorted()

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(isEs ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  // ItemList JSON-LD for the blog index
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: isEs ? 'Blog de Greenspace E-mobility' : 'Greenspace E-mobility Blog',
    url: `https://www.gs-emobility.com/${locale}/blog`,
    blogPost: articles.map((a) => {
      const c = isEs ? a.es : a.en
      return {
        '@type': 'BlogPosting',
        headline: c.title,
        datePublished: a.date,
        url: `https://www.gs-emobility.com/${locale}/blog/${a.slug}`,
      }
    }),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-900/80" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="container-wide relative z-10 text-center">
          <AnimateIn>
            <Badge className="mb-6">{isEs ? 'Blog' : 'Insights'}</Badge>
          </AnimateIn>
          <AnimateIn delay={100}>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl mx-auto">
              {isEs ? 'Perspectivas de e-movilidad' : 'E-mobility insights'}
            </h1>
          </AnimateIn>
          <AnimateIn delay={200}>
            <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
              {isEs
                ? 'Análisis sobre carga EV, camiones eléctricos, electrificación de flotas y los corredores que conectan a las Américas.'
                : 'Analysis on EV charging, electric trucks, fleet electrification, and the corridors connecting the Americas.'}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Articles grid */}
      <section className="section-padding">
        <div className="container-wide max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((a, i) => {
              const c = isEs ? a.es : a.en
              return (
                <AnimateIn key={a.slug} delay={i * 100}>
                  <Link
                    href={`/${locale}/blog/${a.slug}`}
                    className="group block glass rounded-3xl overflow-hidden border border-white/5 hover:border-green-500/30 transition-all duration-300 h-full"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={a.heroImage}
                        alt={c.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                      <span className="absolute top-4 left-4 bg-green-500/90 text-navy-900 text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        {c.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-white/40 text-xs mb-3">
                        <span>{formatDate(a.date)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {c.readingTime}
                        </span>
                      </div>
                      <h2 className="font-display text-lg font-bold text-white leading-snug mb-3 group-hover:text-green-400 transition-colors">
                        {c.title}
                      </h2>
                      <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-3">{c.excerpt}</p>
                      <span className="inline-flex items-center gap-1.5 text-green-400 text-sm font-semibold">
                        {isEs ? 'Leer más' : 'Read more'}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </AnimateIn>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
