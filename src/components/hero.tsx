"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const words = ["I kept learning things", "and then losing them."];

export function Hero({ version }: { version: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };

    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="spotlight relative flex min-h-[95vh] flex-col items-center justify-center overflow-hidden px-6 pt-24"
      style={
        {
          "--mouse-x": `${springX.get() * 100}%`,
          "--mouse-y": `${springY.get() * 100}%`,
        } as React.CSSProperties
      }
    >
      {/* Floating orbs */}
      <div
        className="orb -top-20 left-[15%] h-[400px] w-[400px]"
        style={{ background: "oklch(0.8 0.08 250)" }}
      />
      <div
        className="orb top-[30%] right-[10%] h-[300px] w-[300px]"
        style={{
          background: "oklch(0.85 0.06 280)",
          animationDelay: "-4s",
          animationDuration: "15s",
        }}
      />
      <div
        className="orb bottom-[10%] left-[30%] h-[250px] w-[250px]"
        style={{
          background: "oklch(0.82 0.05 200)",
          animationDelay: "-8s",
          animationDuration: "18s",
        }}
      />

      {/* Vertical beams */}
      <div className="beam left-[20%] top-0 h-[60%]" />
      <div
        className="beam right-[25%] top-[10%] h-[50%]"
        style={{ animationDelay: "-3s" }}
      />
      <div
        className="beam left-[60%] top-[5%] h-[45%]"
        style={{ animationDelay: "-6s", opacity: 0.2 }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Version badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Badge
            variant="secondary"
            className="mb-8 border border-border/50 bg-background/80 px-4 py-1.5 font-mono text-xs backdrop-blur-sm"
          >
            v{version} · open source · MIT
          </Badge>
        </motion.div>

        {/* Headline — staggered word reveal */}
        <h1 className="max-w-4xl font-pixel text-4xl leading-[1.1] tracking-tight sm:text-5xl md:text-7xl">
          {words.map((line, lineIdx) => (
            <span key={lineIdx} className="block">
              {line.split(" ").map((word, wordIdx) => (
                <motion.span
                  key={`${lineIdx}-${wordIdx}`}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + lineIdx * 0.3 + wordIdx * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mr-[0.25em] inline-block text-gradient"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          So I built a system that remembers.{" "}
          <span className="text-foreground/80">Self-hosted AI memory</span> —
          capture anything, search semantically, write in your voice.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#get-started"
            className={cn(
              buttonVariants({ size: "lg" }),
              "shine-sweep pulse-ring h-12 px-8 text-base"
            )}
          >
            Get started
          </a>
          <a
            href="https://github.com/albinotonnina/echos"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "glass h-12 px-8 text-base"
            )}
          >
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="mr-2 h-4 w-4"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            View on GitHub
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="mt-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-muted-foreground/40"
          >
            <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3v10M4 9l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
