'use client'

import { useState } from 'react'
import { TrendingUp, ShoppingBag, Users, DollarSign, ChartBar as BarChart3 } from 'lucide-react'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminTopbar from '@/components/admin/admin-topbar'
import StatsCard from '@/components/admin/stats-card'
import { formatPrice } from '@/lib/utils'

const monthlyData = [
  { month: 'Sep', orders: 198, revenue: 42000 },
  { month: 'Oct', orders: 267, revenue: 58000 },
  { month: 'Nov', orders: 341, revenue: 75000 },
  { month: 'Dec', orders: 428, revenue: 92000 },
  { month: 'Jan', orders: 312, revenue: 68000 },
  { month: 'Feb', orders: 389, revenue: 83000 },
  { month: 'Mar', orders: 421, revenue: 91000 },
]

export default function AdminAnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue))

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} title="Analytics" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Revenue" value="$509K" change="18.2%" positive icon={DollarSign} iconColor="bg-emerald-50 text-emerald-600" />
            <StatsCard title="Total Orders" value="2,356" change="12.5%" positive icon={ShoppingBag} iconColor="bg-blue-50 text-blue-600" />
            <StatsCard title="Avg Order Value" value="$215.80" change="4.2%" positive icon={TrendingUp} iconColor="bg-amber-50 text-amber-600" />
            <StatsCard title="Customer Visits" value="48.2K" change="22.1%" positive icon={Users} iconColor="bg-sky-50 text-sky-600" />
          </div>

          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-bold mb-5 flex items-center gap-2"><BarChart3 className="w-5 h-5" />Monthly Revenue</h2>
            <div className="flex items-end justify-between gap-2" style={{ height: '180px' }}>
              {monthlyData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <p className="text-[10px] font-semibold text-muted-foreground">{formatPrice(d.revenue).replace('$', '$').replace(',000', 'K')}</p>
                  <div className="w-full flex items-end justify-center" style={{ height: '140px' }}>
                    <div className="w-full bg-foreground rounded-t-lg hover:bg-slate-700 transition-colors cursor-default" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-bold mb-4">Top Categories</h2>
              <div className="space-y-3">
                {[
                  { name: 'iPhones', revenue: 189000, pct: 37 },
                  { name: 'Android Phones', revenue: 142000, pct: 28 },
                  { name: 'Accessories', revenue: 87000, pct: 17 },
                  { name: 'Tablets', revenue: 61000, pct: 12 },
                  { name: 'Wearables', revenue: 30000, pct: 6 },
                ].map((cat) => (
                  <div key={cat.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-muted-foreground">{formatPrice(cat.revenue)} · {cat.pct}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-foreground rounded-full" style={{ width: `${cat.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-bold mb-4">Conversion Funnel</h2>
              <div className="space-y-3">
                {[
                  { stage: 'Visitors', count: '48,200', pct: 100 },
                  { stage: 'Product Views', count: '32,100', pct: 67 },
                  { stage: 'Add to Cart', count: '8,400', pct: 17 },
                  { stage: 'Checkout Started', count: '4,200', pct: 9 },
                  { stage: 'Orders Placed', count: '2,356', pct: 5 },
                ].map((s) => (
                  <div key={s.stage} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{s.stage}</span>
                        <span className="text-muted-foreground">{s.count}</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-foreground rounded-full" style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground w-8">{s.pct}%</span>
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
