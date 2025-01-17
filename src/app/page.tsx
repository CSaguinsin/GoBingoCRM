// app/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CRMDashboard from "./crm-dashboard"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated (you'll need to implement this)
    const isAuthenticated = false // Replace with your auth check

    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [router])

  // Show loading or return dashboard based on auth state
  return <CRMDashboard />
}