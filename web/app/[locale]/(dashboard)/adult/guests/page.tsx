'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Trash2 } from 'lucide-react'
import { RsvpStatus } from '@/lib/mock-data'

const FILTERS: { key: RsvpStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'attending', label: 'Attending' },
  { key: 'pending', label: 'Pending' },
  { key: 'declined', label: 'Declined' },
]

const DIETARY_COLORS: Record<string, { bg: string; text: string }> = {
  'Halal': { bg: 'rgba(16,185,129,0.1)', text: '#10B981' },
  'Vegan': { bg: 'rgba(132,204,22,0.1)', text: '#65A30D' },
  'Gluten-Free': { bg: 'rgba(245,158,11,0.1)', text: '#D97706' },
  'Alcohol-Free': { bg: 'rgba(99,102,241,0.1)', text: '#6366F1' },
}

export default function AdultGuestsPage() {
  const [filter, setFilter] = useState<RsvpStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [guests, setGuests] = useState<any[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activePartyId = localStorage.getItem('vlass_active_party_id')
      const loadGuests = () => {
        const storedGuests = localStorage.getItem('vlass_guests')
        if (storedGuests) {
          const parsed = JSON.parse(storedGuests)
          setGuests(parsed.filter((g: any) => g.party_id === activePartyId))
        }
      }
      loadGuests()
      window.addEventListener('guestsUpdated', loadGuests)
      return () => window.removeEventListener('guestsUpdated', loadGuests)
    }
  }, [])

  const filtered = guests.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false
    if (search && !r.guest_name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const attending = guests.filter(r => r.status === 'attending')
  const totalGuests = attending.reduce((a, r) => a + (r.num_adults || 0), 0)
  const dietaryCount = guests.filter(r => r.dietary_restrictions).length
  const allergyCount = guests.filter(r => r.allergies && r.allergies.length > 0).length

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: 6 }}>Guest List & RSVP</h1>
        <p style={{ color: '#64748B', fontSize: 14 }}>Track all guest confirmations and dietary requirements</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Invited', val: guests.length, color: '#C9A84C', sub: 'invitations sent' },
          { label: 'Attending', val: `${attending.length} RSVPs`, color: '#10B981', sub: `${totalGuests} total guests` },
          { label: 'Dietary Needs', val: dietaryCount, color: '#8B5CF6', sub: 'with restrictions' },
          { label: 'Allergies', val: allergyCount, color: '#EF4444', sub: 'require attention' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '16px 18px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: '-0.03em' }}>{s.val}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#E2E8F0', marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search guests..."
            style={{ padding: '9px 12px 9px 34px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-jakarta)', outline: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', width: 220 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '8px 14px', borderRadius: 10, border: `1px solid ${filter === f.key ? '#C9A84C' : 'rgba(255,255,255,0.08)'}`,
              background: filter === f.key ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)',
              color: filter === f.key ? '#C9A84C' : '#64748B', fontWeight: 600, fontSize: 12,
              cursor: 'pointer', fontFamily: 'var(--font-jakarta)',
            }}>
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {['Export CSV', 'WhatsApp Summary'].map((b, i) => (
            <button key={i} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#64748B', fontWeight: 500, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>
              {b}
            </button>
          ))}
          <button onClick={() => {
            const storedGuests = localStorage.getItem('vlass_guests') || '[]';
            const guestsArray = JSON.parse(storedGuests);
            guestsArray.push({
              id: Date.now().toString(),
              party_id: localStorage.getItem('vlass_active_party_id'),
              guest_name: 'New Guest (Manual)',
              status: 'attending',
              num_children: 0,
              num_adults: 1,
              will_drop_off: false,
              allergies: [],
              dietary_restrictions: '',
              message: '',
              source: 'manual',
              created_at: new Date().toISOString()
            });
            localStorage.setItem('vlass_guests', JSON.stringify(guestsArray));
            window.dispatchEvent(new Event('guestsUpdated'));
          }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: 'none', background: '#C9A84C', color: '#09090B', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>
            <Plus size={14} strokeWidth={3} /> Add Manual
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
              {['Guest', 'Source', 'Status', 'Guests', 'Dietary', 'Allergies', 'Message', 'Aksi'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '13px 16px', fontWeight: 600, fontSize: 13, color: '#E2E8F0' }}>{r.guest_name}</td>
                <td style={{ padding: '13px 16px' }}>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6, background: r.source === 'invite' ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.05)', color: r.source === 'invite' ? '#C9A84C' : '#94A3B8' }}>
                    {r.source === 'invite' ? 'Via Invite' : 'Manual'}
                  </span>
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                    background: r.status === 'attending' ? 'rgba(16,185,129,0.12)' : r.status === 'pending' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
                    color: r.status === 'attending' ? '#10B981' : r.status === 'pending' ? '#F59E0B' : '#EF4444',
                  }}>
                    {r.status === 'attending' ? '✓ Attending' : r.status === 'pending' ? '⏳ Pending' : '✕ Declined'}
                  </span>
                </td>
                <td style={{ padding: '13px 16px', fontSize: 13, color: '#94A3B8', textAlign: 'center' }}>{r.num_adults}</td>
                <td style={{ padding: '13px 16px' }}>
                  {r.dietary_restrictions ? (
                    <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: 'rgba(255,255,255,0.08)', color: '#94A3B8' }}>
                      {r.dietary_restrictions}
                    </span>
                  ) : <span style={{ color: '#374151', fontSize: 12 }}>—</span>}
                </td>
                <td style={{ padding: '13px 16px' }}>
                  {r.allergies && r.allergies.length > 0 ? (
                    <span style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
                      ⚠️ {r.allergies.join(', ')}
                    </span>
                  ) : <span style={{ color: '#374151', fontSize: 12 }}>—</span>}
                </td>
                <td style={{ padding: '13px 16px', fontSize: 12, color: '#475569', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.message || '—'}
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <button onClick={() => {
                    const updated = guests.filter(g => g.id !== r.id);
                    setGuests(updated);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('vlass_guests', JSON.stringify(updated));
                      window.dispatchEvent(new Event('guestsUpdated'));
                    }
                  }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: 4 }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
