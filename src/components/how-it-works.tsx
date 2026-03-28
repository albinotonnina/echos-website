"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Interface, Plugin } from "@/types/content";

const techStack = [
  "TypeScript",
  "Node.js",
  "SQLite",
  "LanceDB",
  "Claude",
  "grammY",
  "BullMQ",
  "Redis",
  "Fastify",
  "Pino",
];

const archLines = [
  { label: "input", value: "Telegram · CLI · Web", color: "text-blue-500/80" },
  { label: "agent", value: "Claude + tools", color: "text-violet-500/80" },
  { label: "storage", value: "SQLite + LanceDB + Markdown", color: "text-amber-500/80" },
  { label: "search", value: "BM25 + semantic + RRF fusion", color: "text-emerald-500/80" },
];

export function HowItWorks({
  interfaces,
  plugins,
}: {
  interfaces: Interface[];
  plugins: Plugin[];
}) {
  return (
    <section id="how-it-works" className="relative mx-auto max-w-6xl px-6 py-32">
      {/* Section divider */}
      <div className="absolute top-0 left-1/2 h-px w-[200px] -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <span className="mb-4 inline-block font-pixel text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Under the hood
        </span>
        <h2 className="font-pixel text-3xl tracking-tight sm:text-4xl md:text-5xl">
          <span className="text-gradient">How it works</span>
        </h2>
        <p className="mt-4 max-w-lg mx-auto text-muted-foreground">
          An LLM agent with tools, not rigid command routing. Plain Markdown
          files you can open in Obsidian.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Architecture diagram */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <h3 className="font-pixel text-xl">Architecture</h3>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {archLines.map((line, i) => (
              <motion.div
                key={line.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-4 border-b border-border/50 px-6 py-4 last:border-0"
              >
                <span className="w-16 shrink-0 font-pixel text-xs uppercase tracking-wider text-muted-foreground">
                  {line.label}
                </span>
                <svg width="16" height="1" className="shrink-0 text-border">
                  <line x1="0" y1="0.5" x2="16" y2="0.5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                </svg>
                <span className={`font-mono text-sm ${line.color}`}>
                  {line.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Tech stack badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-2"
          >
            {techStack.map((tech, i) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.04 }}
              >
                <Badge
                  variant="secondary"
                  className="border border-border/30 font-pixel text-xs"
                >
                  {tech}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Interfaces + Plugins */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          {/* Interfaces */}
          <div>
            <h3 className="mb-4 font-pixel text-xl">Interfaces</h3>
            <div className="space-y-3">
              {interfaces.map((iface, i) => (
                <motion.div
                  key={iface.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="card-glow flex items-center gap-4 rounded-xl px-5 py-4"
                >
                  <Badge
                    variant={iface.status === "stable" ? "default" : "secondary"}
                    className="shrink-0 font-pixel text-[10px] uppercase tracking-wider"
                  >
                    {iface.status}
                  </Badge>
                  <div>
                    <div className="text-sm font-medium">{iface.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {iface.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Plugins */}
          <div>
            <h3 className="mb-4 font-pixel text-xl">Plugins</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {plugins.map((plugin, i) => (
                <motion.div
                  key={plugin.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="rounded-lg border border-border/50 bg-card px-3 py-2.5 text-center transition-colors hover:border-border hover:bg-muted/50"
                >
                  <div className="text-sm font-medium">{plugin.name}</div>
                  {plugin.description && (
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {plugin.description}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
