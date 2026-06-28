'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MOCK_ADULT_EVENT, DIETARY_OPTIONS } from '@/lib/mock-data'

export default function AdultInvitePage() {
  const [step, setStep] = useState<'envelope' | 'card' | 'rsvp' | 'done'>('envelope')
  const [attending, setAttending] = useState<boolean | null>(null)
  const [form, setForm] = useState({ name: '', adults: 1, dietary: '', restrictions: '', message: '' })
  const event = MOCK_ADULT_EVENT
  const eventDate = new Date(event.event_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #0A0F1E 0%, #0F0A2A 40%, #1a0533 80%, #0A0F1E 100%)',
      padding: '20px', fontFamily: 'var(--font-jakarta)', position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle stars */}
      {[...Array(40)].map((_, i) => (
        <motion.div key={i} animate={{ opacity: [0.1, 0.6, 0.1] }} transition={{ duration: 2 + (i % 5), repeat: Infinity, delay: i * 0.15 }}
          style={{
            position: 'fixed', width: i % 5 === 0 ? 3 : 1.5, height: i % 5 === 0 ? 3 : 1.5,
            borderRadius: '50%', background: 'white',
            top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
            pointerEvents: 'none',
          }} />
      ))}
      {/* Subtle gold glow */}
      <div style={{ position: 'fixed', top: '20%', left: '30%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '20%', right: '25%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <AnimatePresence mode="wait">
        {/* ENVELOPE */}
        {step === 'envelope' && (
          <motion.div key="env" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, y: -80 }} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>

            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
              style={{ fontSize: 13, color: 'rgba(201,168,76,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 28, fontWeight: 500 }}>
              Tap to open your invitation
            </motion.div>

            <motion.div whileHover={{ scale: 1.04, boxShadow: '0 30px 80px rgba(201,168,76,0.3)' }}
              whileTap={{ scale: 0.97 }} onClick={() => setStep('card')} style={{ cursor: 'pointer' }}>
              {/* Envelope SVG-style */}
              <div style={{
                width: 360, height: 250, margin: '0 auto', borderRadius: 16, position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(160deg, #1B1740, #0F0A2A)',
                border: '1px solid rgba(201,168,76,0.3)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.1)',
              }}>
                {/* Envelope flap */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 130,
                  background: 'linear-gradient(160deg, #16133D, #1B1750)',
                  clipPath: 'polygon(0 0, 100% 0, 50% 62%)',
                  borderBottom: '1px solid rgba(201,168,76,0.2)',
                }} />
                {/* Gold seal */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -40%)',
                  width: 70, height: 70, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #C9A84C, #F59E0B)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
                  boxShadow: '0 0 30px rgba(201,168,76,0.5)',
                  border: '3px solid rgba(255,255,255,0.2)',
                }}>
                  👑
                </div>
                <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center', fontSize: 13, color: 'rgba(201,168,76,0.7)', fontWeight: 500, letterSpacing: '0.1em' }}>
                  {event.event_title}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* INVITATION CARD */}
        {step === 'card' && (
          <motion.div key="card" initial={{ opacity: 0, y: 60, rotateX: -15 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -60 }} transition={{ duration: 0.7, type: 'spring' }}
            style={{ position: 'relative', zIndex: 1 }}>

            <div style={{
              width: 380, background: 'linear-gradient(160deg, #1B1740, #0F0A2A)',
              borderRadius: 24, border: '1px solid rgba(201,168,76,0.25)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.1)',
              overflow: 'hidden',
            }}>
              {/* Top accent line */}
              <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />

              {/* Header */}
              <div style={{ padding: '36px 32px 28px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 11, color: '#C9A84C', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 20, fontWeight: 600 }}>
                  You are cordially invited to
                </div>
                <h1 style={{ fontSize: 30, fontWeight: 900, color: 'white', letterSpacing: '-0.04em', marginBottom: 6 }}>
                  {event.event_title}
                </h1>
                <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)', margin: '16px auto' }} />
                <div style={{ fontSize: 14, color: 'rgba(201,168,76,0.8)', fontStyle: 'italic' }}>
                  A milestone evening to remember
                </div>
              </div>

              {/* Details */}
              <div style={{ padding: '24px 32px' }}>
                {[
                  { icon: '📅', label: 'Date', value: eventDate },
                  { icon: '⏰', label: 'Time', value: event.event_time + ' WIB' },
                  { icon: '📍', label: 'Venue', value: event.location_name },
                  { icon: '👔', label: 'Dress Code', value: event.dress_code },
                ].map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 18, flexShrink: 0, opacity: 0.8 }}>{d.icon}</span>
                    <div>
                      <div style={{ fontSize: 10, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{d.label}</div>
                      <div style={{ fontSize: 14, color: '#E2E8F0', fontWeight: 500, marginTop: 2 }}>{d.value}</div>
                    </div>
                  </div>
                ))}

                {event.invite_message && (
                  <div style={{ background: 'rgba(201,168,76,0.06)', borderRadius: 12, padding: '14px 16px', margin: '16px 0', border: '1px solid rgba(201,168,76,0.15)', borderLeft: '3px solid #C9A84C' }}>
                    <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>"{event.invite_message}"</p>
                  </div>
                )}

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setStep('rsvp')}
                  style={{
                    width: '100%', padding: '14px', marginTop: 8,
                    background: 'linear-gradient(135deg, #C9A84C, #F59E0B)', color: '#78350F',
                    border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15,
                    cursor: 'pointer', fontFamily: 'var(--font-jakarta)',
                    boxShadow: '0 4px 20px rgba(201,168,76,0.35)',
                  }}>
                  RSVP Now
                </motion.button>
              </div>

              {/* Bottom accent */}
              <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
            </div>
          </motion.div>
        )}

        {/* RSVP FORM */}
        {step === 'rsvp' && (
          <motion.div key="rsvp-adult" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
            <div style={{
              background: 'linear-gradient(160deg, #1B1740, #0F0A2A)',
              borderRadius: 24, padding: 32, border: '1px solid rgba(201,168,76,0.2)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
            }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: '#C9A84C', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>RSVP</div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{event.event_title}</h2>
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                {[
                  { val: true, label: 'Joyfully Accept 🥂', color: '#10B981' },
                  { val: false, label: 'Regretfully Decline', color: '#64748B' },
                ].map(o => (
                  <motion.button key={String(o.val)} whileTap={{ scale: 0.97 }} onClick={() => setAttending(o.val)}
                    style={{
                      flex: 1, padding: '12px 8px', borderRadius: 10,
                      border: `1px solid ${attending === o.val ? o.color : 'rgba(255,255,255,0.08)'}`,
                      background: attending === o.val ? `${o.color}18` : 'rgba(255,255,255,0.04)',
                      cursor: 'pointer', fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 13,
                      color: attending === o.val ? o.color : '#64748B',
                    }}>
                    {o.label}
                  </motion.button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Full Name</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name"
                    style={{ width: '100%', padding: '11px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-jakarta)', outline: 'none', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Number of Guests</label>
                  <input type="number" min={1} value={form.adults} onChange={e => setForm(p => ({ ...p, adults: +e.target.value }))}
                    style={{ width: '100%', padding: '11px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-jakarta)', outline: 'none', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dietary Preference</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {DIETARY_OPTIONS.map(d => (
                      <motion.button key={d} whileTap={{ scale: 0.95 }} onClick={() => setForm(p => ({ ...p, dietary: p.dietary === d ? '' : d }))}
                        style={{
                          padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                          border: `1px solid ${form.dietary === d ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
                          background: form.dietary === d ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)',
                          color: form.dietary === d ? '#C9A84C' : '#64748B',
                          cursor: 'pointer', fontFamily: 'var(--font-jakarta)',
                        }}>
                        {d}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Message to Host (optional)</label>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Looking forward to celebrating with you..."
                    rows={2} style={{ width: '100%', padding: '11px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-jakarta)', outline: 'none', resize: 'vertical', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setStep('done')}
                style={{
                  width: '100%', marginTop: 20, padding: '14px',
                  background: 'linear-gradient(135deg, #C9A84C, #F59E0B)', color: '#78350F',
                  border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15,
                  cursor: 'pointer', fontFamily: 'var(--font-jakarta)',
                  boxShadow: '0 4px 20px rgba(201,168,76,0.4)',
                }}>
                Submit RSVP
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* DONE */}
        {step === 'done' && (
          <motion.div key="done-adult" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: 380, width: '100%' }}>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8 }} style={{ fontSize: 60, marginBottom: 20 }}>🥂</motion.div>
            <div style={{
              background: 'linear-gradient(160deg, #1B1740, #0F0A2A)', borderRadius: 24, padding: '36px 32px',
              border: '1px solid rgba(201,168,76,0.25)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: 8 }}>Thank you, {form.name}! ✨</h2>
              <p style={{ color: '#94A3B8', marginBottom: 20, lineHeight: 1.7, fontSize: 14 }}>
                Your RSVP has been confirmed. We look forward to celebrating this special evening with you.
              </p>
              <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#C9A84C', marginBottom: 4 }}>📅 Add to Calendar</div>
                <div style={{ fontSize: 13, color: '#94A3B8' }}>{eventDate} · {event.event_time} · {event.location_name}</div>
              </div>
              <button style={{ width: '100%', padding: '12px', background: '#25D366', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>
                Share via WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
