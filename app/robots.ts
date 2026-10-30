import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Cuestionarios privados por enlace: ya llevan noindex, pero tampoco
      // queremos que ningún rastreador los recorra.
      disallow: ['/es/cuestionario/', '/en/cuestionario/'],
    },
    sitemap: 'https://www.gs-emobility.com/sitemap.xml',
  }
}
