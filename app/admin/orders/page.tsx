'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Eye, Download } from 'lucide-react'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminTopbar from '@/components/admin/admin-topbar'
import StatusBadge from '@/components/ui/status-badge'
import { getAllOrders } from '@/lib/data'
import { formatPrice, formatDateTime } from '@/lib/utils'

export default function AdminOrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const orders = getAllOrders()

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} title="Orders" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order, tracking, email..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    statusFilter === s ? 'bg-foreground text-background' : 'bg-white border border-border hover:border-slate-400'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Order</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase hidden sm:table-cell">Customer</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase hidden md:table-cell">Tracking</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Total</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase hidden lg:table-cell">Date</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs font-semibold">{order.orderNumber}</p>
                        <StatusBadge type="payment" status={order.paymentStatus} size="sm" />
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="font-medium text-sm">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                        <p className="text-xs text-muted-foreground">{order.shippingAddress.email}</p>
                      </td>
                      <td className="px-4 py-3"><StatusBadge type="order" status={order.status} /></td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <code className="text-xs bg-secondary px-2 py-1 rounded-lg">{order.trackingCode}</code>
                      </td>
                      <td className="px-4 py-3 font-semibold">{formatPrice(order.total)}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">{formatDateTime(order.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/orders/${order.id}`} className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
              {filtered.length} order{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
