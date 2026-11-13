"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TiltCard3D } from "@/components/shared/tilt-card-3d";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { RESUME_CONFIG } from "@/lib/constants";

interface ResumeRecord {
  id: string;
  originalFileName: string;
  storedFileName: string;
  fileUrl: string;
  mimeType: string;
  fileSizeBytes: number;
  extractedText?: string | null;
  status: "PENDING" | "PROCESSING" | "PARSED" | "FAILED";
  failureReason?: string | null;
  createdAt: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ResumePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchResumes = useCallback(async () => {
    try {
      const token = localStorage.getItem("interviewlab_token");
      const res = await fetch("/api/v1/resumes", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch resumes (${res.status})`);
      }

      const json = await res.json();
      const list: ResumeRecord[] = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json)
          ? json
          : [];

      setResumes(list);
      setSelectedResume((prev) => {
        if (list.length === 0) return null;
        if (prev) {
          const updated = list.find((r) => r.id === prev.id);
          return updated || list[0];
        }
        return list[0];
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not load resumes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  // Poll automatically while any resume is PENDING or PROCESSING
  useEffect(() => {
    const hasPending = resumes.some(
      (r) => r.status === "PENDING" || r.status === "PROCESSING"
    );
    if (!hasPending) return;

    const interval = setInterval(() => {
      fetchResumes();
    }, 4000);

    return () => clearInterval(interval);
  }, [resumes, fetchResumes]);

  async function handleFileUpload(file: File) {
    setError(null);
    setSuccessMsg(null);

    const maxBytes = RESUME_CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`File exceeds ${RESUME_CONFIG.MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    const allowedExtensions = [".pdf", ".docx", ".doc"];
    const lowerName = file.name.toLowerCase();
    if (!allowedExtensions.some((ext) => lowerName.endsWith(ext))) {
      setError("Unsupported file format. Please upload a PDF or DOCX file.");
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem("interviewlab_token");
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("/api/v1/resumes/upload", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
        credentials: "include",
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.message || `Upload failed (${res.status})`);
      }

      setSuccessMsg(`Uploaded "${file.name}" successfully.`);
      if (json?.data) {
        setSelectedResume(json.data);
      }
      await fetchResumes();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload resume");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }

  return (
    <div className="animate-fade-in-up space-y-12 pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--color-border-subtle)] pb-8 gap-6">
        <div>
          <h1 className="text-7xl lg:text-8xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
            RESUME <span className="text-[var(--color-brand-400)]">PARSER</span>
          </h1>
          <p className="mt-2 text-lg text-[var(--color-text-secondary)] font-mono uppercase tracking-widest font-bold">
            &gt; INGEST_DATA // GENERATE_PERSONALIZED_QUESTIONS
          </p>
        </div>
        {resumes.length > 0 && (
          <div onClick={() => router.push("/practice")}>
            <MagneticButton
              className="bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-500)] text-white px-8 py-4 text-sm font-bold uppercase tracking-widest diagonal-cut transition-colors shadow-[0_0_20px_oklch(0.75_0.22_140_/_0.2)] whitespace-nowrap"
              magneticStrength={0.15}
            >
              Start Interview With Resume →
            </MagneticButton>
          </div>
        )}
      </div>

      {/* ── ALERTS ── */}
      {error && (
        <div className="border border-[var(--color-danger-500)] bg-[var(--color-surface-1)] p-5 font-mono text-sm text-[var(--color-danger-500)]">
          ERROR: {error}
        </div>
      )}
      {successMsg && (
        <div className="border border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/10 p-5 font-mono text-sm text-[var(--color-brand-400)]">
          {successMsg}
        </div>
      )}

      {/* ── UPLOAD AREA ── */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <TiltCard3D
          className={`flex flex-col items-center justify-center p-16 text-center border-2 border-dashed transition-colors ${dragActive
              ? "border-[var(--color-brand-400)] bg-[var(--color-brand-500)]/10"
              : "border-[var(--color-border-default)] hover:border-[var(--color-brand-500)]"
            }`}
          glareColor="var(--color-brand-500)"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />

          <div className="text-7xl mb-6 opacity-30 drop-shadow-lg">📄</div>
          <h2 className="text-5xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)] tracking-tight">
            {uploading ? "Uploading File..." : "Drop File Here"}
          </h2>
          <p className="mt-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] max-w-md">
            PDF OR DOCX (MAX {RESUME_CONFIG.MAX_FILE_SIZE_MB}MB)
          </p>
          <div className="mt-10" onClick={() => !uploading && fileInputRef.current?.click()}>
            <MagneticButton
              className="bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-500)] text-white px-10 py-5 text-sm font-bold uppercase tracking-widest diagonal-cut transition-colors shadow-[0_0_20px_oklch(0.75_0.22_140_/_0.3)]"
              magneticStrength={0.2}
            >
              {uploading ? "Ingesting..." : "Browse Files"}
            </MagneticButton>
          </div>
        </TiltCard3D>
      </div>

      {/* ── UPLOADED RESUMES & EXTRACTED TEXT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Uploaded Resume List */}
        <div className="space-y-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
            Uploaded Archives ({resumes.length})
          </h3>

          {loading ? (
            <div className="border border-[var(--color-border-subtle)] p-6 font-mono text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">
              Loading resumes...
            </div>
          ) : resumes.length === 0 ? (
            <div className="border border-dashed border-[var(--color-border-subtle)] p-6 font-mono text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">
              No resumes uploaded yet.
            </div>
          ) : (
            resumes.map((resume) => {
              const isSelected = selectedResume?.id === resume.id;
              return (
                <button
                  key={resume.id}
                  onClick={() => setSelectedResume(resume)}
                  className={`w-full text-left border p-5 transition-colors space-y-2 ${isSelected
                      ? "border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/10"
                      : "border-[var(--color-border-default)] bg-[var(--color-surface-1)] hover:border-[var(--color-brand-400)]"
                    }`}
                >
                  <div className="flex items-center justify-between gap-2 font-mono text-xs uppercase tracking-widest">
                    <span
                      className={`font-bold ${resume.status === "PARSED"
                          ? "text-[var(--color-brand-400)]"
                          : resume.status === "FAILED"
                            ? "text-[var(--color-danger-500)]"
                            : "text-yellow-400"
                        }`}
                    >
                      [{resume.status}]
                    </span>
                    <span className="text-[var(--color-text-tertiary)]">
                      {formatBytes(resume.fileSizeBytes)}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-[var(--color-text-primary)] truncate">
                    {resume.originalFileName}
                  </div>
                  <div className="font-mono text-xs text-[var(--color-text-tertiary)]">
                    {new Date(resume.createdAt).toLocaleString()}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right: Extracted Content Preview */}
        <div className="lg:col-span-2">
          <TiltCard3D
            className="p-8 border border-[var(--color-border-default)] bg-[var(--color-surface-1)] space-y-4 min-h-[280px]"
            glareColor="var(--color-brand-500)"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
              <h3 className="text-2xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
                Extracted Resume Telemetry
              </h3>
              {selectedResume && (
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-brand-400)]">
                  {selectedResume.originalFileName}
                </span>
              )}
            </div>

            {!selectedResume ? (
              <div className="py-12 text-center font-mono text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">
                Upload or select a resume to inspect extracted content.
              </div>
            ) : selectedResume.status === "FAILED" ? (
              <div className="font-mono text-sm text-[var(--color-danger-500)]">
                Parsing failed: {selectedResume.failureReason || "Unknown error"}
              </div>
            ) : selectedResume.extractedText ? (
              <pre className="whitespace-pre-wrap font-mono text-xs text-[var(--color-text-secondary)] leading-relaxed max-h-[420px] overflow-y-auto bg-black/30 p-5 border border-[var(--color-border-subtle)]">
                {selectedResume.extractedText}
              </pre>
            ) : (
              <div className="py-12 text-center space-y-2">
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-yellow-400">
                  STATUS: {selectedResume.status}
                </div>
                <p className="font-mono text-xs text-[var(--color-text-tertiary)] max-w-md mx-auto">
                  File stored in PostgreSQL and ready for interview question generation. Extracted text will appear here once processed by the parser worker.
                </p>
              </div>
            )}
          </TiltCard3D>
        </div>
      </div>
    </div>
  );
}