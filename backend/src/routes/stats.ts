import { Router } from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// ── Types ────────────────────────────────────────────────────────────
interface CourseRecord {
  course_id: string;
  title: string;
  topic: string;
  completed_date: string;
  score: number;
}

function parseCourses(raw: string | unknown): CourseRecord[] {
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return []; }
  }
  if (Array.isArray(raw)) return raw as CourseRecord[];
  return [];
}

function handleError(res: Response, err: unknown) {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}

// ─────────────────────────────────────────────────────────────────────
// GET /api/stats/performance-distribution
// ─────────────────────────────────────────────────────────────────────
router.get("/performance-distribution", async (_req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      select: { performance_score: true },
    });

    const buckets: Record<string, number> = {
      "Below Average": 0,
      Average: 0,
      Good: 0,
      Excellent: 0,
    };

    for (const emp of employees) {
      const s = Number(emp.performance_score);
      if (s < 2) buckets["Below Average"]++;
      else if (s < 3) buckets["Average"]++;
      else if (s < 4) buckets["Good"]++;
      else buckets["Excellent"]++;
    }

    const distribution = Object.entries(buckets).map(([range, count]) => ({
      range,
      count,
    }));

    res.json({ total: employees.length, distribution });
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────────────────────────────
// GET /api/stats/employees-by-location
// ─────────────────────────────────────────────────────────────────────
router.get("/employees-by-location", async (_req: Request, res: Response) => {
  try {
    const data = await prisma.employee.groupBy({
      by: ["location"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    res.json(
      data.map((d: { location: string; _count: { id: number } }) => ({
        location: d.location,
        count: d._count.id,
      }))
    );
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────────────────────────────
// GET /api/stats/employees-by-job-title
// ─────────────────────────────────────────────────────────────────────
router.get("/employees-by-job-title", async (_req: Request, res: Response) => {
  try {
    const data = await prisma.employee.groupBy({
      by: ["job_title"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    res.json(
      data.map((d: { job_title: string; _count: { id: number } }) => ({
        job_title: d.job_title,
        count: d._count.id,
      }))
    );
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────────────────────────────
// GET /api/stats/learning-journey
// ─────────────────────────────────────────────────────────────────────
router.get("/learning-journey", async (_req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      select: { id: true, name: true, job_title: true, courses_taken: true },
    });

    const topicMap: Record<string, Set<number>> = {};

    const mapped = employees.map((emp: any) => {
      const courses = parseCourses(emp.courses_taken);
      for (const c of courses) {
        if (!topicMap[c.topic]) topicMap[c.topic] = new Set();
        topicMap[c.topic].add(emp.id);
      }
      return { id: emp.id, name: emp.name, job_title: emp.job_title, courses_taken: courses };
    });

    const topic_summary = Object.entries(topicMap)
      .map(([topic, ids]) => ({ topic, total_employees: ids.size }))
      .sort((a, b) => b.total_employees - a.total_employees);

    res.json({ employees: mapped, topic_summary });
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────────────────────────────
// GET /api/stats/compensation-by-department
// ─────────────────────────────────────────────────────────────────────
router.get("/compensation-by-department", async (_req: Request, res: Response) => {
  try {
    const data = await prisma.employee.groupBy({
      by: ["department"],
      _avg: { compensation_usd: true },
      _min: { compensation_usd: true },
      _max: { compensation_usd: true },
      orderBy: { department: "asc" },
    });

    res.json(
      data.map((d: {
        department: string;
        _avg: { compensation_usd: number | null };
        _min: { compensation_usd: number | null };
        _max: { compensation_usd: number | null };
      }) => ({
        department: d.department,
        avg_compensation: Math.round(d._avg.compensation_usd ?? 0),
        min_compensation: d._min.compensation_usd ?? 0,
        max_compensation: d._max.compensation_usd ?? 0,
      }))
    );
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────────────────────────────
// GET /api/stats/performance-vs-compensation
// ─────────────────────────────────────────────────────────────────────
router.get("/performance-vs-compensation", async (_req: Request, res: Response) => {
  try {
    const data = await prisma.employee.findMany({
      select: {
        name: true,
        performance_score: true,
        compensation_usd: true,
        department: true,
        job_title: true,
      },
    });

    res.json(
      data.map((d) => ({
        name: d.name,
        performance_score: Number(d.performance_score),
        compensation_usd: d.compensation_usd,
        department: d.department,
        job_title: d.job_title,
      }))
    );
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────────────────────────────
// GET /api/stats/top-performers
// ─────────────────────────────────────────────────────────────────────
router.get("/top-performers", async (_req: Request, res: Response) => {
  try {
    const data = await prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        job_title: true,
        department: true,
        location: true,
        performance_score: true,
      },
      orderBy: { performance_score: "desc" },
      take: 10,
    });

    res.json(
      data.map((d, i: number) => ({
        rank: i + 1,
        id: d.id,
        name: d.name,
        job_title: d.job_title,
        department: d.department,
        location: d.location,
        performance_score: Number(d.performance_score),
      }))
    );
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
