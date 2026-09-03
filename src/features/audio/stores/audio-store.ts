import { create } from "zustand";
import type { AudioState, AudioDeviceInfo } from "../types/audio.types";

interface AudioStore {
  // ── State ──
  state: AudioState;
  selectedDevice: AudioDeviceInfo | null;
  availableDevices: AudioDeviceInfo[];
  isMuted: boolean;
  volume: number; // 0-1 normalized
  isVADSpeaking: boolean;
  silenceDuration: number;

  // ── Actions ──
  setState: (state: AudioState) => void;
  setSelectedDevice: (device: AudioDeviceInfo | null) => void;
  setAvailableDevices: (devices: AudioDeviceInfo[]) => void;
  setMuted: (muted: boolean) => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  setVADSpeaking: (speaking: boolean) => void;
  setSilenceDuration: (duration: number) => void;
  reset: () => void;
}

const initialState = {
  state: "idle" as AudioState,
  selectedDevice: null,
  availableDevices: [],
  isMuted: false,
  volume: 0,
  isVADSpeaking: false,
  silenceDuration: 0,
};

export const useAudioStore = create<AudioStore>((set) => ({
  ...initialState,

  setState: (state) => set({ state }),
  setSelectedDevice: (device) => set({ selectedDevice: device }),
  setAvailableDevices: (devices) => set({ availableDevices: devices }),
  setMuted: (muted) => set({ isMuted: muted }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  setVolume: (volume) => set({ volume }),
  setVADSpeaking: (speaking) => set({ isVADSpeaking: speaking }),
  setSilenceDuration: (duration) => set({ silenceDuration: duration }),
  reset: () => set(initialState),
}));
