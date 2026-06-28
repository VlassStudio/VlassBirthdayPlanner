'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PartyPopper, Calendar, MapPin, X, ArrowRight, Baby, Wine, Check, Clock, Sparkles, ChevronLeft, ChevronRight, Copy, Share2, Users, Settings, Trash2, Plus, Search, AlertTriangle, Car, Gift, DollarSign, Shirt, Camera, Hash, ExternalLink, MessageSquareHeart } from 'lucide-react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import Image from 'next/image'
import html2canvas from 'html2canvas'
import ThemeRenderer from '@/components/themes/ThemeRenderer'
import { kidsThemes as fullKidsThemes, adultThemes as fullAdultThemes } from '@/app/[locale]/editor/themes'

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const locale = params?.locale || 'id'
  const [isClient, setIsClient] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  
  // Custom Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  
  // Dashboard State
  const [parties, setParties] = useState<any[]>([])
  const [activePartyId, setActivePartyId] = useState<string | null>(null)
  const [previewKey, setPreviewKey] = useState(0)
  const [editingPartyId, setEditingPartyId] = useState<string | null>(null)
  const [deletingParty, setDeletingParty] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const activeParty = parties.find(p => p.id === activePartyId)
  const isListView = searchParams.get('view') === 'list' || activePartyId === null
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  
  // States for interactive adult mode widgets (Budget, Dress Code, Hashtag)
  const [budgetTotal, setBudgetTotal] = useState(10000000)
  const [budgetUsed, setBudgetUsed] = useState(4500000)
  const [isEditingDressCode, setIsEditingDressCode] = useState(false)
  const [dressCodeTitleInput, setDressCodeTitleInput] = useState('Smart Casual Elegan')
  const [dressCodeDescInput, setDressCodeDescInput] = useState('Harap gunakan pakaian dengan nuansa monokrom (Hitam/Putih).')
  const [isEditingHashtag, setIsEditingHashtag] = useState(false)
  const [hashtagInput, setHashtagInput] = useState('')
  const [wishlistInput, setWishlistInput] = useState('')
  const [isEditingWishlist, setIsEditingWishlist] = useState(false)
  const [hostPhoneInput, setHostPhoneInput] = useState('')
  const [isEditingHostPhone, setIsEditingHostPhone] = useState(false)
  const [selectedThemePreview, setSelectedThemePreview] = useState<string | null>(null)

  // Helper to update active party properties in localStorage database
  const updateActivePartyProperties = (updatedProps: any) => {
    if (!activePartyId) return
    const updatedParties = parties.map(p => p.id === activePartyId ? { ...p, ...updatedProps } : p)
    setParties(updatedParties)
    if (typeof window !== 'undefined') {
      localStorage.setItem('glyka_parties', JSON.stringify(updatedParties))
      window.dispatchEvent(new Event('partyUpdated'))
    }
  }

  // Load interactive features
  useEffect(() => {
    if (!activePartyId) return
    
    // Load budget
    const savedBudgetsStr = localStorage.getItem('glyka_budgets') || localStorage.getItem('vlass_budgets')
    if (savedBudgetsStr) {
      const budgets = JSON.parse(savedBudgetsStr)
      if (budgets[activePartyId]) {
        const total = budgets[activePartyId].total || 10000000
        const items = budgets[activePartyId].items || []
        const used = items.reduce((sum: number, item: any) => sum + (item.amount || 0), 0)
        setBudgetTotal(total)
        setBudgetUsed(used || 4500000) // default mock used if no real items added yet
      } else {
        setBudgetTotal(10000000)
        setBudgetUsed(4500000)
      }
    } else {
      setBudgetTotal(10000000)
      setBudgetUsed(4500000)
    }

    // Load dress code & hashtag from activeParty properties
    const currentParty = parties.find(p => p.id === activePartyId)
    if (currentParty) {
      setDressCodeTitleInput(currentParty.dressCodeTitle || 'Smart Casual Elegan')
      setDressCodeDescInput(currentParty.dressCodeDesc || 'Harap gunakan pakaian dengan nuansa monokrom (Hitam/Putih).')
      setHashtagInput(currentParty.socialHashtag || `#${currentParty.name.replace(/\s+/g, '')}Glyka2026`)
      setWishlistInput(currentParty.toyWishlistLink || '')
      setHostPhoneInput(currentParty.hostPhone || '')
      setSelectedThemePreview(currentParty.theme || null)
    }
  }, [activePartyId, parties])

  useEffect(() => {
    setPreviewKey(k => k + 1)
  }, [selectedThemePreview])
  
  const [partyData, setPartyData] = useState({
    type: '',
    name: '',
    hostName: '',
    age: '',
    date: '', // format YYYY-MM-DD
    time: '',
    location: '',
    theme: '',
    tier: 'basic'
  })

  // Upgrade PRO Modal
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [upgradingPartyId, setUpgradingPartyId] = useState<string | null>(null)

  const isNameDuplicate = parties.some(p => 
    p.name.toLowerCase().trim() === partyData.name.toLowerCase().trim() && 
    (modalMode === 'create' || p.id !== (editingPartyId || activeParty?.id))
  )

  // State for guests to display counts dynamically
  const [allGuests, setAllGuests] = useState<any[]>([])

  // Prevent hydration mismatch
  useEffect(() => { 
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const savedParties = localStorage.getItem('glyka_parties') || localStorage.getItem('vlass_parties')
      if (savedParties) setParties(JSON.parse(savedParties))
      const activeId = localStorage.getItem('glyka_active_party_id') || localStorage.getItem('vlass_active_party_id')
      setActivePartyId(activeId)

      const savedGuests = localStorage.getItem('glyka_guests') || localStorage.getItem('vlass_guests')
      if (savedGuests) setAllGuests(JSON.parse(savedGuests))

      const handleUpdate = () => {
        const p = localStorage.getItem('glyka_parties') || localStorage.getItem('vlass_parties')
        if (p) setParties(JSON.parse(p))
        const aId = localStorage.getItem('glyka_active_party_id') || localStorage.getItem('vlass_active_party_id')
        setActivePartyId(aId)
      }
      const handleGuestsUpdate = () => {
        const g = localStorage.getItem('glyka_guests') || localStorage.getItem('vlass_guests')
        if (g) setAllGuests(JSON.parse(g))
      }
      const handleOpenModal = () => {
        setPartyData({ type: '', name: '', hostName: '', age: '', date: '', time: '', location: '', theme: '', tier: 'basic' })
        setStep(1)
        setModalMode('create')
        setIsModalOpen(true)
      }
      
      // Auto-open Setup Wizard if navigated with search param ?action=create
      const params = new URLSearchParams(window.location.search)
      if (params.get('action') === 'create') {
        setPartyData({ type: '', name: '', hostName: '', age: '', date: '', time: '', location: '', theme: '', tier: 'basic' })
        setStep(1)
        setModalMode('create')
        setIsModalOpen(true)
        // Clean URL parameter
        const url = new URL(window.location.href)
        url.searchParams.delete('action')
        window.history.replaceState({}, '', url.pathname + url.search)
      }

      window.addEventListener('partyUpdated', handleUpdate)
      window.addEventListener('guestsUpdated', handleGuestsUpdate)
      window.addEventListener('openCreatePartyModal', handleOpenModal)
      return () => {
        window.removeEventListener('partyUpdated', handleUpdate)
        window.removeEventListener('guestsUpdated', handleGuestsUpdate)
        window.removeEventListener('openCreatePartyModal', handleOpenModal)
      }
    }
  }, [])

  // Countdown Timer
  useEffect(() => {
    if (!activeParty?.date) return

    const calculateTimeLeft = () => {
      const targetDate = new Date(`${activeParty.date}T${activeParty.time || '00:00'}`)
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [activeParty?.date, activeParty?.time])

  const nextStep = () => {
    if (modalMode === 'edit' && step === 2) setStep(4)
    else setStep(s => s + 1)
  }
  const prevStep = () => {
    if (modalMode === 'edit' && step === 4) setStep(2)
    else setStep(s => s - 1)
  }

  const handleFinish = () => {
    setIsModalOpen(false)
    let updatedParties = [...parties]
    
    if (modalMode === 'edit') {
      const targetId = editingPartyId || activeParty?.id
      if (targetId) {
        updatedParties = updatedParties.map(p => p.id === targetId ? { ...partyData, id: targetId } : p)
      }
    } else {
      const newId = Date.now().toString()
      const newParty = { ...partyData, id: newId }
      updatedParties.push(newParty)
      if (typeof window !== 'undefined') {
        localStorage.setItem('glyka_active_party_id', newId)
        setActivePartyId(newId)
      }
    }

    setParties(updatedParties)
    if (typeof window !== 'undefined') {
      localStorage.setItem('glyka_parties', JSON.stringify(updatedParties))
      window.dispatchEvent(new Event('partyUpdated'))
    }
    setStep(1)
    setEditingPartyId(null)
  }

  // Upgrade PRO Helper
  const handleUpgradeToPro = (partyId?: string) => {
    const targetId = partyId || activeParty?.id
    if (!targetId) return
    const updatedParties = parties.map(p => p.id === targetId ? { ...p, tier: 'pro' } : p)
    setParties(updatedParties)
    if (typeof window !== 'undefined') {
      localStorage.setItem('glyka_parties', JSON.stringify(updatedParties))
      window.dispatchEvent(new Event('partyUpdated'))
    }
    setIsUpgradeModalOpen(false)
    setUpgradingPartyId(null)
    window.dispatchEvent(new CustomEvent('showToast', { detail: { message: '🎉 Selamat! Pesta Anda kini berstatus PRO!' } }))
  }

  const handleQuickThemeChange = (themeId: string) => {
    if (!activeParty) return
    const updatedParties = parties.map(p => p.id === activeParty.id ? { ...p, theme: themeId } : p)
    setParties(updatedParties)
    if (typeof window !== 'undefined') {
      localStorage.setItem('glyka_parties', JSON.stringify(updatedParties))
      window.dispatchEvent(new Event('partyUpdated'))
    }
  }

  // --- CALENDAR LOGIC ---
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1 // Monday start
  }

  const daysInMonthArray = Array.from({ length: getDaysInMonth(currentYear, currentMonth) }, (_, i) => i + 1)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const emptyCells = Array.from({ length: firstDay }, (_, i) => i)
  
  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1))
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1))
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCurrentDate(new Date(parseInt(e.target.value), currentMonth))
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCurrentDate(new Date(currentYear, parseInt(e.target.value)))

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
  const timeSlots = ['09:00', '10:00', '13:00', '15:00', '18:00', '19:00']

  // --- THEMES LOGIC ---
  const kidsThemes = fullKidsThemes.map(t => ({
    ...t,
    isVip: !['dino', 'safari'].includes(t.id)
  }));

  const adultThemes = fullAdultThemes.map(t => ({
    ...t,
    isVip: !['minimalist', 'retro'].includes(t.id)
  }));

  const currentThemesList = partyData.type === 'adult' ? adultThemes : kidsThemes

  const handleThemeSelect = (theme: any) => {
    if (theme.isVip && partyData.tier === 'basic') {
      alert(`👑 WAH! Selera Anda sangat bagus.\n\nTema "${theme.label}" adalah desain VIP eksklusif.\nAnda telah memilih Paket Basic untuk pesta ini. Kembali ke langkah sebelumnya untuk memilih Paket VIP agar bisa menggunakan tema ini!`)
      return
    }
    setPartyData({...partyData, theme: theme.id})
  }

  if (!isClient) return null

  return (
    <div style={{ width: '100%', minHeight: '80vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {!activeParty && parties.length === 0 ? (
        // Empty State
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{
            maxWidth: 500, textAlign: 'center', padding: '40px 24px', background: 'white', borderRadius: 32,
            boxShadow: '0 20px 60px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', width: '100%'
          }}>
            <div style={{ width: 100, height: 100, background: '#FFF1F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', position: 'relative' }}>
              <PartyPopper size={48} color="#E11D48" />
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }} style={{ position: 'absolute', top: -10, right: -10 }}>
                <Sparkles size={24} color="#F59E0B" />
              </motion.div>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', marginBottom: 12 }}>Belum Ada Pesta</h2>
            <p style={{ color: '#64748B', fontSize: 16, lineHeight: 1.6, marginBottom: 32, fontWeight: 500 }}>
              Ruang kerja Anda masih kosong. Mari mulai merencanakan momen ajaib dan buat undangan pertama Anda sekarang!
            </p>
            
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('openCreatePartyModal'))
              }
            }} style={{
              background: 'linear-gradient(135deg, #FF3366, #FF9933)', color: 'white', border: 'none',
              padding: '16px 32px', borderRadius: 100, fontSize: 16, fontWeight: 800, cursor: 'pointer',
              fontFamily: 'var(--font-jakarta)', boxShadow: '0 10px 20px rgba(255,51,102,0.3)',
              display: 'inline-flex', alignItems: 'center', gap: 12
            }}>
              <PartyPopper size={20} /> Buat Pesta Baru
            </motion.button>
          </motion.div>
        </div>
      ) : isListView && parties.length > 0 ? (
        // Multi-Party Selector Hub
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Pilih Pesta Anda
            </h1>
            <p style={{ fontSize: 16, color: '#64748B', fontWeight: 500, marginBottom: 16 }}>
              Anda memiliki {parties.length} pesta yang terencana. Pilih salah satu untuk mulai mengelola.
            </p>
            
            {/* Search Input for Parties */}
            <div style={{ position: 'relative', maxWidth: 400 }}>
              <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Cari nama pesta..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', padding: '12px 16px 12px 44px', borderRadius: 12, 
                  border: '1.5px solid #E2E8F0', fontSize: 14, fontFamily: 'var(--font-jakarta)',
                  outline: 'none', background: 'white'
                }} 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24, marginTop: 16 }}>
            {parties.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => {
              const isSelected = p.id === activePartyId;
              return (
              <motion.div 
                key={p.id}
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('glyka_active_party_id', p.id)
                    setActivePartyId(p.id)
                    window.dispatchEvent(new Event('partyUpdated'))
                    const url = new URL(window.location.href)
                    url.searchParams.delete('view')
                    router.push(url.pathname + url.search)
                  }
                }}
                style={{
                  background: isSelected ? '#FFF1F2' : 'white', 
                  padding: 24, borderRadius: 24, 
                  border: isSelected ? '2px solid #E11D48' : '1.5px solid #E2E8F0',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  minHeight: 200, position: 'relative', transition: 'all 0.2s'
                }}
              >
                {isSelected && (
                  <div style={{ position: 'absolute', top: -10, right: 24, background: '#E11D48', color: 'white', fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Check size={12} /> AKTIF
                  </div>
                )}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 900, 
                      background: p.type === 'adult' ? '#EEF2FF' : '#FFF1F2', 
                      color: p.type === 'adult' ? '#4338CA' : '#E11D48'
                    }}>
                      {p.type === 'adult' ? '🥂 Dewasa' : '🧒 Anak'}
                    </span>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 900, 
                      background: p.tier === 'pro' ? '#FEF08A' : '#F1F5F9', 
                      color: p.tier === 'pro' ? '#854D0E' : '#64748B'
                    }}>
                      {p.tier === 'pro' ? '👑 PRO' : 'BASIC'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                    <Calendar size={14} /> {p.date ? new Date(p.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '--'}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 16, marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Select Party Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('glyka_active_party_id', p.id)
                        setActivePartyId(p.id)
                        window.dispatchEvent(new Event('partyUpdated'))
                        const url = new URL(window.location.href)
                        url.searchParams.delete('view')
                        router.push(url.pathname + url.search)
                      }
                    }}
                    style={{
                      width: '100%', padding: '10px 16px', borderRadius: 10, border: 'none',
                      background: isSelected ? '#10B981' : 'linear-gradient(135deg, #FF3366, #FF9933)', 
                      color: 'white',
                      fontWeight: 800, fontSize: 13, cursor: isSelected ? 'default' : 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: isSelected ? 'none' : '0 4px 12px rgba(255,51,102,0.15)'
                    }}
                  >
                    {isSelected ? (
                      <><Check size={14} /> Terpilih</>
                    ) : (
                      <>Pilih Pesta <ArrowRight size={14} /></>
                    )}
                  </button>

                  <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingPartyId(p.id)
                        setPartyData({
                          type: p.type || '',
                          name: p.name || '',
                          hostName: p.hostName || '',
                          age: p.age || '',
                          date: p.date || '',
                          time: p.time || '',
                          location: p.location || '',
                          theme: p.theme || '',
                          tier: p.tier || 'basic'
                        })
                        setModalMode('edit')
                        setStep(1)
                        setIsModalOpen(true)
                      }}
                      style={{
                        flex: 1, padding: '6px 12px', borderRadius: 8, border: '1.5px solid #E2E8F0',
                        background: 'white', color: '#0F172A', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                      }}
                    >
                      <Settings size={12} /> Edit
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeletingParty(p)
                        setDeletePassword('')
                        setDeleteError('')
                        setIsDeleteModalOpen(true)
                      }}
                      style={{
                        flex: 1, padding: '6px 12px', borderRadius: 8, border: '1.5px solid #FEE2E2',
                        background: '#FEF2F2', color: '#EF4444', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                      }}
                    >
                      <Trash2 size={12} /> Hapus
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Klik untuk buka dasbor</span>
                    <ArrowRight size={14} color={isSelected ? "#10B981" : "#FF3366"} />
                  </div>
                </div>
              </motion.div>
            )})}

            {/* Create New Party Card */}
            <motion.div 
              whileHover={{ y: -5, borderColor: '#FF3366' }}
              onClick={() => {
                setPartyData({ type: '', name: '', hostName: '', age: '', date: '', time: '', location: '', theme: '', tier: 'basic' })
                setStep(1)
                setModalMode('create')
                setIsModalOpen(true)
              }}
              style={{
                background: 'rgba(255,255,255,0.5)', padding: 24, borderRadius: 24, border: '2px dashed #E2E8F0',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: 200, gap: 12
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={24} color="#FF3366" />
              </div>
              <span style={{ fontWeight: 800, fontSize: 16, color: '#FF3366' }}>Buat Pesta Baru</span>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        // Active Dashboard State
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60 }}>
          {/* Premium Header Dashboard */}
          <div style={{ 
            order: 1,
            background: activeParty.type === 'adult' ? 'linear-gradient(135deg, #0F172A 0%, #312E81 100%)' : 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
            borderRadius: 32, padding: '40px 32px', position: 'relative', overflow: 'hidden',
            boxShadow: activeParty.type === 'adult' ? '0 30px 60px rgba(15, 23, 42, 0.3)' : '0 30px 60px rgba(225, 29, 72, 0.1)',
            border: activeParty.type === 'adult' ? '1px solid rgba(255,255,255,0.1)' : '1px solid white'
          }}>
            {/* Ambient Background Glows */}
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, background: activeParty.type === 'adult' ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 51, 102, 0.15)', borderRadius: '50%', filter: 'blur(60px)' }} />
            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', bottom: -50, left: '10%', width: 250, height: 250, background: activeParty.type === 'adult' ? 'rgba(236, 72, 153, 0.4)' : 'rgba(245, 158, 11, 0.15)', borderRadius: '50%', filter: 'blur(50px)' }} />

            <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32 }}>
              <div style={{ flex: 1, minWidth: 300 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <span style={{ 
                    padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 900, 
                    background: activeParty.tier === 'pro' ? 'linear-gradient(135deg, #FDE047, #F59E0B)' : (activeParty.type === 'adult' ? 'rgba(255,255,255,0.1)' : 'white'), 
                    color: activeParty.tier === 'pro' ? '#713F12' : (activeParty.type === 'adult' ? '#94A3B8' : '#64748B'), 
                    backdropFilter: 'blur(10px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    {activeParty.tier === 'pro' ? <><Sparkles size={14}/> PRO EDITION</> : 'BASIC EDITION'}
                  </span>
                  <span style={{ 
                    padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 900, 
                    background: activeParty.type === 'adult' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.7)', 
                    color: activeParty.type === 'adult' ? 'white' : '#E11D48', 
                    backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    {activeParty.type === 'adult' ? <><Wine size={14}/> Pesta Dewasa</> : <><Baby size={14}/> Pesta Anak</>}
                  </span>
                </div>
                
                <h1 style={{ fontSize: 48, fontWeight: 900, color: activeParty.type === 'adult' ? 'white' : '#0F172A', marginBottom: 16, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                  {activeParty.name}
                </h1>
                
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: activeParty.type === 'adult' ? 'rgba(255,255,255,0.1)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                      <Calendar size={18} color={activeParty.type === 'adult' ? '#A5B4FC' : '#3B82F6'} /> 
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: activeParty.type === 'adult' ? '#818CF8' : '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Waktu Pelaksanaan</p>
                      <p style={{ margin: 0, fontSize: 15, color: activeParty.type === 'adult' ? '#E0E7FF' : '#334155', fontWeight: 700 }}>
                        {new Date(activeParty.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} • {activeParty.time}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: activeParty.type === 'adult' ? 'rgba(255,255,255,0.1)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                      <MapPin size={18} color={activeParty.type === 'adult' ? '#F472B6' : '#FF3366'} /> 
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: activeParty.type === 'adult' ? '#F472B6' : '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lokasi Pesta</p>
                      <p style={{ margin: 0, fontSize: 15, color: activeParty.type === 'adult' ? '#FCE7F3' : '#334155', fontWeight: 700 }}>
                        {activeParty.location || 'Lokasi belum ditentukan'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 200 }}>
                {activeParty.tier === 'basic' && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => {
                    setUpgradingPartyId(activeParty.id)
                    setIsUpgradeModalOpen(true)
                  }} style={{ padding: '14px 24px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #FDE047, #F59E0B)', color: '#713F12', fontWeight: 900, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 10px 25px rgba(245,158,11,0.3)' }}>
                    <Sparkles size={18} /> Upgrade ke PRO
                  </motion.button>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {
                    if (activeParty) {
                      setPartyData({ type: activeParty.type || '', name: activeParty.name || '', hostName: activeParty.hostName || '', age: activeParty.age || '', date: activeParty.date || '', time: activeParty.time || '', location: activeParty.location || '', theme: activeParty.theme || '', tier: activeParty.tier || 'basic' })
                      setModalMode('edit'); setStep(1); setIsModalOpen(true);
                    }
                  }} style={{ padding: '12px 16px', borderRadius: 12, border: activeParty.type === 'adult' ? '1px solid rgba(255,255,255,0.2)' : '1px solid #E2E8F0', background: activeParty.type === 'adult' ? 'rgba(255,255,255,0.1)' : 'white', fontWeight: 800, fontSize: 13, cursor: 'pointer', color: activeParty.type === 'adult' ? 'white' : '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, backdropFilter: 'blur(10px)' }}>
                    <Settings size={16} /> Edit
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {
                    setDeletePassword(''); setDeleteError(''); setIsDeleteModalOpen(true);
                  }} style={{ padding: '12px 16px', borderRadius: 12, border: activeParty.type === 'adult' ? '1px solid rgba(239,68,68,0.3)' : '1px solid #FEE2E2', background: activeParty.type === 'adult' ? 'rgba(239,68,68,0.15)' : '#FEF2F2', fontWeight: 800, fontSize: 13, cursor: 'pointer', color: activeParty.type === 'adult' ? '#FCA5A5' : '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, backdropFilter: 'blur(10px)' }}>
                    <Trash2 size={16} /> Hapus
                  </motion.button>
                </div>
                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => {
                  if (typeof navigator !== 'undefined') {
                    navigator.clipboard.writeText(`${window.location.origin}/invite/${activeParty.id}`);
                    window.dispatchEvent(new CustomEvent('showToast', { detail: { message: '📋 Link undangan berhasil disalin! Silakan bagikan ke tamu.' } }));
                  }
                }} style={{ padding: '14px 24px', borderRadius: 16, border: 'none', background: activeParty.type === 'adult' ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : 'linear-gradient(135deg, #FF3366, #FF9933)', color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: activeParty.type === 'adult' ? '0 10px 25px rgba(236,72,153,0.3)' : '0 10px 25px rgba(255,51,102,0.3)' }}>
                  <Share2 size={18} /> Bagikan Undangan
                </motion.button>
              </div>
            </div>
          </div>

          {/* Premium Layout Grid: Left Details & Right Theme Quick Selector & Preview */}
          <div className="mobile-stack" style={{ order: 3, display: 'flex', gap: 24, alignItems: 'stretch' }}>
            
            {/* Left Column: Metadata cards stacked vertically */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1.2 }}>
              {/* Info Planner & Pesta Card */}
              <motion.div whileHover={{ y: -2 }} style={{ background: 'white', padding: 20, borderRadius: 24, border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.03)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, background: '#F59E0B', opacity: 0.05, borderRadius: '50%', filter: 'blur(30px)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, position: 'relative', zIndex: 2 }}>
                  <h3 style={{ fontSize: 12, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Detail Planner</h3>
                  <div style={{ padding: 6, borderRadius: 10, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Settings size={16} color="#D97706" />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: 6 }}>
                    <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Penyelenggara</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{activeParty.hostName || 'Belum diisi'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: 6 }}>
                    <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Merayakan Usia</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{activeParty.age ? `${activeParty.age} Tahun` : '-'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Tema Desain</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', textTransform: 'capitalize' }}>{activeParty.theme || 'Belum dipilih'}</span>
                  </div>
                </div>
              </motion.div>

              {/* Countdown Card */}
              <motion.div whileHover={{ y: -2 }} style={{ background: 'white', padding: 20, borderRadius: 24, border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.03)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: -20, left: -20, width: 150, height: 150, background: activeParty.type === 'adult' ? '#8B5CF6' : '#FF3366', opacity: 0.05, borderRadius: '50%', filter: 'blur(35px)' }} />
                <h3 style={{ fontSize: 12, color: '#64748B', fontWeight: 800, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em', position: 'relative', zIndex: 2 }}>Waktu Tersisa</h3>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', position: 'relative', zIndex: 2 }}>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 900, color: activeParty.type === 'adult' ? '#4F46E5' : '#FF3366', lineHeight: 1 }}>{String(timeLeft.days).padStart(2, '0')}</div><div style={{ fontSize: 9, color: '#94A3B8', fontWeight: 800, marginTop: 2 }}>HARI</div></div>
                  <div style={{ fontSize: 16, color: '#E2E8F0', fontWeight: 900, marginBottom: 8 }}>:</div>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>{String(timeLeft.hours).padStart(2, '0')}</div><div style={{ fontSize: 9, color: '#94A3B8', fontWeight: 800, marginTop: 2 }}>JAM</div></div>
                  <div style={{ fontSize: 16, color: '#E2E8F0', fontWeight: 900, marginBottom: 8 }}>:</div>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>{String(timeLeft.minutes).padStart(2, '0')}</div><div style={{ fontSize: 9, color: '#94A3B8', fontWeight: 800, marginTop: 2 }}>MENIT</div></div>
                  <div style={{ fontSize: 16, color: '#E2E8F0', fontWeight: 900, marginBottom: 8 }}>:</div>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 900, color: '#CBD5E1', lineHeight: 1 }}>{String(timeLeft.seconds).padStart(2, '0')}</div><div style={{ fontSize: 9, color: '#94A3B8', fontWeight: 800, marginTop: 2 }}>DETIK</div></div>
                </div>
              </motion.div>

              {/* Guest Summary Card */}
              <motion.div whileHover={{ y: -2 }} style={{ background: 'white', padding: 20, borderRadius: 24, border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.03)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, left: 50, width: 140, height: 140, background: '#3B82F6', opacity: 0.05, borderRadius: '50%', filter: 'blur(30px)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, position: 'relative', zIndex: 2 }}>
                  <h3 style={{ fontSize: 12, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status Tamu</h3>
                  <div style={{ padding: 6, borderRadius: 10, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => router.push(`/${locale}/dashboard/guests`)}>
                    <Users size={16} color="#2563EB" />
                  </div>
                </div>
                {(() => {
                  const partyGuests = allGuests.filter((g: any) => g.party_id === activeParty.id);
                  const attendingGuests = partyGuests.filter((g: any) => g.status === 'attending');
                  const attendingGuestCount = attendingGuests.length;
                  const attendingPeopleCount = attendingGuests.reduce((sum: number, g: any) => sum + (parseInt(g.num_adults || 0) + parseInt(g.num_children || 0)), 0);
                  const isPro = activeParty.tier === 'pro';
                  const limitText = isPro ? '\u221e' : '10';
                  const percent = isPro ? Math.min(100, (partyGuests.length / 50) * 100) : Math.min(100, (partyGuests.length / 10) * 100);
                  return (
                    <>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, position: 'relative', zIndex: 2 }}>
                        <span style={{ fontSize: 36, fontWeight: 900, color: '#0F172A', lineHeight: 0.9 }}>{attendingGuestCount}</span>
                        <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600, paddingBottom: 2 }}>
                          / {limitText} Tamu Hadir
                        </span>
                      </div>
                      {attendingPeopleCount > 0 && (
                        <div style={{ fontSize: 12, color: '#10B981', fontWeight: 700, marginTop: 4, position: 'relative', zIndex: 2 }}>
                          ≈ {attendingPeopleCount} orang total (termasuk plus-one)
                        </div>
                      )}
                      <div style={{ width: '100%', height: 6, background: '#F1F5F9', borderRadius: 8, marginTop: 10, position: 'relative', zIndex: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #3B82F6, #60A5FA)', borderRadius: 8 }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, position: 'relative', zIndex: 2 }}>
                        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{partyGuests.length} total undangan</span>
                        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{partyGuests.filter((g:any)=>g.status==='pending').length} menunggu</span>
                      </div>
                    </>
                  );
                })()}
              </motion.div>

              {/* Invitation Link Card */}
              <motion.div whileHover={{ y: -2 }} style={{ background: 'white', padding: 20, borderRadius: 24, border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.03)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: -30, right: -30, width: 160, height: 160, background: '#10B981', opacity: 0.04, borderRadius: '50%', filter: 'blur(40px)' }} />
                <h3 style={{ fontSize: 12, color: '#64748B', fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em', position: 'relative', zIndex: 2 }}>Link Undangan</h3>
                <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 12, fontWeight: 500, position: 'relative', zIndex: 2 }}>Salin link di bawah ini untuk mengundang.</p>
                <div style={{ display: 'flex', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '8px 12px', alignItems: 'center', gap: 6, position: 'relative', zIndex: 2 }}>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {`${window.location.origin}/${locale}/invite/${activeParty.customUrl || activeParty.id}`}
                  </div>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => window.open(`/${locale}/invite/${activeParty.customUrl || activeParty.id}`, '_blank')} style={{ background: '#0F172A', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 4px 6px rgba(15,23,42,0.1)', color: 'white', fontSize: 11, fontWeight: 700 }}>
                    <ExternalLink size={12} /> Buka
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {
                    if (typeof navigator !== 'undefined') {
                      navigator.clipboard.writeText(`${window.location.origin}/${locale}/invite/${activeParty.customUrl || activeParty.id}`);
                      window.dispatchEvent(new CustomEvent('showToast', { detail: { message: '📋 Link undangan berhasil disalin ke clipboard!' } }));
                    }
                  }} style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex', boxShadow: '0 4px 6px rgba(0,0,0,0.01)', color: '#0F172A' }}>
                    <Copy size={14} />
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Invitation Preview & Theme Switcher */}
            <motion.div whileHover={{ y: -2 }} style={{ background: 'white', padding: 24, borderRadius: 32, border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', flex: 1.8, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.03)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, background: activeParty.type === 'adult' ? '#F59E0B' : '#3B82F6', opacity: 0.03, borderRadius: '50%', filter: 'blur(50px)' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, position: 'relative', zIndex: 2, flexWrap: 'wrap', gap: 16 }}>
                <h3 style={{ fontSize: 16, color: '#0F172A', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={16} color="#F59E0B" /> Live Preview & Kustomisasi
                </h3>
                <button onClick={() => setPreviewKey(k => k + 1)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '6px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, color: '#475569', cursor: 'pointer' }}>
                  Ulangi
                </button>
              </div>

              <div style={{ background: 'white', borderRadius: 24, padding: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.01)', border: '1px solid #E2E8F0', display: 'flex', gap: 24, alignItems: 'stretch', position: 'relative', zIndex: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* Smartphone Mockup */}
                <div style={{ width: 240, height: 460, background: '#0F172A', borderRadius: 28, padding: 6, boxShadow: '0 15px 30px rgba(0,0,0,0.15)', position: 'relative', flexShrink: 0, border: '2px solid #334155', overflow: 'hidden' }}>
                  {/* Notch */}
                  <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', width: 50, height: 12, background: '#0F172A', borderRadius: 8, zIndex: 10 }} />
                  {/* Screen */}
                  <div style={{ width: '100%', height: '100%', background: 'white', borderRadius: 22, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: 375, height: 800, transform: 'scale(0.61)', transformOrigin: 'top left' }}>
                      <ThemeRenderer key={previewKey} party={activeParty ? { ...activeParty, theme: selectedThemePreview || activeParty.theme } : null} />
                    </div>
                  </div>
                  {/* Home Indicator */}
                  <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', width: 60, height: 3, background: 'rgba(255,255,255,0.4)', borderRadius: 6, zIndex: 10 }} />
                </div>

                {/* Inline Theme switcher gallery with grid and custom height */}
                <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 8, marginTop: 0 }}>Pilih Tema Instan</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8, maxHeight: selectedThemePreview && selectedThemePreview !== activeParty.theme ? 230 : 290, overflowY: 'auto', paddingRight: 4, paddingBottom: 4 }}>
                      {(activeParty.type === 'adult' ? adultThemes : kidsThemes).map(theme => {
                        const isSelected = selectedThemePreview === theme.id;
                        return (
                          <motion.div 
                            whileHover={{ y: -2, scale: 1.02 }}
                            key={theme.id} 
                            onClick={() => setSelectedThemePreview(theme.id)} 
                            style={{ 
                              border: `2px solid ${isSelected ? theme.color : '#E2E8F0'}`, 
                              borderRadius: 12, 
                              cursor: 'pointer', 
                              transition: 'all 0.2s', 
                              position: 'relative',
                              background: '#FFFFFF',
                              height: 80,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 4px 6px 4px',
                              boxShadow: isSelected ? `0 4px 10px ${theme.color}20` : '0 2px 4px rgba(0,0,0,0.02)'
                            }}>
                            {/* Checkmark */}
                            {isSelected && (
                              <div style={{ position: 'absolute', top: 4, right: 4, background: theme.color, color: 'white', borderRadius: '50%', width: 12, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}><Check size={8} strokeWidth={3} /></div>
                            )}
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: theme.gradient || theme.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                              {theme.emoji}
                            </div>
                            <div style={{ width: '100%', fontWeight: 800, fontSize: 9, color: isSelected ? '#FFFFFF' : '#334155', background: isSelected ? theme.color : '#F1F5F9', padding: '3px 4px', borderRadius: 6, textAlign: 'center', textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {theme.label}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {selectedThemePreview && selectedThemePreview !== activeParty.theme && (
                      <motion.button 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => {
                          handleQuickThemeChange(selectedThemePreview);
                          window.dispatchEvent(new CustomEvent('showToast', { detail: { message: '🎨 Tema baru berhasil diterapkan!' } }));
                        }}
                        style={{
                          marginTop: 12,
                          width: '100%',
                          padding: '12px',
                          background: 'linear-gradient(135deg, #10B981, #059669)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 12,
                          fontWeight: 800,
                          fontSize: 13,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                          fontFamily: 'var(--font-jakarta)'
                        }}
                      >
                        <Check size={16} /> Terapkan Tema Baru
                      </motion.button>
                    )}
                  </div>
                  
                  <div style={{ marginTop: 12, padding: 12, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', margin: '0 0 2px 0' }}>Buka Visual Editor</h5>
                      <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>Ubah & edit detail teks.</p>
                    </div>
                    <button onClick={() => router.push(`/${locale}/editor/${activeParty.id}`)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#0F172A', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 100, fontWeight: 800, fontSize: 11, cursor: 'pointer', boxShadow: '0 4px 10px rgba(15, 23, 42, 0.1)', flexShrink: 0 }}>
                      Edit <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Feature-Specific Widgets */}
          <div style={{ order: 2, marginTop: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
               {activeParty.type === 'adult' ? <Wine size={24} color="#8B5CF6"/> : <Baby size={24} color="#FF3366"/>}
               Fitur Eksklusif Mode {activeParty.type === 'adult' ? 'Dewasa' : 'Anak'}
            </h2>
            
            {activeParty.type === 'adult' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {/* ─── KATEGORI 1: MANAJEMEN ACARA ─── */}
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: '#94A3B8', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
                    Manajemen Acara
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                    {/* Budget Tracker */}
                    <motion.div 
                      whileHover={{ y: -4 }} 
                      onClick={() => router.push(`/${locale}/dashboard/budget`)}
                      style={{ background: 'white', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.02)', cursor: 'pointer', position: 'relative' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ padding: 10, borderRadius: 12, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <DollarSign size={20} color="#10B981" />
                          </div>
                          <h3 style={{ fontSize: 16, color: '#0F172A', fontWeight: 800 }}>Budget & Bar Tracker</h3>
                        </div>
                        <div style={{ fontSize: 12, color: '#10B981', fontWeight: 800, background: '#ECFDF5', padding: '4px 10px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 4 }}>
                          Kelola <ArrowRight size={12} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>Terpakai</span>
                        <span style={{ fontSize: 13, color: '#0F172A', fontWeight: 800 }}>
                          Rp {budgetUsed.toLocaleString('id-ID')} / Rp {budgetTotal.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div style={{ width: '100%', height: 8, background: '#F1F5F9', borderRadius: 8, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (budgetUsed / budgetTotal) * 100)}%`, height: '100%', background: '#10B981', borderRadius: 8 }} />
                      </div>
                      <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 12 }}>Termasuk biaya Venue & Kalkulasi Minuman (Bar).</p>
                    </motion.div>

                    {/* Rundown Acara */}
                    <motion.div whileHover={{ y: -4 }} onClick={() => router.push(`/${locale}/dashboard/rundown`)} style={{ background: 'white', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.02)', cursor: 'pointer', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ padding: 10, borderRadius: 12, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Calendar size={20} color="#3B82F6" />
                          </div>
                          <h3 style={{ fontSize: 16, color: '#0F172A', fontWeight: 800 }}>Rundown Acara</h3>
                        </div>
                        <div style={{ fontSize: 12, color: '#3B82F6', fontWeight: 800, background: '#EFF6FF', padding: '4px 10px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 4 }}>
                          Kelola <ArrowRight size={12} />
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>Susun itinerary dan jadwal acara untuk Hari H.</p>
                    </motion.div>

                    {/* Dress Code */}
                    <motion.div whileHover={isEditingDressCode ? undefined : { y: -4 }} style={{ background: 'white', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.02)', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ padding: 10, borderRadius: 12, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Shirt size={20} color="#8B5CF6" />
                          </div>
                          <h3 style={{ fontSize: 16, color: '#0F172A', fontWeight: 800 }}>Dress Code & Style</h3>
                        </div>
                        {!isEditingDressCode && (
                          <button 
                            onClick={() => setIsEditingDressCode(true)}
                            style={{ background: '#F1F5F9', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#8B5CF6' }}
                          >
                            Edit
                          </button>
                        )}
                      </div>

                      {isEditingDressCode ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <input 
                            type="text" 
                            value={dressCodeTitleInput} 
                            onChange={(e) => setDressCodeTitleInput(e.target.value)}
                            placeholder="Judul (Misal: Smart Casual Elegan)"
                            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #E2E8F0', fontSize: 13, fontFamily: 'var(--font-jakarta)', outline: 'none' }}
                          />
                          <textarea 
                            value={dressCodeDescInput} 
                            onChange={(e) => setDressCodeDescInput(e.target.value)}
                            placeholder="Deskripsi dress code pesta..."
                            rows={2}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #E2E8F0', fontSize: 12, fontFamily: 'var(--font-jakarta)', outline: 'none', resize: 'none' }}
                          />
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                            <button 
                              onClick={() => {
                                setIsEditingDressCode(false)
                                if (activeParty) {
                                  setDressCodeTitleInput(activeParty.dressCodeTitle || 'Smart Casual Elegan')
                                  setDressCodeDescInput(activeParty.dressCodeDesc || 'Harap gunakan pakaian dengan nuansa monokrom (Hitam/Putih).')
                                }
                              }}
                              style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                            >
                              Batal
                            </button>
                            <button 
                              onClick={() => {
                                updateActivePartyProperties({ dressCodeTitle: dressCodeTitleInput, dressCodeDesc: dressCodeDescInput })
                                setIsEditingDressCode(false)
                                window.dispatchEvent(new CustomEvent('showToast', { detail: { message: '👔 Dress code berhasil disimpan!' } }))
                              }}
                              style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: '#8B5CF6', color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                            >
                              Simpan
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 16, border: '1px dashed #CBD5E1', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <p style={{ fontSize: 14, color: '#334155', fontWeight: 700, margin: 0 }}>{dressCodeTitleInput}</p>
                          <p style={{ fontSize: 13, color: '#64748B', marginTop: 4, margin: 0 }}>{dressCodeDescInput}</p>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* ─── KATEGORI 2: KONEKSI TAMU ─── */}
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: '#94A3B8', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
                    Koneksi & Ekstra
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                    
                    {/* Ucapan Tamu */}
                    <motion.div whileHover={{ y: -4 }} onClick={() => router.push(`/${locale}/dashboard/wishes`)} style={{ background: 'white', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.02)', cursor: 'pointer', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ padding: 10, borderRadius: 12, background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MessageSquareHeart size={20} color="#F43F5E" />
                          </div>
                          <h3 style={{ fontSize: 16, color: '#0F172A', fontWeight: 800 }}>Ucapan Tamu</h3>
                        </div>
                        <div style={{ fontSize: 12, color: '#F43F5E', fontWeight: 800, background: '#FFF1F2', padding: '4px 10px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 4 }}>
                          Lihat <ArrowRight size={12} />
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>Baca doa dan ucapan dari tamu yang telah RSVP.</p>
                    </motion.div>

                    {/* WhatsApp RSVP Card for Adult */}
                    <motion.div whileHover={isEditingHostPhone ? undefined : { y: -4 }} style={{ background: 'white', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.02)', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ padding: 10, borderRadius: 12, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Share2 size={20} color="#22C55E" />
                          </div>
                          <h3 style={{ fontSize: 16, color: '#0F172A', fontWeight: 800 }}>Integrasi WhatsApp</h3>
                        </div>
                      </div>
                      {isEditingHostPhone ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <input 
                            value={hostPhoneInput} 
                            onChange={(e) => setHostPhoneInput(e.target.value)}
                            placeholder="Masukkan No. WA Host..."
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 13, outline: 'none' }}
                          />
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => {
                                setHostPhoneInput(activeParty.hostPhone || '')
                                setIsEditingHostPhone(false)
                              }}
                              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#64748B' }}
                            >
                              Batal
                            </button>
                            <button 
                              onClick={() => {
                                updateActivePartyProperties({ hostPhone: hostPhoneInput.trim() })
                                setIsEditingHostPhone(false)
                                window.dispatchEvent(new CustomEvent('showToast', { detail: { message: '✅ Nomor WhatsApp Host berhasil diperbarui!' } }))
                              }}
                              style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: '#22C55E', color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                            >
                              Simpan
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                          <div>
                            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 12, margin: 0 }}>
                              Dapatkan konfirmasi RSVP tamu langsung ke WhatsApp Anda.
                            </p>
                            {activeParty.hostPhone ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                                <span style={{ fontSize: 13, color: '#22C55E', fontWeight: 800 }}>
                                  📞 Terhubung: {activeParty.hostPhone}
                                </span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                                <span style={{ fontSize: 13, color: '#EF4444', fontWeight: 600 }}>
                                  ⚠️ Belum Terhubung
                                </span>
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={() => setIsEditingHostPhone(true)} 
                            style={{ padding: '10px', borderRadius: 12, border: 'none', background: '#22C55E', fontWeight: 700, fontSize: 13, cursor: 'pointer', color: 'white', width: '100%' }}
                          >
                            {activeParty.hostPhone ? 'Edit Nomor WA' : 'Hubungkan WhatsApp'}
                          </button>
                        </div>
                      )}
                    </motion.div>

                    {/* Social Media Kit */}
                    <motion.div whileHover={{ y: -4 }} style={{ background: 'white', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.02)', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ padding: 10, borderRadius: 12, background: '#FCE7F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Camera size={20} color="#DB2777" />
                          </div>
                          <h3 style={{ fontSize: 16, color: '#0F172A', fontWeight: 800 }}>Social Media Kit</h3>
                        </div>
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5, margin: '0 0 16px 0', fontWeight: 500 }}>
                          Unduh pratinjau desain tema Anda dalam format vertikal (9:16) untuk Instagram Story atau WhatsApp Status.
                        </p>
                          <button 
                            onClick={async () => {
                              const exportEl = document.getElementById('social-media-export-container');
                              if (exportEl) {
                                try {
                                  const canvas = await html2canvas(exportEl, {
                                    scale: 3,
                                    useCORS: true,
                                    backgroundColor: null,
                                    logging: false
                                  });
                                  const url = canvas.toDataURL('image/png');
                                  const link = document.createElement('a');
                                  link.download = `Tema-${activeParty.name.replace(/\s+/g, '-')}-Glyka.png`;
                                  link.href = url;
                                  link.click();
                                  window.dispatchEvent(new CustomEvent('showToast', { detail: { message: '✅ Desain Tema berhasil diunduh!' } }));
                                } catch (err) {
                                  console.error('Error generating canvas:', err);
                                  alert('Gagal membuat gambar. Pastikan semua asset sudah termuat.');
                                }
                              }
                            }}
                            style={{ padding: '12px', borderRadius: 12, border: '1.5px solid #E2E8F0', background: 'transparent', color: '#0F172A', fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#DB2777'
                              e.currentTarget.style.color = '#DB2777'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#E2E8F0'
                              e.currentTarget.style.color = '#0F172A'
                            }}
                          >
                            Unduh Desain Tema
                          </button>
                        </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            ) : (
              (() => {
                const partyGuests = allGuests.filter((g: any) => g.party_id === activePartyId);
                const attendingGuests = partyGuests.filter((g: any) => g.status === 'attending');

                // Allergy warning system
                const allergyGuests = attendingGuests.filter((g: any) => g.dietary_restrictions && g.dietary_restrictions.trim().length > 0);
                const uniqueAllergies = Array.from(new Set(allergyGuests.map((g: any) => g.dietary_restrictions.trim()))).join(', ');

                // Drop-off calculations
                const totalWithDropOffResponse = attendingGuests.filter((g: any) => g.will_drop_off !== null && g.will_drop_off !== undefined);
                const dropOffGuestsCount = totalWithDropOffResponse.filter((g: any) => g.will_drop_off === true).length;
                const accompaniedGuestsCount = totalWithDropOffResponse.filter((g: any) => g.will_drop_off === false).length;
                
                const dropOffPercentage = totalWithDropOffResponse.length > 0 ? Math.round((dropOffGuestsCount / totalWithDropOffResponse.length) * 100) : 0;
                const accompaniedPercentage = totalWithDropOffResponse.length > 0 ? 100 - dropOffPercentage : 0;

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {/* ─── KATEGORI 1: MANAJEMEN ACARA ─── */}
                    <div>
                      <h3 style={{ fontSize: 13, fontWeight: 800, color: '#94A3B8', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
                        Manajemen Acara
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                        {/* Alergi */}
                        <motion.div whileHover={{ y: -4 }} style={{ background: 'white', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ padding: 10, borderRadius: 12, background: allergyGuests.length > 0 ? '#FEF2F2' : '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <AlertTriangle size={20} color={allergyGuests.length > 0 ? '#EF4444' : '#22C55E'} />
                              </div>
                              <h3 style={{ fontSize: 16, color: '#0F172A', fontWeight: 800 }}>Sistem Peringatan Alergi</h3>
                            </div>
                          </div>
                          {allergyGuests.length > 0 ? (
                            <div style={{ background: '#FEF2F2', padding: 16, borderRadius: 16, border: '1px dashed #FCA5A5' }}>
                              <p style={{ fontSize: 14, color: '#B91C1C', fontWeight: 800, margin: 0 }}>⚠️ {allergyGuests.length} Tamu Punya Alergi!</p>
                              <p style={{ fontSize: 13, color: '#EF4444', marginTop: 4, margin: 0 }}>Perhatikan: {uniqueAllergies}. Harap siapkan menu khusus.</p>
                            </div>
                          ) : (
                            <div style={{ background: '#F0FDF4', padding: 16, borderRadius: 16, border: '1px dashed #86EFAC' }}>
                              <p style={{ fontSize: 14, color: '#166534', fontWeight: 800, margin: 0 }}>✅ Semua Aman!</p>
                              <p style={{ fontSize: 13, color: '#22C55E', marginTop: 4, margin: 0 }}>Tidak ada tamu yang melaporkan alergi makanan saat ini.</p>
                            </div>
                          )}
                        </motion.div>

                        {/* Rundown Acara */}
                        <motion.div whileHover={{ y: -4 }} onClick={() => router.push(`/${locale}/dashboard/rundown`)} style={{ background: 'white', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.02)', cursor: 'pointer', position: 'relative' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ padding: 10, borderRadius: 12, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Calendar size={20} color="#3B82F6" />
                              </div>
                              <h3 style={{ fontSize: 16, color: '#0F172A', fontWeight: 800 }}>Rundown Acara</h3>
                            </div>
                            <div style={{ fontSize: 12, color: '#3B82F6', fontWeight: 800, background: '#EFF6FF', padding: '4px 10px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 4 }}>
                              Kelola <ArrowRight size={12} />
                            </div>
                          </div>
                          <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>Susun itinerary dan jadwal acara untuk Hari H.</p>
                        </motion.div>
                      </div>
                    </div>

                    {/* ─── KATEGORI 2: KONEKSI TAMU ─── */}
                    <div>
                      <h3 style={{ fontSize: 13, fontWeight: 800, color: '#94A3B8', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
                        Koneksi & Ekstra
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                        {/* Ucapan Tamu */}
                        <motion.div whileHover={{ y: -4 }} onClick={() => router.push(`/${locale}/dashboard/wishes`)} style={{ background: 'white', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.02)', cursor: 'pointer', position: 'relative' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ padding: 10, borderRadius: 12, background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MessageSquareHeart size={20} color="#F43F5E" />
                              </div>
                              <h3 style={{ fontSize: 16, color: '#0F172A', fontWeight: 800 }}>Ucapan Tamu</h3>
                            </div>
                            <div style={{ fontSize: 12, color: '#F43F5E', fontWeight: 800, background: '#FFF1F2', padding: '4px 10px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 4 }}>
                              Lihat <ArrowRight size={12} />
                            </div>
                          </div>
                          <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>Baca doa dan ucapan dari tamu yang telah RSVP.</p>
                        </motion.div>

                        {/* Drop-off */}
                        <motion.div whileHover={{ y: -4 }} style={{ background: 'white', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ padding: 10, borderRadius: 12, background: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Car size={20} color="#4F46E5" />
                              </div>
                              <h3 style={{ fontSize: 16, color: '#0F172A', fontWeight: 800 }}>Konfirmasi Drop-off</h3>
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>Menitipkan Anak (Drop-off)</span>
                            <span style={{ fontSize: 13, color: '#0F172A', fontWeight: 800 }}>
                              {totalWithDropOffResponse.length > 0 ? `${dropOffPercentage}%` : '0%'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>Orang Tua Menemani</span>
                            <span style={{ fontSize: 13, color: '#0F172A', fontWeight: 800 }}>
                              {totalWithDropOffResponse.length > 0 ? `${accompaniedPercentage}%` : '0%'}
                            </span>
                          </div>
                          {totalWithDropOffResponse.length === 0 && (
                            <p style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic', margin: '8px 0 0', textAlign: 'center' }}>Belum ada konfirmasi drop-off dari tamu.</p>
                          )}
                        </motion.div>

                        {/* Gift List */}
                        <motion.div whileHover={{ y: -4 }} style={{ background: 'white', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ padding: 10, borderRadius: 12, background: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Gift size={20} color="#EA580C" />
                              </div>
                              <h3 style={{ fontSize: 16, color: '#0F172A', fontWeight: 800 }}>Daftar Hadiah Mainan</h3>
                            </div>
                          </div>
                          {isEditingWishlist ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              <input 
                                value={wishlistInput} 
                                onChange={(e) => setWishlistInput(e.target.value)}
                                placeholder="Masukkan link Tokopedia / Shopee / Wishlist..."
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 13, outline: 'none' }}
                              />
                              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                <button 
                                  onClick={() => {
                                    setWishlistInput(activeParty.toyWishlistLink || '')
                                    setIsEditingWishlist(false)
                                  }}
                                  style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#64748B' }}
                                >
                                  Batal
                                </button>
                                <button 
                                  onClick={() => {
                                    updateActivePartyProperties({ toyWishlistLink: wishlistInput.trim() })
                                    setIsEditingWishlist(false)
                                    window.dispatchEvent(new CustomEvent('showToast', { detail: { message: '🎁 Wishlist mainan berhasil diperbarui!' } }))
                                  }}
                                  style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: '#F97316', color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                >
                                  Simpan
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                              <div>
                                <p style={{ fontSize: 13, color: '#64748B', marginBottom: 12, margin: 0 }}>
                                  Hindari kado ganda dengan fitur integrasi wishlist toko mainan favorit.
                                </p>
                                {activeParty.toyWishlistLink && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                                    <ExternalLink size={14} color="#F97316" />
                                    <a href={activeParty.toyWishlistLink.startsWith('http') ? activeParty.toyWishlistLink : `https://${activeParty.toyWishlistLink}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#F97316', fontWeight: 600, textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                                      Buka Link Wishlist
                                    </a>
                                  </div>
                                )}
                              </div>
                              <button 
                                onClick={() => setIsEditingWishlist(true)} 
                                style={{ padding: '10px', borderRadius: 12, border: 'none', background: '#F97316', fontWeight: 700, fontSize: 13, cursor: 'pointer', color: 'white', width: '100%' }}
                              >
                                {activeParty.toyWishlistLink ? 'Edit Link Wishlist' : 'Hubungkan ke Wishlist'}
                              </button>
                            </div>
                          )}
                        </motion.div>

                        {/* WhatsApp RSVP Card for Kids */}
                        <motion.div whileHover={isEditingHostPhone ? undefined : { y: -4 }} style={{ background: 'white', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.02)', position: 'relative' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ padding: 10, borderRadius: 12, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Share2 size={20} color="#22C55E" />
                              </div>
                              <h3 style={{ fontSize: 16, color: '#0F172A', fontWeight: 800 }}>Integrasi WhatsApp RSVP</h3>
                            </div>
                          </div>
                          {isEditingHostPhone ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              <input 
                                value={hostPhoneInput} 
                                onChange={(e) => setHostPhoneInput(e.target.value)}
                                placeholder="Masukkan No. WA Host (cth: 08123456789)..."
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 13, outline: 'none' }}
                              />
                              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                <button 
                                  onClick={() => {
                                    setHostPhoneInput(activeParty.hostPhone || '')
                                    setIsEditingHostPhone(false)
                                  }}
                                  style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#64748B' }}
                                >
                                  Batal
                                </button>
                                <button 
                                  onClick={() => {
                                    updateActivePartyProperties({ hostPhone: hostPhoneInput.trim() })
                                    setIsEditingHostPhone(false)
                                    window.dispatchEvent(new CustomEvent('showToast', { detail: { message: '✅ Nomor WhatsApp Host berhasil diperbarui!' } }))
                                  }}
                                  style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: '#22C55E', color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                >
                                  Simpan
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                              <div>
                                <p style={{ fontSize: 13, color: '#64748B', marginBottom: 12, margin: 0 }}>
                                  Dapatkan konfirmasi RSVP tamu langsung ke WhatsApp Anda.
                                </p>
                                {activeParty.hostPhone ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                                    <span style={{ fontSize: 13, color: '#22C55E', fontWeight: 800 }}>
                                      📞 Terhubung: {activeParty.hostPhone}
                                    </span>
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                                    <span style={{ fontSize: 13, color: '#EF4444', fontWeight: 600 }}>
                                      ⚠️ Belum Terhubung
                                    </span>
                                  </div>
                                )}
                              </div>
                              <button 
                                onClick={() => setIsEditingHostPhone(true)} 
                                style={{ padding: '10px', borderRadius: 12, border: 'none', background: '#22C55E', fontWeight: 700, fontSize: 13, cursor: 'pointer', color: 'white', width: '100%' }}
                              >
                                {activeParty.hostPhone ? 'Edit Nomor WA' : 'Hubungkan WhatsApp'}
                              </button>
                            </div>
                          )}
                        </motion.div>

                      </div>
                    </div>
                  </div>
                );
              })()
            )}
            {/* Hidden Export Container */}
            <div style={{ position: 'absolute', top: -9999, left: -9999, zIndex: -100 }}>
              <div id="social-media-export-container" style={{ width: 400, height: 711, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: activeParty.type === 'adult' ? '#0F172A' : '#FFF1F2' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                  <ThemeRenderer party={activeParty ? { ...activeParty, theme: selectedThemePreview || activeParty.theme } : null} forceOpen={true} />
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* Create Party Modal Wizard */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }} 
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              style={{
                background: 'white', width: '100%', maxWidth: 720, borderRadius: 32,
                position: 'relative', zIndex: 110, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                display: 'flex', flexDirection: 'column', maxHeight: '90vh'
              }}
            >
              {/* Header */}
              <div style={{ padding: '24px 32px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                    {modalMode === 'edit' ? 'Edit Detail Pesta' : 'Setup Pesta Baru'}
                  </h2>
                  <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 600 }}>Langkah {modalMode === 'edit' && step === 4 ? 3 : step} dari {modalMode === 'edit' ? 3 : 4}</p>
                </div>
                <button onClick={() => {
                  setIsModalOpen(false)
                  if (modalMode === 'create') {
                    setPartyData({ type: '', name: '', hostName: '', age: '', date: '', time: '', location: '', theme: '', tier: 'basic' })
                    setStep(1)
                  }
                }} style={{ background: '#F1F5F9', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Progress Steps */}
              <div style={{ display: 'flex', gap: 8, padding: '16px 32px' }}>
                {(modalMode === 'edit' ? [1, 2, 4] : [1, 2, 3, 4]).map((s) => (
                  <div key={s} style={{ height: 6, flex: 1, background: s <= step ? '#FF3366' : '#E2E8F0', borderRadius: 10, transition: 'all 0.3s' }} />
                ))}
              </div>

              {/* Body */}
              <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: WHO */}
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h3 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>Siapa yang Ulang Tahun?</h3>
                      <p style={{ color: '#64748B', marginBottom: 32, fontWeight: 500 }}>Pilih mode pesta agar kami bisa menyesuaikan fiturnya.</p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                        <div onClick={() => setPartyData({...partyData, type: 'kids'})} style={{ border: `2px solid ${partyData.type === 'kids' ? '#FF3366' : '#E2E8F0'}`, background: partyData.type === 'kids' ? '#FFF1F2' : 'white', borderRadius: 20, padding: 24, cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
                          {partyData.type === 'kids' && <div style={{ position: 'absolute', top: 12, right: 12, background: '#FF3366', color: 'white', borderRadius: '50%', padding: 4 }}><Check size={14} /></div>}
                          <Baby size={32} color={partyData.type === 'kids' ? '#FF3366' : '#94A3B8'} style={{ marginBottom: 16 }} />
                          <div style={{ fontWeight: 800, fontSize: 18, color: partyData.type === 'kids' ? '#E11D48' : '#0F172A' }}>Mode Anak</div>
                          <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Pelacakan alergi, daftar kado.</div>
                        </div>
                        <div onClick={() => setPartyData({...partyData, type: 'adult'})} style={{ border: `2px solid ${partyData.type === 'adult' ? '#4338CA' : '#E2E8F0'}`, background: partyData.type === 'adult' ? '#EEF2FF' : 'white', borderRadius: 20, padding: 24, cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
                          {partyData.type === 'adult' && <div style={{ position: 'absolute', top: 12, right: 12, background: '#4338CA', color: 'white', borderRadius: '50%', padding: 4 }}><Check size={14} /></div>}
                          <Wine size={32} color={partyData.type === 'adult' ? '#4338CA' : '#94A3B8'} style={{ marginBottom: 16 }} />
                          <div style={{ fontWeight: 800, fontSize: 18, color: partyData.type === 'adult' ? '#4338CA' : '#0F172A' }}>Mode Dewasa</div>
                          <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Budgeting, dress code.</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6, color: '#334155' }}>Nama Lengkap/Panggilan</label>
                          <input value={partyData.name} onChange={e => setPartyData({...partyData, name: e.target.value})} type="text" placeholder="Misal: Alisha" style={{ width: '100%', padding: '14px 16px', border: `1.5px solid ${isNameDuplicate ? '#EF4444' : '#E2E8F0'}`, borderRadius: 12, fontSize: 15, fontFamily: 'var(--font-jakarta)', outline: 'none', transition: 'border 0.2s' }} />
                          {isNameDuplicate && (
                            <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 600, marginTop: 4, display: 'block' }}>
                              ⚠️ Nama pesta ini sudah digunakan. Harap gunakan nama lain.
                            </span>
                          )}
                        </div>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6, color: '#334155' }}>Nama Penyelenggara / Host</label>
                          <input value={partyData.hostName} onChange={e => setPartyData({...partyData, hostName: e.target.value})} type="text" placeholder="Misal: Budi & Sari (Orang tua Alisha)" style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #E2E8F0', borderRadius: 12, fontSize: 15, fontFamily: 'var(--font-jakarta)', outline: 'none', transition: 'border 0.2s' }} />
                          <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 6 }}>Akan tampil di undangan dan pesan WhatsApp kepada tamu.</p>
                        </div>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6, color: '#334155' }}>Ulang Tahun ke-Berapa?</label>
                          <input value={partyData.age} onChange={e => setPartyData({...partyData, age: e.target.value})} type="number" placeholder="Misal: 5" style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #E2E8F0', borderRadius: 12, fontSize: 15, fontFamily: 'var(--font-jakarta)', outline: 'none', transition: 'border 0.2s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: WHEN & WHERE */}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h3 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>Kapan & Dimana?</h3>
                      <p style={{ color: '#64748B', marginBottom: 24, fontWeight: 500 }}>Desain kalender dan jam yang jauh lebih mudah digunakan.</p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32 }}>
                        
                        {/* Custom FULL Calendar */}
                        <div>
                          <label style={{ fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#334155' }}>
                            <Calendar size={18} color="#FF3366" /> Pilih Tanggal
                          </label>
                          
                          <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 16, border: '1px solid #E2E8F0' }}>
                            {/* Calendar Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                              <button onClick={handlePrevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><ChevronLeft size={18} color="#64748B" /></button>
                              
                              <div style={{ display: 'flex', gap: 8 }}>
                                <select value={currentMonth} onChange={handleMonthChange} style={{ border: 'none', background: 'transparent', fontWeight: 800, fontSize: 14, color: '#0F172A', outline: 'none', cursor: 'pointer' }}>
                                  {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
                                </select>
                                <select value={currentYear} onChange={handleYearChange} style={{ border: 'none', background: 'transparent', fontWeight: 800, fontSize: 14, color: '#0F172A', outline: 'none', cursor: 'pointer' }}>
                                  {[currentYear, currentYear+1, currentYear+2].map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                              </div>

                              <button onClick={handleNextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><ChevronRight size={18} color="#64748B" /></button>
                            </div>

                            {/* Calendar Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
                              {['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map((d,i) => <div key={i} style={{textAlign:'center', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8}}>{d}</div>)}
                              
                              {/* Empty Cells */}
                              {emptyCells.map((_, i) => <div key={`empty-${i}`} />)}
                              
                              {/* Day Cells */}
                              {daysInMonthArray.map(day => {
                                const dateString = `${currentYear}-${(currentMonth+1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
                                const isSelected = partyData.date === dateString
                                
                                // Calculate today's date boundary at midnight (local time)
                                const cellDate = new Date(currentYear, currentMonth, day)
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                const isPastOrToday = cellDate.getTime() <= today.getTime()

                                return (
                                  <button key={day} 
                                    disabled={isPastOrToday}
                                    onClick={() => setPartyData({...partyData, date: dateString})} 
                                    style={{ 
                                      aspectRatio: '1', borderRadius: 8, border: 'none', 
                                      cursor: isPastOrToday ? 'not-allowed' : 'pointer', 
                                      fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-jakarta)',
                                      background: isSelected ? '#FF3366' : 'transparent',
                                      color: isSelected ? 'white' : (isPastOrToday ? '#CBD5E1' : '#334155'),
                                      opacity: isPastOrToday ? 0.5 : 1,
                                      transition: 'all 0.2s'
                                    }}>
                                    {day}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Custom Time & Location */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                          <div>
                            <label style={{ fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#334155' }}>
                              <Clock size={18} color="#FF9933" /> Atur Jam
                            </label>
                            
                            {/* Native Input Time for ultimate freedom */}
                            <input 
                              type="time" 
                              value={partyData.time} 
                              onChange={(e) => setPartyData({...partyData, time: e.target.value})}
                              style={{ 
                                padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E2E8F0', 
                                fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-jakarta)', outline: 'none', 
                                width: '100%', cursor: 'text', marginBottom: 12, background: 'white'
                              }} 
                            />
                            
                            {/* Quick Pills */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                              {timeSlots.map(time => (
                                <button key={time} onClick={() => setPartyData({...partyData, time})}
                                  style={{
                                    padding: '8px 14px', borderRadius: 100, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jakarta)', transition: 'all 0.2s',
                                    background: partyData.time === time ? '#0F172A' : '#F8FAFC',
                                    color: partyData.time === time ? 'white' : '#64748B',
                                    border: `1.5px solid ${partyData.time === time ? '#0F172A' : '#E2E8F0'}`
                                  }}>
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label style={{ fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#334155' }}>
                              <MapPin size={18} color="#3B82F6" /> Lokasi Pesta
                            </label>
                            <input value={partyData.location} onChange={e => setPartyData({...partyData, location: e.target.value})} type="text" placeholder="Detail Alamat atau Nama Gedung" style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #E2E8F0', borderRadius: 12, fontSize: 14, fontFamily: 'var(--font-jakarta)', outline: 'none' }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: PAKET PESTA */}
                  {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      <div>
                        <h3 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>Pilih Paket Pesta</h3>
                        <p style={{ color: '#64748B', lineHeight: 1.6 }}>Pilih paket yang sesuai dengan skala acara Anda. Anda bisa mengelola undangan dengan lebih optimal.</p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        {/* BASIC CARD */}
                        <div onClick={() => setPartyData({...partyData, tier: 'basic'})}
                          style={{ 
                            padding: 24, borderRadius: 24, cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
                            border: `2.5px solid ${partyData.tier === 'basic' ? '#0F172A' : '#E2E8F0'}`,
                            background: partyData.tier === 'basic' ? '#F8FAFC' : 'white',
                          }}>
                          {partyData.tier === 'basic' && <div style={{ position: 'absolute', top: 16, right: 16, background: '#0F172A', color: 'white', borderRadius: '50%', padding: 4 }}><Check size={16} /></div>}
                          <div style={{ fontWeight: 800, color: '#64748B', fontSize: 14, marginBottom: 8, letterSpacing: '0.05em' }}>PAKET GRATIS</div>
                          <div style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', marginBottom: 16 }}>Basic</div>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: '#475569' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={16} color="#10B981" /> Maks. 10 Tamu</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={16} color="#10B981" /> Fitur RSVP Standar</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={16} color="#10B981" /> Tema Terbatas</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={16} color="#10B981" /> Watermark PartyBox</li>
                          </ul>
                        </div>

                        {/* PRO CARD */}
                        <div onClick={() => {
                          setPartyData({...partyData, tier: 'pro'})
                          // Simulated Payment Alert
                          alert("--- SIMULASI PEMBAYARAN ---\n\nAnda memilih Paket PRO (Rp 99.000).\n(Bayangkan di sini muncul pop-up QRIS atau Transfer Bank).\n\nPembayaran Berhasil! Paket PRO aktif untuk pesta ini. 🎉")
                        }}
                          style={{ 
                            padding: 24, borderRadius: 24, cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
                            border: `2.5px solid ${partyData.tier === 'pro' ? '#FF3366' : '#E2E8F0'}`,
                            background: partyData.tier === 'pro' ? '#FFF1F2' : 'white',
                            boxShadow: partyData.tier === 'pro' ? '0 10px 20px rgba(255,51,102,0.1)' : 'none'
                          }}>
                          {partyData.tier === 'pro' && <div style={{ position: 'absolute', top: 16, right: 16, background: '#FF3366', color: 'white', borderRadius: '50%', padding: 4 }}><Check size={16} /></div>}
                          <div style={{ position: 'absolute', top: -12, left: 24, background: 'linear-gradient(135deg, #FF3366, #FF9933)', color: 'white', fontSize: 10, fontWeight: 900, padding: '4px 12px', borderRadius: 100 }}>PALING POPULER</div>
                          <div style={{ fontWeight: 800, color: '#FF3366', fontSize: 14, marginBottom: 8, marginTop: 8, letterSpacing: '0.05em' }}>SEKALI BAYAR</div>
                          <div style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', marginBottom: 16 }}>VIP <span style={{ fontSize: 16, color: '#64748B' }}>/ Rp 99rb</span></div>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: '#475569' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={16} color="#FF3366" /> <strong>Tamu Unlimited</strong></li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={16} color="#FF3366" /> Notifikasi WhatsApp</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={16} color="#FF3366" /> Buka Semua 50+ Tema VIP</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={16} color="#FF3366" /> Bebas Watermark</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: TEMA DESAIN */}
                  {step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h3 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>Galeri Tema</h3>
                      <p style={{ color: '#64748B', marginBottom: 24, fontWeight: 500 }}>
                        Eksplorasi tema cantik untuk <span style={{ color: '#FF3366', fontWeight: 700 }}>Mode {partyData.type === 'adult' ? 'Dewasa' : 'Anak'}</span>.
                      </p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxHeight: 300, overflowY: 'auto', paddingRight: 8, paddingTop: 4, paddingBottom: 12 }}>
                        {currentThemesList.map(theme => {
                          const isSelected = partyData.theme === theme.id;
                          return (
                            <motion.div 
                              whileHover={{ y: -4, scale: 1.02 }}
                              key={theme.id} 
                              onClick={() => handleThemeSelect(theme)} 
                              style={{ 
                                border: `2.5px solid ${isSelected ? theme.color : '#E2E8F0'}`, 
                                borderRadius: 20, 
                                overflow: 'hidden', 
                                cursor: 'pointer', 
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', 
                                position: 'relative',
                                background: '#FFFFFF',
                                height: 140,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '16px 12px 12px 12px',
                                boxShadow: isSelected ? `0 8px 16px ${theme.color}25` : '0 2px 8px rgba(0,0,0,0.03)'
                              }}>
                              {/* VIP Badge */}
                              {theme.isVip && (
                                <div style={{ position: 'absolute', top: 8, left: 8, background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 100, zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  👑 VIP
                                </div>
                              )}

                              {/* Checkmark */}
                              {isSelected && (
                                <div style={{ 
                                  position: 'absolute', 
                                  top: 8, 
                                  right: 8, 
                                  background: theme.color, 
                                  color: 'white', 
                                  borderRadius: '50%', 
                                  width: 20,
                                  height: 20,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  zIndex: 10, 
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)' 
                                }}>
                                  <Check size={12} strokeWidth={3} />
                                </div>
                              )}
                              
                              {/* Floating badge for emoji/gradient */}
                              <div style={{ 
                                width: 54, 
                                height: 54, 
                                borderRadius: '50%', 
                                background: theme.gradient || theme.color, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
                                fontSize: 26,
                                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                transition: 'transform 0.25s ease',
                                marginTop: theme.isVip ? 12 : 0
                              }}>
                                {theme.emoji}
                              </div>
                              
                              {/* Label tag at the bottom */}
                              <div style={{ 
                                width: '100%',
                                fontWeight: 800, 
                                fontSize: 11, 
                                color: isSelected ? '#FFFFFF' : '#334155', 
                                background: isSelected ? theme.color : '#F1F5F9', 
                                padding: '6px 8px', 
                                borderRadius: 10, 
                                textAlign: 'center', 
                                boxShadow: isSelected ? `0 4px 10px ${theme.color}30` : 'none',
                                textTransform: 'capitalize',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                transition: 'all 0.2s ease'
                              }}>
                                {theme.label}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div style={{ padding: '24px 32px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', background: '#F8FAFC', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
                {step > 1 ? (
                  <button onClick={prevStep} style={{ padding: '12px 24px', borderRadius: 100, border: '1.5px solid #CBD5E1', background: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer', color: '#475569' }}>
                    Kembali
                  </button>
                ) : <div />}
                
                {step < 4 ? (
                  <button onClick={nextStep} disabled={!partyData.type || (step === 1 && (!partyData.name || isNameDuplicate)) || (step === 2 && (!partyData.date || !partyData.time || !partyData.location)) || (step === 3 && !partyData.tier)} 
                    style={{ 
                      padding: '12px 32px', borderRadius: 100, border: 'none', background: '#0F172A', color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer', 
                      display: 'flex', alignItems: 'center', gap: 8, opacity: (!partyData.type || (step===1 && (!partyData.name || isNameDuplicate)) || (step === 2 && (!partyData.date || !partyData.time || !partyData.location)) || (step === 3 && !partyData.tier)) ? 0.5 : 1 
                    }}>
                    Lanjut <ArrowRight size={16} />
                  </button>
                ) : (
                  <button onClick={handleFinish} disabled={!partyData.theme}
                    style={{ 
                      padding: '12px 32px', borderRadius: 100, border: 'none', background: 'linear-gradient(135deg, #FF3366, #FF9933)', color: 'white', fontWeight: 900, fontSize: 14, cursor: 'pointer', 
                      display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 20px rgba(255,51,102,0.3)', opacity: !partyData.theme ? 0.5 : 1
                    }}>
                    {modalMode === 'edit' ? 'Update Pesta Sekarang' : 'Buat Pesta Sekarang'} <PartyPopper size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }} 
              onClick={() => setIsDeleteModalOpen(false)}
            />
            
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              style={{
                background: 'white', width: '100%', maxWidth: 480, borderRadius: 28,
                position: 'relative', zIndex: 130, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                display: 'flex', flexDirection: 'column', padding: 32
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, background: '#FEF2F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Trash2 size={32} color="#EF4444" />
                </div>
                
                <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', marginBottom: 12 }}>Hapus Pesta?</h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 24, fontWeight: 500 }}>
                  Tindakan ini <strong>tidak dapat dibatalkan</strong>. Semua data tamu, checklist, anggaran, dan undangan publik untuk pesta <strong>{(deletingParty || activeParty)?.name}</strong> akan dihapus secara permanen.
                </p>

                <div style={{ width: '100%', textAlign: 'left', marginBottom: 24 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 8 }}>
                    MASUKKAN PASSWORD KONFIRMASI (Ketik: <span style={{ color: '#EF4444', fontFamily: 'monospace', fontWeight: 900 }}>glyka123</span>)
                  </label>
                  <input 
                    type="password" 
                    value={deletePassword} 
                    onChange={(e) => {
                      setDeletePassword(e.target.value)
                      setDeleteError('')
                    }} 
                    placeholder="Masukkan password" 
                    style={{ 
                      width: '100%', padding: '14px 16px', border: `1.5px solid ${deleteError ? '#EF4444' : '#E2E8F0'}`, 
                      borderRadius: 12, fontSize: 15, fontFamily: 'var(--font-jakarta)', outline: 'none'
                    }} 
                  />
                  {deleteError && (
                    <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 600, marginTop: 6, display: 'block' }}>
                      {deleteError}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                  <button 
                    onClick={() => {
                      setIsDeleteModalOpen(false)
                      setDeletingParty(null)
                    }} 
                    style={{ 
                      flex: 1, padding: '14px 20px', borderRadius: 100, border: '1.5px solid #E2E8F0', 
                      background: 'white', color: '#64748B', fontWeight: 800, fontSize: 14, cursor: 'pointer' 
                    }}
                  >
                    Batal
                  </button>
                  <button 
                    onClick={() => {
                      if (deletePassword !== 'glyka123' && deletePassword !== 'vlass123') {
                        setDeleteError('⚠️ Password salah. Silakan masukkan password konfirmasi yang benar.')
                        return
                      }
                      
                      const targetParty = deletingParty || activeParty
                      if (targetParty) {
                        const newParties = parties.filter(p => p.id !== targetParty.id);
                        setParties(newParties);
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('glyka_parties', JSON.stringify(newParties));
                          if (newParties.length > 0) {
                            if (activePartyId === targetParty.id) {
                              localStorage.setItem('glyka_active_party_id', newParties[0].id);
                              setActivePartyId(newParties[0].id);
                            }
                          } else {
                            localStorage.removeItem('glyka_active_party_id');
                            localStorage.removeItem('vlass_active_party_id');
                            setActivePartyId(null);
                          }
                          window.dispatchEvent(new Event('partyUpdated'));
                        }
                      }
                      setIsDeleteModalOpen(false)
                      setDeletingParty(null)
                    }} 
                    style={{ 
                      flex: 1, padding: '14px 20px', borderRadius: 100, border: 'none', 
                      background: '#EF4444', color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                      boxShadow: '0 8px 16px rgba(239,68,68,0.2)'
                    }}
                  >
                    Hapus Permanen
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Upgrade PRO Modal ── */}
      <AnimatePresence>
        {isUpgradeModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(10px)' }}
              onClick={() => setIsUpgradeModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              style={{
                background: 'white', borderRadius: 32, width: '100%', maxWidth: 480,
                position: 'relative', zIndex: 210, boxShadow: '0 30px 80px -10px rgba(0,0,0,0.4)',
                overflow: 'hidden'
              }}
            >
              <div style={{ background: 'linear-gradient(135deg, #FF3366, #FF9933)', padding: '36px 36px 24px', textAlign: 'center', position: 'relative' }}>
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} style={{ fontSize: 52, marginBottom: 12 }}>👑</motion.div>
                <h2 style={{ color: 'white', fontSize: 24, fontWeight: 900, margin: '0 0 6px' }}>Upgrade ke PRO</h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: 0, fontWeight: 500 }}>Buka semua fitur eksklusif untuk pesta terbaik Anda</p>
                <button onClick={() => setIsUpgradeModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.2)', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ textAlign: 'center', padding: '20px 36px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>Rp</span>
                  <span style={{ fontSize: 48, fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>99.000</span>
                </div>
                <p style={{ color: '#64748B', fontSize: 13, margin: '0 0 16px', fontWeight: 500 }}>Sekali bayar • Berlaku selamanya untuk pesta ini</p>
              </div>
              <div style={{ padding: '20px 36px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '∞', text: 'Tamu Unlimited (tidak ada batas)' },
                  { icon: '🎨', text: 'Akses 50+ Tema Premium & VIP' },
                  { icon: '📊', text: 'Laporan Ekspor PDF & Excel' },
                  { icon: '🚫', text: 'Bebas Watermark PartyBox' },
                  { icon: '📱', text: 'Notifikasi RSVP via WhatsApp' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{icon}</div>
                    <span style={{ fontSize: 14, color: '#334155', fontWeight: 600 }}>{text}</span>
                    <Check size={16} color="#10B981" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                  </div>
                ))}
              </div>
              <div style={{ padding: '16px 36px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleUpgradeToPro(upgradingPartyId || undefined)}
                  style={{ width: '100%', padding: '16px', borderRadius: 100, border: 'none', background: 'linear-gradient(135deg, #FF3366, #FF9933)', color: 'white', fontWeight: 900, fontSize: 16, cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,51,102,0.35)', fontFamily: 'var(--font-jakarta)' }}
                >
                  🎉 Aktifkan PRO Sekarang
                </motion.button>
                <button onClick={() => setIsUpgradeModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                  Tidak, mungkin nanti
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
