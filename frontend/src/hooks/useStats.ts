import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

// ── Types ────────────────────────────────────────────────────────────
export interface PerfDistribution {
  total: number;
  distribution: { range: string; count: number }[];
}

export interface LocationCount {
  location: string;
  count: number;
}

export interface JobTitleCount {
  job_title: string;
  count: number;
}

export interface CourseEntry {
  course_id: string;
  title: string;
  topic: string;
  completed_date: string;
  score: number;
}

export interface LearningEmployee {
  id: number;
  name: string;
  job_title: string;
  courses_taken: CourseEntry[];
}

export interface TopicSummary {
  topic: string;
  total_employees: number;
}

export interface LearningJourney {
  employees: LearningEmployee[];
  topic_summary: TopicSummary[];
}

export interface CompensationDept {
  department: string;
  avg_compensation: number;
  min_compensation: number;
  max_compensation: number;
}

export interface PerfVsComp {
  name: string;
  performance_score: number;
  compensation_usd: number;
  department: string;
  job_title: string;
}

export interface TopPerformer {
  rank: number;
  id: number;
  name: string;
  job_title: string;
  department: string;
  location: string;
  performance_score: number;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  job_title: string;
  department: string;
  location: string;
  performance_score: number;
  compensation_usd: number;
  hire_date: string;
  courses_taken: CourseEntry[];
  created_at: string;
}

export interface EmployeesResponse {
  data: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ── Hooks ────────────────────────────────────────────────────────────
export function usePerformanceDistribution() {
  return useQuery<PerfDistribution>({
    queryKey: ["performance-distribution"],
    queryFn: () => api.get("/stats/performance-distribution").then((r) => r.data),
  });
}

export function useEmployeesByLocation() {
  return useQuery<LocationCount[]>({
    queryKey: ["employees-by-location"],
    queryFn: () => api.get("/stats/employees-by-location").then((r) => r.data),
  });
}

export function useEmployeesByJobTitle() {
  return useQuery<JobTitleCount[]>({
    queryKey: ["employees-by-job-title"],
    queryFn: () => api.get("/stats/employees-by-job-title").then((r) => r.data),
  });
}

export function useLearningJourney() {
  return useQuery<LearningJourney>({
    queryKey: ["learning-journey"],
    queryFn: () => api.get("/stats/learning-journey").then((r) => r.data),
  });
}

export function useCompensationByDept() {
  return useQuery<CompensationDept[]>({
    queryKey: ["compensation-by-department"],
    queryFn: () =>
      api.get("/stats/compensation-by-department").then((r) => r.data),
  });
}

export function usePerfVsCompensation() {
  return useQuery<PerfVsComp[]>({
    queryKey: ["performance-vs-compensation"],
    queryFn: () =>
      api.get("/stats/performance-vs-compensation").then((r) => r.data),
  });
}

export function useTopPerformers() {
  return useQuery<TopPerformer[]>({
    queryKey: ["top-performers"],
    queryFn: () => api.get("/stats/top-performers").then((r) => r.data),
  });
}

export function useEmployees(params: {
  page?: number;
  limit?: number;
  location?: string;
  department?: string;
  min_score?: number;
  max_score?: number;
}) {
  return useQuery<EmployeesResponse>({
    queryKey: ["employees", params],
    queryFn: () => api.get("/employees", { params }).then((r) => r.data),
  });
}
