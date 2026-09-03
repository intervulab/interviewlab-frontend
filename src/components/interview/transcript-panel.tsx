"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TranscriptEntry {
  id: string;
  speaker: "candidate" | "ai";
  text: string;
  isFinal: boolean;
}

interface TranscriptPanelProps {
  entries: TranscriptEntry[];
}

export function TranscriptPanel({ entries }: TranscriptPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new entries
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [entries]);

  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-1)] shadow-inner">
      <div className="flex items-center justify-between border-b border-[var(--color-border-default)] px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
          Live Transcript
        </h3>
        <span className="flex h-2 w-2 relative">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent-400)] opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent-500)]"></span>
        </span>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {entries.length === 0 && (
          <p className="text-center text-sm text-[var(--color-text-tertiary)] italic mt-4">
            Transcript will appear here...
          </p>
        )}

        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed",
                entry.speaker === "candidate"
                  ? "bg-[var(--color-surface-2)] text-[var(--color-text-primary)] self-end ml-auto rounded-br-none"
                  : "bg-[var(--color-brand-600)]/20 text-[var(--color-brand-100)] self-start rounded-bl-none",
                !entry.isFinal && "opacity-70 italic"
              )}
            >
              <span className="block text-[10px] uppercase opacity-50 mb-1 font-semibold">
                {entry.speaker === "candidate" ? "You" : "AI Interviewer"}
              </span>
              {entry.text}
              {!entry.isFinal && <span className="ml-1 animate-pulse">...</span>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
