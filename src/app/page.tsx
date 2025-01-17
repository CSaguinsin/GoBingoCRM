'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CRMDashboard from "./crm-dashboard"
import { supabase } from '@/lib/supabase'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
      }
    }

    // Check initial session
    checkAuth()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login')
      }
    })

    // Cleanup subscription
    return () => subscription.unsubscribe()
  }, [router])

  return <CRMDashboard />
}