'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, Grid3x3, List, X, Search } from 'lucide-react'
import { products } from '@/lib/data'
import ProductCard from '@/components/product/product-card'
import { SkeletonCard } from '@/components/ui/skeleton-card'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { Metadata } from 'next'

const brands = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Sony', 'Xiaomi']
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export default function ShopPage() {
  const [search, setSearch] = useState('')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [sort, setSort] = useState('featured')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [show5GOnly, setShow5GOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)

  const filtered = useMemo(() => {
    let list = products.filter(p => p.isVisible)

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
      )
    }

    if (selectedBrands.length > 0) {
      list = list.filter(p => selectedBrands.includes(p.brand))
    }

    if (show5GOnly) {
      list = list.filter(p => p.tags.includes('5g'))
    }

    if (inStockOnly) {
      list = list.filter(p => p.stock > 0)
    }

    list = list.filter(p => {
      const price = p.baseSalePrice ?? p.basePrice
      return price >= priceRange[0] && price <= priceRange[1]
    })

    switch (sort) {
      case 'newest':
        list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'price-asc':
        list = [...list].sort((a, b) => (a.baseSalePrice ?? a.basePrice) - (b.baseSalePrice ?? b.basePrice))
        break
      case 'price-desc':
        list = [...list].sort((a, b) => (b.baseSalePrice ?? b.basePrice) - (a.baseSalePrice ?? a.basePrice))
        break
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating)
        break
      default:
        list = list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    return list
  }, [search, selectedBrands, priceRange, sort, show5GOnly, inStockOnly])

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  const activeFilters = selectedBrands.length + (show5GOnly ? 1 : 0) + (inStockOnly ? 1 : 0)

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Brand</h3>
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => toggleBrand(brand)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                selectedBrands.includes(brand)
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-white text-foreground border-border hover:border-slate-400'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Price Range</h3>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={2000}
            step={50}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span className="font-medium text-foreground">Up to ${priceRange[1]}</span>
            <span>$2000</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Features</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={show5GOnly} onChange={(e) => setShow5GOnly(e.target.checked)} className="rounded" />
            <span className="text-sm">5G Only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="rounded" />
            <span className="text-sm">In Stock Only</span>
          </label>
        </div>
      </div>

      {activeFilters > 0 && (
        <button
          onClick={() => { setSelectedBrands([]); setShow5GOnly(false); setInStockOnly(false); setPriceRange([0, 2000]) }}
          className="w-full py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )

  return (
    <div className="py-6 sm:py-10">
      <div className="section-container">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground mt-1">Discover our full range of phones and accessories</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-border text-sm focus:outline-none bg-white flex-1 sm:flex-none min-w-[160px]"
            >
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white hover:bg-secondary transition-colors text-sm font-medium flex-shrink-0 relative lg:hidden">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilters > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-foreground text-background rounded-full text-[10px] flex items-center justify-center font-bold">
                      {activeFilters}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="mt-6"><FilterContent /></div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
              <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-white shadow-sm' : 'text-muted-foreground'}`}>
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white shadow-sm' : 'text-muted-foreground'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-border p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold">Filters</h3>
                {activeFilters > 0 && (
                  <button onClick={() => { setSelectedBrands([]); setShow5GOnly(false); setInStockOnly(false); setPriceRange([0, 2000]) }} className="text-xs text-muted-foreground hover:text-foreground">
                    Clear
                  </button>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filtered.length}</span> products
              </p>
              {selectedBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-foreground text-background rounded-full text-xs"
                >
                  {brand} <X className="w-3 h-3" />
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-lg mb-1">No products found</p>
                <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className={
                view === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'
                  : 'space-y-3'
              }>
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <ProductCard product={product} view={view} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
