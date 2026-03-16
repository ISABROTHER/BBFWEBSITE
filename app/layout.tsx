import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'NovaMobile – Premium Phones & Accessories',
    template: '%s | NovaMobile',
  },
  description:
    'Shop the latest iPhones, Android flagships, accessories, and more at NovaMobile. No account needed. Fast shipping. Secure checkout.',
  keywords: ['phones', 'iphone', 'samsung', 'accessories', 'smartphones', 'NovaMobile'],
  openGraph: {
    title: 'NovaMobile – Premium Phones & Accessories',
    description: 'Shop the latest smartphones and accessories. No account required.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NovaMobile – Premium Phones & Accessories',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  )
}
