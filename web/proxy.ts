import createMiddleware from 'next-intl/middleware'
import type { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const intlMiddleware = createMiddleware({
  locales: ['id', 'en'],
  defaultLocale: 'id',
  // 'never' = no locale prefix in URL ever — always clean URLs like /kids, /adult
  localePrefix: 'never',
  // Use cookie to persist locale preference
  localeDetection: true,
})

export default function proxy(request: NextRequest) {
  // Skip i18n for public invite pages and static assets
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/invite')) return undefined
  return intlMiddleware(request)
}

export const config = {
  // Exclude invite pages, static files, _next, and api from middleware
  matcher: ['/((?!invite|_next|_vercel|api|.*\\..*).*)', '/'],
}
