'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calculator, Plus, Trash2, AlertCircle, 
  Wallet, Receipt, TrendingUp, DollarSign, Wine,
  Utensils, MapPin, Sparkles, Music, Gift, Cake, ChevronRight,
  Shirt, Car, Camera, Package, Download, ChevronDown, FileText, FileSpreadsheet
} from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

// Category config for rich UI
const categoryConfig: Record<string, { icon: any, color: string, bg: string }> = {
  'Venue / Lokasi': { icon: MapPin, color: '#3B82F6', bg: '#EFF6FF' },
  'Makanan & Katering': { icon: Utensils, color: '#F59E0B', bg: '#FFFBEB' },
  'Dekorasi': { icon: Sparkles, color: '#10B981', bg: '#ECFDF5' },
  'Hiburan / Talent': { icon: Music, color: '#8B5CF6', bg: '#F5F3FF' },
  'Undangan & Suvenir': { icon: Gift, color: '#EC4899', bg: '#FDF2F8' },
  'Kue Ulang Tahun': { icon: Cake, color: '#F43F5E', bg: '#FFF1F2' },
  'Kostum / Pakaian': { icon: Shirt, color: '#06B6D4', bg: '#ECFEFF' },
  'Transportasi': { icon: Car, color: '#84CC16', bg: '#F7FEE7' },
  'Fotografi & Video': { icon: Camera, color: '#6366F1', bg: '#EEF2FF' },
  'Doorprize / Hadiah': { icon: Package, color: '#F97316', bg: '#FFF7ED' },
  'Lain-lain': { icon: Calculator, color: '#64748B', bg: '#F8FAFC' },
  'Bar & Minuman (Beverage)': { icon: Wine, color: '#9333EA', bg: '#FAF5FF' }
}

// Default categories
const defaultCategories = [
  'Venue / Lokasi',
  'Makanan & Katering',
  'Dekorasi',
  'Hiburan / Talent',
  'Undangan & Suvenir',
  'Kue Ulang Tahun',
  'Fotografi & Video',
  'Kostum / Pakaian',
  'Transportasi',
  'Doorprize / Hadiah',
  'Lain-lain'
]

const adultCategories = [
  ...defaultCategories,
  'Bar & Minuman (Beverage)'
]

