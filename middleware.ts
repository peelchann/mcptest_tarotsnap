import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/dashboard', '/profile', '/history']
const AUTH_PATHS = ['/auth', '/login', '/signup']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Canonicalize trailing slash variants first
  if (pathname === '/sitemap.xml/' || pathname === '/robots.txt/') {
    const url = new URL(request.url)
    url.pathname = pathname.replace(/\/$/, '')
    return NextResponse.redirect(url, 308)
  }
  if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
    return NextResponse.next()
  }

  const isProtectedRoute = PROTECTED_PATHS.some(path => pathname.startsWith(path))
  const isAuthRoute = AUTH_PATHS.some(path => pathname.startsWith(path))

  // Short-circuit: routes that don't need an auth decision skip the Supabase
  // edge call entirely. The call has crashed Vercel Edge runtime in some cases
  // (MIDDLEWARE_INVOCATION_FAILED); for paths where we don't actually need
  // user context, paying that cost is wasted.
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Wrap auth lookup in try/catch so a Supabase/Edge failure never returns
  // a 500 — we fail open (treat as logged-out) and let the page itself
  // re-check auth server-side.
  let user: { id: string } | null = null
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({ name, value, ...options })
            response = NextResponse.next({ request: { headers: request.headers } })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            request.cookies.set({ name, value: '', ...options })
            response = NextResponse.next({ request: { headers: request.headers } })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    const result = await supabase.auth.getUser()
    user = result.data.user as { id: string } | null
  } catch (err) {
    console.error('[middleware] Supabase auth lookup failed; failing open:', err)
    user = null
  }

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('auth', 'required')
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images in the public folder
     * - sitemap and robots files (for SEO crawlers)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|xml|txt)$).*)',
  ],
}
