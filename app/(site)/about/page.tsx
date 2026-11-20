import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Globe2, HeartHandshake, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Why EduWorld exists: making quality education accessible to every learner, everywhere.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-line bg-paper">
        <div className="wrap py-14 lg:py-20">
          <p className="eyebrow">About EduWorld</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
            Education Without Borders. Knowledge Without Limits.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            EduWorld is an international learning platform built on a simple
            belief: where you are born should never decide what you can learn.
          </p>
        </div>
      </section>

      <section className="wrap grid grid-cols-1 gap-12 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <h2 className="text-2xl font-bold text-navy-950">Our mission</h2>
          <p className="mt-4 text-base leading-relaxed text-ink/90">
            <strong className="font-semibold text-navy-900">
              "Making quality education accessible to every learner, everywhere."
            </strong>
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/90">
            We are building a global educational ecosystem that helps students
            learn, develop skills and find opportunity, regardless of country,
            financial background, language or access to resources. Our platform
            pairs structured courses with AI-powered personal support, and we
            design every part of it to work on modest devices and slow
            connections.
          </p>
          <ul className="mt-8 space-y-5">
            {[
              { icon: Target, title: "Quality for everyone", text: "Clear, standards-aligned lessons with practice built in." },
              { icon: Globe2, title: "Inclusive by design", text: "Multilingual content, offline access and accessible interfaces." },
              { icon: HeartHandshake, title: "Educator-first", text: "Tools that help teachers reach more students, not replace them." },
            ].map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-navy-950">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src="/images/photos/study-group.jpg" alt="Students learning together" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="card p-5 text-center">
              <p className="text-3xl font-bold text-navy-950">10+</p>
              <p className="mt-1 text-[13px] text-muted">Subjects live today</p>
            </div>
            <div className="card p-5 text-center">
              <p className="text-3xl font-bold text-navy-950">8+</p>
              <p className="mt-1 text-[13px] text-muted">Languages on the roadmap</p>
            </div>
          </div>
        </div>
      </section>

      <section id="accessibility" className="border-t border-line bg-paper">
        <div className="wrap py-14 lg:py-20">
          <h2 className="text-2xl font-bold text-navy-950">Accessible by principle</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            We minimise personal data collection, design for keyboard and screen
            readers, keep layouts readable on small screens, and provide offline
            learning so connectivity gaps never pause education. Country-based
            curricula arrive subject by subject, starting with English-language
            content.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/library" className="btn-primary">Explore courses <ArrowRight className="size-4" /></Link>
            <Link href="/tutor" className="btn-secondary">Try the AI tutor</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
