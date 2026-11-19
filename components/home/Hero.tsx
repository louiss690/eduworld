import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="wrap grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="eyebrow hero-anim" style={{ animationDelay: "60ms" }}>
            A global learning platform
          </p>
          <h1
            className="mt-4 text-4xl font-bold leading-[1.12] tracking-tight text-navy-950 hero-anim sm:text-5xl xl:text-[3.5rem]"
            style={{ animationDelay: "140ms" }}
          >
            Learning opens doors.{" "}
            <span className="text-brand-600">Let&apos;s open them together.</span>
          </h1>
          <p
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted hero-anim"
            style={{ animationDelay: "220ms" }}
          >
            Discover quality educational resources, develop new skills and
            receive personalized learning support with EduWorld. Wherever you
            are, your learning journey starts here.
          </p>
          <div
            className="mt-9 flex flex-col gap-3 hero-anim sm:flex-row"
            style={{ animationDelay: "300ms" }}
          >
            <Link href="/library" className="btn-primary btn-lg lift">
              Explore Courses <ArrowRight className="size-4" />
            </Link>
            <Link href="/tutor" className="btn-secondary btn-lg lift">
              <Sparkles className="size-4 text-brand-600" /> Meet Your AI Tutor
            </Link>
          </div>
          <dl
            className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8 hero-anim"
            style={{ animationDelay: "380ms" }}
          >
            <div>
              <dt className="text-2xl font-bold tabular-nums text-navy-950">
                <CountUp value={10} suffix="+" />
              </dt>
              <dd className="mt-1 text-[13px] text-muted">Subjects to explore</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold tabular-nums text-navy-950">
                <CountUp value={30} suffix="+" />
              </dt>
              <dd className="mt-1 text-[13px] text-muted">Lessons & activities</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold tabular-nums text-navy-950">
                <CountUp value={100} suffix="%" />
              </dt>
              <dd className="mt-1 text-[13px] text-muted">Free core learning</dd>
            </div>
          </dl>
        </div>

        <div className="relative hero-anim" style={{ animationDelay: "260ms" }}>
          <div className="relative anim-float">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-navy-100 shadow-[0_20px_60px_-20px_rgba(14,24,48,0.35)]">
              <Image
                src="/images/photos/hero-students.jpg"
                alt="Students from different countries learning together"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
          </div>
          <div className="absolute -bottom-5 left-5 hidden rounded-xl border border-line bg-white px-4 py-3 shadow-lg hero-anim sm:block" style={{ animationDelay: "480ms" }}>
            <p className="text-sm font-semibold text-navy-950">Learn anywhere, anytime</p>
            <p className="mt-0.5 text-[13px] text-muted">Offline access included</p>
          </div>
        </div>
      </div>
    </section>
  );
}
