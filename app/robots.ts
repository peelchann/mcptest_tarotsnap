import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Force main Vercel alias for production consistency with sitemap
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://tarot-snap.vercel.app'  // Always use main alias in production
    : 'http://localhost:3000'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/admin/',
          '/private/',
          '/_next/',
          '/temp/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/admin/',
          '/private/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 