"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

const lines = [
  { type: "prompt" as const, text: "what do I know about memory systems?" },
  { type: "blank" as const, text: "" },
  { type: "output" as const, text: "Found 12 notes matching your query:" },
  { type: "blank" as const, text: "" },
  {
    type: "result" as const,
    text: '  "Spaced Repetition and Long-Term Retention"  #learning #memory',
  },
  {
    type: "result" as const,
    text: '  "Vector Embeddings for Semantic Search"      #ml #search',
  },
  {
    type: "result" as const,
    text: '  "Building a Personal Knowledge Base"          #pkm #tools',
  },
  { type: "blank" as const, text: "" },
  {
    type: "output" as const,
    text: "Your notes show a pattern: you've been exploring how",
  },
  {
    type: "output" as const,
    text: "retrieval-augmented memory can improve learning outcomes.",
  },
];

function TypedLine({
  line,
  delay,
  onDone,
}: {
  line: (typeof lines)[number];
  delay: number;
  onDone: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (line.text === "") {
      onDoneRef.current();
      return;
    }

    let i = 0;
    const speed = line.type === "prompt" ? 40 : 10;
    const interval = setInterval(() => {
      i++;
      setDisplayed(line.text.slice(0, i));
      if (i >= line.text.length) {
        clearInterval(interval);
        onDoneRef.current();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, line]);

  if (!started) return null;
  if (line.type === "blank") return <div className="h-4" />;

  return (
    <div
      className={
        line.type === "prompt"
          ? "terminal-prompt text-zinc-100"
          : line.type === "result"
            ? "text-emerald-400/90"
            : "text-zinc-400"
      }
    >
      {displayed}
      {displayed.length < line.text.length && (
        <span className="animate-pulse text-emerald-400">▊</span>
      )}
    </div>
  );
}

export function TerminalDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (isInView) setVisibleLines(1);
  }, [isInView]);

  const handleLineDone = useCallback(
    (i: number) => {
      if (i === visibleLines - 1 && visibleLines < lines.length) {
        setVisibleLines((v) => v + 1);
      }
    },
    [visibleLines]
  );

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        {/* Glow behind terminal */}
        <div
          className="pointer-events-none absolute -inset-8 rounded-3xl opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, oklch(0.6 0.06 250 / 12%), transparent 70%)",
          }}
        />

        <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 shadow-2xl shadow-zinc-300/30">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-zinc-800/80 bg-zinc-900 px-5 py-3.5">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-zinc-700/80" />
              <div className="h-3 w-3 rounded-full bg-zinc-700/80" />
              <div className="h-3 w-3 rounded-full bg-zinc-700/80" />
            </div>
            <span className="ml-3 font-mono text-xs text-zinc-500">
              echos — ~/knowledge
            </span>
          </div>

          {/* Terminal body */}
          <div className="terminal min-h-[300px] space-y-0.5 p-6 font-mono text-[13px] leading-[1.7]">
            {lines.slice(0, visibleLines).map((line, i) => (
              <TypedLine
                key={i}
                line={line}
                delay={i === 0 ? 500 : 0}
                onDone={() => handleLineDone(i)}
              />
            ))}
            {visibleLines >= lines.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 terminal-prompt text-zinc-500"
              >
                <span className="animate-pulse">▊</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Reflection */}
        <div
          className="pointer-events-none relative -z-10 mx-4 h-16 -mt-1 rounded-b-2xl opacity-20"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.1 0 0), transparent)",
            maskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
