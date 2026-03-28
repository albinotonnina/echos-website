"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InteractiveGrid } from "@/components/interactive-grid";

const words = ["I kept learning things", "and then losing them."];

export function Hero({ version }: { version: string }) {
  return (
    <section className="relative flex min-h-[95vh] flex-col items-center justify-center overflow-hidden px-6 pt-24">
      {/* Interactive dot grid — responds to cursor */}
      <div className="absolute inset-0">
        <InteractiveGrid />
      </div>

      {/* Aurora gradient mesh — slow morphing colors */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-[20%] left-[10%] h-[600px] w-[800px] animate-aurora-1 rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.75 0.1 240) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute top-[10%] right-[5%] h-[500px] w-[600px] animate-aurora-2 rounded-full opacity-[0.06]"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.8 0.08 280) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute bottom-[5%] left-[25%] h-[400px] w-[700px] animate-aurora-3 rounded-full opacity-[0.05]"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.78 0.06 200) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      {/* Horizontal light streak */}
      <div className="pointer-events-none absolute top-[40%] left-0 h-px w-full">
        <div
          className="mx-auto h-full max-w-4xl"
          style={{
            background:
              "linear-gradient(to right, transparent, oklch(0.8 0.06 250 / 20%), oklch(0.85 0.04 260 / 30%), oklch(0.8 0.06 250 / 20%), transparent)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Version badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Badge
            variant="secondary"
            className="mb-8 border border-border/40 bg-background/70 px-4 py-1.5 font-pixel text-xs backdrop-blur-md"
          >
            v{version} · open source · MIT
          </Badge>
        </motion.div>

        {/* Headline — staggered word reveal with blur */}
        <h1 className="max-w-4xl font-pixel text-4xl leading-[1.1] tracking-tight sm:text-5xl md:text-7xl">
          {words.map((line, lineIdx) => (
            <span key={lineIdx} className="block">
              {line.split(" ").map((word, wordIdx) => (
                <motion.span
                  key={`${lineIdx}-${wordIdx}`}
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + lineIdx * 0.35 + wordIdx * 0.08,
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
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          So I built a system that remembers.{" "}
          <span className="text-foreground/80">Self-hosted AI memory</span>,
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
              "shine-sweep pulse-ring h-12 px-8 font-pixel text-base"
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
              "glass h-12 px-8 font-pixel text-base"
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
          transition={{ delay: 2.5, duration: 1 }}
          className="mt-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-muted-foreground/30"
          >
            <span className="font-pixel text-[10px] uppercase tracking-[0.3em]">
              Scroll
            </span>
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
