import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'hero' })
  const description = locale === 'es'
    ? 'Greenspace E-Mobility construye y opera infraestructura de carga eléctrica de alta potencia en Panamá, México, Texas y Noruega. Carga ultrarrápida, flotas eléctricas, autopista eléctrica y camiones Windrose.'
    : 'Greenspace E-Mobility builds and operates high-power EV charging infrastructure across Panama, Mexico, Texas and Norway. Ultra-fast charging hubs, fleet electrification, electric highway corridor, and Windrose electric trucks.'

  return {
    title: {
      default: 'Greenspace E-Mobility | EV Charging Infrastructure Americas',
      template: '%s | Greenspace E-Mobility',
    },
    description,
    keywords: [
      'EV charging Panama', 'electric vehicle charging Latin America',
      'fleet electrification Panama', 'electric highway Mexico Texas',
      'cross border EV corridor', 'Windrose electric truck',
      'Autel EV charger distributor', 'fast charging hub',
      'autopista eléctrica', 'carga eléctrica Panama',
      'electrificación flotas', 'infraestructura carga eléctrica',
      'EV charging Monterrey Dallas', 'electric truck charging corridor',
    ],
    authors: [{ name: 'Greenspace E-Mobility', url: 'https://www.gs-emobility.com' }],
    creator: 'Greenspace E-Mobility',
    publisher: 'Greenspace E-Mobility',
    alternates: {
      canonical: `https://www.gs-emobility.com/${locale}`,
      languages: {
        'en': 'https://www.gs-emobility.com/en',
        'es': 'https://www.gs-emobility.com/es',
      },
    },
    openGraph: {
      title: 'Greenspace E-Mobility | EV Charging Infrastructure Americas',
      description,
      url: `https://www.gs-emobility.com/${locale}`,
      siteName: 'Greenspace E-Mobility',
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://www.gs-emobility.com/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Greenspace E-Mobility - EV Charging Infrastructure',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Greenspace E-Mobility | EV Charging Infrastructure Americas',
      description,
      images: ['https://www.gs-emobility.com/images/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  }
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Greenspace E-Mobility',
  url: 'https://www.gs-emobility.com',
  logo: 'https://www.gs-emobility.com/favicon.png',
  description: 'Greenspace E-Mobility builds and operates high-power EV charging infrastructure across Panama, Mexico, Texas and Norway.',
  foundingDate: '2020',
  areaServed: ['Panama', 'Mexico', 'United States', 'Norway'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+507-6180-8504',
    contactType: 'sales',
    availableLanguage: ['English', 'Spanish'],
  },
  sameAs: [
    'https://www.linkedin.com/company/greenspace-emobility',
    'https://www.facebook.com/greenspaceemobility',
  ],
  address: [
    {
      '@type': 'PostalAddress',
      addressCountry: 'PA',
      addressRegion: 'Panama',
    },
    {
      '@type': 'PostalAddress',
      addressCountry: 'MX',
      addressRegion: 'Nuevo León',
    },
    {
      '@type': 'PostalAddress',
      addressCountry: 'US',
      addressRegion: 'Texas',
    },
  ],
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale as 'en' | 'es')) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
