import { create } from "zustand";
import type { ConnectionState } from "../types/realtime.types";

interface ConnectionStore {
  // ── State ──
  wsState: ConnectionState;
  wsLatency: number; // ms
  reconnectAttempts: number;
  lastError: string | null;

  // ── Actions ──
  setWsState: (state: ConnectionState) => void;
  setWsLatency: (latency: number) => void;
  incrementReconnect: () => void;
  resetReconnect: () => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
  wsState: "disconnected",
  wsLatency: 0,
  reconnectAttempts: 0,
  lastError: null,

  setWsState: (state) => set({ wsState: state }),
  setWsLatency: (latency) => set({ wsLatency: latency }),
  incrementReconnect: () =>
    set((s) => ({ reconnectAttempts: s.reconnectAttempts + 1 })),
  resetReconnect: () => set({ reconnectAttempts: 0 }),
  setError: (error) => set({ lastError: error }),
  reset: () =>
    set({
      wsState: "disconnected",
      wsLatency: 0,
      reconnectAttempts: 0,
      lastError: null,
    }),
}));
