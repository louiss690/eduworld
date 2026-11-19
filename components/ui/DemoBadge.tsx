import { FlaskConical } from "lucide-react";
import { demoLabelEnabled } from "@/lib/env";

/**
 * Small, honest marker shown when the app runs on demo data (no Supabase /
 * AI keys configured). Keeps demo content clearly labelled.
 */
export function DemoBadge({ className }: { className?: string }) {
  if (!demoLabelEnabled()) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-100 px-2.5 py-1 text-xs font-medium text-gold-700 ${className ?? ""}`}
      title="Running on built-in demonstration data. Connect Supabase and an AI provider in .env.local for the production experience."
    >
      <FlaskConical className="size-3.5" aria-hidden />
      Demo mode
    </span>
  );
}
