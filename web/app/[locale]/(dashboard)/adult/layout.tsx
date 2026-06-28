'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
  LayoutDashboard, Users, CheckSquare, Calendar, Gift,
  Palette, Settings, LogOut, Bell, Wallet, BarChart3,
  Music, ChevronRight, Crown, PartyPopper,
} from 'lucide-react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { MOCK_USER, MOCK_ADULT_EVENT } from '@/lib/mock-data'

const NAV = [
  { href: '/adult', icon: <LayoutDashboard size={17} />, label: 'Overview' },
  { href: '/adult/guests', icon: <Users size={17} />, label: 'Tamu & RSVP' },
  { href: '/adult/checklist', icon: <CheckSquare size={17} />, label: 'Checklist' },
  { href: '/adult/itinerary', icon: <Calendar size={17} />, label: 'Itinerary' },
  { href: '/adult/budget', icon: <Wallet size={17} />, label: 'Budget Tracker' },
  { href: '/adult/registry', icon: <Gift size={17} />, label: 'Gift Registry' },
  { href: '/adult/themes', icon: <Palette size={17} />, label: 'Themes' },
]

export default function AdultDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F1E' }}>
      {/* Sidebar */}
      <div style={{ width: 255, flexShrink: 0 }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', background: '#0D1225', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Logo */}
          <div style={{ padding: '28px 20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #C9A84C, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Crown size={18} color="#78350F" />
              </div>
              <span style={{ color: 'white', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>Party<span style={{ color: '#C9A84C' }}>Box</span></span>
            </div>

            {/* Event card */}
            <div style={{
              background: 'rgba(201,168,76,0.08)', borderRadius: 14, padding: '12px 14px',
              border: '1px solid rgba(201,168,76,0.2)',
            }}>
              <div style={{ color: '#E2E8F0', fontWeight: 600, fontSize: 13, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                🥂 {MOCK_ADULT_EVENT.event_title}
              </div>
              <div style={{ color: '#94A3B8', fontSize: 11 }}>
                📅 {new Date(MOCK_ADULT_EVENT.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div style={{ color: '#94A3B8', fontSize: 11, marginTop: 2 }}>📍 {MOCK_ADULT_EVENT.location_name}</div>
            </div>
          </div>

          {/* Hairline divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 20px' }} />

          {/* Nav */}
          <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 8 }}>Menu</div>
            {NAV.map(n => {
              const active = pathname === n.href || pathname.startsWith(n.href + '/')
              return (
                <Link key={n.href} href={n.href} style={{ textDecoration: 'none' }}>
                  <motion.div whileHover={{ x: 3 }} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                    borderRadius: 10, marginBottom: 2,
                    background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                    border: active ? '1px solid rgba(201,168,76,0.25)' : '1px solid transparent',
                    color: active ? '#C9A84C' : '#64748B',
                    fontWeight: active ? 600 : 400, fontSize: 13.5,
                    transition: 'all 0.15s',
                  }}>
                    <span style={{ color: active ? '#C9A84C' : '#475569' }}>{n.icon}</span>
                    {n.label}
                    {active && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                  </motion.div>
                </Link>
              )
            })}

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '12px 4px' }} />
            <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 8 }}>Pengaturan</div>
            {[
              { href: '/adult/settings', icon: <Settings size={17} />, label: 'Settings' },
            ].map(n => (
              <Link key={n.href} href={n.href} style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ x: 3 }} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                  borderRadius: 10, color: '#64748B', fontSize: 13.5,
                  border: '1px solid transparent',
                }}>
                  <span style={{ color: '#475569' }}>{n.icon}</span>
                  {n.label}
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* Bottom */}
          <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {MOCK_USER.subscription === 'free' && (
              <Link href="/pricing" style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ scale: 1.02 }} style={{
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(245,158,11,0.1))',
                  border: '1px solid rgba(201,168,76,0.3)', borderRadius: 12,
                  padding: '12px 14px', marginBottom: 12, cursor: 'pointer',
                }}>
                  <div style={{ color: '#C9A84C', fontWeight: 700, fontSize: 13, marginBottom: 2 }}>👑 Upgrade ke Premium</div>
                  <div style={{ color: '#94A3B8', fontSize: 11 }}>Unlock all features</div>
                </motion.div>
              </Link>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #C9A84C, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
                {MOCK_USER.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{MOCK_USER.full_name}</div>
                <div style={{ fontSize: 11, color: '#475569' }}>Free Plan</div>
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar — Apple-like thin bar */}
        <div style={{
          height: 56, background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🥂</span>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#C9A84C', letterSpacing: '0.02em' }}>Adult Birthday Mode</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LanguageSwitcher currentLocale={useLocale()} variant="dropdown" />
            <Link href="/kids" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 13px', borderRadius: 8, fontSize: 12, fontWeight: 500,
              background: 'rgba(255,255,255,0.06)', color: '#94A3B8', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>🧒 Mode Anak</Link>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
              <Bell size={19} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 7, height: 7, background: '#C9A84C', borderRadius: '50%' }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '28px 32px', overflow: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
