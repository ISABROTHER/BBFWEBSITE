'use client'

import { motion } from 'framer-motion'
import { Shield, Truck, RotateCcw, Headphones, CreditCard, Lock, Award, Zap } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: '100% Genuine Products',
    description: 'All products are sourced directly from authorized distributors with full manufacturer warranty.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Truck,
    title: 'Free Fast Shipping',
    description: 'Free delivery on orders over $99. Express same-day delivery available in select cities.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: RotateCcw,
    title: '15-Day Easy Returns',
    description: 'Not satisfied? Return within 15 days for a full refund. No questions asked.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Lock,
    title: 'Secure Checkout',
    description: 'Shop as a guest with complete security. No account required. SSL-encrypted payments.',
    color: 'bg-slate-100 text-slate-600',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payments',
    description: 'Pay by card, cash on delivery, bank transfer, or split into easy installments.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our expert team is always here to help via chat, email, or phone anytime.',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    icon: Award,
    title: 'Certified Refurbished',
    description: 'Grade-A refurbished phones tested and certified by experts. Save up to 40%.',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: Zap,
    title: 'Price Match Guarantee',
    description: 'Find a lower price elsewhere? We\'ll match it, no questions asked.',
    color: 'bg-orange-50 text-orange-600',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-14 bg-slate-50">
      <div className="section-container">
        <div className="text-center mb-10">
          <h2 className="section-title">Why Shop at NovaMobile?</h2>
          <p className="section-subtitle mt-2 max-w-xl mx-auto">
            We've built the most trusted way to buy phones online — no account needed, just great products at honest prices.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-5 border border-border hover:shadow-md transition-shadow"
              >
                <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
