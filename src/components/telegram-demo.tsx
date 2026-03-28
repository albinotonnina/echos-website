"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

interface Message {
  id: number;
  from: "user" | "bot";
  type: "text" | "voice" | "link";
  text: string;
  time: string;
  delay: number;
  typing?: number;
}

const conversation: Message[] = [
  {
    id: 1,
    from: "user",
    type: "voice",
    text: "Voice message (0:12)",
    time: "10:32",
    delay: 0,
    typing: 0,
  },
  {
    id: 2,
    from: "bot",
    type: "text",
    text: "Transcribed and saved your voice note about spaced repetition research. Tagged #learning #memory #cognitive-science",
    time: "10:32",
    delay: 800,
    typing: 1200,
  },
  {
    id: 3,
    from: "user",
    type: "link",
    text: "https://arxiv.org/abs/2401.15391",
    time: "10:34",
    delay: 2800,
    typing: 0,
  },
  {
    id: 4,
    from: "bot",
    type: "text",
    text: "Saved. \"Retrieval-Augmented Memory for LLMs\" — the paper proposes a hybrid memory architecture combining dense retrieval with episodic buffers. Connected to 3 existing notes.",
    time: "10:34",
    delay: 3600,
    typing: 1800,
  },
  {
    id: 5,
    from: "user",
    type: "text",
    text: "what do I know about memory architectures?",
    time: "10:35",
    delay: 6200,
    typing: 0,
  },
  {
    id: 6,
    from: "bot",
    type: "text",
    text: "Found 8 notes across #memory #ml #cognitive-science. Your notes trace an arc from biological memory models → spaced repetition → vector retrieval → the hybrid approach in the paper you just saved. Want me to draft a synthesis?",
    time: "10:35",
    delay: 7000,
    typing: 2200,
  },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-[6px] w-[6px] rounded-full bg-zinc-400"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function VoiceWaveform() {
  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: 20 }).map((_, i) => {
        const height = Math.sin(i * 0.7) * 8 + 10;
        return (
          <motion.div
            key={i}
            className="w-[3px] rounded-full bg-white/70"
            initial={{ height: 3 }}
            animate={{ height }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
          />
        );
      })}
    </div>
  );
}

function ChatBubble({ message, onVisible }: { message: Message; onVisible: () => void }) {
  const isUser = message.from === "user";

  useEffect(() => {
    onVisible();
  }, [onVisible]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-[1.45] ${
          isUser
            ? "rounded-br-md bg-[#3B82F6] text-white"
            : "rounded-bl-md bg-white text-zinc-900 shadow-sm shadow-zinc-200/50"
        }`}
      >
        {message.type === "voice" ? (
          <div className="flex items-center gap-2.5">
            {/* Play button */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20">
              <svg width="10" height="12" viewBox="0 0 10 12" fill="white">
                <path d="M0 0l10 6-10 6z" />
              </svg>
            </div>
            <VoiceWaveform />
            <span className="ml-1 shrink-0 text-[11px] text-white/60">0:12</span>
          </div>
        ) : message.type === "link" ? (
          <span className="break-all underline decoration-white/30 underline-offset-2">
            {message.text}
          </span>
        ) : (
          message.text
        )}
        <div
          className={`mt-0.5 text-right text-[10px] ${
            isUser ? "text-white/50" : "text-zinc-400"
          }`}
        >
          {message.time}
        </div>
      </div>
    </motion.div>
  );
}

export function TelegramDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!isInView) return;

    // Clean up on unmount
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;

    conversation.forEach((msg) => {
      // Show typing indicator before bot messages
      if (msg.from === "bot" && msg.typing) {
        const typingTimer = setTimeout(() => {
          setShowTyping(true);
        }, msg.delay);
        timersRef.current.push(typingTimer);
      }

      // Show the message
      const msgTimer = setTimeout(() => {
        setShowTyping(false);
        setVisibleMessages((prev) => [...prev, msg.id]);
      }, msg.delay + (msg.from === "bot" ? (msg.typing || 0) : 0));
      timersRef.current.push(msgTimer);
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [isInView]);

  const noop = useCallback(() => {}, []);

  return (
    <section ref={ref} className="mx-auto w-full max-w-4xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <span className="mb-3 inline-block font-pixel text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Primary interface
        </span>
        <h3 className="font-pixel text-2xl tracking-tight sm:text-3xl">
          <span className="text-gradient">Talk to it on Telegram</span>
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Voice notes, links, text — send anything, it figures out the rest.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-[340px]"
      >
        {/* Phone frame glow */}
        <div
          className="pointer-events-none absolute -inset-8 rounded-[3rem] opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, oklch(0.7 0.06 220 / 15%), transparent 70%)",
          }}
        />

        {/* Phone frame */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-200/80 bg-zinc-100 p-1 shadow-2xl shadow-zinc-300/40">
          {/* Screen */}
          <div className="overflow-hidden rounded-[2rem] bg-[#E8E2D9]">
            {/* Status bar */}
            <div className="flex items-center justify-between bg-[#517DA2] px-5 py-1.5">
              <span className="text-[11px] text-white/70">10:35</span>
              <div className="flex items-center gap-1">
                <div className="h-[3px] w-[14px] rounded-full bg-white/50" />
                <div className="h-[3px] w-[10px] rounded-full bg-white/50" />
                <div className="h-[3px] w-[6px] rounded-full bg-white/50" />
              </div>
            </div>

            {/* Chat header */}
            <div className="flex items-center gap-3 bg-[#517DA2] px-4 pb-2.5">
              <button className="text-white/80">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8 1L3 6l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7EA8C9]">
                <span className="text-sm font-bold text-white">E</span>
              </div>
              <div>
                <div className="text-[14px] font-medium text-white">EchOS</div>
                <div className="text-[11px] text-white/60">online</div>
              </div>
            </div>

            {/* Messages area — fixed height for phone proportions */}
            <div className="flex h-[660px] flex-col gap-1.5 overflow-hidden px-2.5 py-3">
              {conversation
                .filter((msg) => visibleMessages.includes(msg.id))
                .map((msg) => (
                  <ChatBubble key={msg.id} message={msg} onVisible={noop} />
                ))}

              {showTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="rounded-2xl rounded-bl-md bg-white shadow-sm shadow-zinc-200/50">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input bar */}
            <div className="flex items-center gap-2 border-t border-zinc-300/50 bg-[#F0ECE4] px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1 rounded-2xl border border-zinc-300/60 bg-white px-3.5 py-1.5 text-[13px] text-zinc-400">
                Message
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#517DA2]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8m-2 5v6l5-3-5-3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Reflection */}
        <div
          className="pointer-events-none relative -z-10 mx-6 h-12 -mt-1 rounded-b-3xl opacity-15"
          style={{
            background: "linear-gradient(to bottom, oklch(0.5 0 0), transparent)",
            maskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
