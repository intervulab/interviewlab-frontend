import { z } from "zod";

/**
 * Type-safe environment variable validation.
 * Throws at build time if required env vars are missing.
 */

const envSchema = z.object({
  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("InterviewLab"),

  // Backend
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:4000"),
  NEXT_PUBLIC_WS_URL: z.string().default("ws://localhost:4000"),

  // Auth
  AUTH_SECRET: z.string().optional(),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_CANVAS: z
    .string()
    .transform((v) => v === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_PASSPORT: z
    .string()
    .transform((v) => v === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_AUDIO_ANALYTICS: z
    .string()
    .transform((v) => v === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_FREEZE_RECOVERY: z
    .string()
    .transform((v) => v === "true")
    .default("true"),
});

export type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = getEnv();
