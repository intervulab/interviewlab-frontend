import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { authPageShellClass } from "@/components/auth/auth-form-styles";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <div className={authPageShellClass}>
      <h1 className="text-3xl font-bold font-[family-name:var(--font-display)]">Welcome back</h1>
      <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
        Sign in to continue your interview preparation.
      </p>
      <LoginForm />
    </div>
  );
}
