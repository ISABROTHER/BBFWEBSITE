'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminTopbar from '@/components/admin/admin-topbar'
import { toast } from 'sonner'
import { categories, brands } from '@/lib/data'

export default function NewProductPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', brand: '', categoryId: '', basePrice: '', baseSalePrice: '',
    shortDescription: '', description: '', stock: '', isVisible: true,
    isFeatured: false, isNew: true, isBestseller: false,
  })

  const update = (key: string, val: unknown) => setForm(p => ({ ...p, [key]: val }))

  async function handleSave() {
    if (!form.name || !form.brand || !form.basePrice) {
      toast.error('Fill in all required fields')
      return
    }
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    toast.success('Product saved successfully!')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} title="New Product" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/admin/products" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back to Products
            </Link>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-60">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-border p-5">
                <h2 className="font-bold mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Product Name *</label>
                    <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. iPhone 15 Pro Max" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Brand *</label>
                      <select value={form.brand} onChange={e => update('brand', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none bg-white">
                        <option value="">Select brand</option>
                        {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Category *</label>
                      <select value={form.categoryId} onChange={e => update('categoryId', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none bg-white">
                        <option value="">Select category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Short Description</label>
                    <input value={form.shortDescription} onChange={e => update('shortDescription', e.target.value)} placeholder="Brief product summary" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Full Description</label>
                    <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={5} placeholder="Detailed product description..." className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border p-5">
                <h2 className="font-bold mb-4">Pricing & Stock</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Base Price ($) *</label>
                    <input type="number" value={form.basePrice} onChange={e => update('basePrice', e.target.value)} placeholder="999.00" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Sale Price ($)</label>
                    <input type="number" value={form.baseSalePrice} onChange={e => update('baseSalePrice', e.target.value)} placeholder="899.00" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Stock Qty</label>
                    <input type="number" value={form.stock} onChange={e => update('stock', e.target.value)} placeholder="50" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border p-5">
                <h2 className="font-bold mb-4">Product Images</h2>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                  <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium text-sm mb-1">Upload product images</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB each</p>
                  <button className="mt-4 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors">
                    Choose Files
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-border p-5">
                <h2 className="font-bold mb-4">Product Flags</h2>
                <div className="space-y-3">
                  {[
                    { key: 'isVisible', label: 'Visible on Store' },
                    { key: 'isFeatured', label: 'Featured Product' },
                    { key: 'isNew', label: 'New Arrival' },
                    { key: 'isBestseller', label: 'Bestseller' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-medium">{label}</span>
                      <button
                        type="button"
                        onClick={() => update(key, !(form as Record<string, unknown>)[key])}
                        className={`relative w-10 h-5 rounded-full transition-colors ${(form as Record<string, unknown>)[key] ? 'bg-foreground' : 'bg-slate-200'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${(form as Record<string, unknown>)[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Note</p>
                <p className="text-xs">In a production environment, product variants (storage, color, condition) would be configured here. This form is a UI prototype.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
