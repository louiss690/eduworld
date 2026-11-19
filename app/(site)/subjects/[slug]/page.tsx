import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CourseCard } from "@/components/courses/CourseCard";
import { Reveal } from "@/components/ui/Reveal";
import { getDataStore } from "@/services/data";
import { toCourseCards } from "@/services/catalog";

export const dynamic = "force-dynamic";

interface SubjectPageParams {
  slug: string;
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<SubjectPageParams>;
}) {
  const { slug } = await params;
  const store = getDataStore();
  const subjects = await store.getSubjects();
  const subject = subjects.find((s) => s.slug === slug);
  if (!subject) notFound();

  const courses = await store.getCourses();
  const cards = toCourseCards(courses.filter((c) => c.subjectId === subject.id));

  return (
    <div>
      <section className="border-b border-line bg-paper">
        <div className="wrap grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[1fr_420px] lg:py-16">
          <div>
            <p className="eyebrow">Subject</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              {subject.name}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              {subject.description}
            </p>
          </div>
          {subject.imageUrl && (
            <div className="relative hidden aspect-[16/10] overflow-hidden rounded-2xl lg:block">
              <Image
                src={subject.imageUrl}
                alt=""
                fill
                sizes="420px"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      <section className="wrap py-12" aria-label={`${subject.name} courses`}>
        <h2 className="text-xl font-bold text-navy-950">Courses in {subject.name}</h2>
        {cards.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, i) => (
              <Reveal key={card.course.id} delay={i * 70} className="h-full">
                <CourseCard card={card} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-dashed border-line bg-paper px-6 py-10 text-sm text-muted">
            No courses in this subject yet — check back soon.
          </p>
        )}
      </section>
    </div>
  );
}
