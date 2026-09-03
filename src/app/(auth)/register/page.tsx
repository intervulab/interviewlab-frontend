import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm animate-fade-in-up">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Start mastering interviews in under 2 minutes.
      </p>

      <form className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Jane Doe"
            className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-500)]"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="register-email" className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-500)]"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="register-password" className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            placeholder="Min 8 characters"
            className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-500)]"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-[var(--color-brand-600)] py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--color-brand-500)] hover:shadow-[var(--shadow-glow)]"
        >
          Create Account
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
        Already have an account?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-medium text-[var(--color-brand-400)] hover:text-[var(--color-brand-300)]"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
