import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  loading?: boolean;
}

export default function MetricCard({
  label,
  value,
  icon,
  trend,
  loading,
}: MetricCardProps) {
  if (loading) {
    return (
      <div className="rounded-2xl p-6" style={{ background: "#1e1e2e" }}>
        <div className="skeleton h-4 w-20 mb-3" />
        <div className="skeleton h-8 w-28 mb-2" />
        <div className="skeleton h-3 w-16" />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] group"
      style={{
        background: "#1e1e2e",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium" style={{ color: "#94a3b8" }}>
          {label}
        </span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: "rgba(124,58,237,0.15)" }}
        >
          {icon}
        </div>
      </div>
      <div
        className="text-3xl font-bold tracking-tight mb-1"
        style={{ color: "#f1f5f9" }}
      >
        {value}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs font-medium">
          <span
            style={{
              color: trend.positive ? "#10b981" : "#ef4444",
            }}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
          <span style={{ color: "#64748b" }}>vs last quarter</span>
        </div>
      )}
    </div>
  );
}
