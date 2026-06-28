"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ThemeRenderer from '@/components/themes/ThemeRenderer'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Save, Type, LayoutTemplate, Palette, RefreshCw,
  MessageSquare, ChevronDown, Check, Sparkles, Eye, X, Info
} from 'lucide-react'

// Import full theme definitions
import { kidsThemes, adultThemes } from '@/app/[locale]/editor/themes';

// ─── Customizable text fields per theme context ────────────────────────────
const defaultTexts = {
  kids: {
    welcome: 'YAYYY! PARTY TIME!',
    subtitle: 'Ayo datang dan rayakan bersama dengan banyak kejutan dan kegembiraan!',
    rsvpButton: 'RSVP SEKARANG! 🎈',
    closing: 'Bring your biggest smile!',
  },
  adult: {
    welcome: 'YOU ARE INVITED',
    subtitle: 'Kehadiran Anda adalah kebahagiaan kami',
    rsvpButton: 'Buka RSVP',
    closing: "Dress to impress & Let's party!",
  }
}

// ─── Section Tab Component ─────────────────────────────────────────────────
function SectionTab({ label, icon, active, onClick, isDark }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '10px 8px', border: 'none', cursor: 'pointer', borderRadius: 12,
        background: active ? (isDark ? 'rgba(255,255,255,0.12)' : '#0F172A') : 'transparent',
        color: active ? (isDark ? '#fff' : '#fff') : (isDark ? 'rgba(255,255,255,0.4)' : '#94a3b8'),
        fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, transition: 'all 0.2s', letterSpacing: 0.3
      }}
    >
      {icon}
      {label}
    </button>
  )
}

// ─── Input Field Component ─────────────────────────────────────────────────
function FieldGroup({ label, children, isDark }: any) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 800,
        color: '#64748B',
        marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em'
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function StyledInput({ value, onChange, isDark, placeholder, multiline = false }: any) {
  const baseStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 13, fontWeight: 600,
    outline: 'none', fontFamily: 'var(--font-jakarta)', transition: 'all 0.2s',
    background: isDark ? 'rgba(0,0,0,0.2)' : '#F8FAFC',
    border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#E2E8F0'}`,
    color: isDark ? '#FFF' : '#0F172A',
    resize: 'vertical' as const,
  }
  if (multiline) {
    return <textarea rows={3} value={value} onChange={onChange} placeholder={placeholder} style={baseStyle} />
  }
  return <input type="text" value={value} onChange={onChange} placeholder={placeholder} style={baseStyle} />
}

// ─── Main Editor Page ──────────────────────────────────────────────────────
export default function EditorPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const locale = params?.locale || 'id'

  const [party, setParty] = useState<any>(null)
  const [selectedTheme, setSelectedTheme] = useState('')
  const [previewKey, setPreviewKey] = useState(0)
  const [activeTab, setActiveTab] = useState<'theme' | 'text'>('theme')
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')
  const [saved, setSaved] = useState(false)

  // All customizable texts
  const [texts, setTexts] = useState({
    welcome: '',
    subtitle: '',
    rsvpButton: '',
    closing: '',
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('glyka_parties') || localStorage.getItem('vlass_parties')
      if (stored) {
        const parties = JSON.parse(stored)
        const found = parties.find((p: any) => p.id === id)
        if (found) {
          setParty(found)
          setSelectedTheme(found.theme || (found.type === 'adult' ? 'gold' : 'dino'))
          const defaults = defaultTexts[found.type as 'kids' | 'adult']
          setTexts({
            welcome: found.customText?.welcome || defaults.welcome,
            subtitle: found.customText?.subtitle || defaults.subtitle,
            rsvpButton: found.customText?.rsvpButton || defaults.rsvpButton,
            closing: found.customText?.closing || defaults.closing,
          })
        }
      }
    }
  }, [id])

  const liveParty = party ? {
    ...party,
    theme: selectedTheme,
    customText: texts,
  } : null

  // Reset preview when theme changes
  useEffect(() => {
    setPreviewKey(k => k + 1)
  }, [selectedTheme])

  const handleSave = () => {
    if (!party) return
    const updatedParty = { ...party, theme: selectedTheme, customText: texts }
    const stored = localStorage.getItem('glyka_parties') || localStorage.getItem('vlass_parties')
    if (stored) {
      const parties = JSON.parse(stored)
      const newParties = parties.map((p: any) => p.id === id ? updatedParty : p)
      localStorage.setItem('glyka_parties', JSON.stringify(newParties))
      setParty(updatedParty)
      window.dispatchEvent(new Event('partyUpdated'))
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  if (!party) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
          <p style={{ color: '#64748B', fontWeight: 600 }}>Memuat Editor...</p>
        </div>
      </div>
    )
  }

  const isAdult = party.type === 'adult'
  const themesList = isAdult ? adultThemes : kidsThemes

  // Sidebar styling is static; no theme-dependent colors
