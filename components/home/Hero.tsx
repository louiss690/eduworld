import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="wrap grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="eyebrow">A global learning platform</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.12] tracking-tight text-navy-950 sm:text-5xl xl:text-[3.5rem]">
            Learning opens doors.{" "}
            <span className="text-brand-600">Let&apos;s open them together.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Discover quality educational resources, develop new skills and
            receive personalized learning support with EduWorld. Wherever you
            are, your learning journey starts here.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/library" className="btn-primary btn-lg">
              Explore Courses <ArrowRight className="size-4" />
            </Link>
            <Link href="/tutor" className="btn-secondary btn-lg">
              <Sparkles className="size-4 text-brand-600" /> Meet Your AI Tutor
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
            <div>
              <dt className="text-2xl font-bold text-navy-950">10+</dt>
              <dd className="mt-1 text-[13px] text-muted">Subjects to explore</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-navy-950">30+</dt>
              <dd className="mt-1 text-[13px] text-muted">Lessons & activities</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-navy-950">100%</dt>
              <dd className="mt-1 text-[13px] text-muted">Free core learning</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-navy-100 shadow-[0_20px_60px_-20px_rgba(14,24,48,0.35)]">
            <Image
              src="/images/photos/hero-students.jpg"
              alt="Students from different countries learning together"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-5 hidden rounded-xl border border-line bg-white px-4 py-3 shadow-lg sm:block">
            <p className="text-sm font-semibold text-navy-950">Learn anywhere, anytime</p>
            <p className="mt-0.5 text-[13px] text-muted">Offline access included</p>
          </div>
        </div>
      </div>
    </section>
  );
}
