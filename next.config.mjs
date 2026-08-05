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
        // Restrict CORS on API routes — only the site's own origin may call them cross-origin
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://www.gs-emobility.com' },
          { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
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
          // Enforced CSP — blocks XSS, data injection, and clickjacking
          // 'unsafe-inline' required by Next.js inline scripts; 'unsafe-eval' required by some GTM tags
          // Turnstile widget served from challenges.cloudflare.com
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com https://cloudflareinsights.com https://challenges.cloudflare.com",
              "frame-src https://challenges.cloudflare.com",
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
      // Legacy Wix product & contact pages
      { source: '/cargadores-y-accesorios', destination: '/es/products', permanent: true },
      { source: '/es/cargadores-y-accesorios', destination: '/es/products', permanent: true },
      { source: '/en/cargadores-y-accesorios', destination: '/en/products', permanent: true },
      { source: '/contact-3', destination: '/es/contact', permanent: true },
      { source: '/es/contact-3', destination: '/es/contact', permanent: true },
      { source: '/en/contact-3', destination: '/en/contact', permanent: true },
      // Legacy Wix DC-charger & category pages (still indexed, currently 404)
      { source: '/dc-chargers/:slug', destination: '/en/products', permanent: true },
      { source: '/en/dc-chargers/:slug', destination: '/en/products', permanent: true },
      { source: '/es/dc-chargers/:slug', destination: '/es/products', permanent: true },
      { source: '/category/:slug', destination: '/en/products', permanent: true },
      { source: '/en/category/:slug', destination: '/en/products', permanent: true },
      { source: '/es/category/:slug', destination: '/es/products', permanent: true },
      { source: '/partners', destination: '/en/about', permanent: true },
      { source: '/en/partners', destination: '/en/about', permanent: true },
      { source: '/es/partners', destination: '/es/about', permanent: true },
    ]
  },
}

export default withNextIntl(nextConfig)
