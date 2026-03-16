'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Bell, ExternalLink, Search } from 'lucide-react'

interface Props {
  onMenuClick: () => void
  title?: string
}

export default function AdminTopbar({ onMenuClick, title = 'Dashboard' }: Props) {
  return (
    <header className="h-14 bg-white border-b border-border flex items-center px-4 gap-4 sticky top-0 z-30">
      <button onClick={onMenuClick} className="p-2 rounded-xl hover:bg-secondary transition-colors lg:hidden">
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="font-semibold text-sm sm:text-base flex-1">{title}</h1>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-xl hover:bg-secondary"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Store
        </Link>
        <button className="relative p-2 rounded-xl hover:bg-secondary transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
