import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface Props {
  title: string
  value: string | number
  change?: string
  positive?: boolean
  icon: LucideIcon
  iconColor?: string
  subtitle?: string
}

export default function StatsCard({ title, value, change, positive, icon: Icon, iconColor = 'bg-blue-50 text-blue-600', subtitle }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <span className={cn(
            'text-xs font-semibold px-2 py-0.5 rounded-full',
            positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          )}>
            {positive ? '+' : ''}{change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  )
}
