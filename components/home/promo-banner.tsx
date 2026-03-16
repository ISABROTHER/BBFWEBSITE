'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

function useCountdown(target: Date) {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const calc = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return
      setTime({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [target])
  return time
}

export default function PromoBanner() {
  const target = new Date(Date.now() + 8 * 3600000 + 43 * 60000 + 22000)
  const { hours, minutes, seconds } = useCountdown(target)

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <section className="py-8">
      <div className="section-container">
        <div className="grid sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-6 sm:p-8 text-white"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Zap className="w-3.5 h-3.5" />
                Flash Sale — Ends In
              </div>
              <div className="flex items-center gap-2 mb-4">
                {[pad(hours), pad(minutes), pad(seconds)].map((val, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="bg-white/20 rounded-xl px-3 py-2 text-center min-w-[48px]">
                      <div className="text-2xl font-bold font-mono">{val}</div>
                      <div className="text-[9px] text-white/50 uppercase">{['HRS', 'MIN', 'SEC'][i]}</div>
                    </div>
                    {i < 2 && <span className="text-white/50 font-bold text-xl">:</span>}
                  </div>
                ))}
              </div>
              <h3 className="text-xl font-bold mb-1">Galaxy S24 Ultra</h3>
              <p className="text-white/60 text-sm mb-4">Limited time — $100 off. While stocks last.</p>
              <Link
                href="/product/samsung-galaxy-s24-ultra"
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/90 transition-all"
              >
                Grab the Deal <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-700 p-6 sm:p-8 text-white"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative z-10">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-200 mb-3">
                💳 0% Interest Financing
              </div>
              <h3 className="text-2xl font-bold mb-2">Pay in 12 Installments</h3>
              <p className="text-white/70 text-sm mb-4">
                Split any order over $300 into easy monthly payments. No hidden fees, no interest.
              </p>
              <ul className="space-y-2 mb-5">
                {['0% interest for 12 months', 'Instant approval', 'No credit card required'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-emerald-100">
                    <span className="w-4 h-4 rounded-full bg-emerald-400/30 flex items-center justify-center text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-white text-emerald-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/90 transition-all"
              >
                Shop with Financing <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
