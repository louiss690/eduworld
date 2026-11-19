import { aiProviderConfig } from "@/lib/env";
import type { AIProvider } from "./types";
import { OpenAICompatibleProvider } from "./openaiProvider";
import { DemoProvider } from "./demoProvider";

let providerSingleton: AIProvider | null = null;

/**
 * Returns the active AI provider.
 *  - OPENAI_API_KEY configured → OpenAI-compatible provider.
 *  - otherwise → DemoProvider (clearly labelled, no fake AI).
 */
export function getAIProvider(): AIProvider {
  if (!providerSingleton) {
    providerSingleton = aiProviderConfig()
      ? new OpenAICompatibleProvider()
      : new DemoProvider();
  }
  return providerSingleton;
}

/** True when a real external model is configured. */
export function isAIConfigured(): boolean {
  return Boolean(aiProviderConfig());
}
