'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Phone, Mail, MessageCircle, Package, RotateCcw, Shield, Truck, CircleHelp as HelpCircle, Send } from 'lucide-react'
import { faqs } from '@/lib/data'
import { toast } from 'sonner'

const categories = ['All', 'Shopping', 'Orders', 'Payment', 'Shipping', 'Returns', 'Products']
const SHIPPING_FEE = 15

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const filteredFaqs = activeCategory === 'All' ? faqs : faqs.filter(f => f.category === activeCategory)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitting(false)
    toast.success('Message sent! We\'ll respond within 24 hours.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="section-container">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Help Center</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Find answers to common questions or get in touch with our support team.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Phone, title: 'Call Us', desc: '+1 (555) 019-9000', sub: 'Mon–Fri 9am–6pm EST', href: 'tel:+15550199', color: 'bg-blue-50 text-blue-600' },
            { icon: Mail, title: 'Email Us', desc: 'support@novamobile.com', sub: 'Reply within 24 hours', href: 'mailto:support@novamobile.com', color: 'bg-emerald-50 text-emerald-600' },
            { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with an expert', sub: 'Available 24/7', href: '#chat', color: 'bg-amber-50 text-amber-600' },
          ].map(({ icon: Icon, title, desc, sub, href, color }) => (
            <a key={title} href={href} className="bg-white rounded-2xl border border-border p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {[
            { icon: Truck, title: 'Shipping Policy', desc: 'Free shipping on orders over $99. Standard 3–7 days. Express 1–3 days available at checkout.', color: 'bg-blue-50 text-blue-600' },
            { icon: RotateCcw, title: 'Return Policy', desc: '15-day returns. Items must be in original condition. Full refund or exchange available.', color: 'bg-emerald-50 text-emerald-600' },
            { icon: Shield, title: 'Warranty Policy', desc: 'All new products include manufacturer warranty. Refurbished items have 90-day NovaMobile warranty.', color: 'bg-amber-50 text-amber-600' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl border border-border p-5">
              <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-1.5">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" /> Frequently Asked Questions
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    activeCategory === cat ? 'bg-foreground text-background border-foreground' : 'bg-white border-border hover:border-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {filteredFaqs.map(faq => (
                <div key={faq.id} className="bg-white rounded-2xl border border-border overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-medium text-sm pr-4">{faq.question}</span>
                    <motion.div animate={{ rotate: openFaq === faq.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === faq.id && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="px-5 pb-4 text-sm text-muted-foreground border-t border-border pt-3">{faq.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div id="contact">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Send className="w-5 h-5" /> Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Your Name</label>
                  <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} required placeholder="you@email.com" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Subject</label>
                <input value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))} required placeholder="e.g. Order issue, Return request" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Message</label>
                <textarea value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} required rows={5} placeholder="Describe your issue in detail..." className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none" />
              </div>
              <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {submitting ? 'Sending...' : <><Send className="w-4 h-4" />Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
