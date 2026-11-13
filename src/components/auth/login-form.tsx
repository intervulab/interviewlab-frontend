"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { setAuthSession } from "@/lib/auth-storage";
import { loginUser } from "@/features/backend/api";
import { ApiClientError } from "@/lib/api-client";
import {
  authFormClass,
  authInputClass,
  authLabelClass,
  authSubmitClass,
  authSubmitWrapperClass,
} from "@/components/auth/auth-form-styles";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      setAuthSession(data.token, data.user);
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error && (
        <p className="mb-6 rounded-xl border border-[var(--color-danger-500)]/40 bg-[var(--color-danger-500)]/10 px-4 py-3 text-sm text-[var(--color-danger-400)]">
          {error}
        </p>
      )}
      <form className={authFormClass} onSubmit={onSubmit}>
        <div>
          <label htmlFor="email" className={authLabelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={authInputClass}
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password" className={authLabelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={authInputClass}
            autoComplete="current-password"
          />
        </div>
        <div className={authSubmitWrapperClass}>
          <button type="submit" disabled={loading} className={authSubmitClass}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </form>
      <p className="mt-12 text-center text-sm leading-relaxed text-[var(--color-text-secondary)]">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.REGISTER} className="font-medium text-[var(--color-brand-400)]">
          Sign up
        </Link>
      </p>
    </>
  );
}
