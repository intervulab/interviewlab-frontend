/**
 * Interview session layout — minimal chrome, full-screen experience.
 * No sidebar, no header. Just the interview room.
 */
export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[var(--color-surface-0)]">
      {children}
    </div>
  );
}
