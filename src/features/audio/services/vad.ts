/**
 * Voice Activity Detection (VAD)
 *
 * Client-side VAD to detect speech vs silence.
 * Used to:
 * 1. Avoid streaming silence over WebSocket (bandwidth optimization)
 * 2. Trigger freeze-recovery mode after prolonged silence
 * 3. Provide "is speaking" indicator to the UI
 */

import { AUDIO_CONFIG } from "@/lib/constants";

export interface VADOptions {
  silenceThreshold?: number;
  silenceTimeoutMs?: number;
  onSpeechStart?: () => void;
  onSpeechEnd?: (silenceDuration: number) => void;
  onFreezeDetected?: (silenceDuration: number) => void;
}

export class VoiceActivityDetector {
  private silenceThreshold: number;
  private silenceTimeoutMs: number;
  private isSpeaking = false;
  private silenceStartTime: number | null = null;
  private freezeTriggered = false;
  private callbacks: Required<Pick<VADOptions, "onSpeechStart" | "onSpeechEnd" | "onFreezeDetected">>;

  constructor(options: VADOptions = {}) {
    this.silenceThreshold = options.silenceThreshold ?? AUDIO_CONFIG.SILENCE_THRESHOLD;
    this.silenceTimeoutMs = options.silenceTimeoutMs ?? AUDIO_CONFIG.SILENCE_TIMEOUT_MS;
    this.callbacks = {
      onSpeechStart: options.onSpeechStart ?? (() => {}),
      onSpeechEnd: options.onSpeechEnd ?? (() => {}),
      onFreezeDetected: options.onFreezeDetected ?? (() => {}),
    };
  }

  /**
   * Process an audio frame and determine speech activity.
   * @param audioData - Raw PCM float32 samples
   * @returns Whether the frame contains speech
   */
  processFrame(audioData: Float32Array): boolean {
    const rms = this.calculateRMS(audioData);
    const hasSpeech = rms > this.silenceThreshold;

    if (hasSpeech) {
      // Speech detected
      if (!this.isSpeaking) {
        this.isSpeaking = true;
        this.freezeTriggered = false;
        this.silenceStartTime = null;
        this.callbacks.onSpeechStart();
      }
    } else {
      // Silence detected
      if (this.isSpeaking) {
        this.isSpeaking = false;
        this.silenceStartTime = Date.now();
        this.callbacks.onSpeechEnd(0);
      }

      // Check for freeze (prolonged silence)
      if (this.silenceStartTime && !this.freezeTriggered) {
        const silenceDuration = Date.now() - this.silenceStartTime;
        if (silenceDuration >= this.silenceTimeoutMs) {
          this.freezeTriggered = true;
          this.callbacks.onFreezeDetected(silenceDuration);
        }
      }
    }

    return hasSpeech;
  }

  /**
   * Calculate Root Mean Square of audio samples.
   */
  private calculateRMS(data: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i] * data[i];
    }
    return Math.sqrt(sum / data.length);
  }

  /**
   * Reset the VAD state.
   */
  reset() {
    this.isSpeaking = false;
    this.silenceStartTime = null;
    this.freezeTriggered = false;
  }

  /**
   * Get current silence duration in ms, or 0 if speaking.
   */
  getSilenceDuration(): number {
    if (!this.silenceStartTime || this.isSpeaking) return 0;
    return Date.now() - this.silenceStartTime;
  }
}
