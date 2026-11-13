/**
 * Map pause/MFCC hesitation events to 0–100 HUD (higher = more hesitant).
 * Uses answer duration so a long fluent answer is not auto-maxed at 100.
 */
export function hesitationSpikesToHudScore(
  spikes: number,
  durationSeconds?: number | null,
): number {
  const n = Math.max(0, Math.round(spikes));
  if (n === 0) return 0;

  const secs =
    durationSeconds != null && Number.isFinite(durationSeconds) && durationSeconds > 0
      ? durationSeconds
      : 60;
  const eventsPerMinute = (n / secs) * 60;

  // ~0.8 events/min ≈ low, ~2.5/min ≈ high, ~4+/min ≈ 100
  return Math.min(100, Math.round((eventsPerMinute / 4) * 100));
}
