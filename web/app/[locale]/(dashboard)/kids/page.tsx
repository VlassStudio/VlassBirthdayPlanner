'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Users, CheckSquare, Gift, AlertTriangle, Calendar, Sparkles, ArrowRight, Clock, Baby } from 'lucide-react'
import {
  MOCK_KIDS_EVENT, MOCK_KIDS_RSVPS, MOCK_KIDS_CHECKLIST,
  MOCK_KIDS_VENDORS, MOCK_AI_SUGGESTIONS_KIDS, MOCK_NOTIFICATIONS,
} from '@/lib/mock-data'

const C = { primary: '#EC4899', secondary: '#8B5CF6', accent: '#FCD34D', bg: '#FFF5FB', muted: '#9F6B7E' }

function getDaysUntil(date: string) {
  const diff = new Date(date).getTime() - Date.now()
  return Math.ceil(diff / 86400000)
}

export default function KidsDashboardPage() {
  const [dismissedAI, setDismissedAI] = useState<string[]>([])
  const days = getDaysUntil(MOCK_KIDS_EVENT.event_date)
  const rsvps = MOCK_KIDS_RSVPS
  const attending = rsvps.filter(r => r.status === 'attending')
  const declined = rsvps.filter(r => r.status === 'declined')
  const pending = rsvps.filter(r => r.status === 'pending')
  const allergyGuests = rsvps.filter(r => r.allergies.length > 0)
  const totalKids = attending.reduce((a, r) => a + r.num_children, 0)
  const totalAdults = attending.reduce((a, r) => a + r.num_adults, 0)
  const dropOffCount = attending.filter(r => r.will_drop_off).length
  const completed = MOCK_KIDS_CHECKLIST.filter(c => c.is_completed).length
  const total = MOCK_KIDS_CHECKLIST.length
  const pct = Math.round((completed / total) * 100)
  const recentNotifs = MOCK_NOTIFICATIONS.filter(n => n.event_id === MOCK_KIDS_EVENT.id).slice(0, 3)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: 36 }}>🦄</motion.div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1F0A12', letterSpacing: '-0.03em', marginBottom: 2 }}>
              Halo, {MOCK_KIDS_EVENT.celebrant_name.split(' ')[0]} siap berpesta! 🎉
            </h1>
            <p style={{ color: C.muted, fontSize: 14 }}>
              📅 {new Date(MOCK_KIDS_EVENT.event_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · 📍 {MOCK_KIDS_EVENT.location_name}
            </p>
          </div>
        </div>
      </div>

      {/* Countdown + Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, marginBottom: 24 }}>
        {/* Countdown */}
        <motion.div whileHover={{ scale: 1.02 }} style={{
          background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
          borderRadius: 24, padding: '24px 20px', textAlign: 'center',
          boxShadow: '0 8px 30px rgba(236,72,153,0.35)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 80, opacity: 0.15 }}>🎈</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              style={{ fontSize: 52, fontWeight: 900, color: 'white', lineHeight: 1 }}>
              {days}
            </motion.div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600, marginTop: 4 }}>Hari Lagi! 🎊</div>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 6 }}>Pesta {MOCK_KIDS_EVENT.event_title}</div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            { label: 'Konfirmasi Hadir', val: attending.length, icon: '✅', sub: `${totalKids} anak · ${totalAdults} dewasa`, color: '#10B981', bg: '#D1FAE5' },
            { label: 'Belum Konfirmasi', val: pending.length, icon: '⏳', sub: `dari ${rsvps.length} total undangan`, color: '#F59E0B', bg: '#FEF3C7' },
            { label: 'Diantar / Drop-off', val: dropOffCount, icon: '🚗', sub: `${attending.length - dropOffCount} orang tua menemani`, color: '#8B5CF6', bg: '#EDE9FE' },
            { label: 'Menolak', val: declined.length, icon: '❌', sub: 'tidak bisa hadir', color: '#EF4444', bg: '#FEE2E2' },
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -3 }} style={{
              background: 'white', borderRadius: 18, padding: '16px 18px',
              border: `2px solid ${s.bg}`, boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#18181b', marginTop: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: '#71717A', marginTop: 2 }}>{s.sub}</div>
                </div>
                <div style={{ fontSize: 28 }}>{s.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ALLERGY ALERT — Critical feature */}
      {allergyGuests.length > 0 && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{
          background: 'linear-gradient(135deg, #FFF1F2, #FFF5EB)',
          border: '2px solid #FCA5A5', borderRadius: 20, padding: '20px 24px', marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 28 }}>⚠️</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#B91C1C' }}>Peringatan Alergi & Pantangan Makanan!</div>
              <div style={{ fontSize: 13, color: '#DC2626' }}>{allergyGuests.length} tamu memiliki alergi atau pantangan makanan — mohon diperhatikan!</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {allergyGuests.map(r => (
              <div key={r.id} style={{
                background: 'white', borderRadius: 10, padding: '8px 14px',
                border: '1.5px solid #FCA5A5', fontSize: 13,
              }}>
                <span style={{ fontWeight: 700, color: '#B91C1C' }}>{r.child_names[0] || r.guest_name.split(' ')[0]}</span>
                <span style={{ color: '#71717A' }}> · </span>
                <span style={{ color: '#DC2626' }}>{r.allergies.join(', ')}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: '#DC2626', fontWeight: 600 }}>
            💡 Tip: Beritahu pihak katering dan siapkan label makanan yang jelas pada setiap hidangan.
          </div>
        </motion.div>
      )}

      {/* Checklist Progress + AI + Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Checklist */}
        <div style={{ background: 'white', borderRadius: 20, padding: 24, border: '2px solid rgba(236,72,153,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1F0A12' }}>📋 Progress Checklist</h3>
            <Link href="/kids/checklist" style={{ fontSize: 12, color: C.primary, fontWeight: 700, textDecoration: 'none' }}>Lihat Semua →</Link>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: C.muted }}>{completed} dari {total} tugas selesai</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: C.primary }}>{pct}%</span>
            </div>
            <div style={{ height: 10, background: '#FCE7F3', borderRadius: 100, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #EC4899, #8B5CF6)', borderRadius: 100 }} />
            </div>
          </div>
          {MOCK_KIDS_CHECKLIST.filter(c => !c.is_completed).slice(0, 4).map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px dashed rgba(236,72,153,0.15)', fontSize: 13 }}>
              <div style={{ width: 18, height: 18, borderRadius: 6, border: '2px solid rgba(236,72,153,0.4)', flexShrink: 0 }} />
              <span style={{ color: '#3f3f46' }}>{c.title}</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: C.muted, background: '#FDF2F8', padding: '2px 8px', borderRadius: 6, flexShrink: 0 }}>
                {c.period === '2_weeks' ? '2 minggu' : c.period === '1_week' ? '1 minggu' : c.period === '3_days' ? '3 hari' : 'Hari H'}
              </span>
            </div>
          ))}
        </div>

        {/* AI Suggestions */}
        <div style={{ background: 'white', borderRadius: 20, padding: 24, border: '2px solid rgba(139,92,246,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={14} color="white" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1F0A12' }}>AI Party Planner 🤖</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MOCK_AI_SUGGESTIONS_KIDS.filter(s => !dismissedAI.includes(s.id)).map(s => (
              <motion.div key={s.id} layout style={{
                background: '#F5F3FF', borderRadius: 12, padding: '12px 14px',
                border: '1px solid rgba(139,92,246,0.2)',
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#8B5CF6', marginBottom: 4 }}>{s.category}</div>
                <div style={{ fontSize: 12, color: '#3f3f46', lineHeight: 1.5, marginBottom: 8 }}>{s.suggestion}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ fontSize: 11, fontWeight: 700, color: '#8B5CF6', background: 'white', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
                    {s.action}
                  </button>
                  <button onClick={() => setDismissedAI(p => [...p, s.id])} style={{ fontSize: 11, color: '#71717A', background: 'none', border: 'none', cursor: 'pointer' }}>Abaikan</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Vendors + Invite Link */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Vendors */}
        <div style={{ background: 'white', borderRadius: 20, padding: 24, border: '2px solid rgba(236,72,153,0.12)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1F0A12', marginBottom: 16 }}>🎪 Vendor & Entertainer</h3>
          {MOCK_KIDS_VENDORS.map(v => (
            <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px dashed rgba(236,72,153,0.15)' }}>
              <div style={{ fontSize: 20 }}>
                {v.type === 'entertainer' ? '🎭' : v.type === 'photographer' ? '📸' : '🍽️'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{v.name}</div>
                <div style={{ fontSize: 11, color: '#71717A' }}>{v.contact}</div>
              </div>
              <div style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                background: v.confirmed ? '#D1FAE5' : '#FEF3C7',
                color: v.confirmed ? '#065F46' : '#92400E',
              }}>
                {v.confirmed ? '✅ Konfirmasi' : '⏳ Pending'}
              </div>
            </div>
          ))}
        </div>

        {/* Invite Link */}
        <div style={{
          background: 'linear-gradient(135deg, #FDF4FF, #F0ABFC20)', borderRadius: 20, padding: 24,
          border: '2px dashed rgba(236,72,153,0.3)',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1F0A12', marginBottom: 8 }}>🔗 Link Undangan</h3>
          <div style={{ background: 'white', borderRadius: 12, padding: '10px 14px', marginBottom: 16, border: '1.5px solid rgba(236,72,153,0.2)', fontSize: 13, color: C.primary, fontWeight: 600, wordBreak: 'break-all' }}>
            partybox.id/invite/kids/{MOCK_KIDS_EVENT.invite_slug}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: '📋 Copy Link', color: C.secondary },
              { label: '💬 WhatsApp', color: '#25D366' },
              { label: '👁️ Preview', color: C.primary },
            ].map((b, i) => (
              <motion.button key={i} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${b.color}30`, background: `${b.color}10`, color: b.color, fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>
                {b.label}
              </motion.button>
            ))}
          </div>
          <p style={{ fontSize: 11, color: C.muted, marginTop: 12 }}>
            🔒 Alamat lengkap hanya terlihat setelah tamu konfirmasi kehadiran
          </p>
        </div>
      </div>
    </div>
  )
}
