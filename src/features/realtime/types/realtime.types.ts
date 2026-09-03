/**
 * InterviewLab — Real-Time Feature Types
 */

export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "error"
  | "closed";

export interface WebSocketConfig {
  url: string;
  sessionId: string;
  authToken?: string;
  reconnect?: boolean;
  maxReconnectAttempts?: number;
}

export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
  sessionId?: string;
}
