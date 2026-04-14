import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { usePerformanceDistribution } from "../../hooks/useStats";
import WidgetCard from "../ui/WidgetCard";
import ChartTooltip from "../ui/ChartTooltip";
import { ChartSkeleton } from "../ui/Skeleton";

const GRADIENT_COLORS = ["#7c3aed", "#6d28d9", "#2563eb", "#06b6d4"];

export default function PerformanceDistribution() {
  const { data, isLoading, isError } = usePerformanceDistribution();

  return (
    <WidgetCard title="Performance Distribution">
      {isLoading ? (
        <ChartSkeleton height="260px" />
      ) : isError || !data ? (
        <div className="flex items-center justify-center h-64 text-sm" style={{ color: "#64748b" }}>
          Failed to load performance data
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold" style={{ color: "#f1f5f9" }}>
              {data.total}
            </span>
            <span className="text-sm" style={{ color: "#64748b" }}>
              total employees
            </span>
          </div>
          <div className="flex-1 min-h-[240px] w-full mt-auto mb-auto relative">
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.distribution} barCategoryGap="20%">
                  <defs>
                    <linearGradient id="perfGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="range"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(124,58,237,0.08)" }} />
                  <Bar dataKey="count" name="Employees" radius={[8, 8, 0, 0]}>
                    {data.distribution.map((_, i) => (
                      <Cell key={i} fill={GRADIENT_COLORS[i % GRADIENT_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </WidgetCard>
  );
}
