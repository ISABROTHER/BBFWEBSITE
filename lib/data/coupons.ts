import { Coupon } from '@/types'
import { useCatalogStore } from '@/store/catalog-store'

export const coupons: Coupon[] = [
  {
    id: 'coup1',
    code: 'NOVA10',
    type: 'percentage',
    value: 10,
    minOrder: 100,
    maxDiscount: 100,
    usageLimit: 500,
    usedCount: 120,
    expiresAt: '2025-12-31T23:59:59Z',
    isActive: true,
    description: '10% off on orders above $100',
  },
  {
    id: 'coup2',
    code: 'WELCOME50',
    type: 'fixed',
    value: 50,
    minOrder: 300,
    usageLimit: 100,
    usedCount: 45,
    expiresAt: '2025-06-30T23:59:59Z',
    isActive: true,
    description: '$50 off on orders above $300',
  },
  {
    id: 'coup3',
    code: 'FLASH15',
    type: 'percentage',
    value: 15,
    minOrder: 200,
    maxDiscount: 150,
    usageLimit: 200,
    usedCount: 67,
    expiresAt: '2025-03-31T23:59:59Z',
    isActive: true,
    description: '15% off flash sale discount',
  },
  {
    id: 'coup4',
    code: 'FREESHIP',
    type: 'fixed',
    value: 15,
    minOrder: 0,
    usageLimit: 1000,
    usedCount: 234,
    expiresAt: '2025-12-31T23:59:59Z',
    isActive: true,
    description: 'Free shipping on any order',
  },
]

function getCouponList(): Coupon[] {
  const { loaded, coupons: sbCoupons } = useCatalogStore.getState()
  return loaded && sbCoupons.length > 0 ? sbCoupons : coupons
}

export function validateCoupon(code: string, orderTotal: number): { valid: boolean; coupon?: Coupon; error?: string } {
  const coupon = getCouponList().find(c => c.code.toUpperCase() === code.toUpperCase())
  if (!coupon) return { valid: false, error: 'Invalid coupon code' }
  if (!coupon.isActive) return { valid: false, error: 'This coupon is no longer active' }
  if (new Date(coupon.expiresAt) < new Date()) return { valid: false, error: 'This coupon has expired' }
  if (coupon.usedCount >= coupon.usageLimit) return { valid: false, error: 'This coupon has reached its usage limit' }
  if (orderTotal < coupon.minOrder) return { valid: false, error: `Minimum order of $${coupon.minOrder} required` }
  return { valid: true, coupon }
}

export function calculateCouponDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.type === 'percentage') {
    const discount = (subtotal * coupon.value) / 100
    return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount
  }
  return coupon.value
}
