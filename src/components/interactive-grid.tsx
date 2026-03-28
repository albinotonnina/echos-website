"use client";

import { useEffect, useRef, useCallback } from "react";

interface Dot {
  x: number;
  y: number;
  baseRadius: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  vx: number;
  vy: number;
  originX: number;
  originY: number;
}

const CONFIG = {
  spacing: 28,
  baseRadius: 1.2,
  maxRadius: 3.5,
  mouseRadius: 180,
  connectionRadius: 120,
  connectionAlpha: 0.08,
  returnSpeed: 0.04,
  pushStrength: 18,
  baseAlpha: 0.15,
  maxAlpha: 0.7,
  glowColor: [100, 120, 200] as [number, number, number],
  lineColor: [120, 140, 210] as [number, number, number],
};

export function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef<number>(0);
  const dprRef = useRef(1);

  const initDots = useCallback((width: number, height: number) => {
    const dots: Dot[] = [];
    const cols = Math.ceil(width / CONFIG.spacing) + 1;
    const rows = Math.ceil(height / CONFIG.spacing) + 1;
    const offsetX = (width - (cols - 1) * CONFIG.spacing) / 2;
    const offsetY = (height - (rows - 1) * CONFIG.spacing) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = offsetX + col * CONFIG.spacing;
        const y = offsetY + row * CONFIG.spacing;
        dots.push({
          x,
          y,
          originX: x,
          originY: y,
          baseRadius: CONFIG.baseRadius,
          radius: CONFIG.baseRadius,
          baseAlpha: CONFIG.baseAlpha + Math.random() * 0.05,
          alpha: CONFIG.baseAlpha,
          vx: 0,
          vy: 0,
        });
      }
    }
    dotsRef.current = dots;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = dprRef.current;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const { x: mx, y: my } = mouseRef.current;
    const dots = dotsRef.current;
    const r2 = CONFIG.mouseRadius * CONFIG.mouseRadius;
    const cr2 = CONFIG.connectionRadius * CONFIG.connectionRadius;
    const [gr, gg, gb] = CONFIG.glowColor;
    const [lr, lg, lb] = CONFIG.lineColor;

    // Update and draw dots
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      const dx = mx - dot.originX;
      const dy = my - dot.originY;
      const dist2 = dx * dx + dy * dy;

      if (dist2 < r2) {
        const dist = Math.sqrt(dist2);
        const force = 1 - dist / CONFIG.mouseRadius;
        const angle = Math.atan2(dy, dx);
        // Push away from cursor
        dot.vx -= Math.cos(angle) * force * CONFIG.pushStrength * 0.05;
        dot.vy -= Math.sin(angle) * force * CONFIG.pushStrength * 0.05;
        // Glow
        dot.radius = CONFIG.baseRadius + (CONFIG.maxRadius - CONFIG.baseRadius) * force * force;
        dot.alpha = dot.baseAlpha + (CONFIG.maxAlpha - dot.baseAlpha) * force;
      } else {
        dot.radius += (CONFIG.baseRadius - dot.radius) * 0.08;
        dot.alpha += (dot.baseAlpha - dot.alpha) * 0.06;
      }

      // Spring back to origin
      dot.vx += (dot.originX - dot.x) * CONFIG.returnSpeed;
      dot.vy += (dot.originY - dot.y) * CONFIG.returnSpeed;
      dot.vx *= 0.88;
      dot.vy *= 0.88;
      dot.x += dot.vx;
      dot.y += dot.vy;

      // Draw dot
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${gr}, ${gg}, ${gb}, ${dot.alpha})`;
      ctx.fill();
    }

    // Draw connections near mouse
    if (mx > 0 && my > 0) {
      ctx.lineWidth = 0.5;
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        const dax = mx - a.x;
        const day = my - a.y;
        if (dax * dax + day * day > r2) continue;

        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dbx = a.x - b.x;
          const dby = a.y - b.y;
          const d2 = dbx * dbx + dby * dby;
          if (d2 > cr2) continue;

          const dbmx = mx - b.x;
          const dbmy = my - b.y;
          if (dbmx * dbmx + dbmy * dbmy > r2) continue;

          const lineAlpha =
            CONFIG.connectionAlpha * (1 - Math.sqrt(d2) / CONFIG.connectionRadius);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${lineAlpha})`;
          ctx.stroke();
        }
      }
    }

    ctx.restore();
    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      initDots(rect.width, rect.height);
    };

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", handleLeave);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(animRef.current);
    };
  }, [initDots, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute inset-0"
      aria-hidden
    />
  );
}
