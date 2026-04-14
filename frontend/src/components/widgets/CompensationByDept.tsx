import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useCompensationByDept } from "../../hooks/useStats";
import WidgetCard from "../ui/WidgetCard";
import { ChartSkeleton } from "../ui/Skeleton";

export default function CompensationByDept() {
  const { data, isLoading, isError } = useCompensationByDept();

  return (
    <WidgetCard title="Compensation Spread by Department">
      {isLoading ? (
        <ChartSkeleton height="280px" />
      ) : isError || !data ? (
        <div className="flex items-center justify-center h-64 text-sm" style={{ color: "#64748b" }}>
          Failed to load compensation data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data} barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="department"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
              tickLine={false}
              angle={-15}
              textAnchor="end"
              height={50}
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
                    style={{
                      background: "#1e1e2e",
                      border: "1px solid rgba(124,58,237,0.3)",
                    }}
                  >
                    <p className="text-sm font-semibold mb-1" style={{ color: "#f1f5f9" }}>
                      {label}
                    </p>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>
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
            <Line
              type="monotone"
              dataKey="max_compensation"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4, fill: "#10b981" }}
              name="Max"
            />
            <Line
              type="monotone"
              dataKey="min_compensation"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 4, fill: "#f59e0b" }}
              name="Min"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </WidgetCard>
  );
}
