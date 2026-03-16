'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Trash2, Plus, Minus, Tag, ArrowRight, Package, Truck } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cart-store'
import { validateCoupon } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import PriceBlock from '@/components/product/price-block'

export default function CartPage() {
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const {
    items, removeItem, updateQuantity, coupon, applyCoupon, removeCoupon,
    getSubtotal, getDiscount, getShipping, getTax, getTotal
  } = useCartStore()

  const subtotal = getSubtotal()
  const discount = getDiscount()
  const shipping = getShipping()
  const tax = getTax()
  const total = getTotal()

  function handleApplyCoupon() {
    setCouponError('')
    const result = validateCoupon(couponInput, subtotal)
    if (result.valid && result.coupon) {
      applyCoupon(result.coupon)
      toast.success('Coupon applied successfully!')
      setCouponInput('')
    } else {
      setCouponError(result.error || 'Invalid coupon')
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-20 section-container text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm mx-auto"
        >
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some amazing products to get started!</p>
          <Link href="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="section-container">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">
          Shopping Cart <span className="text-muted-foreground font-normal text-lg">({items.length} items)</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map((item) => {
                const itemPrice = item.salePrice ?? item.price
                return (
                  <motion.div
                    key={`${item.productId}-${item.variantId}`}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white rounded-2xl border border-border p-4 flex gap-4"
                  >
                    <Link href={`/product/${item.productId}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{item.brand}</p>
                      <Link href={`/product/${item.productId}`} className="font-semibold text-sm hover:text-foreground/70 transition-colors line-clamp-2 leading-snug">
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {item.storage && <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{item.storage}</span>}
                        {item.color && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: item.colorHex }} />
                            {item.color}
                          </span>
                        )}
                        {item.condition && item.condition !== 'new' && (
                          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full capitalize">{item.condition}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <PriceBlock price={item.price} salePrice={item.salePrice} size="sm" />
                          <button
                            onClick={() => { removeItem(item.productId, item.variantId); toast.success('Item removed') }}
                            className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
              <h2 className="font-bold text-lg">Order Summary</h2>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      {coupon?.code}
                    </span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    Shipping
                  </span>
                  <span className={`font-medium ${shipping === 0 ? 'text-emerald-600' : ''}`}>
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Tax</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-muted-foreground bg-secondary rounded-xl px-3 py-2">
                  Add {formatPrice(99 - subtotal)} more for free shipping
                </p>
              )}

              <div className="space-y-2">
                {coupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 rounded-xl px-3 py-2 text-sm">
                    <span className="font-semibold">{coupon.code} applied</span>
                    <button onClick={removeCoupon} className="text-xs underline hover:no-underline">Remove</button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                        placeholder="Coupon code"
                        className="flex-1 px-3 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                  </div>
                )}
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all text-sm active:scale-95"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link href="/shop" className="w-full flex items-center justify-center py-2.5 rounded-2xl text-sm text-muted-foreground hover:text-foreground transition-colors">
                Continue Shopping
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Secure & Safe</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                {['SSL Encrypted', 'No Account Needed', 'Easy Returns', '24/7 Support'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
