'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { supabase } from '@/lib/supabase/client'

interface AdminState {
  isAuthenticated: boolean
  adminEmail: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}

const safeSessionStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null
    try { return sessionStorage.getItem(name) } catch { return null }
  },
  setItem: (name: string, value: string) => {
    if (typeof window === 'undefined') return
    try { sessionStorage.setItem(name, value) } catch {}
  },
  removeItem: (name: string) => {
    if (typeof window === 'undefined') return
    try { sessionStorage.removeItem(name) } catch {}
  },
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      adminEmail: null,

      login: async (email, password) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error || !data.user) return false
          const role = data.user.app_metadata?.role
          if (role !== 'admin') {
            await supabase.auth.signOut()
            return false
          }
          set({ isAuthenticated: true, adminEmail: email })
          return true
        } catch {
          return false
        }
      },

      logout: async () => {
        await supabase.auth.signOut()
        set({ isAuthenticated: false, adminEmail: null })
      },

      checkSession: async () => {
        try {
          const { data } = await supabase.auth.getSession()
          const user = data.session?.user
          if (user && user.app_metadata?.role === 'admin') {
            set({ isAuthenticated: true, adminEmail: user.email ?? null })
          } else {
            set({ isAuthenticated: false, adminEmail: null })
          }
        } catch {
          set({ isAuthenticated: false, adminEmail: null })
        }
      },
    }),
    {
      name: 'nova-admin',
      storage: createJSONStorage(() => safeSessionStorage),
      skipHydration: true,
    }
  )
)
