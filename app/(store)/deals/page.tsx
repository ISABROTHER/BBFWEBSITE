'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Tag, Zap, ArrowRight, Clock } from 'lucide-react'
import { products, coupons } from '@/lib/data'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import ProductCard from '@/components/product/product-card'

function Countdown({ target }: { target: Date }) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 })
  useEffect(() => {
    const calc = () => {
      const d = target.getTime() - Date.now()
      if (d <= 0) return
      setTime({ h: Math.floor(d / 3600000), m: Math.floor((d % 3600000) / 60000), s: Math.floor((d % 60000) / 1000) })
    }
    calc(); const id = setInterval(calc, 1000); return () => clearInterval(id)
  }, [target])
  const p = (n: number) => String(n).padStart(2, '0')
  return (
    <div className="flex items-center gap-1.5">
      {[time.h, time.m, time.s].map((v, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="bg-white/20 rounded-lg px-2.5 py-1.5 font-mono font-bold text-sm">{p(v)}</div>
          {i < 2 && <span className="text-white/50 font-bold">:</span>}
        </div>
      ))}
    </div>
  )
}

export default function DealsPage() {
  const target = new Date(Date.now() + 6 * 3600000 + 30 * 60000)
  const saleProducts = products.filter(p => p.baseSalePrice && p.baseSalePrice < p.basePrice && p.isVisible).slice(0, 8)
  const activeCoupons = coupons.filter(c => c.isActive)

  return (
    <div>
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12">
        <div className="section-container text-center">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider bg-amber-400/10 px-3 py-1.5 rounded-full mb-4">
            <Zap className="w-3 h-3" /> Flash Sales & Hot Deals
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Today's Best Deals</h1>
          <p className="text-white/60 mb-6">Massive savings on premium smartphones & accessories</p>
          <div className="flex items-center justify-center gap-3">
            <Clock className="w-4 h-4 text-white/50" />
            <span className="text-sm text-white/50">Flash sale ends in</span>
            <Countdown target={target} />
          </div>
        </div>
      </div>

      <div className="py-10">
        <div className="section-container space-y-10">
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Flash Deals</h2>
                <p className="text-muted-foreground text-sm">Limited stock — grab them before they're gone</p>
              </div>
              <Link href="/shop" className="text-sm font-medium text-muted-foreground hover:text-foreground">View All →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {saleProducts.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} viewport={{ once: true }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Coupon Codes</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {activeCoupons.map((coupon) => (
                <motion.div key={coupon.id} whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl border-2 border-dashed border-border p-4 text-center">
                  <code className="text-xl font-bold font-mono text-foreground">{coupon.code}</code>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">{coupon.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-slate-900 text-white px-3 py-1.5 rounded-full font-semibold">
                    <Tag className="w-3 h-3" />
                    {coupon.type === 'percentage' ? `${coupon.value}% Off` : `$${coupon.value} Off`}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-800 to-teal-700 rounded-3xl p-8 text-white">
            <div className="max-w-lg">
              <div className="text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-3">♻️ Trade In Program</div>
              <h3 className="text-2xl font-bold mb-2">Get Up to $500 for Your Old Phone</h3>
              <p className="text-white/70 text-sm mb-6">Trade in any brand, any condition. Instant credit toward your next purchase. No hassle, no middlemen.</p>
              <Link href="/support" className="inline-flex items-center gap-2 bg-white text-emerald-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/90 transition-all">
                Learn About Trade-In <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
