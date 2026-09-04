"use client";

import { motion, AnimatePresence } from "framer-motion";

interface FreezeRecoveryCueProps {
  isActive: boolean;
  onActionClick?: () => void;
}

export function FreezeRecoveryCue({ isActive, onActionClick }: FreezeRecoveryCueProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[var(--z-toast)] flex flex-col items-center gap-3"
        >
          {/* Breathing Visualizer */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-500)]/20 border border-[var(--color-accent-400)]/40 shadow-[0_0_20px_oklch(0.65_0.22_160_/_0.3)] backdrop-blur-md"
          >
            <span className="text-2xl">🧘</span>
          </motion.div>

          <div className="glass rounded-xl px-6 py-4 text-center border border-[var(--color-accent-500)]/30 max-w-sm">
            <h4 className="font-semibold text-[var(--color-text-primary)]">
              Take your time.
            </h4>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          It looks like you paused. Take a breath. It&apos;s completely fine to say, &quot;I need a moment to collect my thoughts.&quot;
        </p>
            <button
              onClick={onActionClick}
              className="mt-3 rounded-lg bg-[var(--color-accent-500)]/20 px-4 py-2 text-xs font-semibold text-[var(--color-accent-400)] hover:bg-[var(--color-accent-500)]/30 transition-colors"
            >
              &quot;Can I get a hint?&quot;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
