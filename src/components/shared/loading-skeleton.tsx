export function LoadingSkeleton({
  className = "",
  lines = 3,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="animate-shimmer h-4 rounded-md"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`glass animate-shimmer rounded-xl p-6 ${className}`}>
      <div className="space-y-3">
        <div className="animate-shimmer h-5 w-1/3 rounded-md" />
        <div className="animate-shimmer h-4 w-2/3 rounded-md" />
        <div className="animate-shimmer h-4 w-1/2 rounded-md" />
      </div>
    </div>
  );
}
