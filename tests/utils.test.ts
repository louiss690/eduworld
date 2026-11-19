import { describe, expect, it } from "vitest";
import { formatDurationMinutes, initials, slugify } from "@/lib/utils";

describe("formatDurationMinutes", () => {
  it("formats minutes and hours", () => {
    expect(formatDurationMinutes(15)).toBe("15 min");
    expect(formatDurationMinutes(60)).toBe("1 hr");
    expect(formatDurationMinutes(75)).toBe("1 hr 15 min");
  });
});

describe("initials", () => {
  it("builds initials from a name", () => {
    expect(initials("Amina Okoye")).toBe("AO");
    expect(initials("Sofia")).toBe("S");
  });
});

describe("slugify", () => {
  it("slugifies text", () => {
    expect(slugify("Algebra Foundations!")).toBe("algebra-foundations");
    expect(slugify("English for Academic Writing")).toBe("english-for-academic-writing");
  });
});
