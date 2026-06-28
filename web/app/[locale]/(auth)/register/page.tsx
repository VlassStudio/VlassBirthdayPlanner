'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, PartyPopper, ArrowLeft, Baby, Wine } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function RegisterPage() {
  const router = useRouter()
  const t = useTranslations('auth')
  const locale = useLocale()
  const [show, setShow] = useState(false)
  const [mode, setMode] = useState<'kids' | 'adult' | null>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#FFFDF9', overflow: 'hidden', position: 'relative',
      padding: 16
    }}>
      {/* Background Fun Elements */}
      <div style={{ backgroundImage: 'radial-gradient(#FF3366 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.05, position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', filter: 'blur(80px)', top: -100, right: -100, width: 400, height: 400, background: '#FF9933', opacity: 0.15, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', filter: 'blur(80px)', bottom: -100, left: -100, width: 500, height: 500, background: '#FF3366', opacity: 0.15, borderRadius: '50%' }} />

      {/* Navbar Language Switcher */}
      <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 50 }}>
        <LanguageSwitcher currentLocale={locale} variant="pill" />
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{
        background: 'white', borderRadius: 28, padding: '32px 24px',
        boxShadow: '0 20px 60px rgba(255,51,102,0.15)', width: '100%', maxWidth: 480,
        border: '1px solid rgba(255,51,102,0.1)', position: 'relative', zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #FF3366, #FF9933)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-10deg)' }}>
            <PartyPopper size={20} color="white" />
          </div>
          <span style={{ fontWeight: 900, fontSize: 24, letterSpacing: '-0.03em', color: '#FF3366' }}>Glyka Party box</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginLeft: 8 }}>by Vlass</span>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, letterSpacing: '-0.03em', color: '#18181B' }}>{t('register_title')}</h1>
        <p style={{ color: '#71717A', fontSize: 14, marginBottom: 20, fontWeight: 500 }}>{t('register_subtitle')}</p>

        {/* Mode selector */}
        <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 8, color: '#3f3f46' }}>{t('register_selector_title')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[
            { key: 'kids', icon: <Baby size={20} />, label: t('register_kids'), sub: t('register_kids_sub'), color: '#E11D48', bg: '#FFF0F5', border: '#FFB3C6' },
            { key: 'adult', icon: <Wine size={20} />, label: t('register_adult'), sub: t('register_adult_sub'), color: '#4338CA', bg: '#EEF2FF', border: '#C7D2FE' },
          ].map(m => (
            <motion.button key={m.key} onClick={() => setMode(m.key as any)} whileTap={{ scale: 0.97 }}
              style={{
                padding: '12px', borderRadius: 16, border: `2px solid ${mode === m.key ? m.color : '#e4e4e7'}`,
                background: mode === m.key ? m.bg : 'white', cursor: 'pointer',
                fontFamily: 'var(--font-jakarta)', textAlign: 'center', transition: 'all 0.2s',
                boxShadow: mode === m.key ? `0 8px 20px ${m.color}20` : 'none'
              }}>
              <div style={{ display: 'flex', justifyContent: 'center', color: mode === m.key ? m.color : '#71717A', marginBottom: 8 }}>{m.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: mode === m.key ? m.color : '#18181b', marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: mode === m.key ? m.color : '#71717A' }}>{m.sub}</div>
            </motion.button>
          ))}
        </div>

        {/* Google */}
        <motion.button onClick={() => router.push('/dashboard')} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} style={{
          width: '100%', padding: '12px', border: '1.5px solid #e4e4e7',
          borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, background: 'white', cursor: 'pointer', fontFamily: 'var(--font-jakarta)',
          fontWeight: 700, fontSize: 14, color: '#18181b', marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {t('register_google')}
        </motion.button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: '#e4e4e7' }} />
          <span style={{ fontSize: 13, color: '#71717A', fontWeight: 600 }}>{t('login_or')}</span>
          <div style={{ flex: 1, height: 1, background: '#e4e4e7' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { key: 'name', label: t('register_name'), type: 'text', placeholder: t('register_name_placeholder') },
            { key: 'email', label: t('login_email'), type: 'email', placeholder: t('login_email_placeholder') },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4, color: '#3F3F46' }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e4e4e7', borderRadius: 12, fontSize: 14, fontFamily: 'var(--font-jakarta)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4, color: '#3F3F46' }}>{t('login_password')}</label>
            <div style={{ position: 'relative' }}>
              <input value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                type={show ? 'text' : 'password'} placeholder={t('register_password_placeholder')}
                style={{ width: '100%', padding: '12px 48px 12px 16px', border: '1.5px solid #e4e4e7', borderRadius: 12, fontSize: 14, fontFamily: 'var(--font-jakarta)', outline: 'none', boxSizing: 'border-box' }} />
              <button onClick={() => setShow(!show)} type="button" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#71717A' }}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <motion.button onClick={() => router.push('/dashboard')} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} style={{
          width: '100%', marginTop: 20, padding: '12px',
          background: 'linear-gradient(135deg, #FF3366, #FF9933)', color: 'white',
          border: 'none', borderRadius: 100, fontWeight: 800, fontSize: 15,
          fontFamily: 'var(--font-jakarta)', cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(255,51,102,0.3)',
        }}>
          {t('register_btn')}
        </motion.button>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#71717A', fontWeight: 500 }}>
          {t('register_has_account')} {' '}
          <Link href="/login" style={{ color: '#FF3366', fontWeight: 800, textDecoration: 'none' }}>{t('register_login_link')}</Link>
        </p>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#71717A', textDecoration: 'none', fontWeight: 600 }}>
            <ArrowLeft size={14} /> {t('login_back')}
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
