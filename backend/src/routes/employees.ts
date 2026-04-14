import { Router } from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────
// GET /api/employees
//   ?page=1&limit=20&location=...&department=...&min_score=...&max_score=...
// ─────────────────────────────────────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (req.query.location) {
      where.location = req.query.location as string;
    }
    if (req.query.department) {
      where.department = req.query.department as string;
    }
    if (req.query.min_score || req.query.max_score) {
      const scoreFilter: Record<string, number> = {};
      if (req.query.min_score) scoreFilter.gte = parseFloat(req.query.min_score as string);
      if (req.query.max_score) scoreFilter.lte = parseFloat(req.query.max_score as string);
      where.performance_score = scoreFilter;
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({ where, skip, take: limit, orderBy: { id: "asc" } }),
      prisma.employee.count({ where }),
    ]);

    const mapped = employees.map((emp: any) => {
      let courses: unknown[] = [];
      if (typeof emp.courses_taken === "string") {
        try { courses = JSON.parse(emp.courses_taken); } catch { courses = []; }
      } else if (Array.isArray(emp.courses_taken)) {
        courses = emp.courses_taken;
      }

      return {
        ...emp,
        performance_score: Number(emp.performance_score),
        courses_taken: courses,
      };
    });

    res.json({
      data: mapped,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
