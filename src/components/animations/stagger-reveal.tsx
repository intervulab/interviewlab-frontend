"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay between each child animation in seconds */
  staggerDelay?: number;
  /** Direction children slide in from */
  direction?: "up" | "down" | "left" | "right";
  /** Distance children travel in pixels */
  distance?: number;
  /** Whether animation triggers only once */
  once?: boolean;
}

const directionMap = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 60, y: 0 },
  right: { x: -60, y: 0 },
};

const containerVariants = (staggerDelay: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  },
});

const itemVariants = (direction: "up" | "down" | "left" | "right", distance: number) => {
  const offset = directionMap[direction];
  const scale = distance / 40; // normalize
  return {
    hidden: {
      opacity: 0,
      x: offset.x * scale,
      y: offset.y * scale,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        mass: 0.8,
      },
    },
  };
};

/**
 * Stagger-reveal container. Wraps children and reveals them one-by-one
 * with spring physics as they enter the viewport.
 */
export function StaggerReveal({
  children,
  className,
  staggerDelay = 0.12,
  once = true,
}: StaggerRevealProps) {
  return (
    <motion.div
      variants={containerVariants(staggerDelay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual item within a StaggerReveal container.
 * Must be a direct child of StaggerReveal.
 */
export function StaggerItem({
  children,
  className,
  direction = "up",
  distance = 40,
}: {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}) {
  return (
    <motion.div variants={itemVariants(direction, distance)} className={className}>
      {children}
    </motion.div>
  );
}
