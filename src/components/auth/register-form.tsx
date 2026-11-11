"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { setAuthSession } from "@/lib/auth-storage";
import { registerCandidate } from "@/features/backend/api";
import { ApiClientError } from "@/lib/api-client";

export function RegisterForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetRole, setTargetRole] = useState("Backend Engineer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await registerCandidate({
        email,
        password,
        firstName,
        lastName,
        targetRole,
      });
      setAuthSession(data.token, data.user);
      router.push(ROUTES.PRACTICE);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Registration failed");
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">First name</label>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Last name</label>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-3 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Password (min 8)</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Target role</label>
          <input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-3 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--color-brand-600)] py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create Account"}
        </button>
      </form>
      <p className="mt-8 text-center text-sm">
        <Link href={ROUTES.LOGIN} className="text-[var(--color-brand-400)]">
          Sign in
        </Link>
      </p>
    </>
  );
}
