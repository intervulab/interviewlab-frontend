"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ROUTES } from "@/lib/constants";
import { submitSystemDesign } from "@/features/backend/api";
import { ApiClientError } from "@/lib/api-client";

export default function CanvasPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const canvasBase = process.env.NEXT_PUBLIC_CANVAS_APP_URL || "http://localhost:3001";
  const iframeSrc = `${canvasBase}?sessionId=${encodeURIComponent(sessionId)}`;

  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitTopology = useCallback(
    async (topology: unknown) => {
      setError(null);
      try {
        await submitSystemDesign(sessionId, { topology, submittedAt: new Date().toISOString() });
        setStatus("Canvas submitted for AI assessment.");
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : "Submit failed");
      }
    },
    [sessionId]
  );

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.data?.type === "topology" && event.data.topology) {
        submitTopology(event.data.topology);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [submitTopology]);

  function requestTopology() {
    const frame = document.getElementById("system-canvas-iframe") as HTMLIFrameElement | null;
    frame?.contentWindow?.postMessage({ type: "request_topology" }, "*");
    setStatus("Requesting topology from canvas…");
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-6 py-3">
        <Link href={ROUTES.INTERVIEW_SESSION(sessionId)} className="text-sm text-[var(--color-brand-400)]">
          ← Back to interview
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={requestTopology}
            className="rounded-lg bg-[var(--color-brand-600)] px-4 py-2 text-xs font-bold text-white"
          >
            Submit design
          </button>
        </div>
      </header>
      {status && <p className="px-6 py-2 text-xs text-[var(--color-text-secondary)]">{status}</p>}
      {error && <p className="px-6 py-2 text-xs text-[var(--color-danger-400)]">{error}</p>}
      <iframe
        id="system-canvas-iframe"
        title="System Design Canvas"
        src={iframeSrc}
        className="flex-1 w-full border-0 bg-[var(--color-surface-1)]"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
