"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AudioWaveformProps {
  isListening: boolean;
  // A stream of float32 values from 0.0 to 1.0 representing frequency/volume amplitudes
  audioData?: Float32Array;
  barCount?: number;
}

export function AudioWaveform({
  isListening,
  audioData,
  barCount = 30,
}: AudioWaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create an array of bar heights (normalized 0 to 1)
  const barHeights = Array.from({ length: barCount }, (_, i) => {
    if (!isListening) return 0.05; // Idle flat line
    if (audioData && audioData.length > i) {
      return Math.max(0.05, Math.min(1, audioData[i]));
    }
    // Fallback pseudo-random animation if no live data is provided
    return 0.1 + Math.random() * 0.4;
  });

  return (
    <div 
      ref={containerRef}
      className="flex h-16 w-full max-w-xs items-center justify-center gap-[3px]"
    >
      {barHeights.map((height, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-[var(--color-brand-400)]"
          initial={{ height: "10%" }}
          animate={{ height: `${height * 100}%` }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            mass: 0.5,
          }}
          style={{
            boxShadow: `0 0 8px var(--color-brand-500)`,
            opacity: height > 0.1 ? 1 : 0.4,
          }}
        />
      ))}
    </div>
  );
}
