'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Package, Phone, Mail, Truck, CircleAlert as AlertCircle, ChevronRight } from 'lucide-react'
import { getOrderByTrackingCode } from '@/lib/data'
import { formatPrice, formatDate } from '@/lib/utils'
import TrackingTimeline from '@/components/ui/tracking-timeline'
import StatusBadge from '@/components/ui/status-badge'
import type { Order } from '@/types'

function TrackOrderContent() {
  const params = useSearchParams()
  const [trackingCode, setTrackingCode] = useState(params.get('code') || '')
  const [identifier, setIdentifier] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!trackingCode.trim() || !identifier.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)
    setSearched(false)
    const found = await getOrderByTrackingCode(trackingCode.trim(), identifier.trim())
    setLoading(false)
    setSearched(true)
    if (found) setOrder(found)
    else setError('No order found with this tracking code and email/phone. Please check your details.')
  }

  return (
    <div className="py-10 sm:py-16">
      <div className="section-container max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-7 h-7 text-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-muted-foreground text-sm">
            Enter your tracking code and email or phone to see real-time updates.
            <br />No account required.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Tracking Code *</label>
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                placeholder="e.g. NVM-2026-AB12CD"
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email or Phone Number *</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="john@example.com or +1 555-0123"
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-all disabled:opacity-60"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Search className="w-4 h-4" />
              )}
              {loading ? 'Searching...' : 'Track Order'}
            </motion.button>
          </form>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex gap-3">
          <Package className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-0.5">Demo Order</p>
            Try tracking code <code className="font-mono bg-white px-1 rounded">NVM-2026-AB12CD</code> with email <code className="font-mono bg-white px-1 rounded">john.doe@example.com</code>
          </div>
        </div>

        {error && searched && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 mb-6"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">{error}</p>
              <p className="text-xs text-red-500 mt-1">Check your tracking code and the email/phone used when ordering.</p>
            </div>
          </motion.div>
        )}

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl border border-border p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Order Number</p>
                  <p className="font-bold text-lg">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Placed {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusBadge type="order" status={order.status} size="md" />
                  <StatusBadge type="payment" status={order.paymentStatus} />
                </div>
              </div>

              {order.estimatedDelivery && (
                <div className="bg-blue-50 rounded-xl px-4 py-3 flex items-center gap-3 mb-5">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Estimated Delivery</p>
                    <p className="text-xs text-blue-600">{formatDate(order.estimatedDelivery)}</p>
                  </div>
                </div>
              )}

              <TrackingTimeline events={order.trackingEvents} currentStatus={order.status} />
            </div>

            {order.courierName && (
              <div className="bg-white rounded-2xl border border-border p-5">
                <h3 className="font-semibold mb-3">Shipping Details</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">Courier</p>
                    <p className="font-semibold">{order.courierName}</p>
                  </div>
                  {order.courierTrackingNumber && (
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground mb-0.5">Courier Tracking</p>
                      <p className="font-semibold font-mono text-sm">{order.courierTrackingNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.storage && `${item.storage} · `}{item.color && `${item.color} · `}Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold">{formatPrice(item.subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3 mt-3 border-t border-border flex justify-between font-bold">
                <span>Order Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold mb-3">Shipping Address</h3>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p className="font-medium text-foreground">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5">
              <h3 className="font-semibold mb-3">Need Help?</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="tel:+15550199" className="flex items-center gap-2.5 flex-1 bg-white rounded-xl px-4 py-3 hover:shadow-sm transition-shadow">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Call Us</p>
                    <p className="text-sm font-semibold">+1 (555) 019-9000</p>
                  </div>
                </a>
                <a href="mailto:support@novamobile.com" className="flex items-center gap-2.5 flex-1 bg-white rounded-xl px-4 py-3 hover:shadow-sm transition-shadow">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-semibold">support@novamobile.com</p>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <TrackOrderContent />
    </Suspense>
  )
}
