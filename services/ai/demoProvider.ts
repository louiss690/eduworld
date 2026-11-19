import type { AIProvider, TutorRequest, TutorResponse } from "./types";

/**
 * DemoProvider — a local, rule-based stand-in used when no AI provider key
 * is configured. It is deliberately humble: it coaches with honest, generic
 * scaffolding and ALWAYS marks its output as a demo response. It never
 * pretends to be a real model.
 */
export class DemoProvider implements AIProvider {
  id = "demo";
  name = "Demo tutor (built-in)";

  get configured(): boolean {
    return false;
  }

  async chat(request: TutorRequest): Promise<TutorResponse> {
    const message = request.message.trim();
    const lower = message.toLowerCase();

    let reply: string;

    if (/^(hi|hello|hey|good (morning|afternoon|evening))\b/.test(lower)) {
      reply =
        "Hello! I'm EduWorld's demo tutor. I can help you break down questions, explain ideas step by step, or suggest practice. " +
        "Note: I'm running in demo mode — connect an AI provider key in .env.local to talk to a real model.";
    } else if (
      /\b(algebra|equation|solve for x|simplify|math)\b/.test(lower) ||
      /[+\-*/=]/.test(message) && /\d/.test(message)
    ) {
      reply =
        "Let's work through it together. \n\n1. Write down what you know: which values and operations appear in the problem?\n" +
        "2. Choose the inverse operation to isolate the unknown — if something is added, subtract it from both sides.\n" +
        "3. Do the same operation on both sides of the equation to keep it balanced.\n" +
        "4. Check your answer by substituting it back in.\n\n" +
        "Try that, and tell me what you get — I'll help you correct it. (Demo response — the connected AI tutor will give richer coaching.)";
    } else if (/\b(python|code|program|function|loop|print)\b/.test(lower)) {
      reply =
        "Great question about programming! Let's break it into steps:\n\n1. State the task in plain words.\n" +
        "2. Identify the steps the computer must perform, in order.\n" +
        "3. Write one instruction per step, checking the syntax (colons, indentation, parentheses).\n" +
        "4. Run it and read the error message carefully — it usually tells you the line to look at.\n\n" +
        "Show me your code or the error you're seeing, and I'll guide you. (Demo response — the connected AI tutor will give richer coaching.)";
    } else if (/\b(quiz|test|practice|exercise|question)\b/.test(lower)) {
      reply =
        "Practice is the fastest way to learn. Try this:\n\n1. Explain the idea aloud in your own words.\n" +
        "2. Attempt 3–5 short exercises on the topic.\n" +
        "3. Mark what tripped you up, then reread that part of the lesson.\n\n" +
        "Ask me about a specific topic and I'll suggest a practice question. (Demo response — the connected AI tutor can generate tailored questions.)";
    } else if (/thank/.test(lower)) {
      reply = "You're very welcome! Keep going — every step counts. (Demo response)";
    } else if (/(\?|why|how|what|explain|help|understand|\bstuck\b)/.test(lower)) {
      reply =
        "Let's unpack that together:\n\n1. Can you tell me what you already understand about this?\n" +
        "2. What exactly is the confusing part — the words, the steps, or the big picture?\n" +
        "3. Let's try a small example first, then build up.\n\n" +
        "Share your attempt and I'll take it from there. (Demo response — the connected AI tutor will give a fully tailored explanation.)";
    } else {
      reply =
        "I'm glad you asked! Let's approach it step by step.\n\n" +
        "1. Restate the problem in your own words.\n" +
        "2. Break it into the smallest pieces you can.\n" +
        "3. Try the first piece, then tell me where you got stuck.\n\n" +
        "This is a demo response — connect an AI provider in .env.local for a fully generated explanation.";
    }

    return { content: reply, isDemo: true, model: "demo-local" };
  }
}
