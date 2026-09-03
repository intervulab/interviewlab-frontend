"use client";

import { Toaster } from "sonner";
import type { ReactNode } from "react";

/**
 * Toast notification provider using Sonner.
 * Configured for dark theme with bottom-right positioning.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        theme="dark"
        richColors
        closeButton
        toastOptions={{
          duration: 5000,
          style: {
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border-default)",
            color: "var(--color-text-primary)",
          },
        }}
      />
    </>
  );
}
