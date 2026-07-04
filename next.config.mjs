import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Clickjacking protection
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // MIME-type sniffing protection
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Limit referrer information sent to third parties
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable unused browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          // Enforce HTTPS including subdomains — submitted to preload list
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // CSP in report-only mode — monitor before enforcing
          // Tighten after reviewing reports; remove -Report-Only to enforce
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com https://cloudflareinsights.com",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
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
