'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Smartphone, Tablet, Watch, Headphones, Shield, Zap, Battery, Package } from 'lucide-react'
import { getFeaturedCategories } from '@/lib/data'

const iconMap: Record<string, React.ElementType> = {
  smartphone: Smartphone,
  tablet: Tablet,
  watch: Watch,
  headphones: Headphones,
  shield: Shield,
  zap: Zap,
  battery: Battery,
  package: Package,
}

export default function CategoryGrid() {
  const categories = getFeaturedCategories()

  return (
    <section className="py-14 bg-slate-50">
      <div className="section-container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you need</p>
          </div>
          <Link href="/shop" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Smartphone
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-border hover:border-slate-300 hover:shadow-lg transition-all duration-300 text-center"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-100 group-hover:bg-foreground flex items-center justify-center transition-all duration-300">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground group-hover:text-background transition-colors" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground leading-tight">{cat.name}</span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
