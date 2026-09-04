"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollParallaxProps {
  children: ReactNode;
  /** How much the element moves relative to scroll (0.1 = subtle, 0.5 = dramatic) */
  speed?: number;
  /** Direction of parallax movement */
  direction?: "up" | "down";
  /** Fade out as element scrolls away */
  fadeOut?: boolean;
  className?: string;
}

/**
 * Scroll-linked parallax wrapper.
 * Wraps any child and moves it at a configurable speed relative to scroll position.
 */
export function ScrollParallax({
  children,
  speed = 0.2,
  direction = "up",
  fadeOut = false,
  className,
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = direction === "up" ? -1 : 1;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [multiplier * speed * 200, multiplier * speed * -200]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    fadeOut ? [0, 1, 1, 0] : [1, 1, 1, 1]
  );

  return (
    <motion.div ref={ref} style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}
