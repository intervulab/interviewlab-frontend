"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { setAuthSession } from "@/lib/auth-storage";
import { registerCandidate } from "@/features/backend/api";
import { ApiClientError } from "@/lib/api-client";
import {
  authFormClass,
  authInputClass,
  authLabelClass,
  authSubmitClass,
  authSubmitWrapperClass,
} from "@/components/auth/auth-form-styles";

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
        <p className="mb-6 rounded-xl border border-[var(--color-danger-500)]/40 bg-[var(--color-danger-500)]/10 px-4 py-3 text-sm text-[var(--color-danger-400)]">
          {error}
        </p>
      )}
      <form className={authFormClass} onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={authLabelClass}>First name</label>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={authInputClass}
            />
          </div>
          <div>
            <label className={authLabelClass}>Last name</label>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={authInputClass}
            />
          </div>
        </div>
        <div>
          <label className={authLabelClass}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClass}
          />
        </div>
        <div>
          <label className={authLabelClass}>Password (min 8)</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
          />
        </div>
        <div>
          <label className={authLabelClass}>Target role</label>
          <input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className={authInputClass}
          />
        </div>
        <div className={authSubmitWrapperClass}>
          <button type="submit" disabled={loading} className={authSubmitClass}>
            {loading ? "Creating…" : "Create Account"}
          </button>
        </div>
      </form>
      <p className="mt-12 text-center text-sm leading-relaxed">
        <Link href={ROUTES.LOGIN} className="text-[var(--color-brand-400)]">
          Sign in
        </Link>
      </p>
    </>
  );
}
