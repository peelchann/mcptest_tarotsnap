import { NextRequest, NextResponse } from 'next/server'

// Permanent redirect from legacy sitemap URL to the new dynamic sitemap
export function GET(request: NextRequest) {
  const target = new URL('/sitemap.xml', request.url)
  return NextResponse.redirect(target, 301)
}

