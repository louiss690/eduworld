import Link from "next/link";
import { Bot, ChevronRight, Lightbulb, Send, Target } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/ui/Reveal";

const FEATURES = [
  {
    icon: Lightbulb,
    title: "Explains any topic",
    text: "Stuck on a concept? Ask, and get a clear, patient explanation.",
  },
  {
    icon: Target,
    title: "Practises with you",
    text: "Generates practice questions and checks your answers step by step.",
  },
];

export function AITutorSection() {
  return (
    <section id="ai-tutor" className="bg-navy-950 py-20 text-white lg:py-24">
      <div className="wrap grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-300">
            AI Tutor
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Meet your personal AI learning companion
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-200">
            EduWorld&apos;s AI tutor helps you understand difficult topics, answer
            questions, and practise until it clicks. It never just hands you the
            answer — it coaches you to find it yourself.
          </p>

          <ul className="mt-8 space-y-5">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} as="li" delay={i * 100} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/10 text-brand-200">
                  <f.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-semibold text-white">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy-300">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Link href="/tutor" className="btn-primary mt-9 btn-lg lift">
            <Bot className="size-4" /> Try the AI Tutor
          </Link>
        </Reveal>

        {/* Chat preview — a static, honest mock of the tutor interface */}
        <Reveal delay={150} className="relative">
          <div className="anim-float card overflow-hidden bg-white !text-ink">
            <div className="flex items-center gap-3 border-b border-line bg-paper px-5 py-3.5">
              <span className="grid size-9 place-items-center rounded-full bg-navy-950 text-white">
                <Bot className="size-4.5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy-950">EduWorld Tutor</p>
                <p className="text-xs text-emerald-600">● Ready to help</p>
              </div>
            </div>

            <div className="space-y-4 px-5 py-6">
              <p className="rounded-xl rounded-tl-sm bg-paper px-4 py-3 text-sm text-navy-800">
                I can&apos;t solve this equation: <span className="font-medium">3x + 2 = 14</span>. Can you help?
              </p>
              <div className="ml-6 rounded-xl rounded-tr-sm bg-brand-600 px-4 py-3 text-sm text-white">
                <p>
                  Of course! Let&apos;s break it into steps. First, what happens if we
                  subtract 2 from both sides?
                </p>
                <p className="mt-2.5 inline-flex items-center gap-1 text-xs text-brand-100">
                  1 of 3 steps <ChevronRight className="size-3" />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-line px-4 py-3">
              <span className="flex-1 rounded-lg border border-line px-3.5 py-2.5 text-sm text-muted">
                Ask a question…
              </span>
              <span className="grid size-10 place-items-center rounded-lg bg-brand-600 text-white">
                <Send className="size-4" />
              </span>
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/10 bg-navy-900 px-4 py-2 text-[13px] text-navy-200 shadow-lg sm:block">
            <Logo mark={false} className="[&_span]:text-white [&_span]:text-sm" />
            {" "}· Patient, step-by-step coaching
          </div>
        </Reveal>
      </div>
    </section>
  );
}
