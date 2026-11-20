import { Accessibility, Download, Globe2, Languages, Sparkles, UserRound } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const ITEMS = [
  {
    icon: Globe2,
    title: "Without geographical boundaries",
    text: "Wherever there is an internet connection, there is EduWorld.",
  },
  {
    icon: Languages,
    title: "Multilingual education",
    text: "English today, French, Spanish, Portuguese, Arabic, Swahili and Twi coming.",
  },
  {
    icon: Download,
    title: "Offline learning",
    text: "Download lessons and materials, and keep learning without a connection.",
  },
  {
    icon: Sparkles,
    title: "Personalized learning",
    text: "Adjustable pace, AI support and recommendations matched to your level.",
  },
  {
    icon: UserRound,
    title: "Accessible resources",
    text: "Clear layouts, readable typography and keyboard-friendly controls.",
  },
  {
    icon: Accessibility,
    title: "Built for everyone",
    text: "We design for learners of all abilities and keep personal data minimal.",
  },
];

export function AccessibilitySection() {
  return (
    <section className="py-20 lg:py-24" aria-labelledby="access-heading">
      <div className="wrap">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Learning without barriers</p>
          <h2 id="access-heading" className="section-title mt-3">
            Education should fit your life
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            EduWorld is designed so that your country, language, devices and
            circumstances never stand between you and learning.
          </p>
        </Reveal>

        <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => (
            <Reveal key={item.title} as="li" delay={(i % 3) * 90}>
              <div className="card lift h-full p-7 hover:shadow-md">
                <span className="grid size-11 place-items-center rounded-lg bg-navy-50 text-navy-800 transition-colors duration-200 group-hover:bg-brand-50 group-hover:text-brand-700">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold text-navy-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
