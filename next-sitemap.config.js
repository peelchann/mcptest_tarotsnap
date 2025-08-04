/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://tarot-snap.vercel.app',
  generateRobotsTxt: false,  // ← CONFLICT FIX: Use dynamic robots.ts only
  generateIndexSitemap: false,  // ← BULLET-PROOF FIX: Single sitemap only
  sitemapBaseFileName: 'main-sitemap',  // ← CACHE-BUSTER: New filename bypasses GSC cache
  exclude: ['/dashboard', '/dashboard/*', '/private/*', '/api/*', '/_next/*', '/temp/*', '/robots.txt'],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  // robotsTxtOptions removed - using dynamic robots.ts instead
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