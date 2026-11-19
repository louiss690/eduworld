"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Bot,
  Loader2,
  MessageSquarePlus,
  Send,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DemoBadge } from "@/components/ui/DemoBadge";

interface ConversationSummary {
  id: string;
  title: string;
  updatedAt: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

const SUGGESTIONS = [
  "Explain how to solve 3x + 2 = 14 step by step",
  "Help me understand photosynthesis",
  "Give me a practice question about supply and demand",
  "What is a variable in Python?",
];

export function TutorChat({
  initialConversations,
  demoProvider,
}: {
  initialConversations: ConversationSummary[];
  demoProvider: boolean;
}) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  async function loadConversation(id: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/tutor/conversations/${id}`);
      const data = (await res.json()) as { conversation?: { messages?: Message[] } };
      if (!res.ok || !data.conversation) throw new Error("Failed to load conversation");
      setActiveId(id);
      setMessages(data.conversation.messages ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load conversation.");
    } finally {
      setBusy(false);
    }
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    setBusy(true);
    setError(null);
    const optimistic: Message = {
      id: `local-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setInput("");

    try {
      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationId: activeId,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        conversationId?: string;
        message?: Message;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "The tutor could not respond.");
      }
      if (data.message) {
        setMessages((m) => [...m, data.message!]);
      }
      if (data.conversationId && data.conversationId !== activeId) {
        setActiveId(data.conversationId);
        setConversations((list) => [
          { id: data.conversationId!, title: content.slice(0, 48), updatedAt: new Date().toISOString() },
          ...list,
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Please try again.");
      setMessages((m) => m.filter((msg) => msg.id !== optimistic.id));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  return (
    <div className="grid h-[calc(100vh-7rem)] grid-cols-1 overflow-hidden rounded-2xl border border-line bg-white shadow-sm lg:grid-cols-[300px_1fr]">
      {/* Sidebar */}
      <aside className="hidden flex-col border-r border-line bg-paper lg:flex">
        <div className="p-4">
          <button
            type="button"
            onClick={() => {
              setActiveId(null);
              setMessages([]);
              setError(null);
            }}
            className="btn-primary w-full"
          >
            <MessageSquarePlus className="size-4" /> New conversation
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted">History</p>
          {conversations.length === 0 ? (
            <p className="px-2 text-[13px] text-muted">No conversations yet.</p>
          ) : (
            <ul className="space-y-1">
              {conversations.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => loadConversation(c.id)}
                    className={cn(
                      "w-full truncate rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      activeId === c.id
                        ? "bg-white font-medium text-navy-950 shadow-sm ring-1 ring-line"
                        : "text-navy-700 hover:bg-white/70"
                    )}
                  >
                    {c.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Chat pane */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-navy-950 text-white">
              <Bot className="size-4.5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-navy-950">EduWorld Tutor</p>
              <p className="flex items-center gap-1.5 text-xs text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Patient · step-by-step
              </p>
            </div>
          </div>
          {demoProvider && <DemoBadge />}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          {busy && messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              <Loader2 className="mr-2 size-4 animate-spin" /> Loading conversation…
            </div>
          ) : messages.length === 0 ? (
            <div className="mx-auto max-w-xl">
              <div className="text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <Sparkles className="size-7" />
                </span>
                <h2 className="mt-4 text-lg font-bold text-navy-950">Ask me anything you're learning</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  I explain topics step by step, generate practice questions, and
                  help you learn from mistakes — without giving away the answer
                  too early.
                </p>
                {demoProvider && (
                  <p className="mt-4 rounded-xl border border-gold-500/40 bg-gold-100 px-4 py-3 text-[13px] text-gold-700">
                    AI service not configured — replies are demo responses. Add an API key in .env.local to enable the real tutor.
                  </p>
                )}
              </div>
              <div className="mt-8 grid gap-2.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-xl border border-line px-4 py-3 text-left text-sm text-navy-800 transition-colors hover:border-brand-300 hover:bg-brand-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      m.role === "user"
                        ? "rounded-br-sm bg-navy-950 text-white"
                        : "rounded-bl-sm bg-paper text-navy-900"
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-paper px-4 py-3.5">
                    <span className="size-1.5 animate-bounce rounded-full bg-navy-300 [animation-delay:-0.3s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-navy-300 [animation-delay:-0.15s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-navy-300" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {error && (
          <div className="mx-5 mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            <AlertCircle className="size-4 shrink-0" /> {error}
          </div>
        )}

        <div className="border-t border-line p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              aria-label="Message the AI tutor"
              className="input-field"
              maxLength={4000}
              disabled={busy}
            />
            <button type="submit" className="btn-primary !px-4" disabled={busy || !input.trim()} aria-label="Send message">
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </button>
          </form>
          <p className="mt-2.5 text-[11px] text-muted">
            The tutor guides you to understanding — it won't just hand over answers.
          </p>
        </div>
      </div>
    </div>
  );
}
