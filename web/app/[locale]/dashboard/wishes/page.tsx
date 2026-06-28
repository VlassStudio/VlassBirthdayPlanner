'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquareHeart, Heart, Sparkles, Quote, Search, Trash2 } from 'lucide-react'

interface Wish {
  id: string
  guestName: string
  message: string
  date: string
  isFavorite: boolean
}

export default function WishesPage() {
  const [isClient, setIsClient] = useState(false)
  const [activeParty, setActiveParty] = useState<any>(null)
  const [wishes, setWishes] = useState<Wish[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const parties = JSON.parse(localStorage.getItem('vlass_parties') || '[]')
      const activeId = localStorage.getItem('vlass_active_party_id')
      if (parties && activeId) {
        const active = parties.find((p: any) => p.id === activeId)
        setActiveParty(active)

        const storedWishes = JSON.parse(localStorage.getItem('vlass_wishes') || '{}')
        if (storedWishes[activeId]) {
          setWishes(storedWishes[activeId])
        } else {
          setWishes([])
        }
      }
    }
  }, [])

  const toggleFavorite = (id: string) => {
    if (!activeParty) return
    const updated = wishes.map(w => w.id === id ? { ...w, isFavorite: !w.isFavorite } : w)
    setWishes(updated)
    const storedWishes = JSON.parse(localStorage.getItem('vlass_wishes') || '{}')
    storedWishes[activeParty.id] = updated
    localStorage.setItem('vlass_wishes', JSON.stringify(storedWishes))
  }

  const deleteWish = (id: string) => {
    if (!activeParty) return
    if (!confirm('Apakah Anda yakin ingin menghapus ucapan ini?')) return
    
    const updated = wishes.filter(w => w.id !== id)
    setWishes(updated)
    const storedWishes = JSON.parse(localStorage.getItem('vlass_wishes') || '{}')
    storedWishes[activeParty.id] = updated
    localStorage.setItem('vlass_wishes', JSON.stringify(storedWishes))
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { message: '🗑️ Ucapan berhasil dihapus!' } }))
    }
  }

  const filteredWishes = wishes.filter(w => {
    const matchSearch = w.guestName.toLowerCase().includes(search.toLowerCase()) || w.message.toLowerCase().includes(search.toLowerCase())
    if (filter === 'favorites') return matchSearch && w.isFavorite;
    return matchSearch;
  })

  const totalWishes = wishes.length;
  const favoriteWishes = wishes.filter(w => w.isFavorite).length;

  if (!isClient) return null
  if (!activeParty) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <MessageSquareHeart size={64} color="#CBD5E1" style={{ marginBottom: 24 }} />
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Belum Ada Pesta Aktif</h2>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', marginBottom: 8, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 12 }}>
            Ucapan & Doa Tamu <Sparkles size={28} color="#F59E0B" />
          </h1>
          <p style={{ fontSize: 16, color: '#64748B', fontWeight: 500 }}>
            Kumpulan ucapan selamat ulang tahun dari tamu yang telah RSVP.
          </p>
        </div>
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Cari nama atau ucapan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 14px 12px 40px', border: '1.5px solid #E2E8F0', borderRadius: 100, fontSize: 14, fontFamily: 'var(--font-jakarta)', outline: 'none', background: 'white' }}
          />
        </div>
      </div>

      {/* Metrics & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24, padding: 16, background: 'white', borderRadius: 20, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 10, borderRadius: 12, background: '#EFF6FF' }}>
              <MessageSquareHeart size={20} color="#3B82F6" />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600, margin: 0, marginBottom: 2 }}>Total Ucapan</p>
              <p style={{ fontSize: 18, color: '#0F172A', fontWeight: 800, margin: 0 }}>{totalWishes}</p>
            </div>
          </div>
          <div style={{ width: 1, background: '#E2E8F0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 10, borderRadius: 12, background: '#FFF1F2' }}>
              <Heart size={20} color="#F43F5E" />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600, margin: 0, marginBottom: 2 }}>Favorit</p>
              <p style={{ fontSize: 18, color: '#0F172A', fontWeight: 800, margin: 0 }}>{favoriteWishes}</p>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 8, background: '#F1F5F9', padding: 4, borderRadius: 100 }}>
          <button 
            onClick={() => setFilter('all')}
            style={{ padding: '8px 16px', borderRadius: 100, border: 'none', background: filter === 'all' ? 'white' : 'transparent', color: filter === 'all' ? '#0F172A' : '#64748B', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: filter === 'all' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
          >
            Semua
          </button>
          <button 
            onClick={() => setFilter('favorites')}
            style={{ padding: '8px 16px', borderRadius: 100, border: 'none', background: filter === 'favorites' ? 'white' : 'transparent', color: filter === 'favorites' ? '#0F172A' : '#64748B', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: filter === 'favorites' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
          >
            Favorit
          </button>
        </div>
      </div>

      {/* Grid of Wishes */}
      {filteredWishes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: 32, border: '1px solid #E2E8F0' }}>
          <MessageSquareHeart size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Belum ada ucapan</h3>
          <p style={{ color: '#64748B', fontSize: 14 }}>Tamu dapat menulis ucapan saat mereka mengisi form RSVP di link undangan.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
          <AnimatePresence>
            {filteredWishes.map((wish, i) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                style={{ 
                  background: 'white', padding: 28, borderRadius: 24, border: '1px solid #E2E8F0', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.02)', position: 'relative', display: 'flex', flexDirection: 'column' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#0F172A' }}>
                      {wish.guestName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 2 }}>{wish.guestName}</h3>
                      <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
                        {new Date(wish.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button 
                      onClick={() => toggleFavorite(wish.id)}
                      title={wish.isFavorite ? "Hapus dari Favorit" : "Tandai sebagai Favorit"}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Heart size={20} fill={wish.isFavorite ? '#F43F5E' : 'none'} color={wish.isFavorite ? '#F43F5E' : '#CBD5E1'} />
                    </button>
                    <button 
                      onClick={() => deleteWish(wish.id)}
                      title="Hapus Ucapan"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={20} color="#CBD5E1" />
                    </button>
                  </div>
                </div>
                
                <div style={{ position: 'relative', flex: 1 }}>
                  <Quote size={24} color="#F1F5F9" style={{ position: 'absolute', top: -4, left: -4, zIndex: 0 }} />
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, position: 'relative', zIndex: 1, fontStyle: 'italic' }}>
                    "{wish.message}"
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
