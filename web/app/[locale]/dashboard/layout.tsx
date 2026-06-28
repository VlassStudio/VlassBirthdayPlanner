'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import {
  LayoutDashboard, Users, CheckSquare, Calculator,
  Settings, LogOut, Menu, PartyPopper, Bell,
  Search, X, FolderOpen, Palette, Calendar, MessageSquareHeart
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false)
  const [parties, setParties] = useState<any[]>([])
  const [activePartyId, setActivePartyId] = useState<string | null>(null)

  const activeParty = parties.find(p => p.id === activePartyId)

  const isListView = searchParams.get('view') === 'list' || activePartyId === null

  // Notification and Toast State
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' })
  const [allGuests, setAllGuests] = useState<any[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedParties = localStorage.getItem('vlass_parties')
      if (savedParties) setParties(JSON.parse(savedParties))

      const activeId = localStorage.getItem('vlass_active_party_id')
      setActivePartyId(activeId)

      const savedGuests = localStorage.getItem('vlass_guests')
      if (savedGuests) setAllGuests(JSON.parse(savedGuests))

      // Listen for custom event when parties change in other components
      const handleStorageChange = () => {
        const p = localStorage.getItem('vlass_parties')
        if (p) setParties(JSON.parse(p))
        const aId = localStorage.getItem('vlass_active_party_id')
        setActivePartyId(aId)
      }

      const handleGuestsUpdate = () => {
        const g = localStorage.getItem('vlass_guests')
        if (g) setAllGuests(JSON.parse(g))
      }

      const handleToast = (e: Event) => {
        const detail = (e as CustomEvent).detail
        setToast({ show: true, message: detail?.message || '' })
        setTimeout(() => setToast({ show: false, message: '' }), 3500)
      }

      window.addEventListener('partyUpdated', handleStorageChange)
      window.addEventListener('guestsUpdated', handleGuestsUpdate)
      window.addEventListener('showToast', handleToast)
      return () => {
        window.removeEventListener('partyUpdated', handleStorageChange)
        window.removeEventListener('guestsUpdated', handleGuestsUpdate)
        window.removeEventListener('showToast', handleToast)
      }
    }
  }, [])

  const navItems = [
    { href: `/dashboard`, icon: LayoutDashboard, label: 'Ringkasan' },
    { href: `/dashboard/guests`, icon: Users, label: 'Tamu & RSVP' },
    { href: `/dashboard/checklist`, icon: CheckSquare, label: 'To-Do List' },
    { href: `/dashboard/rundown`, icon: Calendar, label: 'Rundown' },
    { href: `/dashboard/wishes`, icon: MessageSquareHeart, label: 'Ucapan Tamu' },
    { href: `/dashboard/budget`, icon: Calculator, label: 'Anggaran' },
    { href: `/editor/${activePartyId}`, icon: Palette, label: 'Visual Builder', isExternal: true },
    { href: `/dashboard/settings`, icon: Settings, label: 'Pengaturan' }
  ]

  const isActive = (href: string) => {
    // Exact match for dashboard, prefix match for others
    if (href === '/dashboard' || href === `/dashboard`) {
      return (pathname === `/${locale}/dashboard` || pathname === '/dashboard') && activePartyId !== null && !isListView
    }
    return pathname.includes(href)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F8FAFC' }}>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay hide-on-desktop"
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.4)', zIndex: 40, backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside style={{
        width: 260, background: 'white', borderRight: '1px solid #E2E8F0',
        display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh',
        zIndex: 50
      }} className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>

        {/* Mobile Close Button */}
        <button
          className="hide-on-desktop"
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', zIndex: 60 }}
        >
          <X size={24} color="#64748B" />
        </button>

        {/* Logo */}
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #FF3366, #FF9933)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <PartyPopper size={20} color="white" />
          </div>
          <span style={{ fontWeight: 900, fontSize: 20, color: '#0F172A', letterSpacing: '-0.03em' }}>Glyka Party box</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginLeft: 6 }}></span>
        </div>

        {/* Event Switcher */}
        <div style={{ padding: '0 16px', marginTop: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, paddingLeft: 12 }}>Pesta Aktif</p>
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 12, border: '1.5px solid #E2E8F0',
                background: '#F8FAFC', color: '#0F172A', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s'
              }}
            >
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: 6 }}>
                {activeParty ? (
                  <>
                    {activeParty.type === 'adult' ? '🥂' : '🧒'} {activeParty.name} {activeParty.tier === 'pro' && '👑'}
                  </>
                ) : '-- Pilih Pesta --'}
              </span>
              <span style={{ color: '#64748B', fontSize: 10, transform: isSwitcherOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'all 0.2s' }}>▼</span>
            </div>

            <AnimatePresence>
              {isSwitcherOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8,
                    background: 'white', border: '1px solid #E2E8F0', borderRadius: 12,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)', zIndex: 50, overflow: 'hidden'
                  }}
                >
                  <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                    {parties.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('vlass_active_party_id', p.id)
                            window.dispatchEvent(new Event('partyUpdated'))
                            router.push(`/${locale}/dashboard`)
                            setIsSwitcherOpen(false)
                          }
                        }}
                        style={{ padding: '12px 16px', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: p.id === activePartyId ? '#FF3366' : '#334155', borderBottom: '1px solid #F1F5F9', background: p.id === activePartyId ? '#FFF1F2' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {p.type === 'adult' ? '🥂' : '🧒'} {p.name} {p.tier === 'pro' && '👑'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    onClick={() => {
                      setIsSwitcherOpen(false)
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('vlass_active_party_id')
                        window.dispatchEvent(new Event('partyUpdated'))
                        router.push(`/${locale}/dashboard?action=create`)
                      }
                    }}
                    style={{ padding: '12px 16px', cursor: 'pointer', fontSize: 14, fontWeight: 800, color: '#FF3366', background: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    + Buat Pesta Baru
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '0 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4, marginTop: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 12px 4px 12px' }}>Workspace</p>
          {/* Daftar Pesta Nav Item */}
          <div
            onClick={() => {
              if (typeof window !== 'undefined') {
                router.push(`/${locale}/dashboard?view=list`)
              }
            }}
            style={{ textDecoration: 'none' }}
          >
            <motion.div
              whileHover={{ backgroundColor: isListView ? '#FFF1F2' : '#F1F5F9' }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px',
                borderRadius: 8, cursor: 'pointer',
                background: isListView ? '#FFF1F2' : 'transparent',
                color: isListView ? '#E11D48' : '#64748B',
                fontWeight: isListView ? 700 : 600,
                fontSize: 14, fontFamily: 'var(--font-jakarta)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <FolderOpen size={18} />
                Daftar Pesta
              </div>
              <span style={{
                background: isListView ? '#FF3366' : '#E2E8F0',
                color: isListView ? 'white' : '#64748B',
                fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 10
              }}>
                {parties.length}
              </span>
            </motion.div>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon
            const disabled = activePartyId === null
            const active = !disabled && isActive(item.href)

            const content = (
              <motion.div
                whileHover={disabled ? {} : { backgroundColor: active ? '#FFF1F2' : '#F1F5F9' }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px',
                  borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
                  background: active ? '#FFF1F2' : 'transparent',
                  color: active ? '#E11D48' : disabled ? '#94A3B8' : '#64748B',
                  fontWeight: active ? 700 : 600,
                  fontSize: 14, fontFamily: 'var(--font-jakarta)',
                  opacity: disabled ? 0.55 : 1,
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon size={18} />
                  {item.label}
                </div>
                {disabled && (
                  <span style={{ fontSize: 10, opacity: 0.7 }}>🔒</span>
                )}
              </motion.div>
            )

            if (disabled) {
              return (
                <div key={item.href} title="Pilih pesta aktif terlebih dahulu" onClick={() => alert('Silakan pilih salah satu pesta aktif di switcher atau Daftar Pesta terlebih dahulu!')}>
                  {content}
                </div>
              )
            }

            return (
              <Link key={item.href} href={`/${locale}${item.href}`} style={{ textDecoration: 'none' }} onClick={() => setSidebarOpen(false)}>
                {content}
              </Link>
            )
          })}
        </nav>

        {/* Bottom User Area */}
        <div style={{ padding: 16, borderTop: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 4px', cursor: 'pointer' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#64748B' }}>
              M
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0F172A' }}>My Account</p>
              <p style={{ margin: 0, fontSize: 11, color: '#64748B', fontWeight: 500 }}>Vlass User</p>
            </div>
            <button onClick={() => window.location.href = '/login'} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
              <LogOut size={16} color="#94A3B8" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Topbar */}
        <header style={{
          height: 64, background: 'white', borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
          position: 'sticky', top: 0, zIndex: 30
        }}>
          {/* Mobile Menu Button (hidden on desktop) */}
          <button className="show-on-mobile" onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
            <Menu size={24} color="#0F172A" />
          </button>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F1F5F9', padding: '8px 16px', borderRadius: 100, width: 300 }} className="topbar-search">
            <Search size={16} color="#94A3B8" />
            <input type="text" placeholder="Search guests, tasks..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, fontFamily: 'var(--font-jakarta)', width: '100%', color: '#0F172A' }} />
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotificationPopup(!showNotificationPopup)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', padding: 4 }}
              >
                <Bell size={20} color="#64748B" />
                {allGuests.filter((g: any) => g.party_id === activePartyId).length > 0 && (
                  <div style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, background: '#E11D48', borderRadius: '50%' }} />
                )}
              </button>

              <AnimatePresence>
                {showNotificationPopup && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: 12,
                      width: 320,
                      background: 'white',
                      borderRadius: 16,
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      zIndex: 100,
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: 14, color: '#0F172A' }}>Notifikasi RSVP</span>
                      <button
                        onClick={() => setShowNotificationPopup(false)}
                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                      >
                        Tutup
                      </button>
                    </div>
                    <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                      {(() => {
                        const partyGuests = allGuests
                          .filter((g: any) => g.party_id === activePartyId)
                          .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
                        if (partyGuests.length === 0) {
                          return (
                            <div style={{ padding: '24px 20px', textAlign: 'center', color: '#94A3B8', fontSize: 13, fontWeight: 500 }}>
                              Belum ada konfirmasi RSVP masuk.
                            </div>
                          );
                        }
                        return partyGuests.map((g: any) => (
                          <div key={g.id} style={{ padding: '12px 20px', borderBottom: '1px solid #F8FAFC', fontSize: 13, color: '#334155' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontWeight: 800, color: '#0F172A' }}>{g.guest_name}</span>
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: 100,
                                fontSize: 10,
                                fontWeight: 800,
                                background: g.status === 'attending' ? '#DCFCE7' : '#FEE2E2',
                                color: g.status === 'attending' ? '#15803D' : '#B91C1C'
                              }}>
                                {g.status === 'attending' ? 'Hadir' : 'Absen'}
                              </span>
                            </div>
                            <div style={{ fontSize: 11, color: '#94A3B8' }}>
                              {g.num_adults || 0} Dewasa • {g.num_children || 0} Anak
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div style={{ width: 1, height: 24, background: '#E2E8F0' }} />
            <button onClick={() => {
              if (activePartyId) {
                if (typeof navigator !== 'undefined') {
                  navigator.clipboard.writeText(`${window.location.origin}/invite/${activePartyId}`);
                  window.dispatchEvent(new CustomEvent('showToast', { detail: { message: '📋 Link undangan berhasil disalin ke clipboard!' } }));
                }
              } else {
                alert('Silakan pilih salah satu pesta aktif terlebih dahulu!');
              }
            }} style={{ background: 'linear-gradient(135deg, #FF3366, #FF9933)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>
              Bagikan Undangan
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="dashboard-content-area" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: '#0F172A',
              color: 'white',
              padding: '16px 24px',
              borderRadius: 16,
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              zIndex: 9999,
              fontWeight: 800,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Styles for Mobile */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-on-desktop { display: none; }
        
        @media (max-width: 768px) {
          .hide-on-desktop { display: block; }
          .mobile-menu-btn { display: block !important; }
          .topbar-search { display: none !important; }
          
          .sidebar-container {
            position: fixed !important;
            left: -260px;
            transition: left 0.3s ease;
          }
          .sidebar-container.open {
            left: 0;
          }
        }
      `}} />
    </div>
  )
}
