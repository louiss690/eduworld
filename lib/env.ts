/**
 * Typed, validated access to environment variables.
 * Never import this module from client components, it reads server-only
 * secrets (process.env at runtime). Client code should only read the
 * NEXT_PUBLIC_* values through this module's public helpers.
 */

/**
 * Stable public base URL used for email links (verification, password reset).
 * Never derived from the incoming request origin, so links always point at
 * the real site even if a request came from a local server.
 */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://eduworld-learn.vercel.app"
      : "http://localhost:3000")
  );
}

/** Publishable key (new naming) or classic anon key. */
function supabasePublishableKey(): string | null {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    null
  );
}

export function hasSupabaseConfig(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && supabasePublishableKey());
}

export function supabaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || null;
}

export function supabaseAnonKey(): string | null {
  return supabasePublishableKey();
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

/**
 * Demo tutor opt-in. When false (default), the tutor refuses to respond
 * unless a real AI provider is configured, the platform never pretends an
 * unavailable AI is functional. Set ALLOW_DEMO_TUTOR=true only for
 * development/demo environments, where replies are clearly labelled.
 */
export function allowDemoTutor(): boolean {
  return process.env.ALLOW_DEMO_TUTOR === "true";
}
