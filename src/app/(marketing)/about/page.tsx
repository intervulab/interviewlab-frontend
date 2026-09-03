import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
      <h1 className="text-4xl font-bold font-[family-name:var(--font-display)]">
        About <span className="text-gradient">InterviewLab</span>
      </h1>

      <div className="mt-10 space-y-6 text-[var(--color-text-secondary)] leading-relaxed">
        <p>
          InterviewLab was born from a simple frustration: interview preparation
          in 2026 is still broken. Students spend weeks memorizing answers to
          generic questions, only to freeze under pressure when asked something
          unexpected.
        </p>
        <p>
          We&apos;re building something different — a platform where{" "}
          <strong className="text-[var(--color-text-primary)]">
            multiple AI agents debate each other
          </strong>{" "}
          to craft the hardest, most relevant questions for your specific role
          and resume. Where real-time audio analytics catch your hesitations
          before a real interviewer does. Where you can whiteboard system designs
          and get instant architectural feedback.
        </p>
        <p>
          Built by a team of 5 students who believe the best way to prepare for
          interviews isn&apos;t to memorize — it&apos;s to{" "}
          <strong className="text-[var(--color-text-primary)]">practice under pressure</strong>,
          with honest, rigorous feedback.
        </p>

        <h2 className="pt-6 text-2xl font-semibold text-[var(--color-text-primary)] font-[family-name:var(--font-display)]">
          The Architecture
        </h2>
        <p>
          InterviewLab is composed of 5 independent, microservice-style
          components designed for scale:
        </p>
        <ul className="list-inside list-disc space-y-2 pl-2">
          <li>
            <strong>Component 1:</strong> Next.js Frontend & Real-Time Audio Infrastructure
          </li>
          <li>
            <strong>Component 2:</strong> Interactive Multimodal System Design Canvas
          </li>
          <li>
            <strong>Component 3:</strong> Core Node.js Backend & Prisma ORM
          </li>
          <li>
            <strong>Component 4:</strong> LangGraph Multi-Agent Orchestrator & Debate Engine
          </li>
          <li>
            <strong>Component 5:</strong> Custom ML Fine-Tuning & Audio Cognitive Analytics
          </li>
        </ul>
      </div>
    </div>
  );
}
