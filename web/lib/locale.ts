'use server'

import { cookies } from 'next/headers'

// next-intl uses NEXT_LOCALE cookie for locale detection when localePrefix='never'
export async function setUserLocale(locale: 'id' | 'en') {
  const cookieStore = await cookies()
  cookieStore.set('NEXT_LOCALE', locale, {
    // Persist for 1 year
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  })
}

export async function getUserLocale(): Promise<'id' | 'en'> {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value
  return (locale === 'en' ? 'en' : 'id')
}
