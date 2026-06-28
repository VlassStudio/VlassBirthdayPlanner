'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Sparkles, Filter, Crown } from 'lucide-react'
import { kidsThemes, adultThemes } from '@/app/[locale]/editor/themes'

export default function GalleryPage() {
  const params = useParams()
  const locale = params?.locale || 'id'
  
  const [filter, setFilter] = useState<'all' | 'kids' | 'adult'>('all')

  const allThemes = [
    ...kidsThemes.map(t => ({ ...t, type: 'kids', isPro: t.id !== 'dino' && t.id !== 'space' && t.id !== 'unicorn' && t.id !== 'superhero' && t.id !== 'mermaid' })),
    ...adultThemes.map(t => ({ ...t, type: 'adult', isPro: t.id !== 'minimalist' && t.id !== 'gold' && t.id !== 'neon' }))
  ]

  const filteredThemes = allThemes.filter(t => filter === 'all' || t.type === filter)

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: 'var(--font-jakarta)', paddingBottom: 100 }}>
      {/* ── HEADER ── */}
      <header style={{ 
        position: 'sticky', top: 0, zIndex: 100, 
        background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E4E4E7', padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', background: '#F4F4F5', color: '#18181B', textDecoration: 'none' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: '#18181B' }}>Galeri Desain</h1>
            <p style={{ fontSize: 13, color: '#71717A', margin: 0, fontWeight: 500 }}>Eksplorasi koleksi tema premium kami</p>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        
        {/* ── HERO SECTION ── */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FFE5EC', padding: '8px 16px', borderRadius: 100, color: '#FF3366', fontWeight: 800, marginBottom: 24 }}>
            <Sparkles size={16} /> <span>{allThemes.length} Desain Eksklusif</span>
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#18181B', marginBottom: 24 }}>
            Temukan Desain Impianmu
          </h2>
          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#71717A', fontWeight: 600, maxWidth: 600, margin: '0 auto' }}>
            Dari yang ceria untuk anak-anak hingga elegan untuk dewasa. Personalisasi tak terbatas menanti Anda.
          </p>
        </div>

        {/* ── FILTER ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
          <div style={{ display: 'flex', background: 'white', padding: 6, borderRadius: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #E4E4E7' }}>
            <button 
              onClick={() => setFilter('all')}
              style={{ padding: '12px 24px', borderRadius: 100, border: 'none', background: filter === 'all' ? '#18181B' : 'transparent', color: filter === 'all' ? 'white' : '#71717A', fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Semua Tema
            </button>
            <button 
              onClick={() => setFilter('kids')}
              style={{ padding: '12px 24px', borderRadius: 100, border: 'none', background: filter === 'kids' ? '#FF3366' : 'transparent', color: filter === 'kids' ? 'white' : '#71717A', fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              🧒 Anak-anak
            </button>
            <button 
              onClick={() => setFilter('adult')}
              style={{ padding: '12px 24px', borderRadius: 100, border: 'none', background: filter === 'adult' ? '#4F46E5' : 'transparent', color: filter === 'adult' ? 'white' : '#71717A', fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              🥂 Dewasa
            </button>
          </div>
        </div>

        {/* ── GRID ── */}
        <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 32 }}>
          <AnimatePresence>
            {filteredThemes.map((theme) => (
              <motion.div 
                key={theme.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                style={{ 
                  background: 'white', 
                  borderRadius: 24, 
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                  border: '1px solid #E4E4E7',
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
              >
                {theme.isPro && (
                  <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 6, zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <Crown size={14} color="#D97706" />
                    <span style={{ fontSize: 12, fontWeight: 900, color: '#D97706', textTransform: 'uppercase' }}>Pro</span>
                  </div>
                )}
                
                {/* Visual Preview */}
                <div style={{ height: 200, background: theme.gradient, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)', top: '-50%', left: '-50%' }} />
                  <motion.div 
                    initial={{ y: 0 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    style={{ fontSize: 80, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2))', zIndex: 5 }}
                  >
                    {theme.emoji}
                  </motion.div>
                </div>
                
                {/* Info */}
                <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 24 }}>{theme.emoji}</span>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: '#18181B', margin: 0 }}>{theme.label}</h3>
                  </div>
                  <p style={{ color: '#71717A', fontSize: 14, fontWeight: 500, margin: 0, marginTop: 'auto' }}>
                    Tema {theme.type === 'kids' ? 'Anak-anak' : 'Dewasa'}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── BOTTOM CTA ── */}
        <div style={{ marginTop: 80, padding: 60, background: 'linear-gradient(135deg, #FF3366, #FF9933)', borderRadius: 40, textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
           <div style={{ position: 'absolute', bottom: -50, left: -20, width: 150, height: 150, border: '40px solid rgba(255,255,255,0.1)', borderRadius: '50%' }} />
           
           <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 24, position: 'relative', zIndex: 10 }}>Siap membuat undangan impianmu?</h2>
           <Link href={`/${locale}/login`} style={{ position: 'relative', zIndex: 10, display: 'inline-flex', alignItems: 'center', padding: '16px 32px', background: 'white', color: '#FF3366', borderRadius: 100, fontSize: 18, fontWeight: 900, textDecoration: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
             Buat Pesta Sekarang
           </Link>
        </div>

      </main>
    </div>
  )
}
