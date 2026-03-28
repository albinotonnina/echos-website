"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { InstallMethod } from "@/types/content";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="absolute top-4 right-4 z-10 rounded-md border border-zinc-700/50 bg-zinc-800/80 px-2.5 py-1 font-mono text-[11px] text-zinc-400 backdrop-blur-sm transition-all hover:border-zinc-600 hover:bg-zinc-700 hover:text-zinc-200"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export function InstallBlock({ methods }: { methods: InstallMethod[] }) {
  return (
    <section id="get-started" className="relative mx-auto max-w-6xl px-6 py-32">
      {/* Section divider */}
      <div className="absolute top-0 left-1/2 h-px w-[200px] -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 30% at 50% 60%, oklch(0.9 0.04 250 / 10%), transparent 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="relative mb-12 text-center"
      >
        <span className="mb-4 inline-block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Self-host in minutes
        </span>
        <h2 className="font-pixel text-3xl tracking-tight sm:text-4xl md:text-5xl">
          <span className="text-gradient">Get started</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Your data stays yours. No subscriptions. No cloud dependency.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-2xl"
      >
        <Tabs defaultValue={methods[0]?.label.toLowerCase()}>
          <TabsList className="w-full justify-start border-b border-border bg-transparent">
            {methods.map((method) => (
              <TabsTrigger
                key={method.label}
                value={method.label.toLowerCase()}
                className="font-mono text-xs data-[state=active]:text-foreground"
              >
                {method.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {methods.map((method) => (
            <TabsContent
              key={method.label}
              value={method.label.toLowerCase()}
              className="mt-6"
            >
              <div className="relative overflow-hidden rounded-2xl border border-zinc-200/60 shadow-xl shadow-zinc-200/20">
                {/* Glow behind */}
                <div
                  className="pointer-events-none absolute -inset-4 opacity-40"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 50%, oklch(0.6 0.06 250 / 10%), transparent 60%)",
                  }}
                />

                {/* Title bar */}
                <div className="relative flex items-center gap-2 border-b border-zinc-800/80 bg-zinc-900 px-5 py-3.5">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-zinc-700/80" />
                    <div className="h-3 w-3 rounded-full bg-zinc-700/80" />
                    <div className="h-3 w-3 rounded-full bg-zinc-700/80" />
                  </div>
                  <span className="ml-3 font-mono text-xs text-zinc-500">
                    {method.description}
                  </span>
                </div>

                {/* Command */}
                <div className="terminal relative px-6 py-5">
                  <code className="font-mono text-sm leading-relaxed text-emerald-400 break-all">
                    {method.command}
                  </code>
                </div>

                <CopyButton text={method.command} />
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <a
            href="https://docs.echos.sh/distribution"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Read the full installation guide
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path
                d="M5.5 3L9.5 7L5.5 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
