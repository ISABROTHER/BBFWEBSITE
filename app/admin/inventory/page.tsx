'use client'

import { useState } from 'react'
import { TriangleAlert as AlertTriangle, Package } from 'lucide-react'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminTopbar from '@/components/admin/admin-topbar'
import { products as fallbackProducts } from '@/lib/data'
import { useCatalogStore } from '@/store/catalog-store'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminInventoryPage() {
  const sbProducts = useCatalogStore((s) => s.products)
  const activeProducts = sbProducts.length > 0 ? sbProducts : fallbackProducts
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [inventory, setInventory] = useState(activeProducts.map(p => ({ ...p, newStock: String(p.stock) })))

  const lowStockProducts = inventory.filter(p => p.stock < 15)

  function updateStock(id: string, val: string) {
    setInventory(prev => prev.map(p => p.id === id ? { ...p, newStock: val } : p))
  }

  function saveStock(id: string) {
    const item = inventory.find(p => p.id === id)
    if (!item) return
    const newQty = parseInt(item.newStock)
    if (isNaN(newQty)) return
    setInventory(prev => prev.map(p => p.id === id ? { ...p, stock: newQty } : p))
    toast.success('Stock updated')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} title="Inventory" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">{lowStockProducts.length} products running low on stock</p>
                <p className="text-xs text-amber-600">{lowStockProducts.map(p => p.name).join(', ')}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Product</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase hidden sm:table-cell">SKU</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Current Stock</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Update Qty</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase hidden md:table-cell">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {inventory.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                            <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground hidden sm:table-cell">{product.variants[0]?.sku}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${product.stock < 15 ? 'bg-red-50 text-red-700' : product.stock < 30 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={product.newStock}
                            onChange={e => updateStock(product.id, e.target.value)}
                            className="w-20 px-3 py-1.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                          />
                          <button onClick={() => saveStock(product.id)} className="px-3 py-1.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors">
                            Save
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold hidden md:table-cell">{formatPrice(product.baseSalePrice ?? product.basePrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
