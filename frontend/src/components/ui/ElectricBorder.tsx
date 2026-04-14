import { useRef, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface ElectricBorderProps {
  children: ReactNode;
  className?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  borderWidth?: number;
  borderRadius?: number;
}

/**
 * ElectricBorder — Animated neon glow border that pulses and flows around the card.
 * Uses CSS conic-gradient rotating animation for the electric effect.
 */
export default function ElectricBorder({
  children,
  className = "",
  color1 = "#7c3aed",
  color2 = "#06b6d4",
  color3 = "#a78bfa",
  speed = 3,
  borderWidth = 2,
  borderRadius = 16,
}: ElectricBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let animId: number;
    let lastTime = 0;

    const animate = (time: number) => {
      if (lastTime) {
        const delta = time - lastTime;
        setAngle((prev) => (prev + (delta * speed) / 16) % 360);
      }
      lastTime = time;
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  const gradientBorder = `conic-gradient(
    from ${angle}deg,
    ${color1},
    ${color2},
    ${color3},
    transparent,
    transparent,
    ${color1}
  )`;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ borderRadius }}
    >
      {/* Outer animated glow */}
      <div
        className="absolute -inset-[1px] rounded-[inherit] opacity-80 blur-[1px]"
        style={{
          background: gradientBorder,
          borderRadius: borderRadius + 1,
        }}
      />
      {/* Sharp border line */}
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: gradientBorder,
          borderRadius,
          padding: borderWidth,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
      />
      {/* Ambient glow behind */}
      <div
        className="absolute -inset-2 rounded-[inherit] opacity-20 blur-xl"
        style={{
          background: `conic-gradient(from ${angle}deg, ${color1}, ${color2}, transparent, ${color1})`,
          borderRadius: borderRadius + 8,
        }}
      />
      {/* Content */}
      <div
        className="relative z-10 rounded-[inherit] h-full"
        style={{ background: "#16161f", borderRadius }}
      >
        {children}
      </div>
    </div>
  );
}
