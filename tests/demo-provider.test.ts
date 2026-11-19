import { describe, expect, it } from "vitest";
import { DemoProvider } from "@/services/ai/demoProvider";

describe("DemoProvider", () => {
  const provider = new DemoProvider();

  it("is never configured", () => {
    expect(provider.configured).toBe(false);
  });

  it("returns demo-labelled coaching responses", async () => {
    const res = await provider.chat({ message: "Explain algebra", history: [] });
    expect(res.isDemo).toBe(true);
    expect(res.content.length).toBeGreaterThan(40);
  });

  it("responds to greetings warmly", async () => {
    const res = await provider.chat({ message: "Hello!", history: [] });
    expect(res.content.toLowerCase()).toContain("hello");
  });

  it("always coaches rather than giving away answers", async () => {
    const res = await provider.chat({ message: "What is 2 + 2?", history: [] });
    expect(res.content.toLowerCase()).not.toMatch(/^4$/);
    // Coaching format: numbered steps and an invitation to try.
    expect(res.content).toMatch(/\n1\./);
    expect(res.content.toLowerCase()).toMatch(/try|tell me/i);
  });
});
