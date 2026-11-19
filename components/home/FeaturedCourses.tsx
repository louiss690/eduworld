import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CourseCard } from "@/components/courses/CourseCard";
import type { CourseCard as CourseCardType } from "@/services/catalog";

export function FeaturedCourses({ cards }: { cards: CourseCardType[] }) {
  return (
    <section className="bg-paper py-20 lg:py-24" aria-labelledby="courses-heading">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Featured courses</p>
            <h2 id="courses-heading" className="section-title mt-3">
              Start with a course that fits you
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Short, focused courses with lessons, practice and a checkpoint
              quiz in every one. The catalog below is demonstration content —
              real courses will be added by educators.
            </p>
          </div>
          <Link href="/library" className="btn-ghost shrink-0">
            Browse all courses <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card) => (
            <CourseCard key={card.course.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
