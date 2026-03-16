'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Search, CreditCard as Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminTopbar from '@/components/admin/admin-topbar'
import { products } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [productList, setProductList] = useState(products)

  const filtered = productList.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  )

  function toggleVisibility(id: string) {
    setProductList(prev => prev.map(p => p.id === id ? { ...p, isVisible: !p.isVisible } : p))
    toast.success('Product visibility updated')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} title="Products" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors flex-shrink-0">
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Product</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase hidden sm:table-cell">Brand</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase hidden md:table-cell">Category</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Price</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase hidden sm:table-cell">Stock</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                            <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-sm leading-tight line-clamp-1">{product.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {product.isBestseller && <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">Best</span>}
                              {product.isNew && <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">New</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{product.brand}</td>
                      <td className="px-4 py-3 text-muted-foreground capitalize hidden md:table-cell">{product.categorySlug.replace('-', ' ')}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold">{formatPrice(product.baseSalePrice ?? product.basePrice)}</p>
                          {product.baseSalePrice && <p className="text-xs text-muted-foreground line-through">{formatPrice(product.basePrice)}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.stock < 10 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.isVisible ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {product.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/product/${product.slug}`} target="_blank" className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button onClick={() => toggleVisibility(product.id)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                            {product.isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <Link href={`/admin/products/new?edit=${product.id}`} className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button onClick={() => toast.error('Delete product?')} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
              Showing {filtered.length} of {productList.length} products
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
