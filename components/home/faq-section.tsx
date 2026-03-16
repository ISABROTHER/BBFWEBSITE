'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { faqs } from '@/lib/data'

export default function FAQSection() {
  const [open, setOpen] = useState<string | null>(null)
  const previewFaqs = faqs.slice(0, 6)

  return (
    <section className="py-14">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know</p>
          </div>

          <div className="space-y-3">
            {previewFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-border overflow-hidden"
              >
                <button
                  onClick={() => setOpen(open === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-medium text-sm pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: open === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {open === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/support"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-foreground/70 transition-colors"
            >
              View all FAQs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
