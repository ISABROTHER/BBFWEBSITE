import { Star } from 'lucide-react'
import { getStarArray } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  count?: number
  className?: string
}

export default function RatingStars({ rating, size = 'sm', showValue, count, className }: Props) {
  const stars = getStarArray(rating)
  const sizeClass = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size]

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {stars.map((type, i) => (
          <Star
            key={i}
            className={cn(
              sizeClass,
              type === 'full' ? 'fill-amber-400 text-amber-400' :
              type === 'half' ? 'fill-amber-200 text-amber-400' :
              'fill-transparent text-slate-300'
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className={cn(
          'font-medium text-foreground',
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
        )}>
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className={cn(
          'text-muted-foreground',
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  )
}
