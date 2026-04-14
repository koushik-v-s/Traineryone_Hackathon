interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    color?: string;
    payload?: Record<string, unknown>;
  }>;
  label?: string;
}

export default function ChartTooltip({
  active,
  payload,
  label,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-xl px-4 py-3 shadow-xl"
      style={{
        background: "#1e1e2e",
        border: "1px solid rgba(124,58,237,0.3)",
      }}
    >
      {label && (
        <p
          className="text-xs font-medium mb-1.5"
          style={{ color: "#94a3b8" }}
        >
          {label}
        </p>
      )}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: entry.color || "#7c3aed" }}
          />
          <span style={{ color: "#94a3b8" }}>{entry.name}:</span>
          <span className="font-semibold" style={{ color: "#f1f5f9" }}>
            {typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}
