'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminTopbar from '@/components/admin/admin-topbar'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    storeName: 'NovaMobile',
    tagline: 'Premium Phones & Accessories',
    email: 'hello@novamobile.com',
    phone: '+1 (555) 019-9000',
    address: '123 Tech Ave, New York, NY 10001',
    currency: 'USD',
    shippingFee: '15',
    freeShippingThreshold: '99',
    taxRate: '8',
    instagram: '',
    twitter: '',
    facebook: '',
    whatsapp: '',
  })

  const update = (key: string, val: string) => setSettings(p => ({ ...p, [key]: val }))

  async function handleSave() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    toast.success('Settings saved successfully!')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} title="Settings" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-2xl space-y-6">
            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-bold mb-4">Store Information</h2>
              <div className="space-y-4">
                {[
                  { key: 'storeName', label: 'Store Name', placeholder: 'NovaMobile' },
                  { key: 'tagline', label: 'Tagline', placeholder: 'Premium Phones & Accessories' },
                  { key: 'email', label: 'Contact Email', placeholder: 'hello@store.com' },
                  { key: 'phone', label: 'Phone Number', placeholder: '+1 555-000-0000' },
                  { key: 'address', label: 'Address', placeholder: '123 Main St' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="text-sm font-medium mb-1.5 block">{label}</label>
                    <input value={(settings as Record<string, string>)[key]} onChange={e => update(key, e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-bold mb-4">Shipping & Tax</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { key: 'shippingFee', label: 'Shipping Fee ($)' },
                  { key: 'freeShippingThreshold', label: 'Free Shipping Above ($)' },
                  { key: 'taxRate', label: 'Tax Rate (%)' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-sm font-medium mb-1.5 block">{label}</label>
                    <input type="number" value={(settings as Record<string, string>)[key]} onChange={e => update(key, e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-bold mb-4">Social Links</h2>
              <div className="space-y-4">
                {[
                  { key: 'instagram', label: 'Instagram URL' },
                  { key: 'twitter', label: 'Twitter/X URL' },
                  { key: 'facebook', label: 'Facebook URL' },
                  { key: 'whatsapp', label: 'WhatsApp Number' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-sm font-medium mb-1.5 block">{label}</label>
                    <input value={(settings as Record<string, string>)[key]} onChange={e => update(key, e.target.value)} placeholder={`https://...`} className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-all disabled:opacity-60">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
