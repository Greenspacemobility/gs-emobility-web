import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // Redirect stale URLs still indexed by Google → correct pages
      { source: '/consulting', destination: '/en/contact', permanent: true },
      { source: '/en/consulting', destination: '/en/contact', permanent: true },
      { source: '/es/consulting', destination: '/es/contact', permanent: true },
      { source: '/services-1', destination: '/en/contact', permanent: true },
      { source: '/en/services-1', destination: '/en/contact', permanent: true },
      { source: '/es/services-1', destination: '/es/contact', permanent: true },
      { source: '/plataforma', destination: '/es/platform', permanent: true },
      { source: '/es/plataforma', destination: '/es/platform', permanent: true },
      { source: '/en/plataforma', destination: '/en/platform', permanent: true },
    ]
  },
}

export default withNextIntl(nextConfig)
