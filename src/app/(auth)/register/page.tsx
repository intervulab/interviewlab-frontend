import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { authPageShellClass } from "@/components/auth/auth-form-styles";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function RegisterPage() {
  return (
    <div className={authPageShellClass}>
      <h1 className="text-3xl font-bold font-[family-name:var(--font-display)]">Create your account</h1>
      <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
        Start mastering interviews in under 2 minutes.
      </p>
      <RegisterForm />
    </div>
  );
}