// Determine if dark mode (adult parties use dark theme)
const isDark = false; // keep builder UI light regardless of party type

// Compute accent color based on the selected theme's definition
const themeObj = themesList.find(t => t.id === selectedTheme);
const accentColor = themeObj?.color || (isAdult ? '#FAFAFA' : '#FF3366');
// duplicate accentColor removed

  return (
    <div className="mobile-editor-layout" style={{ display: 'flex', height: '100vh', background: '#F1F5F9', fontFamily: 'var(--font-jakarta)', overflow: 'hidden' }}>
      <style>{`
        @media (max-width: 768px) {
          .mobile-editor-layout {
            flex-direction: column !important;
          }
          .editor-canvas-container {
            width: 100% !important;
            height: 42vh !important;
            flex: none !important;
            order: 1 !important;
            border-bottom: 1px solid #E2E8F0 !important;
            overflow-y: auto !important;
            align-items: flex-start !important;
          }
          .editor-sidebar-container {
            width: 100% !important;
            height: 58vh !important;
            flex: none !important;
            order: 2 !important;
            border-right: none !important;
            display: flex !important;
          }
          .phone-mockup-wrapper {
             transform: scale(0.65) !important;
             transform-origin: top center !important;
             margin-bottom: -182px !important;
             margin-top: 20px !important;
          }
          .live-status-bar {
             display: none !important;
          }
          .helper-text {
             display: none !important;
          }
          .desktop-title { display: none !important; }
        }
      `}</style>

      {/* ── LEFT SIDEBAR ─────────────────────────────────────────────── */}
        <div className="editor-sidebar-container" style={{
          width: 380,
          background: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          boxShadow: '4px 0 24px rgba(0,0,0,0.04)'
        }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <button
            onClick={() => router.push(`/${locale}/dashboard`)}
            style={{
              background: '#F1F5F9',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 14px',
              borderRadius: 100,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#64748B',
              fontWeight: 700,
              fontSize: 13
            }}
          >
            <ArrowLeft size={15} /> Kembali
          </button>

          <div style={{ textAlign: 'right' }} className="desktop-title">
            <div style={{ fontWeight: 900, color: '#0F172A', fontSize: 16, letterSpacing: -0.5 }}>
              Visual Builder
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>
              {party.name}
            </div>
          </div>
        </div>

          {/* Accent color stripe - neutral */}
            <div style={{ height: 3, background: '#94a3b8' }} />
        {/* Tab switcher */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #F1F5F9',
        }}>          <div style={{
            display: 'flex', gap: 6, background: '#F1F5F9',
            borderRadius: 14, padding: 5
          }}>            <SectionTab
              label="Pilih Tema" icon={<Palette size={13} />}
              active={activeTab === 'theme'} onClick={() => setActiveTab('theme')} isDark={isDark}
            />
            <SectionTab
              label="Edit Teks" icon={<Type size={13} />}
              active={activeTab === 'text'} onClick={() => setActiveTab('text')} isDark={isDark}
            />
          </div>
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 20px 8px' }}>
          <AnimatePresence mode="wait">

            {/* ── THEME TAB ──────────────────────────────── */}
            {activeTab === 'theme' && (
              <motion.div key="theme" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <p style={{ fontSize: 13, color: isDark ? 'rgba(255,255,255,0.4)' : '#94a3b8', marginBottom: 20, lineHeight: 1.6, fontWeight: 500 }}>
                  Pilih desain tema untuk undangan. Live preview di sebelah kanan akan langsung diperbarui.
                </p>

                {selectedTheme !== party.theme && (
                  <div style={{
                    marginBottom: 16, padding: '10px 12px', borderRadius: 10,
                    background: '#FEF3C7', border: '1px solid #FDE68A',
                    fontSize: 12, color: '#D97706', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    <span>⚠️ Tema berubah (Belum disimpan. Klik &apos;Simpan Perubahan&apos; di bawah)</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {themesList.map(t => {
                    const isActive = selectedTheme === t.id
                    return (
                      <motion.button
                        key={t.id}
                        onClick={() => setSelectedTheme(t.id)}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          border: `2px solid ${isActive ? t.color : (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0')}`,
                          borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                          background: isActive
                            ? (isDark ? `${t.color}18` : `${t.color}12`)
                            : (isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC'),
                          padding: '14px 14px 12px',
                          boxShadow: isActive ? `0 4px 20px ${t.color}30` : 'none',
                          transition: 'all 0.2s',
                          position: 'relative', overflow: 'hidden'
                        }}
                      >
                        {isActive && (
                          <div style={{
                            position: 'absolute', top: 8, right: 8,
                            width: 20, height: 20, background: t.color, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <Check size={12} color="white" strokeWidth={3} />
                          </div>
                        )}
                        <div style={{ fontSize: 28, marginBottom: 8 }}>{t.emoji}</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: isActive ? t.color : (isDark ? '#FAFAFA' : '#0F172A') }}>
                          {t.label}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Fixed elements info */}
                <div style={{
                  marginTop: 24, padding: 14, borderRadius: 12,
                  background: isDark ? 'rgba(255,255,255,0.04)' : '#F0F9FF',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#BAE6FD'}`,
                  display: 'flex', gap: 10, alignItems: 'flex-start'
                }}>
                  <Info size={15} color={isDark ? '#60a5fa' : '#0284C7'} style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 12, color: isDark ? '#60a5fa' : '#0369A1', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                    Nama, tanggal, waktu, dan lokasi dikunci sesuai info pesta. Edit melalui Dashboard utama.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── TEXT TAB ───────────────────────────────── */}
            {activeTab === 'text' && (
              <motion.div key="text" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <p style={{ fontSize: 13, color: isDark ? 'rgba(255,255,255,0.4)' : '#94a3b8', marginBottom: 20, lineHeight: 1.6, fontWeight: 500 }}>
                  Kustomisasi semua teks yang tampil di undangan. Preview akan diperbarui saat kamu mengetik.
                </p>

                <FieldGroup label="Teks Banner Atas (Welcome)" isDark={isDark}>
                  <StyledInput
                    value={texts.welcome}
                    onChange={(e: any) => setTexts({ ...texts, welcome: e.target.value })}
                    placeholder="Contoh: YOU ARE INVITED!"
                    isDark={isDark}
                  />
                </FieldGroup>

                <FieldGroup label="Subtitle / Keterangan" isDark={isDark}>
                  <StyledInput
                    value={texts.subtitle}
                    onChange={(e: any) => setTexts({ ...texts, subtitle: e.target.value })}
                    placeholder="Contoh: Ayo datang dan rayakan bersama..."
                    isDark={isDark}
                    multiline
                  />
                </FieldGroup>

                <FieldGroup label="Teks Tombol RSVP" isDark={isDark}>
                  <StyledInput
                    value={texts.rsvpButton}
                    onChange={(e: any) => setTexts({ ...texts, rsvpButton: e.target.value })}
                    placeholder="Contoh: RSVP Sekarang! 🎈"
                    isDark={isDark}
                  />
                </FieldGroup>

                <FieldGroup label="Pesan Penutup" isDark={isDark}>
                  <StyledInput
                    value={texts.closing}
                    onChange={(e: any) => setTexts({ ...texts, closing: e.target.value })}
                    placeholder="Contoh: Bring your biggest smile!"
                    isDark={isDark}
                  />
                </FieldGroup>

                {/* Reset to defaults */}
                <button
                  onClick={() => {
                    const defaults = defaultTexts[party.type as 'kids' | 'adult']
                    setTexts({ ...defaults })
                  }}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 12, border: `1px dashed ${isDark ? 'rgba(255,255,255,0.12)' : '#E2E8F0'}`,
                    background: 'transparent', color: isDark ? 'rgba(255,255,255,0.3)' : '#94a3b8',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                  }}
                >
                  <RefreshCw size={13} /> Reset ke Default
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Save Button */}
        <div style={{
          padding: '16px 20px 20px',
          borderTop: '1px solid #E2E8F0',
          background: '#FFFFFF'
        }}>          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.97 }}
            animate={saved ? { scale: [1, 1.03, 1] } : {}}
            style={{
              width: '100%',
              padding: '16px',
              // Fixed neutral gradient regardless of selected theme
              background: 'linear-gradient(135deg, #0F172A, #1E293B)',
              color: 'white',
              borderRadius: 16,
              fontWeight: 900,
              fontSize: 15,
              cursor: 'pointer',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: saved ? '0 8px 20px rgba(16,185,129,0.35)' : '0 8px 20px rgba(148,163,184,0.4)',
              transition: 'all 0.3s',
              letterSpacing: 0.3
            }}
          >
            {saved ? <><Check size={18} /> Tersimpan!</> : <><Save size={18} /> Simpan Perubahan</>}
          </motion.button>
        </div>
      </div>

      {/* ── RIGHT CANVAS ─────────────────────────────────────────────── */}
      <div className="editor-canvas-container" style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Dot grid background */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.4,
          backgroundImage: 'radial-gradient(#CBD5E1 2px, transparent 2px)',
          backgroundSize: '32px 32px'
        }} />

        {/* Subtle theme color wash */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          background: `radial-gradient(circle at 60% 40%, ${accentColor}, transparent 60%)`,
          pointerEvents: 'none', transition: 'background 0.6s'
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          {/* Live status bar */}
          <div className="live-status-bar" style={{
            background: '#1E293B', color: 'white', padding: '8px 20px', borderRadius: 100, fontSize: 12,
            fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981', animation: 'pulse 2s infinite' }} />
            Live Preview — {themesList.find(t => t.id === selectedTheme)?.label || 'Default'}
            <button
              onClick={() => setPreviewKey(k => k + 1)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '4px 10px', borderRadius: 100, color: '#94a3b8', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <RefreshCw size={11} /> Reset
            </button>
          </div>

          {/* Phone mockup — identical to dashboard overview */}
          <motion.div
            className="phone-mockup-wrapper"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
              width: 260, height: 520, background: '#0F172A', borderRadius: 44,
              padding: 10, boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
              position: 'relative', flexShrink: 0, border: '2px solid #334155'
            }}
          >
            {/* Notch */}
            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 70, height: 24, background: '#0F172A', borderRadius: 12, zIndex: 10 }} />
            {/* Screen */}
            <div style={{ width: '100%', height: '100%', background: 'white', borderRadius: 36, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {/* Same scale as dashboard: 375×800 → 240×500 ≈ 0.64 */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: 375, height: 800, transform: 'scale(0.64)', transformOrigin: 'top left' }}>
                {liveParty && <ThemeRenderer key={previewKey} party={liveParty} forceOpen={activeTab === 'text'} />}
              </div>
            </div>
            {/* Home indicator */}
            <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', width: 100, height: 5, background: 'rgba(255,255,255,0.5)', borderRadius: 10, zIndex: 10 }} />
          </motion.div>

          {/* Helper text */}
          <div className="helper-text" style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Eye size={14} /> Ini tampilan yang akan dilihat tamu saat membuka undangan
          </div>
        </div>
      </div>
    </div>
  )
}
