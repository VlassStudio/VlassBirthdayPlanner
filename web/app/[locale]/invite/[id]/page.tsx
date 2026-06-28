"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ThemeRenderer from '@/components/themes/ThemeRenderer'

export default function InvitePage() {
  const params = useParams()
  const id = params?.id

  const [party, setParty] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('glyka_parties') || localStorage.getItem('vlass_parties')
      if (stored) {
        const parties = JSON.parse(stored)
        const found = parties.find((p: any) => p.id === id || (p.customUrl && typeof id === 'string' && p.customUrl.toLowerCase() === id.toLowerCase()))
        if (found) {
          setParty(found)
        }
      }
      setLoading(false)
    }
  }, [id])

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', color: 'white' }}>Loading Invitation...</div>
  if (!party) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', color: 'white' }}>Invitation Not Found.</div>

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', overflow: 'hidden' }}>
      {/* Container constraint simulating mobile device viewport */}
      <div style={{ width: '100%', maxWidth: 420, height: '100%', position: 'relative', boxShadow: '0 0 50px rgba(0,0,0,0.5)', background: 'white' }}>
        <ThemeRenderer party={party} scale={1} />
      </div>
    </div>
  )
}
