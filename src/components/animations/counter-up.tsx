"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface CounterUpProps {
  /** Target number to count up to */
  target: number;
  /** Prefix (e.g., "$") */
  prefix?: string;
  /** Suffix (e.g., "+", "%", "★") */
  suffix?: string;
  /** Duration of the count animation in seconds */
  duration?: number;
  className?: string;
  /** Whether animation triggers only once */
  once?: boolean;
}

/**
 * Animated number counter that counts up from 0 to target when in view.
 * Uses spring physics for a natural feel.
 */
export function CounterUp({
  target,
  prefix = "",
  suffix = "",
  duration = 2,
  className,
  once = true,
}: CounterUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 50,
    damping: 20 + duration * 5,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [isInView, motionValue, target]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [spring]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      <motion.span>{displayValue.toLocaleString()}</motion.span>
      {suffix}
    </span>
  );
}
