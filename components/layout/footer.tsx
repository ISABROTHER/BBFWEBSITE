import Link from 'next/link'
import { Zap, Mail, Phone, MapPin, Instagram, Twitter, Youtube, Facebook } from 'lucide-react'

const shopLinks = [
  { label: 'iPhones', href: '/category/iphones' },
  { label: 'Android Phones', href: '/category/android-phones' },
  { label: 'Tablets', href: '/category/tablets' },
  { label: 'Smartwatches', href: '/category/smartwatches' },
  { label: 'Earbuds', href: '/category/earbuds' },
  { label: 'Accessories', href: '/shop' },
  { label: 'Deals', href: '/deals' },
]

const supportLinks = [
  { label: 'Track Order', href: '/track-order' },
  { label: 'Help Center', href: '/support' },
  { label: 'Returns & Refunds', href: '/returns' },
  { label: 'Shipping Info', href: '/shipping' },
  { label: 'Warranty Policy', href: '/support#warranty' },
  { label: 'Contact Us', href: '/support#contact' },
]

const policyLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Return Policy', href: '/returns' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'About Us', href: '/about' },
]

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="section-container py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-slate-950" />
              </div>
              <span className="text-white text-lg font-bold tracking-tight">
                Nova<span className="text-slate-400">Mobile</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Premium smartphones and accessories. No account needed to shop. Fast shipping, secure checkout.
            </p>
            <div className="space-y-2 text-sm">
              <a href="tel:+15550199" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-slate-500" />
                +1 (555) 019-9000
              </a>
              <a href="mailto:hello@novamobile.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-slate-500" />
                hello@novamobile.com
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400">123 Tech Ave, New York, NY 10001</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { Icon: Instagram, href: '#', label: 'Instagram' },
                  { Icon: Twitter, href: '#', label: 'Twitter' },
                  { Icon: Youtube, href: '#', label: 'YouTube' },
                  { Icon: Facebook, href: '#', label: 'Facebook' },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} NovaMobile. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-slate-600">
            <span className="text-xs text-slate-500">Secure payments:</span>
            {['VISA', 'MC', 'AMEX', 'PayPal'].map((method) => (
              <span
                key={method}
                className="text-[10px] font-bold bg-slate-800 px-2 py-1 rounded text-slate-400"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
