import { useState, useMemo } from "react";
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
import { useLearningJourney } from "../../hooks/useStats";
import WidgetCard from "../ui/WidgetCard";
import ChartTooltip from "../ui/ChartTooltip";
import { ChartSkeleton, TableSkeleton } from "../ui/Skeleton";
import { Search } from "lucide-react";

const TOPIC_COLORS: Record<string, string> = {
  Leadership: "#7c3aed",
  Technical: "#06b6d4",
  Communication: "#f59e0b",
  Compliance: "#ef4444",
  Analytics: "#10b981",
  Management: "#8b5cf6",
  "Soft Skills": "#ec4899",
};

export default function LearningJourney() {
  const { data, isLoading, isError } = useLearningJourney();
  const [tab, setTab] = useState<"courses" | "topics">("courses");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.employees.filter(
      (e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.job_title.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const tabs = [
    { key: "courses" as const, label: "Employee Courses" },
    { key: "topics" as const, label: "Popular Topics" },
  ];

  return (
    <WidgetCard title="Learning Journey" className="col-span-full lg:col-span-2">
      {isLoading ? (
        <div className="space-y-4">
          <TableSkeleton rows={5} />
        </div>
      ) : isError || !data ? (
        <div className="flex items-center justify-center h-64 text-sm" style={{ color: "#64748b" }}>
          Failed to load learning data
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer"
                style={{
                  background: tab === t.key ? "rgba(124,58,237,0.2)" : "transparent",
                  color: tab === t.key ? "#a78bfa" : "#64748b",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "courses" ? (
            <>
              {/* Search */}
              <div className="relative mb-4">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  color="#64748b"
                />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "#f1f5f9",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(124,58,237,0.4)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.06)")
                  }
                />
              </div>
              {/* Table */}
              <div className="overflow-x-auto" style={{ maxHeight: "320px", overflowY: "auto" }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["Name", "Job Title", "Courses", "Last Course"].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left py-2.5 px-3 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "#64748b" }}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 20).map((emp) => {
                      const lastCourse =
                        emp.courses_taken.length > 0
                          ? emp.courses_taken.sort(
                              (a, b) =>
                                new Date(b.completed_date).getTime() -
                                new Date(a.completed_date).getTime()
                            )[0]
                          : null;
                      return (
                        <tr
                          key={emp.id}
                          className="transition-colors"
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.03)",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(255,255,255,0.02)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <td className="py-2.5 px-3 font-medium" style={{ color: "#f1f5f9" }}>
                            {emp.name}
                          </td>
                          <td className="py-2.5 px-3" style={{ color: "#94a3b8" }}>
                            {emp.job_title}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={{
                                background: "rgba(124,58,237,0.15)",
                                color: "#a78bfa",
                              }}
                            >
                              {emp.courses_taken.length}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-xs" style={{ color: "#94a3b8" }}>
                            {lastCourse ? lastCourse.title : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.topic_summary} barCategoryGap="18%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="topic"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(124,58,237,0.06)" }} />
                <Bar dataKey="total_employees" name="Employees" radius={[8, 8, 0, 0]}>
                  {data.topic_summary.map((entry) => (
                    <Cell
                      key={entry.topic}
                      fill={TOPIC_COLORS[entry.topic] || "#7c3aed"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </>
      )}
    </WidgetCard>
  );
}
