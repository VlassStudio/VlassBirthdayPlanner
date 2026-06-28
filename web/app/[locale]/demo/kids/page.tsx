'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Clock, ArrowLeft, PartyPopper, Check, X } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export default function KidsDemo() {
  const [isOpened, setIsOpened] = useState(false)
  const [rsvpOpen, setRsvpOpen] = useState(false)
  const [rsvpStatus, setRsvpStatus] = useState<null | 'yes' | 'no'>(null)
  const [form, setForm] = useState({ adults: 1, children: 1, diet: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleOpen = () => {
    setIsOpened(true)
    const duration = 3000
    const end = Date.now() + duration
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FF3366', '#FF9933', '#10B981', '#3B82F6', '#A855F7'] })
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FF3366', '#FF9933', '#10B981', '#3B82F6', '#A855F7'] })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#FFF0F5', overflow: 'hidden', position: 'relative', fontFamily: 'var(--font-jakarta)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Decorative Floating Elements */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }} transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 20}%`, fontSize: 'clamp(30px, 5vw, 60px)', opacity: 0.6 }}>
            {['🎈', '🦄', '🎉', '🎁', '✨', '🎂'][i]}
          </motion.div>
        ))}
        {/* Colorful blobs */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '40vw', height: '40vw', background: '#FF3366', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2 }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '40vw', height: '40vw', background: '#3B82F6', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2 }} />
      </div>

      {/* Top Navigation */}
      <div style={{ padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100, position: 'relative' }}>
        <Link href="/" style={{ color: '#FF3366', textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800 }}>
          <ArrowLeft size={18} strokeWidth={3} /> KEMBALI
        </Link>
        <div style={{ background: 'white', padding: '8px 16px', borderRadius: 100, fontSize: 12, fontWeight: 800, color: '#FF3366', boxShadow: '0 4px 12px rgba(255,51,102,0.1)' }}>
          PREVIEW DEMO
        </div>
      </div>

      {/* Gift Box Opening Experience */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, rgba(255,255,255,0.98) 0%, rgba(255,228,235,0.98) 100%)', willChange: 'opacity' }}
          >
            {/* Pulsing glow behind the gift */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: 'absolute', width: 300, height: 300, background: '#FF3366', borderRadius: '50%', filter: 'blur(60px)' }}
            />
            
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
              style={{ textAlign: 'center', position: 'relative' }}
            >
              {/* Dancing stars around the gift */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: -50, pointerEvents: 'none' }}>
                <span style={{ position: 'absolute', top: 0, left: '50%', fontSize: 30 }}>✨</span>
                <span style={{ position: 'absolute', bottom: 0, left: '20%', fontSize: 40 }}>🌟</span>
                <span style={{ position: 'absolute', top: '40%', right: -20, fontSize: 35 }}>⭐</span>
              </motion.div>

              <motion.button 
                onClick={handleOpen}
                animate={{ rotate: [-8, 8, -8], y: [0, -10, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                style={{ background: 'none', border: 'none', fontSize: 160, cursor: 'pointer', marginBottom: 30, filter: 'drop-shadow(0 30px 40px rgba(255,51,102,0.4))' }}
              >
                🎁
              </motion.button>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h1 style={{ color: '#FF3366', fontSize: 32, fontWeight: 900, margin: 0, textShadow: '0 4px 12px rgba(255,51,102,0.2)' }}>
                  YAY! ADA UNDANGAN!
                </h1>
                <h2 style={{ color: '#52525B', fontSize: 18, fontWeight: 700, background: 'white', padding: '12px 32px', borderRadius: 100, boxShadow: '0 10px 20px rgba(0,0,0,0.05)', display: 'inline-block', margin: '0 auto' }}>
                  Ketuk kado di atas untuk membuka ✨
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 10, position: 'relative' }}>
        <AnimatePresence>
          {isOpened && (
            <motion.div 
              initial={{ y: 200, scale: 0.5, opacity: 0, rotate: -10 }} 
              animate={{ y: 0, scale: 1, opacity: 1, rotate: 0 }} 
              transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 0.2 }}
              style={{ background: 'white', width: '100%', maxWidth: 480, borderRadius: 40, padding: 40, boxShadow: '0 30px 60px rgba(255,51,102,0.15), 0 0 0 12px rgba(255,255,255,0.5)', textAlign: 'center', position: 'relative' }}
            >
              
              <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', background: '#FF3366', color: 'white', padding: '12px 24px', borderRadius: 100, fontSize: 14, fontWeight: 900, boxShadow: '0 10px 20px rgba(255,51,102,0.3)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8 }}>
                <PartyPopper size={18} /> YAYYY! PARTY TIME!
              </div>

              <h1 style={{ fontSize: 'clamp(36px, 6vw, 48px)', fontWeight: 900, color: '#18181B', margin: '40px 0 16px 0', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                Chloe is<br/>Turning <span style={{ color: '#FF3366' }}>5!</span>
              </h1>

              <p style={{ fontSize: 16, color: '#71717A', marginBottom: 32, fontWeight: 500, lineHeight: 1.6 }}>
                Ayo datang dan rayakan ulang tahun Chloe dengan banyak kue, mainan, dan kegembiraan!
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
                <div style={{ background: '#F4F4F5', padding: 16, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, background: 'white', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF3366' }}>
                    <Calendar size={24} strokeWidth={2.5} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#A1A1AA', textTransform: 'uppercase' }}>Tanggal</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#18181B' }}>Minggu, 12 Agustus 2026</div>
                  </div>
                </div>

                <div style={{ background: '#F4F4F5', padding: 16, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, background: 'white', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                    <Clock size={24} strokeWidth={2.5} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#A1A1AA', textTransform: 'uppercase' }}>Waktu</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#18181B' }}>14:00 - 17:00 WIB</div>
                  </div>
                </div>

                <div style={{ background: '#F4F4F5', padding: 16, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, background: 'white', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                    <MapPin size={24} strokeWidth={2.5} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#A1A1AA', textTransform: 'uppercase' }}>Lokasi</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#18181B' }}>Kidzania Playground, Lt. 3</div>
                  </div>
                </div>
              </div>

              <motion.button 
                onClick={() => setRsvpOpen(true)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{ width: '100%', padding: 20, background: '#FF3366', color: 'white', border: 'none', borderRadius: 24, fontSize: 18, fontWeight: 900, cursor: 'pointer', boxShadow: '0 20px 40px rgba(255,51,102,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                RSVP SEKARANG! 🎈
              </motion.button>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RSVP Modal Overlay */}
      <AnimatePresence>
        {rsvpOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          >
            <motion.div 
              initial={{ y: 100, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 100, opacity: 0, scale: 0.9 }}
              style={{ background: 'white', width: '100%', maxWidth: 440, borderRadius: 32, padding: 32, position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.1)', border: '4px solid #FFE5EC', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <button onClick={() => setRsvpOpen(false)} style={{ position: 'absolute', top: 24, right: 24, background: '#F4F4F5', border: 'none', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717A', cursor: 'pointer' }}>
                <X size={20} strokeWidth={3} />
              </button>

              {!submitted ? (
                <>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>💌</div>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: '#18181B', marginBottom: 8 }}>Yay! Konfirmasi Kehadiran</h3>
                  <p style={{ color: '#71717A', fontSize: 14, marginBottom: 32, fontWeight: 500 }}>Beri tahu kami apakah kamu bisa datang bermain bersama Chloe!</p>

                  <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                    <button onClick={() => setRsvpStatus('yes')} style={{ flex: 1, padding: '16px', borderRadius: 20, border: `3px solid ${rsvpStatus === 'yes' ? '#FF3366' : '#F4F4F5'}`, background: rsvpStatus === 'yes' ? '#FFF0F5' : 'white', fontWeight: 800, fontSize: 16, cursor: 'pointer', color: rsvpStatus === 'yes' ? '#FF3366' : '#A1A1AA', transition: 'all 0.2s' }}>
                      Pasti Datang! 🥳
                    </button>
                    <button onClick={() => setRsvpStatus('no')} style={{ flex: 1, padding: '16px', borderRadius: 20, border: `3px solid ${rsvpStatus === 'no' ? '#71717A' : '#F4F4F5'}`, background: rsvpStatus === 'no' ? '#F4F4F5' : 'white', fontWeight: 800, fontSize: 16, cursor: 'pointer', color: rsvpStatus === 'no' ? '#18181B' : '#A1A1AA', transition: 'all 0.2s' }}>
                      Yah, Gak Bisa 😢
                    </button>
                  </div>

                  <AnimatePresence>
                    {rsvpStatus === 'yes' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                        
                        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 12, fontWeight: 800, color: '#A1A1AA', marginBottom: 8, display: 'block' }}>Jumlah Anak</label>
                            <input type="number" min="1" value={form.children} onChange={e => setForm({...form, children: parseInt(e.target.value)})} style={{ width: '100%', padding: 16, borderRadius: 16, border: '2px solid #F4F4F5', outline: 'none', fontSize: 16, fontWeight: 700, color: '#18181B' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 12, fontWeight: 800, color: '#A1A1AA', marginBottom: 8, display: 'block' }}>Jumlah Dewasa</label>
                            <input type="number" min="1" value={form.adults} onChange={e => setForm({...form, adults: parseInt(e.target.value)})} style={{ width: '100%', padding: 16, borderRadius: 16, border: '2px solid #F4F4F5', outline: 'none', fontSize: 16, fontWeight: 700, color: '#18181B' }} />
                          </div>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                          <label style={{ fontSize: 12, fontWeight: 800, color: '#A1A1AA', marginBottom: 8, display: 'block' }}>Catatan Alergi Makanan</label>
                          <input type="text" placeholder="Kacang, Seafood, dll (Opsional)" value={form.diet} onChange={e => setForm({...form, diet: e.target.value})} style={{ width: '100%', padding: 16, borderRadius: 16, border: '2px solid #F4F4F5', outline: 'none', fontSize: 14, fontWeight: 600, color: '#18181B' }} />
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>

                  {rsvpStatus && (
                    <motion.button onClick={() => setSubmitted(true)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileTap={{ scale: 0.95 }}
                      style={{ width: '100%', padding: 20, background: '#FF3366', color: 'white', borderRadius: 20, fontWeight: 900, fontSize: 16, border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255,51,102,0.3)' }}
                    >
                      Kirim Jawaban! 🚀
                    </motion.button>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: 80, height: 80, background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'white', boxShadow: '0 10px 20px rgba(16,185,129,0.3)' }}>
                    <Check size={40} strokeWidth={3} />
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: '#18181B', marginBottom: 12 }}>Hore! Pesan Terkirim!</h3>
                  <p style={{ color: '#71717A', fontSize: 15, marginBottom: 32, fontWeight: 500, lineHeight: 1.6 }}>
                    {rsvpStatus === 'yes' ? 'Sampai jumpa di pesta Chloe! Jangan lupa bawa semangat bermainmu!' : 'Wah sayang sekali, semoga kita bisa bermain bersama di lain waktu ya!'}
                  </p>
                  <button onClick={() => setRsvpOpen(false)} style={{ padding: '16px 32px', background: '#F4F4F5', color: '#18181B', borderRadius: 100, border: 'none', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
                    Tutup Kartu
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
