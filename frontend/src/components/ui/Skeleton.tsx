interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
}

export function Skeleton({ className = "", height = "16px" }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ height, width: "100%" }}
    />
  );
}

export function ChartSkeleton({ height = "250px" }: { height?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="skeleton" style={{ height, borderRadius: "12px" }} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: "40px" }} />
      ))}
    </div>
  );
}
