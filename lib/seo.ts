const SITE = 'https://www.gs-emobility.com'

/**
 * Self-referential canonical + the full hreflang set (en, es, x-default).
 *
 * Every page MUST set this. Without it the page inherits the canonical from
 * app/[locale]/layout.tsx, which points at the locale root — telling Google
 * the page is a duplicate of the homepage and dropping it from the index.
 *
 *   alternatesFor('/products', locale)   →  /en/products  ·  /es/products
 *   alternatesFor('', locale)            →  /en           ·  /es
 */
export function alternatesFor(route: string, locale: string) {
  const path = !route ? '' : route.startsWith('/') ? route : `/${route}`
  return {
    canonical: `${SITE}/${locale}${path}`,
    languages: {
      en: `${SITE}/en${path}`,
      es: `${SITE}/es${path}`,
      'x-default': `${SITE}/en${path}`,
    },
  }
}

/** BreadcrumbList JSON-LD. Pass the trail after the site root. */
export function breadcrumbLd(
  locale: string,
  trail: { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Greenspace E-mobility', item: `${SITE}/${locale}` },
      ...trail.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: t.name,
        item: `${SITE}/${locale}${t.path}`,
      })),
    ],
  }
}
