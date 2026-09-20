export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 rounded-lg bg-white/10" />
        <div className="h-4 w-96 rounded bg-white/5" />
      </div>

      {/* Content skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="mb-4 h-4 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-white/5" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-4 h-4 w-3/4 rounded bg-white/10" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="h-3 w-2/3 rounded bg-white/5" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4"
        >
          <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
