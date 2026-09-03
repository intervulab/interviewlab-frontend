"use client";

import { useMemo } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface SpeechMetricsHudProps {
  wpm: number;
  fillerWordPercent: number;
  hesitationScore: number; // 0-100
  confidenceScore: number; // 0-100
}

export function SpeechMetricsHud({
  wpm,
  fillerWordPercent,
  hesitationScore,
  confidenceScore,
}: SpeechMetricsHudProps) {
  // Helpers to determine color based on thresholds
  const getWpmColor = (val: number) => {
    if (val < 110) return "var(--color-warning-500)";
    if (val > 160) return "var(--color-danger-500)";
    return "var(--color-brand-400)";
  };

  const getBadScoreColor = (val: number) => {
    if (val > 20) return "var(--color-danger-500)";
    if (val > 10) return "var(--color-warning-500)";
    return "var(--color-brand-400)";
  };

  const getGoodScoreColor = (val: number) => {
    if (val < 60) return "var(--color-danger-500)";
    if (val < 80) return "var(--color-warning-500)";
    return "var(--color-brand-400)";
  };

  const metrics = useMemo(
    () => [
      {
        label: "Pace (WPM)",
        value: wpm,
        max: 200,
        color: getWpmColor(wpm),
        text: `${wpm}`,
      },
      {
        label: "Filler Words",
        value: fillerWordPercent,
        max: 30, // 30% is max bad
        color: getBadScoreColor(fillerWordPercent),
        text: `${fillerWordPercent.toFixed(1)}%`,
      },
      {
        label: "Hesitation",
        value: hesitationScore,
        max: 100,
        color: getBadScoreColor(hesitationScore),
        text: `${hesitationScore}/100`,
      },
      {
        label: "Confidence",
        value: confidenceScore,
        max: 100,
        color: getGoodScoreColor(confidenceScore),
        text: `${confidenceScore}%`,
      },
    ],
    [wpm, fillerWordPercent, hesitationScore, confidenceScore]
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="glass flex flex-col items-center justify-center rounded-xl p-4 text-center">
          <div className="w-16 h-16">
            <CircularProgressbar
              value={m.value}
              maxValue={m.max}
              text={m.text}
              strokeWidth={8}
              styles={buildStyles({
                textSize: "24px",
                pathColor: m.color,
                textColor: "var(--color-text-primary)",
                trailColor: "var(--color-surface-3)",
                backgroundColor: "transparent",
              })}
            />
          </div>
          <span className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
            {m.label}
          </span>
        </div>
      ))}
    </div>
  );
}
