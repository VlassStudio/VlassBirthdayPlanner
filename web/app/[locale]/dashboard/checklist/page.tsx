'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { 
  CheckSquare, Plus, Trash2, Sparkles, AlertCircle, 
  Calendar, Clock, Check, ListTodo, Zap, Trophy, X, Wand2
} from 'lucide-react'

// Default tasks for Kids Mode
const defaultKidsTasks = [
  { id: 'k1', text: 'Tentukan anggaran pesta & target jumlah teman anak', timeframe: 'month', done: false },
  { id: 'k2', text: 'Pilih tema dekorasi (Dinosaur, Space, atau Unicorn)', timeframe: 'month', done: false },
  { id: 'k3', text: 'Sewa pesulap, badut, atau penyewa wahana bermain anak', timeframe: 'month', done: false },
  { id: 'k4', text: 'Pesan kue ulang tahun sesuai tema pesta anak', timeframe: 'month', done: false },
  { id: 'k5', text: 'Kirim undangan digital & minta informasi alergi makanan anak', timeframe: 'week', done: false },
  { id: 'k6', text: 'Siapkan goodie bag (snack & mainan edukatif)', timeframe: 'week', done: false },
  { id: 'k7', text: 'Konfirmasi kehadiran orang tua (apakah anak didampingi / drop-off)', timeframe: 'week', done: false },
  { id: 'k8', text: 'Siapkan playlist lagu anak-anak yang ceria', timeframe: 'week', done: false },
  { id: 'k9', text: 'Dekorasi ruangan pesta & pasang backdrop foto tema', timeframe: 'day', done: false },
  { id: 'k10', text: 'Siapkan wadah/meja khusus untuk registri kado/hadiah', timeframe: 'day', done: false },
  { id: 'k11', text: 'Siapkan kotak P3K darurat & tandai area makanan bebas alergen', timeframe: 'day', done: false }
]

// Default tasks for Adult Mode
const defaultAdultTasks = [
  { id: 'a1', text: 'Tentukan total anggaran & tentukan dresscode warna pakaian tamu', timeframe: 'month', done: false },
  { id: 'a2', text: 'Booking tempat/venue (Cafe, Restoran, atau Rooftop lounge)', timeframe: 'month', done: false },
  { id: 'a3', text: 'Pilih paket katering & minuman (Bar & Wine tracker)', timeframe: 'month', done: false },
  { id: 'a4', text: 'Pesan kue ulang tahun bertema elegan/minimalis', timeframe: 'month', done: false },
  { id: 'a5', text: 'Kirim undangan digital dan ingatkan tenggat waktu RSVP', timeframe: 'week', done: false },
  { id: 'a6', text: 'Susun playlist musik Spotify (retro 80s, neon lounge, dll)', timeframe: 'week', done: false },
  { id: 'a7', text: 'Siapkan area photobooth dengan aksesoris pendukung', timeframe: 'week', done: false },
  { id: 'a8', text: 'Konfirmasi jumlah kehadiran final ke penyedia katering', timeframe: 'week', done: false },
  { id: 'a9', text: 'Tata tata letak meja tamu & pasang lighting neon/lilin estetik', timeframe: 'day', done: false },
  { id: 'a10', text: 'Siapkan area minuman dingin & pastikan es batu cukup', timeframe: 'day', done: false },
  { id: 'a11', text: 'Tes sound system venue & sambungkan playlist musik utama', timeframe: 'day', done: false }
]

