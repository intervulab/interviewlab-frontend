"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES, SIDEBAR_WIDTH } from "@/lib/constants";
import { MagneticButton } from "@/components/shared/magnetic-button";

const navItems = [
  { href: ROUTES.DASHBOARD, label: "Dashboard", timecode: "00:00" },
  { href: ROUTES.PRACTICE, label: "Practice", timecode: "00:15" },
  { href: ROUTES.INTERVIEWS, label: "Interviews", timecode: "00:30" },
  { href: ROUTES.PASSPORT, label: "Passport", timecode: "00:45" },
  { href: ROUTES.RESUME, label: "Resume", timecode: "01:00" },
  { href: ROUTES.SETTINGS, label: "Settings", timecode: "01:15" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-surface-0)] z-20 overflow-hidden"
      style={{ width: SIDEBAR_WIDTH }}
    >
      {/* ── Logo Area ── */}
      <div className="flex h-24 flex-col justify-center px-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-1)]">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-brand-500)] font-bold mb-1">
          SYS.V1 // ONLINE
        </span>
        <span className="text-3xl font-black font-[family-name:var(--font-display)] uppercase tracking-tighter text-[var(--color-text-primary)]">
          InterviewLab
        </span>
      </div>

      {/* ── Navigation (Timecode motif) ── */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center justify-between rounded-lg px-4 py-4 transition-all duration-300",
                isActive
                  ? "bg-[var(--color-brand-500)] text-white diagonal-cut"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
              )}
            >
              <span className={cn(
                "text-3xl font-black uppercase font-[family-name:var(--font-display)] tracking-tighter leading-none mt-1",
                isActive ? "" : "group-hover:translate-x-2 transition-transform duration-300"
              )}>
                {item.label}
              </span>
              <span className={cn(
                "font-mono text-xs font-bold",
                isActive ? "text-white/70" : "text-[var(--color-text-tertiary)]"
              )}>
                {item.timecode}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom CTA ── */}
      <div className="p-6 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-1)]">
        <Link href={ROUTES.PRACTICE} className="block w-full">
          <MagneticButton 
            className="w-full bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-500)] text-white shadow-[0_0_20px_oklch(0.75_0.22_140_/_0.2)] rounded-none py-5 text-sm font-bold uppercase tracking-widest diagonal-cut transition-colors"
            magneticStrength={0.2}
          >
            Launch Core
          </MagneticButton>
        </Link>
      </div>
    </aside>
  );
}
