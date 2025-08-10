import { NextRequest, NextResponse } from 'next/server'

// Permanent redirect from legacy sitemap URL to the new dynamic sitemap
export function GET(request: NextRequest) {
  const url = new URL(request.url)
  // Preserve any existing query parameters while switching path
  url.pathname = '/sitemap.xml'
  return NextResponse.redirect(url, 301)
}

