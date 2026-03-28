"use client";

import { motion } from "framer-motion";

export function Footer({ version }: { version: string }) {
  return (
    <footer className="relative mt-auto border-t border-border/50">
      {/* Subtle top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-px h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, oklch(0.8 0.04 250 / 30%), transparent)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div className="space-y-3">
            <div className="font-pixel text-2xl">EchOS</div>
            <p className="max-w-xs text-sm text-muted-foreground">
              Your personal AI knowledge system. Self-hosted, agent-driven, and
              always private.
            </p>
            <div className="font-pixel text-[11px] text-muted-foreground/60">
              v{version} · MIT License ·{" "}
              <a
                href="https://www.albinotonnina.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/80 transition-colors hover:text-foreground"
              >
                Made with care
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 font-pixel text-sm">
            {[
              {
                label: "Documentation",
                href: "https://docs.echos.sh",
              },
              {
                label: "GitHub",
                href: "https://github.com/albinotonnina/echos",
              },
              {
                label: "Discord",
                href: "https://discord.gg/qbdCjhxB2u",
              },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
