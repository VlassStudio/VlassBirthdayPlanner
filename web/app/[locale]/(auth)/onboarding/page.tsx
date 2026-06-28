'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { PartyPopper, Check, Calendar, User, ArrowRight, ArrowLeft, Wine } from 'lucide-react'

export default function OnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  
  const [data, setData] = useState({
    mode: '', // 'kids' | 'adult'
    guestOfHonor: '',
    date: '',
    theme: ''
  })

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
    else {
      // Finish onboarding and redirect to dashboard
      router.push('/dashboard')
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF9', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-jakarta)' }}>
      {/* Top Navbar */}
      <div style={{ padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px dashed rgba(255,51,102,0.1)', background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #FF3366, #FF9933)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-10deg)' }}>
            <PartyPopper size={20} color="white" />
          </div>
          <span style={{ fontWeight: 900, fontSize: 24, letterSpacing: '-0.03em', color: '#18181B' }}>PartyBox</span>
        </div>
        
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: s === step ? '#FF3366' : s < step ? '#10B981' : '#F4F4F5', color: s <= step ? 'white' : '#A1A1AA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                {s < step ? <Check size={16} /> : s}
              </div>
              {s < 3 && <div style={{ width: 40, height: 4, background: s < step ? '#10B981' : '#F4F4F5', borderRadius: 2 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          style={{ width: '100%', maxWidth: 600, background: 'white', padding: 40, borderRadius: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.05)', border: '1px solid #F4F4F5' }}
        >
          {step === 1 && (
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: '#18181B', marginBottom: 12, letterSpacing: '-0.02em' }}>Pilih Mode Pesta</h1>
              <p style={{ color: '#71717A', fontSize: 16, marginBottom: 32, fontWeight: 500 }}>Apa jenis pesta yang sedang Anda rencanakan?</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <button onClick={() => setData({...data, mode: 'kids'})} style={{ textAlign: 'left', padding: 24, borderRadius: 20, border: `2px solid ${data.mode === 'kids' ? '#FF3366' : '#F4F4F5'}`, background: data.mode === 'kids' ? '#FFF0F5' : 'white', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: '#FFE5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🧸</div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: data.mode === 'kids' ? '#FF3366' : '#18181B', marginBottom: 4 }}>Pesta Anak-anak</h3>
                    <p style={{ fontSize: 14, color: '#71717A', margin: 0, fontWeight: 500 }}>Fitur drop-off, alergi makanan anak, tema ceria.</p>
                  </div>
                </button>
                
                <button onClick={() => setData({...data, mode: 'adult'})} style={{ textAlign: 'left', padding: 24, borderRadius: 20, border: `2px solid ${data.mode === 'adult' ? '#4338CA' : '#F4F4F5'}`, background: data.mode === 'adult' ? 'rgba(67,56,202,0.05)' : 'white', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338CA' }}><Wine size={32} /></div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: data.mode === 'adult' ? '#4338CA' : '#18181B', marginBottom: 4 }}>Pesta Dewasa</h3>
                    <p style={{ fontSize: 14, color: '#71717A', margin: 0, fontWeight: 500 }}>Manajemen +1, pilihan cocktail, dress code elegan.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: '#18181B', marginBottom: 12, letterSpacing: '-0.02em' }}>Detail Dasar</h1>
              <p style={{ color: '#71717A', fontSize: 16, marginBottom: 32, fontWeight: 500 }}>Siapa yang berulang tahun dan kapan pestanya diadakan?</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: '#18181B', marginBottom: 8 }}>
                    <User size={18} color="#FF3366" /> Nama yang Berulang Tahun
                  </label>
                  <input type="text" placeholder="Cth: Alisha, Budi..." value={data.guestOfHonor} onChange={e => setData({...data, guestOfHonor: e.target.value})} style={{ width: '100%', padding: 16, borderRadius: 16, border: '2px solid #F4F4F5', outline: 'none', fontSize: 16, fontFamily: 'var(--font-jakarta)', fontWeight: 600, boxSizing: 'border-box' }} />
                </div>
                
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: '#18181B', marginBottom: 8 }}>
                    <Calendar size={18} color="#FF9933" /> Tanggal Acara
                  </label>
                  <input type="date" value={data.date} onChange={e => setData({...data, date: e.target.value})} style={{ width: '100%', padding: 16, borderRadius: 16, border: '2px solid #F4F4F5', outline: 'none', fontSize: 16, fontFamily: 'var(--font-jakarta)', fontWeight: 600, boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: '#18181B', marginBottom: 12, letterSpacing: '-0.02em' }}>Pilih Tema Desain</h1>
              <p style={{ color: '#71717A', fontSize: 16, marginBottom: 32, fontWeight: 500 }}>Pilih estetika undangan yang paling cocok dengan pesta Anda.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { id: 'magical', name: 'Magical Unicorn', emoji: '🦄', color: '#FF3366', bg: '#FFE5EC' },
                  { id: 'safari', name: 'Safari Adventure', emoji: '🦁', color: '#F59E0B', bg: '#FEF3C7' },
                  { id: 'space', name: 'Space Explorer', emoji: '🚀', color: '#3B82F6', bg: '#DBEAFE' },
                  { id: 'elegant', name: 'Midnight Elegance', emoji: '✨', color: '#4338CA', bg: '#E0E7FF' }
                ].map(theme => (
                  <button key={theme.id} onClick={() => setData({...data, theme: theme.id})} style={{ padding: 24, borderRadius: 20, border: `2px solid ${data.theme === theme.id ? theme.color : '#F4F4F5'}`, background: data.theme === theme.id ? theme.bg : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>{theme.emoji}</div>
                    <h4 style={{ fontSize: 15, fontWeight: 800, color: data.theme === theme.id ? theme.color : '#18181B', margin: 0 }}>{theme.name}</h4>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 24, borderTop: '2px dashed #F4F4F5' }}>
            <button onClick={prevStep} disabled={step === 1} style={{ padding: '16px 24px', background: 'white', color: '#71717A', borderRadius: 100, border: '2px solid #E4E4E7', fontWeight: 800, fontSize: 15, cursor: step === 1 ? 'not-allowed' : 'pointer', opacity: step === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-jakarta)' }}>
              <ArrowLeft size={18} /> Kembali
            </button>
            <button onClick={nextStep} disabled={
              (step === 1 && !data.mode) || 
              (step === 2 && (!data.guestOfHonor || !data.date)) || 
              (step === 3 && !data.theme)
            } style={{ padding: '16px 32px', background: '#FF3366', color: 'white', borderRadius: 100, border: 'none', fontWeight: 800, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 20px rgba(255,51,102,0.3)', fontFamily: 'var(--font-jakarta)', opacity: ((step === 1 && !data.mode) || (step === 2 && (!data.guestOfHonor || !data.date)) || (step === 3 && !data.theme)) ? 0.5 : 1 }}>
              {step === 3 ? 'Selesai & Buat Pesta' : 'Lanjutkan'} <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
