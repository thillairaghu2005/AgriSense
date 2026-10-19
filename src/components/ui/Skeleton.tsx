export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-[var(--color-surface-3)] rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-[var(--color-surface-3)] rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-[var(--color-surface-3)] rounded-xl" />
    </div>
  );
}

export function CardSkeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-[var(--color-surface-3)] rounded-xl animate-pulse ${className}`} />;
}

export function TextSkeleton({ width = 'w-32', className = '' }: { width?: string; className?: string }) {
  return <div className={`h-4 bg-[var(--color-surface-3)] rounded animate-pulse ${width} ${className}`} />;
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-3)]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[var(--color-surface-3)] rounded w-2/3" />
            <div className="h-3 bg-[var(--color-surface-3)] rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
