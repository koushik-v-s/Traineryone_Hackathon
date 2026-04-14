import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useEmployeesByJobTitle } from "../../hooks/useStats";
import WidgetCard from "../ui/WidgetCard";
import ChartTooltip from "../ui/ChartTooltip";
import { ChartSkeleton } from "../ui/Skeleton";

export default function EmployeesByJobTitle() {
  const { data, isLoading, isError } = useEmployeesByJobTitle();

  return (
    <WidgetCard title="Headcount by Job Title">
      {isLoading ? (
        <ChartSkeleton height="300px" />
      ) : isError || !data ? (
        <div className="flex items-center justify-center h-64 text-sm" style={{ color: "#64748b" }}>
          Failed to load job title data
        </div>
      ) : (
        <div className="flex-1 min-h-[300px] w-full relative">
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" barCategoryGap="16%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="job_title"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={130}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(6,182,212,0.06)" }} />
                <Bar dataKey="count" name="Count" fill="#06b6d4" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </WidgetCard>
  );
}
