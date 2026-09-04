"use client";

/**
 * System Design Canvas Page
 *
 * This page hosts the interactive system design canvas (Component 2 integration).
 * Candidates drag-and-drop system components and the AI provides real-time feedback.
 */
export default function CanvasPage() {
  return (
    <div className="flex h-full flex-col">
      {/* ── Canvas Top Bar ── */}
      <header className="glass flex items-center justify-between border-b border-[var(--glass-border)] px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">System Design Canvas</span>
          <span className="rounded-full bg-[var(--color-brand-500)]/20 px-2 py-0.5 text-xs font-medium text-[var(--color-brand-400)]">
            Interactive
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-[var(--color-border-default)] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--color-surface-2)]">
            Clear Canvas
          </button>
          <button className="rounded-lg border border-[var(--color-border-default)] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--color-surface-2)]">
            Export
          </button>
        </div>
      </header>

      {/* ── Canvas Area ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Component Palette */}
        <div className="w-56 border-r border-[var(--color-border-subtle)] p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
            Components
          </h3>
          <div className="mt-4 space-y-2">
            {[
              { icon: "🖥️", name: "Server" },
              { icon: "🗄️", name: "Database" },
              { icon: "⚖️", name: "Load Balancer" },
              { icon: "📦", name: "Cache" },
              { icon: "📨", name: "Message Queue" },
              { icon: "🌐", name: "CDN" },
              { icon: "🔐", name: "Auth Service" },
              { icon: "📡", name: "API Gateway" },
            ].map((comp) => (
              <div
                key={comp.name}
                className="flex cursor-grab items-center gap-2 rounded-lg border border-[var(--color-border-default)] p-2.5 text-sm transition-all hover:border-[var(--color-brand-500)] hover:shadow-sm active:cursor-grabbing"
                draggable
              >
                <span>{comp.icon}</span>
                <span>{comp.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Embed Area — Component 2 mounts here */}
        <div className="flex flex-1 items-center justify-center bg-[var(--color-surface-1)]">
          <div className="text-center text-[var(--color-text-tertiary)]">
            <span className="text-4xl">🎨</span>
            <p className="mt-4 font-medium">System Design Canvas</p>
            <p className="mt-1 text-sm">
              Component 2 (Interactive Canvas) will mount here.
            </p>
            <p className="mt-1 text-xs">
              Drag components from the left panel to design your architecture.
            </p>
          </div>
        </div>

        {/* AI Feedback Panel */}
        <div className="w-72 border-l border-[var(--color-border-subtle)] p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
            AI Feedback
          </h3>
          <div className="mt-4 space-y-3">
            <p className="text-sm text-[var(--color-text-secondary)] italic">
              The AI will analyze your design and provide feedback here...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
