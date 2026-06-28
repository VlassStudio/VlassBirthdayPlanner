'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MOCK_KIDS_EVENT, ALLERGY_OPTIONS } from '@/lib/mock-data'

export default function KidsInvitePage() {
  const [opened, setOpened] = useState(false)
  const [rsvpDone, setRsvpDone] = useState(false)
  const [attending, setAttending] = useState<boolean | null>(null)
  const [form, setForm] = useState({ name: '', adults: 1, children: 1, allergies: [] as string[], dropOff: '', message: '' })
  const [step, setStep] = useState<'invite' | 'rsvp' | 'done'>('invite')

  const event = MOCK_KIDS_EVENT
  const theme = event.theme
  const eventDate = new Date(event.event_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      background: `linear-gradient(160deg, ${theme.color_palette.bg} 0%, #E9D5FF 50%, #FCE7F3 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      fontFamily: 'var(--font-jakarta)',
    }}>
      {/* Floating confetti */}
      {['🎈','🌟','✨','🦄','🎀','🎉','💜','🌈'].map((e, i) => (
        <motion.div key={i} animate={{ y: [0, -30, 0], rotate: [0, 20, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, delay: i * 0.5 }}
          style={{ position: 'fixed', fontSize: 28 + (i % 3) * 10, opacity: 0.25,
            top: `${10 + i * 11}%`, left: i % 2 === 0 ? `${3 + i * 2}%` : undefined,
            right: i % 2 === 1 ? `${3 + i * 2}%` : undefined,
            pointerEvents: 'none', zIndex: 0 }} />
      ))}

      {/* ENVELOPE */}
      <AnimatePresence mode="wait">
        {step === 'invite' && (
          <motion.div key="envelope" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0, y: -100 }} transition={{ duration: 0.5 }}
            style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>

            {!opened ? (
              /* Closed envelope */
              <motion.div whileHover={{ scale: 1.03 }} onClick={() => setOpened(true)} style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: 18, color: '#7C3AED', fontWeight: 700, marginBottom: 16 }}>Ketuk untuk membuka undangan 💌</div>

                {/* Envelope body */}
                <div style={{ position: 'relative', width: 340, height: 240, margin: '0 auto' }}>
                  {/* Envelope body */}
                  <div style={{
                    width: '100%', height: '100%', borderRadius: 20,
                    background: 'linear-gradient(135deg, #F3E8FF, #FCE7F3)',
                    border: '3px solid rgba(139,92,246,0.3)',
                    boxShadow: '0 20px 60px rgba(139,92,246,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', gap: 8,
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {/* Envelope flap */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      height: 120, background: 'linear-gradient(160deg, #C084FC, #F472B6)',
                      clipPath: 'polygon(0 0, 100% 0, 50% 65%)',
                    }} />
                    {/* Wax seal */}
                    <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
                      style={{
                        width: 64, height: 64, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 28, boxShadow: '0 4px 15px rgba(236,72,153,0.5)',
                        border: '3px solid rgba(255,255,255,0.5)', position: 'relative', zIndex: 1,
                      }}>🦄</motion.div>
                    <div style={{ fontSize: 14, color: '#7C3AED', fontWeight: 700, position: 'relative', zIndex: 1 }}>
                      You're Invited! ✨
                    </div>
                  </div>
                </div>

                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ marginTop: 20, fontSize: 28 }}>👆</motion.div>
              </motion.div>
            ) : (
              /* Opened — invitation card slides up */
              <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, type: 'spring' }}>
                <div style={{
                  width: 380, background: 'white', borderRadius: 28,
                  boxShadow: '0 30px 80px rgba(139,92,246,0.3)',
                  overflow: 'hidden', border: '3px solid rgba(236,72,153,0.2)',
                }}>
                  {/* Card header */}
                  <div style={{
                    background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                    padding: '36px 28px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden',
                  }}>
                    {['✨','🌟','💫','⭐','🎀'].map((e, i) => (
                      <div key={i} style={{ position: 'absolute', top: `${10+i*15}%`, left: `${5+i*18}%`, fontSize: 18, opacity: 0.35 }}>{e}</div>
                    ))}
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: 64, marginBottom: 12 }}>🦄</motion.div>
                    <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Anda diundang ke ulang tahun</div>
                    <h1 style={{ color: 'white', fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 4 }}>{event.celebrant_name}</h1>
                    <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, fontWeight: 600 }}>Merayakan Hari Ulang Tahun ke-{event.celebrant_age}! 🎂</div>
                  </div>

                  {/* Card details */}
                  <div style={{ padding: '24px 28px' }}>
                    {[
                      { icon: '📅', label: 'Tanggal', value: eventDate },
                      { icon: '⏰', label: 'Waktu', value: event.event_time + ' WIB' },
                      { icon: '📍', label: 'Tempat', value: event.location_name },
                    ].map((d, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px dashed rgba(236,72,153,0.2)' : 'none' }}>
                        <div style={{ fontSize: 20, flexShrink: 0 }}>{d.icon}</div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#EC4899', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d.label}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1F0A12' }}>{d.value}</div>
                        </div>
                      </div>
                    ))}

                    {event.invite_message && (
                      <div style={{ background: '#FDF4FF', borderRadius: 12, padding: '12px 14px', margin: '12px 0', border: '1px dashed rgba(139,92,246,0.3)' }}>
                        <p style={{ fontSize: 13, color: '#7C3AED', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>"{event.invite_message}"</p>
                      </div>
                    )}

                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setStep('rsvp')}
                      style={{
                        width: '100%', padding: '14px', marginTop: 8,
                        background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', color: 'white',
                        border: 'none', borderRadius: 14, fontWeight: 800, fontSize: 16,
                        cursor: 'pointer', fontFamily: 'var(--font-jakarta)',
                        boxShadow: '0 4px 20px rgba(236,72,153,0.4)',
                      }}>
                      🎉 Konfirmasi Kehadiran (RSVP)
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* RSVP FORM */}
        {step === 'rsvp' && (
          <motion.div key="rsvp" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
            <div style={{ background: 'white', borderRadius: 28, padding: 32, boxShadow: '0 20px 60px rgba(139,92,246,0.25)', border: '3px solid rgba(236,72,153,0.2)' }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📝</div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1F0A12', marginBottom: 4 }}>Konfirmasi Kehadiran</h2>
                <p style={{ fontSize: 14, color: '#71717A' }}>untuk ulang tahun {event.celebrant_name} ke-{event.celebrant_age} 🦄</p>
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                {[
                  { val: true, label: '🎉 Dengan senang hati hadir!', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
                  { val: false, label: '😢 Maaf, tidak bisa hadir', color: '#EF4444', bg: '#FEF2F2', border: '#FCA5A5' },
                ].map(o => (
                  <motion.button key={String(o.val)} whileTap={{ scale: 0.97 }} onClick={() => setAttending(o.val)}
                    style={{
                      flex: 1, padding: '12px 8px', borderRadius: 12, border: `2px solid ${attending === o.val ? o.border : '#e4e4e7'}`,
                      background: attending === o.val ? o.bg : 'white', cursor: 'pointer',
                      fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 12, color: attending === o.val ? o.color : '#71717A',
                    }}>
                    {o.label}
                  </motion.button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6, color: '#1F0A12' }}>Nama Anda *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Nama orang tua / wali"
                    style={{ width: '100%', padding: '11px 14px', border: '2px solid rgba(236,72,153,0.2)', borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-jakarta)', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>Jumlah Anak</label>
                    <input type="number" min={0} value={form.children} onChange={e => setForm(p => ({ ...p, children: +e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '2px solid rgba(236,72,153,0.2)', borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-jakarta)', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>Jumlah Dewasa</label>
                    <input type="number" min={0} value={form.adults} onChange={e => setForm(p => ({ ...p, adults: +e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', border: '2px solid rgba(236,72,153,0.2)', borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-jakarta)', outline: 'none' }} />
                  </div>
                </div>

                {attending && (
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>Alergi / Pantangan Makanan <span style={{ color: '#EF4444' }}>⚠️</span></label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {ALLERGY_OPTIONS.map(a => (
                        <motion.button key={a} whileTap={{ scale: 0.95 }}
                          onClick={() => setForm(p => ({ ...p, allergies: p.allergies.includes(a) ? p.allergies.filter(x => x !== a) : [...p.allergies, a] }))}
                          style={{
                            padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                            border: '1.5px solid', cursor: 'pointer', fontFamily: 'var(--font-jakarta)',
                            borderColor: form.allergies.includes(a) ? '#EF4444' : 'rgba(236,72,153,0.2)',
                            background: form.allergies.includes(a) ? '#FEF2F2' : 'white',
                            color: form.allergies.includes(a) ? '#B91C1C' : '#71717A',
                          }}>
                          {a}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {attending && event.drop_off_allowed && (
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>Apakah anak akan diantar saja? 🚗</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[
                        { val: 'yes', label: '🚗 Ya, diantar saja', color: '#F59E0B' },
                        { val: 'no', label: '👪 Tidak, saya menemani', color: '#8B5CF6' },
                      ].map(o => (
                        <motion.button key={o.val} whileTap={{ scale: 0.97 }} onClick={() => setForm(p => ({ ...p, dropOff: o.val }))}
                          style={{
                            flex: 1, padding: '10px 8px', borderRadius: 10, border: `2px solid ${form.dropOff === o.val ? o.color : '#e4e4e7'}`,
                            background: form.dropOff === o.val ? `${o.color}15` : 'white', cursor: 'pointer',
                            fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 12, color: form.dropOff === o.val ? o.color : '#71717A',
                          }}>
                          {o.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>Pesan untuk tuan rumah (opsional) 💌</label>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Selamat ulang tahun, semoga bahagia selalu! 🎉"
                    rows={3} style={{ width: '100%', padding: '11px 14px', border: '2px solid rgba(236,72,153,0.2)', borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-jakarta)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setStep('done')}
                style={{
                  width: '100%', marginTop: 20, padding: '14px',
                  background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', color: 'white',
                  border: 'none', borderRadius: 14, fontWeight: 800, fontSize: 16,
                  cursor: 'pointer', fontFamily: 'var(--font-jakarta)',
                  boxShadow: '0 4px 20px rgba(236,72,153,0.4)',
                }}>
                Kirim Konfirmasi 🎊
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* DONE */}
        {step === 'done' && (
          <motion.div key="done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <motion.div animate={{ scale: [1, 1.3, 1], rotate: [0, 20, -20, 0] }} transition={{ duration: 0.8 }} style={{ fontSize: 80, marginBottom: 20 }}>🎊</motion.div>
            <div style={{ background: 'white', borderRadius: 28, padding: '36px 40px', boxShadow: '0 20px 60px rgba(139,92,246,0.25)', maxWidth: 380 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1F0A12', marginBottom: 8 }}>Terima kasih, {form.name}! 💕</h2>
              <p style={{ color: '#71717A', marginBottom: 20, lineHeight: 1.6 }}>
                Konfirmasi kehadiran Anda telah kami terima. {form.allergies.length > 0 && 'Kami sudah mencatat pantangan makanan Anda.'} Sampai jumpa di pesta Alisha! 🦄
              </p>
              <div style={{ background: '#FDF4FF', borderRadius: 14, padding: '14px', marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#7C3AED' }}>📅 Simpan di kalender</div>
                <div style={{ fontSize: 13, color: '#71717A', marginTop: 4 }}>{eventDate}</div>
              </div>
              <button style={{ width: '100%', padding: '12px', background: '#25D366', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>
                💬 Bagikan via WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
