import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { getDataStore } from "@/services/data";

export const metadata: Metadata = {
  title: "Subjects",
  description: "Explore the subjects taught on EduWorld.",
};

export const dynamic = "force-dynamic";

export default async function SubjectsPage() {
  const store = getDataStore();
  const [subjects, courses] = await Promise.all([store.getSubjects(), store.getCourses()]);

  return (
    <div className="wrap py-14 lg:py-20">
      <div className="max-w-2xl">
        <p className="eyebrow">Subjects</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
          Choose a subject
        </h1>
        <p className="mt-4 text-base text-muted">
          Mathematics to business, history to programming. Each subject hosts
          courses, lessons and practise materials.
        </p>
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => {
          const courseCount = courses.filter((c) => c.subjectId === subject.id).length;
          return (
            <li key={subject.id}>
              <Link
                href={`/subjects/${subject.slug}`}
                className="card group block overflow-hidden transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/8] bg-navy-100">
                  {subject.imageUrl ? (
                    <Image
                      src={subject.imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="grid size-full place-items-center text-navy-300">
                      <BookOpen className="size-10" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-navy-950">{subject.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{subject.description}</p>
                  <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                    {courseCount} course{courseCount === 1 ? "" : "s"} available
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
