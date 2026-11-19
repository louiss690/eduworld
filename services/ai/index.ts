import { aiProviderConfig, allowDemoTutor } from "@/lib/env";
import type { AIProvider } from "./types";
import { OpenAICompatibleProvider } from "./openaiProvider";
import { DemoProvider } from "./demoProvider";

let providerSingleton: AIProvider | null = null;
let demoSingleton: AIProvider | null = null;

/**
 * Returns the active AI provider, or null when no provider is available.
 *  - OPENAI_API_KEY configured → OpenAI-compatible provider.
 *  - ALLOW_DEMO_TUTOR=true → DemoProvider (explicit opt-in, clearly labelled).
 *  - otherwise → null. The UI must show a configuration-required state and
 *    never fabricate tutor responses.
 */
export function getAIProvider(): AIProvider | null {
  if (aiProviderConfig()) {
    if (!providerSingleton) providerSingleton = new OpenAICompatibleProvider();
    return providerSingleton;
  }
  if (allowDemoTutor()) {
    if (!demoSingleton) demoSingleton = new DemoProvider();
    return demoSingleton;
  }
  return null;
}

/** True when a real external model is configured. */
export function isAIConfigured(): boolean {
  return Boolean(aiProviderConfig());
}

export type TutorStatus = "configured" | "demo" | "unconfigured";

/** UI-facing status of the tutor service. */
export function getTutorStatus(): TutorStatus {
  if (isAIConfigured()) return "configured";
  if (allowDemoTutor()) return "demo";
  return "unconfigured";
}
