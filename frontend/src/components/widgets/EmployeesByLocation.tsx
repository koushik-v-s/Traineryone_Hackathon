import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useEmployeesByLocation } from "../../hooks/useStats";
import WidgetCard from "../ui/WidgetCard";
import { ChartSkeleton } from "../ui/Skeleton";

const COLORS = ["#7c3aed", "#06b6d4", "#f59e0b", "#10b981", "#ef4444"];

export default function EmployeesByLocation() {
  const { data, isLoading, isError } = useEmployeesByLocation();

  const total = data?.reduce((sum, d) => sum + d.count, 0) ?? 0;

  return (
    <WidgetCard title="Headcount by Location">
      {isLoading ? (
        <ChartSkeleton height="280px" />
      ) : isError || !data ? (
        <div className="flex items-center justify-center h-64 text-sm" style={{ color: "#64748b" }}>
          Failed to load location data
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex-1 min-h-[220px] w-full relative">
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    dataKey="count"
                    nameKey="location"
                    paddingAngle={3}
                    stroke="none"
                  >
                    {data.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div
                          className="rounded-xl px-4 py-3 shadow-xl"
                          style={{
                            background: "#1e1e2e",
                            border: "1px solid rgba(124,58,237,0.3)",
                          }}
                        >
                          <p className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>
                            {d.location}
                          </p>
                          <p className="text-xs" style={{ color: "#94a3b8" }}>
                            {d.count} employees ({((d.count / total) * 100).toFixed(1)}%)
                          </p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {data.map((d, i) => (
              <div key={d.location} className="flex items-center gap-1.5 text-xs">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span style={{ color: "#94a3b8" }}>
                  {d.location}
                </span>
                <span className="font-semibold" style={{ color: "#f1f5f9" }}>
                  {d.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </WidgetCard>
  );
}
