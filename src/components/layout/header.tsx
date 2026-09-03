"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const pathname = usePathname();
  
  // Create a cool glitchy timecode effect
  const [time, setTime] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setTime(
        `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}:${Math.floor(d.getMilliseconds() / 10).toString().padStart(2, "0")}`
      );
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Format the path nicely
  const title = pathname.split("/").filter(Boolean).pop()?.toUpperCase() || "DASHBOARD";

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] flex h-24 items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-0)]/80 px-10 backdrop-blur-xl">
      <div className="flex items-center gap-6">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-[var(--color-text-primary)] font-[family-name:var(--font-display)]">
          {title}
        </h1>
        <div className="h-6 w-px bg-[var(--color-border-default)]" />
        <span className="font-mono text-sm font-bold text-[var(--color-brand-400)] tracking-[0.2em]">
          &gt; STATUS: NOMINAL
        </span>
      </div>

      <div className="flex items-center gap-8">
        <div className="font-mono text-lg font-bold text-[var(--color-text-secondary)] tracking-widest tabular-nums w-[140px] text-right">
          {time}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border-default)] font-bold text-[var(--color-text-primary)] font-[family-name:var(--font-display)] text-xl">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
