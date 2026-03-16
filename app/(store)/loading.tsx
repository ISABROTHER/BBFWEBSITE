export default function StoreLoading() {
  return (
    <div className="min-h-screen">
      <div className="section-container py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-border">
              <div className="shimmer aspect-square" />
              <div className="p-4 space-y-3">
                <div className="shimmer h-3 rounded-full w-1/2" />
                <div className="shimmer h-4 rounded-full" />
                <div className="shimmer h-4 rounded-full w-3/4" />
                <div className="shimmer h-8 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
