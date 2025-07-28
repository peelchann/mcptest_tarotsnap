import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Force main Vercel alias for production to ensure consistent URLs
  // VERCEL_URL points to deployment-specific URLs which cause sitemap issues
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://tarot-snap.vercel.app'  // Always use main alias in production
    : 'http://localhost:3000'

  // Enhanced static routes with correct URLs
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reading/single`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  return routes
} 