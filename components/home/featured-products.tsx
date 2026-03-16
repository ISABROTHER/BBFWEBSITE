'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { getFeaturedProducts, getNewArrivals, getBestsellers } from '@/lib/data'
import ProductCard from '@/components/product/product-card'

const tabs = [
  { id: 'featured', label: 'Featured' },
  { id: 'new', label: 'New Arrivals' },
  { id: 'bestsellers', label: 'Best Sellers' },
]

export default function FeaturedProducts() {
  const [active, setActive] = useState('featured')

  const products = {
    featured: getFeaturedProducts().slice(0, 8),
    new: getNewArrivals().slice(0, 8),
    bestsellers: getBestsellers().slice(0, 8),
  }[active] ?? []

  return (
    <section className="py-14">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="section-title">Our Products</h2>
            <p className="section-subtitle">Premium devices at great prices</p>
          </div>
          <div className="flex items-center gap-2 bg-secondary p-1 rounded-xl self-start sm:self-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  active === tab.id ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-all active:scale-95"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
