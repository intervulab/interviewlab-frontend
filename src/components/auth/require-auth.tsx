"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-storage";
import { ROUTES } from "@/lib/constants";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace(`${ROUTES.LOGIN}?next=${encodeURIComponent(pathname)}`);
    }
  }, [router, pathname]);

  if (!isAuthenticated()) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--color-text-secondary)]">
        Redirecting to sign in…
      </div>
    );
  }

  return <>{children}</>;
}
