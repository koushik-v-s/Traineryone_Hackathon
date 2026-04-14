import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ZAxis,
} from "recharts";
import { usePerfVsCompensation } from "../../hooks/useStats";
import WidgetCard from "../ui/WidgetCard";
import { ChartSkeleton } from "../ui/Skeleton";

const DEPT_COLORS: Record<string, string> = {
  Engineering: "#7c3aed",
  Marketing: "#f59e0b",
  Sales: "#06b6d4",
  HR: "#10b981",
  Product: "#ec4899",
  Design: "#8b5cf6",
  Finance: "#ef4444",
};

export default function PerfVsCompensation() {
  const { data, isLoading, isError } = usePerfVsCompensation();

  // Group by department for color-coded scatter
  const departments = data
    ? [...new Set(data.map((d) => d.department))]
    : [];

  return (
    <WidgetCard title="Performance vs Compensation">
      {isLoading ? (
        <ChartSkeleton height="300px" />
      ) : isError || !data ? (
        <div className="flex items-center justify-center h-64 text-sm" style={{ color: "#64748b" }}>
          Failed to load scatter data
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                type="number"
                dataKey="compensation_usd"
                name="Compensation"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                tickLine={false}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="number"
                dataKey="performance_score"
                name="Performance"
                domain={[0, 5]}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <ZAxis range={[60, 60]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  return (
                    <div
                      className="rounded-xl px-4 py-3 shadow-xl"
                      style={{
                        background: "#1e1e2e",
                        border: "1px solid rgba(124,58,237,0.3)",
                      }}
                    >
                      <p className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>
                        {d?.name}
                      </p>
                      <p className="text-xs" style={{ color: "#94a3b8" }}>
                        {d?.job_title} • {d?.department}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#a78bfa" }}>
                        Score: {d?.performance_score} | ${d?.compensation_usd?.toLocaleString()}
                      </p>
                    </div>
                  );
                }}
              />
              {departments.map((dept) => (
                <Scatter
                  key={dept}
                  name={dept}
                  data={data.filter((d) => d.department === dept)}
                  fill={DEPT_COLORS[dept] || "#7c3aed"}
                  fillOpacity={0.7}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-3 justify-center">
            {departments.map((dept) => (
              <div key={dept} className="flex items-center gap-1.5 text-xs">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: DEPT_COLORS[dept] || "#7c3aed" }}
                />
                <span style={{ color: "#94a3b8" }}>{dept}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </WidgetCard>
  );
}