export default function ChecklistPage() {
  const [isClient, setIsClient] = useState(false)
  const [activeParty, setActiveParty] = useState<any>(null)
  const [parties, setParties] = useState<any[]>([])
  
  // Checklist states
  const [tasks, setTasks] = useState<any[]>([])
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskTimeframe, setNewTaskTimeframe] = useState('month') // 'month' | 'week' | 'day'
  const [activeFilter, setActiveFilter] = useState<'all' | 'month' | 'week' | 'day'>('all')
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  
  const [wizardSelections, setWizardSelections] = useState({
    catering: false,
    photo: false,
    entertainment: false,
    decoration: false,
    dresscode: false,
    transport: false,
    souvenir: false
  })
  
  // Custom Task limit for basic tier
  const CUSTOM_TASK_LIMIT = 5

  // Initial Load
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const savedParties = localStorage.getItem('vlass_parties')
      const activeId = localStorage.getItem('vlass_active_party_id')
      
      if (savedParties && activeId) {
        const parsedParties = JSON.parse(savedParties)
        setParties(parsedParties)
        const active = parsedParties.find((p: any) => p.id === activeId)
        if (active) {
          setActiveParty(active)
          initializeChecklist(active.id, active.type)
        }
      }

      // Listener for party switching
      const handlePartyUpdate = () => {
        const pStr = localStorage.getItem('vlass_parties')
        const aIdStr = localStorage.getItem('vlass_active_party_id')
        if (pStr && aIdStr) {
          const parsed = JSON.parse(pStr)
          setParties(parsed)
          const active = parsed.find((p: any) => p.id === aIdStr)
          if (active) {
            setActiveParty(active)
            initializeChecklist(active.id, active.type)
          }
        } else {
          setActiveParty(null)
          setTasks([])
        }
      }

      window.addEventListener('partyUpdated', handlePartyUpdate)
      return () => window.removeEventListener('partyUpdated', handlePartyUpdate)
    }
  }, [])

  // Initialize checklist for active party
  const initializeChecklist = (partyId: string, partyType: string) => {
    if (typeof window === 'undefined') return
    
    const savedChecklistsStr = localStorage.getItem('vlass_checklists')
    let checklists = savedChecklistsStr ? JSON.parse(savedChecklistsStr) : {}
    
    if (checklists[partyId]) {
      setTasks(checklists[partyId])
    } else {
      // Create defaults
      const defaults = partyType === 'adult' ? defaultAdultTasks : defaultKidsTasks
      const clonedDefaults = defaults.map(t => ({ ...t, isCustom: false }))
      checklists[partyId] = clonedDefaults
      localStorage.setItem('vlass_checklists', JSON.stringify(checklists))
      setTasks(clonedDefaults)
    }
  }

  // Update tasks in state and localStorage
  const updateTasks = (newTasks: any[]) => {
    if (!activeParty) return
    setTasks(newTasks)
    
    if (typeof window !== 'undefined') {
      const savedChecklistsStr = localStorage.getItem('vlass_checklists')
      let checklists = savedChecklistsStr ? JSON.parse(savedChecklistsStr) : {}
      checklists[activeParty.id] = newTasks
      localStorage.setItem('vlass_checklists', JSON.stringify(checklists))
    }
  }

  // Toggle checklist item done
  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
    updateTasks(updated)
    
    // Check for 100% completion
    const totalTasks = updated.length
    const completedTasks = updated.filter(t => t.done).length
    if (totalTasks > 0 && completedTasks === totalTasks) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF3366', '#FF9933', '#10B981', '#3B82F6', '#8B5CF6'],
        zIndex: 9999
      })
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('showToast', { detail: { message: '🎉 Luar Biasa! Semua persiapan telah selesai!' } }))
      }
    }
  }

  // Add custom task
  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskText.trim() || !activeParty) return

    const customTaskCount = tasks.filter(t => t.isCustom).length

    if (activeParty.tier === 'basic' && customTaskCount >= CUSTOM_TASK_LIMIT) {
      alert(`⚠️ BATAS TUGAS KUSTOM TERCAPAI (Paket Basic)\n\nAnda telah mencapai batas maksimal ${CUSTOM_TASK_LIMIT} tugas kustom untuk paket Gratis.\nUpgrade Pesta ini ke PRO sekarang untuk menambahkan Tugas Kustom Tanpa Batas dan merencanakan pesta impian Anda tanpa batasan!`)
      return
    }

    const newTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      timeframe: newTaskTimeframe,
      done: false,
      isCustom: true
    }

    updateTasks([...tasks, newTask])
    setNewTaskText('')
  }

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter(t => t.id !== taskId)
    updateTasks(updated)
  }

  // Todo List Wizard
  const handleWizardSubmit = () => {
    if (!activeParty) return
    
    let generatedTasks: any[] = []
    
    if (wizardSelections.catering) {
      generatedTasks.push(
        { id: `wiz-${Date.now()}-c1`, text: 'Riset dan hubungi vendor katering', timeframe: 'month', done: false, isCustom: true, isWizard: true },
        { id: `wiz-${Date.now()}-c2`, text: 'Konfirmasi menu final dengan katering', timeframe: 'week', done: false, isCustom: true, isWizard: true }
      )
    }
    if (wizardSelections.photo) {
      generatedTasks.push(
        { id: `wiz-${Date.now()}-p1`, text: 'Booking fotografer/videografer', timeframe: 'month', done: false, isCustom: true, isWizard: true },
        { id: `wiz-${Date.now()}-p2`, text: 'Kirim referensi foto/moodboard ke fotografer', timeframe: 'week', done: false, isCustom: true, isWizard: true }
      )
    }
    if (wizardSelections.entertainment) {
      generatedTasks.push(
        { id: `wiz-${Date.now()}-e1`, text: 'Sewa MC, DJ, atau Band pengiring', timeframe: 'month', done: false, isCustom: true, isWizard: true },
        { id: `wiz-${Date.now()}-e2`, text: 'Konfirmasi rundown acara dengan pengisi acara', timeframe: 'week', done: false, isCustom: true, isWizard: true }
      )
    }
    if (wizardSelections.decoration) {
      generatedTasks.push(
        { id: `wiz-${Date.now()}-d1`, text: 'Pesan dekorasi khusus (balon, bunga, backdrop)', timeframe: 'month', done: false, isCustom: true, isWizard: true },
        { id: `wiz-${Date.now()}-d2`, text: 'Pastikan vendor dekorasi bisa masuk venue lebih awal', timeframe: 'week', done: false, isCustom: true, isWizard: true }
      )
    }
    if (wizardSelections.dresscode) {
      generatedTasks.push(
        { id: `wiz-${Date.now()}-dr1`, text: 'Umumkan dresscode / tema kostum ke para tamu', timeframe: 'month', done: false, isCustom: true, isWizard: true },
        { id: `wiz-${Date.now()}-dr2`, text: 'Siapkan baju ganti cadangan untuk penyelenggara', timeframe: 'day', done: false, isCustom: true, isWizard: true }
      )
    }
    if (wizardSelections.transport) {
      generatedTasks.push(
        { id: `wiz-${Date.now()}-tr1`, text: 'Sewa kendaraan/transportasi untuk panitia/keluarga', timeframe: 'month', done: false, isCustom: true, isWizard: true },
        { id: `wiz-${Date.now()}-tr2`, text: 'Konfirmasi rute dan jam penjemputan dengan driver', timeframe: 'week', done: false, isCustom: true, isWizard: true }
      )
    }
    if (wizardSelections.souvenir) {
      generatedTasks.push(
        { id: `wiz-${Date.now()}-sv1`, text: 'Pesan suvenir/goodie bag sesuai jumlah tamu', timeframe: 'month', done: false, isCustom: true, isWizard: true },
        { id: `wiz-${Date.now()}-sv2`, text: 'Susun dan hitung ulang jumlah suvenir/goodie bag', timeframe: 'week', done: false, isCustom: true, isWizard: true }
      )
    }

    if (generatedTasks.length > 0) {
      const customTaskCount = tasks.filter(t => t.isCustom).length
      if (activeParty.tier === 'basic' && (customTaskCount + generatedTasks.length) > CUSTOM_TASK_LIMIT) {
        alert(`⚠️ BATAS TUGAS KUSTOM TERCAPAI (Paket Basic)\n\nAnda hanya dapat menambahkan maksimal ${CUSTOM_TASK_LIMIT} tugas kustom untuk paket Gratis. Upgrade ke PRO untuk menambahkan lebih banyak.`)
        return
      }

      const newTasks = [...tasks]
      generatedTasks.forEach(gT => {
        if (!newTasks.some(t => t.text === gT.text)) {
          newTasks.push(gT)
        }
      })
      updateTasks(newTasks)
    }

    setIsWizardOpen(false)
    setWizardSelections({ catering: false, photo: false, entertainment: false, decoration: false, dresscode: false, transport: false, souvenir: false })
  }

  // Trigger Upgrade Simulation
  const handleUpgradeParty = () => {
    if (!activeParty) return
    alert("--- SIMULASI UPGRADE ---\n\nPembayaran Rp 99.000 sukses. Pesta Anda kini berstatus PRO! 🎉");
    const updatedParty = { ...activeParty, tier: 'pro' }
    setActiveParty(updatedParty)
    
    const updatedParties = parties.map(p => p.id === activeParty.id ? updatedParty : p)
    setParties(updatedParties)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('vlass_parties', JSON.stringify(updatedParties))
      window.dispatchEvent(new Event('partyUpdated'))
    }
  }

  if (!isClient) return null

  // Empty State if no active party
  if (!activeParty) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <ListTodo size={64} color="#CBD5E1" style={{ marginBottom: 24 }} />
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Belum Ada Pesta Aktif</h2>
        <p style={{ color: '#64748B', maxWidth: 400, textAlign: 'center', lineHeight: 1.5 }}>
          Silakan buat pesta atau pilih pesta aktif terlebih dahulu dari menu Dasbor Utama untuk mulai mengisi To-Do List.
        </p>
      </div>
    )
  }

  // Calculation for progress
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.done).length
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)
  const customTaskCount = tasks.filter(t => t.isCustom).length
  
  let plannerTip = "Fokus pada prioritas utama seperti tempat dan tanggal terlebih dahulu agar perencanaan berjalan lancar."
  if (progressPercent >= 100) {
    plannerTip = "Luar biasa! Semua persiapan telah selesai. Anda siap untuk merayakan pesta yang tak terlupakan."
  } else if (progressPercent >= 50) {
    plannerTip = "Kerja bagus! Anda sudah separuh jalan. Jangan lupa untuk mulai menyebarkan link RSVP kepada tamu."
  }

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'all') return true
    return t.timeframe === activeFilter
  })

  return (
    <div style={{ width: '100%', paddingBottom: 60 }}>
      <style>{`
        @media (max-width: 768px) {
          .timeline-line { left: 17px !important; }
          .timeline-block { gap: 12px !important; }
          .timeline-circle { width: 36px !important; height: 36px !important; }
          .timeline-circle svg { width: 16px !important; height: 16px !important; }
          .timeline-card { padding: 16px !important; }
          .timeline-task-grid { grid-template-columns: 1fr !important; }
          .header-subtitle { flex-wrap: wrap !important; line-height: 1.5 !important; }
          .header-actions { flex-direction: column !important; width: 100% !important; }
          .header-actions button { width: 100% !important; justify-content: center !important; }
        }
      `}</style>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', marginBottom: 8, letterSpacing: '-0.02em' }}>Daftar Tugas Persiapan</h1>
          <p className="header-subtitle" style={{ fontSize: 16, color: '#64748B', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
            Tugas persiapan untuk <strong style={{ color: '#FF3366', display: 'inline-block' }}>Pesta {activeParty.name}</strong>
            <span style={{ 
              padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 800, 
              background: activeParty.tier === 'pro' ? '#FEF08A' : '#E2E8F0', 
              color: activeParty.tier === 'pro' ? '#854D0E' : '#64748B', display: 'inline-block'
            }}>
              {activeParty.tier === 'pro' ? '👑 PRO' : 'BASIC'}
            </span>
          </p>
        </div>
        
        <div className="header-actions" style={{ display: 'flex', gap: 12 }}>
          {activeParty.tier === 'basic' && (
            <button 
              onClick={handleUpgradeParty} 
              style={{ 
                padding: '12px 20px', borderRadius: 100, border: 'none', 
                background: '#F59E0B', color: 'white', fontWeight: 900, fontSize: 14, 
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, 
                boxShadow: '0 10px 20px rgba(245,158,11,0.2)' 
              }}
            >
              👑 Upgrade ke PRO
            </button>
          )}
          
          <button 
            onClick={() => setIsWizardOpen(true)}
            style={{ 
              padding: '12px 24px', borderRadius: 100, border: 'none', 
              background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)', 
              color: '#475569', 
              fontWeight: 800, fontSize: 14, cursor: 'pointer', 
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 4px 10px rgba(0,0,0,0.02), inset 0 0 0 1.5px #E2E8F0',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #8B5CF6, #6366F1)'
              e.currentTarget.style.color = 'white'
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(139,92,246,0.3)'
              const icon = e.currentTarget.querySelector('svg')
              if (icon) icon.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #F8FAFC, #F1F5F9)'
              e.currentTarget.style.color = '#475569'
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.02), inset 0 0 0 1.5px #E2E8F0'
              const icon = e.currentTarget.querySelector('svg')
              if (icon) icon.style.color = '#8B5CF6'
            }}
          >
            <Wand2 size={16} color="#8B5CF6" style={{ transition: 'color 0.2s' }} />
            Todo List Wizard
          </button>
        </div>
      </div>

      {/* Progress & Quick Add Bento Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 24 }}>
        
        {/* Progress Card */}
        <div style={{ 
          background: 'white', padding: 28, borderRadius: 24, border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden'
        }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kemajuan Rencana</span>
            <h3 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', marginTop: 4, marginBottom: 24 }}>Rencana Hampir Siap!</h3>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
            <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Fake SVG Circle */}
              <svg width="80" height="80" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="16" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                <motion.circle 
                  cx="18" cy="18" r="16" fill="none" stroke="url(#progressGradient)" strokeWidth="3" 
                  strokeDasharray="100"
                  strokeDashoffset={100 - progressPercent}
                  transition={{ duration: 1 }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF3366" />
                    <stop offset="100%" stopColor="#FF9933" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', fontSize: 16, fontWeight: 900, color: '#0F172A' }}>{progressPercent}%</div>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0F172A' }}>{completedTasks} dari {totalTasks} Selesai</p>
              <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 500, marginTop: 4 }}>
                {totalTasks - completedTasks} tugas tersisa untuk dirampungkan.
              </p>
            </div>
          </div>
          
          <div style={{ paddingTop: 20, borderTop: '1px dashed #E2E8F0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ background: '#FFF1F2', padding: 6, borderRadius: 100 }}>
                <Sparkles size={14} color="#FF3366" />
              </div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: '#FF3366', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tips Perencana</p>
            </div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#475569', lineHeight: 1.5 }}>
              {plannerTip}
            </p>
          </div>

          {/* Sparkle background decoration */}
          <div style={{ position: 'absolute', bottom: -10, right: -10, opacity: 0.05, color: '#FF3366' }}>
            <Trophy size={100} />
          </div>
        </div>

        {/* Quick Add Custom Task Card */}
        <div style={{ background: 'white', padding: 28, borderRadius: 24, border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative background */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to bottom, rgba(139, 92, 246, 0.05), transparent)', zIndex: 0 }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tambah Tugas Khusus {activeParty.tier === 'basic' && `(${customTaskCount}/${CUSTOM_TASK_LIMIT})`}
            </span>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', marginTop: 4, marginBottom: 20 }}>Butuh Tugas Lain?</h3>
            
            <form onSubmit={handleAddCustomTask} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input 
                type="text" 
                placeholder="Tulis tugas baru Anda..." 
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                style={{
                  padding: '16px 20px', borderRadius: 16, border: '1.5px solid #E2E8F0',
                  outline: 'none', fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-jakarta)',
                  color: '#0F172A', background: '#F8FAFC', transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
                onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
              />
              
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { id: 'month', label: '1 Bulan Sebelum' },
                  { id: 'week', label: '1 Minggu Sebelum' },
                  { id: 'day', label: 'Hari H Acara' }
                ].map(tf => (
                  <button
                    key={tf.id}
                    type="button"
                    onClick={() => setNewTaskTimeframe(tf.id)}
                    style={{
                      flex: 1, padding: '12px 10px', borderRadius: 12, border: '1.5px solid',
                      borderColor: newTaskTimeframe === tf.id ? '#8B5CF6' : '#E2E8F0',
                      background: newTaskTimeframe === tf.id ? '#F5F3FF' : 'white',
                      color: newTaskTimeframe === tf.id ? '#7E22CE' : '#64748B',
                      fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
              
              <button 
                type="submit" 
                style={{
                  padding: '16px 24px', borderRadius: 16, border: 'none',
                  background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                  color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, 
                  boxShadow: '0 10px 20px rgba(139,92,246,0.3)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Plus size={18} /> Tambah Tugas
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid #E2E8F0', paddingBottom: 12, flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'Semua Tahapan' },
          { id: 'month', label: '1 Bulan Sebelum' },
          { id: 'week', label: '1 Minggu Sebelum' },
          { id: 'day', label: 'Hari H Acara' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            style={{
              padding: '8px 16px', borderRadius: 100, border: 'none',
              background: activeFilter === tab.id ? '#FFF1F2' : 'transparent',
              color: activeFilter === tab.id ? '#E11D48' : '#64748B',
              fontWeight: 800, fontSize: 14, cursor: 'pointer',
              whiteSpace: 'nowrap', transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, position: 'relative' }}>
        
        {/* Decorative Vertical Timeline Line */}
        <div style={{ 
          position: 'absolute', left: 24, top: 20, bottom: 20, 
          width: 2, background: 'linear-gradient(to bottom, #FF3366, #FF9933, #E2E8F0)', 
          zIndex: 1 
        }} className="timeline-line" />

        {/* timeframe 1: Month Before */}
        {(activeFilter === 'all' || activeFilter === 'month') && (
          <TimelineBlock 
            title="1 Bulan Sebelum" 
            subtitle="Fase Persiapan Awal & Booking"
            iconColor="#3B82F6"
            tasks={filteredTasks.filter(t => t.timeframe === 'month')}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        )}

        {/* timeframe 2: Week Before */}
        {(activeFilter === 'all' || activeFilter === 'week') && (
          <TimelineBlock 
            title="1 Minggu Sebelum" 
            subtitle="Fase Detail & Konfirmasi"
            iconColor="#F59E0B"
            tasks={filteredTasks.filter(t => t.timeframe === 'week')}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        )}

        {/* timeframe 3: Day Of Event */}
        {(activeFilter === 'all' || activeFilter === 'day') && (
          <TimelineBlock 
            title="Hari H Acara" 
            subtitle="Fase Eksekusi & Pesta"
            iconColor="#10B981"
            tasks={filteredTasks.filter(t => t.timeframe === 'day')}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        )}

      </div>

      {/* Wizard Modal */}
      <AnimatePresence>
        {isWizardOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }}
              onClick={() => setIsWizardOpen(false)}
            />
            <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }}
              style={{ background: 'white', width: '100%', maxWidth: 500, borderRadius: 32, position: 'relative', zIndex: 110, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              <div style={{ padding: '22px 28px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ padding: 8, background: '#F5F3FF', borderRadius: 12 }}>
                    <Wand2 size={20} color="#8B5CF6" />
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>Todo List Wizard</h2>
                </div>
                <button onClick={() => setIsWizardOpen(false)} style={{ background: '#F1F5F9', border: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ fontSize: 14, color: '#475569', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                  Pilih kebutuhan tambahan untuk pesta Anda, dan kami akan membuatkan tugas-tugas yang relevan ke dalam checklist Anda.
                </p>

                {[
                  { id: 'catering', label: 'Katering & Makanan', icon: '🍽️' },
                  { id: 'photo', label: 'Dokumentasi (Foto/Video)', icon: '📸' },
                  { id: 'entertainment', label: 'Hiburan (DJ/Band/MC)', icon: '🎵' },
                  { id: 'decoration', label: 'Dekorasi Khusus', icon: '✨' },
                  { id: 'dresscode', label: 'Kostum & Dresscode', icon: '👕' },
                  { id: 'transport', label: 'Transportasi Khusus', icon: '🚗' },
                  { id: 'souvenir', label: 'Suvenir / Goodie Bag', icon: '🎁' }
                ].map(item => (
                  <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', border: '1.5px solid #E2E8F0', borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s', background: wizardSelections[item.id as keyof typeof wizardSelections] ? '#F5F3FF' : 'white', borderColor: wizardSelections[item.id as keyof typeof wizardSelections] ? '#8B5CF6' : '#E2E8F0' }}>
                    <input 
                      type="checkbox" 
                      checked={wizardSelections[item.id as keyof typeof wizardSelections]}
                      onChange={(e) => setWizardSelections(prev => ({ ...prev, [item.id]: e.target.checked }))}
                      style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#8B5CF6' }}
                    />
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>{item.label}</span>
                  </label>
                ))}
              </div>

              <div style={{ padding: '18px 28px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 12, background: '#F8FAFC' }}>
                <button onClick={() => setIsWizardOpen(false)} style={{ padding: '12px 24px', borderRadius: 100, border: '1.5px solid #E2E8F0', background: 'white', color: '#64748B', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  Batal
                </button>
                <button 
                  onClick={handleWizardSubmit}
                  disabled={!Object.values(wizardSelections).some(Boolean)}
                  style={{ 
                    padding: '12px 28px', borderRadius: 100, border: 'none', 
                    background: Object.values(wizardSelections).some(Boolean) ? '#8B5CF6' : '#E2E8F0', 
                    color: Object.values(wizardSelections).some(Boolean) ? 'white' : '#94A3B8', 
                    fontWeight: 900, fontSize: 14, 
                    cursor: Object.values(wizardSelections).some(Boolean) ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}
                >
                  <Plus size={16} /> Tambahkan Tugas
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Subcomponent for Timeline Block

function TimelineBlock({ 
  title, subtitle, iconColor, tasks, onToggle, onDelete 
}: { 
  title: string, subtitle: string, iconColor: string, 
  tasks: any[], onToggle: (id: string) => void, onDelete: (id: string) => void 
}) {
  
  if (tasks.length === 0) return null

  return (
    <div className="timeline-block" style={{ display: 'flex', gap: 24, position: 'relative', zIndex: 2 }}>
      
      {/* Circle Marker */}
      <div className="timeline-circle" style={{ 
        width: 50, height: 50, borderRadius: '50%', background: 'white', 
        border: `4px solid ${iconColor}`, display: 'flex', alignItems: 'center', 
        justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 20px rgba(0,0,0,0.06)'
      }}>
        <Clock size={20} color={iconColor} />
      </div>

      {/* Checklist Card Container */}
      <div className="timeline-card" style={{ flex: 1, background: 'white', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0', boxShadow: '0 5px 15px rgba(0,0,0,0.02)' }}>
        
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>{title}</h3>
          <p style={{ fontSize: 13, color: '#64748B', fontWeight: 500, margin: '4px 0 0 0' }}>{subtitle}</p>
        </div>

        <div className="timeline-task-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          <AnimatePresence initial={false}>
            {tasks.map(task => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, margin: 0, padding: 0 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: 16, border: '1px solid #F1F5F9',
                  background: task.done ? '#F8FAFC' : 'white', gap: 12,
                  boxShadow: task.done ? 'none' : '0 2px 5px rgba(0,0,0,0.01)',
                  transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
                  {/* Custom Checkbox */}
                  <motion.div 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onToggle(task.id)}
                    style={{
                      width: 22, height: 22, borderRadius: 6, 
                      border: task.done ? 'none' : '2px solid #CBD5E1',
                      background: task.done ? 'linear-gradient(135deg, #10B981, #059669)' : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0, marginTop: 1.5,
                      boxShadow: task.done ? '0 3px 8px rgba(16,185,129,0.3)' : 'none'
                    }}
                  >
                    {task.done && <Check size={14} color="white" strokeWidth={3} />}
                  </motion.div>

                  {/* Task Text */}
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: 14, fontWeight: task.done ? 500 : 700,
                      color: task.done ? '#94A3B8' : '#334155',
                      textDecoration: task.done ? 'line-through' : 'none',
                      lineHeight: 1.5, transition: 'all 0.2s', display: 'block'
                    }}>
                      {task.text}
                    </span>
                    
                    {/* Badge Indicator */}
                    <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                      {task.isCustom && (
                        <span style={{ padding: '2px 6px', borderRadius: 6, fontSize: 10, fontWeight: 800, background: '#EFF6FF', color: '#1D4ED8' }}>
                          KUSTOM
                        </span>
                      )}
                      {task.isWizard && (
                        <span style={{ padding: '2px 6px', borderRadius: 6, fontSize: 10, fontWeight: 800, background: '#FAF5FF', color: '#7E22CE', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Wand2 size={8} /> DARI WIZARD
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete Button (only if custom or wizard suggestion) */}
                {(task.isCustom || task.isWizard) && (
                  <button
                    onClick={() => onDelete(task.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: 6, borderRadius: 8, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: '#94A3B8', transition: 'all 0.2s',
                      marginTop: -2
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
                  >
                    <Trash2 size={16} />
                  </button>
                )}

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

    </div>
  )
}
