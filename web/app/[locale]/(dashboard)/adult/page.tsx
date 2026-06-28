'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, Users, CheckSquare, Wallet, Sparkles, ArrowUpRight, Clock, MapPin } from 'lucide-react'
import {
  MOCK_ADULT_EVENT, MOCK_ADULT_RSVPS, MOCK_ADULT_CHECKLIST,
  MOCK_BUDGET_ITEMS, MOCK_ADULT_VENDORS, MOCK_AI_SUGGESTIONS_ADULT,
} from '@/lib/mock-data'

function getDaysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)
}

export default function AdultDashboardPage() {
  const [dismissedAI, setDismissedAI] = useState<string[]>([])
  const days = getDaysUntil(MOCK_ADULT_EVENT.event_date)
  const rsvps = MOCK_ADULT_RSVPS
  const attending = rsvps.filter(r => r.status === 'attending')
  const declined = rsvps.filter(r => r.status === 'declined')
  const pending = rsvps.filter(r => r.status === 'pending')
  const dietary = rsvps.filter(r => r.dietary_restrictions)
  const totalGuests = attending.reduce((a, r) => a + r.num_adults, 0)
  const completed = MOCK_ADULT_CHECKLIST.filter(c => c.is_completed).length
  const total = MOCK_ADULT_CHECKLIST.length
  const pct = Math.round((completed / total) * 100)
  const budgetEst = MOCK_BUDGET_ITEMS.reduce((a, b) => a + (b.estimated || 0), 0)
  const budgetActual = MOCK_BUDGET_ITEMS.reduce((a, b) => a + (b.actual || 0), 0)
  const budgetPaid = MOCK_BUDGET_ITEMS.filter(b => b.is_paid).reduce((a, b) => a + (b.actual || b.estimated || 0), 0)

  const fmt = (n: number) => `Rp ${(n / 1000000).toFixed(1)}jt`

  return (
    <div>
      {/* Header — minimal Apple style */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 13, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
              Event Overview
            </p>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: '-0.04em', marginBottom: 8 }}>
              {MOCK_ADULT_EVENT.event_title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94A3B8' }}>
                <Clock size={14} /> {new Date(MOCK_ADULT_EVENT.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} · {MOCK_ADULT_EVENT.event_time}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94A3B8' }}>
                <MapPin size={14} /> {MOCK_ADULT_EVENT.location_name}
              </span>
            </div>
          </div>
          <Link href={`/invite/adult/${MOCK_ADULT_EVENT.invite_slug}`} target="_blank" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px',
            background: 'linear-gradient(135deg, #C9A84C, #F59E0B)', color: '#78350F',
            borderRadius: 12, fontWeight: 700, fontSize: 13, textDecoration: 'none',
          }}>
            <ArrowUpRight size={16} /> Lihat Undangan
          </Link>
        </div>
      </div>

      {/* Countdown + Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16, marginBottom: 24 }}>
        {/* Countdown */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 100%)',
          border: '1px solid rgba(201,168,76,0.25)', borderRadius: 20, padding: '24px 20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Countdown</div>
          <div style={{ fontSize: 56, fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: '-0.05em' }}>{days}</div>
          <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 6 }}>days to go</div>
          <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, marginTop: 16 }}>
            <div style={{ width: '70%', height: '100%', background: 'linear-gradient(90deg, #C9A84C, #F59E0B)', borderRadius: 1 }} />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'Attending', val: attending.length, sub: `${totalGuests} total guests`, icon: '✅', accent: '#10B981' },
            { label: 'Pending', val: pending.length, sub: `awaiting response`, icon: '⏳', accent: '#F59E0B' },
            { label: 'Dietary Needs', val: dietary.length, sub: `with restrictions`, icon: '🍽️', accent: '#8B5CF6' },
            { label: 'Declined', val: declined.length, sub: `cannot attend`, icon: '❌', accent: '#EF4444' },
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -3 }} style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '16px 18px',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{s.val}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#E2E8F0', marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Budget Snapshot */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: '24px',
        border: '1px solid rgba(255,255,255,0.07)', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>💰 Budget Overview</h3>
          <Link href="/adult/budget" style={{ fontSize: 12, color: '#C9A84C', fontWeight: 600, textDecoration: 'none' }}>Lihat Detail →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
          {[
            { label: 'Total Estimasi', val: fmt(budgetEst), color: '#94A3B8' },
            { label: 'Sudah Dibayar', val: fmt(budgetPaid), color: '#10B981' },
            { label: 'Sisa Pembayaran', val: fmt(budgetEst - budgetPaid), color: '#F59E0B' },
          ].map((b, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{b.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: b.color, letterSpacing: '-0.03em' }}>{b.val}</div>
            </div>
          ))}
        </div>
        {/* Budget by category */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {MOCK_BUDGET_ITEMS.map(b => (
            <div key={b.id} style={{
              padding: '6px 12px', borderRadius: 8,
              background: b.is_paid ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${b.is_paid ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`,
              fontSize: 12,
            }}>
              <span style={{ marginRight: 6 }}>{b.icon}</span>
              <span style={{ color: '#E2E8F0', fontWeight: 500 }}>{b.category}</span>
              <span style={{ color: b.is_paid ? '#10B981' : '#94A3B8', marginLeft: 8, fontWeight: 700 }}>
                {b.is_paid ? '✓ Lunas' : `${fmt(b.estimated)}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist + AI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Checklist */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>Planning Checklist</h3>
            <Link href="/adult/checklist" style={{ fontSize: 12, color: '#C9A84C', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#64748B' }}>{completed}/{total} completed</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#C9A84C' }}>{pct}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #C9A84C, #F59E0B)', borderRadius: 100 }} />
            </div>
          </div>
          {MOCK_ADULT_CHECKLIST.filter(c => !c.is_completed).slice(0, 5).map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, border: '1.5px solid rgba(201,168,76,0.4)', flexShrink: 0 }} />
              <span style={{ color: '#CBD5E1' }}>{c.title}</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: '#475569', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 6, flexShrink: 0 }}>
                {c.period === '2_weeks' ? '2wk' : c.period === '1_week' ? '1wk' : c.period === '3_days' ? '3d' : 'Day of'}
              </span>
            </div>
          ))}
        </div>

        {/* AI Suggestions */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Sparkles size={16} color="#C9A84C" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>AI Party Planner</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MOCK_AI_SUGGESTIONS_ADULT.filter(s => !dismissedAI.includes(s.id)).map(s => (
              <motion.div key={s.id} layout style={{
                background: 'rgba(201,168,76,0.06)', borderRadius: 12, padding: '12px 14px',
                border: '1px solid rgba(201,168,76,0.15)',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.category}</div>
                <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5, marginBottom: 8 }}>{s.suggestion}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ fontSize: 11, fontWeight: 600, color: '#C9A84C', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>
                    {s.action}
                  </button>
                  <button onClick={() => setDismissedAI(p => [...p, s.id])} style={{ fontSize: 11, color: '#475569', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>Dismiss</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Vendors + Invite */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 16 }}>Vendors & Partners</h3>
          {MOCK_ADULT_VENDORS.map(v => (
            <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 20 }}>
                {v.type === 'photographer' ? '📸' : v.type === 'dj' ? '🎵' : v.type === 'caterer' ? '🍽️' : '💐'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>{v.name}</div>
                <div style={{ fontSize: 11, color: '#475569' }}>{v.contact}</div>
              </div>
              <div style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                background: v.confirmed ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                color: v.confirmed ? '#10B981' : '#F59E0B',
              }}>
                {v.confirmed ? 'Confirmed' : 'Pending'}
              </div>
            </div>
          ))}
        </div>

        {/* Invite + Dress Code */}
        <div style={{ background: 'rgba(201,168,76,0.06)', borderRadius: 20, padding: 24, border: '1px solid rgba(201,168,76,0.2)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 16 }}>Invitation Details</h3>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Dress Code</div>
            <div style={{ fontSize: 14, color: '#E2E8F0', fontWeight: 500 }}>{MOCK_ADULT_EVENT.dress_code}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#94A3B8', wordBreak: 'break-all' }}>
            partybox.id/invite/adult/{MOCK_ADULT_EVENT.invite_slug}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: 'Copy Link', bg: 'rgba(255,255,255,0.08)', color: '#E2E8F0' },
              { label: '💬 WhatsApp', bg: 'rgba(37,211,102,0.15)', color: '#25D366' },
              { label: '👁️ Preview', bg: 'rgba(201,168,76,0.15)', color: '#C9A84C' },
            ].map((b, i) => (
              <motion.button key={i} whileHover={{ y: -2 }} style={{
                padding: '8px 14px', borderRadius: 8, border: 'none',
                background: b.bg, color: b.color, fontWeight: 600, fontSize: 12,
                cursor: 'pointer', fontFamily: 'var(--font-jakarta)',
              }}>
                {b.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
