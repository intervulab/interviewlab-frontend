"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TranscriptEntry {
  id: string;
  speaker: "candidate" | "ai";
  text: string;
  isFinal: boolean;
  label?: string;
}

interface TranscriptPanelProps {
  entries: TranscriptEntry[];
  className?: string;
}

export function TranscriptPanel({ entries, className }: TranscriptPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries]);

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-1)] shadow-inner",
        className
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border-default)] px-5 py-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
          Session transcript
        </h3>
        <span className="flex h-2 w-2 relative">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent-400)] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent-500)]" />
        </span>
      </div>

      <div
        ref={containerRef}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-5 space-y-5"
      >
        {entries.length === 0 && (
          <p className="text-center text-sm text-[var(--color-text-tertiary)] italic mt-4 px-2">
            Questions and your answers appear here as you progress.
          </p>
        )}

        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "max-w-[95%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed",
                entry.speaker === "candidate"
                  ? "bg-[var(--color-surface-2)] text-[var(--color-text-primary)] ml-auto rounded-br-sm"
                  : "bg-[var(--color-brand-600)]/20 text-[var(--color-brand-100)] mr-auto rounded-bl-sm",
                !entry.isFinal && "opacity-80 border border-dashed border-[var(--color-brand-500)]/40"
              )}
            >
              <span className="block text-[10px] uppercase tracking-wide opacity-70 mb-2 font-semibold px-0.5">
                {entry.label ??
                  (entry.speaker === "candidate" ? "You" : "AI Interviewer")}
              </span>
              <p className="whitespace-pre-wrap break-words">{entry.text}</p>
              {!entry.isFinal && <span className="ml-1 animate-pulse text-[var(--color-brand-400)]">●</span>}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} className="h-1 shrink-0" aria-hidden />
      </div>
    </div>
  );
}
