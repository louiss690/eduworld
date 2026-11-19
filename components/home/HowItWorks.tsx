import { BookOpenCheck, Search, UserPlus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
  {
    icon: UserPlus,
    title: "Create your account",
    text: "Sign up free in under a minute. Tell us your level and language preference so we can personalise your experience.",
  },
  {
    icon: Search,
    title: "Discover learning resources",
    text: "Browse courses by subject, level or topic. Find lessons, videos, exercises and downloadable materials that suit you.",
  },
  {
    icon: BookOpenCheck,
    title: "Learn, practise and track progress",
    text: "Study at your own pace, check your understanding with quizzes, and watch your progress grow on your dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-24" aria-labelledby="how-heading">
      <div className="wrap">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">How EduWorld works</p>
          <h2 id="how-heading" className="section-title mt-3">
            Learning, made simple
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Three steps between you and your next skill.
          </p>
        </Reveal>

        <ol className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} as="li" delay={i * 120} className="relative">
              <div className="card lift h-full p-7 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-200 group-hover:bg-brand-100">
                    <step.icon className="size-6" aria-hidden />
                  </span>
                  <span className="text-4xl font-bold text-navy-100">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-navy-950">{step.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
