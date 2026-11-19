/**
 * Typed, validated access to environment variables.
 * Never import this module from client components — it reads server-only
 * secrets (process.env at runtime). Client code should only read the
 * NEXT_PUBLIC_* values through this module's public helpers.
 */

export function hasSupabaseConfig(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function supabaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || null;
}

export function supabaseAnonKey(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;
}

/** Server-only. Use only inside route handlers / server contexts. */
export function supabaseServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

/** Is the app running in demo data mode (no Supabase configured)? */
export function isDemoDataMode(): boolean {
  return !hasSupabaseConfig();
}

/** Should the UI display "Demo mode" labels? */
export function demoLabelEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_LABEL !== "false";
}

/** Server-only secret for signing demo-mode session cookies. */
export function demoAuthSecret(): string {
  return process.env.DEMO_AUTH_SECRET || "";
}

// ── AI provider configuration ──────────────────────────────────────────────

export interface AIProviderConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export function aiProviderConfig(): AIProviderConfig | null {
  const apiKey = process.env.OPENAI_API_KEY || "";
  if (!apiKey) return null;
  return {
    apiKey,
    baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  };
}
