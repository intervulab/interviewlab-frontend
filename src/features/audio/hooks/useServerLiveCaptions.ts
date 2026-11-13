"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { liveTranscribeSnippet } from "@/features/backend/api";

const POLL_MS = 5000;
const MIN_BYTES = 2500;

/**
 * When browser Web Speech fails (Brave / offline), poll C5 Whisper on the growing recording.
 */
export function useServerLiveCaptions(
  sessionId: string,
  recording: boolean,
  getAudioBlob: () => Blob | null,
  enabled: boolean
) {
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const inFlightRef = useRef(false);

  const tick = useCallback(async () => {
    if (inFlightRef.current || unavailable) return;
    const blob = getAudioBlob();
    if (!blob || blob.size < MIN_BYTES) return;

    inFlightRef.current = true;
    setPending(true);
    try {
      const snippet = await liveTranscribeSnippet(sessionId, blob);
      if (snippet?.trim()) {
        setText(snippet.trim());
      }
    } catch {
      setUnavailable(true);
    } finally {
      inFlightRef.current = false;
      setPending(false);
    }
  }, [sessionId, getAudioBlob, unavailable]);

  useEffect(() => {
    if (!recording || !enabled) {
      setText("");
      setUnavailable(false);
      setPending(false);
      return;
    }

    const id = window.setInterval(() => {
      void tick();
    }, POLL_MS);
    const initial = window.setTimeout(() => void tick(), 1800);

    return () => {
      clearInterval(id);
      clearTimeout(initial);
    };
  }, [recording, enabled, tick]);

  return { serverCaption: text, serverPending: pending, serverUnavailable: unavailable };
}
