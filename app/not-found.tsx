'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Chrome as Home, Search, ArrowLeft, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <Smartphone className="w-24 h-24 text-muted-foreground/30 mx-auto" />
            </motion.div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              !
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-8xl font-black text-foreground/10 leading-none mb-4">404</h1>
          <h2 className="text-2xl font-bold text-foreground mb-3">Page Not Found</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Looks like this page went out of stock. The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl">
            <Link href="/shop">
              <Search className="w-4 h-4 mr-2" />
              Browse Shop
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="rounded-xl"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <p className="text-sm text-muted-foreground mb-4">Popular destinations</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: 'Deals', href: '/deals' },
              { label: 'New Arrivals', href: '/shop?sort=newest' },
              { label: 'iPhones', href: '/category/smartphones' },
              { label: 'Track Order', href: '/track-order' },
              { label: 'Support', href: '/support' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-foreground/70 hover:text-foreground border border-border rounded-full px-3 py-1 transition-colors hover:border-foreground/30"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
