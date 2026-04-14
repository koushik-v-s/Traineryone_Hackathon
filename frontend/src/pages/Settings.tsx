import PageWrapper from "../components/layout/PageWrapper";
import { Database, Server, Palette, Info } from "lucide-react";

export default function Settings() {
  return (
    <PageWrapper
      title="Settings"
      subtitle="Application configuration and system info"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
        <SettingsCard
          icon={<Server size={20} color="#7c3aed" />}
          title="API Server"
          description="Connected to backend API"
          value="http://localhost:3001"
        />
        <SettingsCard
          icon={<Database size={20} color="#06b6d4" />}
          title="Database"
          description="SQLite via Prisma ORM"
          value="dev.db"
        />
        <SettingsCard
          icon={<Palette size={20} color="#f59e0b" />}
          title="Theme"
          description="Forced dark mode enabled"
          value="Dark"
        />
        <SettingsCard
          icon={<Info size={20} color="#10b981" />}
          title="Version"
          description="Employee Analytics Dashboard"
          value="v1.0.0"
        />
      </div>

      <div
        className="mt-8 p-6 rounded-2xl max-w-3xl"
        style={{
          background: "rgba(124,58,237,0.05)",
          border: "1px solid rgba(124,58,237,0.15)",
        }}
      >
        <h3 className="text-sm font-semibold mb-2" style={{ color: "#a78bfa" }}>
          Tech Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "React 18",
            "TypeScript",
            "Vite",
            "Tailwind CSS",
            "Recharts",
            "Framer Motion",
            "React Query",
            "Express.js",
            "Prisma",
            "SQLite",
          ].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "#94a3b8",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

function SettingsCard({
  icon,
  title,
  description,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: string;
}) {
  return (
    <div
      className="glass-card p-5"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(124,58,237,0.1)" }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>
            {title}
          </h4>
          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
            {description}
          </p>
          <p
            className="text-xs font-mono mt-2 px-2 py-1 rounded-md inline-block"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#94a3b8",
            }}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
