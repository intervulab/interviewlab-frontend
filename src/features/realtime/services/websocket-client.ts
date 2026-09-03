/**
 * InterviewLab — WebSocket Client
 *
 * Core WebSocket connection manager with:
 * - Auto-reconnect with exponential backoff
 * - Heartbeat keepalive
 * - Dual-channel support (binary for audio, JSON for control)
 * - Type-safe message handling
 */

import { WS_CONFIG, WS_MESSAGE_TYPES } from "@/lib/constants";
import type {
  ConnectionState,
  WebSocketConfig,
  WebSocketMessage,
} from "../types/realtime.types";

type MessageHandler = (message: WebSocketMessage) => void;
type BinaryHandler = (data: ArrayBuffer) => void;
type StateHandler = (state: ConnectionState) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private state: ConnectionState = "disconnected";
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private heartbeatTimeoutTimer: ReturnType<typeof setTimeout> | null = null;

  // Event handlers
  private messageHandlers = new Map<string, Set<MessageHandler>>();
  private binaryHandlers = new Set<BinaryHandler>();
  private stateHandlers = new Set<StateHandler>();

  constructor(config: WebSocketConfig) {
    this.config = config;
  }

  /**
   * Connect to the WebSocket server.
   */
  connect(): void {
    if (this.state === "connected" || this.state === "connecting") {
      return;
    }

    this.updateState("connecting");

    const url = new URL(this.config.url);
    url.searchParams.set("sessionId", this.config.sessionId);
    if (this.config.authToken) {
      url.searchParams.set("token", this.config.authToken);
    }

    try {
      this.ws = new WebSocket(url.toString());
      this.ws.binaryType = "arraybuffer";

      this.ws.onopen = () => {
        this.updateState("connected");
        this.reconnectAttempts = 0;
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
          // Binary message (audio data from AI)
          this.binaryHandlers.forEach((handler) => handler(event.data));
        } else {
          // JSON message (control, transcript, metrics, etc.)
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.dispatchMessage(message);
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        }
      };

      this.ws.onerror = (event) => {
        console.error("WebSocket error:", event);
      };

      this.ws.onclose = (event) => {
        this.stopHeartbeat();

        if (event.code === 1000) {
          // Clean close
          this.updateState("closed");
        } else if (this.config.reconnect !== false) {
          this.attemptReconnect();
        } else {
          this.updateState("disconnected");
        }
      };
    } catch (error) {
      console.error("WebSocket connection failed:", error);
      this.updateState("error");
    }
  }

  /**
   * Send a typed JSON message.
   */
  send<T>(type: string, payload: T): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not connected, cannot send message");
      return;
    }

    const message: WebSocketMessage<T> = {
      type,
      payload,
      timestamp: Date.now(),
      sessionId: this.config.sessionId,
    };

    this.ws.send(JSON.stringify(message));
  }

  /**
   * Send raw binary data (audio chunks).
   */
  sendBinary(data: ArrayBuffer): void {
    if (this.ws?.readyState !== WebSocket.OPEN) return;
    this.ws.send(data);
  }

  /**
   * Subscribe to a specific message type.
   */
  on(type: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    this.messageHandlers.get(type)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.messageHandlers.get(type)?.delete(handler);
    };
  }

  /**
   * Subscribe to binary messages (AI audio responses).
   */
  onBinary(handler: BinaryHandler): () => void {
    this.binaryHandlers.add(handler);
    return () => {
      this.binaryHandlers.delete(handler);
    };
  }

  /**
   * Subscribe to connection state changes.
   */
  onStateChange(handler: StateHandler): () => void {
    this.stateHandlers.add(handler);
    return () => {
      this.stateHandlers.delete(handler);
    };
  }

  /**
   * Gracefully disconnect.
   */
  disconnect(): void {
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
    }

    this.updateState("disconnected");
  }

  /**
   * Get current connection state.
   */
  getState(): ConnectionState {
    return this.state;
  }

  // ── Private Methods ──

  private updateState(state: ConnectionState): void {
    this.state = state;
    this.stateHandlers.forEach((handler) => handler(state));
  }

  private dispatchMessage(message: WebSocketMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => handler(message));
    }

    // Also dispatch to wildcard handlers
    const wildcardHandlers = this.messageHandlers.get("*");
    if (wildcardHandlers) {
      wildcardHandlers.forEach((handler) => handler(message));
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.send("heartbeat", { timestamp: Date.now() });

      this.heartbeatTimeoutTimer = setTimeout(() => {
        console.warn("Heartbeat timeout — connection may be stale");
      }, WS_CONFIG.HEARTBEAT_TIMEOUT_MS);
    }, WS_CONFIG.HEARTBEAT_INTERVAL_MS);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }

  private attemptReconnect(): void {
    const maxAttempts = this.config.maxReconnectAttempts ?? WS_CONFIG.RECONNECT_MAX_ATTEMPTS;

    if (this.reconnectAttempts >= maxAttempts) {
      console.error("Max reconnect attempts reached");
      this.updateState("error");
      return;
    }

    this.updateState("reconnecting");
    this.reconnectAttempts++;

    const delay = Math.min(
      WS_CONFIG.RECONNECT_INITIAL_DELAY_MS *
        Math.pow(WS_CONFIG.RECONNECT_BACKOFF_MULTIPLIER, this.reconnectAttempts - 1),
      WS_CONFIG.RECONNECT_MAX_DELAY_MS
    );

    console.log(
      `Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${maxAttempts})`
    );

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }
}
