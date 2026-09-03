import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="animate-fade-in-up space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Manage your account, preferences, and audio settings.
        </p>
      </div>

      {/* Profile Section */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">Name</label>
            <input
              type="text"
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-2.5 text-sm focus:border-[var(--color-brand-500)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-2.5 text-sm focus:border-[var(--color-brand-500)] focus:outline-none"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Audio Settings */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Audio & Microphone</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Configure your microphone and audio playback settings for interviews.
        </p>
        <button className="rounded-lg border border-[var(--color-border-default)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-surface-2)]">
          Test Microphone
        </button>
      </div>

      {/* Theme */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Appearance</h2>
        <div className="flex gap-3">
          {["Dark", "Light", "System"].map((theme) => (
            <button
              key={theme}
              className="rounded-lg border border-[var(--color-border-default)] px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--color-brand-500)]"
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
