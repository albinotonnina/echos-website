"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#get-started", label: "Get started" },
  { href: "https://docs.echos.sh", label: "Docs", external: true },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`fixed top-0 z-50 w-full border border-transparent transition-all duration-500 ${
        scrolled
          ? "border-b-border/30 bg-background/60 backdrop-blur-xl backdrop-saturate-[1.2]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 md:h-20 max-w-6xl items-center justify-between px-6">
        <a
          href="/"
          className="flex items-center transition-opacity hover:opacity-70"
        >
          <Image
            src="/logo-long-light.svg"
            alt="EchOS"
            width={200}
            height={60}
            className="h-9 w-auto md:h-14"
            priority
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 font-pixel text-[15px] text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
            </a>
          ))}
          <div className="ml-3 h-5 w-px bg-border" />
          <a
            href="https://github.com/albinotonnina/echos"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 inline-flex h-10 items-center rounded-lg border border-border/50 bg-background/50 px-4 font-pixel text-[15px] backdrop-blur-sm transition-all hover:border-border hover:bg-muted/50"
          >
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="mr-2 h-4 w-4"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            className="text-foreground"
          >
            {mobileOpen ? (
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M2 4h12M2 8h12M2 12h12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-border/30 glass md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 font-pixel text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://github.com/albinotonnina/echos"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
              >
                GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
