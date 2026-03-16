'use client'

import { useState } from 'react'
import { Plus, Tag, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminTopbar from '@/components/admin/admin-topbar'
import { coupons } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminPromotionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [couponList, setCouponList] = useState(coupons)

  function toggleCoupon(id: string) {
    setCouponList(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c))
    toast.success('Coupon updated')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} title="Promotions" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-lg">Coupons</h2>
              <p className="text-sm text-muted-foreground">{couponList.filter(c => c.isActive).length} active coupons</p>
            </div>
            <button onClick={() => toast.info('Add coupon form coming soon')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors">
              <Plus className="w-4 h-4" /> Add Coupon
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {couponList.map((coupon) => (
              <div key={coupon.id} className="bg-white rounded-2xl border border-border p-5">
                <div className="flex items-start justify-between mb-3">
                  <code className="text-lg font-bold font-mono">{coupon.code}</code>
                  <button onClick={() => toggleCoupon(coupon.id)}>
                    {coupon.isActive ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                  </button>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground mb-3">
                  <p className="font-medium text-foreground">{coupon.description}</p>
                  <p>Min order: ${coupon.minOrder}</p>
                  <p>Used: {coupon.usedCount} / {coupon.usageLimit}</p>
                  <p>Expires: {formatDate(coupon.expiresAt)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${coupon.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-foreground text-background px-2 py-1 rounded-full font-bold">
                    <Tag className="w-2.5 h-2.5" />
                    {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
