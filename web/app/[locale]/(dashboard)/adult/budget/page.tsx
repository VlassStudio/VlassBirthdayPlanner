'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { MOCK_BUDGET_ITEMS, MOCK_ADULT_EVENT } from '@/lib/mock-data'

const CATEGORY_ICONS: Record<string, string> = {
  Venue: '🏙️', Katering: '🍽️', Dekorasi: '💐', Hiburan: '🎵', Fotografer: '📸', Kue: '🎂', Minuman: '🍹', 'Lain-lain': '🎁',
}

export default function AdultBudgetPage() {
  const [items, setItems] = useState(MOCK_BUDGET_ITEMS)

  const totalEst = items.reduce((a, b) => a + (b.estimated || 0), 0)
  const totalActual = items.reduce((a, b) => a + (b.actual || 0), 0)
  const totalPaid = items.filter(b => b.is_paid).reduce((a, b) => a + (b.actual || b.estimated || 0), 0)
  const remaining = totalEst - totalPaid
  const overBudget = totalActual > totalEst
  const budget = MOCK_ADULT_EVENT.budget_total || totalEst
  const pct = Math.min((totalPaid / budget) * 100, 100)

  const fmt = (n: number) => `Rp ${n.toLocaleString('id-ID')}`

  const togglePaid = (id: string) => {
    setItems(prev => prev.map(b => b.id === id ? { ...b, is_paid: !b.is_paid } : b))
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: 6 }}>💰 Budget Tracker</h1>
        <p style={{ color: '#64748B', fontSize: 14 }}>Monitor party expenses and stay on budget</p>
      </div>

      {/* Overview cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Budget', val: fmt(budget), color: '#94A3B8', sub: 'target pengeluaran' },
          { label: 'Estimasi Total', val: fmt(totalEst), color: overBudget ? '#EF4444' : '#C9A84C', sub: overBudget ? '⚠️ Over budget!' : 'sesuai rencana' },
          { label: 'Sudah Dibayar', val: fmt(totalPaid), color: '#10B981', sub: `${items.filter(b => b.is_paid).length} dari ${items.length} item` },
          { label: 'Belum Dibayar', val: fmt(remaining), color: '#F59E0B', sub: 'sisa pembayaran' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color, letterSpacing: '-0.02em', marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: '#475569' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>Payment Progress</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#10B981' }}>{Math.round(pct)}% paid</span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #10B981, #C9A84C)', borderRadius: 100 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: '#475569' }}>Rp 0</span>
          <span style={{ fontSize: 11, color: '#475569' }}>{fmt(budget)}</span>
        </div>
      </div>

      {/* Budget items */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>Budget Items</h3>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.08)', color: '#C9A84C', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>
            <Plus size={15} /> Add Item
          </button>
        </div>
        {items.map((item, i) => (
          <motion.div key={item.id} layout
            style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px', borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <div style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>{item.description}</span>
                <span style={{ fontSize: 11, color: '#475569', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 6 }}>{item.category}</span>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Estimasi: {fmt(item.estimated)}</span>
                {item.actual && <span style={{ fontSize: 12, color: item.actual > item.estimated ? '#EF4444' : '#10B981', fontWeight: 600 }}>Aktual: {fmt(item.actual)}</span>}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => togglePaid(item.id)}
                style={{
                  padding: '7px 16px', borderRadius: 10, border: '1px solid',
                  borderColor: item.is_paid ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.12)',
                  background: item.is_paid ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
                  color: item.is_paid ? '#10B981' : '#64748B',
                  fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-jakarta)',
                }}>
                {item.is_paid ? '✓ Lunas' : 'Tandai Lunas'}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* By category donut (text-based) */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: 24, marginTop: 20, border: '1px solid rgba(255,255,255,0.07)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 16 }}>Distribusi Anggaran</h3>
        {items.map(b => (
          <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: b.is_paid ? '#10B981' : '#C9A84C', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#94A3B8', width: 120, flexShrink: 0 }}>{b.icon} {b.category}</span>
            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(b.estimated / totalEst) * 100}%`, background: b.is_paid ? '#10B981' : 'rgba(201,168,76,0.5)', borderRadius: 100 }} />
            </div>
            <span style={{ fontSize: 12, color: '#64748B', width: 80, textAlign: 'right' }}>{Math.round((b.estimated / totalEst) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
