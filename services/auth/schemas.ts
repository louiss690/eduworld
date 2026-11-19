import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128),
  countryCode: z.string().max(4).optional().nullable(),
  languageCode: z.string().max(4).optional().nullable(),
  educationLevelId: z.string().max(40).optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password.").max(128),
});

export const forgotSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
});

export const resetSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128),
  /** Recovery code from the email link (Supabase mode). */
  code: z.string().optional().nullable(),
});

export const profileSchema = z.object({
  countryCode: z.string().max(4).optional().nullable(),
  languageCode: z.string().max(4).optional().nullable(),
  educationLevelId: z.string().max(40).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  subjectIds: z.array(z.string().max(40)).max(20).optional(),
});

export interface AuthResponse {
  ok: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  error?: string;
  code?: string;
  needsVerification?: boolean;
  demoNotice?: string;
}
