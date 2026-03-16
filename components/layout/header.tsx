'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Search, Menu, X, MapPin, Phone, Zap, Settings } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import SearchOverlay from './search-overlay'

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'iPhones', href: '/category/iphones' },
  { label: 'Android', href: '/category/android-phones' },
  { label: 'Accessories', href: '/category/earbuds' },
  { label: 'Deals', href: '/deals' },
]

const mobileMenuLinks = [
  { label: 'Shop All', href: '/shop', icon: '🛍️' },
  { label: 'iPhones', href: '/category/iphones', icon: '📱' },
  { label: 'Android Phones', href: '/category/android-phones', icon: '📲' },
  { label: 'Tablets', href: '/category/tablets', icon: '📟' },
  { label: 'Smartwatches', href: '/category/smartwatches', icon: '⌚' },
  { label: 'Earbuds', href: '/category/earbuds', icon: '🎧' },
  { label: 'Accessories', href: '/category/cases', icon: '🔌' },
  { label: 'Deals & Offers', href: '/deals', icon: '🔥' },
  { label: 'Track Order', href: '/track-order', icon: '📦' },
  { label: 'Support', href: '/support', icon: '💬' },
  { label: 'About', href: '/about', icon: 'ℹ️' },
  { label: 'Admin Panel', href: '/admin/login', icon: '⚙️' },
]

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const itemCount = useCartStore((s) => s.getItemCount())
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const displayCount = mounted ? itemCount : 0

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-border'
            : 'bg-white border-b border-border'
        )}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-background" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Nova<span className="text-slate-500">Mobile</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-foreground bg-secondary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/cart"
                className="relative p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                aria-label={`Cart (${displayCount} items)`}
              >
                <ShoppingCart className="w-5 h-5" />
                {displayCount > 0 && (
                  <motion.span
                    key={displayCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {displayCount > 99 ? '99+' : displayCount}
                  </motion.span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground lg:hidden"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link
                href="/track-order"
                className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                Track Order
              </Link>

              <Link
                href="/admin/login"
                className="hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                title="Admin Panel"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-full sm:w-80 p-0 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-7 h-7 bg-foreground rounded-lg flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-background" />
              </div>
              <span className="text-base font-bold tracking-tight">NovaMobile</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {mobileMenuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-secondary text-foreground'
                    : 'text-foreground hover:bg-secondary/50'
                )}
              >
                <span className="text-base w-6">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="p-4 border-t space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <a href="tel:+15550199" className="hover:text-foreground">+1 (555) 019-9000</a>
            </div>
            <p className="text-xs text-muted-foreground">
              Mon–Fri 9am–6pm EST
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}