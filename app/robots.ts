import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Use main Vercel domain alias for production consistency
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.NODE_ENV === 'production'
    ? 'https://tarot-snap.vercel.app'  // Main Vercel alias - always accessible
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