"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  /** Animation duration in seconds */
  duration?: number;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** How far the element floats in pixels */
  amplitude?: number;
  /** Whether to also rotate slightly */
  rotate?: boolean;
}

/**
 * CSS-only floating animation for decorative 3D objects.
 * Uses pure CSS keyframes for zero JS overhead.
 */
export function FloatingElement({
  children,
  className,
  duration = 6,
  delay = 0,
  amplitude = 20,
  rotate = true,
}: FloatingElementProps) {
  return (
    <div
      className={cn("animate-float", className)}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        // @ts-expect-error CSS custom properties
        "--float-amplitude": `${amplitude}px`,
        "--float-rotate": rotate ? "3deg" : "0deg",
      }}
    >
      {children}
    </div>
  );
}
