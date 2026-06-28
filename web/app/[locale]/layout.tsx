import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import { Toaster } from 'react-hot-toast'

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
      <Toaster position="top-right" toastOptions={{
        style: { fontFamily: 'var(--font-jakarta)', borderRadius: '12px', background: '#18181b', color: '#fff' }
      }} />
    </NextIntlClientProvider>
  )
}
