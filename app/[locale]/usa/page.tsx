import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import MarketPage from '@/components/MarketPage'
import { MARKETS } from '@/content/markets'
import { alternatesFor } from '@/lib/seo'

const MARKET = MARKETS.find(m => m.id === 'usa')!

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const c = locale === 'es' ? MARKET.copy.es : MARKET.copy.en
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: alternatesFor('/usa', locale),
    openGraph: { title: c.metaTitle, description: c.metaDesc },
  }
}

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  return <MarketPage id="usa" locale={locale} />
}
