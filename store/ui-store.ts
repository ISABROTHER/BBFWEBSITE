'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UIState {
  recentlyViewed: string[]
  recentSearches: string[]
  wishlist: string[]
  addRecentlyViewed: (productId: string) => void
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
}

const safeLocalStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null
    try { return localStorage.getItem(name) } catch { return null }
  },
  setItem: (name: string, value: string) => {
    if (typeof window === 'undefined') return
    try { localStorage.setItem(name, value) } catch {}
  },
  removeItem: (name: string) => {
    if (typeof window === 'undefined') return
    try { localStorage.removeItem(name) } catch {}
  },
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      recentlyViewed: [],
      recentSearches: [],
      wishlist: [],

      addRecentlyViewed: (productId) => {
        set((state) => {
          const filtered = state.recentlyViewed.filter((id) => id !== productId)
          return { recentlyViewed: [productId, ...filtered].slice(0, 10) }
        })
      },

      addRecentSearch: (query) => {
        if (!query.trim()) return
        set((state) => {
          const filtered = state.recentSearches.filter((q) => q !== query)
          return { recentSearches: [query, ...filtered].slice(0, 8) }
        })
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.wishlist.includes(productId)
          return {
            wishlist: exists
              ? state.wishlist.filter((id) => id !== productId)
              : [...state.wishlist, productId],
          }
        })
      },

      isWishlisted: (productId) => {
        return get().wishlist.includes(productId)
      },
    }),
    {
      name: 'nova-ui',
      storage: createJSONStorage(() => safeLocalStorage),
      skipHydration: true,
    }
  )
)
