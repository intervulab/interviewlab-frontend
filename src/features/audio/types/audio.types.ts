/**
 * InterviewLab — Audio Feature Types
 */

export type AudioState = "idle" | "requesting" | "ready" | "recording" | "paused" | "error";

export interface AudioDeviceInfo {
  deviceId: string;
  label: string;
  kind: "audioinput" | "audiooutput";
}

export interface AudioChunk {
  data: ArrayBuffer;
  timestamp: number;
  duration: number;
  sampleRate: number;
  channels: number;
}

export interface VADEvent {
  isSpeaking: boolean;
  silenceDuration: number;
  timestamp: number;
}

export interface AudioAnalysis {
  rms: number; // Root Mean Square (volume)
  peak: number; // Peak amplitude
  frequencyData: Uint8Array;
  timeData: Uint8Array;
}
