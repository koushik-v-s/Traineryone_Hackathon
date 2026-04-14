import { useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import { useEmployees } from "../hooks/useStats";
import type { Employee, CourseEntry } from "../hooks/useStats";
import Drawer from "../components/ui/Drawer";
import Badge from "../components/ui/Badge";
import { TableSkeleton } from "../components/ui/Skeleton";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
} from "lucide-react";

const LOCATIONS = ["", "New York", "San Francisco", "London", "Bangalore", "Singapore"];
const DEPARTMENTS = ["", "Engineering", "Marketing", "Sales", "HR", "Product", "Design", "Finance"];

export default function Employees() {
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [minScore, setMinScore] = useState<number | undefined>();
  const [maxScore, setMaxScore] = useState<number | undefined>();
  const [selected, setSelected] = useState<Employee | null>(null);

  const { data, isLoading, isError } = useEmployees({
    page,
    limit: 15,
    location: location || undefined,
    department: department || undefined,
    min_score: minScore,
    max_score: maxScore,
  });

  const scoreBadgeVariant = (score: number) => {
    if (score >= 4) return "success";
    if (score >= 3) return "cyan";
    if (score >= 2) return "warning";
    return "danger";
  };

  return (
    <PageWrapper
      title="Employees"
      subtitle="Browse and filter the employee directory"
    >
      {/* ── Filters ───────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap gap-3 mb-6 p-4 rounded-2xl"
        style={{
          background: "rgba(22,22,31,0.6)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Select
          label="Location"
          value={location}
          onChange={(v) => { setLocation(v); setPage(1); }}
          options={LOCATIONS}
        />
        <Select
          label="Department"
          value={department}
          onChange={(v) => { setDepartment(v); setPage(1); }}
          options={DEPARTMENTS}
        />
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium" style={{ color: "#64748b" }}>
            Score
          </label>
          <input
            type="number"
            min={0}
            max={5}
            step={0.5}
            placeholder="Min"
            value={minScore ?? ""}
            onChange={(e) => {
              setMinScore(e.target.value ? parseFloat(e.target.value) : undefined);
              setPage(1);
            }}
            className="w-16 px-2 py-1.5 rounded-lg text-xs outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#f1f5f9",
            }}
          />
          <span className="text-xs" style={{ color: "#64748b" }}>–</span>
          <input
            type="number"
            min={0}
            max={5}
            step={0.5}
            placeholder="Max"
            value={maxScore ?? ""}
            onChange={(e) => {
              setMaxScore(e.target.value ? parseFloat(e.target.value) : undefined);
              setPage(1);
            }}
            className="w-16 px-2 py-1.5 rounded-lg text-xs outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#f1f5f9",
            }}
          />
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────── */}
      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={10} />
          </div>
        ) : isError || !data ? (
          <div className="flex items-center justify-center h-64 text-sm" style={{ color: "#64748b" }}>
            Failed to load employee data
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Name", "Job Title", "Department", "Location", "Score", "Compensation", ""].map(
                      (h) => (
                        <th
                          key={h || "action"}
                          className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider"
                          style={{ color: "#64748b", background: "rgba(255,255,255,0.02)" }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((emp) => (
                    <tr
                      key={emp.id}
                      className="transition-colors cursor-pointer"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                      onClick={() => setSelected(emp)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(124,58,237,0.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td className="py-3 px-4 font-medium" style={{ color: "#f1f5f9" }}>
                        {emp.name}
                      </td>
                      <td className="py-3 px-4" style={{ color: "#94a3b8" }}>
                        {emp.job_title}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="violet">{emp.department}</Badge>
                      </td>
                      <td className="py-3 px-4" style={{ color: "#94a3b8" }}>
                        {emp.location}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={scoreBadgeVariant(emp.performance_score)}>
                          {emp.performance_score}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium" style={{ color: "#f1f5f9" }}>
                        ${emp.compensation_usd.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <ChevronRight size={16} color="#64748b" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-xs" style={{ color: "#64748b" }}>
                Page {data.pagination.page} of {data.pagination.totalPages} •{" "}
                {data.pagination.total} employees
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-30"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "#f1f5f9",
                  }}
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  disabled={page >= data.pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-30"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "#f1f5f9",
                  }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Employee Detail Drawer ────────────────────────────────── */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Employee Profile"
      >
        {selected && <EmployeeProfile employee={selected} />}
      </Drawer>
    </PageWrapper>
  );
}

// ── Sub-components ──────────────────────────────────────────────────
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium" style={{ color: "#64748b" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 rounded-lg text-xs outline-none cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#f1f5f9",
        }}
      >
        <option value="" style={{ background: "#16161f" }}>All</option>
        {options
          .filter((o) => o)
          .map((o) => (
            <option key={o} value={o} style={{ background: "#16161f" }}>
              {o}
            </option>
          ))}
      </select>
    </div>
  );
}

function EmployeeProfile({ employee: e }: { employee: Employee }) {
  const scorePercent = (e.performance_score / 5) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            color: "#fff",
          }}
        >
          {e.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <h3 className="text-lg font-semibold" style={{ color: "#f1f5f9" }}>
          {e.name}
        </h3>
        <p className="text-sm" style={{ color: "#94a3b8" }}>
          {e.job_title}
        </p>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3">
        <InfoItem icon={<Mail size={14} />} label="Email" value={e.email} span={2} />
        <InfoItem icon={<MapPin size={14} />} label="Location" value={e.location} />
        <InfoItem icon={<Calendar size={14} />} label="Hire Date" value={new Date(e.hire_date).toLocaleDateString()} />
      </div>

      {/* Performance ring */}
      <div className="flex flex-col items-center py-4">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#perfRingGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${scorePercent * 2.64} 264`}
            />
            <defs>
              <linearGradient id="perfRingGrad">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold" style={{ color: "#f1f5f9" }}>
              {e.performance_score}
            </span>
          </div>
        </div>
        <span className="text-xs mt-2" style={{ color: "#64748b" }}>
          Performance Score
        </span>
      </div>

      {/* Compensation */}
      <div
        className="p-4 rounded-xl text-center"
        style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}
      >
        <span className="text-xl font-bold" style={{ color: "#10b981" }}>
          ${e.compensation_usd.toLocaleString()}
        </span>
        <p className="text-xs mt-1" style={{ color: "#64748b" }}>
          Annual Compensation (USD)
        </p>
      </div>

      {/* Courses */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} color="#7c3aed" />
          <span className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>
            Courses Taken ({e.courses_taken.length})
          </span>
        </div>
        <div className="space-y-2">
          {e.courses_taken.map((c: CourseEntry) => (
            <div
              key={c.course_id}
              className="p-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: "#f1f5f9" }}>
                  {c.title}
                </span>
                <Badge variant={c.score >= 80 ? "success" : "warning"}>
                  {c.score}%
                </Badge>
              </div>
              <div className="flex gap-3 mt-1 text-xs" style={{ color: "#64748b" }}>
                <span>{c.topic}</span>
                <span>{c.completed_date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
  span = 1,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  span?: number;
}) {
  return (
    <div
      className={`p-3 rounded-xl ${span === 2 ? "col-span-2" : ""}`}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span style={{ color: "#64748b" }}>{icon}</span>
        <span className="text-xs" style={{ color: "#64748b" }}>
          {label}
        </span>
      </div>
      <span className="text-sm font-medium break-all" style={{ color: "#f1f5f9" }}>
        {value}
      </span>
    </div>
  );
}
