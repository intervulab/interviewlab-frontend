"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] font-[family-name:var(--font-display)]">
          Something went wrong
        </h1>
        <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
          An unexpected error occurred. Our team has been notified.
        </p>
        {error.digest && (
          <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <button
        onClick={reset}
        className="rounded-lg bg-[var(--color-brand-600)] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[var(--color-brand-500)]"
      >
        Try Again
      </button>
    </div>
  );
}
