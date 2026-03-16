'use client'

import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getCategoryBySlug, getProductsByCategory } from '@/lib/data'
import ProductCard from '@/components/product/product-card'

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryData = getCategoryBySlug(params.slug)
  if (!categoryData) notFound()
  const category = categoryData!
  const categoryProducts = getProductsByCategory(params.slug)

  return (
    <div>
      <div className="bg-gradient-to-br from-slate-900 to-slate-700 text-white py-12 sm:py-16">
        <div className="section-container">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{category.name}</h1>
          <p className="text-white/60 max-w-xl">{category.description}</p>
          <p className="text-sm text-white/40 mt-3">{categoryProducts.length} products</p>
        </div>
      </div>

      <div className="py-10">
        <div className="section-container">
          {categoryProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">📱</p>
              <p className="font-semibold text-lg mb-1">No products yet</p>
              <p className="text-muted-foreground text-sm mb-6">Check back soon for new arrivals!</p>
              <Link href="/shop" className="btn-primary">Browse All Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {categoryProducts.map((product, i) => (
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
          )}
        </div>
      </div>
    </div>
  )
}
