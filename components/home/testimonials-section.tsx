'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { testimonials } from '@/lib/data'
import { formatDateShort } from '@/lib/utils'

export default function TestimonialsSection() {
  return (
    <section className="py-14 bg-slate-50 overflow-hidden">
      <div className="section-container">
        <div className="text-center mb-10">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Thousands of happy customers and counting</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold">
                      {t.author.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
                <Quote className="w-6 h-6 text-slate-200 flex-shrink-0" />
              </div>

              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-3.5 h-3.5 ${j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{t.text}</p>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                {t.product && (
                  <span className="text-xs text-slate-500 bg-secondary px-2.5 py-1 rounded-full">{t.product}</span>
                )}
                <span className="text-xs text-muted-foreground ml-auto">{formatDateShort(t.date)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
