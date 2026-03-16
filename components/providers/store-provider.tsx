'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/cart-store'
import { useUIStore } from '@/store/ui-store'
import { useAdminStore } from '@/store/admin-store'

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCartStore.persist.rehydrate()
    useUIStore.persist.rehydrate()
    useAdminStore.persist.rehydrate()
  }, [])

  return <>{children}</>
}
