"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-storage";
import { ROUTES } from "@/lib/constants";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace(`${ROUTES.LOGIN}?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setReady(true);
  }, [router, pathname]);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--color-text-secondary)]">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
