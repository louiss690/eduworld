import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, FlaskConical } from "lucide-react";
import type { CourseCard as CourseCardType } from "@/services/catalog";
import { formatDurationMinutes } from "@/lib/utils";

export function CourseCard({ card }: { card: CourseCardType }) {
  const { course, subject, lessonCount, durationMinutes } = card;
  const href = `/courses/${course.slug}`;

  return (
    <article className="card lift group flex h-full flex-col overflow-hidden hover:shadow-md">
      <Link href={href} className="relative block aspect-[16/9] overflow-hidden bg-navy-100">
        {course.imageUrl ? (
          <Image
            src={course.imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="grid size-full place-items-center text-navy-300">
            <FlaskConical className="size-10" />
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="badge bg-surface1/95">{course.level}</span>
          {course.isDemo && <span className="badge-gold">Demo</span>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {subject && (
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{subject.name}</p>
        )}
        <h3 className="mt-1.5 text-lg font-semibold leading-snug text-navy-950">
          <Link href={href} className="hover:text-brand-700">{course.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{course.description}</p>

        <div className="mt-4 flex items-center gap-4 text-[13px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="size-4" /> {lessonCount} lessons
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" /> {formatDurationMinutes(durationMinutes)}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2.5 border-t border-line pt-4">
          <span className="grid size-8 place-items-center rounded-full bg-navy-100 text-xs font-bold text-navy-800">
            {course.instructor.name.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-navy-900">{course.instructor.name}</p>
            <p className="truncate text-xs text-muted">{course.instructor.title}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
