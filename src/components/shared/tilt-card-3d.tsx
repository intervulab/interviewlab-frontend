"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;
}

export function TiltCard3D({ children, className, glareColor = "var(--color-brand-400)" }: TiltCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth return
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Rotate transforms (rotate up to 15 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Glare position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useTransform(
    mouseXSpring,
    [-0.5, 0, 0.5],
    [0.1, 0.3, 0.1]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalize mouse position to range [-0.5, 0.5]
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-1)] transition-colors duration-300",
        isHovered ? "border-[var(--color-brand-500)] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]" : "",
        className
      )}
    >
      {/* ── 3D Content Wrapper ── */}
      <div 
        className="h-full w-full relative z-10"
        style={{ transform: "translateZ(30px)" }}
      >
        {children}
      </div>

      {/* ── Dynamic Glare Layer ── */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? glareOpacity : 0,
          background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, ${glareColor}, transparent 60%)`,
          mixBlendMode: "soft-light"
        }}
      />
    </motion.div>
  );
}
