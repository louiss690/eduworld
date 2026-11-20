import Link from "next/link";
import {
  BookOpen,
  Briefcase,
  Calculator,
  Code2,
  Cpu,
  FlaskConical,
  Landmark,
  Map,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import type { Subject } from "@/types";
import { Reveal } from "@/components/ui/Reveal";

const ICONS: Record<string, typeof BookOpen> = {
  calculator: Calculator,
  "flask-conical": FlaskConical,
  "book-open": BookOpen,
  "code-2": Code2,
  landmark: Landmark,
  map: Map,
  "trending-up": TrendingUp,
  "message-square": MessageSquare,
  cpu: Cpu,
  briefcase: Briefcase,
};

export function SubjectsSection({ subjects }: { subjects: Subject[] }) {
  return (
    <section className="py-20 lg:py-24" aria-labelledby="subjects-heading">
      <div className="wrap">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Popular subjects</p>
          <h2 id="subjects-heading" className="section-title mt-3">
            Find a subject that moves you
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Ten foundational subjects, taught with clarity and care. Start
            anywhere, your pace, your level.
          </p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {subjects.map((subject, i) => {
            const Icon = ICONS[subject.iconKey] ?? BookOpen;
            return (
              <Reveal key={subject.id} as="li" delay={i * 55}>
                <Link
                  href={`/subjects/${subject.slug}`}
                  className="card lift group flex h-full flex-col p-5 hover:shadow-md"
                >
                  <span className="grid size-11 place-items-center rounded-lg bg-navy-50 text-navy-800 transition-colors duration-200 group-hover:bg-brand-50 group-hover:text-brand-700">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-navy-950">{subject.name}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                    {subject.shortDescription}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
