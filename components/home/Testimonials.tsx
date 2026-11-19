import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Sample testimonials — clearly labelled as placeholders until real learner
 * stories are collected. They are presented as "sample" content, not as
 * genuine user reviews.
 */
const TESTIMONIALS = [
  {
    quote:
      "I used to think algebra was impossible. The step-by-step lessons and the tutor's questions made it finally make sense.",
    name: "Sample testimonial · Amina, 16",
  },
  {
    quote:
      "Being able to study before work, on my phone, and pick up exactly where I left off changed everything for me.",
    name: "Sample testimonial · Miguel, 24",
  },
  {
    quote:
      "The explanations are clear and the quizzes actually show me what I still need to practise. It feels personal.",
    name: "Sample testimonial · Ama, 19",
  },
];

export function Testimonials() {
  return (
    <section className="bg-paper py-20 lg:py-24" aria-labelledby="testimonials-heading">
      <div className="wrap">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Learner stories</p>
          <h2 id="testimonials-heading" className="section-title mt-3">
            What learners say
          </h2>
          <p className="mt-4 text-sm text-muted">
            These are sample testimonials shown until real community stories are collected.
          </p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} as="li" delay={i * 110}>
              <div className="card lift flex h-full flex-col p-7 hover:shadow-md">
                <Quote className="size-6 text-brand-200" aria-hidden />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-navy-800">
                  “{t.quote}”
                </blockquote>
              <footer className="mt-6 border-t border-line pt-4">
                <p className="text-sm font-semibold text-navy-950">{t.name}</p>
              </footer>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
