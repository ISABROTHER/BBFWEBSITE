import { cn } from '@/lib/utils'

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl overflow-hidden bg-white border border-border', className)}>
      <div className="aspect-square shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 shimmer rounded" />
        <div className="h-4 w-full shimmer rounded" />
        <div className="h-3 w-3/4 shimmer rounded" />
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 shimmer rounded" />
          <div className="h-8 w-8 shimmer rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonProductRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex gap-4 p-4 border-b border-border', className)}>
      <div className="w-20 h-20 rounded-xl shimmer flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 shimmer rounded" />
        <div className="h-3 w-1/2 shimmer rounded" />
        <div className="h-5 w-24 shimmer rounded" />
      </div>
    </div>
  )
}
