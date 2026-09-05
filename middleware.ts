import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './i18n'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
})

/** The partner portal now lives in GS Hub Ops, not on this site.
 *  Temporary (307) rather than permanent so the destination can change to
 *  hub.gs-emobility.com without browsers holding on to a cached 308. */
const HUB_OPS_URL = 'https://hub-ops-ecru.vercel.app/'

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /portal and everything under it → GS Hub Ops.
  // Handled before next-intl so the path never gets locale-prefixed.
  if (pathname === '/portal' || pathname.startsWith('/portal/')) {
    return NextResponse.redirect(HUB_OPS_URL, 307)
  }

  // All other routes — next-intl locale routing
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
