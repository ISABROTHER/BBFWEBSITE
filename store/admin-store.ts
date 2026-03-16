'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AdminState {
  isAuthenticated: boolean
  adminEmail: string | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

const ADMIN_CREDENTIALS = {
  email: 'admin@novamobile.com',
  password: 'admin123',
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      adminEmail: null,

      login: (email, password) => {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          set({ isAuthenticated: true, adminEmail: email })
          return true
        }
        return false
      },

      logout: () => set({ isAuthenticated: false, adminEmail: null }),
    }),
    {
      name: 'nova-admin',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
