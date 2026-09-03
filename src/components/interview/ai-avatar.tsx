"use client";

import { motion } from "framer-motion";

interface AIAvatarProps {
  isSpeaking: boolean;
  isProcessing: boolean;
}

export function AIAvatar({ isSpeaking, isProcessing }: AIAvatarProps) {
  // Core variants for the avatar glow depending on state
  const glowVariants = {
    idle: {
      scale: 1,
      opacity: 0.3,
      transition: { repeat: Infinity, repeatType: "reverse" as const, duration: 2 },
    },
    speaking: {
      scale: [1, 1.2, 1.05, 1.15, 1],
      opacity: [0.4, 0.8, 0.6, 0.8, 0.4],
      transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" as const },
    },
    processing: {
      scale: 1.1,
      opacity: 0.6,
      rotate: 360,
      transition: { repeat: Infinity, duration: 3, ease: "linear" as const },
    },
  };

  const ringVariants = {
    idle: { scale: 1, opacity: 0 },
    speaking: {
      scale: [1, 2.5],
      opacity: [0.6, 0],
      transition: { repeat: Infinity, duration: 2, ease: "easeOut" as const },
    },
    processing: { scale: 1, opacity: 0 },
  };

  const currentState = isSpeaking ? "speaking" : isProcessing ? "processing" : "idle";

  return (
    <div className="relative flex h-64 w-64 items-center justify-center">
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[var(--color-brand-500)] blur-xl"
        variants={glowVariants}
        initial="idle"
        animate={currentState}
      />

      {/* Emitting Ripple Rings */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[var(--color-brand-400)]"
        variants={ringVariants}
        initial="idle"
        animate={currentState}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[var(--color-brand-400)]"
        variants={ringVariants}
        initial="idle"
        animate={currentState}
        style={{ animationDelay: "1s" }} // Offset second ripple
      />

      {/* Solid Inner Avatar Container */}
      <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-1)] shadow-2xl z-10 backdrop-blur-md">
        <span className="text-6xl drop-shadow-lg">🤖</span>
      </div>
    </div>
  );
}
