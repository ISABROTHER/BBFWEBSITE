'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Check } from 'lucide-react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 800)
  }

  return (
    <section className="py-14 bg-foreground">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center text-white"
        >
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Stay in the Loop</h2>
          <p className="text-white/60 mb-8 text-sm sm:text-base">
            Get exclusive deals, new arrivals, and tech news delivered to your inbox. No spam, ever.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 bg-white/10 rounded-2xl px-6 py-4"
            >
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="font-medium">You're subscribed! Check your inbox for a welcome gift.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 text-white placeholder:text-white/40 border border-white/20 focus:outline-none focus:border-white/60 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/90 transition-all active:scale-95 disabled:opacity-70 flex-shrink-0"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}
          <p className="text-xs text-white/30 mt-4">
            By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
