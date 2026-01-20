import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/admin' }
    ],
    sitemap: 'https://davids-patisserie.co.il/sitemap.xml',
  }
}
