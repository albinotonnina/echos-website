"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

const VIDEO_ID = "D3QCQXqNewU";
// hqdefault always exists; maxresdefault may not for all videos
const THUMBNAIL = `https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`;

function PlayIcon() {
  return (
    <div className="relative">
      {/* Pulse rings */}
      <div className="absolute inset-0 rounded-full pulse-ring" />
      <div
        className="absolute inset-0 rounded-full pulse-ring"
        style={{ animationDelay: "0.8s" }}
      />

      {/* Button */}
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-md transition-transform hover:scale-110 sm:h-20 sm:w-20">
        <svg
          width="24"
          height="28"
          viewBox="0 0 24 28"
          fill="white"
          className="ml-1"
        >
          <path d="M0 0l24 14-24 14z" />
        </svg>
      </div>
    </div>
  );
}

export function VideoDemo() {
  const [playing, setPlaying] = useState(false);

  const open = useCallback(() => setPlaying(true), []);
  const close = useCallback(() => setPlaying(false), []);

  return (
    <>
      {/* Inline card */}
      <section className="mx-auto w-full max-w-4xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Glow behind */}
          <div
            className="pointer-events-none absolute -inset-10 rounded-3xl opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, oklch(0.55 0.08 250 / 20%), transparent 70%)",
            }}
          />

          <div className="reflection-wrap reflection-wrap-video">
          <button
            onClick={open}
            className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl border border-zinc-200/60 shadow-xl shadow-zinc-200/30 transition-all hover:shadow-2xl hover:shadow-zinc-300/40"
          >
            {/* Thumbnail with overlay — aspect-video ensures size even if image fails */}
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={THUMBNAIL}
                alt="EchOS demo video"
                className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:scale-105 group-hover:opacity-80"
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/30 to-zinc-900/50" />

              {/* Scanline texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)",
                }}
              />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayIcon />
              </div>

              {/* Caption */}
              <div className="absolute inset-x-0 bottom-0 px-6 pb-5">
                <div className="font-pixel text-xs uppercase tracking-[0.2em] text-white/50">
                  Watch the demo
                </div>
                <div className="mt-1 font-pixel text-lg text-white/90 sm:text-xl">
                  See EchOS in action
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute top-4 right-4 rounded-md bg-black/50 px-2 py-0.5 font-pixel text-[11px] text-white/70 backdrop-blur-sm">
                3:42
              </div>
            </div>
          </button>
          </div>
        </motion.div>
      </section>

      {/* Theater overlay */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={close}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* ESC hint */}
            <div className="absolute top-7 left-6 font-pixel text-[11px] text-white/30">
              ESC to close
            </div>

            {/* Video container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                  title="EchOS Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
