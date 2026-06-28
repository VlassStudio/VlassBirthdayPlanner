'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setUserLocale } from '@/lib/locale'

interface LanguageSwitcherProps {
  currentLocale: string
  variant?: 'pill' | 'dropdown'
}

export default function LanguageSwitcher({ currentLocale, variant = 'pill' }: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const switchTo = (locale: 'id' | 'en') => {
    startTransition(async () => {
      await setUserLocale(locale)
      window.location.reload()
    })
  }

  if (variant === 'pill') {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: 'rgba(0,0,0,0.06)', borderRadius: 100, padding: '4px',
        opacity: isPending ? 0.6 : 1, transition: 'opacity 0.2s',
      }}>
        {(['id', 'en'] as const).map(lang => (
          <button
            key={lang}
            onClick={() => switchTo(lang)}
            disabled={isPending}
            style={{
              padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700,
              border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'var(--font-jakarta)',
              background: currentLocale === lang
                ? 'white'
                : 'transparent',
              color: currentLocale === lang ? '#18181b' : '#71717A',
              boxShadow: currentLocale === lang ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
            }}
          >
            {lang === 'id' ? 'ID' : 'ENG'}
          </button>
        ))}
      </div>
    )
  }

  return (
    <select
      value={currentLocale}
      onChange={e => switchTo(e.target.value as 'id' | 'en')}
      disabled={isPending}
      style={{
        padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 12, fontWeight: 600,
        cursor: 'pointer', outline: 'none', fontFamily: 'var(--font-jakarta)',
        opacity: isPending ? 0.6 : 1,
      }}
    >
      <option value="id">🇮🇩 Indonesia</option>
      <option value="en">🇺🇸 English</option>
    </select>
  )
}
