import type { Metadata } from "next";
import { Search, SlidersHorizontal } from "lucide-react";
import { CourseCard } from "@/components/courses/CourseCard";
import { Reveal } from "@/components/ui/Reveal";
import { getDataStore } from "@/services/data";
import { filterCourses, toCourseCards } from "@/services/catalog";

export const metadata: Metadata = {
  title: "Explore Courses",
  description: "Browse the EduWorld learning library by subject, level and topic.",
};

export const dynamic = "force-dynamic";

interface LibrarySearchParams {
  q?: string;
  subject?: string;
  level?: string;
  country?: string;
  language?: string;
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<LibrarySearchParams>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const subjectId = params.subject ?? "";
  const level = params.level ?? "";
  const countryCode = params.country ?? "";

  const store = getDataStore();
  const [subjects, levels, countries, languages, courses] = await Promise.all([
    store.getSubjects(),
    store.getLevels(),
    store.getCountries(),
    store.getLanguages(),
    store.getCourses(),
  ]);

  const filtered = filterCourses(courses, {
    query,
    subjectId: subjectId || undefined,
    level: (level as "beginner" | "intermediate" | "advanced") || undefined,
    countryCode: countryCode || undefined,
  });
  const cards = toCourseCards(filtered);

  return (
    <div>
      {/* Header */}
      <section className="border-b border-line bg-paper">
        <div className="wrap py-12 lg:py-16">
          <p className="eyebrow">Learning library</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
            Explore courses
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted">
            Lessons, videos, practise and downloadable materials, all in one
            place. Filter by subject and level.
          </p>

          <form
            action="/library"
            method="get"
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12"
          >
            <div className="relative lg:col-span-5">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search courses, subjects…"
                className="input-field pl-10"
                aria-label="Search courses"
              />
            </div>
            <select name="subject" defaultValue={subjectId} className="input-field lg:col-span-3" aria-label="Filter by subject">
              <option value="">All subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <select name="level" defaultValue={level} className="input-field lg:col-span-2" aria-label="Filter by level">
              <option value="">All levels</option>
              {levels.map((l) => (
                <option key={l.id} value={l.slug} disabled={!["primary", "lower-secondary", "upper-secondary", "self-directed"].includes(l.slug)}>
                  {l.name}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-primary lg:col-span-2">
              <SlidersHorizontal className="size-4" /> Apply
            </button>
          </form>

          {(countryCode || params.language) && (
            <p className="mt-4 text-sm text-muted">
              <strong className="font-medium text-navy-800">Note:</strong> country and language
              filters are reserved for national-curriculum content, which arrives in a future
              release. English-first content is shown today.
            </p>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="wrap py-12" aria-label="Course results">
        <p className="text-sm text-muted">
          {cards.length} course{cards.length === 1 ? "" : "s"} found
        </p>
        {cards.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card, i) => (
              <Reveal key={card.course.id} delay={(i % 8) * 60} className="h-full">
                <CourseCard card={card} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-line bg-paper px-6 py-14 text-center">
            <p className="font-medium text-navy-900">No courses match your filters.</p>
            <p className="mt-1.5 text-sm text-muted">Try clearing the search or choosing another subject.</p>
          </div>
        )}
      </section>
    </div>
  );
}
