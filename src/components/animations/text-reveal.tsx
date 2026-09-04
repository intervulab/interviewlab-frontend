"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  /** Reveal mode */
  mode?: "char" | "word";
  /** Delay between each unit in seconds */
  staggerDelay?: number;
  /** Whether to apply gradient coloring */
  gradient?: boolean;
  /** Whether animation triggers only once */
  once?: boolean;
}

const containerVariants = (staggerDelay: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

const unitVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    rotateX: 90,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 20,
    },
  },
};

/**
 * Text reveal animation — character-by-character or word-by-word.
 * Each unit flips in with a 3D rotation and blur effect.
 */
export function TextReveal({
  text,
  className,
  mode = "word",
  staggerDelay = 0.04,
  gradient = false,
  once = true,
}: TextRevealProps) {
  const units = useMemo(() => {
    if (mode === "char") {
      return text.split("").map((char, i) => ({
        key: `${char}-${i}`,
        content: char === " " ? "\u00A0" : char,
      }));
    }
    return text.split(" ").map((word, i) => ({
      key: `${word}-${i}`,
      content: word,
    }));
  }, [text, mode]);

  return (
    <motion.span
      variants={containerVariants(staggerDelay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      className={cn(
        "inline-flex flex-wrap",
        mode === "word" && "gap-x-[0.3em]",
        gradient && "text-gradient",
        className
      )}
      style={{ perspective: "600px" }}
    >
      {units.map((unit) => (
        <motion.span
          key={unit.key}
          variants={unitVariants}
          className="inline-block origin-bottom"
        >
          {unit.content}
        </motion.span>
      ))}
    </motion.span>
  );
}
