import { useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import PageWrapper from "../components/layout/PageWrapper";
import WidgetCard from "../components/ui/WidgetCard";
import { ChartSkeleton, TableSkeleton } from "../components/ui/Skeleton";
import Badge from "../components/ui/Badge";
import {
  useCompensationByDept,
  usePerfVsCompensation,
} from "../hooks/useStats";

const DEPT_COLORS: Record<string, string> = {
  Engineering: "#7c3aed",
  Marketing: "#f59e0b",
  Sales: "#06b6d4",
  HR: "#10b981",
  Product: "#ec4899",
  Design: "#8b5cf6",
  Finance: "#ef4444",
};

export default function Compensation() {
  const compByDept = useCompensationByDept();
  const perfVsComp = usePerfVsCompensation();

  // Percentile breakdown
  const percentiles = useMemo(() => {
    if (!perfVsComp.data) return [];
    const sorted = [...perfVsComp.data].sort(
      (a, b) => a.compensation_usd - b.compensation_usd
    );
    const n = sorted.length;
    const p = (pct: number) => sorted[Math.floor((pct / 100) * (n - 1))];

    return [
      { label: "10th", ...p(10) },
      { label: "25th", ...p(25) },
      { label: "50th (Median)", ...p(50) },
      { label: "75th", ...p(75) },
      { label: "90th", ...p(90) },
    ];
  }, [perfVsComp.data]);

  const departments = perfVsComp.data
    ? [...new Set(perfVsComp.data.map((d) => d.department))]
    : [];

  return (
    <PageWrapper
      title="Compensation Analytics"
      subtitle="Department comparisons, scatter analysis, and percentile breakdowns"
    >
      {/* ── Department Comparison (full width) ────────────────────── */}
      <div className="mb-6">
        <WidgetCard title="Department Compensation Comparison">
          {compByDept.isLoading ? (
            <ChartSkeleton height="350px" />
          ) : compByDept.isError || !compByDept.data ? (
            <div className="flex items-center justify-center h-64 text-sm" style={{ color: "#64748b" }}>
              Failed to load data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={compByDept.data} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="department"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    return (
                      <div
                        className="rounded-xl px-4 py-3 shadow-xl"
                        style={{ background: "#1e1e2e", border: "1px solid rgba(124,58,237,0.3)" }}
                      >
                        <p className="text-sm font-semibold mb-1" style={{ color: "#f1f5f9" }}>{label}</p>
                        <p className="text-xs" style={{ color: "#a78bfa" }}>
                          Avg: ${d?.avg_compensation?.toLocaleString()}
                        </p>
                        <p className="text-xs" style={{ color: "#10b981" }}>
                          Max: ${d?.max_compensation?.toLocaleString()}
                        </p>
                        <p className="text-xs" style={{ color: "#f59e0b" }}>
                          Min: ${d?.min_compensation?.toLocaleString()}
                        </p>
                      </div>
                    );
                  }}
                  cursor={{ fill: "rgba(124,58,237,0.06)" }}
                />
                <Bar
                  dataKey="avg_compensation"
                  name="Avg Compensation"
                  fill="#7c3aed"
                  radius={[6, 6, 0, 0]}
                  fillOpacity={0.8}
                />
                <Line type="monotone" dataKey="max_compensation" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: "#10b981" }} name="Max" />
                <Line type="monotone" dataKey="min_compensation" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: "#f59e0b" }} name="Min" />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </WidgetCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* ── Scatter Plot ─────────────────────────────────────────── */}
        <WidgetCard title="Performance vs Compensation">
          {perfVsComp.isLoading ? (
            <ChartSkeleton height="320px" />
          ) : perfVsComp.isError || !perfVsComp.data ? (
            <div className="flex items-center justify-center h-64 text-sm" style={{ color: "#64748b" }}>
              Failed to load data
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={320}>
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    type="number" dataKey="compensation_usd" name="Compensation"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                    tickLine={false}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="number" dataKey="performance_score" name="Performance"
                    domain={[0, 5]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false} tickLine={false}
                  />
                  <ZAxis range={[60, 60]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload;
                      return (
                        <div
                          className="rounded-xl px-4 py-3 shadow-xl"
                          style={{ background: "#1e1e2e", border: "1px solid rgba(124,58,237,0.3)" }}
                        >
                          <p className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>{d?.name}</p>
                          <p className="text-xs" style={{ color: "#94a3b8" }}>{d?.job_title} • {d?.department}</p>
                          <p className="text-xs mt-1" style={{ color: "#a78bfa" }}>
                            Score: {d?.performance_score} | ${d?.compensation_usd?.toLocaleString()}
                          </p>
                        </div>
                      );
                    }}
                  />
                  {departments.map((dept) => (
                    <Scatter
                      key={dept} name={dept}
                      data={perfVsComp.data!.filter((d) => d.department === dept)}
                      fill={DEPT_COLORS[dept] || "#7c3aed"} fillOpacity={0.7}
                    />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {departments.map((dept) => (
                  <div key={dept} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: DEPT_COLORS[dept] || "#7c3aed" }} />
                    <span style={{ color: "#94a3b8" }}>{dept}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </WidgetCard>

        {/* ── Percentile Table ─────────────────────────────────────── */}
        <WidgetCard title="Compensation Percentile Breakdown">
          {perfVsComp.isLoading ? (
            <TableSkeleton rows={5} />
          ) : !percentiles.length ? (
            <div className="flex items-center justify-center h-64 text-sm" style={{ color: "#64748b" }}>
              No data
            </div>
          ) : (
            <div className="space-y-3">
              {percentiles.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center justify-between p-4 rounded-xl transition-all"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)")}
                >
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>
                      {p.label} Percentile
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                      {p.name} • {p.department}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: "#f1f5f9" }}>
                      ${p.compensation_usd.toLocaleString()}
                    </div>
                    <Badge
                      variant={
                        p.performance_score >= 4
                          ? "success"
                          : p.performance_score >= 3
                          ? "cyan"
                          : "warning"
                      }
                    >
                      Score: {p.performance_score}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </WidgetCard>
      </div>
    </PageWrapper>
  );
}
