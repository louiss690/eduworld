import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { getDataStore } from "@/services/data";
import { getCurrentUser } from "@/services/auth/session";
import { getAIProvider } from "@/services/ai";

export const runtime = "nodejs";

const bodySchema = z.object({
  message: z.string().trim().min(1).max(4000),
  conversationId: z.string().max(80).optional().nullable(),
  level: z.string().max(40).optional().nullable(),
  language: z.string().max(8).optional().nullable(),
  subject: z.string().max(60).optional().nullable(),
});

/** Lightweight content-safety guard applied before calling the model. */
const BLOCKED_PATTERNS: RegExp[] = [
  /\b(kill|murder|suicide|self[-\s]?harm)\b/i,
  /\b(cocaine|heroin|methamphetamine|child[-\s]?porn)\b/i,
  /\b(how to (build|make|create) (a|an) bomb)\b/i,
];

function passesSafety(text: string): boolean {
  return !BLOCKED_PATTERNS.some((re) => re.test(text));
}

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request), { max: 20 });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Slow down, you're sending messages too quickly." },
      { status: 429 }
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in to use the AI tutor." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid message." },
      { status: 400 }
    );
  }

  if (!passesSafety(parsed.data.message)) {
    return NextResponse.json(
      { ok: false, error: "That message can't be answered by the tutor. Please ask an educational question." },
      { status: 400 }
    );
  }

  const store = getDataStore();
  let conversationId = parsed.data.conversationId;

  // New conversation or first message: create a conversation row.
  if (!conversationId) {
    const conversation = await store.createConversation(
      user.id,
      parsed.data.message.slice(0, 48)
    );
    conversationId = conversation.id;
  } else {
    const existing = await store.getConversation(conversationId);
    if (!existing || existing.conversation.userId !== user.id) {
      return NextResponse.json({ ok: false, error: "Conversation not found." }, { status: 404 });
    }
  }

  // Save the user message.
  const userMessage = {
    id: randomUUID(),
    conversationId,
    role: "user" as const,
    content: parsed.data.message,
    createdAt: new Date().toISOString(),
  };
  await store.appendMessage(userMessage);

  // Build history (last 20 messages) for the model.
  const history = (await store.getConversation(conversationId))!.messages
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content }));

  const provider = getAIProvider();
  if (!provider) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "The AI tutor is not configured yet. Add an OPENAI_API_KEY (or set ALLOW_DEMO_TUTOR=true in a demo environment) in .env.local to enable it.",
        code: "ai_not_configured",
      },
      { status: 503 }
    );
  }
  let tutorReply: Awaited<ReturnType<typeof provider.chat>>;

  try {
    tutorReply = await provider.chat({
      message: parsed.data.message,
      history: history.slice(0, -1), // exclude the just-saved user turn
      level: parsed.data.level,
      language: parsed.data.language,
      subject: parsed.data.subject,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "The AI service could not be reached.";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }

  const assistantMessage = {
    id: randomUUID(),
    conversationId,
    role: "assistant" as const,
    content: tutorReply.content,
    createdAt: new Date().toISOString(),
  };
  await store.appendMessage(assistantMessage);

  return NextResponse.json({
    ok: true,
    conversationId,
    message: assistantMessage,
    isDemo: tutorReply.isDemo,
    provider: provider.id,
  });
}
