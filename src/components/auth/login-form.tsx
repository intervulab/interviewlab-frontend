"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { setAuthSession } from "@/lib/auth-storage";
import { loginUser } from "@/features/backend/api";
import { ApiClientError } from "@/lib/api-client";

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
        <p className="mb-4 rounded-lg border border-[var(--color-danger-500)]/40 bg-[var(--color-danger-500)]/10 px-3 py-2 text-sm text-[var(--color-danger-400)]">
          {error}
        </p>
      )}
      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-3 text-sm"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-3 text-sm"
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--color-brand-600)] py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.REGISTER} className="font-medium text-[var(--color-brand-400)]">
          Sign up
        </Link>
      </p>
    </>
  );
}
