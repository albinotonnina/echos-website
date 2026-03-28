"use client";

import { motion, useMotionValue } from "framer-motion";
import { useRef } from "react";
import type { Feature } from "@/types/content";

const icons: Record<string, React.ReactNode> = {
  inbox: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  ),
  search: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  "pen-tool": (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
};

function FeatureCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="card-glow shine-sweep group relative overflow-hidden rounded-xl p-8"
      >
        {/* Cursor spotlight inside card */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(300px circle at ${mouseX.get() * 100}% ${mouseY.get() * 100}%, oklch(0.85 0.06 250 / 12%), transparent 60%)`,
          }}
        />

        <div className="relative z-10">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-muted/50 text-foreground/80 transition-colors group-hover:border-border group-hover:bg-muted">
            {icons[feature.icon] || icons.inbox}
          </div>
          <h3 className="mb-3 font-pixel text-xl tracking-tight">
            {feature.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function Features({ features }: { features: Feature[] }) {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-6 py-32">
      {/* Section divider beam */}
      <div className="absolute top-0 left-1/2 h-px w-[200px] -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-4 inline-block font-pixel text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          The core loop
        </motion.span>
        <h2 className="font-pixel text-3xl tracking-tight sm:text-4xl md:text-5xl">
          <span className="text-gradient">Capture. Search. Write.</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Three primitives. Extend everything else with plugins.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </section>
  );
}
