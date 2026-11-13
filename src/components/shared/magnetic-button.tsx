"use client";

import { useRef } from "react";
import { HTMLMotionProps, motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/** Label insets: horizontal on inner span (reliable); vertical unchanged from original CTAs */
const CTA_LABEL_CLASS: Record<"nav" | "hero", string> = {
  nav: "px-10 py-2",
  hero: "px-14 py-4",
};

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  magneticStrength?: number;
  ctaInset?: "nav" | "hero";
}

export function MagneticButton({
  children,
  className,
  magneticStrength = 0.2,
  ctaInset,
  style,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(distanceX * magneticStrength);
    y.set(distanceY * magneticStrength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, ...style }}
      className={cn(
        "relative inline-flex items-center justify-center p-0 transition-colors",
        !ctaInset && "px-6 py-2.5",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "relative z-10 pointer-events-none inline-flex items-center justify-center",
          ctaInset ? CTA_LABEL_CLASS[ctaInset] : "px-0.5"
        )}
      >
        {children}
      </span>
    </motion.button>
  );
}
