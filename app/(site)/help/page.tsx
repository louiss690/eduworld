import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Centre",
  description: "Frequently asked questions about EduWorld.",
};

const FAQS = [
  {
    q: "Is EduWorld free?",
    a: "Core courses, lessons and the AI tutor are free. We will keep core learning free forever as part of our mission; optional premium features may arrive later.",
  },
  {
    q: "Do I need an account to learn?",
    a: "You can browse subjects and courses without an account. Create a free account to enroll, save progress, take quizzes and use the AI tutor.",
  },
  {
    q: "How do I use the AI tutor?",
    a: "Sign in and open AI Tutor from the navigation. Ask a question or pick a suggested prompt. The tutor coaches step by step; it doesn't just hand over answers.",
  },
  {
    q: "Can I learn offline?",
    a: "Yes. Visit a course or lesson once while online and it becomes available offline through the service worker. You'll also see an offline banner when connectivity drops.",
  },
  {
    q: "Which languages are available?",
    a: "Content is English-first today. French, Spanish, Portuguese, Arabic, Swahili and Twi are on the roadmap — your preferred language tells us where to focus.",
  },
  {
    q: "What does 'Demo content' mean?",
    a: "Courses marked Demo are starter content shipped with the platform to demonstrate the experience. Educators will publish real courses on top of them.",
  },
];

export default function HelpPage() {
  return (
    <div className="wrap py-14 lg:py-20">
      <div className="max-w-2xl">
        <p className="eyebrow">Help Centre</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
          How can we help?
        </h1>
        <p className="mt-4 text-base text-muted">
          Answers to common questions. Still stuck?{" "}
          <Link href="/contact" className="font-semibold text-brand-700 hover:text-brand-800">Contact us</Link>.
        </p>
      </div>

      <div className="mt-10 max-w-3xl space-y-4">
        {FAQS.map((faq) => (
          <details key={faq.q} className="card px-6 py-5">
            <summary className="cursor-pointer font-semibold text-navy-950">{faq.q}</summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
