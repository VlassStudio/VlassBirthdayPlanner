'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Plus, Trash2, Calendar, AlertCircle, CheckCircle2, ArrowUp, ArrowDown, Copy } from 'lucide-react'

const showToast = (message: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('showToast', { detail: { message } }))
  }
}

interface RundownEvent {
  id: string
  time: string
  title: string
  description: string
}

export default function RundownPage() {
  const [isClient, setIsClient] = useState(false)
  const [activeParty, setActiveParty] = useState<any>(null)
  const [events, setEvents] = useState<RundownEvent[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newEvent, setNewEvent] = useState({ time: '19:00', title: '', description: '' })
  
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const parties = JSON.parse(localStorage.getItem('glyka_parties') || localStorage.getItem('vlass_parties') || '[]')
      const activeId = localStorage.getItem('glyka_active_party_id') || localStorage.getItem('vlass_active_party_id')
      if (parties && activeId) {
        const active = parties.find((p: any) => p.id === activeId)
        setActiveParty(active)
        
        // Load rundown
        const storedRundown = JSON.parse(localStorage.getItem('glyka_rundown') || localStorage.getItem('vlass_rundown') || '{}')
        if (storedRundown[activeId]) {
          setEvents(storedRundown[activeId])
        } else {
          // Default rundown based on party type
          const defaultEvents = active.type === 'kids' 
            ? [
                { id: '1', time: '15:00', title: 'Tamu Datang & Registrasi', description: 'Pembagian topi ulang tahun dan snack ringan.' },
                { id: '2', time: '15:30', title: 'Games Interaktif', description: 'MC memimpin permainan tebak lagu dan sulap.' },
                { id: '3', time: '16:15', title: 'Tiup Lilin & Potong Kue', description: 'Menyanyikan lagu selamat ulang tahun bersama.' },
                { id: '4', time: '16:30', title: 'Makan Bersama', description: 'Membuka area prasmanan untuk anak-anak dan pendamping.' },
                { id: '5', time: '17:30', title: 'Pembagian Goodie Bag', description: 'Acara selesai, foto bersama dan pembagian bingkisan.' }
              ]
            : [
                { id: '1', time: '19:00', title: 'Welcome Drinks', description: 'Tamu tiba, mingling, dan menikmati minuman pembuka.' },
                { id: '2', time: '19:45', title: 'Makan Malam Dimulai', description: 'Buffet dibuka, diiringi live music/DJ ringan.' },
                { id: '3', time: '20:45', title: 'Speech & Toast', description: 'Ucapan terima kasih dari yang berulang tahun dan toast bersama.' },
                { id: '4', time: '21:00', title: 'Cake Cutting', description: 'Tiup lilin dan pemotongan kue.' },
                { id: '5', time: '21:30', title: 'Party Time / After Party', description: 'Lantai dansa dibuka, musik upbeat.' }
              ];
          setEvents(defaultEvents)
          saveRundown(activeId, defaultEvents)
        }
      }
    }
  }, [])

  const saveRundown = (partyId: string, updatedEvents: RundownEvent[], autoSort = true) => {
    const finalEvents = autoSort ? [...updatedEvents].sort((a, b) => a.time.localeCompare(b.time)) : updatedEvents;
    setEvents(finalEvents)
    const stored = JSON.parse(localStorage.getItem('glyka_rundown') || localStorage.getItem('vlass_rundown') || '{}')
    stored[partyId] = finalEvents
    localStorage.setItem('glyka_rundown', JSON.stringify(stored))
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (!activeParty) return;
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === events.length - 1)
    ) return;
    
    const newEvents = [...events];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newEvents[index], newEvents[targetIndex]] = [newEvents[targetIndex], newEvents[index]];
    
    saveRundown(activeParty.id, newEvents, false);
  }

  const handleCopy = () => {
    const text = `RUNDOWN ACARA - ${activeParty?.name}\n\n` + events.map(e => `${e.time} - ${e.title}\n${e.description}`).join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      showToast('📝 Rundown disalin ke clipboard!');
    }).catch(() => {
      showToast('❌ Gagal menyalin text.');
    });
  }

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time || !activeParty) return
    const updated = [...events, { ...newEvent, id: Date.now().toString() }]
    saveRundown(activeParty.id, updated)
    setNewEvent({ time: '19:00', title: '', description: '' })
    setIsAdding(false)
    showToast('✅ Jadwal acara berhasil ditambahkan!')
  }

  const handleDeleteEvent = (id: string) => {
    if (!activeParty) return
    const updated = events.filter(e => e.id !== id)
    saveRundown(activeParty.id, updated)
    showToast('🗑️ Jadwal dihapus.')
  }

  if (!isClient) return null
  if (!activeParty) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Calendar size={64} color="#CBD5E1" style={{ marginBottom: 24 }} />
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Belum Ada Pesta Aktif</h2>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 60 }}>
      <style>{`
        @media (max-width: 768px) {
          .header-actions { flex-direction: column !important; width: 100% !important; }
          .header-actions button { width: 100% !important; justify-content: center !important; }
          .rundown-card { padding: 16px !important; }
          .rundown-line { left: 17px !important; }
          .rundown-item { gap: 12px !important; }
          .rundown-circle { width: 36px !important; }
          .rundown-circle-inner { width: 36px !important; height: 36px !important; border-width: 3px !important; }
          .rundown-time { font-size: 10px !important; }
          .rundown-content { padding: 12px !important; }
          .rundown-content h3 { font-size: 15px !important; }
          .rundown-content p { font-size: 13px !important; }
        }
      `}</style>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', marginBottom: 8, letterSpacing: '-0.02em' }}>Rundown Acara</h1>
          <p style={{ fontSize: 16, color: '#64748B', fontWeight: 500 }}>
            Susun jadwal dan urutan acara untuk <strong>Pesta {activeParty.name}</strong>.
          </p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={handleCopy}
            style={{ padding: '12px 20px', borderRadius: 100, border: '1px solid #E2E8F0', background: 'white', color: '#0F172A', fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}
          >
            <Copy size={18} /> Copy Text
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            style={{ padding: '12px 20px', borderRadius: 100, border: 'none', background: '#0F172A', color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 20px rgba(15,23,42,0.15)' }}
          >
            <Plus size={18} /> Tambah Jadwal
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32, alignItems: 'start' }}>
        
        {/* Timeline View */}
        <div className="rundown-card" style={{ background: 'white', padding: 32, borderRadius: 32, border: '1px solid #E2E8F0', boxShadow: '0 10px 40px rgba(0,0,0,0.02)', position: 'relative' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={20} color="#3B82F6" /> Timeline Hari H
          </h2>

          <div style={{ position: 'relative' }}>
            {/* Vertical Line */}
            <div className="rundown-line" style={{ position: 'absolute', left: 24, top: 20, bottom: 20, width: 2, background: '#F1F5F9' }} />
            
            <AnimatePresence>
              {events.map((ev, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                  key={ev.id} 
                  className="rundown-item"
                  style={{ display: 'flex', gap: 20, marginBottom: i === events.length - 1 ? 0 : 24, position: 'relative' }}
                >
                  {/* Timeline Dot & Time */}
                  <div className="rundown-circle" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 50, zIndex: 2 }}>
                    <div className="rundown-circle-inner" style={{ width: 48, height: 48, borderRadius: '50%', background: '#EEF2FF', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                      <span className="rundown-time" style={{ fontSize: 12, fontWeight: 800, color: '#4338CA' }}>{ev.time}</span>
                    </div>
                  </div>
                  
                  {/* Content Card */}
                  <div className="rundown-content" style={{ flex: 1, background: '#F8FAFC', padding: 20, borderRadius: 20, border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>{ev.title}</h3>
                        <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.5 }}>{ev.description}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <button onClick={() => handleMove(i, 'up')} disabled={i === 0} style={{ background: 'transparent', border: 'none', cursor: i === 0 ? 'not-allowed' : 'pointer', color: i === 0 ? '#E2E8F0' : '#94A3B8', padding: 2 }}>
                            <ArrowUp size={16} />
                          </button>
                          <button onClick={() => handleMove(i, 'down')} disabled={i === events.length - 1} style={{ background: 'transparent', border: 'none', cursor: i === events.length - 1 ? 'not-allowed' : 'pointer', color: i === events.length - 1 ? '#E2E8F0' : '#94A3B8', padding: 2 }}>
                            <ArrowDown size={16} />
                          </button>
                        </div>
                        <button onClick={() => handleDeleteEvent(ev.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444', padding: 4 }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {events.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                Belum ada jadwal acara. Klik "Tambah Jadwal" untuk mulai menyusun rundown.
              </div>
            )}
          </div>
        </div>

        {/* Info & Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', padding: 32, borderRadius: 32, color: 'white', boxShadow: '0 15px 30px rgba(16,185,129,0.2)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={24} /> Tips Rundown Sempurna
            </h3>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: 14, lineHeight: 1.8, fontWeight: 500, color: '#ECFDF5' }}>
              <li>Beri jeda 15-30 menit antar acara untuk menghindari keterlambatan (buffer time).</li>
              <li>Jadwalkan sesi foto saat energi tamu masih penuh (biasanya di awal atau pertengahan acara).</li>
              <li>Jangan biarkan tamu menunggu terlalu lama sebelum hidangan utama disajikan.</li>
            </ul>
          </div>
          
          <div style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', padding: 24, borderRadius: 24, display: 'flex', gap: 16 }}>
             <AlertCircle size={24} color="#F97316" style={{ flexShrink: 0 }} />
             <div>
               <h4 style={{ fontSize: 14, fontWeight: 800, color: '#9A3412', marginBottom: 4 }}>Bagikan ke Vendor</h4>
               <p style={{ fontSize: 13, color: '#C2410C', lineHeight: 1.5 }}>Pastikan MC, fotografer, dan pihak katering menerima salinan rundown ini selambat-lambatnya H-3 sebelum acara.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setIsAdding(false)} />
            <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }} style={{ background: 'white', width: '100%', maxWidth: 450, borderRadius: 32, position: 'relative', zIndex: 110, padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 24 }}>Tambah Jadwal Baru</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6, color: '#334155' }}>Waktu</label>
                  <input type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E2E8F0', outline: 'none', fontFamily: 'inherit', fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6, color: '#334155' }}>Judul Acara</label>
                  <input type="text" placeholder="Misal: Potong Kue" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E2E8F0', outline: 'none', fontFamily: 'inherit', fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6, color: '#334155' }}>Deskripsi / Keterangan</label>
                  <textarea placeholder="Penjelasan singkat tentang sesi ini..." value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} rows={3} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E2E8F0', outline: 'none', fontFamily: 'inherit', fontSize: 14, resize: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                <button onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '14px', borderRadius: 100, border: '1.5px solid #E2E8F0', background: 'white', color: '#64748B', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Batal</button>
                <button onClick={handleAddEvent} disabled={!newEvent.title} style={{ flex: 1, padding: '14px', borderRadius: 100, border: 'none', background: newEvent.title ? '#0F172A' : '#E2E8F0', color: newEvent.title ? 'white' : '#94A3B8', fontWeight: 800, fontSize: 14, cursor: newEvent.title ? 'pointer' : 'not-allowed' }}>Simpan Jadwal</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
