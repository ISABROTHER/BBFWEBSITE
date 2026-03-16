'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CircleCheck as CheckCircle2, Copy, Package, MapPin, ArrowRight, Check, Share2, Printer } from 'lucide-react'
import { toast } from 'sonner'
import { copyToClipboard, formatDate } from '@/lib/utils'

function OrderSuccessContent() {
  const params = useSearchParams()
  const orderNumber = params.get('order') || 'ORD-XXXXXX'
  const trackingCode = params.get('tracking') || 'NVM-2026-XXXXXX'
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await copyToClipboard(trackingCode)
    setCopied(true)
    toast.success('Tracking code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="py-12 sm:py-20">
      <div className="section-container max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground">
            Thank you! Your order <span className="font-semibold text-foreground">{orderNumber}</span> has been confirmed.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-3xl p-6 sm:p-8 text-white mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-white/60" />
            <p className="text-white/60 text-sm font-medium uppercase tracking-wider">Your Tracking Code</p>
          </div>
          <div className="flex items-center gap-3">
            <code className="text-2xl sm:text-3xl font-bold font-mono tracking-wider flex-1">
              {trackingCode}
            </code>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                copied ? 'bg-emerald-500' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </motion.button>
          </div>
          <p className="text-white/50 text-xs mt-3">
            Save this code — you'll need it to track your order. No account required.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-border p-5 mb-6"
        >
          <h2 className="font-bold mb-4">What Happens Next?</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Order Confirmation', desc: "You'll receive a confirmation with your tracking code.", done: true },
              { step: '2', title: 'Processing & Packing', desc: 'We\'ll carefully pack your items within 24 hours.', done: false },
              { step: '3', title: 'Shipped Out', desc: 'Your order will be picked up by the courier.', done: false },
              { step: '4', title: 'Delivered to You', desc: `Estimated delivery by ${formatDate(new Date(Date.now() + 5 * 86400000).toISOString())}.`, done: false },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  item.done ? 'bg-emerald-500 text-white' : 'bg-secondary text-muted-foreground'
                }`}>
                  {item.done ? <Check className="w-3.5 h-3.5" /> : item.step}
                </div>
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid sm:grid-cols-2 gap-3"
        >
          <Link
            href={`/track-order?code=${trackingCode}`}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-all"
          >
            <MapPin className="w-4 h-4" />
            Track My Order
          </Link>
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-border font-semibold text-sm hover:bg-secondary transition-all"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Need help? <Link href="/support" className="underline hover:text-foreground">Contact Support</Link>
        </p>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}
