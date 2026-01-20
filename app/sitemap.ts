import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://davids-patisserie.co.il'
  const locales = ['fr', 'he']

  // Routes statiques
  const routes = ['', '/about', '/faq', '/contact', '/evenements', '/evenements/galerie', '/evenements/devis', '/boutique']

  // Générer pour chaque locale
  const staticPages = locales.flatMap(locale =>
    routes.map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  )

  return staticPages
}
