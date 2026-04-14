import { useEffect, useRef } from "react";

/**
 * Enhanced LiquidEther — Full-screen canvas background with:
 * - Multi-layered flowing gradient blobs
 * - Mouse-reactive light that follows cursor with smooth lerp
 * - Organic sine/cosine wave distortion
 * - Color oscillation between violet, cyan, and amber
 * - Fluid "metaball" feel with overlapping gradients
 */
export default function LiquidEther() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let smoothMouse = { x: mouse.x, y: mouse.y };
    let time = 0;
    let mouseSpeed = 0;
    let prevMouse = { x: mouse.x, y: mouse.y };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Blob configuration — organic floating light sources
    const blobs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      baseRadius: 200 + Math.random() * 200,
      speedX: 0.3 + Math.random() * 0.5,
      speedY: 0.2 + Math.random() * 0.4,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      hue: i % 3 === 0 ? 268 : i % 3 === 1 ? 187 : 35, // violet, cyan, amber
      opacity: 0.04 + Math.random() * 0.03,
    }));

    const draw = () => {
      time += 0.006;

      // Calculate mouse speed for reactive intensity
      const dx = mouse.x - prevMouse.x;
      const dy = mouse.y - prevMouse.y;
      mouseSpeed = Math.sqrt(dx * dx + dy * dy);
      mouseSpeed = Math.min(mouseSpeed, 60);
      prevMouse.x = mouse.x;
      prevMouse.y = mouse.y;

      // Smooth lerp — faster follow for more fluid feel
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.08;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.08;

      const w = canvas.width;
      const h = canvas.height;

      // Dark base
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, w, h);

      // ── Organic floating blobs ──────────────────────────────────
      for (const blob of blobs) {
        const bx =
          w * 0.5 +
          Math.sin(time * blob.speedX + blob.phaseX) * w * 0.35;
        const by =
          h * 0.5 +
          Math.cos(time * blob.speedY + blob.phaseY) * h * 0.3;

        // Pulse radius with sine wave
        const pulseRadius =
          blob.baseRadius + Math.sin(time * 1.5 + blob.phaseX) * 40;

        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, pulseRadius);
        grad.addColorStop(0, `hsla(${blob.hue}, 80%, 55%, ${blob.opacity})`);
        grad.addColorStop(0.4, `hsla(${blob.hue}, 70%, 40%, ${blob.opacity * 0.5})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // ── Primary mouse glow (violet) ─────────────────────────────
      const mouseIntensity = 0.12 + (mouseSpeed / 60) * 0.12;
      const mouseRadius = 350 + mouseSpeed * 3;

      const g1 = ctx.createRadialGradient(
        smoothMouse.x,
        smoothMouse.y,
        0,
        smoothMouse.x,
        smoothMouse.y,
        mouseRadius
      );
      g1.addColorStop(0, `rgba(124, 58, 237, ${mouseIntensity})`);
      g1.addColorStop(0.3, `rgba(124, 58, 237, ${mouseIntensity * 0.5})`);
      g1.addColorStop(0.6, `rgba(124, 58, 237, ${mouseIntensity * 0.15})`);
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // ── Secondary trailing glow (cyan, offset + lagging) ────────
      const trailX = smoothMouse.x + Math.sin(time * 2.5) * 80 - 40;
      const trailY = smoothMouse.y + Math.cos(time * 2.0) * 60 - 30;
      const trailIntensity = 0.08 + (mouseSpeed / 60) * 0.08;

      const g2 = ctx.createRadialGradient(
        trailX,
        trailY,
        0,
        trailX,
        trailY,
        280 + mouseSpeed * 2
      );
      g2.addColorStop(0, `rgba(6, 182, 212, ${trailIntensity})`);
      g2.addColorStop(0.4, `rgba(6, 182, 212, ${trailIntensity * 0.4})`);
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // ── Tertiary warm glow (amber, opposite offset) ─────────────
      const warmX = smoothMouse.x - Math.sin(time * 1.8) * 100;
      const warmY = smoothMouse.y - Math.cos(time * 1.3) * 70;
      const warmIntensity = 0.04 + (mouseSpeed / 60) * 0.05;

      const g3 = ctx.createRadialGradient(
        warmX,
        warmY,
        0,
        warmX,
        warmY,
        200 + mouseSpeed
      );
      g3.addColorStop(0, `rgba(245, 158, 11, ${warmIntensity})`);
      g3.addColorStop(0.5, `rgba(245, 158, 11, ${warmIntensity * 0.3})`);
      g3.addColorStop(1, "transparent");
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, w, h);

      // ── Flowing wave distortion overlay ─────────────────────────
      // Creates a subtle flowing light band across the screen
      for (let i = 0; i < 3; i++) {
        const waveY = h * 0.3 + i * h * 0.2 + Math.sin(time + i) * h * 0.1;
        const waveGrad = ctx.createLinearGradient(0, waveY - 100, 0, waveY + 100);
        waveGrad.addColorStop(0, "transparent");
        waveGrad.addColorStop(
          0.5,
          `rgba(124, 58, 237, ${0.015 + Math.sin(time * 0.8 + i) * 0.008})`
        );
        waveGrad.addColorStop(1, "transparent");
        ctx.fillStyle = waveGrad;
        ctx.fillRect(0, waveY - 100, w, 200);
      }

      // ── Subtle vignette ─────────────────────────────────────────
      const vignette = ctx.createRadialGradient(
        w / 2,
        h / 2,
        Math.min(w, h) * 0.3,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.75
      );
      vignette.addColorStop(0, "transparent");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.3)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0"
      style={{ zIndex: 0, pointerEvents: "none" }}
    />
  );
}
