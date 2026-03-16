'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, DollarSign, Package, Truck, TrendingUp, TriangleAlert as AlertTriangle, Users, ChartBar as BarChart3, ArrowRight, Eye } from 'lucide-react'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminTopbar from '@/components/admin/admin-topbar'
import StatsCard from '@/components/admin/stats-card'
import StatusBadge from '@/components/ui/status-badge'
import { getAllOrders } from '@/lib/data'
import { formatPrice, formatDateTime } from '@/lib/utils'

const revenueData = [
  { month: 'Sep', revenue: 42000 },
  { month: 'Oct', revenue: 58000 },
  { month: 'Nov', revenue: 75000 },
  { month: 'Dec', revenue: 92000 },
  { month: 'Jan', revenue: 68000 },
  { month: 'Feb', revenue: 83000 },
  { month: 'Mar', revenue: 91000 },
]

const topProducts = [
  { name: 'iPhone 15 Pro Max', sold: 234, revenue: 256866 },
  { name: 'Samsung Galaxy S24 Ultra', sold: 189, revenue: 226611 },
  { name: 'AirPods Pro 2nd Gen', sold: 456, revenue: 104424 },
  { name: 'Apple Watch Series 9', sold: 312, revenue: 118428 },
  { name: 'Google Pixel 8 Pro', sold: 178, revenue: 160022 },
]

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const orders = getAllOrders()

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue))

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} title="Dashboard" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Revenue" value="$2.4M" change="18.2%" positive icon={DollarSign} iconColor="bg-emerald-50 text-emerald-600" subtitle="This month" />
            <StatsCard title="Total Orders" value="1,847" change="12.5%" positive icon={ShoppingBag} iconColor="bg-blue-50 text-blue-600" subtitle="This month" />
            <StatsCard title="Pending Orders" value="23" change="5" icon={Package} iconColor="bg-amber-50 text-amber-600" subtitle="Need attention" />
            <StatsCard title="Delivered Today" value="89" change="8.3%" positive icon={Truck} iconColor="bg-sky-50 text-sky-600" subtitle="On time rate: 97%" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold">Revenue Overview</h2>
                  <p className="text-xs text-muted-foreground">Last 7 months</p>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold bg-emerald-50 px-3 py-1 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" />+18.2%
                </div>
              </div>
              <div className="flex items-end justify-between gap-2 h-40">
                {revenueData.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center" style={{ height: '120px' }}>
                      <div
                        className="w-full bg-foreground rounded-t-lg transition-all hover:bg-slate-700"
                        style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                        title={`$${d.revenue.toLocaleString()}`}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-bold mb-4">Order Status</h2>
              <div className="space-y-3">
                {[
                  { label: 'Delivered', count: 1234, pct: 67, color: 'bg-emerald-500' },
                  { label: 'Shipped', count: 312, pct: 17, color: 'bg-blue-500' },
                  { label: 'Processing', count: 189, pct: 10, color: 'bg-amber-500' },
                  { label: 'Pending', count: 112, pct: 6, color: 'bg-slate-300' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="font-medium">{s.count}</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Low Stock Alert</p>
                <div className="flex items-start gap-2 bg-amber-50 rounded-xl p-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">3 products running low. <Link href="/admin/inventory" className="font-semibold underline">View now</Link></p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">Recent Orders</h2>
                <Link href="/admin/orders" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center gap-3 text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    </div>
                    <StatusBadge type="order" status={order.status} />
                    <span className="font-semibold text-xs">{formatPrice(order.total)}</span>
                    <Link href={`/admin/orders/${order.id}`} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">Top Products</h2>
                <Link href="/admin/products" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.sold} sold</p>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(p.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
