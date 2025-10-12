import { NextResponse } from 'next/server'
import generateSitemap from '../sitemap'

export const runtime = 'nodejs'

function toXmlSafe(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export async function GET() {
  const routes = generateSitemap()

  const items = routes
    .map((r) => {
      const loc = toXmlSafe(r.url)
      const lastmod = r.lastModified
        ? new Date(r.lastModified).toISOString()
        : undefined
      const changefreq = r.changeFrequency
      const priority = r.priority

      return [
        '<url>',
        `<loc>${loc}</loc>`,
        lastmod ? `<lastmod>${lastmod}</lastmod>` : '',
        changefreq ? `<changefreq>${changefreq}</changefreq>` : '',
        typeof priority === 'number' ? `<priority>${priority.toFixed(1)}</priority>` : '',
        '</url>',
      ]
        .filter(Boolean)
        .join('')
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`

  return new NextResponse(xml, {
    headers: {
      'content-type': 'application/xml; charset=UTF-8',
      'cache-control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}


