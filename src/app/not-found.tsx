import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <h1 className="text-gradient text-8xl font-bold tracking-tight font-[family-name:var(--font-display)]">
          404
        </h1>
        <p className="mt-4 text-xl text-[var(--color-text-secondary)]">
          This page doesn&apos;t exist — just like your impostor syndrome.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="rounded-lg bg-[var(--color-brand-600)] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[var(--color-brand-500)] hover:shadow-[var(--shadow-glow)]"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
