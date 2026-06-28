'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Download, MessageCircle, Users, AlertTriangle, Plus, Trash2 } from 'lucide-react'
import { RsvpStatus } from '@/lib/mock-data'

const FILTERS: { key: RsvpStatus | 'all'; label: string; emoji: string }[] = [
  { key: 'all', label: 'Semua', emoji: '👥' },
  { key: 'attending', label: 'Hadir', emoji: '✅' },
  { key: 'pending', label: 'Pending', emoji: '⏳' },
  { key: 'declined', label: 'Tidak Hadir', emoji: '❌' },
]

export default function KidsGuestsPage() {
  const [filter, setFilter] = useState<RsvpStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'list' | 'allergy'>('list')
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

  const allergyGuests = guests.filter(r => r.allergies && r.allergies.length > 0)
  const totalKids = guests.filter(r => r.status === 'attending').reduce((a, r) => a + (r.num_children || 0), 0)
  const totalAdults = guests.filter(r => r.status === 'attending').reduce((a, r) => a + (r.num_adults || 0), 0)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1F0A12', marginBottom: 6 }}>👥 Daftar Tamu & RSVP</h1>
        <p style={{ color: '#9F6B7E', fontSize: 14 }}>Pantau konfirmasi kehadiran semua tamu undangan</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Undangan', val: guests.length, color: '#8B5CF6', bg: '#F5F3FF', emoji: '📨' },
          { label: 'Anak Hadir', val: totalKids, color: '#EC4899', bg: '#FDF2F8', emoji: '🧒' },
          { label: 'Orang Tua Hadir', val: totalAdults, color: '#10B981', bg: '#ECFDF5', emoji: '👪' },
          { label: 'Peringatan Alergi', val: allergyGuests.length, color: '#EF4444', bg: '#FEF2F2', emoji: '⚠️' },
        ].map((s, i) => (
          <motion.div key={i} whileHover={{ y: -3 }} style={{ background: s.bg, borderRadius: 16, padding: '16px 18px', border: `2px solid ${s.color}20` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 12, color: '#71717A', marginTop: 2, fontWeight: 600 }}>{s.label}</div>
              </div>
              <div style={{ fontSize: 28 }}>{s.emoji}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[{ key: 'list', label: '📋 Daftar Tamu' }, { key: 'allergy', label: '⚠️ Alergi & Pantangan' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)} style={{
            padding: '9px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 13,
            background: tab === t.key ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : 'white',
            color: tab === t.key ? 'white' : '#71717A',
            boxShadow: tab === t.key ? '0 4px 12px rgba(236,72,153,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'list' ? (
        <>
          {/* Filters + Search */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9F6B7E' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama tamu..."
                style={{ width: '100%', padding: '10px 12px 10px 36px', border: '2px solid rgba(236,72,153,0.2)', borderRadius: 12, fontSize: 14, fontFamily: 'var(--font-jakarta)', outline: 'none', boxSizing: 'border-box', background: 'white' }} />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {FILTERS.map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)} style={{
                  padding: '9px 14px', borderRadius: 12, border: '2px solid', cursor: 'pointer',
                  fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 12,
                  borderColor: filter === f.key ? '#EC4899' : 'rgba(236,72,153,0.2)',
                  background: filter === f.key ? '#FDF2F8' : 'white',
                  color: filter === f.key ? '#EC4899' : '#9F6B7E',
                }}>
                  {f.emoji} {f.label} {filter === f.key && `(${filtered.length})`}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ label: '📥 Export CSV' }, { label: '💬 WhatsApp' }].map((b, i) => (
                <button key={i} style={{ padding: '9px 14px', borderRadius: 12, border: '2px solid rgba(236,72,153,0.2)', background: 'white', color: '#9F6B7E', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>
                  {b.label}
                </button>
              ))}
              <button onClick={() => {
                const storedGuests = localStorage.getItem('vlass_guests') || '[]';
                const guestsArray = JSON.parse(storedGuests);
                guestsArray.push({
                  id: Date.now().toString(),
                  party_id: localStorage.getItem('vlass_active_party_id'),
                  guest_name: 'Tamu Baru (Manual)',
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
              }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 12, border: 'none', background: '#0F172A', color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>
                <Plus size={14} strokeWidth={3} /> Tambah Manual
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ background: 'white', borderRadius: 20, border: '2px solid rgba(236,72,153,0.12)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FDF2F8' }}>
                  {['Nama Tamu', 'Sumber', 'Status', 'Anak', 'Dewasa', 'Drop-off', 'Alergi', 'Pesan', 'Aksi'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#EC4899', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((r, i) => (
                    <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ borderBottom: '1px solid rgba(236,72,153,0.08)' }}>
                      <td style={{ padding: '13px 16px', fontWeight: 600, fontSize: 13 }}>{r.guest_name}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6, background: r.source === 'invite' ? '#F3E8FF' : '#E2E8F0', color: r.source === 'invite' ? '#7E22CE' : '#475569' }}>
                          {r.source === 'invite' ? 'Via Invite' : 'Manual'}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                          background: r.status === 'attending' ? '#D1FAE5' : r.status === 'pending' ? '#FEF3C7' : '#FEE2E2',
                          color: r.status === 'attending' ? '#065F46' : r.status === 'pending' ? '#92400E' : '#991B1B',
                        }}>
                          {r.status === 'attending' ? '✅ Hadir' : r.status === 'pending' ? '⏳ Pending' : '❌ Tidak'}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, textAlign: 'center' }}>{r.num_children}</td>
                      <td style={{ padding: '13px 16px', fontSize: 13, textAlign: 'center' }}>{r.num_adults}</td>
                      <td style={{ padding: '13px 16px', fontSize: 13 }}>
                        {r.will_drop_off === null || r.will_drop_off === undefined ? <span style={{ color: '#71717A' }}>—</span> : r.will_drop_off ? <span style={{ color: '#F59E0B', fontWeight: 700 }}>🚗 Diantar (Drop)</span> : <span style={{ color: '#10B981', fontWeight: 700 }}>👪 Menemani</span>}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        {((r.allergies && r.allergies.length > 0) || r.dietary_restrictions) ? (
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {r.allergies && r.allergies.map((a: string) => (
                              <span key={a} style={{ background: '#FEE2E2', color: '#B91C1C', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>⚠️ {a}</span>
                            ))}
                            {r.dietary_restrictions && (
                              <span style={{ background: '#FEE2E2', color: '#B91C1C', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>⚠️ {r.dietary_restrictions}</span>
                            )}
                          </div>
                        ) : <span style={{ color: '#71717A', fontSize: 12 }}>—</span>}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: '#71717A', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.message || '-'}
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
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Allergy Tab */
        <div>
          <div style={{ background: '#FEF2F2', border: '2px solid #FCA5A5', borderRadius: 20, padding: 24, marginBottom: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#B91C1C', marginBottom: 8 }}>
              ⚠️ {allergyGuests.length} Tamu dengan Alergi atau Pantangan Makanan
            </div>
            <p style={{ fontSize: 13, color: '#DC2626' }}>Pastikan pihak katering sudah diberitahu dan menyediakan alternatif yang aman. Siapkan label makanan yang jelas.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {allergyGuests.map(r => (
              <motion.div key={r.id} whileHover={{ y: -3 }} style={{ background: 'white', borderRadius: 18, padding: '20px', border: '2px solid #FCA5A530' }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#18181b', marginBottom: 4 }}>{r.guest_name}</div>
                <div style={{ fontSize: 12, color: '#71717A', marginBottom: 12 }}>
                  {r.child_names && r.child_names.length > 0 ? `Untuk: ${r.child_names.join(', ')}` : 'Tamu'}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  {r.allergies && r.allergies.map((a: string) => (
                    <span key={a} style={{ background: '#FEF2F2', color: '#B91C1C', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>⚠️ {a}</span>
                  ))}
                </div>
                {r.dietary_restrictions && (
                  <div style={{ fontSize: 12, color: '#71717A', fontStyle: 'italic', background: '#FFF7F0', borderRadius: 8, padding: '6px 10px' }}>"{r.dietary_restrictions}"</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
