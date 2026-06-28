'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, UserPlus, Search, Download, Trash2, Edit2, AlertCircle, Phone, X, CheckCircle2, ChevronDown, FileText, FileSpreadsheet } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

// ─── Toast Helper ─────────────────────────────────────────────────────────────
const showToast = (message: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('showToast', { detail: { message } }))
  }
}

// ─── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  attending: { label: 'Hadir',       bg: '#ECFDF5', color: '#059669', dot: '#10B981' },
  pending:   { label: 'Menunggu',    bg: '#FFF7ED', color: '#D97706', dot: '#F59E0B' },
  declined:  { label: 'Tidak Hadir', bg: '#FEF2F2', color: '#DC2626', dot: '#EF4444' },
}

export default function GuestManagementPage() {
  const [isClient, setIsClient]     = useState(false)
  const [activeParty, setActiveParty] = useState<any>(null)
  const [guests, setGuests]         = useState<any[]>([])

  // Toolbar state
  const [search, setSearch]         = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'attending' | 'pending' | 'declined'>('all')

  // Add modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newGuest, setNewGuest]     = useState({ name: '', phone: '', plusOne: 0, note: '', status: 'pending' })

  // Edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingGuest, setEditingGuest]       = useState<any>(null)

  // Status dropdown (inline in table)
  const [openStatusMenuId, setOpenStatusMenuId] = useState<string | null>(null)
  const [dropdownPos, setDropdownPos]           = useState({ top: 0, left: 0 })
  const statusMenuRef = useRef<HTMLDivElement>(null)

  // Delete confirm modal
  const [confirmDeleteId, setConfirmDeleteId]     = useState<string | null>(null)
  const [confirmDeleteName, setConfirmDeleteName] = useState('')

  // Export dropdown menu
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)

  // ── Data loader ─────────────────────────────────────────────────────────────
  const loadPartyAndGuests = useCallback(() => {
    const p   = localStorage.getItem('vlass_parties')
    const aId = localStorage.getItem('vlass_active_party_id')
    if (p && aId) {
      const parties = JSON.parse(p)
      const active  = parties.find((party: any) => party.id === aId)
      setActiveParty(active || null)
    } else {
      setActiveParty(null)
    }
    const storedGuests = localStorage.getItem('vlass_guests')
    if (storedGuests && aId) {
      const parsed = JSON.parse(storedGuests)
      setGuests(parsed.filter((g: any) => g.party_id === aId))
    } else {
      setGuests([])
    }
  }, [])

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      loadPartyAndGuests()
      window.addEventListener('partyUpdated', loadPartyAndGuests)
      window.addEventListener('guestsUpdated', loadPartyAndGuests)
      return () => {
        window.removeEventListener('partyUpdated', loadPartyAndGuests)
        window.removeEventListener('guestsUpdated', loadPartyAndGuests)
      }
    }
  }, [loadPartyAndGuests])

  // Close menus when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target as Node)) {
        setOpenStatusMenuId(null)
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!isClient) return null

  if (!activeParty) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Users size={64} color="#CBD5E1" style={{ marginBottom: 24 }} />
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Belum Ada Pesta Aktif</h2>
        <p style={{ color: '#64748B' }}>Silakan buat pesta terlebih dahulu di menu Dasbor Utama.</p>
      </div>
    )
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  // Validate & format phone number
  const formatPhone = (raw: string): string => {
    let p = raw.replace(/[^0-9]/g, '')
    if (p.startsWith('0')) p = '62' + p.substring(1)
    else if (!p.startsWith('62')) p = '62' + p
    return p
  }
  const isValidPhone = (raw: string): boolean => {
    const p = formatPhone(raw)
    return p.length >= 10 && p.length <= 15
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const saveGuests = (updated: any[]) => {
    localStorage.setItem('vlass_guests', JSON.stringify(updated))
    window.dispatchEvent(new Event('guestsUpdated'))
  }

  const getAllGuests = (): any[] => {
    try { return JSON.parse(localStorage.getItem('vlass_guests') || '[]') }
    catch { return [] }
  }

  // ── Add Guest ───────────────────────────────────────────────────────────────
  const handleAddGuest = () => {
    if (activeParty?.tier === 'basic' && guests.length >= 10) {
      showToast('⚠️ Batas 10 tamu tercapai. Upgrade ke PRO untuk tamu unlimited!')
      return
    }
    if (!newGuest.name) return

    if (newGuest.phone) {
      const formatted = formatPhone(newGuest.phone)
      if (!isValidPhone(newGuest.phone)) {
        showToast('⚠️ Nomor WhatsApp tidak valid! Harus berupa angka minimal 10 digit (contoh: 08123456789 atau +628123456789)')
        return
      }
      newGuest.phone = formatted
    }

    const all = getAllGuests()
    all.push({
      id: Date.now().toString(),
      party_id: activeParty.id,
      guest_name: newGuest.name,
      phone: newGuest.phone,
      status: newGuest.status || 'pending',
      num_adults: (parseInt(newGuest.plusOne as any) || 0) + 1,
      num_children: 0,
      note: newGuest.note,
      source: 'manual',
      created_at: new Date().toISOString()
    })

    saveGuests(all)
    showToast('✅ Tamu berhasil ditambahkan!')
    setNewGuest({ name: '', phone: '', plusOne: 0, note: '', status: 'pending' })
    setIsAddModalOpen(false)
  }

  // ── Edit Guest ──────────────────────────────────────────────────────────────
  const handleEditGuest = (guest: any) => {
    setEditingGuest({
      id: guest.id,
      name: guest.guest_name,
      phone: guest.phone || '',
      plusOne: (guest.num_adults || 1) - 1,
      note: guest.note || '',
      status: guest.status || 'pending'
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateGuest = () => {
    if (!editingGuest?.name) return

    if (editingGuest.phone) {
      const formatted = formatPhone(editingGuest.phone)
      if (!isValidPhone(editingGuest.phone)) {
        showToast('⚠️ Nomor WhatsApp tidak valid! Harus berupa angka minimal 10 digit (contoh: 08123456789 atau +628123456789)')
        return
      }
      editingGuest.phone = formatted
    }

    const all = getAllGuests()
    const updated = all.map((g: any) =>
      g.id === editingGuest.id
        ? { ...g, guest_name: editingGuest.name, phone: editingGuest.phone, num_adults: (parseInt(editingGuest.plusOne) || 0) + 1, note: editingGuest.note, status: editingGuest.status }
        : g
    )
    saveGuests(updated)
    showToast('✅ Data tamu berhasil diperbarui!')
    setIsEditModalOpen(false)
    setEditingGuest(null)
  }

  // ── Change RSVP Status (inline) ─────────────────────────────────────────────
  const handleStatusChange = (guestId: string, newStatus: string) => {
    const all = getAllGuests()
    const updated = all.map((g: any) => g.id === guestId ? { ...g, status: newStatus } : g)
    saveGuests(updated)
    const label = STATUS_CONFIG[newStatus]?.label || newStatus
    showToast(`✅ Status RSVP diperbarui menjadi: ${label}`)
    setOpenStatusMenuId(null)
  }

  // ── Send WA ─────────────────────────────────────────────────────────────────
  const handleSendWA = (guest: any) => {
    if (!guest.phone) {
      showToast('⚠️ Tamu ini belum punya nomor WA. Klik Edit untuk menambahkan.')
      return
    }
    let phone = guest.phone.replace(/[^0-9]/g, '')
    if (phone.startsWith('0')) phone = '62' + phone.substring(1)
    
    const origin = window.location.origin
    const locale = window.location.pathname.split('/')[1] || 'id'
    const inviteUrl = `${origin}/${locale}/demo/${activeParty.type || 'kids'}`
    
    let message = ''
    if (guest.status === 'pending') {
      message = `Halo ${guest.guest_name},\n\nKami mengundang Anda ke acara ulang tahun *${activeParty.name}*! 🎉\n\nMohon bantuannya untuk mengonfirmasi kehadiran (RSVP) melalui link berikut agar kami dapat mempersiapkan acara dengan baik:\n${inviteUrl}\n\nTerima kasih dan ditunggu kehadirannya! 🎈`
    } else if (guest.status === 'attending') {
      message = `Halo ${guest.guest_name},\n\nTerima kasih telah melakukan konfirmasi kehadiran untuk acara ulang tahun *${activeParty.name}*! 🎉\n\nBerikut link undangan untuk melihat detail acara (Waktu & Lokasi) serta menuliskan ucapan:\n${inviteUrl}\n\nSampai jumpa di acara nanti! 🥳`
    } else {
      message = `Halo ${guest.guest_name},\n\nIni adalah link undangan untuk acara ulang tahun *${activeParty.name}*! 🎉\n\nDetail acara dapat dilihat di:\n${inviteUrl}\n\nTerima kasih! 🎈`
    }
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleExportPDF = () => {
    if (activeParty?.tier === 'basic') {
      showToast('👑 Fitur Ekspor PDF khusus Pesta PRO. Upgrade sekarang!')
      return
    }
    const doc = new jsPDF()
    doc.text(`Daftar Tamu - Pesta ${activeParty.name}`, 14, 20)
    
    const tableData = filteredGuests.map((g: any, index: number) => [
      index + 1,
      g.guest_name,
      g.phone || '-',
      STATUS_CONFIG[g.status]?.label || g.status,
      g.num_adults > 1 ? `+${g.num_adults - 1}` : '-',
      g.note || '-'
    ])

    autoTable(doc, {
      startY: 30,
      head: [['No', 'Nama Tamu', 'No WA', 'Status', 'Plus One', 'Catatan']],
      body: tableData,
    })
    
    doc.save(`Daftar_Tamu_${activeParty.name.replace(/\s+/g, '_')}.pdf`)
    showToast('📥 Laporan PDF berhasil diunduh!')
    setIsExportMenuOpen(false)
  }

  const handleExportExcel = () => {
    if (activeParty?.tier === 'basic') {
      showToast('👑 Fitur Ekspor Excel khusus Pesta PRO. Upgrade sekarang!')
      return
    }
    const tableData = filteredGuests.map((g: any, index: number) => ({
      'No': index + 1,
      'Nama Tamu': g.guest_name,
      'No WA': g.phone || '-',
      'Status': STATUS_CONFIG[g.status]?.label || g.status,
      'Plus One': g.num_adults > 1 ? g.num_adults - 1 : 0,
      'Catatan': g.note || '-'
    }))

    const worksheet = XLSX.utils.json_to_sheet(tableData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Tamu")
    
    XLSX.writeFile(workbook, `Daftar_Tamu_${activeParty.name.replace(/\s+/g, '_')}.xlsx`)
    showToast('📥 Laporan Excel berhasil diunduh!')
    setIsExportMenuOpen(false)
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDeleteRequest = (guest: any) => {
    setConfirmDeleteId(guest.id)
    setConfirmDeleteName(guest.guest_name)
  }

  const handleDeleteConfirm = () => {
    if (!confirmDeleteId) return
    const all = getAllGuests()
    saveGuests(all.filter((g: any) => g.id !== confirmDeleteId))
    showToast('🗑️ Tamu berhasil dihapus.')
    setConfirmDeleteId(null)
    setConfirmDeleteName('')
  }

  // ── Derived counts & filtered list ─────────────────────────────────────────
  const attendingCount = guests.filter(g => g.status === 'attending').length
  const pendingCount   = guests.filter(g => g.status === 'pending').length
  const declinedCount  = guests.filter(g => g.status === 'declined').length

  const filteredGuests = guests.filter(g => {
    const matchSearch = g.guest_name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || g.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalPeopleCount = guests.reduce(
    (acc, curr) => acc + (curr.status === 'attending' ? (curr.num_adults || 0) + (curr.num_children || 0) : 0),
    0
  )

  const filterTabs = [
    { key: 'all',       label: `Semua (${guests.length})` },
    { key: 'attending', label: `Hadir (${attendingCount})` },
    { key: 'pending',   label: `Menunggu (${pendingCount})` },
    { key: 'declined',  label: `Tidak Hadir (${declinedCount})` },
  ]

  // ── JSX ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ paddingBottom: 60 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', marginBottom: 8, letterSpacing: '-0.02em' }}>Manajemen Tamu</h1>
          <p style={{ fontSize: 16, color: '#64748B', fontWeight: 500, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, lineHeight: 1.5 }}>
            Kelola daftar undangan untuk <strong style={{ color: '#FF3366', display: 'inline-block' }}>Pesta {activeParty.name}</strong>
            <span style={{ padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 800, background: activeParty?.tier === 'pro' ? '#FEF08A' : '#E2E8F0', color: activeParty?.tier === 'pro' ? '#854D0E' : '#64748B', display: 'inline-block' }}>
              {activeParty?.tier === 'pro' ? '👑 PESTA PRO' : 'PESTA BASIC'}
            </span>
          </p>
        </div>

        <div className="mobile-stack" style={{ display: 'flex', gap: 12 }}>
          {activeParty?.tier === 'basic' && (
            <button onClick={() => {
              window.dispatchEvent(new CustomEvent('openCreatePartyModal')) // We can trigger a custom event or directly showToast
              showToast('✨ Silakan lakukan upgrade dari halaman Dasbor Utama.')
            }} style={{ padding: '12px 20px', borderRadius: 100, border: 'none', background: '#F59E0B', color: 'white', fontWeight: 900, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 20px rgba(245,158,11,0.2)' }}>
              👑 Upgrade ke PRO
            </button>
          )}
          <div style={{ position: 'relative' }} ref={exportMenuRef}>
            <button onClick={() => setIsExportMenuOpen(!isExportMenuOpen)} style={{ padding: '12px 20px', borderRadius: 100, border: '1.5px solid #E2E8F0', background: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer', color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Download size={18} /> Ekspor Laporan <ChevronDown size={14} style={{ marginLeft: 4 }} />
            </button>

            <AnimatePresence>
              {isExportMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: 8, zIndex: 100,
                    background: 'white', borderRadius: 16, border: '1px solid #E2E8F0',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)', overflow: 'hidden', minWidth: 200
                  }}
                >
                  <button onClick={handleExportPDF} style={{ width: '100%', padding: '16px 20px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={16} color="#EF4444" />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 2 }}>Format PDF</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>Dokumen siap cetak</div>
                    </div>
                  </button>
                  <button onClick={handleExportExcel} style={{ width: '100%', padding: '16px 20px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileSpreadsheet size={16} color="#10B981" />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 2 }}>Format Excel</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>.xlsx untuk diolah</div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={() => {
            if (activeParty?.tier === 'basic' && guests.length >= 10) {
              showToast('⚠️ Batas 10 tamu tercapai. Upgrade ke PRO untuk tamu unlimited!')
            } else {
              setIsAddModalOpen(true)
            }
          }} style={{ padding: '12px 20px', borderRadius: 100, border: 'none', background: 'linear-gradient(135deg, #FF3366, #FF9933)', color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 20px rgba(255,51,102,0.2)' }}>
            <UserPlus size={18} /> Tambah Tamu
          </button>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
        {[
          { label: 'Total Undangan', value: `${guests.length}${activeParty?.tier === 'basic' ? ' / 10' : ''}`, bg: '#EEF2FF', iconColor: '#4338CA', Icon: Users },
          { label: 'Pasti Hadir',    value: String(attendingCount), bg: '#ECFDF5', iconColor: '#10B981', Icon: CheckCircle2 },
          { label: 'Belum RSVP',     value: String(pendingCount),   bg: '#FFF7ED', iconColor: '#F97316', Icon: AlertCircle },
          { label: 'Tidak Hadir',    value: String(declinedCount),  bg: '#FEF2F2', iconColor: '#EF4444', Icon: X },
        ].map(({ label, value, bg, iconColor, Icon }) => (
          <div key={label} style={{ background: 'white', padding: '20px 24px', borderRadius: 24, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={22} color={iconColor} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#64748B', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A' }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Table Area ── */}
      <div style={{ background: 'white', borderRadius: 24, border: '1px solid #E2E8F0', overflow: 'hidden' }}>

        {/* Toolbar: Search + Filter Tabs */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative', width: 300 }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari nama tamu..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 40px', border: '1.5px solid #E2E8F0', borderRadius: 100, fontSize: 14, fontFamily: 'var(--font-jakarta)', outline: 'none', background: 'white' }}
              />
            </div>
            {/* Quota badge */}
            {activeParty?.tier === 'basic' && (
              <div style={{ background: '#FFF1F2', padding: '8px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, color: '#E11D48', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={13} /> Sisa {Math.max(0, 10 - guests.length)} Kuota Tamu
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key as any)}
                style={{
                  padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none',
                  background: filterStatus === tab.key ? '#0F172A' : '#E2E8F0',
                  color:      filterStatus === tab.key ? 'white'   : '#64748B',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'white' }}>
                {['NAMA TAMU', 'SUMBER', 'STATUS RSVP', 'NO. WHATSAPP', activeParty.type === 'kids' ? 'DETAIL TAMU' : 'PLUS ONE', 'CATATAN', 'AKSI'].map(col => (
                  <th key={col} style={{ padding: '14px 20px', fontSize: 12, color: '#94A3B8', fontWeight: 800, borderBottom: '1px solid #E2E8F0', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '56px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <Users size={40} color="#CBD5E1" />
                      <p style={{ color: '#94A3B8', fontWeight: 600, fontSize: 15, margin: 0 }}>
                        {search || filterStatus !== 'all' ? 'Tidak ada tamu yang cocok dengan filter.' : 'Belum ada tamu. Klik "Tambah Tamu" untuk mulai.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredGuests.map((guest, i) => {
                const sc = STATUS_CONFIG[guest.status] || STATUS_CONFIG.pending
                return (
                  <motion.tr
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    key={guest.id}
                    style={{ borderBottom: '1px solid #F1F5F9' }}
                  >
                    {/* Name */}
                    <td style={{ padding: '14px 20px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#4338CA', flexShrink: 0 }}>
                          {guest.guest_name.charAt(0).toUpperCase()}
                        </div>
                        {guest.guest_name}
                      </div>
                    </td>

                    {/* Source */}
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ display: 'inline-block', whiteSpace: 'nowrap', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: guest.source === 'invite' ? '#F3E8FF' : '#E2E8F0', color: guest.source === 'invite' ? '#7E22CE' : '#475569' }}>
                        {guest.source === 'invite' ? '🔗 Via Invite' : '✍️ Manual'}
                      </span>
                    </td>

                    {/* Status RSVP – inline dropdown */}
                    <td style={{ padding: '14px 20px' }}>
                      <button
                        onClick={(e) => {
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                          setDropdownPos({ top: rect.bottom + 6, left: rect.left })
                          setOpenStatusMenuId(prev => prev === guest.id ? null : guest.id)
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 8px',
                          borderRadius: 100, border: `1.5px solid ${sc.color}30`,
                          background: sc.bg, cursor: 'pointer', fontWeight: 800, fontSize: 12, color: sc.color,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                        {sc.label}
                        <ChevronDown size={12} />
                      </button>

                      {/* Dropdown rendered via AnimatePresence – fixed position so table overflow doesn't clip it */}
                      <AnimatePresence>
                        {openStatusMenuId === guest.id && (
                          <motion.div
                            ref={statusMenuRef}
                            initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }}
                            style={{
                              position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999,
                              background: 'white', borderRadius: 16, border: '1px solid #E2E8F0',
                              boxShadow: '0 10px 30px rgba(0,0,0,0.15)', overflow: 'hidden', minWidth: 170
                            }}
                          >
                            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                              <button
                                key={key}
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(guest.id, key) }}
                                style={{
                                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                                  padding: '12px 16px', border: 'none', cursor: 'pointer', textAlign: 'left',
                                  background: guest.status === key ? cfg.bg : 'white',
                                  fontWeight: 700, fontSize: 13, color: guest.status === key ? cfg.color : '#334155',
                                }}
                              >
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                                {cfg.label}
                                {guest.status === key && <CheckCircle2 size={14} style={{ marginLeft: 'auto' }} color={cfg.color} />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>

                    {/* Phone */}
                    <td style={{ padding: '14px 20px', color: guest.phone ? '#334155' : '#CBD5E1', fontSize: 13, whiteSpace: 'nowrap' }}>
                      {guest.phone || '— belum diisi —'}
                    </td>

                    {/* Plus one / detail */}
                    <td style={{ padding: '14px 20px', color: '#64748B', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {activeParty.type === 'kids'
                        ? `${guest.num_adults || 0} Dewasa, ${guest.num_children || 0} Anak`
                        : (guest.num_adults > 1 ? `+${guest.num_adults - 1}` : '—')
                      }
                    </td>

                    {/* Note */}
                    <td style={{ padding: '14px 20px', color: '#64748B', fontSize: 13, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {activeParty.type === 'kids' && guest.will_drop_off != null && (
                        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 6, background: guest.will_drop_off ? '#FFF1F2' : '#ECFDF5', color: guest.will_drop_off ? '#E11D48' : '#10B981', marginRight: 8, display: 'inline-block' }}>
                          {guest.will_drop_off ? '🚗 Drop-off' : '👨‍👩‍👦 Ditemani'}
                        </span>
                      )}
                      {guest.dietary_restrictions || guest.note || <span style={{ color: '#CBD5E1' }}>—</span>}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center' }}>
                        <button onClick={() => handleSendWA(guest)} title="Kirim undangan via WA"
                          style={{ background: '#ECFDF5', border: 'none', cursor: 'pointer', color: '#059669', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700, fontSize: 12, padding: '6px 12px', borderRadius: 100 }}>
                          <Phone size={13} /> WA
                        </button>
                        <button onClick={() => handleEditGuest(guest)} title="Edit tamu"
                          style={{ background: '#F1F5F9', border: 'none', cursor: 'pointer', color: '#475569', padding: 7, borderRadius: 8, display: 'flex' }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDeleteRequest(guest)} title="Hapus tamu"
                          style={{ background: '#FEF2F2', border: 'none', cursor: 'pointer', color: '#EF4444', padding: 7, borderRadius: 8, display: 'flex' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>
            Menampilkan <strong>{filteredGuests.length}</strong> dari <strong>{guests.length}</strong> tamu
          </span>
          <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>
            Total Estimasi Hadir: <strong style={{ color: '#059669' }}>{totalPeopleCount} Orang</strong>
          </span>
        </div>
      </div>

      {/* ── Add Guest Modal ── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <GuestModal
            title="Tambah Tamu Baru"
            guest={newGuest}
            activeParty={activeParty}
            onChange={(field: string, val: any) => setNewGuest(prev => ({ ...prev, [field]: val }))}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleAddGuest}
            saveLabel="Simpan Tamu"
          />
        )}
      </AnimatePresence>

      {/* ── Edit Guest Modal ── */}
      <AnimatePresence>
        {isEditModalOpen && editingGuest && (
          <GuestModal
            title="Edit Data Tamu"
            guest={editingGuest}
            activeParty={activeParty}
            onChange={(field: string, val: any) => setEditingGuest((prev: any) => ({ ...prev, [field]: val }))}
            onClose={() => { setIsEditModalOpen(false); setEditingGuest(null) }}
            onSave={handleUpdateGuest}
            saveLabel="Simpan Perubahan"
          />
        )}
      </AnimatePresence>

      {/* ── Delete Confirm Modal ── */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)' }}
              onClick={() => setConfirmDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{ background: 'white', borderRadius: 28, padding: '40px 36px', width: '100%', maxWidth: 400, position: 'relative', zIndex: 210, boxShadow: '0 25px 60px -10px rgba(0,0,0,0.3)', textAlign: 'center' }}
            >
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #FEF2F2, #FFE4E6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Trash2 size={32} color="#EF4444" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 10 }}>Hapus Tamu?</h3>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 28 }}>
                Anda akan menghapus <strong style={{ color: '#0F172A' }}>{confirmDeleteName}</strong> dari daftar undangan. Tindakan ini tidak dapat dibatalkan.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setConfirmDeleteId(null)} style={{ flex: 1, padding: '14px', borderRadius: 100, border: '1.5px solid #E2E8F0', background: 'white', color: '#64748B', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>
                  Batal
                </button>
                <button onClick={handleDeleteConfirm} style={{ flex: 1, padding: '14px', borderRadius: 100, border: 'none', background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-jakarta)', boxShadow: '0 8px 20px rgba(239,68,68,0.35)' }}>
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Reusable Guest Modal ─────────────────────────────────────────────────────
function GuestModal({ title, guest, activeParty, onChange, onClose, onSave, saveLabel }: {
  title: string; guest: any; activeParty: any
  onChange: (field: string, val: any) => void
  onClose: () => void; onSave: () => void; saveLabel: string
}) {
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px', border: '1.5px solid #E2E8F0',
    borderRadius: 12, fontSize: 14, fontFamily: 'var(--font-jakarta)', outline: 'none', boxSizing: 'border-box'
  }
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6, color: '#334155' }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />
      <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }}
        style={{ background: 'white', width: '100%', maxWidth: 500, borderRadius: 32, position: 'relative', zIndex: 110, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ padding: '22px 28px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto' }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Nama Lengkap *</label>
            <input value={guest.name} onChange={e => onChange('name', e.target.value)} type="text" placeholder="Contoh: Budi Santoso" style={inputStyle} />
          </div>

          {/* WhatsApp */}
          <div>
            <label style={labelStyle}>Nomor WhatsApp</label>
            <input value={guest.phone} onChange={e => onChange('phone', e.target.value)} type="tel" placeholder="Contoh: 081234567890" style={inputStyle} />
            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 6, lineHeight: 1.5 }}>
              💬 Digunakan untuk mengirim link undangan & RSVP via WhatsApp.
            </p>
          </div>

          {/* Status RSVP */}
          <div>
            <label style={labelStyle}>Status RSVP</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button key={key} onClick={() => onChange('status', key)}
                  style={{
                    flex: 1, padding: '10px 8px', borderRadius: 12, border: `2px solid ${guest.status === key ? cfg.dot : '#E2E8F0'}`,
                    background: guest.status === key ? cfg.bg : 'white', color: guest.status === key ? cfg.color : '#94A3B8',
                    fontWeight: 800, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s'
                  }}>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Plus One & Note */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Plus One</label>
              <input value={guest.plusOne} onChange={e => onChange('plusOne', Number(e.target.value))} type="number" min="0" max="10" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{activeParty.type === 'kids' ? 'Alergi / Catatan' : 'Catatan / Afiliasi'}</label>
              <input value={guest.note} onChange={e => onChange('note', e.target.value)} type="text" placeholder={activeParty.type === 'kids' ? 'Misal: Alergi susu' : 'Misal: Teman kuliah'} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '18px 28px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 12, background: '#F8FAFC', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
          <button onClick={onClose} style={{ padding: '12px 24px', borderRadius: 100, border: '1.5px solid #E2E8F0', background: 'white', color: '#64748B', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Batal
          </button>
          <button onClick={onSave} disabled={!guest.name}
            style={{ padding: '12px 28px', borderRadius: 100, border: 'none', background: guest.name ? '#0F172A' : '#E2E8F0', color: guest.name ? 'white' : '#94A3B8', fontWeight: 900, fontSize: 14, cursor: guest.name ? 'pointer' : 'not-allowed' }}>
            {saveLabel}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
