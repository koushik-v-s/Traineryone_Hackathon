import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import statsRouter from "./routes/stats";
import employeesRouter from "./routes/employees";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────
app.use("/api/stats", statsRouter);
app.use("/api/employees", employeesRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Global error handler ─────────────────────────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

app.listen(PORT, () => {
  console.log(`🚀  API server running on http://localhost:${PORT}`);
});

export default app;
