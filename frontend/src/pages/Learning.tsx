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
import PageWrapper from "../components/layout/PageWrapper";
import WidgetCard from "../components/ui/WidgetCard";
import ChartTooltip from "../components/ui/ChartTooltip";
import Badge from "../components/ui/Badge";
import Drawer from "../components/ui/Drawer";
import { ChartSkeleton, TableSkeleton } from "../components/ui/Skeleton";
import { useLearningJourney } from "../hooks/useStats";
import type { CourseEntry } from "../hooks/useStats";
import { CheckCircle2, Circle, BookOpen } from "lucide-react";

const TOPIC_COLORS: Record<string, string> = {
  Leadership: "#7c3aed",
  Technical: "#06b6d4",
  Communication: "#f59e0b",
  Compliance: "#ef4444",
  Analytics: "#10b981",
  Management: "#8b5cf6",
  "Soft Skills": "#ec4899",
};

const ALL_TOPICS = Object.keys(TOPIC_COLORS);

export default function Learning() {
  const { data, isLoading, isError } = useLearningJourney();
  const [selectedCourse, setSelectedCourse] = useState<CourseEntry | null>(null);

  // Build the matrix
  const matrix = useMemo(() => {
    if (!data) return [];
    return data.employees.map((emp) => {
      const topicsDone = new Set(emp.courses_taken.map((c) => c.topic));
      return {
        id: emp.id,
        name: emp.name,
        job_title: emp.job_title,
        topics: ALL_TOPICS.reduce(
          (acc, t) => ({ ...acc, [t]: topicsDone.has(t) }),
          {} as Record<string, boolean>
        ),
        courses_taken: emp.courses_taken,
      };
    });
  }, [data]);

  return (
    <PageWrapper
      title="Learning & Development"
      subtitle="Course completion matrix and topic popularity"
    >
      {/* ── Topic Popularity (full width) ─────────────────────────── */}
      <div className="mb-6">
        <WidgetCard title="Topic Popularity">
          {isLoading ? (
            <ChartSkeleton height="300px" />
          ) : isError || !data ? (
            <div className="flex items-center justify-center h-48 text-sm" style={{ color: "#64748b" }}>
              Failed to load topic data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topic_summary} barCategoryGap="18%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="topic"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(124,58,237,0.06)" }} />
                <Bar dataKey="total_employees" name="Employees" radius={[8, 8, 0, 0]}>
                  {data.topic_summary.map((entry) => (
                    <Cell key={entry.topic} fill={TOPIC_COLORS[entry.topic] || "#7c3aed"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </WidgetCard>
      </div>

      {/* ── Employee × Topic Matrix ───────────────────────────────── */}
      <WidgetCard title="Employee — Course Matrix" noPadding>
        {isLoading ? (
          <div className="p-6"><TableSkeleton rows={10} /></div>
        ) : isError || !matrix.length ? (
          <div className="flex items-center justify-center h-48 text-sm" style={{ color: "#64748b" }}>
            No data
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th
                    className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider sticky left-0"
                    style={{ color: "#64748b", background: "#16161f", minWidth: "180px" }}
                  >
                    Employee
                  </th>
                  {ALL_TOPICS.map((t) => (
                    <th
                      key={t}
                      className="text-center py-3 px-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#64748b", background: "#16161f" }}
                    >
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.slice(0, 30).map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(124,58,237,0.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td
                      className="py-2.5 px-4 sticky left-0"
                      style={{ background: "#16161f" }}
                    >
                      <div className="font-medium" style={{ color: "#f1f5f9" }}>
                        {row.name}
                      </div>
                      <div className="text-xs" style={{ color: "#64748b" }}>
                        {row.job_title}
                      </div>
                    </td>
                    {ALL_TOPICS.map((t) => (
                      <td key={t} className="text-center py-2.5 px-3">
                        {row.topics[t] ? (
                          <CheckCircle2
                            size={18}
                            color={TOPIC_COLORS[t]}
                            className="mx-auto cursor-pointer transition-transform hover:scale-125"
                            onClick={() => {
                              const c = row.courses_taken.find(
                                (c) => c.topic === t
                              );
                              if (c) setSelectedCourse(c);
                            }}
                          />
                        ) : (
                          <Circle
                            size={18}
                            color="rgba(255,255,255,0.08)"
                            className="mx-auto"
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </WidgetCard>

      {/* ── Course Detail Drawer ──────────────────────────────────── */}
      <Drawer
        open={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        title="Course Details"
      >
        {selectedCourse && (
          <div className="space-y-6">
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: "rgba(124,58,237,0.15)" }}
              >
                <BookOpen size={24} color="#7c3aed" />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: "#f1f5f9" }}>
                {selectedCourse.title}
              </h3>
              <Badge variant="violet">{selectedCourse.topic}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="Course ID" value={selectedCourse.course_id} />
              <StatBox label="Score" value={`${selectedCourse.score}%`} />
              <StatBox label="Completed" value={selectedCourse.completed_date} />
              <StatBox
                label="Status"
                value={selectedCourse.score >= 70 ? "Passed" : "Needs Review"}
              />
            </div>
            <div className="flex flex-col items-center py-4">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={selectedCourse.score >= 80 ? "#10b981" : "#f59e0b"}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${selectedCourse.score * 2.64} 264`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold" style={{ color: "#f1f5f9" }}>
                    {selectedCourse.score}
                  </span>
                </div>
              </div>
              <span className="text-xs mt-2" style={{ color: "#64748b" }}>
                Course Score
              </span>
            </div>
          </div>
        )}
      </Drawer>
    </PageWrapper>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="p-3 rounded-xl"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}
    >
      <span className="text-xs block mb-1" style={{ color: "#64748b" }}>
        {label}
      </span>
      <span className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>
        {value}
      </span>
    </div>
  );
}
