'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdminStore } from '@/store/admin-store'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login')
    }
  }, [isAuthenticated, pathname, router])

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null
  }

  return <>{children}</>
}
