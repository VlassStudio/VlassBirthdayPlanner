'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
  LayoutDashboard, Users, CheckSquare, Calendar, Gift,
  Palette, Settings, LogOut, Bell, PartyPopper, ChevronRight,
  Menu, X,
} from 'lucide-react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { MOCK_USER, MOCK_KIDS_EVENT } from '@/lib/mock-data'

const NAV = [
  { href: '/kids', icon: <LayoutDashboard size={18} />, label: 'Dasbor' },
  { href: '/kids/guests', icon: <Users size={18} />, label: 'Tamu & RSVP' },
  { href: '/kids/checklist', icon: <CheckSquare size={18} />, label: 'Checklist' },
  { href: '/kids/itinerary', icon: <Calendar size={18} />, label: 'Jadwal Hari H' },
  { href: '/kids/registry', icon: <Gift size={18} />, label: 'Daftar Hadiah' },
  { href: '/kids/themes', icon: <Palette size={18} />, label: 'Tema' },
]

const COLORS = {
  primary: '#EC4899',
  secondary: '#8B5CF6',
  accent: '#FCD34D',
  bg: '#FFF5FB',
  surface: '#FFFFFF',
  text: '#1F0A12',
  muted: '#9F6B7E',
}

export default function KidsDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const Sidebar = () => (
    <div style={{
      width: 260, height: '100vh', background: COLORS.bg,
      borderRight: `2px solid rgba(236,72,153,0.15)`,
      display: 'flex', flexDirection: 'column', padding: '0',
      position: 'relative', flexShrink: 0,
    }}>
      {/* Fun top header */}
      <div style={{
        padding: '24px 20px 20px',
        background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative bubbles */}
        {[{t:'10%',l:'75%',s:60},{t:'60%',l:'80%',s:40},{t:'-10%',l:'50%',s:50}].map((b,i)=>(
          <div key={i} style={{ position:'absolute', top:b.t, left:b.l, width:b.s, height:b.s, borderRadius:'50%', background:'rgba(255,255,255,0.12)' }} />
        ))}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <PartyPopper size={20} color="white" />
            <span style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>Party<span style={{ opacity: 0.8 }}>Box</span></span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 12, padding: '10px 12px' }}>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>🦄 {MOCK_KIDS_EVENT.event_title}</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>📅 {new Date(MOCK_KIDS_EVENT.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {NAV.map(n => {
          const active = pathname === n.href || pathname.startsWith(n.href + '/')
          return (
            <Link key={n.href} href={n.href} style={{ textDecoration: 'none' }}>
              <motion.div whileHover={{ x: 4 }} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                borderRadius: 12, marginBottom: 4,
                background: active ? 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(139,92,246,0.15))' : 'transparent',
                border: active ? '1.5px solid rgba(236,72,153,0.3)' : '1.5px solid transparent',
                color: active ? COLORS.primary : COLORS.muted,
                fontWeight: active ? 700 : 500, fontSize: 14,
              }}>
                {n.icon}
                {n.label}
                {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* User + Upgrade */}
      <div style={{ padding: '16px 12px', borderTop: '2px dashed rgba(236,72,153,0.2)' }}>
        {MOCK_USER.subscription === 'free' && (
          <Link href="/pricing" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.02 }} style={{
              background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
              borderRadius: 14, padding: '12px 14px', marginBottom: 12, cursor: 'pointer',
            }}>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 2 }}>✨ Upgrade ke Premium</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>Buka semua fitur keren!</div>
            </motion.div>
          </Link>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
            {MOCK_USER.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{MOCK_USER.full_name}</div>
            <div style={{ fontSize: 11, color: COLORS.muted }}>Paket Gratis</div>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted, padding: 4 }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.bg }}>
      {/* Desktop Sidebar */}
      <div style={{ display: 'none' }} className="sidebar-desktop">
        <Sidebar />
      </div>
      <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.bg, width: '100%' }}>
        {/* Sidebar always visible on large screens */}
        <div style={{ width: 260, flexShrink: 0 }}>
          <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
            <Sidebar />
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Topbar */}
          <div style={{
            height: 60, background: 'white', borderBottom: '2px solid rgba(236,72,153,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px', position: 'sticky', top: 0, zIndex: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🧒</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.primary }}>Mode Pesta Anak</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <LanguageSwitcher currentLocale={useLocale()} variant="pill" />
              <Link href="/adult" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                background: '#EEF2FF', color: '#4F46E5', textDecoration: 'none',
              }}>🥂 Mode Dewasa</Link>
              <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted }}>
                <Bell size={20} />
                <div style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, background: '#EF4444', borderRadius: '50%', border: '2px solid white' }} />
              </button>
            </div>
          </div>

          {/* Page content */}
          <div style={{ flex: 1, padding: '28px 28px', overflow: 'auto' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
