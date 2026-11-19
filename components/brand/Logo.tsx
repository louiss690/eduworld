import { cn } from "@/lib/utils";

/**
 * EduWorld wordmark. Typography-based, with a minimal mark: an open-book
 * glyph drawn from two arcs. Kept intentionally restrained.
 */
export function Logo({
  className,
  markClassName,
  mark = true,
}: {
  className?: string;
  markClassName?: string;
  mark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {mark && (
        <span
          className={cn(
            "grid size-9 place-items-center rounded-lg bg-navy-950 text-white",
            markClassName
          )}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-5">
            <path
              d="M12 6.5C10 4.8 7.2 4.5 4 4.8v13.4c3.2-.3 6 0 8 1.7 2-1.7 4.8-2 8-1.7V4.8c-3.2-.3-6 0-8 1.7Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M12 6.5v13.4"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M12 9.2c-1.2-1-3-1.3-4.8-1.1M12 12.2c-1.2-1-3-1.3-4.8-1.1"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>
        </span>
      )}
      <span className="text-lg font-bold tracking-tight text-navy-950">
        Edu<span className="text-brand-600">World</span>
      </span>
    </span>
  );
}
