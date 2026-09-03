"use client";

import { useCallback, useRef, useEffect } from "react";
import { useAudioStore } from "../stores/audio-store";
import { AUDIO_CONFIG } from "@/lib/constants";
import type { AudioChunk } from "../types/audio.types";

interface UseAudioCaptureOptions {
  onChunk?: (chunk: AudioChunk) => void;
  sampleRate?: number;
  chunkDurationMs?: number;
}

/**
 * Hook for capturing audio from the user's microphone.
 *
 * Uses AudioWorklet for low-latency, frame-level processing.
 * Falls back to ScriptProcessorNode if AudioWorklet is not supported.
 *
 * Produces AudioChunks at configurable intervals (default 250ms)
 * and sends them to the onChunk callback for WebSocket streaming.
 */
export function useAudioCapture(options: UseAudioCaptureOptions = {}) {
  const {
    onChunk,
    sampleRate = AUDIO_CONFIG.SAMPLE_RATE,
    chunkDurationMs = AUDIO_CONFIG.CHUNK_DURATION_MS,
  } = options;

  const audioStore = useAudioStore();
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);

  /**
   * Request microphone permissions and enumerate devices.
   */
  const requestPermission = useCallback(async () => {
    audioStore.setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate,
          channelCount: AUDIO_CONFIG.CHANNELS,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Enumerate available devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices
        .filter((d) => d.kind === "audioinput")
        .map((d) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${d.deviceId.slice(0, 4)}`,
          kind: "audioinput" as const,
        }));
      audioStore.setAvailableDevices(audioInputs);

      if (audioInputs.length > 0 && !audioStore.selectedDevice) {
        audioStore.setSelectedDevice(audioInputs[0]);
      }

      audioStore.setState("ready");
      return stream;
    } catch (error) {
      console.error("Microphone permission denied:", error);
      audioStore.setState("error");
      throw error;
    }
  }, [sampleRate, audioStore]);

  /**
   * Start recording and streaming audio chunks.
   */
  const startRecording = useCallback(async () => {
    let stream = streamRef.current;
    if (!stream) {
      stream = await requestPermission();
    }

    const audioContext = new AudioContext({ sampleRate });
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);

    // Try to use AudioWorklet for low-latency processing
    try {
      // Register the worklet processor
      await audioContext.audioWorklet.addModule("/audio-worklet-processor.js");

      const workletNode = new AudioWorkletNode(audioContext, "chunk-processor", {
        processorOptions: { chunkDurationMs, sampleRate },
      });
      workletNodeRef.current = workletNode;

      workletNode.port.onmessage = (event) => {
        if (event.data.type === "chunk" && onChunk) {
          onChunk({
            data: event.data.buffer,
            timestamp: Date.now(),
            duration: chunkDurationMs,
            sampleRate,
            channels: AUDIO_CONFIG.CHANNELS,
          });
        }
      };

      source.connect(workletNode);
      workletNode.connect(audioContext.destination);
    } catch {
      // Fallback: use ScriptProcessorNode (deprecated but widely supported)
      console.warn("AudioWorklet not supported, falling back to ScriptProcessorNode");
      const bufferSize = Math.round((sampleRate * chunkDurationMs) / 1000);
      const processor = audioContext.createScriptProcessor(
        bufferSize,
        AUDIO_CONFIG.CHANNELS,
        AUDIO_CONFIG.CHANNELS
      );

      processor.onaudioprocess = (event) => {
        if (onChunk) {
          const inputData = event.inputBuffer.getChannelData(0);
          onChunk({
            data: inputData.buffer.slice(0),
            timestamp: Date.now(),
            duration: chunkDurationMs,
            sampleRate,
            channels: AUDIO_CONFIG.CHANNELS,
          });
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
    }

    audioStore.setState("recording");
  }, [requestPermission, onChunk, sampleRate, chunkDurationMs, audioStore]);

  /**
   * Stop recording and release all resources.
   */
  const stopRecording = useCallback(() => {
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    audioStore.setState("idle");
  }, [audioStore]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  return {
    state: audioStore.state,
    isMuted: audioStore.isMuted,
    volume: audioStore.volume,
    selectedDevice: audioStore.selectedDevice,
    availableDevices: audioStore.availableDevices,
    requestPermission,
    startRecording,
    stopRecording,
    toggleMute: audioStore.toggleMute,
    setSelectedDevice: audioStore.setSelectedDevice,
  };
}
