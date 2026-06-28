'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import {
  PartyPopper, ChevronDown, Heart, ArrowRight, PlayCircle, BarChart3, CheckCircle2, Shield, Users, Gift, Crown, Zap, Send, Star, Phone, FileSpreadsheet, Edit2
} from 'lucide-react'
import LanguageSwitcher from '@/components/LanguageSwitcher'

// --- CHEERFUL DECORATIONS ---
const FloatingEmojis = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* CSS Animations are defined in the style block below */}
      <div className="float-1" style={{ position: 'absolute', top: '15%', left: '10%', fontSize: '40px', opacity: 0.6 }}>🎈</div>
      <div className="float-2" style={{ position: 'absolute', top: '40%', right: '15%', fontSize: '50px', opacity: 0.4 }}>✨</div>
      <div className="float-3" style={{ position: 'absolute', bottom: '20%', left: '20%', fontSize: '45px', opacity: 0.5 }}>🎉</div>
      <div className="float-1" style={{ position: 'absolute', top: '60%', right: '25%', fontSize: '60px', opacity: 0.3 }}>🦄</div>
      <div className="float-2" style={{ position: 'absolute', top: '10%', right: '30%', fontSize: '35px', opacity: 0.7 }}>🥂</div>
    </div>
  )
}

const Marquee = ({ t }: { t: any }) => {
  return (
    <div style={{ width: '100%', position: 'relative', marginTop: -20, marginBottom: 40, zIndex: 20 }}>
      <div style={{ position: 'absolute', top: 0, left: '-10vw', width: '120vw', background: '#FF3366', color: 'white', padding: '16px 0', display: 'flex', overflow: 'hidden', whiteSpace: 'nowrap', transform: 'rotate(-2deg)', boxShadow: '0 10px 20px rgba(255,51,102,0.2)' }}>
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
          style={{ display: 'flex', gap: '40px', fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', width: 'max-content' }}
        >
          {[...Array(60)].map((_, i) => (
            <span key={i}>{t('marquee_text')}</span>
          ))}
        </motion.div>
      </div>
      <div style={{ height: 60 }} />
    </div>
  )
}

// --- MOCKUP COMPONENTS FOR THE DEMO ---
const PhoneMockup = ({ activeTab, t }: { activeTab: 'invite' | 'dashboard', t: any }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<'kids' | 'adult' | false>(false)

  return (
    <div style={{
      width: '100%', maxWidth: 300, height: 580, background: '#18181B', borderRadius: 40, border: '8px solid #27272A',
      position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.4)',
      display: 'flex', flexDirection: 'column', margin: '0 auto',
      transform: 'rotate(2deg)', transition: 'transform 0.3s'
    }} className="phone-mockup">
      <style>{`.phone-mockup:hover { transform: rotate(0deg) translateY(-10px); }`}</style>

      {/* Phone Notch */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 100, height: 24, background: '#27272A', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, zIndex: 20 }} />
      {/* Glass Reflection */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05))', zIndex: 15, pointerEvents: 'none', transform: 'skewX(-15deg)' }} />

      {activeTab === 'invite' ? (
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #FFE5EC 0%, #FFF0F5 100%)', position: 'relative', display: 'flex', flexDirection: 'column', padding: 20 }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }}>
            <span style={{ position: 'absolute', top: '10%', left: '20%', fontSize: 24 }}>🎈</span>
            <span style={{ position: 'absolute', top: '30%', right: '15%', fontSize: 20 }}>✨</span>
            <span style={{ position: 'absolute', bottom: '20%', left: '10%', fontSize: 28 }}>🦄</span>
          </div>

          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div key="closed" exit={{ y: -500, opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #FFB3C6 0%, #FF3366 100%)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 32 }}>

                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: -50, left: -50, width: 150, height: 150, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />

                {/* Text above Envelope */}
                <div style={{ textAlign: 'center', color: 'white', zIndex: 5, padding: '0 20px' }}>
                  <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, opacity: 0.9 }}>You&apos;re Invited</p>
                  <h3 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1, fontFamily: 'serif' }}>The<br />Party</h3>
                </div>

                <motion.div animate={{ scale: [1, 1.05, 1], y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                  <div style={{ width: 160, height: 110, background: '#FFF0F5', borderRadius: 12, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(225,29,72,0.4)', border: '1px solid rgba(255,255,255,0.5)', overflow: 'hidden' }}>
                    {/* Envelope Flaps */}
                    <div style={{ position: 'absolute', left: 0, width: 0, height: 0, borderTop: '55px solid transparent', borderBottom: '55px solid transparent', borderLeft: '80px solid rgba(255,255,255,0.8)', zIndex: 1 }} />
                    <div style={{ position: 'absolute', right: 0, width: 0, height: 0, borderTop: '55px solid transparent', borderBottom: '55px solid transparent', borderRight: '80px solid rgba(255,255,255,0.8)', zIndex: 1 }} />
                    <div style={{ position: 'absolute', bottom: 0, width: 0, height: 0, borderLeft: '80px solid transparent', borderRight: '80px solid transparent', borderBottom: '55px solid #FFE5EC', zIndex: 2 }} />
                    <div style={{ position: 'absolute', top: 0, width: 0, height: 0, borderLeft: '80px solid transparent', borderRight: '80px solid transparent', borderTop: '55px solid white', zIndex: 3, filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.05))' }} />

                    {/* Wax Seal */}
                    <div style={{ width: 40, height: 40, background: '#FF3366', borderRadius: '50%', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(225,29,72,0.5)', border: '2px solid rgba(255,255,255,0.5)' }}>
                      <Heart size={20} color="white" fill="white" />
                    </div>
                  </div>
                </motion.div>

                <div style={{ width: '100%', padding: '0 32px', zIndex: 5, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button onClick={() => setIsOpen('kids')} style={{ width: '100%', padding: '12px 16px', background: 'white', color: '#FF3366', borderRadius: 100, fontWeight: 900, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jakarta)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'transform 0.2s' }}>
                    🎈 {t('demo_kids_btn')}
                  </button>
                  <button onClick={() => setIsOpen('adult')} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: 100, fontWeight: 700, fontSize: 13, border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    🥂 {t('demo_adult_btn')}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'relative', zIndex: 5, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: isOpen === 'adult' ? '#18181B' : 'white', borderRadius: 24, padding: 20, marginTop: 40, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: isOpen === 'adult' ? '#27272A' : '#FFE5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 16 }}>{isOpen === 'adult' ? '🥂' : '👧'}</div>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: isOpen === 'adult' ? 'white' : '#18181B', marginBottom: 8, lineHeight: 1.2 }}>{isOpen === 'adult' ? "Michael's 30th" : t('demo_invite_title')}</h3>
                <p style={{ fontSize: 13, color: '#A1A1AA', marginBottom: 24 }}>{t('demo_invite_date')}</p>
                <div style={{ width: '100%', background: isOpen === 'adult' ? '#27272A' : '#F4F4F5', padding: 16, borderRadius: 16, marginBottom: 24 }}>
                  <p style={{ fontSize: 12, fontWeight: 800, color: isOpen === 'adult' ? 'white' : '#18181B', marginBottom: 12 }}>{t('demo_invite_confirm')}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setIsOpen(false)} style={{ width: '100%', padding: 14, background: isOpen === 'adult' ? '#D4AF37' : '#18181B', color: isOpen === 'adult' ? 'black' : 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
                      {t('demo_invite_yes')}
                    </button>
                    <button onClick={() => setIsOpen(false)} style={{ flex: 1, padding: 10, background: 'transparent', color: isOpen === 'adult' ? '#A1A1AA' : '#71717A', borderRadius: 8, border: `1px solid ${isOpen === 'adult' ? '#3F3F46' : '#E4E4E7'}`, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>{t('demo_invite_no')}</button>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#A1A1AA', fontSize: 12, textDecoration: 'underline', cursor: 'pointer' }}>{t('demo_invite_close')}</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div style={{ flex: 1, background: '#FAFAFA', paddingTop: 40, paddingLeft: 20, paddingRight: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: '#71717A', fontWeight: 600 }}>{t('demo_dash_total')}</p>
              <h4 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#18181B' }}>150 <span style={{ fontSize: 12, color: '#10B981' }}>{t('demo_dash_guest')}</span></h4>
            </div>
            <div style={{ width: 40, height: 40, background: '#F4F4F5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👧</div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, background: 'white', padding: 16, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <p style={{ margin: 0, fontSize: 11, color: '#71717A', fontWeight: 600 }}>{t('demo_dash_yes')}</p>
              <p style={{ margin: 0, fontSize: 20, color: '#10B981', fontWeight: 800 }}>85</p>
            </div>
            <div style={{ flex: 1, background: 'white', padding: 16, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <p style={{ margin: 0, fontSize: 11, color: '#71717A', fontWeight: 600 }}>{t('demo_dash_wait')}</p>
              <p style={{ margin: 0, fontSize: 20, color: '#F59E0B', fontWeight: 800 }}>65</p>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: 16, borderRadius: 16, color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>Anggaran Pesta</p>
                <p style={{ margin: 0, fontSize: 18, color: 'white', fontWeight: 800 }}>Rp 15.000.000</p>
              </div>
              <p style={{ margin: 0, fontSize: 11, color: '#10B981', fontWeight: 700 }}>Sisa 35%</p>
            </div>
            <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
              <div style={{ width: '65%', height: '100%', background: '#10B981', borderRadius: 4 }} />
            </div>
          </div>

          <div style={{ background: 'white', padding: 16, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', flex: 1 }}>
            <p style={{ margin: 0, fontSize: 14, color: '#18181B', fontWeight: 800, marginBottom: 16 }}>Persiapan (To-Do)</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Kirim undangan digital', done: true },
                { label: 'Pesan katering pesta', done: false },
                { label: 'Beli dekorasi & balon', done: false }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CheckCircle2 size={16} color={item.done ? "#10B981" : "#E4E4E7"} />
                  <p style={{ margin: 0, fontSize: 13, color: item.done ? '#A1A1AA' : '#3F3F46', textDecoration: item.done ? 'line-through' : 'none', fontWeight: 600 }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function LandingPage() {
  const t = useTranslations('landing')
  const locale = useLocale()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [demoTab, setDemoTab] = useState<'invite' | 'dashboard'>('invite')

  const fiturGratis = t.raw('fitur_gratis') as string[]
  const fiturPremium = t.raw('fitur_premium') as string[]

  const FAQS = [
    { q: t('faq_1_q'), a: t('faq_1_a') },
    { q: t('faq_2_q'), a: t('faq_2_a') },
    { q: t('faq_3_q'), a: t('faq_3_a') },
    { q: t('faq_4_q'), a: t('faq_4_a') },
    { q: t('faq_5_q'), a: t('faq_5_a') },
  ]

  return (
    <div style={{ background: '#FFFDF9', color: '#18181B', fontFamily: 'var(--font-jakarta)', overflowX: 'hidden' }}>

      {/* ── CUSTOM CSS ── */}
      <style>{`
        html, body {
          overflow-x: hidden;
          width: 100%;
          position: relative;
          margin: 0;
          padding: 0;
        }

        * { box-sizing: border-box; }
        
        .glass-nav {
          background: rgba(255, 253, 249, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 2px dashed rgba(255,51,102,0.1);
        }

        .hero-title {
          font-size: clamp(32px, 4vw, 56px);
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .gradient-text {
          background: linear-gradient(135deg, #FF3366 0%, #FF9933 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .fun-bg {
          background-image: radial-gradient(#FF3366 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: 0 0;
          opacity: 0.05;
          position: absolute; inset: 0; pointer-events: none;
        }

        .hero-section {
          padding-top: 120px;
          padding-bottom: 60px;
        }
        .section-padding {
          padding: 60px 16px;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: center;
        }
        .two-worlds-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        .nav-button {
          display: none;
        }
        .mobile-login {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,51,102,0.1);
          color: #FF3366;
          text-decoration: none;
        }
        
        @media (min-width: 768px) {
          .hero-section {
            padding-top: 160px;
            padding-bottom: 100px;
          }
          .section-padding {
            padding: 100px 24px;
          }
          .pricing-grid, .two-worlds-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .nav-button {
            display: inline-block;
          }
          .mobile-login {
            display: none;
          }
        }
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr;
            gap: 60px;
          }
        }

        /* Party Animations */
        @keyframes float1 { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(10deg); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-30px) rotate(-15deg); } }
        @keyframes float3 { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-15px) scale(1.1); } }
        .float-1 { animation: float1 6s ease-in-out infinite; }
        .float-2 { animation: float2 8s ease-in-out infinite; }
        .float-3 { animation: float3 7s ease-in-out infinite; }

        .blob {
          position: absolute;
          filter: blur(80px);
          z-index: 1;
          opacity: 0.6;
          border-radius: 50%;
          animation: float1 10s infinite;
        }
      `}</style>

      {/* Background Glow Blobs */}
      <div className="blob" style={{ top: -100, left: -100, width: 400, height: 400, background: '#FF3366' }} />
      <div className="blob" style={{ top: '20%', right: -150, width: 500, height: 500, background: '#FF9933', animationDelay: '2s' }} />
      <div className="blob" style={{ bottom: '10%', left: '10%', width: 600, height: 600, background: '#A78BFA', animationDelay: '4s', opacity: 0.2 }} />

      {/* ── NAVBAR ── */}
      <nav className="glass-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 80,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 16, background: 'linear-gradient(135deg, #FF3366, #FF9933)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-10deg)'
          }}>
            <PartyPopper size={22} color="white" />
          </div>
          <span style={{ fontWeight: 900, fontSize: 26, letterSpacing: '-0.03em', color: '#FF3366' }}>Glyka Party box</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginLeft: 8 }}></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <LanguageSwitcher currentLocale={locale} variant="pill" />

          {/* Mobile Login Button (Icon) */}
          <Link href="/login" className="mobile-login">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
          </Link>
          <Link href="/login" className="nav-button" style={{
            padding: '12px 28px', borderRadius: 100, fontSize: 16, fontWeight: 900,
            background: 'rgba(255,51,102,0.1)', color: '#FF3366', textDecoration: 'none'
          }}>
            Login
          </Link>
          <Link href="/register" className="nav-button" style={{
            padding: '12px 28px', borderRadius: 100, fontSize: 16, fontWeight: 900,
            background: '#FF3366', color: 'white', textDecoration: 'none', boxShadow: '0 8px 20px rgba(255,51,102,0.3)'
          }}>
            {t('hero_cta').replace('Sekarang', '')}
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="fun-bg" />
        <FloatingEmojis />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 10 }} className="hero-grid">

          <div style={{ textAlign: 'left' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#FFE5EC', borderRadius: 100, marginBottom: 32, border: '2px solid #FFB3C6' }}>
              <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.05em', color: '#E11D48', textTransform: 'uppercase' }}>{t('hero_badge')}</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="hero-title" style={{ marginBottom: 32 }}>
              {t('hero_judul')} <span className="gradient-text">{t('hero_judul_aksen')}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontSize: 'clamp(16px, 1.5vw, 20px)', color: '#52525B', marginBottom: 40, lineHeight: 1.6, fontWeight: 600, maxWidth: 600 }}>
              {t('hero_subjudul')}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Link href="/register" style={{ padding: '18px 36px', background: 'linear-gradient(135deg, #FF3366, #FF9933)', color: 'white', borderRadius: 100, fontSize: 18, fontWeight: 900, textDecoration: 'none', boxShadow: '0 12px 30px rgba(255,51,102,0.4)', display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                {t('hero_cta')} <ArrowRight size={24} />
              </Link>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24, width: '100%' }}>
              <button onClick={() => setDemoTab('invite')} style={{ padding: '10px 20px', borderRadius: 100, fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8, background: demoTab === 'invite' ? '#FF3366' : 'white', color: demoTab === 'invite' ? 'white' : '#71717A', boxShadow: demoTab === 'invite' ? '0 8px 20px rgba(255,51,102,0.3)' : '0 4px 12px rgba(0,0,0,0.05)' }}>
                <PlayCircle size={18} /> {t('demo_tab_invite')}
              </button>
              <button onClick={() => setDemoTab('dashboard')} style={{ padding: '10px 20px', borderRadius: 100, fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8, background: demoTab === 'dashboard' ? '#18181B' : 'white', color: demoTab === 'dashboard' ? 'white' : '#71717A', boxShadow: demoTab === 'dashboard' ? '0 8px 20px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.05)' }}>
                <BarChart3 size={18} /> {t('demo_tab_dash')}
              </button>
            </div>
            <PhoneMockup activeTab={demoTab} t={t} />
          </motion.div>

        </div>
      </section>

      {/* ── SEPARATOR MARQUEE ── */}
      <Marquee t={t} />

      {/* ── THE TWO WORLDS ── */}
      <section id="features" className="section-padding" style={{ background: 'white', borderTop: '2px dashed rgba(0,0,0,0.05)', position: 'relative', zIndex: 10, overflow: 'hidden' }}>
        <div className="blob" style={{ top: '10%', right: '-10%', width: 500, height: 500, background: '#FF3366', opacity: 0.15 }} />
        <div className="blob" style={{ bottom: '10%', left: '-10%', width: 600, height: 600, background: '#818CF8', opacity: 0.15 }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 20 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16 }}>{t('fitur_judul')}</h2>
            <p style={{ fontSize: 'clamp(14px, 2vw, 20px)', color: '#71717A', fontWeight: 600 }}>{t('fitur_subjudul')}</p>
          </div>

          <div className="two-worlds-grid">
            {/* KIDS */}
            <div style={{ background: '#FFF0F5', borderRadius: 32, padding: 40, border: '1px solid #FFB3C6', position: 'relative', zIndex: 5, boxShadow: '0 20px 40px rgba(225,29,72,0.05)' }}>
              <div style={{ width: '100%', height: 220, marginBottom: 32, borderRadius: 24, background: 'linear-gradient(135deg, #FFB3C6 0%, #FF3366 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.1)' }}>
                {/* CSS Art Background */}
                <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', filter: 'blur(10px)' }} />
                <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.1)', borderRadius: '30%', transform: 'rotate(45deg)' }} />

                {/* Floating Icons */}
                <motion.div animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} style={{ position: 'absolute', top: '15%', left: '15%' }}>
                  <PartyPopper size={48} color="white" opacity={0.9} />
                </motion.div>
                <motion.div animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }} style={{ position: 'absolute', bottom: '15%', right: '15%' }}>
                  <Gift size={56} color="white" opacity={0.9} />
                </motion.div>

                {/* Centerpiece */}
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} style={{ width: 100, height: 100, background: 'white', borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(225,29,72,0.4)', zIndex: 10 }}>
                  <span style={{ fontSize: 50 }}>🎠</span>
                </motion.div>
              </div>
              <h3 style={{ fontSize: 32, fontWeight: 900, color: '#E11D48', marginBottom: 16 }}>{t('mode_anak')}</h3>
              <p style={{ fontSize: 16, color: '#BE123C', fontWeight: 600, marginBottom: 32, lineHeight: 1.6 }}>{t('mode_anak_desc')}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                {[
                  { icon: Shield, title: t('fitur_anak_1_title'), desc: t('fitur_anak_1_desc') },
                  { icon: Users, title: t('fitur_anak_2_title'), desc: t('fitur_anak_2_desc') },
                  { icon: Gift, title: t('fitur_anak_3_title'), desc: t('fitur_anak_3_desc') },
                  { icon: PartyPopper, title: t('fitur_anak_4_title'), desc: t('fitur_anak_4_desc') }
                ].map((f, i) => (
                  <motion.div key={i} whileHover={{ x: 8, scale: 1.02 }} style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', padding: 20, borderRadius: 20, display: 'flex', alignItems: 'flex-start', gap: 16, boxShadow: '0 8px 24px rgba(225,29,72,0.08)', border: '1px solid rgba(255,255,255,1)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <f.icon color="#E11D48" size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 18, fontWeight: 900, color: '#881337', marginBottom: 4 }}>{f.title}</h4>
                      <p style={{ fontSize: 14, color: '#BE123C', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ADULT */}
            <div style={{ background: '#1E1B4B', borderRadius: 32, padding: 40, border: '1px solid #312E81', position: 'relative', zIndex: 5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <div style={{ width: '100%', height: 220, marginBottom: 32, borderRadius: 24, background: 'linear-gradient(135deg, #312E81 0%, #111827 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
                {/* CSS Art Background */}
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(252,211,77,0.15) 0%, transparent 70%)' }} />
                <div style={{ position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, border: '2px dashed rgba(252,211,77,0.2)', borderRadius: '50%', animation: 'spin 20s linear infinite' }} />
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>

                {/* Floating Icons */}
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }} style={{ position: 'absolute', top: '20%', left: '20%' }}>
                  <Crown size={40} color="#FCD34D" opacity={0.8} />
                </motion.div>
                <motion.div animate={{ y: [0, 10, 0], rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }} style={{ position: 'absolute', bottom: '20%', right: '20%' }}>
                  <Zap size={48} color="#FCD34D" opacity={0.8} />
                </motion.div>

                {/* Centerpiece */}
                <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} style={{ width: 100, height: 100, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(252,211,77,0.2)', borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 10 }}>
                  <span style={{ fontSize: 50 }}>🍾</span>
                </motion.div>
              </div>
              <h3 style={{ fontSize: 32, fontWeight: 900, color: '#FCD34D', marginBottom: 16 }}>{t('mode_dewasa')}</h3>
              <p style={{ fontSize: 16, color: '#A78BFA', fontWeight: 600, marginBottom: 32, lineHeight: 1.6 }}>{t('mode_dewasa_desc')}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: Crown, title: t('fitur_dewasa_1_title'), desc: t('fitur_dewasa_1_desc') },
                  { icon: Zap, title: t('fitur_dewasa_2_title'), desc: t('fitur_dewasa_2_desc') },
                  { icon: Send, title: t('fitur_dewasa_3_title'), desc: t('fitur_dewasa_3_desc') },
                  { icon: PartyPopper, title: t('fitur_dewasa_4_title'), desc: t('fitur_dewasa_4_desc') }
                ].map((f, i) => (
                  <motion.div key={i} whileHover={{ x: 8, scale: 1.02 }} style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', padding: 20, borderRadius: 20, display: 'flex', alignItems: 'flex-start', gap: 16, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(252,211,77,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <f.icon color="#FCD34D" size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 18, fontWeight: 900, color: 'white', marginBottom: 4 }}>{f.title}</h4>
                      <p style={{ fontSize: 14, color: '#A78BFA', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DASBOR FITUR CANGGIH ── */}
      <section className="section-padding" style={{ background: '#F8FAFC', position: 'relative', borderTop: '2px dashed rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 20 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16 }}>{t('fitur_dashboard_judul')}</h2>
            <p style={{ fontSize: 'clamp(14px, 2vw, 20px)', color: '#64748B', fontWeight: 600, maxWidth: 700, margin: '0 auto' }}>{t('fitur_dashboard_subjudul')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {[
              { icon: Phone, title: t('dash_feat_1_title'), desc: t('dash_feat_1_desc'), color: '#10B981', bg: '#ECFDF5' },
              { icon: FileSpreadsheet, title: t('dash_feat_2_title'), desc: t('dash_feat_2_desc'), color: '#3B82F6', bg: '#EFF6FF' },
              { icon: CheckCircle2, title: t('dash_feat_3_title'), desc: t('dash_feat_3_desc'), color: '#F59E0B', bg: '#FFFBEB' },
              { icon: Edit2, title: t('dash_feat_4_title'), desc: t('dash_feat_4_desc'), color: '#8B5CF6', bg: '#F5F3FF' }
            ].map((f, i) => (
              <motion.div key={i} whileHover={{ y: -8 }} style={{ background: 'white', padding: 32, borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <f.icon color={f.color} size={32} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', marginBottom: 12 }}>{f.title}</h3>
                <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.6, fontWeight: 500 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARA KERJA ── */}
      <section className="section-padding" style={{ background: '#FFFDF9', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '-10%', width: 500, height: 500, background: '#FF3366', opacity: 0.05, filter: 'blur(100px)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: 500, height: 500, background: '#FCD34D', opacity: 0.1, filter: 'blur(100px)', borderRadius: '50%' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 20 }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FFE5EC', padding: '8px 16px', borderRadius: 100, color: '#FF3366', fontWeight: 800, marginBottom: 24 }}>
              <Zap size={16} /> <span>Super Cepat & Mudah</span>
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#18181B', marginBottom: 24 }}>
              Pesta Impian dalam 3 Langkah
            </h2>
            <p style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', color: '#71717A', fontWeight: 600, maxWidth: 600, margin: '0 auto' }}>
              Tidak perlu keahlian desain atau coding. Glyka Party box melakukan semua pekerjaan berat untuk Anda.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {/* Step 1 */}
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ background: 'white', borderRadius: 40, padding: '40px', display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #E4E4E7', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -50, right: -50, fontSize: 300, fontWeight: 900, color: '#FAFAFA', lineHeight: 1, zIndex: 0 }}>1</div>
              <div style={{ flex: '1 1 300px', position: 'relative', zIndex: 10 }}>
                <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #FF3366, #FF9933)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, boxShadow: '0 20px 30px rgba(255,51,102,0.3)' }}>
                  <PartyPopper size={40} color="white" />
                </div>
                <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 24, color: '#18181B' }}>Pilih Mode & Tema Ajaib</h3>
                <p style={{ color: '#52525B', fontSize: 18, lineHeight: 1.8, fontWeight: 500, marginBottom: 24 }}>
                  Pilih <strong>Mode Anak</strong> untuk tema ceria dengan fitur lacak alergi, atau <strong>Mode Dewasa</strong> untuk gaya elegan dengan kalkulator anggaran. Tersedia puluhan desain animasi premium yang siap pakai.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: '#71717A', fontWeight: 600 }}><CheckCircle2 size={20} color="#10B981" /> Desain Animasi Interaktif</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: '#71717A', fontWeight: 600 }}><CheckCircle2 size={20} color="#10B981" /> Personalisasi Teks & Foto</li>
                </ul>
              </div>
              <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
                {/* Abstract graphic */}
                <div style={{ width: '100%', maxWidth: 300, aspectRatio: '1', background: 'radial-gradient(circle, #FFE5EC 0%, transparent 70%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '80%', height: '80%', background: 'white', borderRadius: 32, boxShadow: '0 30px 60px rgba(0,0,0,0.1)', border: '8px solid #FFF', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ height: '40%', background: '#FF3366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Star color="white" fill="white" size={40} /></div>
                    <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ height: 16, width: '60%', background: '#F4F4F5', borderRadius: 8 }} />
                      <div style={{ height: 12, width: '100%', background: '#F4F4F5', borderRadius: 8 }} />
                      <div style={{ height: 12, width: '80%', background: '#F4F4F5', borderRadius: 8 }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ background: 'white', borderRadius: 40, padding: '40px', display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #E4E4E7', position: 'relative', overflow: 'hidden', flexDirection: 'row-reverse' }}>
              <div style={{ position: 'absolute', top: -50, left: -50, fontSize: 300, fontWeight: 900, color: '#FAFAFA', lineHeight: 1, zIndex: 0 }}>2</div>
              <div style={{ flex: '1 1 300px', position: 'relative', zIndex: 10 }}>
                <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #4F46E5, #3B82F6)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, boxShadow: '0 20px 30px rgba(59,130,246,0.3)' }}>
                  <Send size={40} color="white" />
                </div>
                <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 24, color: '#18181B' }}>Sebar Link dalam Detik</h3>
                <p style={{ color: '#52525B', fontSize: 18, lineHeight: 1.8, fontWeight: 500, marginBottom: 24 }}>
                  Ucapkan selamat tinggal pada kertas undangan dan prangko. Hasilkan <strong>link digital eksklusif</strong> yang siap dikirim melalui WhatsApp, Instagram DM, atau Email.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: '#71717A', fontWeight: 600 }}><CheckCircle2 size={20} color="#10B981" /> Link Khusus & Aman</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: '#71717A', fontWeight: 600 }}><CheckCircle2 size={20} color="#10B981" /> Template Pesan WhatsApp Siap Pakai</li>
                </ul>
              </div>
              <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
                {/* Abstract graphic */}
                <div style={{ width: '100%', maxWidth: 300, aspectRatio: '1', background: 'radial-gradient(circle, #E0E7FF 0%, transparent 70%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '80%', padding: 24, background: 'white', borderRadius: 32, boxShadow: '0 30px 60px rgba(0,0,0,0.1)', border: '1px solid #E0E7FF', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 40, height: 40, background: '#4F46E5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Send size={16} color="white" /></div>
                      <div style={{ height: 12, width: 100, background: '#F4F4F5', borderRadius: 8 }} />
                    </div>
                    <div style={{ padding: 16, background: '#F4F4F5', borderRadius: 16, borderTopLeftRadius: 0 }}>
                      <div style={{ height: 10, width: '100%', background: '#E4E4E7', borderRadius: 8, marginBottom: 8 }} />
                      <div style={{ height: 10, width: '80%', background: '#E4E4E7', borderRadius: 8 }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ background: 'white', borderRadius: 40, padding: '40px', display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #E4E4E7', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -50, right: -50, fontSize: 300, fontWeight: 900, color: '#FAFAFA', lineHeight: 1, zIndex: 0 }}>3</div>
              <div style={{ flex: '1 1 300px', position: 'relative', zIndex: 10 }}>
                <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, boxShadow: '0 20px 30px rgba(16,185,129,0.3)' }}>
                  <BarChart3 size={40} color="white" />
                </div>
                <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 24, color: '#18181B' }}>Pantau Semuanya Otomatis</h3>
                <p style={{ color: '#52525B', fontSize: 18, lineHeight: 1.8, fontWeight: 500, marginBottom: 24 }}>
                  Begitu undangan terkirim, <strong>Dashboard Pintar</strong> akan melacak semuanya secara real-time. Mulai dari konfirmasi kehadiran (RSVP), peringatan alergi, hingga checklist persiapan.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: '#71717A', fontWeight: 600 }}><CheckCircle2 size={20} color="#10B981" /> Notifikasi RSVP Real-time</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center', color: '#71717A', fontWeight: 600 }}><CheckCircle2 size={20} color="#10B981" /> Laporan Tamu Terstruktur</li>
                </ul>
              </div>
              <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
                {/* Abstract graphic */}
                <div style={{ width: '100%', maxWidth: 300, aspectRatio: '1', background: 'radial-gradient(circle, #DCFCE7 0%, transparent 70%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '90%', padding: 24, background: 'white', borderRadius: 32, boxShadow: '0 30px 60px rgba(0,0,0,0.1)', border: '1px solid #DCFCE7', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ padding: 16, background: '#F0FDF4', borderRadius: 16, textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: '#10B981', marginBottom: 4 }}>42</div>
                      <div style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>Hadir</div>
                    </div>
                    <div style={{ padding: 16, background: '#FEF2F2', borderRadius: 16, textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: '#EF4444', marginBottom: 4 }}>3</div>
                      <div style={{ fontSize: 12, color: '#DC2626', fontWeight: 700 }}>Alergi</div>
                    </div>
                    <div style={{ gridColumn: '1 / -1', height: 60, background: '#F4F4F5', borderRadius: 16, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                      <div style={{ height: 10, width: '50%', background: '#E4E4E7', borderRadius: 4 }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="section-padding" style={{ background: '#FFFDF9', position: 'relative', overflow: 'hidden' }}>
        <div className="fun-bg" style={{ opacity: 0.1 }} />
        <div className="blob" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 800, background: '#FCD34D', opacity: 0.2 }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 20 }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FFE5EC', padding: '8px 16px', borderRadius: 100, color: '#FF3366', fontWeight: 800, marginBottom: 24 }}>
              <Crown size={16} /> <span>{t('harga_judul')}</span>
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#18181B', marginBottom: 24 }}>
              {t('harga_judul')}
            </h2>
            <p style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', color: '#71717A', fontWeight: 600, maxWidth: 600, margin: '0 auto' }}>
              {t('harga_subjudul')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'center' }}>
            {/* Free Plan */}
            <div style={{ background: 'white', borderRadius: 40, padding: 48, border: '1px solid #E4E4E7', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <div style={{ width: 64, height: 64, background: '#F4F4F5', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <Gift size={32} color="#71717A" />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 900, color: '#18181B', marginBottom: 8 }}>{t('plan_gratis')}</h3>
              <p style={{ color: '#71717A', fontWeight: 500, marginBottom: 24 }}>Sempurna untuk perayaan kecil & intim.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 40 }}>
                <span style={{ fontSize: 56, fontWeight: 900, color: '#18181B', lineHeight: 1 }}>{t('plan_gratis_harga')}</span>
                <span style={{ color: '#A1A1AA', fontWeight: 600 }}>{t('plan_gratis_periode')}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                {fiturGratis.map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: 16, color: '#52525B', fontSize: 16, fontWeight: 600 }}>
                    <CheckCircle2 size={24} color="#A1A1AA" style={{ flexShrink: 0 }} /> <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" style={{ display: 'block', textAlign: 'center', padding: '20px', borderRadius: 100, background: '#F4F4F5', color: '#18181B', fontWeight: 900, fontSize: 18, textDecoration: 'none', transition: 'background 0.2s' }}>{t('btn_mulai_gratis')}</Link>
            </div>

            {/* Premium Plan */}
            <motion.div whileHover={{ y: -10 }} style={{ background: 'linear-gradient(135deg, #FF3366 0%, #FF9933 100%)', borderRadius: 40, padding: 48, color: 'white', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 30px 60px rgba(255,51,102,0.3)', border: '4px solid #FFF' }}>
              <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', background: '#18181B', color: '#FCD34D', padding: '8px 24px', borderRadius: 100, fontWeight: 900, fontSize: 14, boxShadow: '0 10px 20px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                <Star size={16} fill="currentColor" /> {t('plan_premium_badge')}
              </div>
              <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.2)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, backdropFilter: 'blur(10px)' }}>
                <Crown size={32} color="white" />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 900, color: '#FFF', marginBottom: 8 }}>{t('plan_premium')}</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, marginBottom: 24 }}>Untuk pesta mewah yang tak terlupakan.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 40 }}>
                <span style={{ fontSize: 56, fontWeight: 900, color: '#FFF', lineHeight: 1 }}>{t('plan_premium_harga')}</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{t('plan_premium_periode')}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                {fiturPremium.map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: 16, color: '#FFF', fontSize: 16, fontWeight: 600 }}>
                    <CheckCircle2 size={24} color="#FCD34D" style={{ flexShrink: 0 }} /> <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register?plan=premium" style={{ display: 'block', textAlign: 'center', padding: '20px', borderRadius: 100, background: 'white', color: '#FF3366', fontWeight: 900, fontSize: 18, textDecoration: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}>{t('btn_upgrade')}</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-padding" style={{ background: '#18181B', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div className="blob" style={{ top: '20%', left: '-10%', width: 400, height: 400, background: '#FF3366', opacity: 0.2 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 20 }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16 }}>
              Dicintai Ribuan Perencana Pesta
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', gap: 4, color: '#FCD34D', marginBottom: 20 }}><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /></div>
              <p style={{ fontSize: 18, lineHeight: 1.6, marginBottom: 24, color: '#E4E4E7' }}>"Glyka Party box membuat persiapan pesta Alisha jadi super mudah! Undangan digitalnya keren banget, teman-teman semua tanya bikin di mana 😍"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, background: '#FF3366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>SD</div>
                <div>
                  <div style={{ fontWeight: 800 }}>Sari Dewi</div>
                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>Ibu dari Alisha (5 th)</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', gap: 4, color: '#FCD34D', marginBottom: 20 }}><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /></div>
              <p style={{ fontSize: 18, lineHeight: 1.6, marginBottom: 24, color: '#E4E4E7' }}>"Tampilan undangan dewasanya elegan banget, kayak undangan brand luxury. Budget tracker-nya sangat membantu mengontrol pengeluaran."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, background: '#3B82F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>KM</div>
                <div>
                  <div style={{ fontWeight: 800 }}>Kevin Mahendra</div>
                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>Ulang Tahun ke-25</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', gap: 4, color: '#FCD34D', marginBottom: 20 }}><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /></div>
              <p style={{ fontSize: 18, lineHeight: 1.6, marginBottom: 24, color: '#E4E4E7' }}>"Fitur tracking alergi benar-benar menyelamatkan! Ada 3 tamu yang alergi kacang dan sistem ini memastikan saya tidak lupa."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>RP</div>
                <div>
                  <div style={{ fontWeight: 800 }}>Rina Putri</div>
                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>Ibu dari Rafi (7 th)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="section-padding">
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 40, textAlign: 'center' }}>
            {t('faq_judul')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FAQS.map((f, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 20, border: '2px dashed #E4E4E7' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '24px', background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-jakarta)', textAlign: 'left'
                }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#18181B' }}>{f.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}>
                    <ChevronDown size={24} color="#FF3366" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <p style={{ padding: '0 24px 24px', color: '#52525B', fontSize: 16, lineHeight: 1.6, margin: 0, fontWeight: 600 }}>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="section-padding" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, background: '#FF3366', filter: 'blur(100px)', opacity: 0.1, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, background: '#4F46E5', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%' }} />

        <div style={{ maxWidth: 1000, margin: '0 auto', background: 'linear-gradient(135deg, rgba(255,51,102,0.95) 0%, rgba(255,153,51,0.95) 100%)', borderRadius: 40, padding: '80px 40px', textAlign: 'center', color: 'white', position: 'relative', boxShadow: '0 40px 80px rgba(255,51,102,0.25), inset 0 0 0 4px rgba(255,255,255,0.2)', overflow: 'hidden', backdropFilter: 'blur(20px)' }}>
          {/* Decorative shapes inside CTA */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)', opacity: 0.5, borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -50, left: -20, width: 200, height: 200, border: '40px solid rgba(255,255,255,0.1)', borderRadius: '50%' }} />

          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: 100, marginBottom: 32, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', fontSize: 14 }}>
              🎉 Mulai Perjalanan Magis Anda
            </div>
            <h2 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 24, lineHeight: 1.1, textShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              Ubah Pesta Impian<br />Menjadi Kenyataan
            </h2>
            <p style={{ fontSize: 22, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 48, maxWidth: 600 }}>
              Bergabunglah dengan ribuan orang yang sudah merasakan kemudahan merencanakan pesta bersama Glyka Party box.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '24px 48px', background: 'white', color: '#FF3366', borderRadius: 100, fontSize: 20, fontWeight: 900, textDecoration: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                Buat Pesta Sekarang <ArrowRight size={24} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#09090B', color: '#A1A1AA', padding: '100px 24px 40px', position: 'relative', overflow: 'hidden' }}>
        {/* Top glossy divider */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 60, marginBottom: 80 }}>
            {/* Brand Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #FF3366, #FF9933)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-10deg)',
                  boxShadow: '0 10px 20px rgba(255,51,102,0.3)'
                }}>
                  <PartyPopper size={28} color="white" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 900, fontSize: 28, color: 'white', letterSpacing: '-0.02em', lineHeight: 1 }}>Vlass</span>
                  <span style={{ fontWeight: 800, fontSize: 14, color: '#FF3366', letterSpacing: '0.05em', textTransform: 'uppercase' }}>PartyBox</span>
                </div>
              </div>
              <p style={{ lineHeight: 1.8, fontSize: 16, maxWidth: 320, color: '#A1A1AA' }}>
                Platform all-in-one super interaktif untuk merencanakan, mengundang, dan mengelola pesta paling berkesan dalam hidup Anda.
              </p>
              {/* Social icons */}
              <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                <Link href="https://instagram.com/vlass.studio" target="_blank" style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </Link>
                <Link href="https://twitter.com/vlass_studio" target="_blank" style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                </Link>
                <Link href="https://youtube.com/@vlass.studio" target="_blank" style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.5 7.1 2 9.5 2 12c0 2.5.5 4.9.5 4.9 0 0 2.5 1.1 9.5 1.1s9.5-1.1 9.5-1.1c0 0 .5-2.4.5-4.9 0-2.5-.5-4.9-.5-4.9 0 0-2.5-1.1-9.5-1.1C5 6 2.5 7.1 2.5 7.1z" /><path d="m9.75 15.02 5.75-3.02-5.75-3.02z" /></svg>
                </Link>
              </div>
            </div>

            {/* Links 1 */}
            <div>
              <h4 style={{ color: 'white', fontWeight: 800, marginBottom: 24, fontSize: 18, letterSpacing: '0.05em' }}>Eksplorasi</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <li><Link href="#features" style={{ color: '#A1A1AA', textDecoration: 'none', fontSize: 16, fontWeight: 500, transition: 'color 0.2s ease' }}>Fitur Utama</Link></li>
                <li><Link href={`/${locale}/gallery`} style={{ color: '#A1A1AA', textDecoration: 'none', fontSize: 16, fontWeight: 500, transition: 'color 0.2s ease' }}>Galeri Desain</Link></li>
                <li><Link href="#pricing" style={{ color: '#A1A1AA', textDecoration: 'none', fontSize: 16, fontWeight: 500, transition: 'color 0.2s ease' }}>Harga Paket</Link></li>
              </ul>
            </div>

            {/* Links 2 */}
            <div>
              <h4 style={{ color: 'white', fontWeight: 800, marginBottom: 24, fontSize: 18, letterSpacing: '0.05em' }}>Bantuan</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <li><Link href="#faq" style={{ color: '#A1A1AA', textDecoration: 'none', fontSize: 16, fontWeight: 500, transition: 'color 0.2s ease' }}>Pusat Bantuan (FAQ)</Link></li>
                <li><a href="mailto:support@vlass.studio" style={{ color: '#A1A1AA', textDecoration: 'none', fontSize: 16, fontWeight: 500, transition: 'color 0.2s ease' }}>Hubungi Tim Support</a></li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <p style={{ margin: 0, fontSize: 16, color: '#71717A', fontWeight: 500, textAlign: 'center', lineHeight: 1.6 }}>
              © 2026 Glyka Party box  - Birthday planning and invitation.<br />
              A product by <strong>Vlass Studio</strong>. Dibuat dengan <Heart size={16} style={{ display: 'inline', color: '#FF3366', margin: '0 4px', verticalAlign: 'text-bottom' }} fill="#FF3366" /> untuk senyum Anda.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
