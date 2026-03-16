'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Shield, Truck } from 'lucide-react'
import { getActiveBanners } from '@/lib/data'

const slides = [
  {
    id: 1,
    badge: 'Just Arrived',
    title: 'iPhone 15 Pro Max',
    subtitle: 'Titanium. So strong. So light. So Pro.',
    description: 'A17 Pro chip. 48MP camera. USB 3. The most capable iPhone ever.',
    cta: 'Shop Now',
    ctaLink: '/product/apple-iphone-15-pro-max',
    ctaSecondary: 'View All iPhones',
    ctaSecondaryLink: '/category/iphones',
    image: 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=800',
    bg: 'from-slate-900 via-slate-800 to-slate-900',
    accent: 'text-blue-400',
  },
  {
    id: 2,
    badge: 'Galaxy AI',
    title: 'Samsung Galaxy S24 Ultra',
    subtitle: 'AI-powered photography meets epic performance.',
    description: 'Snapdragon 8 Gen 3. 200MP camera. Built-in S Pen. Now smarter than ever.',
    cta: 'Explore',
    ctaLink: '/product/samsung-galaxy-s24-ultra',
    ctaSecondary: 'Shop Android',
    ctaSecondaryLink: '/category/android-phones',
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800',
    bg: 'from-blue-950 via-blue-900 to-slate-900',
    accent: 'text-sky-400',
  },
  {
    id: 3,
    badge: 'Trade In & Save',
    title: 'Get Up to $500 Off',
    subtitle: 'Trade in your old phone for instant credit.',
    description: 'Upgrade today. We accept all major brands in any condition.',
    cta: 'Trade In Now',
    ctaLink: '/deals',
    ctaSecondary: 'Learn More',
    ctaSecondaryLink: '/about',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
    bg: 'from-emerald-950 via-emerald-900 to-slate-900',
    accent: 'text-emerald-400',
  },
]

const trustBadges = [
  { icon: Shield, text: '2-Year Warranty' },
  { icon: Truck, text: 'Free Delivery' },
  { icon: Zap, text: 'Fast Checkout' },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000)
    return () => clearInterval(id)
  }, [auto])

  const prev = () => { setCurrent((c) => (c - 1 + slides.length) % slides.length); setAuto(false) }
  const next = () => { setCurrent((c) => (c + 1) % slides.length); setAuto(false) }

  const slide = slides[current]

  return (
    <section className={`relative bg-gradient-to-br ${slide.bg} transition-all duration-700 overflow-hidden min-h-[520px] sm:min-h-[600px] lg:min-h-[680px]`}>
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,_white,_transparent_70%)]" />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] py-16 lg:py-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="text-white space-y-6"
            >
              <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${slide.accent} bg-white/10 px-3 py-1.5 rounded-full`}>
                <Zap className="w-3 h-3" />
                {slide.badge}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                {slide.title}
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-white/70 leading-snug">
                {slide.subtitle}
              </p>
              <p className="text-white/50 text-base leading-relaxed max-w-md">
                {slide.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all active:scale-95 text-sm"
                >
                  {slide.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={slide.ctaSecondaryLink}
                  className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all active:scale-95 text-sm border border-white/20"
                >
                  {slide.ctaSecondary}
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-2">
                {trustBadges.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-white/60 text-xs">
                    <Icon className="w-3.5 h-3.5" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${current}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5 }}
              className="hidden lg:block relative"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-white/5 rounded-3xl" />
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover rounded-3xl shadow-2xl animate-float"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        <button onClick={prev} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setAuto(false) }}
              className={`h-1.5 rounded-full transition-all ${i === current ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>
        <button onClick={next} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  )
}
