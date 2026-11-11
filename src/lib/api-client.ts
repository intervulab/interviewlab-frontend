/**
 * InterviewLab — Typed API Client (Component 3 gateway)
 */

import { getAuthToken } from "@/lib/auth-storage";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  cache?: RequestCache;
  skipAuth?: boolean;
}

interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
}

class ApiClientError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiClientError";
    this.status = error.status;
    this.code = error.code;
    this.details = error.details;
  }
}

/** Browser requests use Next.js rewrite → backend (see next.config.ts). */
const API_PREFIX = "/api/v1";

async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, signal, cache, skipAuth } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (!skipAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = path.startsWith("/api/") ? path : `${API_PREFIX}${path}`;

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
    signal,
    cache,
  });

  if (!response.ok) {
    let message = response.statusText || "Request failed";
    try {
      const errorBody = await response.json();
      message =
        errorBody?.error?.message ||
        errorBody?.message ||
        errorBody?.detail ||
        message;
    } catch {
      /* ignore */
    }
    throw new ApiClientError({ status: response.status, message });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

async function apiFormData<T>(endpoint: string, formData: FormData): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = path.startsWith("/api/") ? path : `${API_PREFIX}${path}`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    let message = response.statusText || "Upload failed";
    try {
      const errorBody = await response.json();
      message = errorBody?.error?.message || errorBody?.message || message;
    } catch {
      /* ignore */
    }
    throw new ApiClientError({ status: response.status, message });
  }

  return response.json() as Promise<T>;
}

export interface BackendEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const api = {
  get: <T>(endpoint: string, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(endpoint, { ...options, method: "POST", body }),

  patch: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(endpoint, { ...options, method: "PATCH", body }),

  postForm: <T>(endpoint: string, formData: FormData) => apiFormData<T>(endpoint, formData),
};

export { ApiClientError };
export type { ApiError, ApiRequestOptions };
