import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm animate-fade-in-up">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Welcome back</h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Sign in to continue your interview preparation.
      </p>
      <LoginForm />
    </div>
  );
}
