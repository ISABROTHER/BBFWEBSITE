'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminTopbar from '@/components/admin/admin-topbar'
import StatusBadge from '@/components/ui/status-badge'
import TrackingTimeline from '@/components/ui/tracking-timeline'
import { getOrderById } from '@/lib/data'
import { formatPrice, formatDateTime, copyToClipboard } from '@/lib/utils'
import { toast } from 'sonner'
import type { Order, OrderStatus } from '@/types'

const orderStatuses: OrderStatus[] = ['pending', 'payment_confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered']

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [trackingCopied, setTrackingCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getOrderById(params.id).then(data => {
      if (!data) router.replace('/admin/orders')
      else setOrder(data)
      setLoading(false)
    })
  }, [params.id])

  async function handleCopyTracking() {
    if (!order) return
    await copyToClipboard(order.trackingCode)
    setTrackingCopied(true)
    toast.success('Tracking code copied!')
    setTimeout(() => setTrackingCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminTopbar onMenuClick={() => setSidebarOpen(true)} title="Order" />
          <main className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Loading...</main>
        </div>
      </div>
    )
  }

  if (!order) return null

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} title={`Order ${order.orderNumber}`} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/admin/orders" className="p-2 rounded-xl hover:bg-white border border-border transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex-1">
              <h1 className="font-bold">{order.orderNumber}</h1>
              <p className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</p>
            </div>
            <StatusBadge type="order" status={order.status} size="md" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-border p-5">
                <h2 className="font-bold mb-4">Order Items</h2>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.storage} · {item.color} · Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold mt-1">{formatPrice(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 mt-4 border-t border-border space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                  {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
                  <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-border"><span>Total</span><span>{formatPrice(order.total)}</span></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border p-5">
                <h2 className="font-bold mb-4">Tracking Timeline</h2>
                <TrackingTimeline events={order.trackingEvents} currentStatus={order.status} />
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-border p-5">
                <h2 className="font-bold mb-3">Tracking Code</h2>
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3">
                  <code className="flex-1 font-mono text-sm font-bold">{order.trackingCode}</code>
                  <button onClick={handleCopyTracking} className={`p-1.5 rounded-lg transition-all ${trackingCopied ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-secondary text-muted-foreground'}`}>
                    {trackingCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border p-5">
                <h2 className="font-bold mb-3">Customer</h2>
                <p className="font-medium text-sm">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress.email}</p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
              </div>

              <div className="bg-white rounded-2xl border border-border p-5">
                <h2 className="font-bold mb-3">Shipping Address</h2>
                <div className="text-sm text-muted-foreground space-y-0.5">
                  <p>{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border p-5">
                <h2 className="font-bold mb-3">Payment</h2>
                <p className="text-sm">{order.paymentMethod.label}</p>
                <StatusBadge type="payment" status={order.paymentStatus} size="md" />
                {order.couponCode && <p className="text-xs text-muted-foreground mt-2">Coupon: <code className="font-mono">{order.couponCode}</code></p>}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
