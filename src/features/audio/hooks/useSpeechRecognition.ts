"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * Browser speech-to-text while the user records an answer (Chromium / Brave).
 */
export function useSpeechRecognition() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [sttError, setSttError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalPartsRef = useRef<string[]>([]);
  const wantListenRef = useRef(false);

  useEffect(() => {
    setSupported(getSpeechRecognitionCtor() != null);
  }, []);

  const syncFinalState = useCallback(() => {
    setFinalTranscript(finalPartsRef.current.join(" ").trim());
  }, []);

  const resetTranscript = useCallback(() => {
    finalPartsRef.current = [];
    setInterimTranscript("");
    setFinalTranscript("");
    setSttError(null);
  }, []);

  const stopListening = useCallback(() => {
    wantListenRef.current = false;
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        try {
          rec.abort();
        } catch {
          /* ignore */
        }
      }
      recognitionRef.current = null;
    }
    setListening(false);
    setInterimTranscript("");
    syncFinalState();
  }, [syncFinalState]);

  const startListening = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setSttError("Speech recognition is not supported in this browser.");
      return false;
    }

    resetTranscript();
    wantListenRef.current = true;

    const attachHandlers = (recognition: SpeechRecognitionLike) => {
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        const finals: string[] = [];
        for (let i = 0; i < event.results.length; i += 1) {
          const piece = event.results[i][0]?.transcript ?? "";
          if (event.results[i].isFinal) {
            if (piece.trim()) finals.push(piece.trim());
          } else {
            interim += piece;
          }
        }
        // Replace finals each event — avoids duplicates when continuous mode restarts.
        finalPartsRef.current = finals;
        setInterimTranscript(interim.trim());
        syncFinalState();
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        const code = event.error || "unknown";
        if (code === "no-speech" || code === "aborted") return;
        if (code === "network") {
          setSttError(
            "Browser captions unavailable in this browser — switching to server transcription while you record.",
          );
        } else {
          setSttError(`Speech recognition error: ${code}`);
        }
        setListening(false);
      };

      recognition.onend = () => {
        setInterimTranscript("");
        syncFinalState();
        if (!wantListenRef.current) {
          setListening(false);
          return;
        }
        try {
          recognition.start();
          setListening(true);
        } catch {
          setListening(false);
        }
      };
    };

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    attachHandlers(recognition);

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setListening(true);
      setSttError(null);
      return true;
    } catch {
      setSttError("Could not start speech recognition (mic may be in use).");
      wantListenRef.current = false;
      return false;
    }
  }, [resetTranscript, syncFinalState]);

  const combinedTranscript = [finalTranscript, interimTranscript]
    .filter(Boolean)
    .join(" ")
    .trim();

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  return {
    supported,
    listening,
    interimTranscript,
    finalTranscript,
    combinedTranscript,
    sttError,
    startListening,
    stopListening,
    resetTranscript,
  };
}
