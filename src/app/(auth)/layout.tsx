export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh">
      {/* ── Left: Auth Form ── */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        {children}
      </div>

      {/* ── Right: Brand Panel ── */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-900)] via-[var(--color-brand-700)] to-[var(--color-surface-0)]" />
        <div className="relative flex h-full flex-col items-center justify-center px-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl">
            <span className="text-2xl font-bold text-white">IL</span>
          </div>
          <h2 className="mt-8 text-3xl font-bold text-white font-[family-name:var(--font-display)]">
            Practice makes permanent.
          </h2>
          <p className="mt-4 max-w-md text-base text-white/70">
            AI-powered mock interviews that push you harder than any real
            interviewer ever could.
          </p>
        </div>
      </div>
    </div>
  );
}
