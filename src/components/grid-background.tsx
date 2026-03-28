"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function GridBackground({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const gridOpacity = useTransform(scrollYProgress, [0, 0.6], [0.5, 0]);
  const dotsOpacity = useTransform(scrollYProgress, [0, 0.4], [0.3, 0]);

  return (
    <div ref={ref} className="relative">
      {/* Grid layer */}
      <motion.div
        style={{ opacity: gridOpacity }}
        className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade"
        aria-hidden
      />
      {/* Dots layer — offset for depth */}
      <motion.div
        style={{ opacity: dotsOpacity }}
        className="pointer-events-none absolute inset-0 bg-dots"
        aria-hidden
      />
      {/* Radial gradient glow at top center */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.9 0.04 250 / 20%) 0%, transparent 100%)",
        }}
        aria-hidden
      />
      {children}
    </div>
  );
}
