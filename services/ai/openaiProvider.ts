import { aiProviderConfig } from "@/lib/env";
import type { AIProvider, TutorRequest, TutorResponse } from "./types";
import { TUTOR_SYSTEM_PROMPT } from "./types";

/**
 * OpenAI-compatible provider, works with OpenAI, OpenRouter, Groq, Azure
 * OpenAI and any compatible endpoint via OPENAI_BASE_URL.
 */
export class OpenAICompatibleProvider implements AIProvider {
  id = "openai-compatible";
  name = "OpenAI-compatible";

  get configured(): boolean {
    return Boolean(aiProviderConfig());
  }

  async chat(request: TutorRequest): Promise<TutorResponse> {
    const config = aiProviderConfig();
    if (!config) {
      throw new Error("AI provider is not configured.");
    }

    const system = TUTOR_SYSTEM_PROMPT
      .replace("{level}", request.level ?? "unspecified")
      .replace("{language}", request.language ?? "en")
      .replace("{subject}", request.subject ?? "general");

    const messages = [
      { role: "system" as const, content: system },
      ...request.history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: request.message },
    ];

    const res = await fetch(`${config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        max_tokens: 700,
        temperature: 0.5,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`AI provider error (${res.status}): ${detail.slice(0, 200)}`);
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("AI provider returned an empty response.");
    }

    return { content, isDemo: false, model: config.model };
  }
}
