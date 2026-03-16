import { formatPrice, calculateDiscount } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  price: number
  salePrice?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showSavings?: boolean
  className?: string
}

export default function PriceBlock({ price, salePrice, size = 'md', showSavings, className }: Props) {
  const hasDiscount = salePrice !== undefined && salePrice < price
  const displayPrice = hasDiscount ? salePrice : price
  const discount = hasDiscount ? calculateDiscount(price, salePrice!) : 0
  const savings = hasDiscount ? price - salePrice! : 0

  const priceSize = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold',
  }[size]

  const originalSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }[size]

  return (
    <div className={cn('flex flex-wrap items-baseline gap-2', className)}>
      <span className={cn(priceSize, 'text-foreground')}>{formatPrice(displayPrice)}</span>
      {hasDiscount && (
        <>
          <span className={cn(originalSize, 'text-muted-foreground line-through')}>
            {formatPrice(price)}
          </span>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        </>
      )}
      {showSavings && hasDiscount && (
        <span className="text-xs text-emerald-600 w-full -mt-1">
          You save {formatPrice(savings)}
        </span>
      )}
    </div>
  )
}
