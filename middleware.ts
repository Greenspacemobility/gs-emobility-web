import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { locales, defaultLocale } from './i18n'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
})

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Portal routes — Supabase auth protection, skip intl locale routing
  if (pathname.startsWith('/portal')) {
    return handlePortalAuth(request)
  }

  // Investors page — password-gate sensitive business information
  if (pathname.match(/^\/(en|es)\/investors$/)) {
    return handleInvestorsAuth(request)
  }

  // All other routes — next-intl locale routing
  return intlMiddleware(request)
}

function handleInvestorsAuth(request: NextRequest) {
  const cookie = request.cookies.get('investors_access')
  const validToken = process.env.INVESTORS_ACCESS_TOKEN

  // If no token configured in production, deny access (fail closed)
  if (!validToken) {
    const url = new URL('/investors-access', request.url)
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (cookie?.value === validToken) return NextResponse.next()

  // Redirect to access request page, preserving the intended destination
  const url = new URL('/investors-access', request.url)
  url.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

async function handlePortalAuth(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — must call getUser(), not getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isLoginPage = pathname === '/portal/login'
  const isCallback = pathname === '/portal/auth/callback'

  // Not logged in and not on login/callback page → redirect to login
  if (!user && !isLoginPage && !isCallback) {
    const loginUrl = new URL('/portal/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already logged in and hitting login page → redirect to portal home
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/portal', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
