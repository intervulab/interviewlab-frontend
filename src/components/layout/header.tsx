"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ROUTES } from "@/lib/constants";

interface UserAccount {
  id: string;
  email: string;
  role: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    targetRole?: string;
  } | null;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Live timecode
  const [time, setTime] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setTime(
        `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}:${Math.floor(d.getMilliseconds() / 10).toString().padStart(2, "0")}`
      );
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // User account & dropdown state
  const [user, setUser] = useState<UserAccount | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Change password modal state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Load current user from GET /api/v1/auth/me
  useEffect(() => {
    async function loadCurrentUser() {
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
        setUser(json?.data || json);
      } catch {
        // Fallback to default avatar if unauthenticated
      }
    }

    loadCurrentUser();
  }, []);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setPasswordModalOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("interviewlab_token");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("auth_token");
    setMenuOpen(false);
    router.push(ROUTES.LOGIN);
    router.refresh();
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    try {
      setPasswordLoading(true);
      const token = localStorage.getItem("interviewlab_token");
      const res = await fetch("/api/v1/auth/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.message || `Failed to update password (${res.status})`);
      }

      setPasswordSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setPasswordModalOpen(false);
        setPasswordSuccess(null);
      }, 1200);
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "Could not change password");
    } finally {
      setPasswordLoading(false);
    }
  }

  const title = pathname.split("/").filter(Boolean).pop()?.toUpperCase() || "DASHBOARD";

  const fullName = [user?.profile?.firstName, user?.profile?.lastName]
    .filter(Boolean)
    .join(" ");
  const avatarInitial = (
    user?.profile?.firstName?.[0] ||
    user?.email?.[0] ||
    "U"
  ).toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-[var(--z-sticky)] flex h-24 items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-0)]/80 px-10 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-[var(--color-text-primary)] font-[family-name:var(--font-display)]">
            {title}
          </h1>
          <div className="h-6 w-px bg-[var(--color-border-default)]" />
          <span className="font-mono text-sm font-bold text-[var(--color-brand-400)] tracking-[0.2em]">
            &gt; STATUS: NOMINAL
          </span>
        </div>

        <div className="flex items-center gap-8">
          <div className="font-mono text-lg font-bold text-[var(--color-text-secondary)] tracking-widest tabular-nums w-[140px] text-right">
            {time}
          </div>

          {/* ── USER AVATAR & ACCOUNT MENU ── */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Account Menu"
              className={`flex h-12 w-12 items-center justify-center rounded-full border font-bold font-[family-name:var(--font-display)] text-xl transition-all cursor-pointer ${menuOpen
                  ? "bg-[var(--color-brand-600)] border-[var(--color-brand-400)] text-white shadow-[0_0_20px_oklch(0.75_0.22_140_/_0.4)]"
                  : "bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-[var(--color-text-primary)] hover:border-[var(--color-brand-500)]"
                }`}
            >
              {avatarInitial}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-72 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-1)] shadow-2xl overflow-hidden z-50">
                {/* Account Header */}
                <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]/60 px-5 py-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[var(--color-text-primary)] truncate">
                      {fullName || "Candidate Account"}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-[var(--color-brand-500)]/15 text-[var(--color-brand-400)]">
                      {user?.role || "CANDIDATE"}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--color-text-secondary)] truncate">
                    {user?.email || "Authenticated Session"}
                  </p>
                  {user?.profile?.targetRole && (
                    <p className="font-mono text-[11px] text-[var(--color-accent-400)] truncate pt-0.5">
                      Role: {user.profile.targetRole}
                    </p>
                  )}
                </div>

                {/* Navigation & Account Actions */}
                <div className="p-2 space-y-1 font-mono text-xs uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push(ROUTES.PASSPORT);
                    }}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors"
                  >
                    <span>Student Passport</span>
                    <span className="text-[var(--color-text-tertiary)]">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push(ROUTES.INTERVIEWS);
                    }}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors"
                  >
                    <span>Session History</span>
                    <span className="text-[var(--color-text-tertiary)]">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push(ROUTES.SETTINGS);
                    }}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors"
                  >
                    <span>Profile &amp; Settings</span>
                    <span className="text-[var(--color-text-tertiary)]">⚙</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setPasswordError(null);
                      setPasswordSuccess(null);
                      setPasswordModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors"
                  >
                    <span>Change Password</span>
                    <span className="text-[var(--color-accent-400)]">🔑</span>
                  </button>
                </div>

                {/* Logout Action */}
                <div className="border-t border-[var(--color-border-subtle)] p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-danger-500)] hover:bg-[var(--color-danger-500)]/10 transition-colors"
                  >
                    <span>Log Out</span>
                    <span>⏻</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── CHANGE PASSWORD MODAL ── */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
              <div>
                <h2 className="text-xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
                  Change Password
                </h2>
                <p className="font-mono text-xs text-[var(--color-text-secondary)]">
                  Update credentials for {user?.email || "your account"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="font-mono text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] px-2 py-1"
              >
                ✕
              </button>
            </div>

            {passwordError && (
              <div className="rounded-lg border border-[var(--color-danger-500)] bg-[var(--color-danger-500)]/10 p-3 font-mono text-xs text-[var(--color-danger-500)]">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="rounded-lg border border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/10 p-3 font-mono text-xs text-[var(--color-brand-400)]">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-0)] px-4 py-2.5 text-sm focus:border-[var(--color-brand-500)] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
                  New Password (Min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-0)] px-4 py-2.5 text-sm focus:border-[var(--color-brand-500)] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-0)] px-4 py-2.5 text-sm focus:border-[var(--color-brand-500)] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="rounded-lg border border-[var(--color-border-default)] px-4 py-2 font-mono text-xs uppercase tracking-wider hover:bg-[var(--color-surface-2)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="rounded-lg bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-500)] px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}