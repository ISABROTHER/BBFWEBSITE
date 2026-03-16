'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdminStore } from '@/store/admin-store'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated)
  const checkSession = useAdminStore((s) => s.checkSession)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    useAdminStore.persist.rehydrate()
    checkSession().then(() => setHydrated(true))
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login')
    }
  }, [hydrated, isAuthenticated, pathname])

  if (!hydrated) return null

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null
  }

  return <>{children}</>
}
