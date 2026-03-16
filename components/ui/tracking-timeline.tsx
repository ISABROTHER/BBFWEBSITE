import { cn, formatDateTime } from '@/lib/utils'
import type { TrackingEvent, OrderStatus } from '@/types'
import { ShoppingCart, CreditCard, Settings, Package, Truck, MapPin, CircleCheck as CheckCircle2, Circle as XCircle } from 'lucide-react'

const statusConfig: Record<OrderStatus, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: 'Order Placed', icon: ShoppingCart, color: 'text-slate-500' },
  payment_confirmed: { label: 'Payment Confirmed', icon: CreditCard, color: 'text-blue-500' },
  processing: { label: 'Processing', icon: Settings, color: 'text-amber-500' },
  packed: { label: 'Packed', icon: Package, color: 'text-amber-500' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-blue-500' },
  out_for_delivery: { label: 'Out for Delivery', icon: MapPin, color: 'text-sky-500' },
  delivered: { label: 'Delivered', icon: CheckCircle2, color: 'text-emerald-500' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-500' },
  refunded: { label: 'Refunded', icon: XCircle, color: 'text-slate-500' },
}

const orderedStatuses: OrderStatus[] = [
  'pending', 'payment_confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'
]

interface Props {
  events: TrackingEvent[]
  currentStatus: OrderStatus
}

export default function TrackingTimeline({ events, currentStatus }: Props) {
  const completedStatuses = events.filter(e => e.isCompleted).map(e => e.status)

  return (
    <div className="space-y-0">
      {orderedStatuses.map((status, index) => {
        const event = events.find(e => e.status === status)
        const config = statusConfig[status]
        const Icon = config.icon
        const isCompleted = completedStatuses.includes(status)
        const isCurrent = currentStatus === status && !isCompleted
        const isLast = index === orderedStatuses.length - 1

        return (
          <div key={status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all z-10',
                isCompleted
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                  : isCurrent
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-200 ring-4 ring-blue-100'
                    : 'bg-secondary text-muted-foreground'
              )}>
                <Icon className="w-4 h-4" />
              </div>
              {!isLast && (
                <div className={cn(
                  'w-0.5 flex-1 my-1 min-h-8',
                  isCompleted ? 'bg-emerald-300' : 'bg-border'
                )} />
              )}
            </div>
            <div className={cn('pb-6 flex-1', isLast && 'pb-0')}>
              <div className="flex items-start justify-between gap-2 mt-1.5">
                <div>
                  <p className={cn(
                    'text-sm font-semibold',
                    isCompleted ? 'text-foreground' : isCurrent ? 'text-blue-600' : 'text-muted-foreground'
                  )}>
                    {config.label}
                  </p>
                  {event?.message && (
                    <p className="text-xs text-muted-foreground mt-0.5">{event.message}</p>
                  )}
                  {event?.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </p>
                  )}
                </div>
                {event?.timestamp && (
                  <time className="text-xs text-muted-foreground flex-shrink-0 mt-0.5">
                    {formatDateTime(event.timestamp)}
                  </time>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
