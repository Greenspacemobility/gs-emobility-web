import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import { ARTICLES, getArticle, getArticlesSorted } from '@/content/blog'

// Pre-render every article in both locales at build time
export function generateStaticParams() {
  return ARTICLES.flatMap((a) => [
    { locale: 'en', slug: a.slug },
    { locale: 'es', slug: a.slug },
  ])
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string }
}): Promise<Metadata> {
  const article = getArticle(slug)
  if (!article) return {}
  const c = locale === 'es' ? article.es : article.en

  return {
    title: `${c.title} | Greenspace E-mobility`,
    description: c.metaDescription,
    keywords: article.keywords,
    alternates: {
      canonical: `https://www.gs-emobility.com/${locale}/blog/${slug}`,
      languages: {
        en: `https://www.gs-emobility.com/en/blog/${slug}`,
        es: `https://www.gs-emobility.com/es/blog/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      title: c.title,
      description: c.metaDescription,
      url: `https://www.gs-emobility.com/${locale}/blog/${slug}`,
      images: [{ url: `https://www.gs-emobility.com${article.heroImage}` }],
      publishedTime: article.date,
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ArticlePage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string }
}) {
  setRequestLocale(locale)
  const article = getArticle(slug)
  if (!article) notFound()

  const isEs = locale === 'es'
  const c = isEs ? article.es : article.en

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(isEs ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  // Up to two related articles (most recent others)
  const related = getArticlesSorted().filter((a) => a.slug !== slug).slice(0, 2)

  // Article JSON-LD
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: c.title,
    description: c.metaDescription,
    image: `https://www.gs-emobility.com${article.heroImage}`,
    datePublished: article.date,
    dateModified: article.date,
    author: { '@type': 'Organization', name: 'Greenspace E-mobility' },
    publisher: {
      '@type': 'Organization',
      name: 'Greenspace E-mobility',
      logo: { '@type': 'ImageObject', url: 'https://www.gs-emobility.com/images/logo-white.png' },
    },
    mainEntityOfPage: `https://www.gs-emobility.com/${locale}/blog/${slug}`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative pt-32 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-900/80" />
        <div className="container-wide relative z-10 max-w-3xl mx-auto">
          <AnimateIn>
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-1.5 text-white/40 hover:text-green-400 text-sm font-medium mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {isEs ? 'Volver al blog' : 'Back to blog'}
            </Link>
          </AnimateIn>
          <AnimateIn delay={100}>
            <span className="inline-block bg-green-500/10 text-green-400 text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-green-500/20 mb-5">
              {c.category}
            </span>
          </AnimateIn>
          <AnimateIn delay={150}>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-5">
              {c.title}
            </h1>
          </AnimateIn>
          <AnimateIn delay={200}>
            <div className="flex items-center gap-4 text-white/40 text-sm">
              <span>{formatDate(article.date)}</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {c.readingTime}
              </span>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Hero image */}
      <section className="container-wide max-w-3xl mx-auto">
        <AnimateIn>
          <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden border border-white/5">
            <Image src={article.heroImage} alt={c.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
          </div>
        </AnimateIn>
      </section>

      {/* Body */}
      <section className="section-padding pt-12">
        <div className="container-wide max-w-3xl mx-auto">
          <AnimateIn>
            <div className="article-prose" dangerouslySetInnerHTML={{ __html: c.body }} />
          </AnimateIn>

          {/* References */}
          <AnimateIn>
            <div className="mt-12 glass rounded-2xl p-6 border border-white/5">
              <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">
                {isEs ? 'Referencias' : 'References'}
              </p>
              <ol className="space-y-2">
                {c.references.map((r, i) => (
                  <li key={i} className="text-sm text-white/50 leading-relaxed">
                    <span className="text-white/30">[{i + 1}]</span>{' '}
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-green-400 transition-colors">
                      {r.title}
                    </a>{' '}
                    <span className="text-white/30">— {r.publisher}, {r.year}</span>
                  </li>
                ))}
              </ol>
            </div>
          </AnimateIn>

          {/* CTA */}
          <AnimateIn>
            <div className="mt-10 glass rounded-3xl p-10 text-center border border-green-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent" />
              <div className="relative z-10">
                <p className="text-white font-semibold text-lg mb-2">
                  {isEs ? '¿Listo para electrificar?' : 'Ready to electrify?'}
                </p>
                <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
                  {isEs
                    ? 'Nuestro equipo diseña, instala y opera infraestructura de carga en Panamá, México y Texas.'
                    : 'Our team designs, installs and operates charging infrastructure across Panama, Mexico and Texas.'}
                </p>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-navy-900 font-semibold px-7 py-3.5 rounded-xl transition-all glow-green-sm"
                >
                  {isEs ? 'Contáctanos' : 'Contact Us'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </AnimateIn>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-xl font-bold text-white mb-6">
                {isEs ? 'Sigue leyendo' : 'Keep reading'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((a) => {
                  const rc = isEs ? a.es : a.en
                  return (
                    <Link
                      key={a.slug}
                      href={`/${locale}/blog/${a.slug}`}
                      className="group flex gap-4 glass rounded-2xl p-4 border border-white/5 hover:border-green-500/30 transition-all"
                    >
                      <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                        <Image src={a.heroImage} alt={rc.title} fill className="object-cover" sizes="80px" />
                      </div>
                      <div>
                        <p className="text-green-400 text-[0.6rem] font-bold uppercase tracking-widest mb-1">{rc.category}</p>
                        <p className="text-white text-sm font-semibold leading-snug group-hover:text-green-400 transition-colors line-clamp-3">
                          {rc.title}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
