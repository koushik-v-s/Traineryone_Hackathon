import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  DollarSign,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const NAV_ITEMS = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/employees", icon: Users, label: "Employees" },
  { path: "/learning", icon: GraduationCap, label: "Learning" },
  { path: "/compensation", icon: DollarSign, label: "Compensation" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export default function Dock() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.3 }}
        className="flex items-end gap-2 px-4 py-3 rounded-2xl"
        style={{
          background: "rgba(17, 17, 24, 0.85)",
          backdropFilter: "blur(20px) saturate(1.8)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(124,58,237,0.08)",
        }}
      >
        {NAV_ITEMS.map((item, index) => {
          const isActive = location.pathname === item.path;
          const isHovered = hoveredIndex === index;
          const Icon = item.icon;
          const scale = isHovered ? 1.25 : isActive ? 1.1 : 1;

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              animate={{ scale }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative flex flex-col items-center cursor-pointer px-3 py-1.5 rounded-xl transition-colors"
              style={{
                background: isActive
                  ? "rgba(124, 58, 237, 0.2)"
                  : isHovered
                  ? "rgba(255,255,255,0.05)"
                  : "transparent",
              }}
            >
              <Icon
                size={22}
                color={isActive ? "#a78bfa" : isHovered ? "#f1f5f9" : "#64748b"}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className="text-[10px] font-medium mt-1 transition-colors"
                style={{
                  color: isActive
                    ? "#a78bfa"
                    : isHovered
                    ? "#f1f5f9"
                    : "#64748b",
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="dock-indicator"
                  className="absolute -bottom-1.5 w-5 h-0.5 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #7c3aed, #06b6d4)",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {/* Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-9 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap"
                  style={{
                    background: "#1e1e2e",
                    color: "#f1f5f9",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {item.label}
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
