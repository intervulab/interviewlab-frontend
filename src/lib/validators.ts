import { z } from "zod";

// ── Auth Schemas ──────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and a number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// ── Interview Schemas ─────────────────────────────────────

export const createInterviewSchema = z.object({
  type: z.enum(["technical", "behavioral", "system_design", "hr", "mixed"]),
  difficulty: z.enum(["easy", "medium", "hard", "expert"]),
  durationMins: z.number().min(10).max(90).default(30),
  jobDescription: z.string().max(5000).optional(),
  targetRole: z.string().max(200).optional(),
  targetCompany: z.string().max(200).optional(),
  focusAreas: z.array(z.string()).max(5).optional(),
});

// ── Resume Schemas ────────────────────────────────────────

export const resumeUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 10MB"
    )
    .refine(
      (file) =>
        [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type),
      "Only PDF and DOCX files are accepted"
    ),
});

// ── Settings Schemas ──────────────────────────────────────

export const profileSettingsSchema = z.object({
  name: z.string().min(2).max(50),
  bio: z.string().max(500).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  preferredLanguage: z.string().default("en"),
});

// ── Type Exports ──────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type ResumeUploadInput = z.infer<typeof resumeUploadSchema>;
export type ProfileSettingsInput = z.infer<typeof profileSettingsSchema>;
