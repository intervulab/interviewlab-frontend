"use client";

import { HEADER_HEIGHT } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";

export function Header() {
  return (
    <header
      className="flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-0)]/80 backdrop-blur-md px-6 z-10 sticky top-0"
      style={{ height: HEADER_HEIGHT }}
    >
      {/* ── Search ── */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
        <Input
          type="text"
          placeholder="Search interviews, topics..."
          className="pl-9 bg-[var(--color-surface-1)] border-[var(--color-border-default)] focus-visible:ring-[var(--color-brand-500)]"
        />
      </div>

      {/* ── Right Section ── */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]">
          <Bell className="h-5 w-5" />
        </Button>

        {/* User Avatar */}
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)] text-xs font-bold text-white transition-transform hover:scale-105 shadow-md">
          U
        </button>
      </div>
    </header>
  );
}
