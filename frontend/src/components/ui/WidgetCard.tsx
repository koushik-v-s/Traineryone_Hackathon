import type { ReactNode } from "react";

interface WidgetCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  glowOnHover?: boolean;
  noPadding?: boolean;
}

export default function WidgetCard({
  title,
  children,
  className = "",
  glowOnHover = true,
  noPadding = false,
}: WidgetCardProps) {
  return (
    <div
      className={`glass-card flex flex-col overflow-hidden h-full ${className}`}
      style={{
        ...(glowOnHover
          ? {}
          : { boxShadow: "none" }),
      }}
    >
      <div
        className="px-6 pt-5 pb-3 flex items-center gap-2 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div
          className="w-1.5 h-5 rounded-full"
          style={{
            background: "linear-gradient(180deg, #7c3aed, #06b6d4)",
          }}
        />
        <h3
          className="text-sm font-semibold tracking-wide uppercase"
          style={{ color: "#94a3b8" }}
        >
          {title}
        </h3>
      </div>
      <div className={`flex-1 flex flex-col ${noPadding ? "" : "p-6"}`}>{children}</div>
    </div>
  );
}
