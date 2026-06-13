import { MetadataRoute } from 'next'
import { ARTICLES } from '@/content/blog'

const baseUrl = 'https://www.gs-emobility.com'
const locales = ['en', 'es']

const pages = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/products', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/platform', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/electric-highway', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/projects', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/partner-site', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/faq', priority: 0.85, changeFrequency: 'weekly' as const },
  { path: '/blog', priority: 0.85, changeFrequency: 'weekly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const page of pages) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      })
    }
  }

  // Individual blog articles (both locales)
  for (const article of ARTICLES) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  return entries
}