export default function BudgetPage() {
  const [isClient, setIsClient] = useState(false)
  const [activeParty, setActiveParty] = useState<any>(null)
  const [parties, setParties] = useState<any[]>([])
  
  // Budget State
  const [totalBudget, setTotalBudget] = useState<number>(0)
  const [isEditingBudget, setIsEditingBudget] = useState(false)
  const [budgetInput, setBudgetInput] = useState('')
  
  const [expenses, setExpenses] = useState<any[]>([])

  // Export dropdown menu
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)
  
  // New Expense State
  const [expenseName, setExpenseName] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseCategory, setExpenseCategory] = useState('Venue / Lokasi')

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
          initializeBudget(active.id)
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
            initializeBudget(active.id)
          }
        } else {
          setActiveParty(null)
          setExpenses([])
          setTotalBudget(0)
        }
      }

      window.addEventListener('partyUpdated', handlePartyUpdate)
      
      // Close export menu when clicking outside
      const handler = (e: MouseEvent) => {
        if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
          setIsExportMenuOpen(false)
        }
      }
      document.addEventListener('mousedown', handler)

      return () => {
        window.removeEventListener('partyUpdated', handlePartyUpdate)
        document.removeEventListener('mousedown', handler)
      }
    }
  }, [])

  // Initialize Budget for active party
  const initializeBudget = (partyId: string) => {
    if (typeof window === 'undefined') return
    
    const savedBudgetsStr = localStorage.getItem('vlass_budgets')
    let budgets = savedBudgetsStr ? JSON.parse(savedBudgetsStr) : {}
    
    if (budgets[partyId]) {
      setTotalBudget(budgets[partyId].total || 0)
      setExpenses(budgets[partyId].items || [])
    } else {
      setTotalBudget(0)
      setExpenses([])
    }
  }

  // Update budget in state and localStorage
  const saveBudgetData = (newTotal: number, newExpenses: any[]) => {
    if (!activeParty) return
    setTotalBudget(newTotal)
    setExpenses(newExpenses)
    
    if (typeof window !== 'undefined') {
      const savedBudgetsStr = localStorage.getItem('vlass_budgets')
      let budgets = savedBudgetsStr ? JSON.parse(savedBudgetsStr) : {}
      
      budgets[activeParty.id] = {
        total: newTotal,
        items: newExpenses
      }
      localStorage.setItem('vlass_budgets', JSON.stringify(budgets))
    }
  }

  const handleUpdateTotalBudget = () => {
    const parsed = parseInt(budgetInput.replace(/\D/g, ''), 10)
    saveBudgetData(isNaN(parsed) ? 0 : parsed, expenses)
    setIsEditingBudget(false)
  }

  const handleAddExpense = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!expenseName.trim() || !expenseAmount) return

    const amount = parseInt(expenseAmount.replace(/\D/g, ''), 10)
    if (isNaN(amount)) return

    const newExpense = {
      id: Date.now().toString(),
      name: expenseName.trim(),
      category: expenseCategory,
      amount: amount,
      date: new Date().toISOString()
    }

    saveBudgetData(totalBudget, [...expenses, newExpense])
    setExpenseName('')
    setExpenseAmount('')
  }

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id)
    saveBudgetData(totalBudget, updated)
  }

  // Format IDR Currency
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
  }

  const handleExportPDF = () => {
    if (activeParty?.tier === 'basic') {
      const showToast = (message: string) => window.dispatchEvent(new CustomEvent('showToast', { detail: { message } }))
      showToast('👑 Fitur Ekspor PDF khusus Pesta PRO. Upgrade sekarang!')
      return
    }
    const doc = new jsPDF()
    doc.text(`Laporan Anggaran - Pesta ${activeParty.name}`, 14, 20)
    
    const tableData = expenses.map((e: any, index: number) => [
      index + 1,
      e.name,
      e.category,
      formatIDR(e.amount)
    ])

    autoTable(doc, {
      startY: 30,
      head: [['No', 'Nama Pengeluaran', 'Kategori', 'Nominal']],
      body: tableData,
    })
    
    doc.save(`Laporan_Anggaran_${activeParty.name.replace(/\s+/g, '_')}.pdf`)
    const showToast = (message: string) => window.dispatchEvent(new CustomEvent('showToast', { detail: { message } }))
    showToast('📥 Laporan Anggaran PDF berhasil diunduh!')
    setIsExportMenuOpen(false)
  }

  const handleExportExcel = () => {
    if (activeParty?.tier === 'basic') {
      const showToast = (message: string) => window.dispatchEvent(new CustomEvent('showToast', { detail: { message } }))
      showToast('👑 Fitur Ekspor Excel khusus Pesta PRO. Upgrade sekarang!')
      return
    }
    const tableData = expenses.map((e: any, index: number) => ({
      'No': index + 1,
      'Nama Pengeluaran': e.name,
      'Kategori': e.category,
      'Nominal': e.amount
    }))

    const worksheet = XLSX.utils.json_to_sheet(tableData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Anggaran")
    
    XLSX.writeFile(workbook, `Laporan_Anggaran_${activeParty.name.replace(/\s+/g, '_')}.xlsx`)
    const showToast = (message: string) => window.dispatchEvent(new CustomEvent('showToast', { detail: { message } }))
    showToast('📥 Laporan Anggaran Excel berhasil diunduh!')
    setIsExportMenuOpen(false)
  }

  if (!isClient) return null

  // Empty State if no active party
  if (!activeParty) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Calculator size={64} color="#CBD5E1" style={{ marginBottom: 24 }} />
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Belum Ada Pesta Aktif</h2>
        <p style={{ color: '#64748B', maxWidth: 400, textAlign: 'center', lineHeight: 1.5 }}>
          Silakan buat pesta atau pilih pesta aktif terlebih dahulu dari menu Dasbor Utama untuk mulai mengatur anggaran.
        </p>
      </div>
    )
  }

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0)
  const remainingBudget = totalBudget - totalSpent
  const overBudget = remainingBudget < 0
  const progressPercent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0

  const categories = activeParty.type === 'adult' ? adultCategories : defaultCategories

  return (
    <div style={{ paddingBottom: 60 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', marginBottom: 8, letterSpacing: '-0.02em' }}>Pelacak Anggaran</h1>
          <p style={{ fontSize: 16, color: '#64748B', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
            Kelola pengeluaran untuk <strong style={{ color: '#FF3366' }}>Pesta {activeParty.name}</strong>
          </p>
        </div>
        
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
      </div>

      {/* Top Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: 24, 
          borderRadius: 24, color: 'white', position: 'relative', overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(15,23,42,0.4)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          minHeight: 180
        }}>
          {/* Aesthetic Background Elements */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 250, height: 250, background: 'radial-gradient(circle, rgba(255,51,102,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
          <Wallet size={160} color="white" style={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.03, transform: 'rotate(-15deg)' }} />
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 12, backdropFilter: 'blur(10px)' }}>
                <DollarSign size={20} color="#FF9933" />
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8, margin: 0 }}>Total Anggaran</p>
            </div>
            
            {isEditingBudget ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <input 
                  type="text" 
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="Misal: 5000000"
                  style={{
                    padding: '12px 16px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', outline: 'none',
                    fontSize: 24, fontWeight: 800, width: '100%', fontFamily: 'var(--font-jakarta)',
                    background: 'rgba(0,0,0,0.3)', color: 'white', backdropFilter: 'blur(10px)'
                  }}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateTotalBudget()}
                />
                <button 
                  onClick={handleUpdateTotalBudget}
                  style={{ padding: '0 24px', background: 'linear-gradient(135deg, #FF3366, #FF9933)', color: 'white', border: 'none', borderRadius: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(255,51,102,0.2)', fontSize: 16 }}
                >
                  Simpan
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <h2 style={{ fontSize: 36, fontWeight: 900, margin: 0, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #FFFFFF, #E2E8F0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', wordBreak: 'break-all' }}>
                  {totalBudget === 0 ? 'Rp 0' : formatIDR(totalBudget)}
                </h2>
                <button 
                  onClick={() => {
                    setBudgetInput(totalBudget.toString())
                    setIsEditingBudget(true)
                  }}
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  Ubah Setelan
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Total Spent / Progress Card */}
        <div style={{ background: 'white', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 20px 40px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, position: 'relative', zIndex: 2, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 min-content' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ padding: 6, background: '#F1F5F9', borderRadius: 8 }}><Receipt size={14} color="#475569" /></div>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Terpakai</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{formatIDR(totalSpent)}</div>
            </div>
            
            <div style={{ width: 1, background: '#E2E8F0', margin: '10px 0' }} />

            <div style={{ flex: '1 1 min-content' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ padding: 6, background: overBudget ? '#FEF2F2' : '#ECFDF5', borderRadius: 8 }}><TrendingUp size={14} color={overBudget ? '#EF4444' : '#10B981'} /></div>
                <span style={{ fontSize: 13, fontWeight: 800, color: overBudget ? '#EF4444' : '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sisa Dana</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: overBudget ? '#EF4444' : '#10B981', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                {overBudget ? `-${formatIDR(Math.abs(remainingBudget))}` : formatIDR(remainingBudget)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>Penggunaan Anggaran</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: overBudget ? '#EF4444' : '#0F172A' }}>{progressPercent}%</span>
            </div>
            <div style={{ height: 8, background: '#F1F5F9', borderRadius: 100, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ 
                  height: '100%', 
                  background: overBudget ? '#EF4444' : 'linear-gradient(90deg, #10B981, #059669)', 
                  borderRadius: 100,
                  boxShadow: overBudget ? '0 0 10px rgba(239,68,68,0.5)' : 'none'
                }}
              />
            </div>
          </div>

          {/* Sparkles Decoration */}
          {progressPercent === 100 && !overBudget && (
             <div style={{ position: 'absolute', right: 20, top: 20, color: '#10B981', opacity: 0.2 }}>
               <Sparkles size={100} />
             </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
        
        {/* Add Expense Form */}
        <div style={{ background: 'white', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0', boxShadow: '0 20px 40px rgba(0,0,0,0.02)', alignSelf: 'start' }}>
          <h3 style={{ flexShrink: 0, fontSize: 22, fontWeight: 900, color: '#0F172A', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 8, background: '#F1F5F9', borderRadius: 12 }}><Plus size={20} color="#0F172A" /></div>
            Catat Pengeluaran Baru
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Amount Input Large */}
            <div style={{ background: '#F8FAFC', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Nominal (Rp)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: '#94A3B8', marginTop: 2 }}>Rp</span>
                <input 
                  type="text" 
                  placeholder="0" 
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value.replace(/\D/g, ''))}
                  style={{ width: '100%', padding: 0, border: 'none', outline: 'none', fontSize: 40, fontWeight: 900, fontFamily: 'var(--font-jakarta)', background: 'transparent', color: '#0F172A', letterSpacing: '-0.02em' }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddExpense()}
                />
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#475569', marginBottom: 10 }}>Nama Item/Jasa</label>
              <input 
                type="text" 
                placeholder="Misal: DP Katering" 
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddExpense()}
                style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '1.5px solid #E2E8F0', outline: 'none', fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-jakarta)', background: '#F8FAFC', color: '#0F172A', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = '#0F172A'}
                onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>

            {/* Premium Category Chips */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#475569', marginBottom: 12 }}>Kategori</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {categories.map(cat => {
                  const conf = categoryConfig[cat] || categoryConfig['Lain-lain'];
                  const isSelected = expenseCategory === cat;
                  return (
                    <div 
                      key={cat}
                      onClick={() => setExpenseCategory(cat)}
                      style={{
                        padding: '8px 16px', borderRadius: 100, border: `1.5px solid ${isSelected ? conf.color : '#E2E8F0'}`,
                        background: isSelected ? conf.bg : 'white',
                        color: isSelected ? conf.color : '#64748B',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                        transition: 'all 0.2s', boxShadow: isSelected ? `0 4px 12px ${conf.color}30` : 'none'
                      }}
                    >
                      <conf.icon size={14} />
                      {cat}
                    </div>
                  )
                })}
              </div>
            </div>

            <button 
              onClick={() => {
                if (expenseName.trim() && expenseAmount) {
                  handleAddExpense()
                }
              }}
              disabled={!expenseName.trim() || !expenseAmount}
              style={{
                marginTop: 16, padding: '18px 24px', borderRadius: 16, border: 'none',
                background: (!expenseName.trim() || !expenseAmount) ? '#E2E8F0' : 'linear-gradient(135deg, #0F172A, #1E293B)', 
                color: (!expenseName.trim() || !expenseAmount) ? '#94A3B8' : 'white', 
                fontWeight: 800, fontSize: 16, cursor: (!expenseName.trim() || !expenseAmount) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s', boxShadow: (!expenseName.trim() || !expenseAmount) ? 'none' : '0 15px 30px rgba(15,23,42,0.25)'
              }}
              onMouseEnter={(e) => { if (expenseName.trim() && expenseAmount) e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { if (expenseName.trim() && expenseAmount) e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <Plus size={20} /> Simpan Pengeluaran
            </button>
          </div>

          {/* Beautiful Adult Mode Section */}
          {activeParty.type === 'adult' && (
            <div style={{ marginTop: 32, padding: 24, background: 'linear-gradient(135deg, #FAF5FF, #F3E8FF)', borderRadius: 20, border: '1px solid #E9D5FF', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.05, color: '#9333EA', transform: 'rotate(15deg)' }}><Wine size={120} /></div>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #A855F7, #7E22CE)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(126,34,206,0.3)' }}>
                    <Wine size={20} color="white" />
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 900, color: '#6B21A8', margin: 0 }}>Bar Tracker Pintar</h4>
                </div>
                <p style={{ fontSize: 14, color: '#7E22CE', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  Gunakan kategori <strong>Bar & Minuman</strong> untuk mengisolasi pengeluaran alkohol dari makanan. Membantu Anda mencegah *budget leak* di hari H pesta!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Premium Expenses List */}
        <div style={{ background: 'white', padding: 24, borderRadius: 24, border: '1px solid #E2E8F0', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 8, background: '#F1F5F9', borderRadius: 12 }}><Receipt size={20} color="#0F172A" /></div>
            Riwayat Transaksi
          </h3>
          
          {expenses.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '60px 20px', background: '#F8FAFC', borderRadius: 24, border: '2px dashed #E2E8F0' }}>
              <div style={{ width: 64, height: 64, background: 'white', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                <DollarSign size={32} color="#94A3B8" />
              </div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#475569', margin: '0 0 8px 0' }}>Belum ada transaksi</p>
              <p style={{ fontSize: 14, color: '#94A3B8', margin: 0 }}>Semua pengeluaran yang Anda catat akan muncul di sini.</p>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 8 }}>
              <AnimatePresence>
                {expenses.map(expense => {
                  const conf = categoryConfig[expense.category] || categoryConfig['Lain-lain'];
                  return (
                    <motion.div 
                      key={expense.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '20px', borderRadius: 20, background: 'white', border: '1px solid #F1F5F9',
                        transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden'
                      }}
                      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.06)', borderColor: '#E2E8F0' }}
                    >
                      {/* Color accent line on the left */}
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: conf.color }} />
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 8 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 16, background: conf.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: conf.color }}>
                          <conf.icon size={20} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: '0 0 4px 0' }}>{expense.name}</h4>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#64748B' }}>
                            {expense.category}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ fontSize: 16, fontWeight: 900, color: '#0F172A' }}>
                          {formatIDR(expense.amount)}
                        </span>
                        <button 
                          onClick={() => handleDeleteExpense(expense.id)}
                          style={{ background: '#FEF2F2', border: 'none', borderRadius: 12, padding: 10, cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#FEF2F2'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}
