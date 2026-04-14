interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "violet" | "cyan";
  size?: "sm" | "md";
}

const variantStyles: Record<string, { bg: string; color: string }> = {
  default: { bg: "rgba(255,255,255,0.1)", color: "#f1f5f9" },
  success: { bg: "rgba(16,185,129,0.15)", color: "#10b981" },
  warning: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" },
  danger: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
  violet: { bg: "rgba(124,58,237,0.15)", color: "#a78bfa" },
  cyan: { bg: "rgba(6,182,212,0.15)", color: "#06b6d4" },
};

export default function Badge({
  children,
  variant = "default",
  size = "sm",
}: BadgeProps) {
  const style = variantStyles[variant];
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
      style={{ background: style.bg, color: style.color }}
    >
      {children}
    </span>
  );
}
