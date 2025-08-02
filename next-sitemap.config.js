/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://tarot-snap.vercel.app',
  generateRobotsTxt: true,
  exclude: ['/dashboard', '/dashboard/*', '/private/*', '/api/*', '/_next/*', '/temp/*', '/robots.txt'],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/dashboard/admin/', '/private/', '/_next/', '/temp/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/dashboard/admin/', '/private/'],
      },
    ],
  },
  // Custom transform to ensure clean timestamps without milliseconds
  transform: async (config, path) => {
    const isoNoMs = (d = new Date()) => d.toISOString().replace(/\.\d{3}Z$/, 'Z')
    
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: isoNoMs(),
    }
  },
} 