export default function SkeletonLoader({ rows = 3, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-4 rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="border border-border bg-panel rounded-xl p-6 space-y-4">
      <div className="skeleton h-6 w-1/3 rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="skeleton h-16 rounded-lg" />
        <div className="skeleton h-16 rounded-lg" />
      </div>
    </div>
  )
}

export function ResultSkeleton() {
  return (
    <div className="border border-border bg-panel rounded-xl overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="skeleton h-5 w-5 rounded-full" />
          <div className="skeleton h-6 w-24 rounded" />
          <div className="skeleton h-4 w-20 rounded" />
        </div>
        <div className="skeleton h-7 w-1/2 mt-3 rounded" />
      </div>
      <div className="p-6 grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="skeleton h-3 w-24 rounded" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-4 w-full rounded" />
          ))}
        </div>
        <div className="space-y-3">
          <div className="skeleton h-3 w-32 rounded" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-4 w-full rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
