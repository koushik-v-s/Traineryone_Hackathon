import { useTopPerformers } from "../../hooks/useStats";
import WidgetCard from "../ui/WidgetCard";
import { TableSkeleton } from "../ui/Skeleton";
import Badge from "../ui/Badge";
import { Trophy } from "lucide-react";

export default function TopPerformers() {
  const { data, isLoading, isError } = useTopPerformers();

  return (
    <WidgetCard title="Top 10 Performers">
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : isError || !data ? (
        <div className="flex items-center justify-center h-64 text-sm" style={{ color: "#64748b" }}>
          Failed to load performers
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{
                background:
                  p.rank <= 3
                    ? "rgba(124,58,237,0.08)"
                    : "rgba(255,255,255,0.02)",
                border:
                  p.rank === 1
                    ? "1px solid rgba(124,58,237,0.3)"
                    : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(124,58,237,0.12)";
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  p.rank <= 3
                    ? "rgba(124,58,237,0.08)"
                    : "rgba(255,255,255,0.02)";
                e.currentTarget.style.borderColor =
                  p.rank === 1 ? "rgba(124,58,237,0.3)" : "transparent";
              }}
            >
              {/* Rank */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background:
                    p.rank === 1
                      ? "linear-gradient(135deg, #f59e0b, #f97316)"
                      : p.rank === 2
                      ? "linear-gradient(135deg, #94a3b8, #cbd5e1)"
                      : p.rank === 3
                      ? "linear-gradient(135deg, #d97706, #b45309)"
                      : "rgba(255,255,255,0.06)",
                }}
              >
                {p.rank <= 3 ? (
                  <Trophy size={14} color="#fff" />
                ) : (
                  <span className="text-xs font-bold" style={{ color: "#94a3b8" }}>
                    {p.rank}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold truncate" style={{ color: "#f1f5f9" }}>
                    {p.name}
                  </span>
                  {p.rank === 1 && <Badge variant="warning" size="sm">★ Top</Badge>}
                </div>
                <div className="text-xs truncate" style={{ color: "#64748b" }}>
                  {p.job_title} • {p.department}
                </div>
              </div>

              {/* Score bar */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(p.performance_score / 5) * 100}%`,
                      background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
                    }}
                  />
                </div>
                <span className="text-sm font-bold w-8 text-right" style={{ color: "#f1f5f9" }}>
                  {p.performance_score}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetCard>
  );
}
