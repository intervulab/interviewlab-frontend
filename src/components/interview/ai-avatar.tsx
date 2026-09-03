"use client";

import { motion } from "framer-motion";

interface AIAvatarProps {
  isSpeaking: boolean;
  isProcessing: boolean;
}

export function AIAvatar({ isSpeaking, isProcessing }: AIAvatarProps) {
  // Glow intensity
  const glowVariants = {
    idle: {
      scale: 1,
      opacity: 0.2,
      transition: { repeat: Infinity, repeatType: "reverse" as const, duration: 3 },
    },
    speaking: {
      scale: [1, 1.4, 1.1, 1.3, 1],
      opacity: [0.3, 0.8, 0.5, 0.7, 0.3],
      transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" as const },
    },
    processing: {
      scale: 1.1,
      opacity: 0.6,
      transition: { repeat: Infinity, duration: 2, ease: "linear" as const },
    },
  };

  const orbColor = isSpeaking 
    ? "var(--color-brand-500)" // Lime
    : isProcessing 
      ? "var(--color-accent-400)" // Blue
      : "var(--color-surface-4)"; // Dim grey

  const currentState = isSpeaking ? "speaking" : isProcessing ? "processing" : "idle";

  return (
    <div className="relative flex h-80 w-80 items-center justify-center">
      
      {/* ── Outer Ambient Glow ── */}
      <motion.div
        className="absolute inset-0 rounded-full blur-[60px]"
        style={{ backgroundColor: orbColor }}
        variants={glowVariants}
        initial="idle"
        animate={currentState}
      />

      {/* ── Orbital Rings ── */}
      <motion.div
        className="absolute h-64 w-64 rounded-full border border-dashed border-[var(--color-text-secondary)] opacity-20"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      />
      <motion.div
        className="absolute h-56 w-56 rounded-full border border-[var(--color-text-secondary)] opacity-10"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
      />
      <motion.div
        className="absolute h-[70%] w-[70%] rounded-full border-[2px] border-t-transparent border-l-transparent"
        style={{ borderColor: orbColor }}
        animate={{ 
          rotate: isProcessing ? 720 : 360,
          scale: isSpeaking ? [1, 1.1, 1] : 1
        }}
        transition={{ 
          rotate: { repeat: Infinity, duration: isProcessing ? 1 : 4, ease: "linear" },
          scale: { repeat: Infinity, duration: 0.5 }
        }}
      />

      {/* ── Central Neural Core ── */}
      <motion.div 
        className="relative flex h-32 w-32 items-center justify-center rounded-full bg-black shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] z-10 overflow-hidden border border-[var(--color-border-subtle)]"
        animate={{
          scale: isSpeaking ? [1, 1.15, 1] : 1,
        }}
        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr opacity-50 mix-blend-overlay"
          style={{ 
            backgroundImage: `linear-gradient(to top right, black, ${orbColor})` 
          }}
          animate={{
            rotate: 360
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        />
        <div className="h-12 w-12 rounded-full blur-md" style={{ backgroundColor: orbColor }} />
      </motion.div>
    </div>
  );
}
