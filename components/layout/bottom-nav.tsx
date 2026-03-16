'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Store, Search, ShoppingCart, Package, Menu, X, Phone } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { cn } from '@/lib/utils'
import SearchOverlay from './search-overlay'

const navItems = [
  { label: 'Shop', href: '/shop', icon: Store },
  { label: 'Search', href: '/search', icon: Search, isSearch: true },
  { label: 'Cart', href: '/cart', icon: ShoppingCart, isCart: true },
  { label: 'Track', href: '/track-order', icon: Package },
]

export default function BottomNav() {
  const pathname = usePathname()
  const itemCount = useCartStore((s) => s.getItemCount())
  const [searchOpen, setSearchOpen] = useState(false)

  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-border lg:hidden safe-bottom">
        <div className="flex items-center">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

            if (item.isSearch) {
              return (
                <button
                  key={item.label}
                  onClick={() => setSearchOpen(true)}
                  className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors relative',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.isCart && itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-foreground text-background text-[9px] font-bold rounded-full flex items-center justify-center"
                    >
                      {itemCount > 9 ? '9+' : itemCount}
                    </motion.span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-foreground rounded-full"
                  />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="h-16 lg:hidden" />
    </>
  )
}
