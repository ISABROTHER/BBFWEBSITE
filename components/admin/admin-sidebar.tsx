'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Package, ShoppingBag, ChartBar as BarChart3, Tag, Settings, LogOut, Zap, ChevronRight, X, Boxes } from 'lucide-react'
import { useAdminStore } from '@/store/admin-store'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { href: '/admin/promotions', label: 'Promotions', icon: Tag },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

interface Props {
  open?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, adminEmail } = useAdminStore()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  function handleLogout() {
    logout()
    router.push('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-700/50">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-slate-900" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">NovaMobile</p>
            <p className="text-slate-400 text-[10px]">Admin Dashboard</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-slate-700/50">
        <div className="flex items-center gap-3 mb-3 px-3 py-2">
          <div className="w-7 h-7 bg-slate-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-medium truncate">Admin</p>
            <p className="text-slate-400 text-[10px] truncate">{adminEmail}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-red-500/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:flex flex-col w-56 bg-slate-900 border-r border-slate-700/50 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-56 bg-slate-900 z-50 flex flex-col lg:hidden"
            >
              <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
                <X className="w-4 h-4 text-slate-300" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
