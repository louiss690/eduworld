import { Quote } from "lucide-react";

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
    place: "Nairobi, Kenya",
  },
  {
    quote:
      "Being able to study before work, on my phone, and pick up exactly where I left off changed everything for me.",
    name: "Sample testimonial · Miguel, 24",
    place: "São Paulo, Brazil",
  },
  {
    quote:
      "The explanations are clear and the quizzes actually show me what I still need to practise. It feels personal.",
    name: "Sample testimonial · Ama, 19",
    place: "Accra, Ghana",
  },
];

export function Testimonials() {
  return (
    <section className="bg-paper py-20 lg:py-24" aria-labelledby="testimonials-heading">
      <div className="wrap">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Learner stories</p>
          <h2 id="testimonials-heading" className="section-title mt-3">
            What learners say
          </h2>
          <p className="mt-4 text-sm text-muted">
            These are sample testimonials shown until real community stories are collected.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <li key={t.name} className="card flex flex-col p-7">
              <Quote className="size-6 text-brand-200" aria-hidden />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-navy-800">
                “{t.quote}”
              </blockquote>
              <footer className="mt-6 border-t border-line pt-4">
                <p className="text-sm font-semibold text-navy-950">{t.name}</p>
                <p className="mt-0.5 text-[13px] text-muted">{t.place}</p>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
