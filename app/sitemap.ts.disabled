import { MetadataRoute } from 'next'

// Drop milliseconds in ISO timestamp: 2025-07-31T15:31:00Z  
const isoNoMs = (d = new Date()) => d.toISOString().replace(/\.\d{3}Z$/, 'Z')

export const dynamic = 'force-static' // avoid per-request rendering

export default function sitemap(): MetadataRoute.Sitemap {
  // Force main Vercel alias for production to ensure consistent URLs
  // VERCEL_URL points to deployment-specific URLs which cause sitemap issues
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://tarot-snap.vercel.app'  // Always use main alias in production
    : 'http://localhost:3000'

  const now = isoNoMs()

  // Only include PUBLIC routes accessible without authentication
  const routes = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reading`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reading/single`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  return routes
} 