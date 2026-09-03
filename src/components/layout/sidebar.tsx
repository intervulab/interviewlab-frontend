"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES, SIDEBAR_WIDTH } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: ROUTES.DASHBOARD, label: "Dashboard", icon: "📊" },
  { href: ROUTES.PRACTICE, label: "Practice", icon: "🎯" },
  { href: ROUTES.INTERVIEWS, label: "Interviews", icon: "📋" },
  { href: ROUTES.PASSPORT, label: "Passport", icon: "🪪" },
  { href: ROUTES.RESUME, label: "Resume", icon: "📄" },
  { href: ROUTES.SETTINGS, label: "Settings", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-surface-1)]/50 backdrop-blur-xl z-20"
      style={{ width: SIDEBAR_WIDTH }}
    >
      {/* ── Logo ── */}
      <div className="flex h-16 items-center gap-3 border-b border-[var(--color-border-subtle)] px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand-400)] to-[var(--color-brand-600)] shadow-lg shadow-[var(--color-brand-500)]/20">
          <span className="text-sm font-bold text-white tracking-tighter">IL</span>
        </div>
        <span className="text-lg font-semibold font-[family-name:var(--font-display)] bg-clip-text text-transparent bg-gradient-to-r from-white to-[var(--color-text-secondary)]">
          InterviewLab
        </span>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 space-y-1.5 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[var(--color-brand-600)]/15 text-[var(--color-brand-400)] shadow-sm shadow-[var(--color-brand-500)]/5 border border-[var(--color-brand-500)]/20"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)] border border-transparent"
              )}
            >
              <span className="text-lg grayscale-[50%] contrast-125">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--color-border-subtle)] p-5">
        <Link href={ROUTES.PRACTICE} className="block">
          <Button className="w-full bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-500)] shadow-[var(--shadow-glow)] rounded-xl py-6 text-sm font-semibold">
            🎤 Start Interview
          </Button>
        </Link>
      </div>
    </aside>
  );
}
