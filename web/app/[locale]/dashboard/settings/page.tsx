'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, User, Globe, ShieldAlert, Save, Trash2, RotateCcw, AlertTriangle, Link as LinkIcon, CheckCircle2 } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

const showToast = (message: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('showToast', { detail: { message } }))
  }
}

export default function SettingsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'id'
  
  const [isClient, setIsClient] = useState(false)
  const [activeParty, setActiveParty] = useState<any>(null)
  
  // Form States
  const [partyName, setPartyName] = useState('')
  const [hostName, setHostName] = useState('')
  const [date, setDate] = useState('')
  const [customUrl, setCustomUrl] = useState('')
  
  // UI States
  const [isSaving, setIsSaving] = useState(false)
  const [showDangerModal, setShowDangerModal] = useState<'reset' | 'delete' | null>(null)
  const [dangerConfirmText, setDangerConfirmText] = useState('')

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const parties = JSON.parse(localStorage.getItem('glyka_parties') || localStorage.getItem('vlass_parties') || '[]')
      const activeId = localStorage.getItem('glyka_active_party_id') || localStorage.getItem('vlass_active_party_id')
      if (parties && activeId) {
        const active = parties.find((p: any) => p.id === activeId)
        setActiveParty(active)
        setPartyName(active.name || '')
        setHostName(active.hostName || '')
        setDate(active.date || '')
        setCustomUrl(active.customUrl || '')
      }
    }
  }, [])

  const handleSaveProfile = () => {
    if (!activeParty) return
    setIsSaving(true)
    
    setTimeout(() => {
      const parties = JSON.parse(localStorage.getItem('glyka_parties') || localStorage.getItem('vlass_parties') || '[]')
      
      // Check duplicate URL
      const isDuplicate = parties.some((p: any) => p.id !== activeParty.id && p.customUrl === customUrl && customUrl !== '')
      if (isDuplicate) {
        showToast('❌ URL sudah digunakan oleh pesta lain!')
        setIsSaving(false)
        return
      }

      const updatedParties = parties.map((p: any) => 
        p.id === activeParty.id 
          ? { ...p, name: partyName, hostName, date, customUrl } 
          : p
      )
      
      localStorage.setItem('glyka_parties', JSON.stringify(updatedParties))
      setActiveParty(updatedParties.find((p: any) => p.id === activeParty.id))
      
      // Dispatch event to update sidebar
      window.dispatchEvent(new Event('storage'))
      showToast('✅ Pengaturan profil berhasil disimpan!')
      setIsSaving(false)
    }, 600)
  }

  const handleResetData = () => {
    if (!activeParty) return
    // Remove all associated data for this party
    const keysToReset = ['glyka_guests', 'glyka_rundown', 'glyka_wishes', 'glyka_checklist', 'glyka_budget_items', 'glyka_budget_config', 'vlass_guests', 'vlass_rundown', 'vlass_wishes', 'vlass_checklist', 'vlass_budget_items', 'vlass_budget_config']
    keysToReset.forEach(key => {
      const data = JSON.parse(localStorage.getItem(key) || '{}')
      delete data[activeParty.id]
      localStorage.setItem(key, JSON.stringify(data))
    })
    
    showToast('🔄 Semua data pesta berhasil di-reset.')
    setShowDangerModal(null)
    setDangerConfirmText('')
    window.dispatchEvent(new Event('storage'))
    window.dispatchEvent(new Event('guestsUpdated'))
    window.dispatchEvent(new Event('rundownUpdated'))
    window.dispatchEvent(new Event('wishesUpdated'))
  }

  const handleDeleteParty = () => {
    if (!activeParty) return
    
    // Remove from parties list
    const parties = JSON.parse(localStorage.getItem('glyka_parties') || localStorage.getItem('vlass_parties') || '[]')
    const updatedParties = parties.filter((p: any) => p.id !== activeParty.id)
    localStorage.setItem('glyka_parties', JSON.stringify(updatedParties))
    
    // Clear active ID
    localStorage.removeItem('glyka_active_party_id')
    localStorage.removeItem('vlass_active_party_id')
    
    // Remove all associated data
    const keysToReset = ['glyka_guests', 'glyka_rundown', 'glyka_wishes', 'glyka_checklist', 'glyka_budget_items', 'glyka_budget_config', 'vlass_guests', 'vlass_rundown', 'vlass_wishes', 'vlass_checklist', 'vlass_budget_items', 'vlass_budget_config']
    keysToReset.forEach(key => {
      const data = JSON.parse(localStorage.getItem(key) || '{}')
      delete data[activeParty.id]
      localStorage.setItem(key, JSON.stringify(data))
    })

    showToast('🗑️ Pesta berhasil dihapus permanen.')
    window.dispatchEvent(new Event('storage'))
    window.dispatchEvent(new Event('partyUpdated'))
    router.push(`/${locale}/dashboard`)
  }

  if (!isClient) return null
  if (!activeParty) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Settings size={64} color="#CBD5E1" style={{ marginBottom: 24 }} />
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Belum Ada Pesta Aktif</h2>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 60, maxWidth: 800 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', marginBottom: 8, letterSpacing: '-0.02em' }}>Pengaturan</h1>
          <p style={{ fontSize: 16, color: '#64748B', fontWeight: 500 }}>
            Kelola profil acara, preferensi tautan, dan data pesta Anda.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Profile Section */}
        <div style={{ background: 'white', padding: 32, borderRadius: 32, border: '1px solid #E2E8F0', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={20} color="#3B82F6" /> Profil Pesta
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8, color: '#334155' }}>Nama Pesta / Acara</label>
                <input 
                  type="text" 
                  value={partyName} 
                  onChange={e => setPartyName(e.target.value)}
                  placeholder="Misal: Ulang Tahun Budi ke-5"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E2E8F0', outline: 'none', fontFamily: 'inherit', fontSize: 14 }} 
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8, color: '#334155' }}>Nama Host (Penyelenggara)</label>
                <input 
                  type="text" 
                  value={hostName} 
                  onChange={e => setHostName(e.target.value)}
                  placeholder="Misal: Keluarga Santoso"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E2E8F0', outline: 'none', fontFamily: 'inherit', fontSize: 14 }} 
                />
              </div>
            </div>
            
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8, color: '#334155' }}>Tanggal Acara</label>
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)}
                style={{ width: '100%', maxWidth: 300, padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E2E8F0', outline: 'none', fontFamily: 'inherit', fontSize: 14 }} 
              />
            </div>
          </div>
        </div>

        {/* URL Preferences */}
        <div style={{ background: 'white', padding: 32, borderRadius: 32, border: '1px solid #E2E8F0', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={20} color="#10B981" /> Tautan Undangan (URL)
          </h2>
          
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8, color: '#334155' }}>Custom URL Undangan</label>
            <div className="mobile-stack" style={{ display: 'flex', alignItems: 'stretch', gap: 8 }}>
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', padding: '12px 16px', borderRadius: 12, color: '#64748B', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <LinkIcon size={14} /> localhost:3000/{locale}/invite/
              </div>
              <div style={{ display: 'flex', flex: 1, minWidth: 200 }}>
                <input 
                  type="text" 
                  value={customUrl} 
                  onChange={e => setCustomUrl(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="budi-party"
                  style={{ flex: 1, width: '100%', padding: '12px 16px', borderRadius: '12px 0 0 12px', border: '1.5px solid #E2E8F0', borderRight: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 14 }} 
                />
                <button
                  onClick={() => {
                    const urlToOpen = customUrl ? customUrl : activeParty.id;
                    window.open(`/${locale}/invite/${urlToOpen}`, '_blank')
                  }}
                  style={{ background: '#0F172A', color: 'white', border: '1.5px solid #0F172A', padding: '12px 20px', borderRadius: '0 12px 12px 0', fontWeight: 800, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Buka Link
                </button>
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>Hanya gunakan huruf kecil, angka, dan tanda hubung (-).</p>
          </div>
        </div>
        
        {/* Save Button for Profile & URL */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleSaveProfile}
            disabled={isSaving}
            style={{ padding: '14px 28px', borderRadius: 100, border: 'none', background: '#0F172A', color: 'white', fontWeight: 800, fontSize: 15, cursor: isSaving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 20px rgba(15,23,42,0.15)', transition: 'all 0.2s', opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving ? <span style={{ width: 20, height: 20, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>

        {/* Danger Zone */}
        <div style={{ background: '#FEF2F2', padding: 32, borderRadius: 32, border: '1px solid #FECACA' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#991B1B', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldAlert size={20} color="#DC2626" /> Zona Berbahaya (Danger Zone)
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, paddingBottom: 16, borderBottom: '1px solid #FCA5A5' }}>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#7F1D1D', marginBottom: 4 }}>Reset Semua Data Acara</h4>
                <p style={{ fontSize: 13, color: '#991B1B', margin: 0 }}>Hapus seluruh tamu, jadwal, ucapan, to-do list, dan anggaran. Profil pesta tidak dihapus.</p>
              </div>
              <button onClick={() => setShowDangerModal('reset')} style={{ padding: '10px 20px', borderRadius: 100, border: '1.5px solid #F87171', background: 'white', color: '#DC2626', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <RotateCcw size={16} /> Reset Data
              </button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#7F1D1D', marginBottom: 4 }}>Hapus Pesta Permanen</h4>
                <p style={{ fontSize: 13, color: '#991B1B', margin: 0 }}>Tindakan ini tidak dapat dibatalkan. Seluruh data dan undangan akan lenyap.</p>
              </div>
              <button onClick={() => setShowDangerModal('delete')} style={{ padding: '10px 20px', borderRadius: 100, border: 'none', background: '#DC2626', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Trash2 size={16} /> Hapus Pesta
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Danger Modal */}
      <AnimatePresence>
        {showDangerModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)' }} onClick={() => setShowDangerModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'white', width: '100%', maxWidth: 450, borderRadius: 32, position: 'relative', zIndex: 110, padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
              
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <AlertTriangle size={32} color="#DC2626" />
              </div>
              
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', textAlign: 'center', marginBottom: 12 }}>
                {showDangerModal === 'reset' ? 'Reset Semua Data?' : 'Hapus Pesta Permanen?'}
              </h2>
              <p style={{ fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 1.5, marginBottom: 24 }}>
                {showDangerModal === 'reset' 
                  ? 'Apakah Anda yakin ingin menghapus semua tamu, jadwal, ucapan, dan data lainnya? Profil dan pengaturan pesta akan tetap ada.'
                  : 'Tindakan ini akan menghapus pesta ini beserta SELURUH datanya secara permanen. Anda tidak bisa mengembalikannya.'
                }
              </p>

              <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 16, border: '1px solid #E2E8F0', marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8, color: '#334155' }}>
                  Ketik <strong>{activeParty.name}</strong> untuk konfirmasi
                </label>
                <input 
                  type="text" 
                  value={dangerConfirmText}
                  onChange={e => setDangerConfirmText(e.target.value)}
                  placeholder={activeParty.name}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E2E8F0', outline: 'none', fontFamily: 'inherit', fontSize: 14 }} 
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setShowDangerModal(null)} style={{ flex: 1, padding: '14px', borderRadius: 100, border: '1.5px solid #E2E8F0', background: 'white', color: '#64748B', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Batal</button>
                <button 
                  onClick={showDangerModal === 'reset' ? handleResetData : handleDeleteParty}
                  disabled={dangerConfirmText !== activeParty.name}
                  style={{ flex: 1, padding: '14px', borderRadius: 100, border: 'none', background: '#DC2626', color: 'white', fontWeight: 800, fontSize: 14, cursor: dangerConfirmText === activeParty.name ? 'pointer' : 'not-allowed', opacity: dangerConfirmText === activeParty.name ? 1 : 0.5 }}
                >
                  {showDangerModal === 'reset' ? 'Ya, Reset Data' : 'Hapus Pesta'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  )
}
