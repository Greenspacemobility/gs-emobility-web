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
  '@id': 'https://www.gs-emobility.com/#organization',
  name: 'Greenspace E-Mobility',
  alternateName: ['Greenspace', 'GS E-Mobility', 'gs-emobility'],
  url: 'https://www.gs-emobility.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.gs-emobility.com/images/logo-white.png',
    width: 160,
    height: 44,
  },
  image: 'https://www.gs-emobility.com/images/og-image.jpg',
  description: 'Greenspace E-Mobility builds and operates high-power EV charging infrastructure across Panama, Mexico, Texas and Norway. Official distributor of Autel Energy EV chargers and exclusive distributor of Windrose Class 8 electric trucks in Latin America.',
  foundingDate: '2020',
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 20 },
  areaServed: ['Panama', 'Mexico', 'United States', 'Norway', 'Latin America'],
  knowsAbout: [
    'EV charging infrastructure',
    'Electric vehicle fleet management',
    'DC fast charging stations',
    'Electric trucks Class 8',
    'Smart charging management software',
    'Fleet electrification',
    'Mexico Texas electric highway corridor',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      email: 'info@gs-emobility.com',
      contactType: 'sales',
      availableLanguage: ['English', 'Spanish'],
      areaServed: ['Panama', 'Mexico', 'United States', 'Latin America'],
    },
  ],
  sameAs: [
    'https://www.linkedin.com/company/greenspace-emobility/',
    'https://www.instagram.com/greenspacemobility',
    'https://twitter.com/GEMOBILITY',
    'https://www.youtube.com/@greenspaceE-mobility',
  ],
  address: [
    { '@type': 'PostalAddress', addressCountry: 'PA', addressRegion: 'Panama City', addressLocality: 'Panama' },
    { '@type': 'PostalAddress', addressCountry: 'MX', addressRegion: 'Nuevo León', addressLocality: 'Monterrey' },
    { '@type': 'PostalAddress', addressCountry: 'US', addressRegion: 'Texas' },
    { '@type': 'PostalAddress', addressCountry: 'NO', addressRegion: 'Oslo' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'EV Charging & Electric Vehicle Products',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Autel MaxiCharger DC 360kW', description: 'Ultra-fast DC EV charger, 360 kW output' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Autel MaxiCharger DC 180kW', description: 'High-power DC EV charger, 180 kW output' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Autel MaxiCharger AC 22kW', description: 'Level 2 AC EV charger, 22 kW output' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Windrose Class 8 Electric Truck', description: 'Class 8 electric semi-truck, 500 km range, 422 kWh battery, exclusive Latin America distributor' } },
      { '@type': 'Offer', itemOffered: { '@type': 'SoftwareApplication', name: 'Greenspace Charging Management Platform', applicationCategory: 'BusinessApplication', description: 'OCPP-compatible smart EV charging network management software' } },
    ],
  },
}

// Individual LocalBusiness entries for each location (for local AI search)
const localBusinessSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.gs-emobility.com/#panama',
    name: 'Greenspace E-Mobility Panama',
    parentOrganization: { '@id': 'https://www.gs-emobility.com/#organization' },
    url: 'https://www.gs-emobility.com',
    email: 'info@gs-emobility.com',
    description: 'EV charging infrastructure installation and Autel Energy charger distribution in Panama.',
    address: { '@type': 'PostalAddress', addressCountry: 'PA', addressLocality: 'Panama City', addressRegion: 'Panama' },
    areaServed: { '@type': 'Country', name: 'Panama' },
    priceRange: '$$',
    openingHours: 'Mo-Fr 08:00-18:00',
    sameAs: ['https://www.gs-emobility.com/en'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.gs-emobility.com/#mexico',
    name: 'Greenspace E-Mobility Mexico',
    parentOrganization: { '@id': 'https://www.gs-emobility.com/#organization' },
    url: 'https://www.gs-emobility.com',
    email: 'info@gs-emobility.com',
    description: 'EV charging infrastructure, fleet electrification, and Windrose electric truck distribution in Monterrey, Mexico and the Mexico–Texas electric highway corridor.',
    address: { '@type': 'PostalAddress', addressCountry: 'MX', addressLocality: 'Monterrey', addressRegion: 'Nuevo León' },
    areaServed: [
      { '@type': 'State', name: 'Nuevo León' },
      { '@type': 'Country', name: 'Mexico' },
    ],
    priceRange: '$$',
    openingHours: 'Mo-Fr 08:00-18:00',
  },
]

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
        {localBusinessSchemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <link rel="me" href="https://www.linkedin.com/company/greenspace-emobility/" />
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
