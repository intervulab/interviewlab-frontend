"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  /** Color of the glow effect */
  glowColor?: string;
  /** Intensity of the glow (0-1) */
  intensity?: number;
}

/**
 * Mouse-tracking glow card — follows cursor with a radial gradient
 * spotlight that illuminates the card border and surface.
 */
export function GlowCard({
  children,
  className,
  glowColor = "var(--color-brand-500)",
  intensity = 0.15,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(ref.current ? ref.current.offsetWidth / 2 : 0);
    mouseY.set(ref.current ? ref.current.offsetHeight / 2 : 0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-1)] transition-colors duration-300 hover:border-[var(--color-border-strong)]",
        className
      )}
    >
      {/* Glow spotlight layer */}
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${springX.get()}px ${springY.get()}px, ${glowColor}, transparent 40%)`,
          opacity: intensity,
        }}
      />

      {/* Border glow layer */}
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px circle at ${springX.get()}px ${springY.get()}px, ${glowColor}, transparent 40%)`,
          opacity: intensity * 0.5,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
