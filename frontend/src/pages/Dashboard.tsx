import { Users, TrendingUp, DollarSign, BookOpen } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import MetricCard from "../components/ui/MetricCard";
import ElectricBorder from "../components/ui/ElectricBorder";
import PerformanceDistribution from "../components/widgets/PerformanceDistribution";
import EmployeesByLocation from "../components/widgets/EmployeesByLocation";
import EmployeesByJobTitle from "../components/widgets/EmployeesByJobTitle";
import TopPerformers from "../components/widgets/TopPerformers";
import {
  usePerformanceDistribution,
  usePerfVsCompensation,
  useLearningJourney,
} from "../hooks/useStats";

export default function Dashboard() {
  const perfDist = usePerformanceDistribution();
  const perfVsComp = usePerfVsCompensation();
  const learning = useLearningJourney();

  const totalEmployees = perfDist.data?.total ?? 0;
  const avgPerf =
    perfVsComp.data && perfVsComp.data.length > 0
      ? (
          perfVsComp.data.reduce((s, e) => s + e.performance_score, 0) /
          perfVsComp.data.length
        ).toFixed(1)
      : "—";
  const avgComp =
    perfVsComp.data && perfVsComp.data.length > 0
      ? `$${Math.round(
          perfVsComp.data.reduce((s, e) => s + e.compensation_usd, 0) /
            perfVsComp.data.length
        ).toLocaleString()}`
      : "—";
  const totalCourses =
    learning.data?.employees.reduce(
      (s, e) => s + e.courses_taken.length,
      0
    ) ?? 0;

  const isLoading = perfDist.isLoading || perfVsComp.isLoading || learning.isLoading;

  return (
    <PageWrapper
      title="Overview Dashboard"
      subtitle="Executive summary of workforce metrics"
    >
      {/* ── Summary Stats Row with Electric Border ─────────────────── */}
      <ElectricBorder
        color1="#7c3aed"
        color2="#06b6d4"
        color3="#f59e0b"
        speed={2}
        borderWidth={1}
        borderRadius={20}
        className="mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          <MetricCard
            label="Total Employees"
            value={totalEmployees}
            icon={<Users size={20} color="#7c3aed" />}
            trend={{ value: "12%", positive: true }}
            loading={isLoading}
          />
          <MetricCard
            label="Avg Performance"
            value={avgPerf}
            icon={<TrendingUp size={20} color="#06b6d4" />}
            trend={{ value: "0.3", positive: true }}
            loading={isLoading}
          />
          <MetricCard
            label="Avg Compensation"
            value={avgComp}
            icon={<DollarSign size={20} color="#10b981" />}
            trend={{ value: "5%", positive: true }}
            loading={isLoading}
          />
          <MetricCard
            label="Courses Completed"
            value={totalCourses}
            icon={<BookOpen size={20} color="#f59e0b" />}
            trend={{ value: "24", positive: true }}
            loading={isLoading}
          />
        </div>
      </ElectricBorder>

      {/* ── Refined Bento Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        <ElectricBorder className="lg:col-span-1" speed={2.5}>
          <PerformanceDistribution />
        </ElectricBorder>
        
        <ElectricBorder className="lg:col-span-1" color1="#06b6d4" color2="#7c3aed" speed={3}>
          <EmployeesByLocation />
        </ElectricBorder>
        
        {/* Top Performers spans 2 rows on the right side */}
        <ElectricBorder className="lg:col-span-1 lg:row-span-2" color1="#f59e0b" color2="#7c3aed" color3="#06b6d4" speed={2}>
          <TopPerformers />
        </ElectricBorder>

        {/* Job Title spans 2 columns on the bottom left */}
        <ElectricBorder className="lg:col-span-2" color1="#10b981" color2="#06b6d4" speed={3}>
          <EmployeesByJobTitle />
        </ElectricBorder>

      </div>
    </PageWrapper>
  );
}
