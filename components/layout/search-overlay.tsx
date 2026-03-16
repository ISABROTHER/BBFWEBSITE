'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { searchProducts } from '@/lib/data'
import { useUIStore } from '@/store/ui-store'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import type { Product } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
}

const trendingSearches = ['iPhone 15 Pro', 'Galaxy S24', 'AirPods Pro', 'Samsung Fold', 'iPad Pro', 'Pixel 8']

export default function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const { recentSearches, addRecentSearch, clearRecentSearches } = useUIStore()

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
    }
  }, [open])

  useEffect(() => {
    if (query.trim().length > 1) {
      const res = searchProducts(query)
      setResults(res.slice(0, 6))
    } else {
      setResults([])
    }
  }, [query])

  function handleSearch(q: string) {
    setQuery(q)
  }

  function handleSubmit(q: string) {
    if (!q.trim()) return
    addRecentSearch(q.trim())
    onClose()
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
        >
          <button
            className="absolute inset-0 w-full h-full cursor-default"
            onClick={onClose}
            aria-label="Close search"
            tabIndex={-1}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white shadow-2xl rounded-b-3xl max-w-2xl mx-auto overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-4 border-b">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(query)}
                placeholder="Search phones, accessories..."
                className="flex-1 text-base bg-transparent outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 hover:bg-secondary rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-xl transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {results.length > 0 ? (
                <div className="py-2">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={() => { addRecentSearch(query); onClose() }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                        <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold">
                          {formatPrice(product.baseSalePrice ?? product.basePrice)}
                        </p>
                        {product.baseSalePrice && (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.basePrice)}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={() => { addRecentSearch(query); onClose() }}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors border-t"
                  >
                    See all results for "{query}"
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="p-4 space-y-5">
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Recent Searches
                        </h3>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSearch(s)}
                            className="px-3 py-1.5 bg-secondary text-sm rounded-full hover:bg-secondary/80 transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Trending
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSearch(s)}
                          className="px-3 py-1.5 bg-secondary text-sm rounded-full hover:bg-secondary/80 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
