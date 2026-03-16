'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { searchProducts } from '@/lib/data'
import { useUIStore } from '@/store/ui-store'
import ProductCard from '@/components/product/product-card'
import type { Product } from '@/types'

function SearchContent() {
  const params = useSearchParams()
  const initialQuery = params.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Product[]>([])
  const { addRecentSearch } = useUIStore()

  useEffect(() => {
    if (query.trim().length > 1) {
      setResults(searchProducts(query))
      addRecentSearch(query)
    } else {
      setResults([])
    }
  }, [query])

  return (
    <div className="py-10">
      <div className="section-container">
        <div className="max-w-xl mb-8">
          <h1 className="text-2xl font-bold mb-4">Search</h1>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search phones, accessories..."
              autoFocus
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 bg-white"
            />
          </div>
        </div>

        {query.trim().length > 1 && (
          <>
            <p className="text-sm text-muted-foreground mb-5">
              <span className="font-semibold text-foreground">{results.length}</span> results for "{query}"
            </p>
            {results.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-lg mb-1">No results found</p>
                <p className="text-muted-foreground text-sm">Try a different search term or browse our categories</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {results.map((product, i) => (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {!query && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-semibold text-lg mb-1">Search our catalog</p>
            <p className="text-muted-foreground text-sm">Find phones, accessories, and more</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return <Suspense fallback={<div className="py-20 text-center">Loading...</div>}><SearchContent /></Suspense>
}
