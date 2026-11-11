import { RequireAuth } from "@/components/auth/require-auth";

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="flex h-dvh flex-col overflow-hidden bg-[var(--color-surface-0)]">
        {children}
      </div>
    </RequireAuth>
  );
}
