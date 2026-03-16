import { cn } from '@/lib/utils'
import type { OrderStatus, PaymentStatus } from '@/types'

const orderStatusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Order Placed', className: 'bg-slate-100 text-slate-700' },
  payment_confirmed: { label: 'Payment Confirmed', className: 'bg-blue-100 text-blue-700' },
  processing: { label: 'Processing', className: 'bg-amber-100 text-amber-700' },
  packed: { label: 'Packed', className: 'bg-amber-100 text-amber-700' },
  shipped: { label: 'Shipped', className: 'bg-blue-100 text-blue-700' },
  out_for_delivery: { label: 'Out for Delivery', className: 'bg-sky-100 text-sky-700' },
  delivered: { label: 'Delivered', className: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
  refunded: { label: 'Refunded', className: 'bg-slate-100 text-slate-700' },
}

const paymentStatusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
  paid: { label: 'Paid', className: 'bg-emerald-100 text-emerald-700' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-700' },
  refunded: { label: 'Refunded', className: 'bg-slate-100 text-slate-700' },
}

interface Props {
  type: 'order' | 'payment'
  status: OrderStatus | PaymentStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ type, status, size = 'sm' }: Props) {
  const config = type === 'order'
    ? orderStatusConfig[status as OrderStatus]
    : paymentStatusConfig[status as PaymentStatus]

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      config.className
    )}>
      {config.label}
    </span>
  )
}
