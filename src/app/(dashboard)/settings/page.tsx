"use client";

import { useEffect, useRef, useState } from "react";

type ThemeOption = "Dark" | "Light" | "System";

export default function SettingsPage() {
  // ── Profile State ─────────────────────────────────────────
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);

  // ── Microphone Test State ─────────────────────────────────
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [micDeviceName, setMicDeviceName] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // ── Appearance / Theme State ──────────────────────────────
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>("Dark");

  // Load user profile from GET /api/v1/auth/me
  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("interviewlab_token");
        const res = await fetch("/api/v1/auth/me", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });

        if (!res.ok) return;
        const json = await res.json();
        const user = json?.data || json;
        setEmail(user?.email || "");
        setFirstName(user?.profile?.firstName || "");
        setLastName(user?.profile?.lastName || "");
        setTargetRole(user?.profile?.targetRole || "");
      } catch {
        // Ignore if not logged in
      } finally {
        setProfileLoading(false);
      }
    }

    loadProfile();
  }, []);

  // Initialize saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("interviewlab_theme") as ThemeOption | null;
    if (saved === "Dark" || saved === "Light" || saved === "System") {
      applyTheme(saved);
    }
  }, []);

  // Cleanup microphone stream on unmount
  useEffect(() => {
    return () => {
      stopMicTest();
    };
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileStatus(null);
    setSavingProfile(true);
    try {
      const token = localStorage.getItem("interviewlab_token");
      const res = await fetch("/api/v1/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName, targetRole }),
      });

      if (!res.ok) {
        throw new Error(`Save failed (${res.status})`);
      }
      setProfileStatus("Profile updated in PostgreSQL.");
    } catch (err: unknown) {
      setProfileStatus(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setSavingProfile(false);
    }
  }

  function stopMicTest() {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => { });
      audioContextRef.current = null;
    }
    setIsTestingMic(false);
    setMicLevel(0);
  }

  async function toggleMicTest() {
    if (isTestingMic) {
      stopMicTest();
      return;
    }

    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const track = stream.getAudioTracks()[0];
      setMicDeviceName(track?.label || "Default Microphone");

      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      setIsTestingMic(true);

      const updateMeter = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setMicLevel(normalized);
        animFrameRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch (err: unknown) {
      setMicError(
        err instanceof Error
          ? err.message
          : "Microphone access denied. Please allow microphone permissions in your browser."
      );
      stopMicTest();
    }
  }

  function applyTheme(theme: ThemeOption) {
    setSelectedTheme(theme);
    localStorage.setItem("interviewlab_theme", theme);

    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved =
      theme === "System" ? (prefersDark ? "dark" : "light") : theme.toLowerCase();

    root.setAttribute("data-theme", resolved);
    if (resolved === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.style.colorScheme = "dark";
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }

  return (
    <div className="animate-fade-in-up space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Manage your account, preferences, and audio settings.
        </p>
      </div>

      {/* ── PROFILE SECTION ── */}
      <form onSubmit={handleSaveProfile} className="glass rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Profile</h2>
          {profileStatus && (
            <span className="font-mono text-xs text-[var(--color-brand-400)]">
              {profileStatus}
            </span>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={profileLoading ? "Loading..." : "First name"}
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-2.5 text-sm focus:border-[var(--color-brand-500)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={profileLoading ? "Loading..." : "Last name"}
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-2.5 text-sm focus:border-[var(--color-brand-500)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
              Target Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Engineer"
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-2.5 text-sm focus:border-[var(--color-brand-500)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-2.5 text-sm opacity-60 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={savingProfile || profileLoading}
            className="rounded-lg bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-500)] px-5 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
          >
            {savingProfile ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>

      {/* ── AUDIO SETTINGS ── */}
      <div className="glass rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Audio &amp; Microphone</h2>
          {isTestingMic && (
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-brand-400)]">
              ● LIVE INPUT ACTIVE
            </span>
          )}
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Configure your microphone and audio playback settings for interviews.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={toggleMicTest}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${isTestingMic
              ? "border-[var(--color-danger-500)] bg-[var(--color-danger-500)]/10 text-[var(--color-danger-500)]"
              : "border-[var(--color-border-default)] hover:bg-[var(--color-surface-2)]"
              }`}
          >
            {isTestingMic ? "Stop Microphone Test" : "Test Microphone"}
          </button>

          {micDeviceName && (
            <span className="font-mono text-xs text-[var(--color-text-secondary)]">
              Device: <strong className="text-[var(--color-text-primary)]">{micDeviceName}</strong>
            </span>
          )}
        </div>

        {isTestingMic && (
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between font-mono text-xs text-[var(--color-text-secondary)]">
              <span>INPUT SIGNAL LEVEL</span>
              <span>{micLevel}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <div
                className="h-full bg-[var(--color-brand-500)] transition-all duration-75"
                style={{ width: `${micLevel}%` }}
              />
            </div>
          </div>
        )}

        {micError && (
          <p className="font-mono text-xs text-[var(--color-danger-500)]">{micError}</p>
        )}
      </div>

      {/* ── THEME ── */}
      <div className="glass rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
            Active: <strong className="text-[var(--color-brand-400)]">{selectedTheme}</strong>
          </span>
        </div>
        <div className="flex gap-3">
          {(["Dark", "Light", "System"] as ThemeOption[]).map((theme) => {
            const isActive = selectedTheme === theme;
            return (
              <button
                key={theme}
                type="button"
                onClick={() => applyTheme(theme)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${isActive
                  ? "border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/15 text-[var(--color-brand-400)]"
                  : "border-[var(--color-border-default)] hover:border-[var(--color-brand-500)]"
                  }`}
              >
                {theme}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}