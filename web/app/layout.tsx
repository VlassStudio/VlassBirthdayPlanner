import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: { default: 'Glyka Party box by Vlass — Perencana Pesta Ulang Tahun Digital', template: '%s | Glyka Party box by Vlass' },
  description: 'Platform terbaik untuk merencanakan pesta ulang tahun. Mulai dari undangan digital, manajemen RSVP, daftar tamu, hingga anggaran.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased`} suppressHydrationWarning>{children}</body>
    </html>
  )
}
