import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

/**
 * A world of learners — authentic learners drawn from many countries and
 * backgrounds, because EduWorld belongs to every student.
 */
const LEARNERS = [
  {
    src: "/images/photos/global-learners-1-v3.jpg",
    alt: "A learner studying",
  },
  {
    src: "/images/photos/global-learners-2.jpg",
    alt: "A student collaborating on study work with a laptop",
  },
  {
    src: "/images/photos/global-learners-3.jpg",
    alt: "A diverse group of students working together with technology",
  },
  {
    src: "/images/photos/study-group.jpg",
    alt: "Two students from different backgrounds studying side by side",
  },
];

export function GlobalLearners() {
  return (
    <section className="border-t border-line bg-white py-20 lg:py-24" aria-labelledby="learners-heading">
      <div className="wrap">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">A world of learners</p>
          <h2 id="learners-heading" className="section-title mt-3">
            Students everywhere, learning together
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            EduWorld is built for students everywhere. Our imagery reflects the
            real, diverse community we serve.
          </p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
          {LEARNERS.map((learner, i) => (
            <Reveal key={learner.src} as="li" delay={i * 90}>
              <figure className="group overflow-hidden rounded-2xl bg-surface2">
                <div className="relative aspect-[9/16] overflow-hidden">
                  <Image
                    src={learner.src}
                    alt={learner.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                </div>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
