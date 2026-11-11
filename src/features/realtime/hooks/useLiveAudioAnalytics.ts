"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AUDIO_CONFIG, WS_MESSAGE_TYPES } from "@/lib/constants";
import { getAuthToken } from "@/lib/auth-storage";
import { useAudioCapture } from "@/features/audio/hooks/useAudioCapture";
import { VoiceActivityDetector } from "@/features/audio/services/vad";
import { WebSocketClient } from "@/features/realtime/services/websocket-client";
import type { RealTimeMetrics } from "@/types/api.types";

function wsBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_WS_URL;
  if (envUrl) {
    return envUrl.endsWith("/ws") ? envUrl : `${envUrl.replace(/\/$/, "")}/ws`;
  }
  if (typeof window !== "undefined") {
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${proto}//${window.location.hostname}:4000/ws`;
  }
  return "ws://localhost:4000/ws";
}

export function useLiveAudioAnalytics(sessionId: string) {
  const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null);
  const [wsState, setWsState] = useState<string>("disconnected");
  const [liveActive, setLiveActive] = useState(false);
  const wsRef = useRef<WebSocketClient | null>(null);
  const vadRef = useRef<VoiceActivityDetector | null>(null);

  useEffect(() => {
    vadRef.current = new VoiceActivityDetector();
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    const client = new WebSocketClient({
      url: wsBaseUrl(),
      sessionId,
      authToken: token || undefined,
      reconnect: true,
    });
    wsRef.current = client;

    const offMetrics = client.on("metrics:update", (msg) => {
      setMetrics(msg.payload as RealTimeMetrics);
    });
    const offState = client.onStateChange(setWsState);

    client.connect();

    return () => {
      offMetrics();
      offState();
      client.disconnect();
    };
  }, [sessionId]);

  const onChunk = useCallback((chunk: { data: ArrayBuffer }) => {
    const vad = vadRef.current;
    if (!vad) return;
    const floats = new Float32Array(chunk.data);
    if (!vad.processFrame(floats)) return;
    wsRef.current?.sendBinary(chunk.data);
  }, []);

  const { startRecording, stopRecording, requestPermission } = useAudioCapture({
    onChunk,
    sampleRate: AUDIO_CONFIG.SAMPLE_RATE,
    chunkDurationMs: AUDIO_CONFIG.CHUNK_DURATION_MS,
  });

  const startLiveAnalytics = useCallback(async () => {
    await requestPermission();
    wsRef.current?.send(WS_MESSAGE_TYPES.AUDIO_START, {
      sampleRate: AUDIO_CONFIG.SAMPLE_RATE,
      channels: AUDIO_CONFIG.CHANNELS,
      encoding: "float32",
    });
    await startRecording();
    setLiveActive(true);
  }, [requestPermission, startRecording]);

  const stopLiveAnalytics = useCallback(() => {
    stopRecording();
    wsRef.current?.send(WS_MESSAGE_TYPES.AUDIO_STOP, {});
    setLiveActive(false);
  }, [stopRecording]);

  const pushTranscriptDraft = useCallback((text: string) => {
    if (!text.trim() || !wsRef.current) return;
    wsRef.current.send("transcript:partial", {
      text: text.trim(),
      isFinal: false,
      confidence: 1,
      speaker: "candidate",
    });
  }, []);

  const pushTranscriptFinal = useCallback((text: string) => {
    if (!text.trim() || !wsRef.current) return;
    wsRef.current.send("transcript:final", {
      text: text.trim(),
      isFinal: true,
      confidence: 1,
      speaker: "candidate",
    });
  }, []);

  return {
    metrics,
    wsState,
    liveActive,
    startLiveAnalytics,
    stopLiveAnalytics,
    pushTranscriptDraft,
    pushTranscriptFinal,
  };
}
