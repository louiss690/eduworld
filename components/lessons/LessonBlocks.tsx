import { Lightbulb, PencilLine, TriangleAlert } from "lucide-react";
import type { ContentBlock } from "@/types";

export function LessonBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="prose-edu">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return <h3 key={i}>{block.text}</h3>;
          case "list":
            return block.ordered ? (
              <ol key={i}>{block.items.map((item, j) => <li key={j}>{item}</li>)}</ol>
            ) : (
              <ul key={i}>{block.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
            );
          case "callout":
            return (
              <div
                key={i}
                className={`mb-5 flex gap-3 rounded-xl border px-5 py-4 text-[15px] leading-relaxed ${
                  block.tone === "warning"
                    ? "border-amber-200 bg-amber-50 text-amber-900"
                    : block.tone === "tip"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                      : "border-brand-200 bg-brand-50 text-brand-900"
                }`}
              >
                {block.tone === "warning" ? (
                  <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
                ) : block.tone === "tip" ? (
                  <Lightbulb className="mt-0.5 size-5 shrink-0" aria-hidden />
                ) : (
                  <Lightbulb className="mt-0.5 size-5 shrink-0" aria-hidden />
                )}
                <span>{block.text}</span>
              </div>
            );
          case "example":
            return (
              <div key={i} className="mb-5 rounded-xl border border-line bg-paper px-5 py-4">
                <p className="text-sm font-semibold text-navy-900">Example · {block.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-navy-800">{block.text}</p>
              </div>
            );
          case "exercise":
            return (
              <div key={i} className="mb-5 rounded-xl border border-dashed border-brand-300 bg-brand-50/50 px-5 py-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-brand-800">
                  <PencilLine className="size-4" /> Try it yourself
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-navy-900">{block.prompt}</p>
                {block.hint && (
                  <p className="mt-2 text-sm text-muted">Hint: {block.hint}</p>
                )}
              </div>
            );
          case "paragraph":
          default:
            return <p key={i}>{block.text}</p>;
        }
      })}
    </div>
  );
}
