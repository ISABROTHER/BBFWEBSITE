'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItem, Coupon } from '@/types'
import { calculateCouponDiscount } from '@/lib/data'

interface CartState {
  items: CartItem[]
  coupon: Coupon | null
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (coupon: Coupon) => void
  removeCoupon: () => void
  getItemCount: () => number
  getSubtotal: () => number
  getDiscount: () => number
  getShipping: () => number
  getTax: () => number
  getTotal: () => number
}

const SHIPPING_FEE = 15
const FREE_SHIPPING_THRESHOLD = 99
const TAX_RATE = 0.08

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === newItem.productId && i.variantId === newItem.variantId
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === newItem.productId && i.variantId === newItem.variantId
                  ? { ...i, quantity: Math.min(i.quantity + newItem.quantity, i.stock) }
                  : i
              ),
            }
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        }))
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: Math.min(quantity, i.stock) }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),

      removeCoupon: () => set({ coupon: null }),

      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((sum, i) => {
          const price = i.salePrice ?? i.price
          return sum + price * i.quantity
        }, 0)
      },

      getDiscount: () => {
        const { coupon } = get()
        if (!coupon) return 0
        return calculateCouponDiscount(coupon, get().getSubtotal())
      },

      getShipping: () => {
        const subtotal = get().getSubtotal()
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
      },

      getTax: () => {
        const subtotal = get().getSubtotal()
        const discount = get().getDiscount()
        return (subtotal - discount) * TAX_RATE
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const discount = get().getDiscount()
        const shipping = get().getShipping()
        const tax = get().getTax()
        return subtotal - discount + shipping + tax
      },
    }),
    {
      name: 'nova-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
