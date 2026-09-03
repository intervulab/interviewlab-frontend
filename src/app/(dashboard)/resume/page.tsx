import type { Metadata } from "next";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  return (
    <div className="animate-fade-in-up space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Resume</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Upload your resume for ATS analysis and personalized interview questions.
        </p>
      </div>

      {/* Upload Area */}
      <div className="glass flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border-default)] py-16 transition-colors hover:border-[var(--color-brand-500)]">
        <span className="text-4xl">📄</span>
        <p className="mt-4 font-medium">Drop your resume here</p>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          PDF or DOCX, up to 10MB
        </p>
        <button className="mt-6 rounded-lg bg-[var(--color-brand-600)] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[var(--color-brand-500)]">
          Browse Files
        </button>
      </div>
    </div>
  );
}
