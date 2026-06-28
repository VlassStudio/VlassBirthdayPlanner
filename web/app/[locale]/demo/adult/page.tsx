'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Clock, ArrowLeft, Check, X, Mail } from 'lucide-react'
import Link from 'next/link'

export default function AdultDemo() {
  const [isOpened, setIsOpened] = useState(false)
  const [rsvpOpen, setRsvpOpen] = useState(false)
  const [rsvpStatus, setRsvpStatus] = useState<null | 'yes' | 'no'>(null)
  const [form, setForm] = useState({ plusOne: false, plusOneName: '', diet: '', drink: 'champagne' })
  const [submitted, setSubmitted] = useState(false)

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#09090B', color: '#FAFAFA', position: 'relative', overflow: 'hidden', fontFamily: 'var(--font-jakarta)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Immersive Background */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100vh', background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.15) 0%, rgba(9,9,11,1) 80%)', pointerEvents: 'none', zIndex: 0 }} />
      
      {/* Decorative corners */}
      <div style={{ position: 'absolute', top: 40, left: 40, width: 60, height: 60, borderTop: '1px solid rgba(212, 175, 55, 0.3)', borderLeft: '1px solid rgba(212, 175, 55, 0.3)', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: 40, right: 40, width: 60, height: 60, borderTop: '1px solid rgba(212, 175, 55, 0.3)', borderRight: '1px solid rgba(212, 175, 55, 0.3)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: 40, left: 40, width: 60, height: 60, borderBottom: '1px solid rgba(212, 175, 55, 0.3)', borderLeft: '1px solid rgba(212, 175, 55, 0.3)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: 40, right: 40, width: 60, height: 60, borderBottom: '1px solid rgba(212, 175, 55, 0.3)', borderRight: '1px solid rgba(212, 175, 55, 0.3)', zIndex: 0 }} />

      {/* Demo Top Bar */}
      <div style={{ padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100, position: 'relative' }}>
        <Link href="/" style={{ color: '#D4AF37', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
          <ArrowLeft size={16} /> KEMBALI
        </Link>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, color: '#A1A1AA', textTransform: 'uppercase' }}>
          PREVIEW UNDANGAN
        </div>
      </div>

      {/* Envelope Opening Experience */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div 
            exit={{ y: '-100vh', opacity: 0, scale: 0.9 }} 
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090B' }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ width: 120, height: 120, margin: '0 auto 40px', position: 'relative' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: 0, border: '1px dashed #D4AF37', borderRadius: '50%', opacity: 0.5 }} />
                <button 
                  onClick={() => setIsOpened(true)}
                  style={{ position: 'absolute', inset: 10, background: '#D4AF37', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 40px rgba(212, 175, 55, 0.4)' }}
                >
                  <Mail color="#09090B" size={32} />
                </button>
              </div>
              <p style={{ color: '#D4AF37', letterSpacing: 6, textTransform: 'uppercase', fontSize: 13, fontWeight: 600, margin: 0 }}>
                Ketuk Untuk Membuka
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <AnimatePresence>
          {isOpened && (
            <motion.div initial={{ opacity: 0, y: 100, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              
              <p style={{ fontSize: 13, color: '#D4AF37', letterSpacing: 6, textTransform: 'uppercase', marginBottom: 24, fontWeight: 600 }}>
                Anda Diundang Ke
              </p>

              <h1 style={{ fontSize: 'clamp(40px, 8vw, 64px)', fontWeight: 400, color: '#FAFAFA', margin: '0 0 16px 0', lineHeight: 1.1, fontFamily: 'serif', fontStyle: 'italic', letterSpacing: '-0.02em' }}>
                Pesta Ulang Tahun ke-30<br/>Jonathan
              </h1>

              <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, rgba(212, 175, 55, 1), rgba(212, 175, 55, 0))', margin: '32px auto' }} />

              <p style={{ color: '#A1A1AA', fontSize: 15, maxWidth: 400, margin: '0 auto 40px', lineHeight: 1.8, fontWeight: 400 }}>
                Bergabunglah untuk malam yang tak terlupakan dengan koktail, musik, dan perayaan untuk menyambut dekade baru.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', marginBottom: 48 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#E4E4E7' }}>
                  <Calendar size={18} color="#D4AF37" />
                  <span style={{ fontSize: 14, letterSpacing: 1 }}>SABTU, 15 OKTOBER 2026</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#E4E4E7' }}>
                  <Clock size={18} color="#D4AF37" />
                  <span style={{ fontSize: 14, letterSpacing: 1 }}>19:00 - SELESAI</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#E4E4E7' }}>
                  <MapPin size={18} color="#D4AF37" />
                  <span style={{ fontSize: 14, letterSpacing: 1 }}>THE GLASSHOUSE LOUNGE</span>
                </div>
              </div>

              <motion.button 
                onClick={() => setRsvpOpen(true)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{ padding: '16px 48px', background: 'transparent', color: '#D4AF37', border: '1px solid #D4AF37', borderRadius: 100, fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                Buka RSVP
              </motion.button>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RSVP Overlay Modal */}
      <AnimatePresence>
        {rsvpOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              style={{ background: '#18181B', width: '100%', maxWidth: 440, borderRadius: 24, padding: 32, position: 'relative', border: '1px solid #27272A', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <button onClick={() => setRsvpOpen(false)} style={{ position: 'absolute', top: 24, right: 24, background: 'transparent', border: 'none', color: '#A1A1AA', cursor: 'pointer' }}>
                <X size={24} />
              </button>

              {!submitted ? (
                <>
                  <h3 style={{ fontSize: 24, fontWeight: 400, color: '#FAFAFA', marginBottom: 8, fontFamily: 'serif', fontStyle: 'italic' }}>Konfirmasi Kehadiran</h3>
                  <p style={{ color: '#A1A1AA', fontSize: 14, marginBottom: 32 }}>Mohon lengkapi formulir di bawah ini.</p>

                  <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                    <button onClick={() => setRsvpStatus('yes')} style={{ flex: 1, padding: '14px', borderRadius: 12, border: `1px solid ${rsvpStatus === 'yes' ? '#D4AF37' : '#27272A'}`, background: rsvpStatus === 'yes' ? 'rgba(212, 175, 55, 0.1)' : '#09090B', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: rsvpStatus === 'yes' ? '#D4AF37' : '#FAFAFA', transition: 'all 0.3s' }}>
                      Hadir 🎉
                    </button>
                    <button onClick={() => setRsvpStatus('no')} style={{ flex: 1, padding: '14px', borderRadius: 12, border: `1px solid ${rsvpStatus === 'no' ? '#71717A' : '#27272A'}`, background: rsvpStatus === 'no' ? '#27272A' : '#09090B', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: rsvpStatus === 'no' ? '#FAFAFA' : '#71717A', transition: 'all 0.3s' }}>
                      Maaf, Tidak
                    </button>
                  </div>

                  <AnimatePresence>
                    {rsvpStatus === 'yes' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                        
                        <div style={{ padding: 16, background: '#09090B', border: '1px solid #27272A', borderRadius: 12, marginBottom: 16 }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: form.plusOne ? 16 : 0 }}>
                            <input type="checkbox" checked={form.plusOne} onChange={e => setForm({...form, plusOne: e.target.checked})} style={{ width: 18, height: 18, accentColor: '#D4AF37' }} />
                            <span style={{ fontSize: 14, fontWeight: 500, color: '#FAFAFA' }}>Membawa Pasangan (+1)</span>
                          </label>
                          {form.plusOne && (
                            <input type="text" placeholder="Nama Pasangan" value={form.plusOneName} onChange={e => setForm({...form, plusOneName: e.target.value})} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #27272A', outline: 'none', background: '#18181B', color: '#FAFAFA', fontSize: 14 }} />
                          )}
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: '#A1A1AA', letterSpacing: 1, marginBottom: 8, display: 'block' }}>DIET / PANTANGAN</label>
                          <input type="text" placeholder="Misal: Vegan, Halal..." value={form.diet} onChange={e => setForm({...form, diet: e.target.value})} style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid #27272A', outline: 'none', background: '#09090B', color: '#FAFAFA', fontSize: 14 }} />
                        </div>

                        <div style={{ marginBottom: 24 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: '#A1A1AA', letterSpacing: 1, marginBottom: 8, display: 'block' }}>PILIHAN MINUMAN</label>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                            {['champagne', 'cocktail', 'mocktail'].map(drink => (
                              <button key={drink} onClick={() => setForm({...form, drink})} style={{ padding: 12, borderRadius: 8, border: `1px solid ${form.drink === drink ? '#D4AF37' : '#27272A'}`, background: form.drink === drink ? 'rgba(212, 175, 55, 0.1)' : '#09090B', color: form.drink === drink ? '#D4AF37' : '#71717A', fontSize: 12, textTransform: 'capitalize', cursor: 'pointer' }}>
                                {drink}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {rsvpStatus && (
                    <motion.button onClick={() => setSubmitted(true)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileTap={{ scale: 0.98 }}
                      style={{ width: '100%', padding: 16, background: '#D4AF37', color: '#09090B', borderRadius: 12, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}
                    >
                      Kirim RSVP
                    </motion.button>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: 64, height: 64, background: '#D4AF37', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#09090B' }}>
                    <Check size={32} />
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 400, color: '#FAFAFA', marginBottom: 12, fontFamily: 'serif', fontStyle: 'italic' }}>RSVP Diterima</h3>
                  <p style={{ color: '#A1A1AA', fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
                    {rsvpStatus === 'yes' ? 'Kami menantikan kehadiran Anda.' : 'Kehadiran Anda akan sangat dirindukan.'}
                  </p>
                  <button onClick={() => setRsvpOpen(false)} style={{ padding: '12px 32px', background: 'transparent', color: '#FAFAFA', borderRadius: 100, border: '1px solid #27272A', fontSize: 12, cursor: 'pointer', letterSpacing: 2, textTransform: 'uppercase' }}>
                    Tutup
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
