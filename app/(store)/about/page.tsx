import Link from 'next/link'
import { Shield, Truck, Award, Users, Star, Zap } from 'lucide-react'

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '1,200+', label: 'Products' },
  { value: '99.2%', label: 'Satisfaction Rate' },
  { value: '48h', label: 'Avg Delivery Time' },
]

const milestones = [
  { year: '2020', title: 'Founded', desc: 'NovaMobile was founded with a mission to make premium phones accessible to everyone.' },
  { year: '2021', title: 'First 10,000 Customers', desc: 'We hit our first major milestone with 10,000 satisfied customers.' },
  { year: '2022', title: 'Guest Checkout Launched', desc: 'We pioneered true guest checkout — no account needed, ever.' },
  { year: '2023', title: 'Nationwide Coverage', desc: 'Expanded shipping to all 50 states with express 24-hour options.' },
  { year: '2024', title: 'Refurb Program', desc: 'Launched our certified refurbished program for budget-conscious shoppers.' },
  { year: '2026', title: 'Today', desc: 'Serving 50,000+ customers monthly with the best selection and prices.' },
]

export default function AboutPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-slate-900 to-slate-700 text-white py-16 sm:py-24">
        <div className="section-container text-center">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">About NovaMobile</h1>
          <p className="text-white/60 max-w-xl mx-auto text-base leading-relaxed">
            We believe buying a phone online should be simple, transparent, and trustworthy.
            No account required. No hidden fees. Just great products at honest prices.
          </p>
        </div>
      </div>

      <div className="py-12">
        <div className="section-container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-border p-5 text-center">
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>NovaMobile was born from frustration. Our founders were tired of phone stores that required accounts, pushy sales tactics, and unclear pricing.</p>
                <p>We set out to build the phone store we always wanted: clean interface, honest prices, zero signup friction, and real-time order tracking without needing to log in.</p>
                <p>Today, we're proud to serve tens of thousands of customers who trust us for their smartphone needs — from the latest flagship to budget-friendly options.</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-4">Our Promise</h2>
              <ul className="space-y-3">
                {[
                  { icon: Shield, text: '100% genuine products — sourced directly from authorized distributors' },
                  { icon: Truck, text: 'Fast, reliable shipping with real-time tracking for every order' },
                  { icon: Award, text: 'Best price guarantee — we match any competitor price' },
                  { icon: Users, text: 'Human support — real people ready to help you 24/7' },
                  { icon: Star, text: 'Hassle-free returns — 15 days, no questions asked' },
                  { icon: Zap, text: 'No account needed — ever. Shop as a guest, always.' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm">
                    <Icon className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Journey</h2>
            <div className="relative">
              <div className="absolute left-4 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6">
                {milestones.map((m, i) => (
                  <div key={m.year} className={`flex gap-4 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? 'sm:text-right sm:pr-8' : 'sm:pl-8'}`}>
                      <div className="bg-white rounded-2xl border border-border p-4 ml-8 sm:ml-0">
                        <span className="text-xs font-bold text-muted-foreground">{m.year}</span>
                        <h3 className="font-semibold mt-0.5">{m.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                      </div>
                    </div>
                    <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 bg-foreground rounded-full border-2 border-white mt-4" style={{ position: 'absolute' }} />
                    <div className="flex-1 hidden sm:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-foreground rounded-3xl p-8 sm:p-12 text-white text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Shop?</h2>
            <p className="text-white/60 mb-6 max-w-md mx-auto">No account needed. Just add to cart, checkout as guest, and track your order with a simple code.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/shop" className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/90 transition-all">
                Shop Now
              </Link>
              <Link href="/support" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/20 transition-all border border-white/20">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
