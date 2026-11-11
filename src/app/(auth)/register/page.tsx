import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm animate-fade-in-up">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Create your account</h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Start mastering interviews in under 2 minutes.
      </p>
      <RegisterForm />
    </div>
  );
}
