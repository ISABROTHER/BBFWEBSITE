'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const brands = [
  { name: 'Apple', slug: 'apple', bg: 'bg-slate-100', logo: '🍎' },
  { name: 'Samsung', slug: 'samsung', bg: 'bg-blue-50', logo: '📱' },
  { name: 'Google', slug: 'google', bg: 'bg-red-50', logo: '🔍' },
  { name: 'OnePlus', slug: 'oneplus', bg: 'bg-red-50', logo: '⚡' },
  { name: 'Sony', slug: 'sony', bg: 'bg-slate-100', logo: '🎵' },
  { name: 'Xiaomi', slug: 'xiaomi', bg: 'bg-orange-50', logo: '🔥' },
]

export default function BrandsSection() {
  return (
    <section className="py-12">
      <div className="section-container">
        <div className="text-center mb-8">
          <h2 className="section-title">Shop by Brand</h2>
          <p className="section-subtitle">All your favorite brands in one place</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/shop?brand=${brand.slug}`}
                className={`group flex flex-col items-center gap-2 p-4 ${brand.bg} rounded-2xl hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
              >
                <span className="text-3xl">{brand.logo}</span>
                <span className="text-xs font-semibold text-foreground">{brand.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
